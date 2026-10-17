from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, AlumniProfile, StudentProfile
from ..schemas import UserRegister, UserLogin, TokenResponse, UserOut
from ..auth import hash_password, verify_password, create_access_token, get_current_user
from ..helpers import format_user_dict

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Create User
    new_user = User(
        email=payload.email.lower().strip(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        role=payload.role,
        headline=payload.headline,
        bio=payload.bio
    )
    db.add(new_user)
    db.flush()

    # Create associated role profile
    if payload.role == "alumni":
        alumni_prof = AlumniProfile(
            user_id=new_user.id,
            company=payload.company or "Independent / Exploring",
            current_role=payload.current_role or "Alumnus",
            industry=payload.industry or "Technology",
            graduation_year=payload.alumni_grad_year or 2020,
            degree=payload.degree or "Bachelor's",
            location=payload.location or "Global",
            linkedin_url=payload.linkedin_url,
            years_of_experience=payload.years_of_experience or 1,
            is_available_for_mentorship=True,
            mentoring_interests=payload.mentoring_interests or "Career Guidance, Resume Review",
            skills=payload.skills or "Communication, Problem Solving"
        )
        db.add(alumni_prof)
    else:  # student
        student_prof = StudentProfile(
            user_id=new_user.id,
            major=payload.major or "Undeclared",
            graduation_year=payload.student_grad_year or 2026,
            career_goal=payload.career_goal or "Explore career opportunities",
            target_industry=payload.target_industry or "Technology",
            skills_to_learn=payload.skills_to_learn or ""
        )
        db.add(student_prof)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": format_user_dict(new_user)
    }

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": format_user_dict(user)
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return format_user_dict(current_user)
