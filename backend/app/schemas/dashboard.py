"""Pydantic schemas for Dashboard API."""

from datetime import date
from pydantic import BaseModel


class RackSummary(BaseModel):
    """Summary for a single rack."""
    rack_id: int
    rack_name: str
    total_cages: int
    used_cages: int
    available_cages: int
    usage_rate: float


class DashboardSummaryResponse(BaseModel):
    """Response for dashboard summary - rack usage overview."""
    total_racks: int
    total_cages: int
    total_used: int
    total_available: int
    overall_usage_rate: float
    racks: list[RackSummary]


class ProfessorUsage(BaseModel):
    """Usage info for a single professor."""
    professor_id: int
    professor_name: str
    color_code: str
    cage_count: int


class DashboardProfessorsResponse(BaseModel):
    """Response for dashboard professors - professor usage list."""
    professors: list[ProfessorUsage]


class DailyCost(BaseModel):
    """Cost data for a single day."""
    date: date
    professor_id: int
    professor_name: str
    color_code: str
    cage_count: int
    cost: int


class ProfessorCostSummary(BaseModel):
    """Cost summary for a single professor."""
    professor_id: int
    professor_name: str
    color_code: str
    total_cage_days: int
    total_cost: int


class DashboardCostsResponse(BaseModel):
    """Response for dashboard costs - cost chart data."""
    period: str
    start_date: date
    end_date: date
    cost_per_cage_day: int
    total_cost: int
    daily_costs: list[DailyCost]
    professor_summaries: list[ProfessorCostSummary]
