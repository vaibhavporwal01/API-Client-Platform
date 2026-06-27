from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

# Utility Schema
class KVItem(BaseModel):
    key: str
    value: str
    enabled: bool = True

# --- Collection Schemas ---
class CollectionBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    position: int = 0

class CollectionCreate(CollectionBase):
    pass

class CollectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[str] = None
    position: Optional[int] = None

class CollectionResponse(CollectionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Saved Request Schemas ---
class SavedRequestBase(BaseModel):
    name: str
    method: str
    url: str
    headers: str = "[]"
    params: str = "[]"
    body_type: str = "none"
    body_raw: Optional[str] = None
    body_form: str = "[]"
    auth_type: str = "none"
    auth_data: str = "{}"
    pre_request_script: Optional[str] = None
    test_script: Optional[str] = None
    position: int = 0

class SavedRequestCreate(SavedRequestBase):
    collection_id: str

class SavedRequestUpdate(BaseModel):
    name: Optional[str] = None
    method: Optional[str] = None
    url: Optional[str] = None
    headers: Optional[str] = None
    params: Optional[str] = None
    body_type: Optional[str] = None
    body_raw: Optional[str] = None
    body_form: Optional[str] = None
    auth_type: Optional[str] = None
    auth_data: Optional[str] = None
    pre_request_script: Optional[str] = None
    test_script: Optional[str] = None
    position: Optional[int] = None
    collection_id: Optional[str] = None

class SavedRequestResponse(SavedRequestBase):
    id: str
    collection_id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Environment Schemas ---
class EnvironmentBase(BaseModel):
    name: str
    is_active: int = 0

class EnvironmentCreate(EnvironmentBase):
    pass

class EnvironmentUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[int] = None

class EnvironmentResponse(EnvironmentBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Env Var Schemas ---
class EnvVarBase(BaseModel):
    key: str
    value: Optional[str] = None
    enabled: int = 1

class EnvVarCreate(EnvVarBase):
    env_id: str

class EnvVarUpdate(BaseModel):
    key: Optional[str] = None
    value: Optional[str] = None
    enabled: Optional[int] = None

class EnvVarResponse(EnvVarBase):
    id: str
    env_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- History Schemas ---
class HistoryResponse(BaseModel):
    id: str
    method: str
    url: str
    headers: str
    params: str
    body_type: str
    body_raw: Optional[str]
    auth_type: str
    auth_data: str
    status_code: Optional[int]
    status_text: Optional[str]
    response_headers: str
    response_body: Optional[str]
    response_size_bytes: int
    response_time_ms: int
    error_message: Optional[str]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Runner Schemas ---
class RunRequest(BaseModel):
    method: str
    url: str
    headers: List[KVItem] = []
    params: List[KVItem] = []
    body_type: str = "none"
    body_raw: Optional[str] = None
    body_form: List[KVItem] = []
    auth_type: str = "none"
    auth_data: Dict[str, Any] = {}

class RunResponse(BaseModel):
    status_code: Optional[int]
    status_text: Optional[str]
    response_headers: Dict[str, str]
    response_body: Optional[str]
    response_size_bytes: int
    response_time_ms: int
    error_message: Optional[str]
    history_id: Optional[str]
