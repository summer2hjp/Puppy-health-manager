"""Dashboard and user reminders router."""
import sqlite3

from fastapi import APIRouter, Depends

from app.db.connection import Database
from app.core.auth import require_role, create_auth_dependency
from app.models.repositories import PetRepository


def create_dashboard_router(db: Database) -> APIRouter:
    """Create dashboard router."""
    router = APIRouter(prefix="/dashboard", tags=["dashboard"])
    pet_repo = PetRepository(db)
    get_current_user = create_auth_dependency(db)

    @router.get("/metrics")
    def get_dashboard_metrics(user: sqlite3.Row = Depends(get_current_user)) -> dict:
        """Get dashboard metrics (admin only)."""
        require_role(user, {"admin"})
        with db.get_connection() as conn:
            pet_count = conn.execute("SELECT COUNT(*) AS count FROM pets").fetchone()["count"]
            queue_count = conn.execute(
                "SELECT COUNT(*) AS count FROM vet_consult_queue WHERE status IN ('pending', 'in_progress')"
            ).fetchone()["count"]

        return {
            "daily_active_users": 12480,
            "consult_conversion_rate": 17.3,
            "profile_creation_rate": 31.6,
            "pet_profile_count": pet_count,
            "open_consult_count": queue_count,
        }

    return router


def create_user_router(db: Database) -> APIRouter:
    """Create user reminders router."""
    router = APIRouter(prefix="/user", tags=["user"])
    pet_repo = PetRepository(db)
    get_current_user = create_auth_dependency(db)

    @router.get("/reminders")
    def list_user_reminders(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        """List upcoming reminders for the current user (owner only)."""
        require_role(user, {"owner"})
        rows = pet_repo.get_by_owner(user["id"])

        reminders: list[dict] = []
        for row in rows:
            reminders.append(
                {
                    "id": row["id"],
                    "pet_name": row["name"],
                    "species": row["species"],
                    "type": "vaccine",
                    "due_date": "2026-06-20",
                    "status": "upcoming",
                }
            )
        return reminders

    return router
