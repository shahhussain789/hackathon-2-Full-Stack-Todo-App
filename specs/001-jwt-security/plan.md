# Implementation Plan: Authentication & JWT Security Integration

**Branch**: `001-jwt-security` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-jwt-security/spec.md`

## Summary

Implement stateless JWT-based authentication between Next.js frontend and FastAPI backend. Better Auth handles frontend authentication UI, while FastAPI independently verifies JWT tokens using a shared secret (BETTER_AUTH_SECRET). All protected endpoints require valid JWT, and cross-user access is blocked with 403 Forbidden.

## Technical Context

**Language/Version**: Python 3.11 (Backend), TypeScript/Node 18+ (Frontend)
**Primary Dependencies**: FastAPI, python-jose, passlib, SQLModel (Backend); Next.js 16+, Better Auth (Frontend)
**Storage**: Neon Serverless PostgreSQL
**Testing**: Manual e2e testing per quickstart.md
**Target Platform**: Web application (Server + Browser)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: JWT verification < 50ms overhead, API responses < 200ms p95
**Constraints**: Stateless backend, localStorage token storage, 7-day token expiry
**Scale/Scope**: Single-user testing, production-ready security patterns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Spec-Driven Development | All implementation traces to spec | PASS | spec.md created with 16 FRs, 5 SRs |
| II. Security-First Design | Auth designed before features | PASS | JWT verification documented in research.md |
| III. Deterministic Reproducibility | Consistent outputs given inputs | PASS | JWT uses cryptographic randomness only |
| IV. Zero Manual Coding | All code via Claude Code | PASS | Implementation via /sp.implement |
| V. Separation of Concerns | Clear layer boundaries | PASS | Frontend/Backend/Auth separated |
| VI. Authentication & Authorization | Stateless JWT auth | PASS | HS256, 7-day expiry, shared secret |
| VII. Data Integrity & Isolation | User-scoped queries | PASS | All task queries filter by user_id |

**Security Constraints Compliance**:

| Scenario | Required Response | Implementation |
|----------|-------------------|----------------|
| Missing/invalid JWT | 401 Unauthorized | `get_current_user` dependency |
| Expired JWT | 401 Unauthorized | python-jose exp validation |
| Cross-user access | 403 Forbidden | Ownership check in routers |
| Invalid request | 400 Bad Request | Pydantic validation |
| Resource not found | 404 Not Found | Router handlers |

## Project Structure

### Documentation (this feature)

```text
specs/001-jwt-security/
├── plan.md              # This file
├── research.md          # Phase 0 output - technical decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - setup instructions
├── contracts/           # Phase 1 output - API contracts
│   └── openapi.yaml     # OpenAPI 3.0 specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── auth/
│   │   ├── __init__.py
│   │   └── jwt_handler.py    # JWT creation, verification, password hashing
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py           # User SQLModel
│   │   └── task.py           # Task SQLModel
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py           # /api/auth/* endpoints
│   │   └── tasks.py          # /api/tasks/* endpoints
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py           # User Pydantic schemas
│   │   └── task.py           # Task Pydantic schemas
│   ├── __init__.py
│   ├── config.py             # Settings from environment
│   ├── database.py           # Async database connection
│   ├── dependencies.py       # FastAPI dependencies
│   └── main.py               # FastAPI application
├── requirements.txt
└── .env.example

frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page
│   │   └── layout.tsx        # Auth layout
│   ├── dashboard/
│   │   ├── page.tsx          # Task list page
│   │   └── layout.tsx        # Protected layout
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home redirect
│   └── error.tsx             # Error boundary
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── tasks/
│   │   ├── task-list.tsx
│   │   ├── task-item.tsx
│   │   ├── task-form.tsx
│   │   └── task-empty.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
├── lib/
│   ├── api.ts                # API client with JWT attachment
│   ├── auth.ts               # Auth utilities
│   └── types.ts              # TypeScript types
├── package.json
└── .env.local.example
```

**Structure Decision**: Web application structure with separated frontend (Next.js) and backend (FastAPI). Authentication layer spans both with shared JWT secret.

## Execution Phases

### Phase 1: Better Auth Configuration (Frontend)

**Objective**: Configure frontend authentication with JWT token handling

**Tasks**:
1. Install Better Auth dependencies (if not already installed)
2. Configure JWT payload fields (user_id as sub, email)
3. Set BETTER_AUTH_SECRET via environment variables
4. Validate token issuance flow on login/signup

**Artifacts**: frontend/lib/auth.ts, frontend/.env.local

### Phase 2: Frontend JWT Handling

**Objective**: Ensure JWT is attached to all API requests

**Tasks**:
1. Store JWT in localStorage after successful auth
2. Attach JWT to Authorization header automatically
3. Handle 401 responses with redirect to login
4. Clear token on signout

**Artifacts**: frontend/lib/api.ts

### Phase 3: FastAPI JWT Verification Setup

**Objective**: Backend independently verifies JWT tokens

**Tasks**:
1. Configure BETTER_AUTH_SECRET from environment
2. Implement JWT decode with python-jose
3. Validate signature and expiration
4. Return standardized 401 errors

**Artifacts**: backend/app/auth/jwt_handler.py, backend/app/config.py

### Phase 4: Authentication Dependency

**Objective**: Reusable FastAPI dependency for protected routes

**Tasks**:
1. Create `get_current_user` dependency
2. Extract JWT from Authorization header
3. Decode and validate token
4. Return user_id for request context

**Artifacts**: backend/app/auth/jwt_handler.py (get_current_user function)

### Phase 5: User Identity Enforcement

**Objective**: Prevent cross-user data access

**Tasks**:
1. All task queries filter by JWT user_id
2. Single-resource operations verify ownership
3. Return 403 Forbidden for ownership violations
4. Return 404 Not Found for missing resources

**Artifacts**: backend/app/routers/tasks.py

### Phase 6: Validation & Security Testing

**Objective**: Verify all security requirements are met

**Tests**:
1. Request without JWT → 401
2. Request with invalid JWT → 401
3. Request with expired JWT → 401
4. Request with wrong user's task → 403
5. Request with valid JWT → 200
6. Sign-in with wrong password → 401 (generic message)
7. Sign-in with non-existent email → 401 (same message)

**Artifacts**: quickstart.md verification checklist

## Complexity Tracking

> No constitution violations requiring justification.

| Component | Complexity | Justification |
|-----------|------------|---------------|
| JWT Handler | Low | Standard python-jose usage |
| Auth Dependency | Low | Single function, reusable |
| Task Router | Medium | Ownership verification on all operations |
| Frontend Auth | Low | localStorage + header attachment |

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Secret exposure | Low | High | Environment variables only |
| Token theft (XSS) | Medium | High | Production: use httpOnly cookies |
| Brute force | Medium | Medium | Out of scope (rate limiting) |
| Token expiry UX | Low | Low | 7-day expiry, re-login on 401 |

## Dependencies

### External Dependencies

| Dependency | Purpose | Version |
|------------|---------|---------|
| python-jose | JWT handling | Latest |
| passlib[bcrypt] | Password hashing | Latest |
| FastAPI | Backend framework | Latest |
| Next.js | Frontend framework | 16+ |

### Internal Dependencies

| Component | Depends On |
|-----------|------------|
| Task Router | JWT Handler, get_current_user |
| Auth Router | JWT Handler, User Model |
| Frontend API | Auth utilities |
| Dashboard | API client |

## Implementation Status

Based on existing codebase analysis:

| Component | Status | File |
|-----------|--------|------|
| JWT Handler | Complete | backend/app/auth/jwt_handler.py |
| Auth Router | Complete | backend/app/routers/auth.py |
| Task Router | Complete | backend/app/routers/tasks.py |
| Frontend Auth | Complete | frontend/lib/auth.ts |
| API Client | Complete | frontend/lib/api.ts |
| Config | Complete | backend/app/config.py |

**Note**: The core implementation already exists from the main Todo app implementation. This spec documents the security architecture and provides verification procedures.

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Execute quickstart.md verification checklist
3. Document any gaps found during verification
4. Create PHR for this planning session
