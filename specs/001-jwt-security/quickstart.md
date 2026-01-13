# Quickstart: Authentication & JWT Security Integration

**Feature**: 001-jwt-security
**Date**: 2026-01-10

## Prerequisites

- Python 3.11+
- Node.js 18+
- Neon PostgreSQL database (with tables created)
- Environment variables configured

## Environment Setup

### Backend (.env)

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=168
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### Frontend (.env.local)

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Database Setup

Run this SQL in Neon Console (SQL Editor):

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

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);
```

## Running the Application

### Start Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

## Verification Checklist

### 1. Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected: `{"status":"healthy"}`

### 2. User Registration

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: User object with id, email, created_at

### 3. User Sign-In

```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: `{"access_token":"eyJ...","token_type":"bearer"}`

### 4. Protected Endpoint (with token)

```bash
TOKEN="<access_token from step 3>"
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

Expected: `{"tasks":[],"total":0}`

### 5. Protected Endpoint (without token)

```bash
curl http://localhost:8000/api/tasks
```

Expected: 401 Unauthorized

### 6. Frontend Authentication Flow

1. Open http://localhost:3000
2. Click "Sign Up" and create account
3. Verify redirect to dashboard
4. Check that tasks page loads
5. Sign out and verify redirect to login

## Security Verification

### Test Invalid Token

```bash
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer invalid-token-here"
```

Expected: 401 Unauthorized

### Test Expired Token

Create a token with past expiration (requires modifying test):
Expected: 401 Unauthorized

### Test Cross-User Access

1. Create User A, get token, create a task
2. Create User B, get token
3. Try to access User A's task with User B's token

```bash
curl http://localhost:8000/api/tasks/<user-a-task-id> \
  -H "Authorization: Bearer <user-b-token>"
```

Expected: 403 Forbidden OR 404 Not Found (depending on implementation)

## Troubleshooting

### CORS Errors

- Verify `CORS_ORIGINS` in backend .env matches frontend URL
- Check that frontend is running on http://localhost:3000

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection limits
- Ensure `?sslmode=require` is in URL

### JWT Errors

- Verify `BETTER_AUTH_SECRET` is at least 32 characters
- Check that secret matches between frontend config and backend

### Token Not Attached

- Check browser localStorage for 'auth_token' key
- Verify api.ts includes token in Authorization header

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
