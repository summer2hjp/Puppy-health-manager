"""Authentication dependencies and security."""
import sqlite3
from typing import Callable

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.connection import Database
from app.models.repositories import SessionRepository


def get_current_user_dependency(db: Database) -> Callable[[HTTPAuthorizationCredentials | None], sqlite3.Row]:
    """Create authentication dependencies for routes.
    
    Args:
        db: Database instance
        
    Returns:
        A dependency function that retrieves the current user from a bearer token.
        
    Raises:
        HTTPException: If credentials are missing or invalid (401 Unauthorized)
    """
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


# Alias for backward compatibility
create_auth_dependency = get_current_user_dependency


def require_role(user: sqlite3.Row, allowed_roles: set[str]) -> None:
    """Check if user has one of the allowed roles.
    
    Args:
        user: User row containing role information
        allowed_roles: Set of allowed role names
        
    Raises:
        HTTPException: If user role is not in allowed_roles (403 Forbidden)
    """
    if user["role"] not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
