"""Cage API routes with Optimistic Locking."""

from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Assignment, Cage, Professor, Rack
from app.schemas import (
    AssignRequest,
    CageActionResponse,
    CageGridResponse,
    CageResponse,
    ReleaseRequest,
)

router = APIRouter(prefix="/cages", tags=["cages"])


def get_cage_response(cage: Cage) -> CageResponse:
    """Convert Cage model to CageResponse."""
    return CageResponse(
        id=cage.id,
        rack_id=cage.rack_id,
        position=cage.position,
        row_index=cage.row_index,
        col_index=cage.col_index,
        version=cage.version,
        current_professor=cage.current_professor,
    )


@router.get("/rack/{rack_id}", response_model=CageGridResponse)
def get_cage_grid(rack_id: int, db: Session = Depends(get_db)):
    """Get all cages for a specific rack as a grid."""
    rack = db.query(Rack).filter(Rack.id == rack_id).first()
    if not rack:
        raise HTTPException(status_code=404, detail="Rack not found")

    cages = (
        db.query(Cage)
        .options(joinedload(Cage.current_professor))
        .filter(Cage.rack_id == rack_id)
        .order_by(Cage.row_index, Cage.col_index)
        .all()
    )

    # If no cages exist, create them
    if not cages:
        cages = create_cages_for_rack(db, rack)

    return CageGridResponse(
        rack_id=rack.id,
        rack_name=rack.name,
        rows=rack.rows,
        columns=rack.columns,
        cages=[get_cage_response(cage) for cage in cages],
    )


def create_cages_for_rack(db: Session, rack: Rack) -> list[Cage]:
    """Create cages for a rack if they don't exist."""
    cages = []
    for row in range(rack.rows):
        for col in range(rack.columns):
            position = f"{chr(65 + row)}{col + 1}"  # A1, A2, ..., B1, B2, ...
            cage = Cage(
                rack_id=rack.id,
                position=position,
                row_index=row,
                col_index=col,
                version=1,
            )
            db.add(cage)
            cages.append(cage)
    db.commit()
    for cage in cages:
        db.refresh(cage)
    return cages


@router.post("/{cage_id}/assign", response_model=CageActionResponse)
def assign_cage(
    cage_id: int,
    request: AssignRequest,
    db: Session = Depends(get_db),
):
    """
    Assign a cage to a professor.
    Uses Optimistic Locking - returns 409 if version mismatch.
    """
    cage = (
        db.query(Cage)
        .options(joinedload(Cage.current_professor))
        .filter(Cage.id == cage_id)
        .first()
    )
    if not cage:
        raise HTTPException(status_code=404, detail="Cage not found")

    # Optimistic Locking check
    if cage.version != request.version:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Version mismatch. The cage has been modified by another user.",
        )

    # Check if professor exists
    professor = db.query(Professor).filter(Professor.id == request.professor_id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")

    # Check if already assigned to same professor
    if cage.current_professor_id == request.professor_id:
        raise HTTPException(
            status_code=400,
            detail="Cage is already assigned to this professor",
        )

    # Update cage
    cage.current_professor_id = request.professor_id
    cage.version += 1

    # Create assignment record
    # Using a dummy user_id=1 for now (will be replaced with actual auth later)
    assignment = Assignment(
        cage_id=cage.id,
        professor_id=request.professor_id,
        assigned_by_user_id=1,
        assigned_date=date.today(),
        assigned_at=datetime.now(),
        cost=800,
    )
    db.add(assignment)
    db.commit()
    db.refresh(cage)

    return CageActionResponse(
        success=True,
        message=f"Cage {cage.position} assigned to {professor.name}",
        cage=get_cage_response(cage),
    )


@router.post("/{cage_id}/release", response_model=CageActionResponse)
def release_cage(
    cage_id: int,
    request: ReleaseRequest,
    db: Session = Depends(get_db),
):
    """
    Release a cage (remove professor assignment).
    Uses Optimistic Locking - returns 409 if version mismatch.
    """
    cage = (
        db.query(Cage)
        .options(joinedload(Cage.current_professor))
        .filter(Cage.id == cage_id)
        .first()
    )
    if not cage:
        raise HTTPException(status_code=404, detail="Cage not found")

    # Optimistic Locking check
    if cage.version != request.version:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Version mismatch. The cage has been modified by another user.",
        )

    # Check if actually assigned
    if cage.current_professor_id is None:
        raise HTTPException(status_code=400, detail="Cage is not assigned")

    # Get current assignment and mark as released
    current_assignment = (
        db.query(Assignment)
        .filter(
            Assignment.cage_id == cage.id,
            Assignment.professor_id == cage.current_professor_id,
            Assignment.released_at.is_(None),
        )
        .first()
    )
    if current_assignment:
        current_assignment.released_at = datetime.now()

    # Update cage
    old_professor_name = cage.current_professor.name if cage.current_professor else "Unknown"
    cage.current_professor_id = None
    cage.version += 1

    db.commit()
    db.refresh(cage)

    return CageActionResponse(
        success=True,
        message=f"Cage {cage.position} released (was assigned to {old_professor_name})",
        cage=get_cage_response(cage),
    )
