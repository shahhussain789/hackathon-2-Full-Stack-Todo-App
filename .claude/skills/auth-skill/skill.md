---
name: auth-skill
description: Implement secure user authentication flows including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Auth Skill – Secure Authentication & Authorization

## Instructions

1. **Signup Flow**
   - Validate user input (email, password, username)
   - Enforce strong password policies
   - Hash passwords using bcrypt or argon2
   - Prevent duplicate accounts
   - Store only hashed credentials

2. **Signin Flow**
   - Validate credentials securely
   - Compare hashed passwords safely
   - Implement rate limiting / brute-force protection
   - Return consistent error messages (avoid user enumeration)

3. **Password Hashing**
   - Use bcrypt or argon2 (never plain text or SHA)
   - Apply appropriate salt rounds
   - Re-hash passwords when security parameters change

4. **JWT Token Handling**
   - Generate access tokens with short expiry
   - Use refresh tokens securely
   - Sign tokens with strong secrets or private keys
   - Validate token signature, expiry, and claims
   - Rotate and revoke tokens when required

5. **Better Auth Integration**
   - Configure providers correctly
   - Secure callback URLs
   - Validate sessions and tokens
   - Align Better Auth flows with existing user models

6. **Authorization**
   - Enforce role-based or permission-based access control
   - Protect routes and APIs
   - Verify user identity on every protected request

## Security Best Practices
- Never store plain-text passwords
- Always validate inputs on server side
- Use HTTPS only for auth-related requests
- Protect against CSRF, XSS, and token leakage
- Store secrets in environment variables
- Log auth events without exposing sensitive data
- Implement logout and token invalidation properly

## Example Structure
```js
// Signup
const hashedPassword = await bcrypt.hash(password, 12);
await db.user.create({
  email,
  password: hashedPassword,
});

// JWT generation
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);

// Token verification middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = payload;
  next();
}
