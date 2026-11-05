from typing import Optional, List
from datetime import date, time, datetime
from decimal import Decimal
from pydantic import BaseModel, field_serializer

class WorkScheduleSchema(BaseModel):
    id: Optional[int] = None
    date: date
    start_time: time
    end_time: time

    @field_serializer("date")
    def serialize_date(self, v: date, _info):
        return v.isoformat()

    @field_serializer("start_time")
    def serialize_start_time(self, v: time, _info):
        return v.strftime("%H:%M:%S")

    @field_serializer("end_time")
    def serialize_end_time(self, v: time, _info):
        return v.strftime("%H:%M:%S")

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str
    organization_name: str
    description: str
    location_type: str
    job_type: str  # INTERNAL | EXTERNAL
    compensation_amount: Decimal
    required_amount: int
    status: Optional[str] = "OPEN"
    academic_term: int
    academic_year: int
    poster_image_url: Optional[str] = None
    line_group_url: Optional[str] = None
    is_active: Optional[bool] = True
    schedules: Optional[List[WorkScheduleSchema]] = []

class JobUpdate(BaseModel):
    title: Optional[str] = None
    organization_name: Optional[str] = None
    description: Optional[str] = None
    location_type: Optional[str] = None
    job_type: Optional[str] = None
    compensation_amount: Optional[Decimal] = None
    required_amount: Optional[int] = None
    status: Optional[str] = None
    academic_term: Optional[int] = None
    academic_year: Optional[int] = None
    poster_image_url: Optional[str] = None
    line_group_url: Optional[str] = None
    is_active: Optional[bool] = None
    schedules: Optional[List[WorkScheduleSchema]] = None

class JobResponse(BaseModel):
    id: int
    title: str
    organization_name: str
    description: str
    location_type: str
    job_type: str
    compensation_amount: Decimal
    required_amount: int
    status: str
    academic_term: int
    academic_year: int
    poster_image_url: Optional[str] = None
    line_group_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    schedules: List[WorkScheduleSchema] = []
    applicants_count: int = 0

    @field_serializer("compensation_amount")
    def serialize_compensation(self, v: Decimal, _info):
        return f"{v:.2f}"

    @field_serializer("created_at")
    def serialize_created_at(self, v: datetime, _info):
        return v.isoformat()

    class Config:
        from_attributes = True
