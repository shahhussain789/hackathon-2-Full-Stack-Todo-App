# Quickstart: Frontend Web Application

**Feature**: 002-frontend-app
**Date**: 2026-01-11

## Prerequisites

- Node.js 18+
- Backend API running (see Spec-1 quickstart)
- Environment variables configured

## Environment Setup

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Installation

```bash
cd frontend
npm install
```

## Running the Application

### Development Mode

```bash
cd frontend
npm run dev
```

Application available at: http://localhost:3000

### Production Build

```bash
cd frontend
npm run build
npm start
```

## Verification Checklist

### 1. Application Loads

- [ ] Navigate to http://localhost:3000
- [ ] Should redirect to /login (if not authenticated)

### 2. User Registration (US1)

- [ ] Click "Sign Up" link
- [ ] Enter valid email and password (8+ chars)
- [ ] Submit form
- [ ] Should redirect to /dashboard
- [ ] Should see empty task list

### 3. User Sign-In (US2)

- [ ] Sign out (if authenticated)
- [ ] Navigate to /login
- [ ] Enter registered credentials
- [ ] Submit form
- [ ] Should redirect to /dashboard

### 4. View Task List (US3)

- [ ] After sign-in, see dashboard
- [ ] Task list displays (may be empty)
- [ ] Loading state appears while fetching

### 5. Create Task (US4)

- [ ] Enter task title in form
- [ ] Click "Add Task" button
- [ ] Task appears in list
- [ ] Form clears after creation

### 6. Toggle Task Completion (US7)

- [ ] Click checkbox on a task
- [ ] Task styling changes (strikethrough)
- [ ] Toggle back - styling reverts

### 7. Edit Task (US5)

- [ ] Click "Edit" on a task
- [ ] Modify the title
- [ ] Click "Save"
- [ ] Task shows updated title

### 8. Delete Task (US6)

- [ ] Click "Delete" on a task
- [ ] Confirm deletion
- [ ] Task removed from list

### 9. Sign Out (US8)

- [ ] Click "Sign Out" in navbar
- [ ] Should redirect to /login
- [ ] Cannot access /dashboard directly

### 10. Protected Routes (US9)

- [ ] Sign out
- [ ] Navigate directly to /dashboard
- [ ] Should redirect to /login

## Error Handling Verification

### Form Validation

- [ ] Submit empty email → shows error
- [ ] Submit invalid email → shows error
- [ ] Submit short password → shows error
- [ ] Submit empty task title → shows error

### API Errors

- [ ] Stop backend, try to load tasks → shows error message
- [ ] Try invalid login → shows error message

### Auth Errors

- [ ] Clear localStorage token manually
- [ ] Refresh dashboard page
- [ ] Should redirect to login

## Responsive Design Verification

### Mobile (320px - 639px)

- [ ] Login form fits on screen
- [ ] Task list is scrollable
- [ ] Buttons are touch-friendly
- [ ] Text is readable

### Desktop (640px+)

- [ ] Layout uses available space
- [ ] Form is centered
- [ ] Task list has comfortable width

## Browser DevTools Checks

### Network Tab

- [ ] API calls include Authorization header
- [ ] Token is Bearer format
- [ ] Responses are JSON

### Application Tab

- [ ] auth_token in localStorage after login
- [ ] Token cleared after logout

### Console Tab

- [ ] No JavaScript errors
- [ ] No unhandled promise rejections

## Troubleshooting

### "Network Error" on API calls

1. Verify backend is running on port 8000
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Verify CORS allows localhost:3000

### "Invalid credentials" on login

1. Verify user exists in database
2. Check password is correct
3. Verify backend auth endpoint works

### Stuck on loading

1. Check browser console for errors
2. Verify API response format
3. Check network tab for failed requests

### Token not persisting

1. Check localStorage in DevTools
2. Verify setToken is called on login
3. Check for localStorage errors in console

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Sign Up | POST | /api/auth/signup |
| Sign In | POST | /api/auth/signin |
| Sign Out | POST | /api/auth/signout |
| List Tasks | GET | /api/tasks |
| Create Task | POST | /api/tasks |
| Get Task | GET | /api/tasks/{id} |
| Update Task | PUT | /api/tasks/{id} |
| Delete Task | DELETE | /api/tasks/{id} |
| Toggle Task | PATCH | /api/tasks/{id}/toggle |
