"""Database initialization and schema management."""
import sqlite3

from app.db.connection import Database
from app.core.datetime_utils import utc_now_iso


def init_database(db: Database) -> None:
    """Initialize database tables and seed data."""
    with db.get_connection() as conn:
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

        _seed_vet_queue(conn)
        _seed_cms_submissions(conn)


def _seed_vet_queue(conn: sqlite3.Connection) -> None:
    """Seed initial vet consult queue data."""
    queue_count = conn.execute(
        "SELECT COUNT(*) AS count FROM vet_consult_queue"
    ).fetchone()["count"]
    
    if queue_count == 0:
        now = utc_now_iso()
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


def _seed_cms_submissions(conn: sqlite3.Connection) -> None:
    """Seed initial CMS submissions data."""
    cms_count = conn.execute(
        "SELECT COUNT(*) AS count FROM cms_submissions"
    ).fetchone()["count"]
    
    if cms_count == 0:
        now = utc_now_iso()
        conn.executemany(
            """
            INSERT INTO cms_submissions (title, author, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                ("犬猫过敏季护理指南", "内容团队 A", "pending", now, now),
                ("如何判断宠物应激反应", "执业兽医 刘医生", "in_review", now, now),
                ("驱虫频率说明", "内容团队 B", "rejected", now, now),
            ],
        )
