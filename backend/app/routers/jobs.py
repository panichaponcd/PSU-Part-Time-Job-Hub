from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.database import get_db
from app.models.job import Job, WorkSchedule
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse, WorkScheduleSchema
from app.dependencies import require_admin, get_optional_current_user

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

def _format_job_response(job: Job) -> JobResponse:
    return JobResponse(
        id=job.id,
        title=job.title,
        organization_name=job.organization_name,
        description=job.description,
        location_type=job.location_type,
        job_type=job.job_type,
        compensation_amount=job.compensation_amount,
        required_amount=job.required_amount,
        status=job.status,
        academic_term=job.academic_term,
        academic_year=job.academic_year,
        poster_image_url=job.poster_image_url,
        line_group_url=job.line_group_url,
        is_active=job.is_active,
        created_at=job.created_at,
        schedules=[WorkScheduleSchema.model_validate(s) for s in (job.schedules or [])],
        applicants_count=job.applicants_count
    )

@router.get("/", response_model=List[JobResponse])
@router.get("", response_model=List[JobResponse], include_in_schema=False)
def list_jobs(
    search: Optional[str] = Query(None, description="Search by title or organization name"),
    is_active: Optional[bool] = Query(None, description="Filter active status"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Job)

    is_staff = current_user and (current_user.is_staff or current_user.is_superuser)
    if not is_staff:
        query = query.filter(Job.is_active == True)
    elif is_active is not None:
        query = query.filter(Job.is_active == is_active)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Job.title.ilike(search_pattern),
                Job.organization_name.ilike(search_pattern)
            )
        )

    jobs = query.order_by(desc(Job.created_at)).all()
    return [_format_job_response(j) for j in jobs]


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_job(
    data: JobCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    job_dict = data.model_dump(exclude={"schedules"})
    new_job = Job(**job_dict, created_at=datetime.utcnow())
    db.add(new_job)
    db.flush()

    if data.schedules:
        for sched in data.schedules:
            ws = WorkSchedule(
                job_id=new_job.id,
                date=sched.date,
                start_time=sched.start_time,
                end_time=sched.end_time
            )
            db.add(ws)

    db.commit()
    db.refresh(new_job)
    return _format_job_response(new_job)


@router.get("/{job_id}/", response_model=JobResponse)
@router.get("/{job_id}", response_model=JobResponse, include_in_schema=False)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    return _format_job_response(job)


@router.patch("/{job_id}/", response_model=JobResponse)
@router.patch("/{job_id}", response_model=JobResponse, include_in_schema=False)
@router.put("/{job_id}/", response_model=JobResponse)
@router.put("/{job_id}", response_model=JobResponse, include_in_schema=False)
def update_job(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    update_dict = data.model_dump(exclude_unset=True)
    schedules_data = update_dict.pop("schedules", None)

    for field, val in update_dict.items():
        setattr(job, field, val)

    if schedules_data is not None:
        db.query(WorkSchedule).filter(WorkSchedule.job_id == job.id).delete()
        for sched in schedules_data:
            ws = WorkSchedule(
                job_id=job.id,
                date=sched["date"],
                start_time=sched["start_time"],
                end_time=sched["end_time"]
            )
            db.add(ws)

    db.commit()
    db.refresh(job)
    return _format_job_response(job)


@router.delete("/{job_id}/", status_code=status.HTTP_204_NO_CONTENT)
@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT, include_in_schema=False)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    db.delete(job)
    db.commit()
    return None
