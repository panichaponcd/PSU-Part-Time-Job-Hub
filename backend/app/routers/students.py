from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, Student
from app.schemas.student import StudentResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])

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
    results = []
    for s in students:
        results.append(StudentResponse(
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
        ))
    return results
