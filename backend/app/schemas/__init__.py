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
    ProfessorCreate,
    ProfessorListResponse,
    ProfessorResponse,
)
from app.schemas.rack import (
    RackCreate,
    RackListResponse,
    RackResponse,
)

__all__ = [
    "AssignRequest",
    "CageActionResponse",
    "CageGridResponse",
    "CageResponse",
    "ProfessorCreate",
    "ProfessorInfo",
    "ProfessorListResponse",
    "ProfessorResponse",
    "RackCreate",
    "RackListResponse",
    "RackResponse",
    "ReleaseRequest",
]
