from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import User, AlumniProfile
from ..schemas import AlumniProfileOut
from ..helpers import format_alumni_dict, parse_list

router = APIRouter(prefix="/api/alumni", tags=["Alumni Directory"])

@router.get("", response_model=List[AlumniProfileOut])
def get_alumni_directory(
    q: Optional[str] = Query(None, description="Search keyword across name, role, company, skills, or bio"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    skill: Optional[str] = Query(None, description="Filter by skill"),
    graduation_year: Optional[int] = Query(None, description="Filter by graduation year"),
    available_only: Optional[bool] = Query(False, description="Filter by mentorship availability"),
    db: Session = Depends(get_db)
):
    query = db.query(AlumniProfile).join(User, AlumniProfile.user_id == User.id)

    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(term),
                AlumniProfile.company.ilike(term),
                AlumniProfile.current_role.ilike(term),
                AlumniProfile.industry.ilike(term),
                AlumniProfile.skills.ilike(term),
                User.bio.ilike(term),
                User.headline.ilike(term)
            )
        )

    if industry and industry.strip() and industry.lower() != "all":
        query = query.filter(AlumniProfile.industry.ilike(f"%{industry.strip()}%"))

    if skill and skill.strip() and skill.lower() != "all":
        query = query.filter(AlumniProfile.skills.ilike(f"%{skill.strip()}%"))

    if graduation_year:
        query = query.filter(AlumniProfile.graduation_year == graduation_year)

    if available_only:
        query = query.filter(AlumniProfile.is_available_for_mentorship == True)

    profiles = query.order_by(AlumniProfile.is_available_for_mentorship.desc(), AlumniProfile.years_of_experience.desc()).all()
    return [format_alumni_dict(p) for p in profiles]


@router.get("/filters/meta")
def get_filter_metadata(db: Session = Depends(get_db)):
    """Return distinct filter options for industries, skills, and graduation years."""
    profiles = db.query(AlumniProfile).all()

    industries = sorted(list({p.industry for p in profiles if p.industry}))
    grad_years = sorted(list({p.graduation_year for p in profiles if p.graduation_year}), reverse=True)

    all_skills = set()
    for p in profiles:
        for s in parse_list(p.skills):
            all_skills.add(s)
    skills = sorted(list(all_skills))

    return {
        "industries": industries,
        "graduation_years": grad_years,
        "skills": skills,
        "total_alumni": len(profiles)
    }


@router.get("/{alumni_id}", response_model=AlumniProfileOut)
def get_alumni_profile(alumni_id: int, db: Session = Depends(get_db)):
    # Support lookup either by profile ID or by User ID
    profile = db.query(AlumniProfile).filter(
        or_(AlumniProfile.id == alumni_id, AlumniProfile.user_id == alumni_id)
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alumni profile with ID {alumni_id} not found."
        )

    return format_alumni_dict(profile)
