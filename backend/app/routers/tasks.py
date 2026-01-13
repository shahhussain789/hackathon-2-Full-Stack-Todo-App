"""Tasks router for task CRUD operations."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.dependencies import get_db
from app.models import Task
from app.schemas import TaskCreate, TaskListResponse, TaskResponse, TaskUpdate

router = APIRouter()


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List all tasks for the authenticated user.

    Args:
        completed: Optional filter for completion status

    Returns:
        TaskListResponse: List of tasks and total count
    """
    # Build query with user_id filter (REQUIRED for security)
    query = select(Task).where(Task.user_id == current_user_id)

    # Apply optional completion filter
    if completed is not None:
        query = query.where(Task.is_completed == completed)

    # Order by creation date (newest first)
    query = query.order_by(Task.created_at.desc())

    result = await db.execute(query)
    tasks = result.scalars().all()

    return TaskListResponse(tasks=tasks, total=len(tasks))


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new task for the authenticated user.

    Returns:
        TaskResponse: Created task data

    Raises:
        400: Invalid input (validation error)
        401: Not authenticated
    """
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user_id,
    )

    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return new_task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific task by ID.

    Returns:
        TaskResponse: Task data

    Raises:
        401: Not authenticated
        403: Task belongs to another user
        404: Task not found
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden",
        )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing task.

    Returns:
        TaskResponse: Updated task data

    Raises:
        400: Invalid input (validation error)
        401: Not authenticated
        403: Task belongs to another user
        404: Task not found
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden",
        )

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    await db.commit()
    await db.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a task.

    Raises:
        401: Not authenticated
        403: Task belongs to another user
        404: Task not found
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden",
        )

    await db.delete(task)
    await db.commit()


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Toggle task completion status.

    Returns:
        TaskResponse: Updated task data

    Raises:
        401: Not authenticated
        403: Task belongs to another user
        404: Task not found
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership
    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden",
        )

    # Toggle completion status
    task.is_completed = not task.is_completed

    await db.commit()
    await db.refresh(task)

    return task
