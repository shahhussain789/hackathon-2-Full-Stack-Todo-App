# Data Model: Todo Full-Stack Web Application

**Date**: 2026-01-10
**Feature**: Todo Full-Stack Web Application
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

### Task Entity

Represents a todo item owned by a specific user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| title | VARCHAR(500) | NOT NULL | Task title/description |
| description | TEXT | NULLABLE | Optional detailed description |
| is_completed | BOOLEAN | NOT NULL, default FALSE | Completion status |
| user_id | UUID | FK → users.id, NOT NULL | Owner reference |
| created_at | TIMESTAMP | NOT NULL, default NOW() | Task creation time |
| updated_at | TIMESTAMP | NOT NULL, default NOW(), auto-update | Last modification time |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for filtered queries)
- COMPOSITE INDEX on `(user_id, is_completed)` (for filtered lists)

**Foreign Key**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**Validation Rules**:
- Title must not be empty
- Title maximum length: 500 characters
- Description is optional (can be NULL)

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=500)
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

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
                            │ updated_at      │
                            └─────────────────┘
```

**Relationship**: One User has Many Tasks (1:N)
- A user can have zero or more tasks
- A task belongs to exactly one user
- Deleting a user cascades to delete all their tasks

---

## Pydantic Schemas (Request/Response)

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

### Task Schemas

```python
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    is_completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime

class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int
```

---

## Database Migration SQL

### Initial Migration (001_initial.sql)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for task queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to tasks
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Data Access Patterns

### User Operations

| Operation | Query Pattern | Index Used |
|-----------|---------------|------------|
| Find by email | `SELECT * FROM users WHERE email = ?` | idx_users_email |
| Find by ID | `SELECT * FROM users WHERE id = ?` | PRIMARY KEY |
| Create user | `INSERT INTO users (email, password_hash) VALUES (?, ?)` | N/A |

### Task Operations

| Operation | Query Pattern | Index Used |
|-----------|---------------|------------|
| List user tasks | `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC` | idx_tasks_user_id |
| List user incomplete | `SELECT * FROM tasks WHERE user_id = ? AND is_completed = FALSE` | idx_tasks_user_completed |
| Get single task | `SELECT * FROM tasks WHERE id = ? AND user_id = ?` | PRIMARY KEY + user check |
| Create task | `INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)` | N/A |
| Update task | `UPDATE tasks SET ... WHERE id = ? AND user_id = ?` | PRIMARY KEY + user check |
| Delete task | `DELETE FROM tasks WHERE id = ? AND user_id = ?` | PRIMARY KEY + user check |

**Security Note**: All task queries MUST include `user_id = ?` filter to enforce ownership per constitution VII.
