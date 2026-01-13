"""FastAPI application entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown events."""
    # Startup: Initialize database tables
    await init_db()
    yield
    # Shutdown: Cleanup if needed


app = FastAPI(
    title="Todo Full-Stack Web Application API",
    description="RESTful API for multi-user todo task management with JWT authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Include routers
from app.routers.auth import router as auth_router
from app.routers.tasks import router as tasks_router

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["Tasks"])
