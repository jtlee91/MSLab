"""Professor API routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Cage, Professor
from app.schemas import (
    ProfessorActionResponse,
    ProfessorCreate,
    ProfessorListResponse,
    ProfessorResponse,
    ProfessorUpdate,
)

router = APIRouter(prefix="/professors", tags=["professors"])


@router.get("", response_model=ProfessorListResponse)
def get_professors(db: Session = Depends(get_db)):
    """Get all professors with assigned cage count."""
    professors = db.query(Professor).order_by(Professor.name).all()

    professor_responses = []
    for professor in professors:
        assigned_count = (
            db.query(Cage)
            .filter(Cage.current_professor_id == professor.id)
            .count()
        )
        professor_responses.append({
            "id": professor.id,
            "name": professor.name,
            "student_name": professor.student_name,
            "contact": professor.contact,
            "color_code": professor.color_code,
            "assigned_count": assigned_count,
        })

    return ProfessorListResponse(professors=professor_responses)


@router.get("/{professor_id}", response_model=ProfessorResponse)
def get_professor(professor_id: int, db: Session = Depends(get_db)):
    """Get a specific professor by ID."""
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="교수를 찾을 수 없습니다.")

    assigned_count = (
        db.query(Cage)
        .filter(Cage.current_professor_id == professor_id)
        .count()
    )

    return ProfessorResponse(
        id=professor.id,
        name=professor.name,
        student_name=professor.student_name,
        contact=professor.contact,
        color_code=professor.color_code,
        assigned_count=assigned_count,
    )


@router.post("", response_model=ProfessorActionResponse)
def create_professor(professor_data: ProfessorCreate, db: Session = Depends(get_db)):
    """Create a new professor."""
    existing = db.query(Professor).filter(Professor.name == professor_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 같은 이름의 교수가 존재합니다.")

    professor = Professor(
        name=professor_data.name,
        student_name=professor_data.student_name,
        contact=professor_data.contact,
        color_code=professor_data.color_code,
    )
    db.add(professor)
    db.commit()
    db.refresh(professor)

    return ProfessorActionResponse(
        success=True,
        message=f"'{professor.name}' 교수가 등록되었습니다.",
        professor=ProfessorResponse(
            id=professor.id,
            name=professor.name,
            student_name=professor.student_name,
            contact=professor.contact,
            color_code=professor.color_code,
            assigned_count=0,
        ),
    )


@router.put("/{professor_id}", response_model=ProfessorActionResponse)
def update_professor(
    professor_id: int,
    professor_data: ProfessorUpdate,
    db: Session = Depends(get_db),
):
    """Update a professor."""
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="교수를 찾을 수 없습니다.")

    if professor_data.name is not None:
        existing = (
            db.query(Professor)
            .filter(Professor.name == professor_data.name, Professor.id != professor_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="이미 같은 이름의 교수가 존재합니다.")
        professor.name = professor_data.name

    if professor_data.student_name is not None:
        professor.student_name = professor_data.student_name

    if professor_data.contact is not None:
        professor.contact = professor_data.contact

    if professor_data.color_code is not None:
        professor.color_code = professor_data.color_code

    db.commit()
    db.refresh(professor)

    assigned_count = (
        db.query(Cage)
        .filter(Cage.current_professor_id == professor_id)
        .count()
    )

    return ProfessorActionResponse(
        success=True,
        message=f"'{professor.name}' 교수 정보가 수정되었습니다.",
        professor=ProfessorResponse(
            id=professor.id,
            name=professor.name,
            student_name=professor.student_name,
            contact=professor.contact,
            color_code=professor.color_code,
            assigned_count=assigned_count,
        ),
    )


@router.delete("/{professor_id}", response_model=ProfessorActionResponse)
def delete_professor(professor_id: int, db: Session = Depends(get_db)):
    """Delete a professor. Only allowed if no cages are assigned."""
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="교수를 찾을 수 없습니다.")

    has_assigned = (
        db.query(Cage)
        .filter(Cage.current_professor_id == professor_id)
        .first()
    )
    if has_assigned:
        raise HTTPException(
            status_code=400,
            detail="배정된 케이지가 있어 삭제할 수 없습니다. 모든 케이지를 해제한 후 다시 시도하세요.",
        )

    professor_name = professor.name
    db.delete(professor)
    db.commit()

    return ProfessorActionResponse(
        success=True,
        message=f"'{professor_name}' 교수가 삭제되었습니다.",
        professor=None,
    )
