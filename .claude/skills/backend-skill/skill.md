---
name: backend-skill
description: Generate backend routes, handle HTTP requests/responses, and connect applications to databases securely and efficiently.
---

# Backend Development Skill

## Instructions

1. **Routing**
   - Create RESTful and/or API routes
   - Follow clean URL and naming conventions
   - Separate routes by feature/module
   - Support CRUD operations

2. **Request & Response Handling**
   - Parse request bodies, params, and headers
   - Validate incoming data before processing
   - Return structured JSON responses
   - Use proper HTTP status codes (200, 201, 400, 401, 404, 500)

3. **Database Integration**
   - Connect to SQL or NoSQL databases
   - Perform secure queries (ORM or parameterized queries)
   - Handle database errors gracefully
   - Manage connections efficiently

4. **Middleware Usage**
   - Authentication & authorization middleware
   - Validation middleware
   - Error-handling middleware
   - Logging where necessary

## Best Practices
- Keep controllers thin and services reusable
- Validate all inputs before DB operations
- Never expose sensitive data in responses
- Use environment variables for secrets
- Follow async/await patterns consistently
- Return predictable API response formats

## Example Structure
```js
// routes/user.routes.js
import express from "express";
import { createUser, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getUser);

export default router;
