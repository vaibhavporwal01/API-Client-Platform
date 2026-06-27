import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Collection
from schemas import CollectionCreate, CollectionUpdate, CollectionResponse, SavedRequestResponse

router = APIRouter(prefix="/collections")

def build_collection_tree(collections: List[Collection], parent_id: Optional[str] = None):
    tree = []
    for c in collections:
        if c.parent_id == parent_id:
            # Build node with nested children
            node = {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "parent_id": c.parent_id,
                "position": c.position,
                "created_at": c.created_at,
                "updated_at": c.updated_at,
                "children": build_collection_tree(collections, c.id),
                "requests": [SavedRequestResponse.model_validate(r).model_dump() for r in c.requests]
            }
            tree.append(node)
    return tree

@router.get("", response_model=List[dict])
def get_collections(db: Session = Depends(get_db)):
    all_collections = db.query(Collection).all()
    return build_collection_tree(all_collections)

@router.post("", response_model=CollectionResponse)
def create_collection(payload: CollectionCreate, db: Session = Depends(get_db)):
    new_col = Collection(
        id=str(uuid.uuid4()),
        name=payload.name,
        description=payload.description,
        parent_id=payload.parent_id,
        position=payload.position
    )
    db.add(new_col)
    db.commit()
    db.refresh(new_col)
    return new_col

@router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(collection_id: str, payload: CollectionUpdate, db: Session = Depends(get_db)):
    col = db.query(Collection).filter(Collection.id == collection_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    if payload.name is not None: col.name = payload.name
    if payload.description is not None: col.description = payload.description
    if payload.parent_id is not None: col.parent_id = payload.parent_id
    if payload.position is not None: col.position = payload.position
    
    db.commit()
    db.refresh(col)
    return col

@router.delete("/{collection_id}")
def delete_collection(collection_id: str, db: Session = Depends(get_db)):
    col = db.query(Collection).filter(Collection.id == collection_id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    db.delete(col)
    db.commit()
    return {"message": "Collection deleted successfully"}
