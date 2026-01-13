# Implementation Plan: Frontend Web Application

**Branch**: `002-frontend-app` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-frontend-app/spec.md`

## Summary

Implement a responsive, multi-user Next.js frontend application using App Router. The frontend integrates with the FastAPI backend (Spec-1) and uses JWT authentication (Spec-2) for secure user sessions. Users can register, sign in, and manage their tasks (create, read, update, delete, toggle completion).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: Next.js 16+ (App Router), React 18, Tailwind CSS
**Storage**: localStorage (JWT token), Backend API (data persistence)
**Testing**: Manual e2e testing per quickstart.md
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend component)
**Performance Goals**: < 100ms UI response for user actions, < 3s initial page load
**Constraints**: Responsive (320px-1920px), JWT token storage in localStorage
**Scale/Scope**: Single-page application, 9 user stories, 5 main routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Spec-Driven Development | All implementation traces to spec | PASS | spec.md created with 9 user stories |
| II. Security-First Design | Auth integrated before features | PASS | JWT handling from Spec-2 |
| III. Deterministic Reproducibility | Consistent outputs | PASS | Same UI for same state |
| IV. Zero Manual Coding | All code via Claude Code | PASS | Implementation via /sp.implement |
| V. Separation of Concerns | Clear layer boundaries | PASS | Components, lib, app separated |
| VI. Authentication & Authorization | Stateless JWT auth | PASS | Uses Spec-2 JWT integration |
| VII. Data Integrity & Isolation | User-scoped data | PASS | Backend enforces; frontend respects |

**UI/UX Requirements Compliance**:

| Requirement | Implementation |
|-------------|----------------|
| UX-001 Inline validation | Form components show errors |
| UX-002 Disabled buttons | isSubmitting state disables buttons |
| UX-003 Feedback visibility | Error/success messages displayed |
| UX-004 Auth page navigation | Links between login/signup |
| UX-005 Sign-out option | Navbar includes sign out button |
| UX-006 Completed task styling | Strikethrough + opacity change |
| UX-007 Empty state | TaskEmpty component shown |
| UX-008 Responsive design | Tailwind responsive classes |

## Project Structure

### Documentation (this feature)

```text
specs/002-frontend-app/
├── plan.md              # This file
├── research.md          # Phase 0 output - technical decisions
├── data-model.md        # Phase 1 output - frontend state entities
├── quickstart.md        # Phase 1 output - setup and verification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── layout.tsx             # Centered auth layout
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   └── signup/
│   │       └── page.tsx           # Signup page
│   ├── dashboard/
│   │   ├── layout.tsx             # Protected layout with navbar
│   │   └── page.tsx               # Task list page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home redirect
│   └── error.tsx                  # Global error boundary
├── components/
│   ├── auth/
│   │   ├── login-form.tsx         # Login form component
│   │   └── signup-form.tsx        # Signup form component
│   ├── tasks/
│   │   ├── task-list.tsx          # Task list container
│   │   ├── task-item.tsx          # Individual task display
│   │   ├── task-form.tsx          # Task creation form
│   │   └── task-empty.tsx         # Empty state component
│   ├── ui/
│   │   ├── button.tsx             # Reusable button component
│   │   ├── input.tsx              # Reusable input component
│   │   └── card.tsx               # Reusable card component
│   └── error-boundary.tsx         # Error boundary component
├── lib/
│   ├── api.ts                     # API client with JWT attachment
│   ├── auth.ts                    # Authentication utilities
│   └── types.ts                   # TypeScript type definitions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example
```

**Structure Decision**: Next.js App Router structure with feature-based component organization. Route groups separate auth pages from protected dashboard.

## Execution Phases

### Phase 1: Project Setup

**Objective**: Initialize Next.js project with required configuration

**Tasks**:
1. Create Next.js 16+ project with App Router
2. Configure Tailwind CSS for styling
3. Set up TypeScript configuration
4. Create .env.local.example with NEXT_PUBLIC_API_URL
5. Configure ESLint and formatting

**Artifacts**: package.json, tailwind.config.js, tsconfig.json, .env.local.example

### Phase 2: Core Library Setup

**Objective**: Create shared utilities for API communication and authentication

**Tasks**:
1. Create TypeScript type definitions (lib/types.ts)
2. Create API client with JWT attachment (lib/api.ts)
3. Create authentication utilities (lib/auth.ts)

**Artifacts**: lib/types.ts, lib/api.ts, lib/auth.ts

### Phase 3: UI Components

**Objective**: Build reusable UI components

**Tasks**:
1. Create Button component with variants
2. Create Input component with error states
3. Create Card component
4. Create ErrorBoundary component

**Artifacts**: components/ui/*.tsx, components/error-boundary.tsx

### Phase 4: Authentication Pages

**Objective**: Implement signup and signin functionality

**Tasks**:
1. Create auth layout (centered, responsive)
2. Create login form component
3. Create signup form component
4. Create login page
5. Create signup page
6. Implement form validation
7. Implement error display

**Artifacts**: app/(auth)/*, components/auth/*

### Phase 5: Dashboard & Task Management

**Objective**: Implement protected dashboard with task CRUD

**Tasks**:
1. Create dashboard layout with navbar and sign-out
2. Create task list component with loading/error states
3. Create task item component with edit/delete/toggle
4. Create task form component for creation
5. Create empty state component
6. Create dashboard page
7. Implement protected route logic

**Artifacts**: app/dashboard/*, components/tasks/*

### Phase 6: Route Configuration

**Objective**: Set up routing and navigation

**Tasks**:
1. Create root layout with global styles
2. Create home page with auth-based redirect
3. Create global error page
4. Verify route protection works

**Artifacts**: app/layout.tsx, app/page.tsx, app/error.tsx

### Phase 7: Polish & Verification

**Objective**: Ensure all requirements are met

**Tasks**:
1. Verify responsive design (320px-1920px)
2. Test all user flows per quickstart.md
3. Verify error handling
4. Verify loading states

**Artifacts**: Updated quickstart.md with verification results

## Complexity Tracking

> No constitution violations requiring justification.

| Component | Complexity | Justification |
|-----------|------------|---------------|
| API Client | Low | Simple fetch wrapper |
| Auth Flow | Low | localStorage + redirect |
| Task CRUD | Medium | Multiple operations, optimistic updates |
| Form Validation | Low | Simple inline validation |
| Responsive Design | Low | Tailwind utility classes |

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API unavailable | Medium | High | Show error message, retry button |
| Token expiry | Low | Medium | Redirect to login on 401 |
| Form validation gaps | Low | Low | Comprehensive validation rules |
| Responsive issues | Low | Medium | Test on multiple screen sizes |

## Dependencies

### External Dependencies

| Dependency | Purpose | Version |
|------------|---------|---------|
| Next.js | Framework | 16+ |
| React | UI library | 18+ |
| Tailwind CSS | Styling | Latest |
| TypeScript | Type safety | 5.x |

### Internal Dependencies

| Component | Depends On |
|-----------|------------|
| Dashboard | lib/api.ts, lib/auth.ts |
| Task Components | lib/types.ts, lib/api.ts |
| Auth Components | lib/auth.ts |
| All Components | UI components |

### Cross-Spec Dependencies

| Spec | Dependency |
|------|------------|
| Spec-1 (Backend) | API endpoints |
| Spec-2 (JWT Security) | JWT handling, token format |

## Implementation Status

Based on codebase analysis, the frontend is **already implemented**:

| Component | Status | File |
|-----------|--------|------|
| Root Layout | Complete | app/layout.tsx |
| Auth Layout | Complete | app/(auth)/layout.tsx |
| Login Page | Complete | app/(auth)/login/page.tsx |
| Signup Page | Complete | app/(auth)/signup/page.tsx |
| Dashboard Layout | Complete | app/dashboard/layout.tsx |
| Dashboard Page | Complete | app/dashboard/page.tsx |
| Home Page | Complete | app/page.tsx |
| Error Page | Complete | app/error.tsx |
| Login Form | Complete | components/auth/login-form.tsx |
| Signup Form | Complete | components/auth/signup-form.tsx |
| Task List | Complete | components/tasks/task-list.tsx |
| Task Item | Complete | components/tasks/task-item.tsx |
| Task Form | Complete | components/tasks/task-form.tsx |
| Task Empty | Complete | components/tasks/task-empty.tsx |
| Button | Complete | components/ui/button.tsx |
| Input | Complete | components/ui/input.tsx |
| Card | Complete | components/ui/card.tsx |
| Error Boundary | Complete | components/error-boundary.tsx |
| API Client | Complete | lib/api.ts |
| Auth Utils | Complete | lib/auth.ts |
| Types | Complete | lib/types.ts |

**Note**: The core implementation already exists from the main Todo app implementation. This spec documents the frontend architecture and provides verification procedures.

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Execute quickstart.md verification checklist
3. Document any gaps found during verification
4. Create PHR for this planning session
