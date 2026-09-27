from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.sql_models import ModelMetrics
from app.schemas.pydantic_schemas import MLMetricsResponse

router = APIRouter(prefix="/api/model", tags=["ML Metrics"])

@router.get("/metrics", response_model=List[MLMetricsResponse])
def get_model_metrics(db: Session = Depends(get_db)):
    metrics = db.query(ModelMetrics).all()
    return metrics

