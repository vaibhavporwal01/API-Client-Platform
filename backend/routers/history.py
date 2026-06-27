from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import History
from schemas import HistoryResponse

router = APIRouter(prefix="/history")

@router.get("", response_model=List[HistoryResponse])
def get_history(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return db.query(History).order_by(History.created_at.desc()).limit(limit).offset(offset).all()

@router.delete("/{history_id}")
def delete_history_item(history_id: str, db: Session = Depends(get_db)):
    item = db.query(History).filter(History.id == history_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "History entry deleted"}

@router.delete("")
def clear_history(db: Session = Depends(get_db)):
    db.query(History).delete()
    db.commit()
    return {"message": "History cleared"}
