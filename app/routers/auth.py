"""Authentication router."""
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.connection import Database
from app.core.security import hash_password, generate_token
from app.schemas.requests import LoginRequest, RegisterRequest
from app.models.repositories import UserRepository, SessionRepository


def create_auth_router(db: Database) -> APIRouter:
    """Create authentication router."""
    router = APIRouter(prefix="/auth", tags=["authentication"])
    user_repo = UserRepository(db)
    session_repo = SessionRepository(db)

    @router.post("/register", status_code=status.HTTP_201_CREATED)
    def register(payload: RegisterRequest) -> dict:
        try:
            user_repo.create(
                username=payload.username,
                password_hash=hash_password(payload.password),
                role=payload.role,
            )
        except sqlite3.IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, 
                detail="Username already exists"
            ) from exc
        return {"message": "registered"}

    @router.post("/login")
    def login(payload: LoginRequest) -> dict:
        user = user_repo.get_by_username(payload.username)
        if user is None or user["password_hash"] != hash_password(payload.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid credentials"
            )

        token = generate_token()
        session_repo.create(token=token, user_id=user["id"])
        
        return {
            "token": token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"],
            },
        }

    return router
