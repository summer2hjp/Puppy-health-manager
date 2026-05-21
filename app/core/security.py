"""Security utility functions."""
import hashlib
import secrets


def hash_password(password: str) -> str:
    """Hash a password using SHA256."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def generate_token() -> str:
    """Generate a secure random token."""
    return secrets.token_urlsafe(32)
