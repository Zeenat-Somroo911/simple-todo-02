# Database Migrations

This directory contains SQL migration files for database schema changes.

## Migration Files

- `003_add_chatbot_tables.sql` - Adds conversations and messages tables for Phase III chatbot functionality

## Running Migrations

### Option 1: Using psql command line

```bash
psql $DATABASE_URL -f migrations/003_add_chatbot_tables.sql
```

### Option 2: Using the init-db script (recommended for new setups)

The `scripts/init-db.js` script has been updated to include all tables. For new database setups:

```bash
npm run init-db
```

### Option 2b: Using the chatbot tables script (for existing databases)

If you only need to add the chatbot tables to an existing database:

```bash
node scripts/add-chatbot-tables-simple.js
```

### Option 3: Using a PostgreSQL client

Copy and paste the SQL from the migration file into your PostgreSQL client (pgAdmin, DBeaver, etc.)

### Option 4: Using the API endpoint

You can also use the `/api/init-db` endpoint which will create all tables including the new ones:

```bash
curl http://localhost:3000/api/init-db
```

## Migration History

- **003_add_chatbot_tables.sql** (2025-01-03)
  - Added `conversations` table for storing user conversation sessions
  - Added `messages` table for storing individual messages
  - Added indexes for performance optimization

## Notes

- All migrations use `IF NOT EXISTS` clauses, so they are safe to run multiple times
- Foreign key constraints are NOT used (for Neon serverless compatibility)
- Application logic should handle referential integrity
- Indexes are created for common query patterns (user_id, conversation_id)

