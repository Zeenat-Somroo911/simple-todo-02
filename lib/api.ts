/**
 * API client for communicating with the backend
 */

import axios from 'axios'
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'
import type { RegisterRequest, LoginRequest, AuthResponse } from '@/types/user'

// Create axios instance with base configuration
// Using Next.js API routes (same origin, no CORS needed)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Enable cookies
  validateStatus: (status) => {
    // Accept all 2xx status codes (including 204) as success
    return status >= 200 && status < 300
  }
})

// Note: Token is now stored in HTTP-only cookie, so we don't need to add it to headers
// Backend will automatically read token from cookie

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // All successful responses (including 204) are returned as-is
    return response
  },
  (error) => {
    // Log error for debugging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      })
    } else if (error.request) {
      console.error('API Network Error:', {
        message: 'No response received from server',
        url: error.config?.url
      })
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  /**
   * Logout - clear authentication cookie
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  }
}

// Task API
export const taskAPI = {
  /**
   * Get all tasks for a user
   */
  getTasks: async (userId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks?user_id=${userId}`)
    return response.data
  },

  /**
   * Create a new task
   */
  createTask: async (userId: string, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', { ...data, user_id: userId })
    return response.data
  },

  /**
   * Get a single task by ID
   */
  getTask: async (userId: string, taskId: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${taskId}`)
    return response.data
  },

  /**
   * Update a task
   */
  updateTask: async (userId: string, taskId: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, data)
    return response.data
  },

  /**
   * Delete a task
   */
  deleteTask: async (userId: string, taskId: number): Promise<void> => {
    // Axios instance already configured to accept 204 as success via validateStatus
    await api.delete(`/tasks/${taskId}`)
    // 204 No Content response is expected for successful delete
    return
  },

  /**
   * Toggle task completion status
   */
  toggleComplete: async (userId: string, taskId: number): Promise<Task> => {
    // Get current task to toggle
    const currentTask = await taskAPI.getTask(userId, taskId)
    const response = await api.put<Task>(`/tasks/${taskId}`, {
      completed: !currentTask.completed
    })
    return response.data
  }
}

export default api
