<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)

  Modified principles: N/A (initial version)

  Added sections:
    - I. Spec-Driven Development
    - II. Security-First Design
    - III. Deterministic Reproducibility
    - IV. Zero Manual Coding
    - V. Separation of Concerns
    - VI. Authentication & Authorization
    - VII. Data Integrity & Isolation
    - Technology Stack Constraints
    - Security Constraints
    - Quality Standards
    - Governance

  Removed sections: N/A (initial version)

  Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section aligns)
    - .specify/templates/spec-template.md: ✅ Compatible (requirements format aligns)
    - .specify/templates/tasks-template.md: ✅ Compatible (phase structure supports principles)

  Follow-up TODOs: None
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development

Every feature MUST originate from an approved specification before implementation begins.

- All implementation work MUST trace back to a written spec requirement
- No code generation without an approved spec document in `specs/<feature>/spec.md`
- Changes to requirements MUST update the spec first, then regenerate affected code
- Same specifications MUST produce equivalent outputs across regeneration cycles

**Rationale**: Ensures traceability, prevents scope creep, and maintains alignment between requirements and implementation.

### II. Security-First Design

Security MUST be treated as a foundational requirement, not an afterthought.

- Authentication and authorization MUST be designed before feature implementation
- All API endpoints (except signup/signin) MUST require valid JWT authentication
- Unauthorized requests MUST return HTTP 401 (Unauthorized)
- Cross-user access attempts MUST return HTTP 403 (Forbidden)
- JWT expiry MUST be enforced; expired tokens MUST be rejected
- All secrets MUST be environment-based via `.env` files (no hardcoded keys)
- Backend MUST never rely on frontend session state for security decisions

**Rationale**: Security vulnerabilities are costly to fix post-deployment. A security-first approach prevents common attack vectors and data breaches.

### III. Deterministic Reproducibility

Given the same inputs (specs, configurations), the system MUST produce consistent, predictable outputs.

- Spec → Plan → Tasks → Implementation flow MUST be repeatable
- No implementation-time decisions that contradict approved specs
- All randomness (UUIDs, tokens) MUST use cryptographically secure generators
- Database queries MUST be deterministic given the same input parameters

**Rationale**: Enables reliable testing, debugging, and system evolution. Supports the AI-agentic development model.

### IV. Zero Manual Coding

All implementation MUST be generated via Claude Code; manual coding is prohibited.

- No hand-written code outside of Claude Code generation sessions
- All code changes MUST be traceable to a Claude Code prompt and session
- Prompt History Records (PHRs) MUST document all generation sessions
- Code reviews focus on prompt quality and generated output correctness

**Rationale**: Validates the AI-agentic development methodology and ensures full traceability of all implementation decisions.

### V. Separation of Concerns

Clear architectural boundaries MUST exist between frontend, backend, authentication, and data layers.

- Frontend (Next.js 16+): UI components, client-side routing, API consumption
- Backend (FastAPI): Business logic, API endpoints, request validation
- Authentication (Better Auth + JWT): Session management, token issuance/verification
- Database (SQLModel + Neon PostgreSQL): Data persistence, schema management
- Each layer MUST communicate only through defined interfaces (REST API, JWT tokens)

**Rationale**: Enables independent development, testing, and deployment of each layer. Simplifies debugging and maintenance.

### VI. Authentication & Authorization

Stateless JWT-based authentication MUST be implemented for all protected operations.

- Better Auth MUST handle user signup, signin, and session management on the frontend
- JWT tokens MUST be issued upon successful authentication
- Backend MUST verify JWT signature using the shared `BETTER_AUTH_SECRET`
- User ID in JWT payload MUST match the authenticated user for all operations
- Token refresh mechanisms MUST be implemented for session continuity
- Logout MUST invalidate the current session appropriately

**Rationale**: Stateless authentication scales horizontally and simplifies backend architecture while maintaining security.

### VII. Data Integrity & Isolation

Multi-user data isolation MUST be enforced at the database query level.

- Every Task record MUST reference a User via `user_id` foreign key
- All database queries for tasks MUST filter by the authenticated user's ID
- Users MUST only see and modify their own tasks
- Backend MUST validate ownership before any read, update, or delete operation
- Database queries MUST be user-scoped by default

**Rationale**: Prevents data leakage between users and ensures privacy compliance.

## Technology Stack Constraints

The following technology stack is FIXED and MUST NOT be changed without a formal amendment.

| Layer          | Technology                   | Version/Notes            |
|----------------|------------------------------|--------------------------|
| Frontend       | Next.js (App Router)         | 16+ required             |
| Backend        | Python FastAPI               | Latest stable            |
| ORM            | SQLModel                     | Latest stable            |
| Database       | Neon Serverless PostgreSQL   | Serverless configuration |
| Authentication | Better Auth + JWT            | JWT for API auth         |
| Spec-Driven    | Claude Code + Spec-Kit Plus  | Required methodology     |

**Constraints**:
- Multi-user support is MANDATORY
- Persistent storage is REQUIRED (no in-memory data stores)
- JWT secret MUST be shared via `BETTER_AUTH_SECRET` environment variable
- API responses MUST be JSON-only
- Backend MUST be stateless

## Security Constraints

These security requirements are NON-NEGOTIABLE.

| Scenario                        | Required Response        |
|---------------------------------|--------------------------|
| Missing/invalid JWT             | HTTP 401 Unauthorized    |
| Expired JWT                     | HTTP 401 Unauthorized    |
| User accessing another's data   | HTTP 403 Forbidden       |
| Invalid request format          | HTTP 400 Bad Request     |
| Resource not found              | HTTP 404 Not Found       |
| Server error                    | HTTP 500 Internal Error  |

**Additional Security Requirements**:
- Frontend MUST never trust client-side user identity alone
- Backend MUST validate JWT signature on every protected request
- User ID in request path (if any) MUST match JWT payload user ID
- No secrets in client-side code or version control
- All passwords MUST be hashed (never stored in plaintext)

## Quality Standards

### API Standards
- All endpoints MUST be RESTful and follow standard HTTP conventions
- All endpoints MUST be documented via OpenAPI/Swagger annotations
- All inputs MUST be validated using Pydantic models
- Error responses MUST include meaningful error messages

### Frontend Standards
- UI MUST be responsive (mobile + desktop compatible)
- Frontend MUST use App Router exclusively (no `pages/` directory)
- Server Components preferred; `'use client'` only when necessary
- API calls MUST include proper error handling

### Database Standards
- All models MUST include `id`, `created_at`, `updated_at` fields
- UUID MUST be used for primary keys
- Foreign key relationships MUST be explicit
- All migrations MUST be reversible

## Governance

This constitution supersedes all other development practices for the Todo Full-Stack Web Application project.

### Amendment Process
1. Propose amendment via Architecture Decision Record (ADR)
2. Document rationale, tradeoffs, and migration impact
3. Obtain stakeholder approval
4. Update constitution with new version number
5. Propagate changes to dependent templates and documentation

### Version Policy
- **MAJOR**: Backward-incompatible changes (principle removal/redefinition)
- **MINOR**: New principle or materially expanded guidance
- **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance Verification
- All PRs MUST verify compliance with this constitution
- Spec reviews MUST check alignment with core principles
- Generated code MUST pass security and quality gates
- Complexity additions MUST be justified in implementation plans

### Reference Documents
- Runtime guidance: `CLAUDE.md`
- Feature specifications: `specs/<feature>/spec.md`
- Implementation plans: `specs/<feature>/plan.md`
- Task breakdowns: `specs/<feature>/tasks.md`
- Prompt history: `history/prompts/`
- Architecture decisions: `history/adr/`

## Success Criteria

The project is successful when:

1. All 5 basic Todo features are implemented as a web application
2. All API endpoints function correctly and securely
3. Each user can only see and modify their own tasks
4. JWT authentication works end-to-end (frontend to backend)
5. Frontend and backend operate independently and communicate via REST API
6. All implementation is traceable to approved specifications
7. No manual coding was required outside Claude Code sessions

**Version**: 1.0.0 | **Ratified**: 2026-01-10 | **Last Amended**: 2026-01-10
