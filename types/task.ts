/**
 * Task type definitions
 */

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  user_id: string
  title: string
  description: string
  completed: boolean
  priority: TaskPriority
  due_date?: string // ISO 8601 date string
  category?: string
  created_at: string // ISO 8601 with Z suffix
  updated_at: string // ISO 8601 with Z suffix
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: TaskPriority
  due_date?: string
  category?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
  priority?: TaskPriority
  due_date?: string
  category?: string
}
