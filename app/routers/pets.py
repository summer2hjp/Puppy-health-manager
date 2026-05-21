"""Pet management router."""
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.connection import Database
from app.core.auth import get_current_user_dependency
from app.schemas.requests import PetCreateRequest, WeightRecordCreateRequest
from app.models.repositories import PetRepository, WeightRecordRepository


def create_pet_router(db: Database) -> APIRouter:
    """Create pet management router."""
    router = APIRouter(prefix="/pets", tags=["pets"])
    pet_repo = PetRepository(db)
    weight_repo = WeightRecordRepository(db)
    get_current_user = get_current_user_dependency(db)

    @router.post("", status_code=status.HTTP_200_OK)
    def create_pet(payload: PetCreateRequest, user: dict = Depends(get_current_user)) -> dict:
        """Create a new pet profile for the current user."""
        pet_id = pet_repo.create(owner_id=user["id"], **payload.model_dump())
        return {"id": pet_id}

    @router.get("")
    def list_pets(user: dict = Depends(get_current_user)) -> list[dict]:
        """List all pets owned by the current user."""
        rows = pet_repo.get_by_owner(user["id"])
        return [dict(row) for row in rows]

    @router.post("/{pet_id}/weight-records", status_code=status.HTTP_201_CREATED)
    def add_weight_record(
        pet_id: int,
        payload: WeightRecordCreateRequest,
        user: dict = Depends(get_current_user),
    ) -> dict:
        """Add a weight record for a specific pet."""
        pet = pet_repo.get_by_id_and_owner(pet_id, user["id"])
        if pet is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

        record_id = weight_repo.create(
            pet_id=pet_id,
            owner_id=user["id"],
            weight_kg=payload.weight_kg,
            recorded_at=payload.recorded_at,
        )
        return {"id": record_id}

    @router.get("/{pet_id}/weight-records")
    def list_weight_records(pet_id: int, user: dict = Depends(get_current_user)) -> list[dict]:
        """List all weight records for a specific pet."""
        pet = pet_repo.get_by_id_and_owner(pet_id, user["id"])
        if pet is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

        rows = weight_repo.get_by_pet_and_owner(pet_id, user["id"])
        return [dict(row) for row in rows]

    return router
