import uuid
import json
from datetime import datetime
from sqlalchemy.orm import Session
from models import Collection, SavedRequest, Environment, EnvVar, History
from database import SessionLocal

def seed_db():
    db = SessionLocal()
    try:
        if db.query(Collection).count() > 0:
            return

        # 1. Environments
        dev_env_id = str(uuid.uuid4())
        dev_env = Environment(id=dev_env_id, name="Development", is_active=1)
        db.add(dev_env)
        
        prod_env_id = str(uuid.uuid4())
        prod_env = Environment(id=prod_env_id, name="Production", is_active=0)
        db.add(prod_env)
        
        # Env Vars
        db.add(EnvVar(id=str(uuid.uuid4()), env_id=dev_env_id, key="base_url", value="https://jsonplaceholder.typicode.com", enabled=1))
        db.add(EnvVar(id=str(uuid.uuid4()), env_id=dev_env_id, key="api_token", value="dev_token_123", enabled=1))
        db.add(EnvVar(id=str(uuid.uuid4()), env_id=dev_env_id, key="user_id", value="1", enabled=1))
        
        # 2. Collections
        col1_id = str(uuid.uuid4())
        db.add(Collection(id=col1_id, name="JSONPlaceholder Tests", description="Tests for public JSON API"))
        
        col2_id = str(uuid.uuid4())
        db.add(Collection(id=col2_id, name="HTTPBin Collection", description="Utility endpoints"))
        
        # 3. Requests for Collection 1
        for i in range(5):
            db.add(SavedRequest(
                id=str(uuid.uuid4()),
                collection_id=col1_id,
                name=f"Get Posts {i+1}",
                method="GET",
                url="{{base_url}}/posts",
                position=i
            ))
            
        # Requests for Collection 2
        for i in range(5):
            db.add(SavedRequest(
                id=str(uuid.uuid4()),
                collection_id=col2_id,
                name=f"Echo Request {i+1}",
                method="POST",
                url="https://httpbin.org/post",
                body_type="json",
                body_raw='{"msg": "hello world"}',
                position=i
            ))
            
        # 4. History
        for i in range(3):
            db.add(History(
                id=str(uuid.uuid4()),
                method="GET",
                url="https://jsonplaceholder.typicode.com/posts/1",
                status_code=200,
                status_text="OK",
                response_time_ms=150 + (i*10),
                created_at=datetime.utcnow()
            ))
            
        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
