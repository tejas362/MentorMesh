from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, AlumniProfile, StudentProfile, MentorshipRequest
from ..schemas import ProfileUpdate, UserOut
from ..auth import get_current_user
from ..helpers import format_user_dict
from ..seed_data import seed_database

router = APIRouter(prefix="/api/users", tags=["Users and Platform"])

@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update common user fields
    if payload.full_name is not None:
        current_user.full_name = payload.full_name.strip()
    if payload.headline is not None:
        current_user.headline = payload.headline.strip()
    if payload.bio is not None:
        current_user.bio = payload.bio.strip()
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url.strip()

    # Update role-specific fields
    if current_user.role == "alumni":
        if not current_user.alumni_profile:
            current_user.alumni_profile = AlumniProfile(user_id=current_user.id, company="Independent", current_role="Professional", industry="Technology", graduation_year=2020)
            db.add(current_user.alumni_profile)
            db.flush()

        prof = current_user.alumni_profile
        if payload.company is not None:
            prof.company = payload.company.strip()
        if payload.current_role is not None:
            prof.current_role = payload.current_role.strip()
        if payload.industry is not None:
            prof.industry = payload.industry.strip()
        if payload.graduation_year is not None:
            prof.graduation_year = payload.graduation_year
        if payload.degree is not None:
            prof.degree = payload.degree.strip()
        if payload.location is not None:
            prof.location = payload.location.strip()
        if payload.linkedin_url is not None:
            prof.linkedin_url = payload.linkedin_url.strip()
        if payload.years_of_experience is not None:
            prof.years_of_experience = payload.years_of_experience
        if payload.is_available_for_mentorship is not None:
            prof.is_available_for_mentorship = payload.is_available_for_mentorship
        if payload.mentoring_interests is not None:
            prof.mentoring_interests = payload.mentoring_interests.strip()
        if payload.skills is not None:
            prof.skills = payload.skills.strip()

    elif current_user.role == "student":
        if not current_user.student_profile:
            current_user.student_profile = StudentProfile(user_id=current_user.id)
            db.add(current_user.student_profile)
            db.flush()

        sprof = current_user.student_profile
        if payload.major is not None:
            sprof.major = payload.major.strip()
        if payload.career_goal is not None:
            sprof.career_goal = payload.career_goal.strip()
        if payload.target_industry is not None:
            sprof.target_industry = payload.target_industry.strip()
        if payload.skills_to_learn is not None:
            sprof.skills_to_learn = payload.skills_to_learn.strip()

    db.commit()
    db.refresh(current_user)

    return format_user_dict(current_user)


@router.get("/stats")
def get_platform_stats(db: Session = Depends(get_db)):
    """Summary stats for platform overview."""
    total_alumni = db.query(AlumniProfile).count()
    total_students = db.query(StudentProfile).count()
    total_requests = db.query(MentorshipRequest).count()
    accepted_requests = db.query(MentorshipRequest).filter(MentorshipRequest.status == "accepted").count()

    industries = db.query(AlumniProfile.industry).distinct().count()

    return {
        "total_alumni": total_alumni,
        "total_students": total_students,
        "total_requests": total_requests,
        "accepted_requests": accepted_requests,
        "industries_represented": industries,
        "platform_name": "MentorMesh",
        "tagline": "Connect with Alumni. Build Your Future."
    }


@router.post("/reset-demo")
def reset_demo_data(db: Session = Depends(get_db)):
    """Safely reload demo data if requested."""
    seed_database(db, force=True)
    return {"message": "Demo data successfully reloaded."}
