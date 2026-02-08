/**
 * Add Chatbot Tables Script
 * Run this script to add conversations and messages tables
 * 
 * Usage: node scripts/add-chatbot-tables.js
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

async function addChatbotTables() {
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

    // Create conversations table
    console.log('📝 Creating conversations table...')
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS conversations (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log('✅ Conversations table created\n')
    } catch (error) {
      console.log('⚠️  Conversations table might already exist or error:', error.message)
    }

    // Create messages table
    console.log('📝 Creating messages table...')
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          user_id VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log('✅ Messages table created\n')
    } catch (error) {
      console.log('⚠️  Messages table might already exist or error:', error.message)
    }

    // Create indexes
    console.log('📝 Creating indexes...')
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)`
      console.log('✅ Indexes created\n')
    } catch (error) {
      console.log('⚠️  Indexes might already exist or error:', error.message)
    }

    // Verify tables exist
    console.log('🔍 Verifying tables...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('conversations', 'messages')
      ORDER BY table_name
    `
    
    console.log('✅ Chatbot tables setup complete!')
    console.log('\n📊 Tables found:')
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`)
    })
    
    if (tables.length === 0) {
      console.log('\n⚠️  No chatbot tables found. You may need to run the full init-db script first.')
    } else {
      console.log('\n🎉 Setup complete! You can now use the chatbot functionality.')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error adding chatbot tables:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

addChatbotTables()

