from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.application import Application, Evaluation
from app.models.job import Job
from app.models.user import User, Student
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.schemas.evaluation import EvaluationResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

def _format_application_response(app: Application) -> ApplicationResponse:
    eval_resp = None
    if app.evaluation:
        eval_resp = EvaluationResponse(
            id=app.evaluation.id,
            application=app.evaluation.application_id,
            job_title=app.job.title if app.job else None,
            punctuality_rating=app.evaluation.punctuality_rating,
            responsibility_rating=app.evaluation.responsibility_rating,
            grooming_rating=app.evaluation.grooming_rating,
            quality_rating=app.evaluation.quality_rating,
            comment=app.evaluation.comment,
            result_status=app.evaluation.result_status,
            evaluation_date=app.evaluation.evaluation_date
        )

    return ApplicationResponse(
        id=app.id,
        job=app.job_id,
        student=app.student_id,
        student_name=f"{app.student.first_name} {app.student.last_name}" if app.student else "",
        student_id=app.student.student_id if app.student else "",
        faculty=app.student.faculty if app.student else "",
        job_title=app.job.title if app.job else "",
        job_poster_url=app.job.poster_image_url if app.job else None,
        application_date=app.application_date,
        status=app.status,
        evaluation=eval_resp
    )


@router.get("/", response_model=List[ApplicationResponse])
@router.get("", response_model=List[ApplicationResponse], include_in_schema=False)
def list_applications(
    job: Optional[int] = Query(None, description="Filter by Job ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Application)

    if job is not None:
        query = query.filter(Application.job_id == job)

    is_staff = current_user.is_staff or current_user.is_superuser
    if not is_staff:
        if not current_user.student_profile:
            return []
        query = query.filter(Application.student_id == current_user.student_profile.id)

    apps = query.order_by(Application.application_date.desc()).all()
    return [_format_application_response(a) for a in apps]


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def apply_job(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.is_staff or current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff accounts cannot submit job applications."
        )

    student = current_user.student_profile
    if not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only registered students can apply for jobs."
        )

    job = db.query(Job).filter(Job.id == data.job).first()
    if not job or not job.is_active or job.status != "OPEN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This job is not currently open for applications."
        )

    # Prevent duplicate applications by the same student
    existing = db.query(Application).filter(
        Application.student_id == student.id,
        Application.job_id == job.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this position."
        )

    # Prevent applying to jobs that have reached full capacity
    active_apps_count = db.query(Application).filter(
        Application.job_id == job.id,
        Application.status.in_(["APPROVED", "PENDING"])
    ).count()

    if job.required_amount > 0 and active_apps_count >= job.required_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This position has reached full capacity."
        )

    new_app = Application(
        job_id=job.id,
        student_id=student.id,
        status="APPROVED",
        application_date=datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return _format_application_response(new_app)


@router.delete("/{application_id}/", status_code=status.HTTP_204_NO_CONTENT)
@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT, include_in_schema=False)
def cancel_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    is_staff = current_user.is_staff or current_user.is_superuser
    if not is_staff:
        if not current_user.student_profile or app.student_id != current_user.student_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot cancel this application."
            )

    db.delete(app)
    db.commit()
    return None
