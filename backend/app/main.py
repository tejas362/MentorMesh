from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import auth, alumni, recommendations, requests, messages, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed fictional demo data idempotently
    db = SessionLocal()
    try:
        seed_database(db, force=False)
    finally:
        db.close()
    yield

app = FastAPI(
    title="MentorMesh API",
    description="Professional alumni networking & AI-inspired mentorship platform. Tagline: Connect with Alumni. Build Your Future.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local frontend development effortlessly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(alumni.router)
app.include_router(recommendations.router)
app.include_router(requests.router)
app.include_router(messages.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {
        "project": "MentorMesh",
        "tagline": "Connect with Alumni. Build Your Future.",
        "version": "1.0.0",
        "docs_url": "/docs",
        "status": "healthy"
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "MentorMesh API"}
