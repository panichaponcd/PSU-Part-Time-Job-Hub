from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.application import Application, Evaluation
from app.models.user import User
from app.schemas.evaluation import EvaluationCreate, EvaluationResponse
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/evaluations", tags=["Evaluations"])

def _format_eval_response(e: Evaluation) -> EvaluationResponse:
    return EvaluationResponse(
        id=e.id,
        application=e.application_id,
        job_title=e.application.job.title if (e.application and e.application.job) else None,
        punctuality_rating=e.punctuality_rating,
        responsibility_rating=e.responsibility_rating,
        grooming_rating=e.grooming_rating,
        quality_rating=e.quality_rating,
        comment=e.comment,
        result_status=e.result_status,
        evaluation_date=e.evaluation_date
    )

@router.get("/", response_model=List[EvaluationResponse])
@router.get("", response_model=List[EvaluationResponse], include_in_schema=False)
def list_evaluations(
    application: Optional[int] = Query(None, description="Filter by Application ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Evaluation)

    if application is not None:
        query = query.filter(Evaluation.application_id == application)

    is_staff = current_user.is_staff or current_user.is_superuser
    if not is_staff:
        # Students can only see evaluations of their own applications
        if not current_user.student_profile:
            return []
        query = query.join(Application).filter(Application.student_id == current_user.student_profile.id)

    evals = query.all()
    return [_format_eval_response(e) for e in evals]


@router.post("/", response_model=EvaluationResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=EvaluationResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_evaluation(
    data: EvaluationCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    app = db.query(Application).filter(Application.id == data.application).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Check if an evaluation already exists for this application
    existing = db.query(Evaluation).filter(Evaluation.application_id == data.application).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This application has already been evaluated."
        )

    new_eval = Evaluation(
        application_id=data.application,
        punctuality_rating=data.punctuality_rating or 5,
        responsibility_rating=data.responsibility_rating or 5,
        grooming_rating=data.grooming_rating or 5,
        quality_rating=data.quality_rating or 5,
        comment=data.comment or "",
        result_status=data.result_status,
        evaluation_date=datetime.utcnow()
    )
    db.add(new_eval)
    db.commit()
    db.refresh(new_eval)

    return _format_eval_response(new_eval)
