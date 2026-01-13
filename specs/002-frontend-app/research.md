# Research: Frontend Web Application

**Feature**: 002-frontend-app
**Date**: 2026-01-11
**Status**: Complete

## Research Summary

This document consolidates research findings for implementing the Next.js frontend application with JWT authentication and task management.

---

## Decision 1: Next.js App Router Structure

**Decision**: Use App Router with route groups for authentication and protected routes

**Rationale**:
- Route groups `(auth)` and `dashboard` provide clean URL structure
- Layouts enable shared UI patterns (auth layout, dashboard layout)
- Server/Client component model aligns with modern React patterns
- Built-in loading and error states

**Implementation Structure**:
```
app/
├── (auth)/           # Route group for auth pages
│   ├── layout.tsx    # Centered auth layout
│   ├── login/
│   └── signup/
├── dashboard/        # Protected route
│   ├── layout.tsx    # Dashboard layout with navbar
│   └── page.tsx      # Task list
├── layout.tsx        # Root layout
├── page.tsx          # Home redirect
└── error.tsx         # Global error boundary
```

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| Pages Router | Simpler mental model | Legacy, no layouts | App Router is modern standard |
| All in dashboard/ | Simpler structure | Auth pages in protected area | Poor URL semantics |

---

## Decision 2: Authentication State Management

**Decision**: Use localStorage for JWT token with custom hooks

**Rationale**:
- Simple implementation suitable for hackathon
- Token persists across page refreshes
- Easy to check authentication status
- Already implemented in Spec-2

**Implementation**:
```typescript
// lib/api.ts
const TOKEN_KEY = 'auth_token';

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
```

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| httpOnly Cookie | More secure (XSS-safe) | Complex CORS, CSRF needed | Overkill for hackathon |
| Context/Redux | Centralized state | Added complexity | localStorage sufficient |
| Better Auth session | Full session management | Requires Node.js backend | We have FastAPI |

---

## Decision 3: API Client Pattern

**Decision**: Typed fetch wrapper with automatic JWT attachment

**Rationale**:
- Type safety with TypeScript generics
- Automatic Authorization header injection
- Consistent error handling across all requests
- Easy to test and mock

**Implementation**:
```typescript
export const api = {
  async get<T>(url: string): Promise<ApiResponse<T>> { ... },
  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> { ... },
  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> { ... },
  async delete<T>(url: string): Promise<ApiResponse<T>> { ... },
  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> { ... },
};
```

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| Axios | Popular, interceptors | Additional dependency | fetch is native |
| SWR/React Query | Caching, revalidation | Added complexity | Simple CRUD sufficient |
| tRPC | End-to-end type safety | Requires backend changes | Backend is FastAPI |

---

## Decision 4: Component Architecture

**Decision**: Feature-based component organization with UI primitives

**Rationale**:
- Clear separation of concerns
- Reusable UI components
- Easy to locate components by feature
- Consistent styling patterns

**Structure**:
```
components/
├── auth/             # Authentication components
│   ├── login-form.tsx
│   └── signup-form.tsx
├── tasks/            # Task management components
│   ├── task-list.tsx
│   ├── task-item.tsx
│   ├── task-form.tsx
│   └── task-empty.tsx
├── ui/               # Reusable UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
└── error-boundary.tsx
```

---

## Decision 5: Form Handling

**Decision**: Controlled forms with useState and inline validation

**Rationale**:
- Simple and predictable behavior
- No additional dependencies
- Easy to implement validation
- Clear error state management

**Pattern**:
```typescript
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Validate before submit
// Show inline errors
// Disable button during submission
```

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| React Hook Form | Performant, validation | Learning curve | Simple forms don't need it |
| Formik | Full-featured | Heavy for simple forms | Overkill |
| Uncontrolled forms | Less re-renders | Harder validation | Need controlled validation |

---

## Decision 6: Styling Approach

**Decision**: Tailwind CSS utility classes

**Rationale**:
- Rapid development with utility classes
- Consistent spacing and colors
- Responsive design built-in
- No CSS file management

**Responsive Breakpoints**:
- Mobile: < 640px (default)
- Desktop: >= 640px (sm:)
- Large: >= 1024px (lg:)

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| CSS Modules | Scoped styles | More files, slower dev | Tailwind is faster |
| Styled Components | CSS-in-JS | Runtime overhead | Tailwind is simpler |
| Plain CSS | No dependencies | Hard to maintain | Tailwind provides consistency |

---

## Decision 7: Error Handling Strategy

**Decision**: Multi-level error handling with graceful degradation

**Rationale**:
- Global error boundary catches unexpected errors
- Component-level error states for API failures
- Form validation errors inline
- 401 responses trigger redirect to login

**Implementation Layers**:
1. **Global**: `app/error.tsx` - catches unhandled errors
2. **Component**: Error state in task-list, forms
3. **API**: Consistent error response handling
4. **Auth**: 401 → redirect to /login

---

## Decision 8: Loading States

**Decision**: Component-level loading indicators

**Rationale**:
- Users see immediate feedback
- Buttons disabled during submission
- Skeleton/spinner during data fetch
- Optimistic updates where appropriate

**Implementation**:
```typescript
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

// Show spinner while loading
// Disable buttons while submitting
// Optimistic UI for toggles
```

---

## Existing Implementation Review

Based on codebase analysis, the frontend is **already implemented**:

| Component | File | Status |
|-----------|------|--------|
| Root Layout | `app/layout.tsx` | Complete |
| Auth Layout | `app/(auth)/layout.tsx` | Complete |
| Login Page | `app/(auth)/login/page.tsx` | Complete |
| Signup Page | `app/(auth)/signup/page.tsx` | Complete |
| Dashboard Layout | `app/dashboard/layout.tsx` | Complete |
| Dashboard Page | `app/dashboard/page.tsx` | Complete |
| Home Redirect | `app/page.tsx` | Complete |
| Error Page | `app/error.tsx` | Complete |
| Login Form | `components/auth/login-form.tsx` | Complete |
| Signup Form | `components/auth/signup-form.tsx` | Complete |
| Task List | `components/tasks/task-list.tsx` | Complete |
| Task Item | `components/tasks/task-item.tsx` | Complete |
| Task Form | `components/tasks/task-form.tsx` | Complete |
| Task Empty | `components/tasks/task-empty.tsx` | Complete |
| Button | `components/ui/button.tsx` | Complete |
| Input | `components/ui/input.tsx` | Complete |
| Card | `components/ui/card.tsx` | Complete |
| Error Boundary | `components/error-boundary.tsx` | Complete |
| API Client | `lib/api.ts` | Complete |
| Auth Utils | `lib/auth.ts` | Complete |
| Types | `lib/types.ts` | Complete |

**Gap Analysis**: All spec requirements are implemented. This plan documents the architecture and provides verification procedures.

---

## UI/UX Checklist

- [x] Forms show inline validation errors
- [x] Buttons disabled during pending operations
- [x] Success and error feedback visible
- [x] Navigation between auth pages
- [x] Dashboard includes sign-out option
- [x] Completed tasks visually distinguished
- [x] Empty task list shows helpful prompt
- [x] Responsive design (mobile and desktop)

---

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Patterns](https://reactpatterns.com/)
