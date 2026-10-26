from typing import Optional
from datetime import datetime
from pydantic import BaseModel, field_serializer

class EvaluationCreate(BaseModel):
    application: int  # application_id
    punctuality_rating: Optional[int] = 5
    responsibility_rating: Optional[int] = 5
    grooming_rating: Optional[int] = 5
    quality_rating: Optional[int] = 5
    comment: Optional[str] = ""
    result_status: str  # PASS | FAIL

class EvaluationResponse(BaseModel):
    id: int
    application: int
    job_title: Optional[str] = None
    punctuality_rating: int
    responsibility_rating: int
    grooming_rating: int
    quality_rating: int
    comment: str
    result_status: str
    evaluation_date: datetime

    @field_serializer("evaluation_date")
    def serialize_eval_date(self, v: datetime, _info):
        return v.isoformat()

    class Config:
        from_attributes = True
