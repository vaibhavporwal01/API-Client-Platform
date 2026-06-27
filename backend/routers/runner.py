import json
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import History
from schemas import RunRequest, RunResponse
from services import runner_service, variable_service

router = APIRouter(prefix="/api")

@router.post("/run", response_model=RunResponse)
async def run_api_request(payload: RunRequest, db: Session = Depends(get_db)):
    # 1. Resolve variables
    resolved_payload = variable_service.resolve_variables(payload, db)
    
    # 2. Execute request
    result = await runner_service.execute_request(resolved_payload)
    
    # 3. Save to history table
    history_id = str(uuid.uuid4())
    history_entry = History(
        id=history_id,
        method=payload.method,
        url=payload.url,
        headers=json.dumps([h.model_dump() for h in payload.headers]),
        params=json.dumps([p.model_dump() for p in payload.params]),
        body_type=payload.body_type,
        body_raw=payload.body_raw,
        auth_type=payload.auth_type,
        auth_data=json.dumps(payload.auth_data),
        status_code=result["status_code"],
        status_text=result["status_text"],
        response_headers=json.dumps(result["response_headers"]),
        response_body=result["response_body"],
        response_size_bytes=result["response_size_bytes"],
        response_time_ms=result["response_time_ms"],
        error_message=result["error_message"]
    )
    
    db.add(history_entry)
    db.commit()
    
    # 4. Return RunResponse
    return RunResponse(
        status_code=result["status_code"],
        status_text=result["status_text"],
        response_headers=result["response_headers"],
        response_body=result["response_body"],
        response_size_bytes=result["response_size_bytes"],
        response_time_ms=result["response_time_ms"],
        error_message=result["error_message"],
        history_id=history_id
    )
