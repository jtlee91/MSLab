"""Schemas package - exports all schemas."""

from app.schemas.cage import (
    AssignRequest,
    CageActionResponse,
    CageGridResponse,
    CageResponse,
    ProfessorInfo,
    ReleaseRequest,
)
from app.schemas.professor import (
    ProfessorActionResponse,
    ProfessorCreate,
    ProfessorListResponse,
    ProfessorResponse,
    ProfessorUpdate,
)
from app.schemas.rack import (
    RackActionResponse,
    RackCreate,
    RackListResponse,
    RackResponse,
    RackUpdate,
)

__all__ = [
    "AssignRequest",
    "CageActionResponse",
    "CageGridResponse",
    "CageResponse",
    "ProfessorActionResponse",
    "ProfessorCreate",
    "ProfessorInfo",
    "ProfessorListResponse",
    "ProfessorResponse",
    "ProfessorUpdate",
    "RackActionResponse",
    "RackCreate",
    "RackListResponse",
    "RackResponse",
    "RackUpdate",
    "ReleaseRequest",
]
