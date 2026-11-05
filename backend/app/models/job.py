from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Time, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Job(Base):
    __tablename__ = "jobs_job"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    organization_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location_type = Column(String(100), nullable=False)
    job_type = Column(String(10), nullable=False)  # INTERNAL, EXTERNAL
    compensation_amount = Column(Numeric(10, 2), nullable=False)
    required_amount = Column(Integer, nullable=False)
    status = Column(String(15), default="OPEN", nullable=False)  # OPEN, CLOSED, IN_PROGRESS, COMPLETED
    academic_term = Column(Integer, nullable=False)
    academic_year = Column(Integer, nullable=False)
    poster_image_url = Column(String(500), nullable=True)
    line_group_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, index=True, nullable=False)

    schedules = relationship("WorkSchedule", back_populates="job", cascade="all, delete-orphan", lazy="selectin")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

    @property
    def applicants_count(self) -> int:
        return len(self.applications) if self.applications is not None else 0


class WorkSchedule(Base):
    __tablename__ = "jobs_workschedule"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs_job.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    job = relationship("Job", back_populates="schedules")
