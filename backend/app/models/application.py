from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Application(Base):
    __tablename__ = "jobs_application"

    id = Column(Integer, primary_key=True, index=True)
    application_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String(10), default="APPROVED", nullable=False)  # PENDING, APPROVED, REJECTED
    job_id = Column(Integer, ForeignKey("jobs_job.id"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("jobs_student.id"), nullable=False, index=True)

    job = relationship("Job", back_populates="applications", lazy="selectin")
    student = relationship("Student", back_populates="applications", lazy="selectin")
    evaluation = relationship("Evaluation", back_populates="application", uselist=False, cascade="all, delete-orphan", lazy="selectin")


class Evaluation(Base):
    __tablename__ = "jobs_evaluation"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("jobs_application.id"), unique=True, nullable=False, index=True)
    punctuality_rating = Column(Integer, default=5, nullable=False)
    responsibility_rating = Column(Integer, default=5, nullable=False)
    grooming_rating = Column(Integer, default=5, nullable=False)
    quality_rating = Column(Integer, default=5, nullable=False)
    comment = Column(Text, default="", nullable=False)
    result_status = Column(String(10), nullable=False)  # PASS, FAIL
    evaluation_date = Column(DateTime, default=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="evaluation")
