from typing import Optional
from pydantic import BaseModel

class LoginRequest(BaseModel):
    identifier: str
    password: str

class RefreshRequest(BaseModel):
    refresh: str

class RegisterRequest(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    email: str
    password: str
    faculty: str
    major: str
    religion: Optional[str] = ""
    allergies: Optional[str] = ""

class UserSummary(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool

    class Config:
        from_attributes = True

class StudentSummary(BaseModel):
    id: Optional[int] = None
    student_id: str
    first_name: str
    last_name: str
    faculty: str
    major: str

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access: str
    refresh: str
    role: str  # "ADMIN" | "STUDENT"
    user: UserSummary
    student: Optional[StudentSummary] = None

class RefreshResponse(BaseModel):
    access: str

class MeResponse(BaseModel):
    role: str
    user: UserSummary
    student: Optional[StudentSummary] = None
