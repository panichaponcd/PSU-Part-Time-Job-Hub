import logging
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.config import LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, LINE_GROUP_ID, PUBLIC_WEB_URL
from app.database import get_db
from app.dependencies import require_admin
from app.models.job import Job
from app.models.user import User
from app.utils.line_messaging import (
    build_jobs_carousel,
    build_quick_reply,
    push_job_announcement,
    reply_line_messages,
    verify_line_signature,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/line", tags=["LINE Messaging"])


@router.get("/status/")
@router.get("/status", include_in_schema=False)
def line_status(_: User = Depends(require_admin)):
    configured = bool(LINE_CHANNEL_ACCESS_TOKEN)
    mode = "unconfigured"
    if configured:
        mode = "group" if LINE_GROUP_ID else "broadcast"
    return {
        "configured": configured,
        "webhook_configured": bool(LINE_CHANNEL_SECRET),
        "has_group_id": bool(LINE_GROUP_ID),
        "mode": mode,
    }


@router.post("/announce/{job_id}/")
@router.post("/announce/{job_id}", include_in_schema=False)
def announce_job_to_line(
    job_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    result = push_job_announcement(job)
    if not result["sent"]:
        code = (
            status.HTTP_503_SERVICE_UNAVAILABLE
            if result["mode"] == "unconfigured"
            else status.HTTP_502_BAD_GATEWAY
        )
        raise HTTPException(status_code=code, detail=result["detail"])

    return result


@router.post("/webhook/")
@router.post("/webhook", include_in_schema=False)
async def line_webhook(
    request: Request,
    x_line_signature: str = Header(None, alias="X-Line-Signature"),
    db: Session = Depends(get_db),
):
    body = await request.body()

    # Verify HMAC-SHA256 signature from LINE Platform
    if not verify_line_signature(body, x_line_signature):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid LINE webhook signature.",
        )

    payload = await request.json()
    events = payload.get("events", [])

    # LINE Console sends an empty events[] array when clicking "Verify"
    if not events:
        return {"status": "ok"}

    for event in events:
        event_type = event.get("type")
        reply_token = event.get("replyToken")
        source = event.get("source", {})
        source_type = source.get("type")  # "user" | "group" | "room"

        # 1. Bot joined a LINE Group -> reply with Group ID for 5-second setup
        if event_type == "join" and source_type == "group":
            group_id = source.get("groupId", "")
            logger.info("LINE Bot joined groupId: %s", group_id)
            print(f"[LINE WEBHOOK] Joined LINE Group! LINE_GROUP_ID={group_id}", flush=True)
            reply_line_messages(
                reply_token,
                [
                    {
                        "type": "text",
                        "text": (
                            "Hello! PSU Part-Time Job Hub Bot is ready for this group.\n\n"
                            f"Group ID:\n{group_id}\n\n"
                            "Paste this into LINE_GROUP_ID in your server .env to receive automatic job announcements here."
                        ),
                    }
                ],
            )
            continue

        # 2. Text message events
        if event_type == "message" and event.get("message", {}).get("type") == "text":
            text_msg = event["message"].get("text", "").strip()
            lower_msg = text_msg.lower()

            # Group command helper: !groupid
            if source_type == "group":
                if lower_msg in ("!groupid", "/groupid", "!setup"):
                    group_id = source.get("groupId", "")
                    print(f"[LINE WEBHOOK] Group ID requested: LINE_GROUP_ID={group_id}", flush=True)
                    reply_line_messages(
                        reply_token,
                        [{"type": "text", "text": f"LINE_GROUP_ID={group_id}"}],
                    )
                continue

            # 1-on-1 Student Self-Service Chatbot (0 quota — Unlimited!)
            if source_type == "user":
                if any(k in lower_msg for k in ("top", "high", "pay", "เงิน", "สูงสุด")):
                    jobs = (
                        db.query(Job)
                        .filter(Job.is_active == True, Job.status == "OPEN")
                        .order_by(desc(Job.compensation_amount), desc(Job.created_at))
                        .limit(5)
                        .all()
                    )
                    alt_text = "Top Paying PSU Part-Time Jobs"
                else:
                    jobs = (
                        db.query(Job)
                        .filter(Job.is_active == True, Job.status == "OPEN")
                        .order_by(desc(Job.created_at))
                        .limit(5)
                        .all()
                    )
                    alt_text = "Latest Open PSU Part-Time Jobs"

                if not jobs:
                    reply_line_messages(
                        reply_token,
                        [
                            {
                                "type": "text",
                                "text": f"There are currently no open campus shifts. Check back soon at {PUBLIC_WEB_URL}/jobs",
                                "quickReply": build_quick_reply(),
                            }
                        ],
                    )
                else:
                    carousel_msg = build_jobs_carousel(jobs, alt_text=alt_text)
                    carousel_msg["quickReply"] = build_quick_reply()
                    reply_line_messages(reply_token, [carousel_msg])

    return {"status": "ok"}
