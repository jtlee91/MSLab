"""Pydantic schemas for Cage API."""

from pydantic import BaseModel


class ProfessorInfo(BaseModel):
    """Embedded professor info in cage."""
    id: int
    name: str
    color_code: str

    class Config:
        from_attributes = True


class CageResponse(BaseModel):
    """Schema for Cage response."""
    id: int
    rack_id: int
    position: str
    row_index: int
    col_index: int
    version: int
    current_professor: ProfessorInfo | None = None

    class Config:
        from_attributes = True


class CageGridResponse(BaseModel):
    """Schema for cage grid response."""
    rack_id: int
    rack_name: str
    rows: int
    columns: int
    cages: list[CageResponse]


class AssignRequest(BaseModel):
    """Schema for cage assignment request."""
    professor_id: int
    version: int


class ReleaseRequest(BaseModel):
    """Schema for cage release request."""
    version: int


class CageActionResponse(BaseModel):
    """Schema for cage action response."""
    success: bool
    message: str
    cage: CageResponse
