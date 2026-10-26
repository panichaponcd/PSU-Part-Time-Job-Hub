from typing import Optional
from datetime import datetime
from pydantic import BaseModel, field_serializer
from app.schemas.evaluation import EvaluationResponse

class ApplicationCreate(BaseModel):
    job: int  # job_id

class ApplicationResponse(BaseModel):
    id: int
    job: int
    student: int
    student_name: str
    student_id: str
    faculty: str
    job_title: str
    job_poster_url: Optional[str] = None
    application_date: datetime
    status: str
    evaluation: Optional[EvaluationResponse] = None

    @field_serializer("application_date")
    def serialize_app_date(self, v: datetime, _info):
        return v.isoformat()

    class Config:
        from_attributes = True
