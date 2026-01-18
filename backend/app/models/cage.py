"""Cage model."""

from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.assignment import Assignment
    from app.models.professor import Professor
    from app.models.rack import Rack


class Cage(Base):
    """Cage model - individual cage units in a rack."""

    __tablename__ = "cages"
    __table_args__ = (
        Index("ix_cages_rack_position", "rack_id", "row_index", "col_index", unique=True),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    rack_id: Mapped[int] = mapped_column(ForeignKey("racks.id"), index=True)
    position: Mapped[str] = mapped_column(String(10))  # e.g., "A1", "B2"
    row_index: Mapped[int] = mapped_column(Integer)
    col_index: Mapped[int] = mapped_column(Integer)
    current_professor_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("professors.id"),
        nullable=True,
    )
    version: Mapped[int] = mapped_column(Integer, default=1)  # Optimistic locking

    # Relationships
    rack: Mapped["Rack"] = relationship("Rack", back_populates="cages")
    current_professor: Mapped[Optional["Professor"]] = relationship(
        "Professor",
        back_populates="cages",
        foreign_keys=[current_professor_id],
    )
    assignments: Mapped[list["Assignment"]] = relationship(
        "Assignment",
        back_populates="cage",
        cascade="all, delete-orphan",
    )
