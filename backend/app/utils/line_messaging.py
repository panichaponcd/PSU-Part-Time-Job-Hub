import base64
import hashlib
import hmac
import logging
from typing import Any, Dict, List, Optional
import requests
from app.config import (
    LINE_CHANNEL_ACCESS_TOKEN,
    LINE_CHANNEL_SECRET,
    LINE_GROUP_ID,
    PUBLIC_WEB_URL,
)
from app.models.job import Job

logger = logging.getLogger(__name__)

LINE_API_BASE = "https://api.line.me/v2/bot/message"
LINE_TIMEOUT_SECONDS = 10


def verify_line_signature(body: bytes, signature: Optional[str]) -> bool:
    """Cryptographically verify the X-Line-Signature header using HMAC-SHA256."""
    if not LINE_CHANNEL_SECRET or not signature:
        return False
    digest = hmac.new(
        LINE_CHANNEL_SECRET.encode("utf-8"),
        body,
        hashlib.sha256,
    ).digest()
    expected = base64.b64encode(digest).decode("utf-8")
    return hmac.compare_digest(expected, signature)


def _format_job_date(job: Job) -> str:
    if job.schedules:
        first = sorted(job.schedules, key=lambda s: (s.date, s.start_time))[0]
        date_str = first.date.strftime("%d %b %Y")
        start_str = first.start_time.strftime("%H:%M")
        end_str = first.end_time.strftime("%H:%M")
        extra = f" (+{len(job.schedules) - 1} more)" if len(job.schedules) > 1 else ""
        return f"{date_str} • {start_str}-{end_str}{extra}"
    return f"Term {job.academic_term}/{job.academic_year}"


def build_job_flex_bubble(job: Job) -> Dict[str, Any]:
    """Build a PSU-branded LINE Flex Message Bubble for a campus job."""
    allowance = f"฿{float(job.compensation_amount):,.0f} / Shift"
    applicants = job.applicants_count
    required = job.required_amount
    seats_left = max(0, required - applicants)
    seats_text = (
        f"{seats_left} of {required} seats open"
        if seats_left > 0
        else f"Full ({applicants}/{required})"
    )
    job_url = f"{PUBLIC_WEB_URL}/jobs/{job.id}"
    status_color = "#10B981" if job.status == "OPEN" and seats_left > 0 else "#64748B"

    bubble: Dict[str, Any] = {
        "type": "bubble",
        "size": "mega",
        "header": {
            "type": "box",
            "layout": "horizontal",
            "backgroundColor": "#002D62",
            "paddingAll": "14px",
            "contents": [
                {
                    "type": "text",
                    "text": "PSU PART-TIME JOB HUB",
                    "color": "#FFFFFF",
                    "weight": "bold",
                    "size": "xs",
                    "gravity": "center",
                    "flex": 1,
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "backgroundColor": status_color,
                    "cornerRadius": "12px",
                    "paddingStart": "8px",
                    "paddingEnd": "8px",
                    "paddingTop": "2px",
                    "paddingBottom": "2px",
                    "flex": 0,
                    "contents": [
                        {
                            "type": "text",
                            "text": job.status,
                            "color": "#FFFFFF",
                            "size": "xxs",
                            "weight": "bold",
                        }
                    ],
                },
            ],
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "paddingAll": "16px",
            "contents": [
                {
                    "type": "text",
                    "text": job.title[:80],
                    "weight": "bold",
                    "size": "lg",
                    "color": "#0F172A",
                    "wrap": True,
                },
                {
                    "type": "text",
                    "text": job.organization_name or "PSU Phuket Campus",
                    "size": "xs",
                    "color": "#64748B",
                    "wrap": True,
                },
                {"type": "separator", "margin": "sm"},
                {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "margin": "sm",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "baseline",
                            "spacing": "sm",
                            "contents": [
                                {"type": "text", "text": "Allowance", "color": "#64748B", "size": "xs", "flex": 2},
                                {"type": "text", "text": allowance, "color": "#059669", "size": "sm", "weight": "bold", "flex": 4, "wrap": True},
                            ],
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "spacing": "sm",
                            "contents": [
                                {"type": "text", "text": "Schedule", "color": "#64748B", "size": "xs", "flex": 2},
                                {"type": "text", "text": _format_job_date(job), "color": "#1E293B", "size": "xs", "flex": 4, "wrap": True},
                            ],
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "spacing": "sm",
                            "contents": [
                                {"type": "text", "text": "Location", "color": "#64748B", "size": "xs", "flex": 2},
                                {"type": "text", "text": job.location_type or "PSU Phuket", "color": "#1E293B", "size": "xs", "flex": 4, "wrap": True},
                            ],
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "spacing": "sm",
                            "contents": [
                                {"type": "text", "text": "Vacancies", "color": "#64748B", "size": "xs", "flex": 2},
                                {"type": "text", "text": seats_text, "color": "#1E293B", "size": "xs", "weight": "bold", "flex": 4, "wrap": True},
                            ],
                        },
                    ],
                },
            ],
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "paddingAll": "14px",
            "contents": [
                {
                    "type": "button",
                    "style": "primary",
                    "color": "#002D62",
                    "height": "sm",
                    "action": {
                        "type": "uri",
                        "label": "View & Apply Now",
                        "uri": job_url,
                    },
                }
            ],
        },
    }

    # Include hero poster image only when a valid HTTPS image URL is present
    if job.poster_image_url and job.poster_image_url.startswith("https://"):
        bubble["hero"] = {
            "type": "image",
            "url": job.poster_image_url,
            "size": "full",
            "aspectRatio": "20:11",
            "aspectMode": "cover",
            "action": {"type": "uri", "uri": job_url},
        }

    return bubble


def build_jobs_carousel(jobs: List[Job], alt_text: str = "PSU Phuket Open Part-Time Jobs") -> Dict[str, Any]:
    """Wrap up to 5 open jobs in a swipeable LINE Flex Carousel."""
    bubbles = [build_job_flex_bubble(j) for j in jobs[:5]]
    return {
        "type": "flex",
        "altText": alt_text,
        "contents": {
            "type": "carousel",
            "contents": bubbles,
        },
    }


def build_quick_reply() -> Dict[str, Any]:
    """Embedded Quick Reply buttons for 1-on-1 student self-service queries."""
    return {
        "items": [
            {
                "type": "action",
                "action": {
                    "type": "message",
                    "label": "Open Jobs",
                    "text": "jobs",
                },
            },
            {
                "type": "action",
                "action": {
                    "type": "message",
                    "label": "Top Allowance",
                    "text": "top",
                },
            },
            {
                "type": "action",
                "action": {
                    "type": "uri",
                    "label": "Open Web Hub",
                    "uri": f"{PUBLIC_WEB_URL}/jobs",
                },
            },
        ]
    }


def _line_headers() -> Dict[str, str]:
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_CHANNEL_ACCESS_TOKEN}",
    }


def push_job_announcement(job: Job, target_group_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Announce a job to the configured LINE Group (1 message regardless of group size),
    or fall back to Broadcasting to all LINE OA followers if no group ID is set.
    """
    if not LINE_CHANNEL_ACCESS_TOKEN:
        return {
            "sent": False,
            "mode": "unconfigured",
            "detail": "LINE_CHANNEL_ACCESS_TOKEN is not configured on the server.",
        }

    flex_message = {
        "type": "flex",
        "altText": f"New PSU Part-Time Job: {job.title} (฿{float(job.compensation_amount):,.0f})",
        "contents": build_job_flex_bubble(job),
    }

    group_id = (target_group_id or LINE_GROUP_ID or "").strip()

    try:
        if group_id:
            resp = requests.post(
                f"{LINE_API_BASE}/push",
                headers=_line_headers(),
                json={"to": group_id, "messages": [flex_message]},
                timeout=LINE_TIMEOUT_SECONDS,
            )
            mode = "group"
        else:
            resp = requests.post(
                f"{LINE_API_BASE}/broadcast",
                headers=_line_headers(),
                json={"messages": [flex_message]},
                timeout=LINE_TIMEOUT_SECONDS,
            )
            mode = "broadcast"

        if 200 <= resp.status_code < 300:
            return {
                "sent": True,
                "mode": mode,
                "detail": (
                    "Job announcement sent to LINE Group!"
                    if mode == "group"
                    else "Job announcement broadcasted to LINE OA followers!"
                ),
            }

        logger.warning("LINE API returned %s: %s", resp.status_code, resp.text)
        return {
            "sent": False,
            "mode": mode,
            "detail": f"LINE API error ({resp.status_code}): {resp.text}",
        }
    except Exception as exc:
        logger.exception("Failed to send LINE announcement")
        return {
            "sent": False,
            "mode": "error",
            "detail": f"Could not reach LINE Messaging API: {exc}",
        }


def reply_line_messages(reply_token: str, messages: List[Dict[str, Any]]) -> bool:
    """Send a free, unlimited webhook reply using a replyToken."""
    if not LINE_CHANNEL_ACCESS_TOKEN or not reply_token:
        return False
    try:
        resp = requests.post(
            f"{LINE_API_BASE}/reply",
            headers=_line_headers(),
            json={"replyToken": reply_token, "messages": messages},
            timeout=LINE_TIMEOUT_SECONDS,
        )
        if 200 <= resp.status_code < 300:
            return True
        logger.warning("LINE reply API returned %s: %s", resp.status_code, resp.text)
        return False
    except Exception:
        logger.exception("Failed to send LINE reply")
        return False
