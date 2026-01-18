"""Pydantic schemas for Rack API."""

from pydantic import BaseModel, Field


class RackBase(BaseModel):
    """Base schema for Rack."""
    name: str = Field(..., min_length=1, max_length=100)
    rows: int = Field(..., ge=1, le=26)
    columns: int = Field(..., ge=1, le=26)
    display_order: int = 0


class RackCreate(RackBase):
    """Schema for creating a Rack."""
    pass


class RackUpdate(BaseModel):
    """Schema for updating a Rack."""
    name: str | None = Field(None, min_length=1, max_length=100)
    rows: int | None = Field(None, ge=1, le=26)
    columns: int | None = Field(None, ge=1, le=26)
    display_order: int | None = None


class RackResponse(RackBase):
    """Schema for Rack response."""
    id: int
    assigned_count: int = 0

    class Config:
        from_attributes = True


class RackListResponse(BaseModel):
    """Schema for list of Racks."""
    racks: list[RackResponse]


class RackActionResponse(BaseModel):
    """Response for Rack create/update/delete actions."""
    success: bool
    message: str
    rack: RackResponse | None = None
