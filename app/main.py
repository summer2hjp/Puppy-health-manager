"""Main application entry point."""
import sqlite3

from fastapi import Depends, FastAPI, HTTPException, status

from app.db.connection import Database
from app.db.init import init_database
from app.core.auth import create_auth_dependency, require_role
from app.routers.auth import create_auth_router
from app.routers.pets import create_pet_router
from app.routers.vet import create_vet_router
from app.routers.cms import create_cms_router
from app.routers.dashboard import create_dashboard_router, create_user_router
from app.schemas.requests import PetCreateRequest, WeightRecordCreateRequest, CmsSubmissionUpdateRequest
from app.models.repositories import (
    PetRepository,
    WeightRecordRepository,
    VetQueueRepository,
    CmsSubmissionRepository,
)


def create_app(db_path: str = "data/app.db") -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title="Puppy Health Manager API", version="0.1.0")

    # Initialize database
    db = Database(db_path)
    init_database(db)

    # Create auth dependency
    get_current_user = create_auth_dependency(db)

    # Include routers
    auth_router = create_auth_router(db)
    app.include_router(auth_router)

    pet_router = create_pet_router(db)
    app.include_router(pet_router)

    vet_router = create_vet_router(db)
    app.include_router(vet_router)

    cms_router = create_cms_router(db)
    app.include_router(cms_router)

    dashboard_router = create_dashboard_router(db)
    app.include_router(dashboard_router)

    user_router = create_user_router(db)
    app.include_router(user_router)

    # Health check endpoint
    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
