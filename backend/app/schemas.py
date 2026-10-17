from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

# --- Auth Schemas ---

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="student", pattern="^(student|alumni)$")
    headline: Optional[str] = None
    bio: Optional[str] = None

    # Student specific fields
    major: Optional[str] = None
    student_grad_year: Optional[int] = None
    career_goal: Optional[str] = None
    target_industry: Optional[str] = None
    skills_to_learn: Optional[str] = None

    # Alumni specific fields
    company: Optional[str] = None
    current_role: Optional[str] = None
    industry: Optional[str] = None
    alumni_grad_year: Optional[int] = None
    degree: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_of_experience: Optional[int] = 1
    mentoring_interests: Optional[str] = None
    skills: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AlumniProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    full_name: str
    email: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    company: str
    current_role: str
    industry: str
    graduation_year: int
    degree: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_of_experience: int
    is_available_for_mentorship: bool
    mentoring_interests: List[str] = []
    skills: List[str] = []


class StudentProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    full_name: str
    email: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    career_goal: Optional[str] = None
    target_industry: Optional[str] = None
    skills_to_learn: List[str] = []


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    alumni_profile: Optional[AlumniProfileOut] = None
    student_profile: Optional[StudentProfileOut] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# --- Profile Update Schema ---

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

    # Alumni fields
    company: Optional[str] = None
    current_role: Optional[str] = None
    industry: Optional[str] = None
    graduation_year: Optional[int] = None
    degree: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_of_experience: Optional[int] = None
    is_available_for_mentorship: Optional[bool] = None
    mentoring_interests: Optional[str] = None
    skills: Optional[str] = None

    # Student fields
    major: Optional[str] = None
    career_goal: Optional[str] = None
    target_industry: Optional[str] = None
    skills_to_learn: Optional[str] = None


# --- Mentorship Request Schemas ---

class MentorshipRequestCreate(BaseModel):
    alumni_id: int
    topic: str = Field(..., min_length=2, max_length=100)
    message: str = Field(..., min_length=10, max_length=2000)


class MentorshipRequestStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(accepted|rejected)$")
    response_note: Optional[str] = Field(None, max_length=1000)


class MentorshipRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    alumni_id: int
    topic: str
    message: str
    status: str
    response_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    student: UserOut
    alumni: UserOut


# --- Recommendation Schemas ---

class RecommendationOut(BaseModel):
    alumni: AlumniProfileOut
    match_score: int  # 0 to 100
    reasons: List[str]
    matching_skills: List[str]
    industry_match: bool
    career_goal_match: bool


# --- Message Generator Schemas ---

class MessageGenerateRequest(BaseModel):
    alumni_id: int
    career_goal: Optional[str] = None
    reason: Optional[str] = None
    tone: str = Field(default="professional", pattern="^(professional|enthusiastic|casual|concise)$")


class MessageGenerateResponse(BaseModel):
    alumni_id: int
    alumni_name: str
    alumni_company: str
    subject: str
    body: str
    tone: str
