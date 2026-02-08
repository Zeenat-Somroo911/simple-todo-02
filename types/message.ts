/**
 * Message type definitions
 */

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: number
  conversation_id: number
  user_id: string
  role: MessageRole
  content: string
  created_at: string // ISO 8601 date string
}

export interface CreateMessageRequest {
  conversation_id: number
  user_id: string
  role: MessageRole
  content: string
}

