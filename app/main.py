import hashlib
import secrets
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Generator, Literal, Optional

from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    password: str = Field(min_length=6, max_length=128)
    role: Literal["owner", "vet", "creator", "admin"] = "owner"


class LoginRequest(BaseModel):
    username: str
    password: str


class PetCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    species: str = Field(min_length=1, max_length=30)
    breed: Optional[str] = Field(default=None, max_length=50)
    age_months: Optional[int] = Field(default=None, ge=0, le=600)
    weight_kg: Optional[float] = Field(default=None, gt=0, le=200)
    allergy_notes: Optional[str] = Field(default=None, max_length=200)


class WeightRecordCreateRequest(BaseModel):
    weight_kg: float = Field(gt=0, le=200)
    recorded_at: str


class CmsSubmissionUpdateRequest(BaseModel):
    status: Literal["pending", "in_review", "approved", "rejected"]


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _utc_now_iso() -> str:
    return datetime.now(tz=timezone.utc).isoformat().replace("+00:00", "Z")


def _normalize_iso(dt: str) -> str:
    if dt.endswith("Z"):
        dt = dt[:-1] + "+00:00"
    parsed = datetime.fromisoformat(dt)
    return parsed.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def create_app(db_path: str = "data/app.db") -> FastAPI:
    app = FastAPI(title="Puppy Health Manager API", version="0.1.0")

    db_file = Path(db_path)
    db_file.parent.mkdir(parents=True, exist_ok=True)

    @contextmanager
    def get_conn() -> Generator[sqlite3.Connection, None, None]:
        conn = sqlite3.connect(db_file)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def init_db() -> None:
        with get_conn() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS sessions (
                    token TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                );

                CREATE TABLE IF NOT EXISTS pets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    owner_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    species TEXT NOT NULL,
                    breed TEXT,
                    age_months INTEGER,
                    weight_kg REAL,
                    allergy_notes TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(owner_id) REFERENCES users(id)
                );

                CREATE TABLE IF NOT EXISTS pet_weight_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pet_id INTEGER NOT NULL,
                    owner_id INTEGER NOT NULL,
                    weight_kg REAL NOT NULL,
                    recorded_at TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(pet_id) REFERENCES pets(id),
                    FOREIGN KEY(owner_id) REFERENCES users(id)
                );

                CREATE TABLE IF NOT EXISTS vet_consult_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    owner_name TEXT NOT NULL,
                    symptom TEXT NOT NULL,
                    level TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS cms_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                """
            )

            queue_count = conn.execute("SELECT COUNT(*) AS count FROM vet_consult_queue").fetchone()["count"]
            if queue_count == 0:
                now = _utc_now_iso()
                conn.executemany(
                    """
                    INSERT INTO vet_consult_queue (owner_name, symptom, level, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    [
                        ("王女士", "连续呕吐", "high", "pending", now, now),
                        ("张先生", "术后食欲差", "medium", "pending", now, now),
                        ("刘女士", "皮肤红疹", "medium", "pending", now, now),
                    ],
                )

            cms_count = conn.execute("SELECT COUNT(*) AS count FROM cms_submissions").fetchone()["count"]
            if cms_count == 0:
                now = _utc_now_iso()
                conn.executemany(
                    """
                    INSERT INTO cms_submissions (title, author, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    [
                        ("犬猫过敏季护理指南", "内容团队A", "pending", now, now),
                        ("如何判断宠物应激反应", "执业兽医 刘医生", "in_review", now, now),
                        ("驱虫频率说明", "内容团队B", "rejected", now, now),
                    ],
                )

    init_db()

    bearer_scheme = HTTPBearer(auto_error=False, scheme_name="BearerAuth")

    def get_current_user(
        credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
    ) -> sqlite3.Row:
        if credentials is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        token = credentials.credentials.strip()
        with get_conn() as conn:
            row = conn.execute(
                """
                SELECT u.id, u.username, u.role
                FROM sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token = ?
                """,
                (token,),
            ).fetchone()
        if row is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        return row

    def require_role(user: sqlite3.Row, allowed_roles: set[str]) -> None:
        if user["role"] not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    @app.post("/auth/register", status_code=status.HTTP_201_CREATED)
    def register(payload: RegisterRequest) -> dict:
        with get_conn() as conn:
            try:
                conn.execute(
                    "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)",
                    (payload.username, _hash_password(payload.password), payload.role, _utc_now_iso()),
                )
            except sqlite3.IntegrityError as exc:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists") from exc
        return {"message": "registered"}

    @app.post("/auth/login")
    def login(payload: LoginRequest) -> dict:
        with get_conn() as conn:
            user = conn.execute(
                "SELECT id, username, role, password_hash FROM users WHERE username = ?",
                (payload.username,),
            ).fetchone()
            if user is None or user["password_hash"] != _hash_password(payload.password):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

            token = secrets.token_urlsafe(32)
            conn.execute(
                "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
                (token, user["id"], _utc_now_iso()),
            )
        return {
            "token": token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"],
            },
        }

    @app.post("/pets", status_code=status.HTTP_201_CREATED)
    def create_pet(payload: PetCreateRequest, user: sqlite3.Row = Depends(get_current_user)) -> dict:
        with get_conn() as conn:
            cursor = conn.execute(
                """
                INSERT INTO pets (owner_id, name, species, breed, age_months, weight_kg, allergy_notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user["id"],
                    payload.name,
                    payload.species,
                    payload.breed,
                    payload.age_months,
                    payload.weight_kg,
                    payload.allergy_notes,
                    _utc_now_iso(),
                ),
            )
            pet_id = cursor.lastrowid
        return {"id": pet_id}

    @app.get("/pets")
    def list_pets(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        with get_conn() as conn:
            rows = conn.execute(
                """
                SELECT id, name, species, breed, age_months, weight_kg, allergy_notes, created_at
                FROM pets WHERE owner_id = ? ORDER BY id ASC
                """,
                (user["id"],),
            ).fetchall()
        return [dict(row) for row in rows]

    @app.post("/pets/{pet_id}/weight-records", status_code=status.HTTP_201_CREATED)
    def add_weight_record(
        pet_id: int,
        payload: WeightRecordCreateRequest,
        user: sqlite3.Row = Depends(get_current_user),
    ) -> dict:
        with get_conn() as conn:
            pet = conn.execute(
                "SELECT id FROM pets WHERE id = ? AND owner_id = ?",
                (pet_id, user["id"]),
            ).fetchone()
            if pet is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

            normalized_time = _normalize_iso(payload.recorded_at)
            cursor = conn.execute(
                """
                INSERT INTO pet_weight_records (pet_id, owner_id, weight_kg, recorded_at, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (pet_id, user["id"], payload.weight_kg, normalized_time, _utc_now_iso()),
            )
        return {"id": cursor.lastrowid}

    @app.get("/pets/{pet_id}/weight-records")
    def list_weight_records(pet_id: int, user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        with get_conn() as conn:
            pet = conn.execute(
                "SELECT id FROM pets WHERE id = ? AND owner_id = ?",
                (pet_id, user["id"]),
            ).fetchone()
            if pet is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

            rows = conn.execute(
                """
                SELECT id, weight_kg, recorded_at, created_at
                FROM pet_weight_records
                WHERE pet_id = ? AND owner_id = ?
                ORDER BY recorded_at DESC, id DESC
                """,
                (pet_id, user["id"]),
            ).fetchall()
        return [dict(row) for row in rows]

    @app.get("/user/reminders")
    def list_user_reminders(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        require_role(user, {"owner"})
        with get_conn() as conn:
            rows = conn.execute(
                """
                SELECT id, name, species
                FROM pets
                WHERE owner_id = ?
                ORDER BY id ASC
                """,
                (user["id"],),
            ).fetchall()

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
        with get_conn() as conn:
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

    @app.get("/vet/queue")
    def list_vet_queue(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        require_role(user, {"vet"})
        with get_conn() as conn:
            rows = conn.execute(
                """
                SELECT id, owner_name, symptom, level, status, created_at, updated_at
                FROM vet_consult_queue
                ORDER BY id ASC
                """
            ).fetchall()

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
        with get_conn() as conn:
            current = conn.execute(
                "SELECT id FROM vet_consult_queue WHERE id = ?",
                (queue_id,),
            ).fetchone()
            if current is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queue item not found")

            updated_at = _utc_now_iso()
            conn.execute(
                "UPDATE vet_consult_queue SET status = ?, updated_at = ? WHERE id = ?",
                ("in_progress", updated_at, queue_id),
            )

        return {"id": queue_id, "status": "in_progress", "updated_at": updated_at}

    @app.get("/cms/submissions")
    def list_cms_submissions(user: sqlite3.Row = Depends(get_current_user)) -> list[dict]:
        require_role(user, {"admin"})
        with get_conn() as conn:
            rows = conn.execute(
                """
                SELECT id, title, author, status, created_at, updated_at
                FROM cms_submissions
                ORDER BY id ASC
                """
            ).fetchall()
        return [dict(row) for row in rows]

    @app.patch("/cms/submissions/{submission_id}")
    def update_cms_submission(
        submission_id: int,
        payload: CmsSubmissionUpdateRequest,
        user: sqlite3.Row = Depends(get_current_user),
    ) -> dict:
        require_role(user, {"admin"})
        with get_conn() as conn:
            current = conn.execute(
                "SELECT id, title, author FROM cms_submissions WHERE id = ?",
                (submission_id,),
            ).fetchone()
            if current is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

            updated_at = _utc_now_iso()
            conn.execute(
                "UPDATE cms_submissions SET status = ?, updated_at = ? WHERE id = ?",
                (payload.status, updated_at, submission_id),
            )

        return {
            "id": submission_id,
            "title": current["title"],
            "author": current["author"],
            "status": payload.status,
            "updated_at": updated_at,
        }

    return app


app = create_app()
