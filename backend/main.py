from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import collections, requests, environments, history, runner
from seed import seed_db

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Postman Clone API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event for Seeding
@app.on_event("startup")
async def startup_event():
    seed_db()

# Include Routers
app.include_router(collections.router, prefix="/api", tags=["Collections"])
app.include_router(requests.router, prefix="/api", tags=["Requests"])
app.include_router(environments.router, prefix="/api", tags=["Environments"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(runner.router, tags=["Runner"]) # prefix added in runner.py (/api)

@app.get("/")
def health_check():
    return {"status": "ok", "app": "API Client Platform Backend"}

@app.get("/api/test-get")
def test_get(name: str = "World"):
    return {"message": f"Hello, {name}! Your API Client Platform is working!"}

@app.post("/api/test-post")
def test_post(payload: dict = None):
    return {"received_payload": payload or {}, "status": "success"}
