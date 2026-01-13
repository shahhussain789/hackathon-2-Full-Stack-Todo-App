"""Authentication router for user signup, signin, and signout."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.dependencies import get_db
from app.models import User
from app.schemas import TokenResponse, UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user account.

    Returns:
        UserResponse: Created user data (without password)

    Raises:
        400: Invalid input (validation error)
        409: Email already registered
    """
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email.lower()))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create new user with hashed password
    new_user = User(
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


@router.post("/signin", response_model=TokenResponse)
async def signin(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user and return JWT token.

    Returns:
        TokenResponse: JWT access token

    Raises:
        401: Invalid email or password
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create and return JWT token
    access_token = create_access_token(user.id, user.email)

    return TokenResponse(access_token=access_token)


@router.post("/signout")
async def signout(current_user_id: UUID = Depends(get_current_user)):
    """
    Sign out the current user.

    Note: With JWT-based auth, signout is mainly handled client-side
    by removing the token. This endpoint exists for logging purposes
    and to provide a consistent API.

    Returns:
        dict: Success message
    """
    return {"message": "Successfully signed out"}
