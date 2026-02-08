/**
 * Database Initialization Script
 * Run this script to create database tables
 * 
 * Usage: node scripts/init-db.js
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in .env.local')
    console.log('\nPlease create .env.local file with:')
    console.log('DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require')
    process.exit(1)
  }

  console.log('🔌 Connecting to database...')
  const sql = neon(process.env.DATABASE_URL)

  try {
    // Test connection
    await sql`SELECT 1`
    console.log('✅ Database connection successful\n')

    // Create users table
    console.log('📝 Creating users table...')
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✅ Users table created\n')

    // Create tasks table
    // Note: Foreign keys removed for Neon serverless compatibility
    console.log('📝 Creating tasks table...')
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
    console.log('✅ Tasks table created\n')

    // Create index
    console.log('📝 Creating index...')
    await sql`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
    `
    console.log('✅ Index created\n')

    // Create conversations table
    // Note: Foreign keys removed for Neon serverless compatibility
    console.log('📝 Creating conversations table...')
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✅ Conversations table created\n')

    // Create messages table
    console.log('📝 Creating messages table...')
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
    console.log('✅ Messages table created\n')

    // Create indexes for conversations and messages
    console.log('📝 Creating indexes for conversations and messages...')
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)
    `
    console.log('✅ Indexes created\n')

    // Verify tables
    console.log('🔍 Verifying tables...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'tasks', 'conversations', 'messages')
    `
    
    console.log('✅ Database initialized successfully!')
    console.log('\n📊 Tables created:')
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`)
    })
    
    console.log('\n🎉 Setup complete! You can now use the application.')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error initializing database:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

initDatabase()

