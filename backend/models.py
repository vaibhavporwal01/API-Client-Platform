import uuid
import json
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Collection(Base):
    __tablename__ = "collections"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(String, ForeignKey("collections.id"), nullable=True)
    position = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    parent = relationship("Collection", remote_side=[id], backref="sub_collections")
    requests = relationship("SavedRequest", back_populates="collection", cascade="all, delete-orphan")

class SavedRequest(Base):
    __tablename__ = "saved_requests"
    id = Column(String, primary_key=True, default=generate_uuid)
    collection_id = Column(String, ForeignKey("collections.id"), nullable=False)
    name = Column(String, nullable=False)
    method = Column(String, nullable=False)
    url = Column(Text, nullable=False)
    headers = Column(Text, default="[]") # Store as JSON string
    params = Column(Text, default="[]")  # Store as JSON string
    body_type = Column(String, default="none")
    body_raw = Column(Text, nullable=True)
    body_form = Column(Text, default="[]") # Store as JSON string
    auth_type = Column(String, default="none")
    auth_data = Column(Text, default="{}") # Store as JSON string
    pre_request_script = Column(Text, nullable=True)
    test_script = Column(Text, nullable=True)
    position = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    collection = relationship("Collection", back_populates="requests")

class Environment(Base):
    __tablename__ = "environments"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    is_active = Column(Integer, default=0) # 1 for active, 0 for inactive
    created_at = Column(DateTime, default=datetime.utcnow)

    vars = relationship("EnvVar", back_populates="environment", cascade="all, delete-orphan")

class EnvVar(Base):
    __tablename__ = "env_vars"
    id = Column(String, primary_key=True, default=generate_uuid)
    env_id = Column(String, ForeignKey("environments.id"), nullable=False)
    key = Column(String, nullable=False)
    value = Column(Text, nullable=True)
    enabled = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    environment = relationship("Environment", back_populates="vars")

class History(Base):
    __tablename__ = "history"
    id = Column(String, primary_key=True, default=generate_uuid)
    method = Column(String, nullable=False)
    url = Column(Text, nullable=False)
    headers = Column(Text, default="[]")
    params = Column(Text, default="[]")
    body_type = Column(String, default="none")
    body_raw = Column(Text, nullable=True)
    auth_type = Column(String, default="none")
    auth_data = Column(Text, default="{}")
    status_code = Column(Integer, nullable=True)
    status_text = Column(String, nullable=True)
    response_headers = Column(Text, default="{}")
    response_body = Column(Text, nullable=True)
    response_size_bytes = Column(Integer, default=0)
    response_time_ms = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
