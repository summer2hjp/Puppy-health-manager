"""Database configuration and connection management."""
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Generator


class Database:
    """Database connection manager for SQLite."""

    def __init__(self, db_path: str = "data/app.db") -> None:
        self.db_file = Path(db_path)
        self.db_file.parent.mkdir(parents=True, exist_ok=True)

    @contextmanager
    def get_connection(self) -> Generator[sqlite3.Connection, None, None]:
        """Get a database connection with row factory enabled."""
        conn = sqlite3.connect(self.db_file)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()
