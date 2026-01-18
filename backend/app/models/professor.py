"""Professor model."""

from typing import TYPE_CHECKING, Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.assignment import Assignment
    from app.models.cage import Cage


class Professor(Base):
    """Professor model - researchers who use cages."""

    __tablename__ = "professors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    student_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    color_code: Mapped[str] = mapped_column(String(7), default="#3B82F6")  # UI color (HEX)

    # Relationships
    cages: Mapped[list["Cage"]] = relationship(
        "Cage",
        back_populates="current_professor",
        foreign_keys="Cage.current_professor_id",
    )
    assignments: Mapped[list["Assignment"]] = relationship(
        "Assignment",
        back_populates="professor",
    )
