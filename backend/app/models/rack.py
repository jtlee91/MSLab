"""Rack model for cage containers."""

from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.cage import Cage


class Rack(Base):
    """Rack model - container for cages."""

    __tablename__ = "racks"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    rows: Mapped[int] = mapped_column(Integer)
    columns: Mapped[int] = mapped_column(Integer)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    cages: Mapped[list["Cage"]] = relationship(
        "Cage",
        back_populates="rack",
        cascade="all, delete-orphan",
    )
