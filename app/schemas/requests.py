"""Pydantic schemas for request/response validation."""
from typing import Literal, Optional

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    """Schema for user registration request."""
    username: str = Field(min_length=3, max_length=32)
    password: str = Field(min_length=6, max_length=128)
    role: Literal["owner", "vet", "creator", "admin"] = "owner"


class LoginRequest(BaseModel):
    """Schema for user login request."""
    username: str
    password: str


class PetCreateRequest(BaseModel):
    """Schema for creating a pet profile."""
    name: str = Field(min_length=1, max_length=50)
    species: str = Field(min_length=1, max_length=30)
    breed: Optional[str] = Field(default=None, max_length=50)
    age_months: Optional[int] = Field(default=None, ge=0, le=600)
    weight_kg: Optional[float] = Field(default=None, gt=0, le=200)
    allergy_notes: Optional[str] = Field(default=None, max_length=200)


class WeightRecordCreateRequest(BaseModel):
    """Schema for creating a weight record."""
    weight_kg: float = Field(gt=0, le=200)
    recorded_at: str


class CmsSubmissionUpdateRequest(BaseModel):
    """Schema for updating CMS submission status."""
    status: Literal["pending", "in_review", "approved", "rejected"]
