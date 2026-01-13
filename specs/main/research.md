# Research: Todo Full-Stack Web Application

**Date**: 2026-01-10
**Feature**: Todo Full-Stack Web Application
**Purpose**: Resolve all technical decisions and NEEDS CLARIFICATION items before design phase

## Technology Stack Decisions

### Decision 1: Backend Framework - FastAPI

**Decision**: Use FastAPI with Python 3.11+
**Rationale**:
- Constitution mandates FastAPI as the backend framework
- Async/await support for database operations
- Built-in Pydantic validation aligns with constitution quality standards
- Auto-generated OpenAPI documentation meets API documentation requirements
**Alternatives considered**:
- Flask: Rejected - Less performant, no native async support
- Django: Rejected - Too heavy, not specified in constitution
- Express.js: Rejected - Constitution specifies Python backend

### Decision 2: ORM - SQLModel

**Decision**: Use SQLModel for database models and queries
**Rationale**:
- Constitution mandates SQLModel as the ORM
- Combines Pydantic models with SQLAlchemy, reducing duplication
- Type-safe queries support constitution's quality standards
- Native async support with asyncpg driver
**Alternatives considered**:
- SQLAlchemy Core only: Rejected - More verbose, less type safety
- Tortoise ORM: Rejected - Not specified in constitution
- Raw SQL: Rejected - Violates maintainability standards

### Decision 3: Database - Neon Serverless PostgreSQL

**Decision**: Use Neon PostgreSQL with asyncpg driver
**Rationale**:
- Constitution mandates Neon Serverless PostgreSQL
- Serverless scaling for variable load
- PostgreSQL features (UUID, timestamps, JSON) align with data model needs
- Connection pooling handled by Neon
**Alternatives considered**:
- Supabase: Rejected - Not specified in constitution
- Local PostgreSQL: Rejected - Not serverless
- SQLite: Rejected - No multi-user support, not persistent

### Decision 4: Frontend Framework - Next.js 16+ (App Router)

**Decision**: Use Next.js 16+ with App Router exclusively
**Rationale**:
- Constitution mandates Next.js 16+ with App Router
- Server Components for better performance
- Built-in routing and layouts
- TypeScript support for type safety
**Alternatives considered**:
- React SPA: Rejected - No SSR, not specified
- Vue/Nuxt: Rejected - Not specified in constitution
- Pages Router: Rejected - Constitution specifies App Router

### Decision 5: Authentication - Better Auth + JWT

**Decision**: Use Better Auth for frontend auth, JWT for backend verification
**Rationale**:
- Constitution mandates Better Auth + JWT
- Stateless backend aligns with scalability requirements
- JWT tokens self-contained, no session storage needed on backend
- Shared secret (BETTER_AUTH_SECRET) for signature verification
**Alternatives considered**:
- NextAuth.js: Rejected - Not specified, different API
- Custom JWT: Rejected - Better Auth provides standard patterns
- Session cookies: Rejected - Constitution requires stateless backend

## Technical Implementation Decisions

### Decision 6: JWT Verification Approach

**Decision**: FastAPI dependency injection with jose library
**Rationale**:
- Dependency injection aligns with FastAPI patterns
- python-jose library is well-maintained for JWT operations
- Can extract user_id from token payload for ownership verification
- Middleware approach would be less flexible for route-specific logic
**Implementation**:
```python
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Decision 7: Database Schema Design

**Decision**: UUID primary keys, timestamps on all models, explicit foreign keys
**Rationale**:
- Constitution requires UUID for primary keys
- Constitution requires `id`, `created_at`, `updated_at` on all models
- Explicit foreign key for Task → User relationship
- Indexes on user_id for efficient filtering
**Schema**:
- User: id (UUID PK), email (unique), password_hash, created_at, updated_at
- Task: id (UUID PK), title, description (nullable), is_completed, user_id (FK), created_at, updated_at

### Decision 8: Password Hashing

**Decision**: Use bcrypt via passlib library
**Rationale**:
- Industry standard for password hashing
- Configurable work factor for security/performance tradeoff
- passlib provides clean API
**Implementation**:
```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

### Decision 9: API Response Format

**Decision**: JSON-only responses with consistent error format
**Rationale**:
- Constitution requires JSON-only API responses
- Consistent error format improves frontend error handling
**Format**:
```json
// Success
{ "data": {...}, "message": "Success" }

// Error
{ "detail": "Error message", "status_code": 400 }
```

### Decision 10: Frontend API Client

**Decision**: Fetch API with typed wrapper utility
**Rationale**:
- Native browser API, no additional dependencies
- TypeScript generics for type-safe requests
- Centralized JWT header attachment
- Consistent error handling for 401/403
**Implementation approach**:
```typescript
async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  if (response.status === 401) { /* redirect to login */ }
  if (response.status === 403) { /* show forbidden error */ }
  return response.json();
}
```

### Decision 11: Better Auth Configuration

**Decision**: Email/password provider with JWT session strategy
**Rationale**:
- Constitution specifies email/password authentication
- JWT session strategy enables stateless backend
- BETTER_AUTH_SECRET environment variable for signing
**Key configuration**:
- Session strategy: jwt
- Token expiry: 7 days (configurable)
- Secure cookies in production

### Decision 12: Error Handling Strategy

**Decision**: FastAPI exception handlers with HTTP status code mapping
**Rationale**:
- Constitution specifies exact HTTP status codes for scenarios
- Centralized exception handling prevents leakage
- Custom exceptions for business logic errors
**Mapping**:
| Exception | Status Code |
|-----------|-------------|
| InvalidCredentials | 401 |
| TokenExpired | 401 |
| NotFound | 404 |
| Forbidden (wrong user) | 403 |
| ValidationError | 400 |
| ServerError | 500 |

## Dependencies

### Backend (requirements.txt)
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
asyncpg>=0.29.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-dotenv>=1.0.0
pydantic[email]>=2.5.0
```

### Frontend (package.json dependencies)
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "better-auth": "^1.0.0",
    "@better-auth/react": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

## Testing Strategy

**Decision**: pytest for backend, manual e2e testing for Phase II
**Rationale**:
- pytest is standard for Python testing
- Constitution doesn't mandate automated frontend tests for basic level
- Manual testing sufficient for 7 user stories
**Coverage targets**:
- Backend API endpoints: Unit tests for each endpoint
- JWT verification: Unit tests for valid/invalid/expired tokens
- Ownership checks: Integration tests for 403 scenarios

## Resolved NEEDS CLARIFICATION Items

| Item | Resolution |
|------|------------|
| Language/Version | Python 3.11+ (backend), Node.js 20+ (frontend) |
| Primary Dependencies | FastAPI, SQLModel, Better Auth, Next.js 16+ |
| Storage | Neon Serverless PostgreSQL |
| Testing | pytest (backend), manual e2e (frontend) |
| Target Platform | Web (responsive), Linux server (backend) |
| Project Type | Web application (frontend + backend) |
| Performance Goals | <500ms p95 for API calls |
| Constraints | Stateless backend, JWT auth, user-scoped queries |
| Scale/Scope | Multi-user support, ~100 concurrent users initial |
