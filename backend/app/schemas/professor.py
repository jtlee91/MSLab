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


class ProfessorResponse(ProfessorBase):
    """Schema for Professor response."""
    id: int

    class Config:
        from_attributes = True


class ProfessorListResponse(BaseModel):
    """Schema for list of Professors."""
    professors: list[ProfessorResponse]
