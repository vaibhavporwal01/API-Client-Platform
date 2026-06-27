import re
from sqlalchemy.orm import Session
from models import Environment, EnvVar
from schemas import RunRequest

VARIABLE_PATTERN = r"\{\{([^{}]+)\}\}"

def resolve_variables(payload: RunRequest, db: Session) -> RunRequest:
    # 1. Query active environment
    active_env = db.query(Environment).filter(Environment.is_active == 1).first()
    
    # 2. Load enabled env_vars into dict
    env_vars = {}
    if active_env:
        vars_list = db.query(EnvVar).filter(EnvVar.env_id == active_env.id, EnvVar.enabled == 1).all()
        env_vars = {v.key: v.value for v in vars_list}

    def replace_match(match):
        key = match.group(1).strip()
        return env_vars.get(key, match.group(0)) # Return original if not found

    # 3. Replace {{key}} in specific fields
    
    # URL
    payload.url = re.sub(VARIABLE_PATTERN, replace_match, payload.url)
    
    # Headers values
    for h in payload.headers:
        if h.value:
            h.value = re.sub(VARIABLE_PATTERN, replace_match, h.value)
            
    # Body raw
    if payload.body_raw:
        payload.body_raw = re.sub(VARIABLE_PATTERN, replace_match, payload.body_raw)
        
    # Auth data values
    resolved_auth = {}
    for k, v in payload.auth_data.items():
        if isinstance(v, str):
            resolved_auth[k] = re.sub(VARIABLE_PATTERN, replace_match, v)
        else:
            resolved_auth[k] = v
    payload.auth_data = resolved_auth

    return payload
