from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, Student
from app.schemas.student import StudentResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])


def _format_student(s: Student) -> StudentResponse:
    return StudentResponse(
        id=s.id,
        first_name=s.first_name,
        last_name=s.last_name,
        student_id=s.student_id,
        email=s.user.email if s.user else "",
        faculty=s.faculty,
        major=s.major,
        religion=s.religion,
        allergies=s.allergies,
        student_card_image=s.student_card_image,
        user=s.user_id
    )


@router.get("/", response_model=List[StudentResponse])
@router.get("", response_model=List[StudentResponse], include_in_schema=False)
def list_students(
    student_id: Optional[str] = Query(None, description="Filter by Student ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Student)

    if student_id:
        query = query.filter(Student.student_id == student_id)

    is_staff = current_user.is_staff or current_user.is_superuser
    if not is_staff:
        if not current_user.student_profile:
            return []
        query = query.filter(Student.id == current_user.student_profile.id)

    students = query.all()
    return [_format_student(s) for s in students]


@router.patch("/{student_pk}/", response_model=StudentResponse)
@router.patch("/{student_pk}", response_model=StudentResponse, include_in_schema=False)
async def update_student_profile(
    student_pk: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter(Student.id == student_pk).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found."
        )

    is_staff = current_user.is_staff or current_user.is_superuser
    if not is_staff:
        if not current_user.student_profile or current_user.student_profile.id != student.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own student profile."
            )

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        payload = await request.json()
    else:
        form = await request.form()
        payload = dict(form)

    # Strictly allow only editable fields; student_id and email are immutable
    editable_fields = ("first_name", "last_name", "faculty", "major", "religion", "allergies")
    for field in editable_fields:
        if field in payload and isinstance(payload[field], str):
            setattr(student, field, payload[field].strip())

    # Sync first_name / last_name onto auth_user as well
    if student.user:
        if "first_name" in payload and isinstance(payload["first_name"], str):
            student.user.first_name = payload["first_name"].strip()
        if "last_name" in payload and isinstance(payload["last_name"], str):
            student.user.last_name = payload["last_name"].strip()

    db.commit()
    db.refresh(student)
    return _format_student(student)
