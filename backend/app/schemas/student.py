from typing import Optional
from pydantic import BaseModel

class StudentResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    student_id: str
    email: Optional[str] = ""
    faculty: str
    major: str
    religion: Optional[str] = ""
    allergies: Optional[str] = ""
    student_card_image: Optional[str] = None
    user: int

    class Config:
        from_attributes = True
