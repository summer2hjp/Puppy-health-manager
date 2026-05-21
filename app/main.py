"""Main application entry point."""
from fastapi import FastAPI

from app.db.connection import Database
from app.db.init import init_database
from app.routers.auth import create_auth_router
from app.routers.pets import create_pet_router
from app.routers.vet import create_vet_router
from app.routers.cms import create_cms_router
from app.routers.dashboard import create_dashboard_router, create_user_router


def create_app(db_path: str = "data/app.db") -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title="Puppy Health Manager API", version="0.1.0")

    # Initialize database
    db = Database(db_path)
    init_database(db)

    # Include routers
    app.include_router(create_auth_router(db))
    app.include_router(create_pet_router(db))
    app.include_router(create_vet_router(db))
    app.include_router(create_cms_router(db))
    app.include_router(create_dashboard_router(db))
    app.include_router(create_user_router(db))

    # Health check endpoint
    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
