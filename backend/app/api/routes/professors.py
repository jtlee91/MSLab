"""Professor API routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Professor
from app.schemas import ProfessorListResponse, ProfessorResponse

router = APIRouter(prefix="/professors", tags=["professors"])


@router.get("", response_model=ProfessorListResponse)
def get_professors(db: Session = Depends(get_db)):
    """Get all professors."""
    professors = db.query(Professor).all()
    return ProfessorListResponse(professors=professors)


@router.get("/{professor_id}", response_model=ProfessorResponse)
def get_professor(professor_id: int, db: Session = Depends(get_db)):
    """Get a specific professor by ID."""
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    return professor
