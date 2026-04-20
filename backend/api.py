from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import pandas as pd
import analytics
from database import get_db
from models import Accident
from schemas import AccidentCreate

router = APIRouter()

@router.post("/accidents/", status_code=status.HTTP_201_CREATED)
async def create_accident(accident_in: AccidentCreate, db: AsyncSession = Depends(get_db)):
    """
    Receives a new accident report from the React Admin Form and inserts it into PostgreSQL.
    """
    new_accident = Accident(**accident_in.model_dump())
    db.add(new_accident)
    try:
        await db.commit()
        await db.refresh(new_accident)
        return {"message": "Accident logged successfully", "id": str(new_accident.incident_id)}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# --- Analytics Endpoints ---

@router.get("/analytics/kpis/", response_model=dict)
async def get_kpis_endpoint(db: AsyncSession = Depends(get_db)):
    """Fetch high-level KPI dashboard metrics"""
    result = await db.execute(select(Accident))
    records = result.scalars().all()
    if not records:
        return {}
    
    # Convert SQLAlchemy instances to dictionaries for Pandas
    df = pd.DataFrame([{c.name: getattr(r, c.name) for c in r.__table__.columns} for r in records])
    return analytics.get_kpis(df)

@router.get("/analytics/trends/", response_model=list)
async def get_trends_endpoint(db: AsyncSession = Depends(get_db)):
    """Fetch time block trends to populate Recharts graphs"""
    result = await db.execute(select(Accident))
    records = result.scalars().all()
    if not records:
        return []
        
    df = pd.DataFrame([{c.name: getattr(r, c.name) for c in r.__table__.columns} for r in records])
    return analytics.get_time_trends(df)

@router.get("/analytics/indian-context/", response_model=dict)
async def get_indian_context_endpoint(db: AsyncSession = Depends(get_db)):
    """Analyze localized elements: wrong way driving, stray animals, potholes"""
    result = await db.execute(select(Accident))
    records = result.scalars().all()
    if not records:
        return {}
        
    df = pd.DataFrame([{c.name: getattr(r, c.name) for c in r.__table__.columns} for r in records])
    return analytics.get_indian_context(df)

