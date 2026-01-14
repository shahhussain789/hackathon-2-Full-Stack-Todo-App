---
name: database-skill
description: Design database schemas, create tables, and manage migrations using best practices. Use for backend and full-stack applications.
---

# Database Skill – Schema Design & Migrations

## Purpose
This skill is responsible for creating, modifying, and maintaining database structures in a safe, scalable, and maintainable way.

## Instructions

### 1. Schema Design
- Identify entities and their relationships clearly
- Normalize data to reduce redundancy
- Choose appropriate data types
- Define primary keys and foreign keys explicitly

### 2. Table Creation
- Use consistent and readable naming conventions
- Enforce constraints (NOT NULL, UNIQUE, CHECK)
- Add indexes for frequently queried fields
- Support soft deletes where applicable

### 3. Migrations
- Create versioned migrations for every schema change
- Always include rollback/down migrations
- Keep migrations small and atomic
- Avoid destructive changes without backups

### 4. Relationships
- Implement one-to-one, one-to-many, and many-to-many relationships correctly
- Use junction tables for many-to-many relations
- Define cascade rules (ON DELETE / ON UPDATE) carefully

## Best Practices
- Use UUIDs or auto-increment IDs consistently
- Add timestamps (`created_at`, `updated_at`) to all tables
- Index foreign keys and search-heavy columns
- Balance normalization with performance needs
- Design schema for future scalability
- Document all schema changes clearly

## Example

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migration example
ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT false;
