"""Pydantic schemas for task-related requests and responses."""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Schema for list of tasks response."""

    tasks: list[TaskResponse]
    total: int
