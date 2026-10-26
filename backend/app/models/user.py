from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "auth_user"

    id = Column(Integer, primary_key=True, index=True)
    password = Column(String(128), nullable=False)
    last_login = Column(DateTime, nullable=True)
    is_superuser = Column(Boolean, default=False, nullable=False)
    username = Column(String(150), unique=True, index=True, nullable=False)
    first_name = Column(String(150), default="", nullable=False)
    last_name = Column(String(150), default="", nullable=False)
    email = Column(String(254), index=True, nullable=False)
    is_staff = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    date_joined = Column(DateTime, default=datetime.utcnow, nullable=False)

    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")

    @property
    def is_admin(self) -> bool:
        return bool(self.is_staff or self.is_superuser)


class Student(Base):
    __tablename__ = "jobs_student"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    student_id = Column(String(10), unique=True, index=True, nullable=False)
    faculty = Column(String(100), nullable=False)
    major = Column(String(100), nullable=False)
    religion = Column(String(50), default="", nullable=False)
    allergies = Column(Text, default="", nullable=False)
    student_card_image = Column(String(100), nullable=True)
    user_id = Column(Integer, ForeignKey("auth_user.id"), unique=True, nullable=False)

    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
