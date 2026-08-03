from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from app.database import get_db
from app.models import PromptLog, ApiUsageCounter
from app.schemas import AdminLogResponse, ApiStatsResponse
from app.config import settings

router = APIRouter(prefix="/admin", tags=["Admin & Audit"])

@router.get("/logs", response_model=List[AdminLogResponse])
def get_prompt_logs(
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db)
):
    return db.query(PromptLog).order_by(PromptLog.timestamp.desc()).limit(limit).all()


@router.get("/stats", response_model=ApiStatsResponse)
def get_api_usage_stats(db: Session = Depends(get_db)):
    counter = db.query(ApiUsageCounter).first()
    active_key = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)
    
    if not counter:
        return ApiStatsResponse(
            total_generations=0,
            gemini_api_calls=0,
            fallback_generations=0,
            active_key=active_key
        )

    return ApiStatsResponse(
        total_generations=counter.total_generations,
        gemini_api_calls=counter.gemini_api_calls,
        fallback_generations=counter.fallback_generations,
        active_key=active_key
    )


@router.post("/set-key")
def update_gemini_api_key(api_key: str):
    settings.GEMINI_API_KEY = api_key
    os.environ["GEMINI_API_KEY"] = api_key
    return {"status": "updated", "active_key": bool(api_key and len(api_key.strip()) > 5)}
