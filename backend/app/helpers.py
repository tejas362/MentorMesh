import re
from typing import List, Optional
from .models import AlumniProfile, StudentProfile, User

def parse_list(val: Optional[str]) -> List[str]:
    if not val:
        return []
    items = re.split(r'[,;\n]+', val)
    return [i.strip() for i in items if i.strip()]

def format_alumni_dict(alumni_prof: AlumniProfile) -> dict:
    user = alumni_prof.user
    return {
        "id": alumni_prof.id,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "headline": user.headline or f"{alumni_prof.current_role} at {alumni_prof.company}",
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "company": alumni_prof.company,
        "current_role": alumni_prof.current_role,
        "industry": alumni_prof.industry,
        "graduation_year": alumni_prof.graduation_year,
        "degree": alumni_prof.degree,
        "location": alumni_prof.location,
        "linkedin_url": alumni_prof.linkedin_url,
        "years_of_experience": alumni_prof.years_of_experience or 1,
        "is_available_for_mentorship": alumni_prof.is_available_for_mentorship,
        "mentoring_interests": parse_list(alumni_prof.mentoring_interests),
        "skills": parse_list(alumni_prof.skills),
    }

def format_student_dict(student_prof: StudentProfile) -> dict:
    user = student_prof.user
    return {
        "id": student_prof.id,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "headline": user.headline,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "major": student_prof.major,
        "graduation_year": student_prof.graduation_year,
        "career_goal": student_prof.career_goal,
        "target_industry": student_prof.target_industry,
        "skills_to_learn": parse_list(student_prof.skills_to_learn),
    }

def format_user_dict(user: User) -> dict:
    alumni_data = format_alumni_dict(user.alumni_profile) if user.alumni_profile else None
    student_data = format_student_dict(user.student_profile) if user.student_profile else None

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "headline": user.headline,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at,
        "alumni_profile": alumni_data,
        "student_profile": student_data,
    }
