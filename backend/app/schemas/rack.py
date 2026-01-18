"""Pydantic schemas for Rack API."""

from pydantic import BaseModel


class RackBase(BaseModel):
    """Base schema for Rack."""
    name: str
    rows: int
    columns: int
    display_order: int = 0


class RackCreate(RackBase):
    """Schema for creating a Rack."""
    pass


class RackResponse(RackBase):
    """Schema for Rack response."""
    id: int

    class Config:
        from_attributes = True


class RackListResponse(BaseModel):
    """Schema for list of Racks."""
    racks: list[RackResponse]
