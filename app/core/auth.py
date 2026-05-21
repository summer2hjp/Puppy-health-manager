"""Authentication dependencies and security."""
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.connection import Database
from app.models.repositories import SessionRepository


def create_auth_dependency(db: Database):
    """Create authentication dependencies for routes."""
    bearer_scheme = HTTPBearer(auto_error=False, scheme_name="BearerAuth")
    session_repo = SessionRepository(db)

    def get_current_user(
        credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
    ) -> sqlite3.Row:
        if credentials is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        token = credentials.credentials.strip()
        user = session_repo.get_by_token(token)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        return user

    return get_current_user


def require_role(user: sqlite3.Row, allowed_roles: set[str]) -> None:
    """Check if user has one of the allowed roles."""
    if user["role"] not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
