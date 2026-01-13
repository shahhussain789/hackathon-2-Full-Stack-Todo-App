# Data Model: Frontend Web Application

**Feature**: 002-frontend-app
**Date**: 2026-01-11
**Source**: spec.md requirements, existing frontend implementation

## Frontend State Entities

### User Session State

Represents the authenticated user's session in the frontend.

| Field | Type | Storage | Description |
|-------|------|---------|-------------|
| token | string | localStorage | JWT access token |
| isAuthenticated | boolean | derived | Token exists and not expired |

**Storage Key**: `auth_token`

**State Transitions**:
```
Unauthenticated → [signin/signup success] → Authenticated
Authenticated → [signout/401 response] → Unauthenticated
```

**TypeScript Interface**:
```typescript
// Implicit - no explicit session object
// Auth state derived from localStorage token presence
function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}
```

---

### Task Entity (Display)

Represents a task as received from and sent to the API.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| title | string | Yes | Task title (1-500 chars) |
| description | string | null | No | Optional description |
| is_completed | boolean | Yes | Completion status |
| user_id | string (UUID) | Yes | Owner reference |
| created_at | string (ISO 8601) | Yes | Creation timestamp |
| updated_at | string (ISO 8601) | Yes | Last modification |

**TypeScript Interface**:
```typescript
export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

---

### Task Create Input

Data required to create a new task.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | string | Yes | 1-500 characters |
| description | string | No | Optional |

**TypeScript Interface**:
```typescript
export interface TaskCreate {
  title: string;
  description?: string;
}
```

---

### Task Update Input

Data for updating an existing task.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | string | No | 1-500 characters if provided |
| description | string | No | Optional |
| is_completed | boolean | No | true/false |

**TypeScript Interface**:
```typescript
export interface TaskUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}
```

---

### User Credentials

Data for authentication requests.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Minimum 8 characters |

**TypeScript Interface**:
```typescript
export interface UserCreate {
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
```

---

### API Response Types

Standardized API response structures.

**Token Response**:
```typescript
export interface TokenResponse {
  access_token: string;
  token_type: string;
}
```

**User Response**:
```typescript
export interface User {
  id: string;
  email: string;
  created_at: string;
}
```

**Task List Response**:
```typescript
export interface TaskListResponse {
  tasks: Task[];
  total: number;
}
```

**Error Response**:
```typescript
export interface ErrorResponse {
  detail: string;
}
```

---

### Form State Entity

Represents the state of input forms.

| Field | Type | Description |
|-------|------|-------------|
| values | Record<string, string> | Form field values |
| errors | Record<string, string> | Validation errors by field |
| isSubmitting | boolean | Form submission in progress |
| submitError | string | null | API error message |

**Pattern**:
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
```

---

## Component State Patterns

### Task List Component State

```typescript
interface TaskListState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}
```

### Task Item Component State

```typescript
interface TaskItemState {
  isEditing: boolean;
  editTitle: string;
  isToggling: boolean;
  isDeleting: boolean;
}
```

### Auth Form Component State

```typescript
interface AuthFormState {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
}
```

---

## Data Flow

### Authentication Flow

```
User enters credentials
    ↓
Frontend validates input
    ↓
POST /api/auth/signin (or /signup)
    ↓
Backend returns JWT token
    ↓
Frontend stores token in localStorage
    ↓
Redirect to /dashboard
```

### Task CRUD Flow

```
User action (create/edit/delete/toggle)
    ↓
Component sets loading state
    ↓
API request with JWT header
    ↓
Backend processes request
    ↓
Frontend updates local state
    ↓
UI reflects changes
```

### Protected Route Flow

```
User navigates to /dashboard
    ↓
Layout checks isAuthenticated()
    ↓
If false → redirect to /login
    ↓
If true → render children
```

---

## Validation Rules

### Email Validation

- Required field
- Must match email format (contains @, valid domain)
- Frontend: inline validation before submit
- Backend: Pydantic EmailStr validation

### Password Validation

- Required field
- Minimum 8 characters
- Frontend: inline validation before submit
- Backend: length validation in schema

### Task Title Validation

- Required field
- 1-500 characters
- Cannot be empty or whitespace-only
- Frontend: validation before submit
- Backend: Pydantic Field validation
