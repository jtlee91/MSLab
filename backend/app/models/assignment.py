"""Assignment model for cage usage history."""

from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Index, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.cage import Cage
    from app.models.professor import Professor
    from app.models.user import User


class Assignment(Base):
    """Assignment model - tracks cage usage and billing."""

    __tablename__ = "assignments"
    __table_args__ = (
        Index("ix_assignments_cage_date", "cage_id", "assigned_date"),
        Index("ix_assignments_professor_date", "professor_id", "assigned_date"),
        Index("ix_assignments_date", "assigned_date"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    cage_id: Mapped[int] = mapped_column(ForeignKey("cages.id"), index=True)
    professor_id: Mapped[int] = mapped_column(ForeignKey("professors.id"), index=True)
    assigned_by_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    assigned_date: Mapped[date] = mapped_column(Date)  # Billing date
    assigned_at: Mapped[datetime] = mapped_column(DateTime)  # Actual assignment time
    released_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    cost: Mapped[int] = mapped_column(Integer, default=800)  # Daily cost in KRW

    # Relationships
    cage: Mapped["Cage"] = relationship("Cage", back_populates="assignments")
    professor: Mapped["Professor"] = relationship("Professor", back_populates="assignments")
    assigned_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="assignments",
        foreign_keys=[assigned_by_user_id],
    )
