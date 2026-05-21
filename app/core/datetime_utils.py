"""Datetime utility functions."""
from datetime import datetime, timezone


def utc_now_iso() -> str:
    """Get current UTC time in ISO format with Z suffix."""
    return datetime.now(tz=timezone.utc).isoformat().replace("+00:00", "Z")


def normalize_iso_datetime(dt: str) -> str:
    """Normalize an ISO datetime string to UTC with Z suffix."""
    if dt.endswith("Z"):
        dt = dt[:-1] + "+00:00"
    parsed = datetime.fromisoformat(dt)
    return parsed.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
