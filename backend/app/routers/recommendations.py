from typing import List, Optional
from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.orm import Session
import jwt
from ..config import JWT_ALGORITHM, JWT_SECRET
from ..database import get_db
from ..models import User, AlumniProfile
from ..schemas import RecommendationOut
from ..recommender import calculate_match
from ..helpers import format_alumni_dict

router = APIRouter(prefix="/api/recommendations", tags=["AI Mentor Matching"])

@router.get("", response_model=List[RecommendationOut])
def get_recommendations(
    target_industry: Optional[str] = Query(None, description="Target industry"),
    career_goal: Optional[str] = Query(None, description="Career goal or dream role"),
    skills_to_learn: Optional[str] = Query(None, description="Comma-separated skills to learn"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    # If the user is logged in and student parameters are not explicitly passed, use their student profile!
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = int(payload.get("sub", 0))
            user = db.query(User).filter(User.id == user_id).first()
            if user and user.student_profile:
                if not target_industry:
                    target_industry = user.student_profile.target_industry
                if not career_goal:
                    career_goal = user.student_profile.career_goal
                if not skills_to_learn:
                    skills_to_learn = user.student_profile.skills_to_learn
        except Exception:
            pass  # Fall back to query parameters or generic defaults

    # Query all alumni profiles
    alumni_list = db.query(AlumniProfile).all()

    recommendations = []
    for alumni in alumni_list:
        score, reasons, matching_skills, ind_match, goal_match = calculate_match(
            alumni_profile=alumni,
            target_industry=target_industry,
            career_goal=career_goal,
            skills_to_learn=skills_to_learn
        )
        recommendations.append({
            "alumni": format_alumni_dict(alumni),
            "match_score": score,
            "reasons": reasons,
            "matching_skills": matching_skills,
            "industry_match": ind_match,
            "career_goal_match": goal_match
        })

    # Sort descending by match score
    recommendations.sort(key=lambda r: (r["match_score"], len(r["matching_skills"])), reverse=True)

    return recommendations
