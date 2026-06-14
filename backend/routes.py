from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import queries

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(
    format: str = Query(default="All"),
    year: Optional[str] = None,
    opponent: Optional[str] = None,
    venue: Optional[str] = None,
    homeAway: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # Ab backend saare filters ko accept karega aur queries.py ko bheja karega
    return queries.fetch_dashboard_data(
        db,
        format_filter=format,
        year_filter=year,
        opponent_filter=opponent,
        venue_filter=venue,
        home_away_filter=homeAway,
    )