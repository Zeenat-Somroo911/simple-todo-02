/**
 * Neon DB Connection
 */
import { neon } from '@neondatabase/serverless'

// Get DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL

// Validate DATABASE_URL is set
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!')
  console.error('📝 Please create a .env.local file in the simple-todo directory with:')
  console.error('   DATABASE_URL=postgresql://user:password@host:port/database')
  console.error('')
  console.error('💡 For Neon (recommended): Get your connection string from https://console.neon.tech')
  console.error('💡 For local PostgreSQL: postgresql://postgres:password@localhost:5432/todo_db')
}

// Create sql instance - will be used at runtime
// During build time, this won't cause issues if DATABASE_URL is not set
// For Vercel deployment, DATABASE_URL should be set in environment variables
// We use a dummy connection string during build, but it will error at runtime if not set
export const sql = DATABASE_URL 
  ? neon(DATABASE_URL)
  : neon('postgresql://dummy:dummy@dummy:5432/dummy')

/**
 * Initialize database tables
 */
export async function initDatabase() {
  try {
    console.log('Starting database initialization...')
    
    // Create users table
    console.log('Creating users table...')
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('Users table created successfully')

    // Create tasks table
    // Note: Foreign keys removed for Neon serverless compatibility
    console.log('Creating tasks table...')
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(50) DEFAULT 'medium',
        due_date TIMESTAMP WITH TIME ZONE,
        category VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('Tasks table created successfully')

    // Create index for faster queries
    console.log('Creating index...')
    await sql`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
    `
    console.log('Index created successfully')

    // Create conversations table
    // Note: Foreign keys removed for Neon serverless compatibility
    // Application logic handles referential integrity
    console.log('Creating conversations table...')
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('Conversations table created successfully')

    // Create messages table
    console.log('Creating messages table...')
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('Messages table created successfully')

    // Create indexes for faster queries
    console.log('Creating indexes for conversations and messages...')
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)
    `
    console.log('Indexes created successfully')

    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'tasks', 'conversations', 'messages')
    ` as Array<{ table_name: string }>
    
    console.log('Database initialized successfully')
    console.log('Tables created:', tables.map((t) => t.table_name))
    
    return {
      success: true,
      tables: tables.map((t) => t.table_name)
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

