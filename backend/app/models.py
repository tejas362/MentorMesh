from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="student")  # "student" or "alumni"
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    alumni_profile = relationship("AlumniProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    sent_requests = relationship(
        "MentorshipRequest",
        foreign_keys="[MentorshipRequest.student_id]",
        back_populates="student",
        cascade="all, delete-orphan"
    )
    received_requests = relationship(
        "MentorshipRequest",
        foreign_keys="[MentorshipRequest.alumni_id]",
        back_populates="alumni",
        cascade="all, delete-orphan"
    )


class AlumniProfile(Base):
    __tablename__ = "alumni_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company = Column(String(255), index=True, nullable=False)
    current_role = Column(String(255), index=True, nullable=False)
    industry = Column(String(100), index=True, nullable=False)
    graduation_year = Column(Integer, index=True, nullable=False)
    degree = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    years_of_experience = Column(Integer, default=2)
    is_available_for_mentorship = Column(Boolean, default=True)
    mentoring_interests = Column(Text, nullable=True)  # e.g. "Resume Review, Mock Interviews, Career Transition"
    skills = Column(Text, nullable=True)  # comma-separated e.g. "Python, React, AWS, System Design"

    user = relationship("User", back_populates="alumni_profile")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    major = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    career_goal = Column(String(255), nullable=True)
    target_industry = Column(String(100), nullable=True)
    skills_to_learn = Column(Text, nullable=True)  # comma-separated

    user = relationship("User", back_populates="student_profile")


class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    alumni_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic = Column(String(255), nullable=False)  # e.g. "Career Advice", "Resume Feedback"
    message = Column(Text, nullable=False)
    status = Column(String(50), default="pending", index=True)  # "pending", "accepted", "rejected"
    response_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    student = relationship("User", foreign_keys=[student_id], back_populates="sent_requests")
    alumni = relationship("User", foreign_keys=[alumni_id], back_populates="received_requests")
