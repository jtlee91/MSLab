"""Rack API routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Rack
from app.schemas import RackListResponse, RackResponse

router = APIRouter(prefix="/racks", tags=["racks"])


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
        raise HTTPException(status_code=404, detail="Rack not found")
    return rack
