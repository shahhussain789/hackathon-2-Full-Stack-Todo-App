# Quickstart: Todo Full-Stack Web Application

**Date**: 2026-01-10
**Version**: 1.0.0

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm or pnpm
- Neon PostgreSQL account (https://neon.tech)
- Git (optional)

## Project Setup

### 1. Clone/Initialize Repository

```bash
cd "D:\Hackathon 2 Phase 2"
```

### 2. Backend Setup

```bash
# Create backend directory structure
mkdir -p backend/app/{models,routers,schemas,auth}
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] sqlmodel asyncpg python-jose[cryptography] passlib[bcrypt] python-dotenv pydantic[email]

# Create requirements.txt
pip freeze > requirements.txt
```

### 3. Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@host/database?sslmode=require

# JWT Secret (MUST match Better Auth secret)
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters

# CORS
CORS_ORIGINS=http://localhost:3000

# Environment
ENVIRONMENT=development
```

### 4. Frontend Setup

```bash
# From project root
cd "D:\Hackathon 2 Phase 2"

# Create Next.js app with App Router
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false

# Navigate to frontend
cd frontend

# Install Better Auth
npm install better-auth @better-auth/react

# Install additional dependencies
npm install
```

### 5. Frontend Environment Variables

Create `frontend/.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
```

### 6. Database Setup

1. Log in to Neon Console (https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `backend/.env`
5. Run migration:

```bash
cd backend
# Using psql or any PostgreSQL client, run the SQL from specs/main/data-model.md
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd "D:\Hackathon 2 Phase 2\backend"
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Start Frontend (Terminal 2)

```bash
cd "D:\Hackathon 2 Phase 2\frontend"
npm run dev
```

Frontend will be available at: http://localhost:3000

## Verification Checklist

### Backend Verification

- [ ] `http://localhost:8000/docs` shows OpenAPI documentation
- [ ] `http://localhost:8000/health` returns `{"status": "healthy"}`
- [ ] Database connection works (check logs)

### Frontend Verification

- [ ] `http://localhost:3000` loads without errors
- [ ] Signup page accessible at `/signup`
- [ ] Login page accessible at `/login`

### End-to-End Verification

1. **Signup Flow**:
   - [ ] Navigate to `/signup`
   - [ ] Create account with email/password
   - [ ] Redirected to dashboard

2. **Signin Flow**:
   - [ ] Navigate to `/login`
   - [ ] Sign in with credentials
   - [ ] JWT token stored
   - [ ] Redirected to dashboard

3. **Task Operations**:
   - [ ] Create a new task
   - [ ] View task in list
   - [ ] Toggle task completion
   - [ ] Edit task title
   - [ ] Delete task

4. **Security Verification**:
   - [ ] Access `/api/tasks` without token → 401
   - [ ] Create second user, verify task isolation
   - [ ] Expired token handling

## Project Structure

```
D:\Hackathon 2 Phase 2\
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Settings and config
│   │   ├── database.py          # DB connection
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # User SQLModel
│   │   │   └── task.py          # Task SQLModel
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # Auth endpoints
│   │   │   └── tasks.py         # Task CRUD endpoints
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # User Pydantic schemas
│   │   │   └── task.py          # Task Pydantic schemas
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   └── jwt_handler.py   # JWT verification
│   │   └── dependencies.py      # FastAPI dependencies
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx         # Protected task list
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   ├── tasks/               # Task components
│   │   └── auth/                # Auth components
│   ├── lib/
│   │   ├── auth.ts              # Better Auth config
│   │   └── api.ts               # API client
│   ├── .env.local
│   └── package.json
│
└── specs/
    └── main/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── contracts/
            └── openapi.yaml
```

## Common Issues

### CORS Errors

Ensure `CORS_ORIGINS` in backend `.env` includes frontend URL.

### Database Connection Failed

1. Check DATABASE_URL format
2. Ensure Neon project is running
3. Verify SSL mode (sslmode=require)

### JWT Verification Failed

1. Ensure `BETTER_AUTH_SECRET` matches in both frontend and backend
2. Check token expiration
3. Verify token is included in Authorization header

### Better Auth Issues

1. Ensure all environment variables are set
2. Check Better Auth version compatibility
3. Verify session strategy is set to "jwt"

## Next Steps

After verification, proceed to implementation tasks in `specs/main/tasks.md`.
