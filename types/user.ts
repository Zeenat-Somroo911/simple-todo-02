/**
 * User type definitions
 */

export interface User {
  id: string // Better Auth format: usr_xxxxx
  email: string
  name: string
  created_at: string // ISO 8601 with Z suffix
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
