---
id: 001
title: Todo Full-Stack Implementation Plan
stage: plan
date: 2026-01-10
surface: agent
model: claude-opus-4-5-20251101
feature: main
branch: main
user: architect
command: /sp.plan
labels: ["planning", "architecture", "fullstack", "fastapi", "nextjs", "jwt"]
links:
  spec: specs/main/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/main/spec.md
  - specs/main/plan.md
  - specs/main/research.md
  - specs/main/data-model.md
  - specs/main/quickstart.md
  - specs/main/contracts/openapi.yaml
tests:
  - null
---

## Prompt

/sp.plan Todo Full-Stack Web Application

Objective:
Break the approved specification into a deterministic, executable plan
that can be implemented entirely via Claude Code without manual edits.

Planning principles:
- Respect spec-driven development rules
- Maintain strict separation of frontend, backend, and auth concerns
- Implement security early and enforce everywhere
- Ensure each step is independently verifiable

Execution phases:

Phase 1: Backend Foundation
- Initialize FastAPI project structure
- Configure environment variables
- Connect to Neon PostgreSQL
- Define SQLModel models (User, Task)
- Create database tables and migrations
- Verify DB connectivity

Phase 2: Authentication & JWT Verification
- Define JWT verification logic in FastAPI
- Add middleware/dependency to extract JWT from headers
- Validate JWT signature using shared secret
- Decode token payload to identify authenticated user
- Enforce user identity on every request

Phase 3: REST API Implementation
- Implement task CRUD endpoints
- Scope all queries by authenticated user ID
- Enforce ownership checks on read/write/delete
- Return correct HTTP status codes
- Add request/response schemas

Phase 4: Frontend Authentication
- Configure Better Auth in Next.js
- Enable JWT issuance
- Implement signup and signin flows
- Store JWT securely on frontend
- Protect authenticated routes

Phase 5: Frontend API Client
- Create API client utility
- Attach JWT to Authorization headers
- Handle 401/403 responses gracefully
- Ensure type-safe request handling

Phase 6: Frontend UI
- Implement task list UI
- Implement create/edit/delete interactions
- Implement completion toggle
- Add loading and error states
- Ensure responsive design

Phase 7: End-to-End Validation
- Verify user isolation
- Verify JWT expiry handling
- Verify backend statelessness
- Test all endpoints
- Validate full spec → plan → implementation traceability

Completion criteria:
- Application runs end-to-end with real database
- Multiple users can operate independently
- No cross-user data access

## Response snapshot

Created comprehensive implementation plan for Todo Full-Stack Web Application with 7 execution phases:

**Generated Artifacts:**
1. `specs/main/spec.md` - Feature specification with 7 user stories (signup, signin, view/create/update/delete/toggle tasks)
2. `specs/main/research.md` - Technical decisions (12 resolved items including FastAPI, SQLModel, Better Auth, JWT strategy)
3. `specs/main/data-model.md` - Entity definitions (User, Task) with SQLModel definitions and migration SQL
4. `specs/main/contracts/openapi.yaml` - OpenAPI 3.1 specification with all endpoints
5. `specs/main/quickstart.md` - Setup guide with verification checklists
6. `specs/main/plan.md` - Implementation plan with constitution compliance verification

**Constitution Compliance:** All 7 principles verified (Spec-Driven, Security-First, Deterministic, Zero Manual Coding, Separation of Concerns, Authentication, Data Isolation)

**Technology Stack:** FastAPI + SQLModel + Neon PostgreSQL (backend), Next.js 16+ App Router + Better Auth (frontend), JWT for API authentication

## Outcome

- Impact: Complete planning artifacts generated for full-stack todo application
- Tests: N/A (planning phase)
- Files: 6 files created in specs/main/
- Next prompts: /sp.tasks to generate task breakdown, then implement phases 1-7
- Reflection: Plan aligns with all constitution principles; security designed before features

## Evaluation notes (flywheel)

- Failure modes observed: spec.md was missing initially, created during planning
- Graders run and results (PASS/FAIL): Constitution check PASS (7/7 principles)
- Prompt variant (if applicable): Standard /sp.plan with detailed phase outline
- Next experiment (smallest change to try): Consider adding test tasks in Phase 3 for API endpoints
