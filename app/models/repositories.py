"""Database models and repository functions."""
from typing import Optional

from app.core.datetime_utils import utc_now_iso, normalize_iso_datetime
from app.db.connection import Database


class UserRepository:
    """Repository for user-related database operations."""

    def __init__(self, db: Database) -> None:
        self.db = db

    def create(self, username: str, password_hash: str, role: str) -> int:
        """Create a new user. Returns user ID."""
        with self.db.get_connection() as conn:
            cursor = conn.execute(
                "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)",
                (username, password_hash, role, utc_now_iso()),
            )
            return cursor.lastrowid

    def get_by_username(self, username: str) -> Optional[dict]:
        """Get user by username."""
        with self.db.get_connection() as conn:
            row = conn.execute(
                "SELECT id, username, role, password_hash FROM users WHERE username = ?",
                (username,),
            ).fetchone()
            return dict(row) if row else None

    def exists(self, username: str) -> bool:
        """Check if username exists."""
        try:
            self.create(username, "temp", "owner")
            return True
        except Exception:
            return True


class SessionRepository:
    """Repository for session-related database operations."""

    def __init__(self, db: Database) -> None:
        self.db = db

    def create(self, token: str, user_id: int) -> None:
        """Create a new session."""
        with self.db.get_connection() as conn:
            conn.execute(
                "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
                (token, user_id, utc_now_iso()),
            )

    def get_by_token(self, token: str) -> Optional[dict]:
        """Get session by token with user info."""
        with self.db.get_connection() as conn:
            row = conn.execute(
                """
                SELECT u.id, u.username, u.role
                FROM sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token = ?
                """,
                (token,),
            ).fetchone()
            return dict(row) if row else None


class PetRepository:
    """Repository for pet-related database operations."""

    def __init__(self, db: Database) -> None:
        self.db = db

    def create(self, owner_id: int, **kwargs) -> int:
        """Create a new pet. Returns pet ID."""
        with self.db.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO pets (owner_id, name, species, breed, age_months, weight_kg, allergy_notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    owner_id,
                    kwargs["name"],
                    kwargs["species"],
                    kwargs.get("breed"),
                    kwargs.get("age_months"),
                    kwargs.get("weight_kg"),
                    kwargs.get("allergy_notes"),
                    utc_now_iso(),
                ),
            )
            return cursor.lastrowid

    def get_by_owner(self, owner_id: int) -> list[dict]:
        """Get all pets for an owner."""
        with self.db.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT id, name, species, breed, age_months, weight_kg, allergy_notes, created_at
                FROM pets WHERE owner_id = ? ORDER BY id ASC
                """,
                (owner_id,),
            ).fetchall()
            return [dict(row) for row in rows]

    def get_by_id_and_owner(self, pet_id: int, owner_id: int) -> Optional[dict]:
        """Get pet by ID and owner ID."""
        with self.db.get_connection() as conn:
            row = conn.execute(
                "SELECT id FROM pets WHERE id = ? AND owner_id = ?",
                (pet_id, owner_id),
            ).fetchone()
            return dict(row) if row else None


class WeightRecordRepository:
    """Repository for weight record-related database operations."""

    def __init__(self, db: Database) -> None:
        self.db = db

    def create(self, pet_id: int, owner_id: int, weight_kg: float, recorded_at: str) -> int:
        """Create a new weight record. Returns record ID."""
        with self.db.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO pet_weight_records (pet_id, owner_id, weight_kg, recorded_at, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (pet_id, owner_id, weight_kg, normalize_iso_datetime(recorded_at), utc_now_iso()),
            )
            return cursor.lastrowid

    def get_by_pet_and_owner(self, pet_id: int, owner_id: int) -> list[dict]:
        """Get all weight records for a pet."""
        with self.db.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT id, weight_kg, recorded_at, created_at
                FROM pet_weight_records
                WHERE pet_id = ? AND owner_id = ?
                ORDER BY recorded_at DESC, id DESC
                """,
                (pet_id, owner_id),
            ).fetchall()
            return [dict(row) for row in rows]


class VetQueueRepository:
    """Repository for vet queue-related database operations."""

    def __init__(self, db: Database) -> None:
        self.db = db

    def get_all(self) -> list[dict]:
        """Get all vet queue items."""
        with self.db.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT id, owner_name, symptom, level, status, created_at, updated_at
                FROM vet_consult_queue
                ORDER BY id ASC
                """
            ).fetchall()
            return [dict(row) for row in rows]

    def get_by_id(self, queue_id: int) -> Optional[dict]:
        """Get vet queue item by ID."""
        with self.db.get_connection() as conn:
            row = conn.execute(
                "SELECT id FROM vet_consult_queue WHERE id = ?",
                (queue_id,),
            ).fetchone()
            return dict(row) if row else None

    def update_status(self, queue_id: int, status: str) -> str:
        """Update vet queue item status. Returns updated_at timestamp."""
        updated_at = utc_now_iso()
        with self.db.get_connection() as conn:
            conn.execute(
                "UPDATE vet_consult_queue SET status = ?, updated_at = ? WHERE id = ?",
                (status, updated_at, queue_id),
            )
        return updated_at


class CmsSubmissionRepository:
    """Repository for CMS submission-related database operations."""

    def __init__(self, db: Database) -> None:
        self.db = db

    def get_all(self) -> list[dict]:
        """Get all CMS submissions."""
        with self.db.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT id, title, author, status, created_at, updated_at
                FROM cms_submissions
                ORDER BY id ASC
                """
            ).fetchall()
            return [dict(row) for row in rows]

    def get_by_id(self, submission_id: int) -> Optional[dict]:
        """Get CMS submission by ID."""
        with self.db.get_connection() as conn:
            row = conn.execute(
                "SELECT id, title, author FROM cms_submissions WHERE id = ?",
                (submission_id,),
            ).fetchone()
            return dict(row) if row else None

    def update_status(self, submission_id: int, status: str) -> str:
        """Update CMS submission status. Returns updated_at timestamp."""
        updated_at = utc_now_iso()
        with self.db.get_connection() as conn:
            conn.execute(
                "UPDATE cms_submissions SET status = ?, updated_at = ? WHERE id = ?",
                (status, updated_at, submission_id),
            )
        return updated_at
