"""FastAPI dependencies for dependency injection."""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_maker


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get async database session.

    Yields an async session and ensures it's closed after use.
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
