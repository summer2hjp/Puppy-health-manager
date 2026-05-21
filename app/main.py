"""Main application entry point."""
import sqlite3

from fastapi import Depends, FastAPI, HTTPException, status

from app.db.connection import Database
from app.db.init import init_database
from app.core.auth import create_auth_dependency, require_role
from app.routers.auth import create_auth_router
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

    # Health check endpoint
    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    # Pet endpoints
    @app.post("/pets", status_code=status.HTTP_201_CREATED)
    def create_pet(payload: PetCreateRequest, user: sqlite3.Row = Depends(get_current_user)) -> dict:
        pet_repo = PetRepository(db)
        pet_id = pet_repo.create(owner_id=user["id"], **payload.model_dump())
        return {"id": pet_id}

    @app.get("/pets")
    def list_pets(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        pet_repo = PetRepository(db)
        rows = pet_repo.get_by_owner(user["id"])
        return [dict(row) for row in rows]

    @app.post("/pets/{pet_id}/weight-records", status_code=status.HTTP_201_CREATED)
    def add_weight_record(
        pet_id: int,
        payload: WeightRecordCreateRequest,
        user: sqlite3.Row = Depends(get_current_user),
    ) -> dict:
        pet_repo = PetRepository(db)
        pet = pet_repo.get_by_id_and_owner(pet_id, user["id"])
        if pet is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

        weight_repo = WeightRecordRepository(db)
        record_id = weight_repo.create(
            pet_id=pet_id,
            owner_id=user["id"],
            weight_kg=payload.weight_kg,
            recorded_at=payload.recorded_at,
        )
        return {"id": record_id}

    @app.get("/pets/{pet_id}/weight-records")
    def list_weight_records(pet_id: int, user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        pet_repo = PetRepository(db)
        pet = pet_repo.get_by_id_and_owner(pet_id, user["id"])
        if pet is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

        weight_repo = WeightRecordRepository(db)
        rows = weight_repo.get_by_pet_and_owner(pet_id, user["id"])
        return [dict(row) for row in rows]

    @app.get("/user/reminders")
    def list_user_reminders(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        require_role(user, {"owner"})
        pet_repo = PetRepository(db)
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

    @app.get("/dashboard/metrics")
    def get_dashboard_metrics(user: sqlite3.Row = Depends(get_current_user)) -> dict:
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

    # Vet endpoints
    @app.get("/vet/queue")
    def list_vet_queue(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        require_role(user, {"vet"})
        vet_repo = VetQueueRepository(db)
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

    @app.post("/vet/queue/{queue_id}/start")
    def start_vet_consult(queue_id: int, user: sqlite3.Row = Depends(get_current_user)) -> dict:
        require_role(user, {"vet"})
        vet_repo = VetQueueRepository(db)
        current = vet_repo.get_by_id(queue_id)
        if current is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queue item not found")

        updated_at = vet_repo.update_status(queue_id, "in_progress")
        return {"id": queue_id, "status": "in_progress", "updated_at": updated_at}

    # CMS endpoints
    @app.get("/cms/submissions")
    def list_cms_submissions(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        require_role(user, {"admin"})
        cms_repo = CmsSubmissionRepository(db)
        rows = cms_repo.get_all()
        return [dict(row) for row in rows]

    @app.patch("/cms/submissions/{submission_id}")
    def update_cms_submission(
        submission_id: int,
        payload: CmsSubmissionUpdateRequest,
        user: sqlite3.Row = Depends(get_current_user),
    ) -> dict:
        require_role(user, {"admin"})
        cms_repo = CmsSubmissionRepository(db)
        current = cms_repo.get_by_id(submission_id)
        if current is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

        updated_at = cms_repo.update_status(submission_id, payload.status)
        return {
            "id": submission_id,
            "title": current["title"],
            "author": current["author"],
            "status": payload.status,
            "updated_at": updated_at,
        }

    return app


app = create_app()
