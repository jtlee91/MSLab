"""API routes package."""

from app.api.routes.cages import router as cages_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.professors import router as professors_router
from app.api.routes.racks import router as racks_router
from app.api.routes.reports import router as reports_router

__all__ = ["cages_router", "dashboard_router", "professors_router", "racks_router", "reports_router"]
