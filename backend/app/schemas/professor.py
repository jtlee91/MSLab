"""Pydantic schemas for Professor API."""

from pydantic import BaseModel


class ProfessorBase(BaseModel):
    """Base schema for Professor."""
    name: str
    student_name: str | None = None
    contact: str | None = None
    color_code: str = "#3B82F6"


class ProfessorCreate(ProfessorBase):
    """Schema for creating a Professor."""
    pass


class ProfessorUpdate(BaseModel):
    """Schema for updating a Professor."""
    name: str | None = None
    student_name: str | None = None
    contact: str | None = None
    color_code: str | None = None


class ProfessorResponse(ProfessorBase):
    """Schema for Professor response."""
    id: int
    assigned_count: int = 0

    class Config:
        from_attributes = True


class ProfessorListResponse(BaseModel):
    """Schema for list of Professors."""
    professors: list[ProfessorResponse]


class ProfessorActionResponse(BaseModel):
    """Schema for Professor action response."""
    success: bool
    message: str
    professor: ProfessorResponse | None = None
