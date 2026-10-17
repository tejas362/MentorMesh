from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
import jwt
from ..config import JWT_ALGORITHM, JWT_SECRET
from ..database import get_db
from ..models import User, AlumniProfile
from ..schemas import MessageGenerateRequest, MessageGenerateResponse
from ..message_generator import generate_networking_message

router = APIRouter(prefix="/api/messages", tags=["Networking Messages"])

@router.post("/generate", response_model=MessageGenerateResponse)
def generate_message(
    payload: MessageGenerateRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    # Retrieve target alumni
    alumni_user = db.query(User).filter(User.id == payload.alumni_id).first()
    if not alumni_user or not alumni_user.alumni_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alumni with ID {payload.alumni_id} not found."
        )

    # Determine student details from token if available
    student_name = "Alex"
    student_major = "Computer Science"
    career_goal = payload.career_goal

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            tok_payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = int(tok_payload.get("sub", 0))
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                student_name = user.full_name
                if user.student_profile:
                    student_major = user.student_profile.major or student_major
                    if not career_goal:
                        career_goal = user.student_profile.career_goal
        except Exception:
            pass

    draft = generate_networking_message(
        student_name=student_name,
        student_major=student_major,
        career_goal=career_goal,
        alumni_name=alumni_user.full_name,
        alumni_role=alumni_user.alumni_profile.current_role,
        alumni_company=alumni_user.alumni_profile.company,
        alumni_skills=alumni_user.alumni_profile.skills,
        reason=payload.reason,
        tone=payload.tone
    )

    return {
        "alumni_id": payload.alumni_id,
        "alumni_name": alumni_user.full_name,
        "alumni_company": alumni_user.alumni_profile.company,
        "subject": draft["subject"],
        "body": draft["body"],
        "tone": payload.tone
    }
