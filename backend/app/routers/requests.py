from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, MentorshipRequest, AlumniProfile
from ..schemas import MentorshipRequestCreate, MentorshipRequestStatusUpdate, MentorshipRequestOut
from ..auth import get_current_user
from ..helpers import format_user_dict

router = APIRouter(prefix="/api/requests", tags=["Mentorship Requests"])

def format_request_dict(req: MentorshipRequest) -> dict:
    return {
        "id": req.id,
        "student_id": req.student_id,
        "alumni_id": req.alumni_id,
        "topic": req.topic,
        "message": req.message,
        "status": req.status,
        "response_note": req.response_note,
        "created_at": req.created_at,
        "updated_at": req.updated_at,
        "student": format_user_dict(req.student),
        "alumni": format_user_dict(req.alumni),
    }

@router.post("", response_model=MentorshipRequestOut, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(
    payload: MentorshipRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Prevent requesting mentorship from oneself
    if current_user.id == payload.alumni_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot submit a mentorship request to yourself."
        )

    # Verify target alumni exists
    alumni_user = db.query(User).filter(User.id == payload.alumni_id).first()
    if not alumni_user or not alumni_user.alumni_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alumni with ID {payload.alumni_id} does not exist."
        )

    # Check for existing pending request to prevent duplicate spam
    existing_pending = db.query(MentorshipRequest).filter(
        MentorshipRequest.student_id == current_user.id,
        MentorshipRequest.alumni_id == payload.alumni_id,
        MentorshipRequest.status == "pending"
    ).first()

    if existing_pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active pending mentorship request with this alumnus. Please wait for their response."
        )

    new_request = MentorshipRequest(
        student_id=current_user.id,
        alumni_id=payload.alumni_id,
        topic=payload.topic.strip(),
        message=payload.message.strip(),
        status="pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return format_request_dict(new_request)


@router.get("/student", response_model=List[MentorshipRequestOut])
def get_student_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all mentorship requests sent by the currently logged-in student."""
    requests = db.query(MentorshipRequest).filter(
        MentorshipRequest.student_id == current_user.id
    ).order_by(MentorshipRequest.created_at.desc()).all()

    return [format_request_dict(r) for r in requests]


@router.get("/alumni", response_model=List[MentorshipRequestOut])
def get_alumni_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all mentorship requests received by the currently logged-in alumni."""
    requests = db.query(MentorshipRequest).filter(
        MentorshipRequest.alumni_id == current_user.id
    ).order_by(MentorshipRequest.created_at.desc()).all()

    return [format_request_dict(r) for r in requests]


@router.patch("/{request_id}/status", response_model=MentorshipRequestOut)
def update_request_status(
    request_id: int,
    payload: MentorshipRequestStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Alumni accepts or rejects a mentorship request."""
    req = db.query(MentorshipRequest).filter(MentorshipRequest.id == request_id).first()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentorship request not found."
        )

    # Permission check: Only the recipient alumni can update the request status
    if req.alumni_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to respond to this mentorship request."
        )

    req.status = payload.status
    if payload.response_note:
        req.response_note = payload.response_note.strip()

    db.commit()
    db.refresh(req)

    return format_request_dict(req)
