import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Environment, EnvVar
from schemas import (
    EnvironmentCreate, EnvironmentUpdate, EnvironmentResponse,
    EnvVarBase, EnvVarResponse
)

router = APIRouter(prefix="/environments")

@router.get("", response_model=List[EnvironmentResponse])
def list_environments(db: Session = Depends(get_db)):
    return db.query(Environment).all()

@router.post("", response_model=EnvironmentResponse)
def create_environment(payload: EnvironmentCreate, db: Session = Depends(get_db)):
    new_env = Environment(
        id=str(uuid.uuid4()),
        name=payload.name,
        is_active=payload.is_active
    )
    if new_env.is_active:
        # Reset others
        db.query(Environment).update({Environment.is_active: 0})
        
    db.add(new_env)
    db.commit()
    db.refresh(new_env)
    return new_env

@router.put("/{env_id}", response_model=EnvironmentResponse)
def update_environment(env_id: str, payload: EnvironmentUpdate, db: Session = Depends(get_db)):
    env = db.query(Environment).filter(Environment.id == env_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    if payload.name is not None:
        env.name = payload.name
    
    if payload.is_active is not None:
        if payload.is_active == 1:
            db.query(Environment).filter(Environment.id != env_id).update({Environment.is_active: 0})
        env.is_active = payload.is_active
        
    db.commit()
    db.refresh(env)
    return env

@router.delete("/{env_id}")
def delete_environment(env_id: str, db: Session = Depends(get_db)):
    env = db.query(Environment).filter(Environment.id == env_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    db.delete(env)
    db.commit()
    return {"message": "Environment deleted"}

@router.get("/{env_id}/vars", response_model=List[EnvVarResponse])
def list_vars(env_id: str, db: Session = Depends(get_db)):
    return db.query(EnvVar).filter(EnvVar.env_id == env_id).all()

@router.put("/{env_id}/vars")
def update_vars(env_id: str, payload: List[EnvVarBase], db: Session = Depends(get_db)):
    env = db.query(Environment).filter(Environment.id == env_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # 1. Delete existing vars
    db.query(EnvVar).filter(EnvVar.env_id == env_id).delete()
    
    # 2. Insert new vars
    for v in payload:
        new_var = EnvVar(
            id=str(uuid.uuid4()),
            env_id=env_id,
            key=v.key,
            value=v.value,
            enabled=v.enabled
        )
        db.add(new_var)
        
    db.commit()
    return {"message": "Variables updated"}
