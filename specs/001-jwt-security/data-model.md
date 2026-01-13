# Data Model: Authentication & JWT Security Integration

**Feature**: 001-jwt-security
**Date**: 2026-01-10
**Source**: spec.md requirements, constitution.md constraints

## Entity Definitions

### User Entity

Represents an authenticated user in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, valid email | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| created_at | TIMESTAMP | NOT NULL, default NOW() | Account creation time |
| updated_at | TIMESTAMP | NOT NULL, default NOW(), auto-update | Last modification time |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Password must be at least 8 characters before hashing
- Email is case-insensitive (stored lowercase)

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

### JWT Token (Transient Entity)

Represents a stateless authentication credential. Not persisted in database.

| Field | Type | Location | Description |
|-------|------|----------|-------------|
| sub | string (UUID) | JWT payload | User ID (subject claim) |
| email | string | JWT payload | User's email address |
| iat | integer | JWT payload | Issued-at timestamp (Unix epoch) |
| exp | integer | JWT payload | Expiration timestamp (Unix epoch) |

**Token Structure**:
```
Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "<user_id>", "email": "<email>", "iat": <timestamp>, "exp": <timestamp>}
Signature: HMACSHA256(base64(header) + "." + base64(payload), BETTER_AUTH_SECRET)
```

**Validation Rules**:
- Signature must be valid (verified with BETTER_AUTH_SECRET)
- `exp` must be in the future (not expired)
- `sub` must be a valid UUID
- `email` must be present

**Token Lifecycle**:
1. Created on successful signup/signin
2. Stored in frontend localStorage
3. Attached to API requests in Authorization header
4. Verified by backend on each protected request
5. Cleared on signout or expiration

---

### Task Entity (Referenced for Ownership)

Represents a user-owned todo item. Included for ownership relationship.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| title | VARCHAR(500) | NOT NULL | Task title |
| description | TEXT | NULLABLE | Optional detailed description |
| is_completed | BOOLEAN | NOT NULL, default FALSE | Completion status |
| user_id | UUID | FK → users.id, NOT NULL | Owner reference |
| created_at | TIMESTAMP | NOT NULL, default NOW() | Task creation time |
| updated_at | TIMESTAMP | NOT NULL, default NOW() | Last modification time |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for filtered queries)
- COMPOSITE INDEX on `(user_id, is_completed)` (for filtered lists)

**Foreign Key**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

## Entity Relationships

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │      Task       │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────│ user_id (FK)    │
│ email           │    1:N  │ id (PK)         │
│ password_hash   │         │ title           │
│ created_at      │         │ description     │
│ updated_at      │         │ is_completed    │
└─────────────────┘         │ created_at      │
        │                   │ updated_at      │
        │                   └─────────────────┘
        │
        ▼
┌─────────────────┐
│   JWT Token     │
├─────────────────┤
│ sub (user_id)   │
│ email           │
│ iat             │
│ exp             │
└─────────────────┘
(Transient - not in DB)
```

**Relationships**:
- One User has Many Tasks (1:N)
- One User can have Many JWT Tokens (1:N, transient, not tracked in DB)
- A Task belongs to exactly One User
- A JWT Token represents exactly One User session

---

## Authentication Flow Data

### Signup Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Signup Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2026-01-10T12:00:00Z"
}
```

### Signin Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Signin Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Authorization Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Data Access Patterns

### Authentication Operations

| Operation | Query Pattern | Index Used |
|-----------|---------------|------------|
| Find user by email | `SELECT * FROM users WHERE email = ?` | idx_users_email |
| Find user by ID | `SELECT * FROM users WHERE id = ?` | PRIMARY KEY |
| Create user | `INSERT INTO users (email, password_hash) VALUES (?, ?)` | N/A |

### Task Operations (with Auth)

| Operation | Query Pattern | Auth Requirement |
|-----------|---------------|------------------|
| List user tasks | `SELECT * FROM tasks WHERE user_id = ?` | JWT user_id |
| Get single task | `SELECT * FROM tasks WHERE id = ? AND user_id = ?` | JWT user_id match |
| Create task | `INSERT INTO tasks (title, user_id) VALUES (?, ?)` | JWT user_id |
| Update task | `UPDATE tasks SET ... WHERE id = ? AND user_id = ?` | JWT user_id match |
| Delete task | `DELETE FROM tasks WHERE id = ? AND user_id = ?` | JWT user_id match |

**Security Note**: All task queries MUST include `user_id` filter to enforce ownership per Constitution VII.

---

## Pydantic Schemas

### User Schemas
```python
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str  # Min 8 chars validated in service

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

### Error Schemas
```python
class ErrorResponse(BaseModel):
    detail: str
```
