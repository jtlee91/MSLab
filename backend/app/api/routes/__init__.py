"""API routes package."""

from app.api.routes.cages import router as cages_router
from app.api.routes.professors import router as professors_router
from app.api.routes.racks import router as racks_router

__all__ = ["cages_router", "professors_router", "racks_router"]
