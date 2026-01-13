# Research: Authentication & JWT Security Integration

**Feature**: 001-jwt-security
**Date**: 2026-01-10
**Status**: Complete

## Research Summary

This document consolidates research findings for implementing stateless JWT authentication between the Next.js frontend and FastAPI backend.

---

## Decision 1: JWT Signing Algorithm

**Decision**: Use HS256 (HMAC-SHA256) symmetric signing algorithm

**Rationale**:
- Simple shared secret model between frontend and backend
- Better Auth default algorithm
- Sufficient security for single-application use case
- Lower computational overhead than asymmetric algorithms

**Alternatives Considered**:
| Algorithm | Pros | Cons | Why Rejected |
|-----------|------|------|--------------|
| RS256 | Asymmetric, public key verification | Requires key pair management | Overkill for hackathon scope |
| ES256 | Compact signatures | More complex key handling | Not needed for this use case |
| None | No signing | Insecure | Security violation |

---

## Decision 2: Token Storage Location

**Decision**: Use localStorage for token storage

**Rationale**:
- Simple implementation for hackathon scope
- Easy access from JavaScript for API calls
- Persists across browser sessions (matches 7-day token expiry)
- Acceptable trade-off for demo purposes

**Alternatives Considered**:
| Storage | Pros | Cons | Why Rejected |
|---------|------|------|--------------|
| httpOnly Cookie | XSS-safe | Requires CSRF protection, CORS complexity | Added complexity not needed for hackathon |
| sessionStorage | Tab-scoped | Doesn't persist, poor UX | Token lost on tab close |
| Memory only | Most secure | Lost on refresh | Terrible UX |

**Production Note**: httpOnly cookies with SameSite=Strict would be preferred for production.

---

## Decision 3: Token Expiration Duration

**Decision**: 7 days (168 hours)

**Rationale**:
- Balances security and user experience
- Users don't need to re-login frequently
- Matches typical hackathon demo session length
- Spec requirement FR-016

**Alternatives Considered**:
| Duration | Pros | Cons | Why Rejected |
|----------|------|------|--------------|
| 15 minutes | High security | Requires refresh tokens | Out of scope |
| 1 hour | Moderate security | Frequent re-logins | Poor UX |
| 30 days | Great UX | Extended attack window | Too long |

---

## Decision 4: JWT Verification Library (Backend)

**Decision**: python-jose with cryptography backend

**Rationale**:
- Well-maintained, production-ready library
- Full JWT/JWS/JWE support
- cryptography backend more secure than pure-python
- Already in use in existing backend

**Alternatives Considered**:
| Library | Pros | Cons | Why Rejected |
|---------|------|------|--------------|
| PyJWT | Popular, simple | Less comprehensive | python-jose more feature-rich |
| Authlib | Full OAuth support | Heavier dependency | Overkill for JWT-only |

---

## Decision 5: Password Hashing

**Decision**: bcrypt via passlib

**Rationale**:
- Industry-standard password hashing
- Built-in salt generation
- Configurable work factor
- Already implemented in backend

**Alternatives Considered**:
| Algorithm | Pros | Cons | Why Rejected |
|-----------|------|------|--------------|
| Argon2 | Newer, memory-hard | Less widely supported | bcrypt sufficient |
| PBKDF2 | NIST approved | Weaker than bcrypt | bcrypt preferred |
| SHA256 | Fast | Not designed for passwords | Security risk |

---

## Decision 6: Better Auth Integration Approach

**Decision**: Minimal Better Auth integration - use custom JWT issuance from FastAPI

**Rationale**:
- Better Auth primarily handles frontend session management
- FastAPI needs to issue JWT tokens on its own (stateless backend)
- Shared BETTER_AUTH_SECRET ensures token compatibility
- Simpler than full Better Auth server integration

**Implementation Approach**:
1. Frontend uses localStorage for token (no Better Auth session store)
2. Backend issues JWT with user_id (sub) and email claims
3. Frontend stores token and attaches to all API requests
4. Backend verifies signature with shared secret

**Alternatives Considered**:
| Approach | Pros | Cons | Why Rejected |
|----------|------|------|--------------|
| Full Better Auth server | Complete session management | Requires Node.js backend | We have FastAPI backend |
| Better Auth client only | Session UI helpers | Still need custom JWT | What we're doing |
| Custom auth everywhere | Full control | More code | Better Auth provides value |

---

## Decision 7: Cross-User Access Prevention Strategy

**Decision**: Database query-level filtering + explicit ownership verification

**Rationale**:
- Double protection: query filters + explicit checks
- Query-level filtering prevents SQL injection of other user IDs
- Explicit verification catches edge cases
- Constitution requirement VII

**Implementation**:
```python
# Query-level filtering (all task queries include user_id)
tasks = await session.exec(
    select(Task).where(Task.user_id == current_user_id)
)

# Explicit ownership verification (for single-resource operations)
if task.user_id != current_user_id:
    raise HTTPException(status_code=403, detail="Forbidden")
```

---

## Decision 8: Error Response Standardization

**Decision**: Consistent JSON error format with generic auth messages

**Rationale**:
- Prevents information leakage (email enumeration, etc.)
- Clear error structure for frontend handling
- Constitution requirements SR-003, SR-004

**Error Format**:
```json
{
  "detail": "Authentication failed"  // Generic, never reveals which field
}
```

**HTTP Status Mapping**:
| Scenario | Status | Detail Message |
|----------|--------|----------------|
| Missing token | 401 | "Not authenticated" |
| Invalid token | 401 | "Invalid or expired token" |
| Expired token | 401 | "Invalid or expired token" |
| Wrong password | 401 | "Invalid credentials" |
| Wrong email | 401 | "Invalid credentials" |
| Cross-user access | 403 | "Forbidden" |

---

## Existing Implementation Review

The following components already exist and align with decisions:

| Component | File | Status |
|-----------|------|--------|
| JWT Handler | `backend/app/auth/jwt_handler.py` | Complete - uses python-jose, bcrypt |
| Auth Router | `backend/app/routers/auth.py` | Complete - signup, signin, signout |
| Frontend Auth | `frontend/lib/auth.ts` | Complete - localStorage token storage |
| API Client | `frontend/lib/api.ts` | Complete - auto-attaches JWT to requests |
| Config | `backend/app/config.py` | Complete - BETTER_AUTH_SECRET from env |

**Gap Analysis**: The existing implementation covers all research decisions. This spec focuses on documenting the security architecture and ensuring all edge cases are handled.

---

## Security Checklist

- [x] JWT signed with HS256 using BETTER_AUTH_SECRET
- [x] Passwords hashed with bcrypt (never stored plaintext)
- [x] Token expiration enforced (7 days)
- [x] Generic error messages (no email enumeration)
- [x] User ID from JWT only (never trust request body)
- [x] Cross-user access returns 403
- [x] Missing/invalid token returns 401
- [x] Secrets in environment variables only

---

## References

- [python-jose Documentation](https://python-jose.readthedocs.io/)
- [passlib bcrypt](https://passlib.readthedocs.io/en/stable/lib/passlib.hash.bcrypt.html)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [Better Auth Documentation](https://www.better-auth.com/)
