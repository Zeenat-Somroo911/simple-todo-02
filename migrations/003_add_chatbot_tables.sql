-- Migration: Add chatbot tables (conversations and messages)
-- Phase III: Chatbot functionality
-- Date: 2025-01-03
-- 
-- This migration adds two new tables for chatbot functionality:
-- 1. conversations - stores user conversation sessions
-- 2. messages - stores individual messages within conversations
--
-- Usage:
--   Run this file against your Neon PostgreSQL database
--   You can use psql, pgAdmin, or any PostgreSQL client
--   Or use: psql $DATABASE_URL -f migrations/003_add_chatbot_tables.sql

-- Create conversations table
-- Note: Foreign keys removed for Neon serverless compatibility
-- Application logic should handle referential integrity
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('conversations', 'messages')
ORDER BY table_name;

