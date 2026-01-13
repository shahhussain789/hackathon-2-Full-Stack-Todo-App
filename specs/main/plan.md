# Implementation Plan: Todo Full-Stack Web Application

**Branch**: `main` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/main/spec.md`

## Summary

Transform the Todo application into a modern multi-user web application with:
- FastAPI backend with SQLModel ORM connecting to Neon PostgreSQL
- Next.js 16+ frontend with App Router and Better Auth for authentication
- JWT-based stateless authentication with shared secret verification
- RESTful API with complete CRUD operations for tasks
- User-scoped data isolation enforced at database query level

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript/Node.js 20+ (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Better Auth, Next.js 16+, Tailwind CSS
**Storage**: Neon Serverless PostgreSQL with asyncpg driver
**Testing**: pytest (backend unit/integration), manual e2e testing
**Target Platform**: Web (responsive), Linux server (backend), Vercel/Node (frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <500ms p95 for API calls, <3s initial page load
**Constraints**: Stateless backend, JWT auth required, user-scoped queries mandatory
**Scale/Scope**: Multi-user support, ~100 concurrent users initial capacity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Spec-Driven Development | ✅ PASS | spec.md created before plan.md |
| II. Security-First Design | ✅ PASS | JWT auth designed in Phase 2, before features |
| III. Deterministic Reproducibility | ✅ PASS | All tech decisions documented in research.md |
| IV. Zero Manual Coding | ✅ PASS | All code via Claude Code sessions |
| V. Separation of Concerns | ✅ PASS | Frontend/Backend/Auth/DB clearly separated |
| VI. Authentication & Authorization | ✅ PASS | Better Auth + JWT verification documented |
| VII. Data Integrity & Isolation | ✅ PASS | User-scoped queries in all task operations |

**Technology Stack Compliance**:
| Layer | Required | Planned | Status |
|-------|----------|---------|--------|
| Frontend | Next.js 16+ (App Router) | Next.js 16+ (App Router) | ✅ |
| Backend | Python FastAPI | Python FastAPI | ✅ |
| ORM | SQLModel | SQLModel | ✅ |
| Database | Neon Serverless PostgreSQL | Neon Serverless PostgreSQL | ✅ |
| Authentication | Better Auth + JWT | Better Auth + JWT | ✅ |

**Security Constraints Compliance**:
| Scenario | Required | Planned | Status |
|----------|----------|---------|--------|
| Missing JWT | 401 | 401 via HTTPBearer | ✅ |
| Expired JWT | 401 | 401 via jose decode | ✅ |
| Cross-user access | 403 | 403 via ownership check | ✅ |
| Invalid input | 400 | 400 via Pydantic | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/main/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output - technical decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - setup guide
├── contracts/           # Phase 1 output - API contracts
│   └── openapi.yaml     # OpenAPI 3.1 specification
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point, CORS, routes
│   ├── config.py            # Pydantic settings from .env
│   ├── database.py          # Async SQLModel engine and session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel (id, email, password_hash, timestamps)
│   │   └── task.py          # Task SQLModel (id, title, description, is_completed, user_id, timestamps)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # POST /api/auth/signup, signin, signout
│   │   └── tasks.py         # GET/POST/PUT/DELETE /api/tasks
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py          # UserCreate, UserLogin, UserResponse, TokenResponse
│   │   └── task.py          # TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
│   ├── auth/
│   │   ├── __init__.py
│   │   └── jwt_handler.py   # JWT decode, verify, get_current_user dependency
│   └── dependencies.py      # get_db session dependency
├── .env                     # DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
├── requirements.txt         # Python dependencies
└── tests/                   # pytest tests (optional)

frontend/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page (redirect to login or dashboard)
│   ├── globals.css          # Tailwind globals
│   ├── (auth)/
│   │   ├── layout.tsx       # Auth layout (no navbar)
│   │   ├── login/
│   │   │   └── page.tsx     # Login form
│   │   └── signup/
│   │       └── page.tsx     # Signup form
│   └── dashboard/
│       ├── layout.tsx       # Dashboard layout (navbar, protected)
│       └── page.tsx         # Task list UI
├── components/
│   ├── ui/
│   │   ├── button.tsx       # Reusable button
│   │   ├── input.tsx        # Reusable input
│   │   └── card.tsx         # Reusable card
│   ├── tasks/
│   │   ├── task-list.tsx    # Task list container
│   │   ├── task-item.tsx    # Single task row
│   │   ├── task-form.tsx    # Create/edit task form
│   │   └── task-empty.tsx   # Empty state
│   └── auth/
│       ├── login-form.tsx   # Login form component
│       └── signup-form.tsx  # Signup form component
├── lib/
│   ├── auth.ts              # Better Auth client configuration
│   ├── api.ts               # Typed fetch wrapper with JWT
│   └── types.ts             # TypeScript types for API
├── .env.local               # NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

**Structure Decision**: Web application structure selected per constitution V (Separation of Concerns). Backend and frontend are independent deployable units communicating via REST API with JWT authentication.

## Execution Phases

### Phase 1: Backend Foundation
- Initialize FastAPI project structure
- Configure environment variables (Pydantic Settings)
- Setup async database connection to Neon PostgreSQL
- Define SQLModel models (User, Task) per data-model.md
- Create database tables via migration SQL
- Verify database connectivity with health endpoint

### Phase 2: Authentication & JWT Verification
- Define JWT verification logic using python-jose
- Create HTTPBearer dependency for token extraction
- Implement signature verification with BETTER_AUTH_SECRET
- Decode token payload to extract user_id
- Create get_current_user dependency for protected routes
- Handle expired/invalid token errors (401)

### Phase 3: REST API Implementation
- Implement auth router (signup, signin, signout)
- Implement task router with CRUD endpoints
- Scope all task queries by authenticated user_id
- Enforce ownership checks on get/update/delete (403 if mismatch)
- Return correct HTTP status codes per constitution
- Add Pydantic request/response schemas

### Phase 4: Frontend Authentication
- Initialize Next.js 16+ project with App Router
- Configure Better Auth with JWT session strategy
- Implement signup page and form
- Implement signin page and form
- Store JWT token via Better Auth client
- Protect dashboard routes (redirect to login if no token)

### Phase 5: Frontend API Client
- Create typed API client utility
- Attach JWT to Authorization header automatically
- Handle 401 response (redirect to login)
- Handle 403 response (show forbidden message)
- Type-safe request/response handling

### Phase 6: Frontend UI
- Implement dashboard layout with navbar
- Implement task list component (fetch and display)
- Implement create task form
- Implement edit task inline or modal
- Implement delete task with confirmation
- Implement completion toggle
- Add loading states and error handling
- Ensure responsive design (mobile + desktop)

### Phase 7: End-to-End Validation
- Verify user registration flow
- Verify user authentication flow
- Verify task CRUD operations
- Verify user isolation (user A cannot see user B tasks)
- Verify 401/403 error handling
- Verify JWT expiry handling
- Validate quickstart.md instructions

## Complexity Tracking

> **No violations detected** - All requirements fit within constitution constraints.

| Check | Result |
|-------|--------|
| Max 2 projects | ✅ 2 projects (backend + frontend) |
| Technology stack | ✅ All mandated technologies used |
| Security constraints | ✅ All HTTP codes mapped |
| Data isolation | ✅ User-scoped queries implemented |

## Dependencies Graph

```
Phase 1 (Backend Foundation)
    ↓
Phase 2 (JWT Verification) ─────────┐
    ↓                               │
Phase 3 (REST API) ←────────────────┘
    ↓
Phase 4 (Frontend Auth) ←── Phase 5 (API Client)
    ↓                              ↓
Phase 6 (Frontend UI) ←────────────┘
    ↓
Phase 7 (Validation)
```

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Feature Spec | specs/main/spec.md | ✅ Created |
| Research | specs/main/research.md | ✅ Created |
| Data Model | specs/main/data-model.md | ✅ Created |
| API Contract | specs/main/contracts/openapi.yaml | ✅ Created |
| Quickstart | specs/main/quickstart.md | ✅ Created |
| Implementation Plan | specs/main/plan.md | ✅ This file |

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Execute tasks in order using Claude Code
3. Validate against quickstart.md checklist
4. Create PHR for each implementation session
