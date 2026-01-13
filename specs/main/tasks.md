# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/main/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. Manual e2e testing per plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- Includes exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` at repository root
- **Frontend**: `frontend/` at repository root
- Paths shown below use web app structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both backend and frontend

- [x] T001 Create backend project directory structure: `backend/app/{models,routers,schemas,auth}/`
- [x] T002 [P] Create `backend/app/__init__.py` (empty package init)
- [x] T003 [P] Create `backend/requirements.txt` with FastAPI, SQLModel, asyncpg, python-jose, passlib, python-dotenv, pydantic
- [x] T004 [P] Create `backend/.env.example` with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS placeholders
- [x] T005 Create `backend/app/config.py` with Pydantic Settings loading from .env
- [x] T006 Create `backend/app/database.py` with async SQLModel engine and session factory for Neon PostgreSQL
- [x] T007 Initialize Next.js 16+ project in `frontend/` with App Router, TypeScript, Tailwind CSS
- [x] T008 [P] Create `frontend/.env.local.example` with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET placeholders
- [ ] T009 [P] Install Better Auth dependencies in frontend: `npm install better-auth @better-auth/react`

**Checkpoint**: Backend and frontend project shells ready, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Create User SQLModel in `backend/app/models/user.py` per data-model.md
- [x] T011 [P] Create Task SQLModel in `backend/app/models/task.py` per data-model.md
- [x] T012 [P] Create `backend/app/models/__init__.py` exporting User and Task models
- [x] T013 Create Pydantic schemas in `backend/app/schemas/user.py`: UserCreate, UserLogin, UserResponse, TokenResponse
- [x] T014 [P] Create Pydantic schemas in `backend/app/schemas/task.py`: TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
- [x] T015 [P] Create `backend/app/schemas/__init__.py` exporting all schemas
- [x] T016 Create JWT handler in `backend/app/auth/jwt_handler.py` with create_token, verify_token, get_current_user dependency
- [x] T017 [P] Create `backend/app/auth/__init__.py` exporting jwt_handler functions
- [x] T018 Create `backend/app/dependencies.py` with get_db async session dependency
- [x] T019 Create `backend/app/main.py` with FastAPI app, CORS middleware, health endpoint, router includes
- [x] T020 Create `frontend/lib/types.ts` with TypeScript types matching API schemas (User, Task, TokenResponse, etc.)
- [x] T021 [P] Create `frontend/lib/api.ts` with typed fetch wrapper, JWT header attachment, 401/403 handling
- [x] T022 Create `frontend/lib/auth.ts` with Better Auth client configuration (JWT session strategy)
- [x] T023 Create `frontend/app/layout.tsx` root layout with providers (Better Auth, global styles)
- [ ] T024 Run database migration SQL from data-model.md on Neon PostgreSQL to create users and tasks tables

**Checkpoint**: Foundation ready - models, schemas, JWT handler, API client configured. User story implementation can now begin.

---

## Phase 3: User Story 1 - User Registration (Priority: P1)

**Goal**: Allow new users to create accounts with email and password

**Independent Test**: Complete signup flow, verify user record in database, verify redirect to dashboard

### Implementation for User Story 1

- [x] T025 [US1] Create password hashing utility in `backend/app/auth/jwt_handler.py` using passlib bcrypt
- [x] T026 [US1] Create auth router in `backend/app/routers/auth.py` with POST `/api/auth/signup` endpoint
- [x] T027 [US1] Implement signup logic: validate email uniqueness, hash password, create user, return UserResponse (201)
- [x] T028 [US1] Handle signup errors: 400 for validation, 409 for duplicate email
- [x] T029 [US1] Create `backend/app/routers/__init__.py` exporting auth router
- [x] T030 [US1] Register auth router in `backend/app/main.py`
- [x] T031 [US1] Create `frontend/components/auth/signup-form.tsx` with email/password inputs, validation, submit handler
- [x] T032 [US1] Create `frontend/app/(auth)/signup/page.tsx` rendering SignupForm
- [x] T033 [US1] Create `frontend/app/(auth)/layout.tsx` auth layout (centered, no navbar)
- [x] T034 [US1] Implement signup form submission: call API, handle success (redirect to login), handle errors (display message)

**Checkpoint**: User can create account via signup form, user record created in database

---

## Phase 4: User Story 2 - User Authentication (Priority: P1)

**Goal**: Allow registered users to sign in and receive JWT token

**Independent Test**: Sign in with valid credentials, verify JWT token returned, verify redirect to dashboard

### Implementation for User Story 2

- [x] T035 [US2] Add POST `/api/auth/signin` endpoint in `backend/app/routers/auth.py`
- [x] T036 [US2] Implement signin logic: verify email exists, verify password hash, create JWT token, return TokenResponse (200)
- [x] T037 [US2] Handle signin errors: 401 for invalid credentials
- [x] T038 [US2] Add POST `/api/auth/signout` endpoint in `backend/app/routers/auth.py` (returns success message)
- [x] T039 [US2] Create `frontend/components/auth/login-form.tsx` with email/password inputs, validation, submit handler
- [x] T040 [US2] Create `frontend/app/(auth)/login/page.tsx` rendering LoginForm
- [x] T041 [US2] Implement login form submission: call API, store JWT token via Better Auth, redirect to dashboard
- [x] T042 [US2] Create `frontend/app/page.tsx` landing page with redirect logic (to dashboard if authenticated, else to login)
- [x] T043 [US2] Implement logout functionality in frontend (clear token, redirect to login)

**Checkpoint**: User can sign in, JWT token stored, can navigate to protected dashboard

---

## Phase 5: User Story 3 - View Tasks (Priority: P1)

**Goal**: Authenticated users can see their list of tasks (only their own)

**Independent Test**: GET /api/tasks with valid JWT returns only user's tasks, verify user isolation

### Implementation for User Story 3

- [x] T044 [US3] Create tasks router in `backend/app/routers/tasks.py` with GET `/api/tasks` endpoint
- [x] T045 [US3] Implement list tasks logic: require JWT (get_current_user), filter by user_id, return TaskListResponse (200)
- [x] T046 [US3] Add optional `completed` query parameter filter to GET `/api/tasks`
- [x] T047 [US3] Register tasks router in `backend/app/main.py`
- [x] T048 [US3] Create `frontend/components/tasks/task-item.tsx` displaying single task (title, completion status checkbox)
- [x] T049 [US3] Create `frontend/components/tasks/task-empty.tsx` empty state component
- [x] T050 [US3] Create `frontend/components/tasks/task-list.tsx` container fetching and rendering tasks
- [x] T051 [US3] Create `frontend/app/dashboard/layout.tsx` with navbar (logout button) and auth protection
- [x] T052 [US3] Create `frontend/app/dashboard/page.tsx` rendering TaskList component
- [x] T053 [US3] Implement auth protection: redirect to login if no valid token

**Checkpoint**: Authenticated user sees their task list on dashboard, empty state shown if no tasks

---

## Phase 6: User Story 4 - Create Task (Priority: P2)

**Goal**: Authenticated users can create new tasks

**Independent Test**: POST /api/tasks with valid JWT creates task with correct user_id

### Implementation for User Story 4

- [x] T054 [US4] Add POST `/api/tasks` endpoint in `backend/app/routers/tasks.py`
- [x] T055 [US4] Implement create task logic: require JWT, validate TaskCreate, set user_id from token, return TaskResponse (201)
- [x] T056 [US4] Handle create errors: 400 for validation (empty title), 401 for no auth
- [x] T057 [US4] Create `frontend/components/tasks/task-form.tsx` with title input, optional description, submit button
- [x] T058 [US4] Integrate TaskForm into dashboard page for creating new tasks
- [x] T059 [US4] Implement form submission: call POST API, refresh task list on success, show error on failure

**Checkpoint**: User can create tasks via form, new tasks appear in list immediately

---

## Phase 7: User Story 5 - Update Task (Priority: P2)

**Goal**: Authenticated users can edit their own tasks

**Independent Test**: PUT /api/tasks/{id} with valid JWT updates task, 403 if not owner

### Implementation for User Story 5

- [x] T060 [US5] Add GET `/api/tasks/{task_id}` endpoint in `backend/app/routers/tasks.py`
- [x] T061 [US5] Implement get single task: require JWT, verify ownership (403 if mismatch), return TaskResponse (200)
- [x] T062 [US5] Handle get errors: 404 if not found, 403 if wrong user
- [x] T063 [US5] Add PUT `/api/tasks/{task_id}` endpoint in `backend/app/routers/tasks.py`
- [x] T064 [US5] Implement update task: require JWT, verify ownership (403), validate TaskUpdate, update fields, return TaskResponse (200)
- [x] T065 [US5] Handle update errors: 400 for validation, 403 for wrong user, 404 for not found
- [x] T066 [US5] Add edit mode to `frontend/components/tasks/task-item.tsx` (inline editing or modal)
- [x] T067 [US5] Implement edit submission: call PUT API, update local state on success, show error on failure

**Checkpoint**: User can edit task title and description, changes persist

---

## Phase 8: User Story 6 - Delete Task (Priority: P2)

**Goal**: Authenticated users can delete their own tasks

**Independent Test**: DELETE /api/tasks/{id} with valid JWT removes task, 403 if not owner

### Implementation for User Story 6

- [x] T068 [US6] Add DELETE `/api/tasks/{task_id}` endpoint in `backend/app/routers/tasks.py`
- [x] T069 [US6] Implement delete task: require JWT, verify ownership (403), delete from DB, return 204
- [x] T070 [US6] Handle delete errors: 403 for wrong user, 404 for not found
- [x] T071 [US6] Add delete button to `frontend/components/tasks/task-item.tsx`
- [x] T072 [US6] Implement delete with confirmation dialog before API call
- [x] T073 [US6] Implement delete submission: call DELETE API, remove from local state on success

**Checkpoint**: User can delete tasks with confirmation, tasks removed from list

---

## Phase 9: User Story 7 - Toggle Task Completion (Priority: P2)

**Goal**: Authenticated users can mark tasks complete/incomplete

**Independent Test**: PATCH /api/tasks/{id}/toggle toggles is_completed, completed tasks visually distinguished

### Implementation for User Story 7

- [x] T074 [US7] Add PATCH `/api/tasks/{task_id}/toggle` endpoint in `backend/app/routers/tasks.py`
- [x] T075 [US7] Implement toggle: require JWT, verify ownership (403), flip is_completed, return TaskResponse (200)
- [x] T076 [US7] Handle toggle errors: 403 for wrong user, 404 for not found
- [x] T077 [US7] Wire checkbox in `frontend/components/tasks/task-item.tsx` to toggle API
- [x] T078 [US7] Add visual distinction for completed tasks (strikethrough, different color, etc.)
- [x] T079 [US7] Implement optimistic update: update UI immediately, rollback on API failure

**Checkpoint**: User can toggle task completion, visual feedback immediate

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T080 [P] Create `frontend/components/ui/button.tsx` reusable button component with variants
- [x] T081 [P] Create `frontend/components/ui/input.tsx` reusable input component with error states
- [x] T082 [P] Create `frontend/components/ui/card.tsx` reusable card component
- [x] T083 Add loading states to all API calls in frontend components
- [x] T084 Add error boundary and global error handling in frontend
- [x] T085 [P] Ensure responsive design: test on mobile (320px) and desktop (1920px) viewports
- [x] T086 [P] Add proper CORS configuration in `backend/app/main.py` for frontend origin
- [x] T087 Review and ensure all API errors return consistent JSON format per openapi.yaml
- [x] T088 Verify JWT expiry handling: frontend redirects to login on 401
- [ ] T089 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1 Registration (Phase 3)**: Depends on Foundational
- **US2 Authentication (Phase 4)**: Depends on US1 (need account to sign in)
- **US3 View Tasks (Phase 5)**: Depends on US2 (need JWT to access)
- **US4-US7 (Phases 6-9)**: Depend on US3 (need to view tasks first)
- **Polish (Phase 10)**: Can run in parallel with US4-US7

### User Story Dependencies

```
US1 (Registration) ──→ US2 (Authentication) ──→ US3 (View Tasks)
                                                      ↓
                            ┌──────────────┬──────────┴──────────┐
                            ↓              ↓                     ↓
                       US4 (Create)   US5 (Update)         US6 (Delete)
                                           ↓
                                      US7 (Toggle)
```

### Within Each User Story

- Backend endpoint before frontend component
- API integration before UI polish
- Core functionality before error handling

### Parallel Opportunities

**Setup Phase (all [P] tasks):**
```bash
# Can run in parallel:
T002, T003, T004  # Package init, requirements, env example
T007, T008, T009  # Frontend setup tasks
```

**Foundational Phase (all [P] tasks):**
```bash
# Can run in parallel:
T010, T011  # User and Task models
T013, T014  # User and Task schemas
T020, T021  # Frontend types and API client
```

**Polish Phase (all [P] tasks):**
```bash
# Can run in parallel:
T080, T081, T082  # UI components
T085, T086  # Responsive and CORS
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 Registration
4. Complete Phase 4: US2 Authentication
5. Complete Phase 5: US3 View Tasks
6. **STOP and VALIDATE**: Test signup → signin → view empty task list
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 → Auth works (can signup/signin)
3. Add US3 → Can view tasks (MVP!)
4. Add US4 → Can create tasks
5. Add US5-US7 → Full CRUD complete
6. Add Polish → Production ready

### Total Task Count Summary

| Phase | Task Count | Parallel Tasks |
|-------|-----------|----------------|
| Phase 1: Setup | 9 | 5 |
| Phase 2: Foundational | 15 | 8 |
| Phase 3: US1 Registration | 10 | 0 |
| Phase 4: US2 Authentication | 9 | 0 |
| Phase 5: US3 View Tasks | 10 | 0 |
| Phase 6: US4 Create Task | 6 | 0 |
| Phase 7: US5 Update Task | 8 | 0 |
| Phase 8: US6 Delete Task | 6 | 0 |
| Phase 9: US7 Toggle | 6 | 0 |
| Phase 10: Polish | 10 | 5 |
| **Total** | **89** | **18** |

---

## Notes

- [P] tasks = different files, no dependencies
- [USn] label maps task to specific user story for traceability
- Each user story should be independently completable and testable after US1-US3 foundation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
