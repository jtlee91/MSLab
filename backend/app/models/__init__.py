"""Models package - exports all models."""

from app.models.assignment import Assignment
from app.models.base import TimestampMixin
from app.models.cage import Cage
from app.models.professor import Professor
from app.models.rack import Rack
from app.models.user import User

__all__ = [
    "Assignment",
    "Cage",
    "Professor",
    "Rack",
    "TimestampMixin",
    "User",
]
