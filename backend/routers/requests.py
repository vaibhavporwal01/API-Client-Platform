import uuid
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import SavedRequest, Collection
from schemas import SavedRequestCreate, SavedRequestUpdate, SavedRequestResponse

router = APIRouter(prefix="/requests")

@router.get("", response_model=List[SavedRequestResponse])
def list_requests(collection_id: str, db: Session = Depends(get_db)):
    return db.query(SavedRequest).filter(SavedRequest.collection_id == collection_id).order_by(SavedRequest.position).all()

@router.post("", response_model=SavedRequestResponse)
def create_request(payload: SavedRequestCreate, db: Session = Depends(get_db)):
    # Check if collection exists
    col = db.query(Collection).filter(Collection.id == payload.collection_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")

    new_req = SavedRequest(
        id=str(uuid.uuid4()),
        collection_id=payload.collection_id,
        name=payload.name,
        method=payload.method,
        url=payload.url,
        headers=payload.headers, # Already JSON string from schema or client
        params=payload.params,
        body_type=payload.body_type,
        body_raw=payload.body_raw,
        body_form=payload.body_form,
        auth_type=payload.auth_type,
        auth_data=payload.auth_data,
        pre_request_script=payload.pre_request_script,
        test_script=payload.test_script,
        position=payload.position
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@router.put("/{request_id}", response_model=SavedRequestResponse)
def update_request(request_id: str, payload: SavedRequestUpdate, db: Session = Depends(get_db)):
    req = db.query(SavedRequest).filter(SavedRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(req, key, value)
    
    db.commit()
    db.refresh(req)
    return req

@router.delete("/{request_id}")
def delete_request(request_id: str, db: Session = Depends(get_db)):
    req = db.query(SavedRequest).filter(SavedRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    db.delete(req)
    db.commit()
    return {"message": "Request deleted"}
