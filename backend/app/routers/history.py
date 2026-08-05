from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import BagConfigurationHistory, SavedConfiguration
from app.schemas import HistoryItemResponse, SaveConfigPayload

router = APIRouter(prefix="", tags=["History & Favorites"])

@router.get("/history", response_model=List[HistoryItemResponse])
def get_generation_history(
    session_id: Optional[str] = None,
    search: Optional[str] = None,
    favorites_only: bool = False,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db)
):
    import json
    try:
        query = db.query(BagConfigurationHistory)
        
        if session_id and session_id.lower() not in ["default", "all", "*", ""]:
            query = query.filter(BagConfigurationHistory.session_id == session_id)
        if favorites_only:
            query = query.filter(BagConfigurationHistory.is_favorite == True)
        if search:
            query = query.filter(
                BagConfigurationHistory.generated_prompt.ilike(f"%{search}%")
            )

        items = query.order_by(BagConfigurationHistory.created_at.desc()).limit(limit).all()
        
        # Ensure config_json is parsed as dict if stored as JSON string
        for item in items:
            if isinstance(item.config_json, str):
                try:
                    item.config_json = json.loads(item.config_json)
                except Exception:
                    item.config_json = {}

        return items
    except Exception as err:
        print(f"[PEGMA HISTORY ROUTE WARNING] {err}")
        return []


@router.post("/history/{history_id}/favorite", response_model=HistoryItemResponse)
def toggle_favorite(history_id: int, db: Session = Depends(get_db)):
    item = db.query(BagConfigurationHistory).filter(BagConfigurationHistory.id == history_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="History record not found")
    
    item.is_favorite = not item.is_favorite
    db.commit()
    db.refresh(item)
    return item


@router.delete("/history/{history_id}")
def delete_history_item(history_id: int, db: Session = Depends(get_db)):
    item = db.query(BagConfigurationHistory).filter(BagConfigurationHistory.id == history_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="History record not found")
    
    db.delete(item)
    db.commit()
    return {"status": "deleted", "id": history_id}


@router.delete("/history")
def clear_all_history(session_id: str = "default", db: Session = Depends(get_db)):
    db.query(BagConfigurationHistory).filter(
        BagConfigurationHistory.session_id == session_id
    ).delete()
    db.commit()
    return {"status": "cleared", "session_id": session_id}


@router.post("/saved-config")
def save_configuration(payload: SaveConfigPayload, db: Session = Depends(get_db)):
    saved = SavedConfiguration(
        title=payload.title,
        description=payload.description,
        config_json=payload.config_json,
        thumbnail_url=payload.thumbnail_url
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return {"status": "saved", "id": saved.id, "title": saved.title}


@router.get("/saved-config")
def list_saved_configurations(db: Session = Depends(get_db)):
    return db.query(SavedConfiguration).order_by(SavedConfiguration.created_at.desc()).all()
