"""Rack API routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Cage, Rack
from app.schemas import (
    RackActionResponse,
    RackCreate,
    RackListResponse,
    RackResponse,
    RackUpdate,
)

router = APIRouter(prefix="/racks", tags=["racks"])


def _generate_position(row_index: int, col_index: int) -> str:
    """Generate position string like 'A1', 'B2'."""
    row_letter = chr(ord("A") + row_index)
    col_number = col_index + 1
    return f"{row_letter}{col_number}"


def _create_cages_for_rack(db: Session, rack: Rack) -> None:
    """Create cage records for all positions in a rack."""
    for row in range(rack.rows):
        for col in range(rack.columns):
            cage = Cage(
                rack_id=rack.id,
                position=_generate_position(row, col),
                row_index=row,
                col_index=col,
            )
            db.add(cage)


@router.get("", response_model=RackListResponse)
def get_racks(db: Session = Depends(get_db)):
    """Get all racks ordered by display_order."""
    racks = db.query(Rack).order_by(Rack.display_order).all()
    return RackListResponse(racks=racks)


@router.get("/{rack_id}", response_model=RackResponse)
def get_rack(rack_id: int, db: Session = Depends(get_db)):
    """Get a specific rack by ID."""
    rack = db.query(Rack).filter(Rack.id == rack_id).first()
    if not rack:
        raise HTTPException(status_code=404, detail="랙을 찾을 수 없습니다.")
    return rack


@router.post("", response_model=RackActionResponse)
def create_rack(rack_data: RackCreate, db: Session = Depends(get_db)):
    """Create a new rack with cages."""
    existing = db.query(Rack).filter(Rack.name == rack_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 같은 이름의 랙이 존재합니다.")

    rack = Rack(
        name=rack_data.name,
        rows=rack_data.rows,
        columns=rack_data.columns,
        display_order=rack_data.display_order,
    )
    db.add(rack)
    db.flush()

    _create_cages_for_rack(db, rack)
    db.commit()
    db.refresh(rack)

    return RackActionResponse(
        success=True,
        message=f"'{rack.name}' 랙이 생성되었습니다.",
        rack=rack,
    )


@router.put("/{rack_id}", response_model=RackActionResponse)
def update_rack(rack_id: int, rack_data: RackUpdate, db: Session = Depends(get_db)):
    """Update a rack. Only name and display_order can be changed."""
    rack = db.query(Rack).filter(Rack.id == rack_id).first()
    if not rack:
        raise HTTPException(status_code=404, detail="랙을 찾을 수 없습니다.")

    if rack_data.name is not None:
        existing = (
            db.query(Rack)
            .filter(Rack.name == rack_data.name, Rack.id != rack_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="이미 같은 이름의 랙이 존재합니다.")
        rack.name = rack_data.name

    if rack_data.display_order is not None:
        rack.display_order = rack_data.display_order

    if rack_data.rows is not None or rack_data.columns is not None:
        has_assigned = (
            db.query(Cage)
            .filter(Cage.rack_id == rack_id, Cage.current_professor_id.isnot(None))
            .first()
        )
        if has_assigned:
            raise HTTPException(
                status_code=400,
                detail="배정된 케이지가 있어 크기를 변경할 수 없습니다.",
            )

        new_rows = rack_data.rows if rack_data.rows is not None else rack.rows
        new_cols = rack_data.columns if rack_data.columns is not None else rack.columns

        db.query(Cage).filter(Cage.rack_id == rack_id).delete()
        rack.rows = new_rows
        rack.columns = new_cols
        db.flush()

        _create_cages_for_rack(db, rack)

    db.commit()
    db.refresh(rack)

    return RackActionResponse(
        success=True,
        message=f"'{rack.name}' 랙이 수정되었습니다.",
        rack=rack,
    )


@router.delete("/{rack_id}", response_model=RackActionResponse)
def delete_rack(rack_id: int, db: Session = Depends(get_db)):
    """Delete a rack. Only allowed if no cages are assigned."""
    rack = db.query(Rack).filter(Rack.id == rack_id).first()
    if not rack:
        raise HTTPException(status_code=404, detail="랙을 찾을 수 없습니다.")

    has_assigned = (
        db.query(Cage)
        .filter(Cage.rack_id == rack_id, Cage.current_professor_id.isnot(None))
        .first()
    )
    if has_assigned:
        raise HTTPException(
            status_code=400,
            detail="배정된 케이지가 있어 삭제할 수 없습니다. 모든 케이지를 해제한 후 다시 시도하세요.",
        )

    rack_name = rack.name
    db.delete(rack)
    db.commit()

    return RackActionResponse(
        success=True,
        message=f"'{rack_name}' 랙이 삭제되었습니다.",
        rack=None,
    )
