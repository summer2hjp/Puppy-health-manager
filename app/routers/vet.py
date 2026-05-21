"""Veterinary queue router."""
import sqlite3

from fastapi import APIRouter, Depends, HTTPException, status

from app.db.connection import Database
from app.core.auth import require_role
from app.models.repositories import VetQueueRepository


def create_vet_router(db: Database) -> APIRouter:
    """Create veterinary queue router."""
    router = APIRouter(prefix="/vet", tags=["veterinary"])
    vet_repo = VetQueueRepository(db)

    @router.get("/queue")
    def list_vet_queue(user: sqlite3.Row = Depends(lambda: None)) -> list[dict]:
        """List all items in the veterinary consultation queue (vet only)."""
        require_role(user, {"vet"})
        rows = vet_repo.get_all()

        return [
            {
                "id": row["id"],
                "owner": row["owner_name"],
                "symptom": row["symptom"],
                "level": row["level"],
                "status": row["status"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
            for row in rows
        ]

    @router.post("/queue/{queue_id}/start")
    def start_vet_consult(queue_id: int, user: sqlite3.Row = Depends(lambda: None)) -> dict:
        """Start a veterinary consultation (vet only)."""
        require_role(user, {"vet"})
        current = vet_repo.get_by_id(queue_id)
        if current is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queue item not found")

        updated_at = vet_repo.update_status(queue_id, "in_progress")
        return {"id": queue_id, "status": "in_progress", "updated_at": updated_at}

    return router
