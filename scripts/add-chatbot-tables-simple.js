/**
 * Add Chatbot Tables Script (Simple Version - No Foreign Keys)
 * Run this script to add conversations and messages tables
 * 
 * Usage: node scripts/add-chatbot-tables-simple.js
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

async function addChatbotTables() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in .env.local')
    process.exit(1)
  }

  console.log('🔌 Connecting to database...')
  const sql = neon(process.env.DATABASE_URL)

  try {
    await sql`SELECT 1`
    console.log('✅ Database connection successful\n')

    // Create conversations table (without foreign key for Neon compatibility)
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

    // Create indexes
    console.log('📝 Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)`
    console.log('✅ Indexes created\n')

    // Verify tables
    console.log('🔍 Verifying tables...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('conversations', 'messages')
      ORDER BY table_name
    `
    
    console.log('✅ Chatbot tables setup complete!')
    console.log('\n📊 Tables created:')
    tables.forEach((table) => {
      console.log(`   ✅ ${table.table_name}`)
    })
    
    console.log('\n🎉 Setup complete! Chatbot tables are ready to use.')
    console.log('⚠️  Note: Foreign keys are not enforced at database level for Neon compatibility.')
    console.log('   Application logic should handle referential integrity.')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

addChatbotTables()

