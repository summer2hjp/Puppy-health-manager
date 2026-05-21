"""CMS (Content Management System) router."""
import sqlite3

from fastapi import APIRouter, Depends, HTTPException, status

from app.db.connection import Database
from app.core.auth import require_role
from app.schemas.requests import CmsSubmissionUpdateRequest
from app.models.repositories import CmsSubmissionRepository


def create_cms_router(db: Database) -> APIRouter:
    """Create CMS router."""
    router = APIRouter(prefix="/cms", tags=["cms"])
    cms_repo = CmsSubmissionRepository(db)

    @router.get("/submissions")
    def list_cms_submissions(user: sqlite3.Row = Depends(lambda: None)) -> list[dict]:
        """List all CMS submissions (admin only)."""
        require_role(user, {"admin"})
        rows = cms_repo.get_all()
        return [dict(row) for row in rows]

    @router.patch("/submissions/{submission_id}")
    def update_cms_submission(
        submission_id: int,
        payload: CmsSubmissionUpdateRequest,
        user: sqlite3.Row = Depends(lambda: None),
    ) -> dict:
        """Update a CMS submission status (admin only)."""
        require_role(user, {"admin"})
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

    return router
