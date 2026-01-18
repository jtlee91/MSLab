"""Dashboard API routes."""

from datetime import date, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Assignment, Cage, Professor, Rack
from app.schemas import (
    DailyCost,
    DashboardCostsResponse,
    DashboardProfessorsResponse,
    DashboardSummaryResponse,
    ProfessorCostSummary,
    ProfessorUsage,
    RackSummary,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

COST_PER_CAGE_DAY = 800


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get rack usage summary for dashboard."""
    racks = db.query(Rack).order_by(Rack.display_order).all()

    rack_summaries = []
    total_cages = 0
    total_used = 0

    for rack in racks:
        cage_count = rack.rows * rack.columns
        used_count = (
            db.query(Cage)
            .filter(Cage.rack_id == rack.id, Cage.current_professor_id.isnot(None))
            .count()
        )
        available_count = cage_count - used_count
        usage_rate = (used_count / cage_count * 100) if cage_count > 0 else 0

        rack_summaries.append(
            RackSummary(
                rack_id=rack.id,
                rack_name=rack.name,
                total_cages=cage_count,
                used_cages=used_count,
                available_cages=available_count,
                usage_rate=round(usage_rate, 1),
            )
        )

        total_cages += cage_count
        total_used += used_count

    total_available = total_cages - total_used
    overall_usage_rate = (total_used / total_cages * 100) if total_cages > 0 else 0

    return DashboardSummaryResponse(
        total_racks=len(racks),
        total_cages=total_cages,
        total_used=total_used,
        total_available=total_available,
        overall_usage_rate=round(overall_usage_rate, 1),
        racks=rack_summaries,
    )


@router.get("/professors", response_model=DashboardProfessorsResponse)
def get_dashboard_professors(db: Session = Depends(get_db)):
    """Get professor cage usage for dashboard."""
    professors = db.query(Professor).order_by(Professor.name).all()

    professor_usages = []
    for professor in professors:
        cage_count = (
            db.query(Cage)
            .filter(Cage.current_professor_id == professor.id)
            .count()
        )
        professor_usages.append(
            ProfessorUsage(
                professor_id=professor.id,
                professor_name=professor.name,
                color_code=professor.color_code,
                cage_count=cage_count,
            )
        )

    # Sort by cage_count descending, then by name
    professor_usages.sort(key=lambda x: (-x.cage_count, x.professor_name))

    return DashboardProfessorsResponse(professors=professor_usages)


@router.get("/costs", response_model=DashboardCostsResponse)
def get_dashboard_costs(
    period: Literal["daily", "weekly", "monthly"] = Query(default="weekly"),
    db: Session = Depends(get_db),
):
    """Get cost chart data for dashboard."""
    today = date.today()

    if period == "daily":
        start_date = today - timedelta(days=6)
    elif period == "weekly":
        start_date = today - timedelta(weeks=4)
    else:  # monthly
        start_date = today - timedelta(days=90)

    end_date = today

    # Get assignments in the date range
    assignments = (
        db.query(Assignment)
        .filter(
            Assignment.assigned_date >= start_date,
            Assignment.assigned_date <= end_date,
        )
        .all()
    )

    # Build professor lookup
    professors = {p.id: p for p in db.query(Professor).all()}

    # Build daily costs
    daily_costs_map: dict[tuple[date, int], int] = {}
    for assignment in assignments:
        key = (assignment.assigned_date, assignment.professor_id)
        daily_costs_map[key] = daily_costs_map.get(key, 0) + 1

    daily_costs = []
    for (assigned_date, professor_id), cage_count in sorted(daily_costs_map.items()):
        professor = professors.get(professor_id)
        if professor:
            daily_costs.append(
                DailyCost(
                    date=assigned_date,
                    professor_id=professor_id,
                    professor_name=professor.name,
                    color_code=professor.color_code,
                    cage_count=cage_count,
                    cost=cage_count * COST_PER_CAGE_DAY,
                )
            )

    # Build professor summaries
    professor_totals: dict[int, int] = {}
    for assignment in assignments:
        professor_totals[assignment.professor_id] = (
            professor_totals.get(assignment.professor_id, 0) + 1
        )

    professor_summaries = []
    for professor_id, total_cage_days in professor_totals.items():
        professor = professors.get(professor_id)
        if professor:
            professor_summaries.append(
                ProfessorCostSummary(
                    professor_id=professor_id,
                    professor_name=professor.name,
                    color_code=professor.color_code,
                    total_cage_days=total_cage_days,
                    total_cost=total_cage_days * COST_PER_CAGE_DAY,
                )
            )

    # Sort by total_cost descending
    professor_summaries.sort(key=lambda x: -x.total_cost)

    total_cost = sum(s.total_cost for s in professor_summaries)

    return DashboardCostsResponse(
        period=period,
        start_date=start_date,
        end_date=end_date,
        cost_per_cage_day=COST_PER_CAGE_DAY,
        total_cost=total_cost,
        daily_costs=daily_costs,
        professor_summaries=professor_summaries,
    )
