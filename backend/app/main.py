"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import cages_router, dashboard_router, professors_router, racks_router, reports_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="MSLab Cage Management API",
    description="연구실 케이지 관리 서비스 API",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(racks_router, prefix="/api")
app.include_router(cages_router, prefix="/api")
app.include_router(professors_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(reports_router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "MSLab API is running"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to MSLab Cage Management API"}
