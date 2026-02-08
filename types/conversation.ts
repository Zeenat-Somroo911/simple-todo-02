/**
 * Conversation type definitions
 */

export interface Conversation {
  id: number
  user_id: string
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
}

export interface CreateConversationRequest {
  user_id: string
}

