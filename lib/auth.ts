/**
 * Authentication utilities for client-side auth management
 * Note: Token is now stored in HTTP-only cookie (set by backend)
 * We only store user data in localStorage
 */

import type { User } from '@/types/user'

const USER_KEY = 'auth_user'

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const auth = {
  /**
   * Get the authentication token from cookie
   * Note: Token is in HTTP-only cookie, but we can check if it exists
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    // Token is in HTTP-only cookie, so we can't read it directly
    // But we can check if cookie exists
    return getCookie('token')
  },

  /**
   * Store the authentication token
   * Note: Token is now set by backend in HTTP-only cookie
   * This function is kept for compatibility but doesn't do anything
   */
  setToken(token: string): void {
    // Token is automatically set in cookie by backend
    // No need to store in localStorage
  },

  /**
   * Remove the authentication token
   * Note: Call logout API endpoint to clear cookie
   */
  removeToken(): void {
    // Cookie will be cleared by backend logout endpoint
    // No localStorage to clear
  },

  /**
   * Get the stored user data
   */
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem(USER_KEY)
    if (!userData) return null
    try {
      return JSON.parse(userData) as User
    } catch {
      return null
    }
  },

  /**
   * Store user data
   */
  setUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  /**
   * Remove user data
   */
  removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER_KEY)
  },

  /**
   * Check if user is authenticated
   * Note: HTTP-only cookies can't be read by JavaScript
   * So we check if user data exists in localStorage
   */
  isAuthenticated(): boolean {
    // Check if user data exists (token is in HTTP-only cookie)
    return !!this.getUser()
  },
  
  /**
   * Verify authentication with server
   */
  async verifyAuth(): Promise<{ authenticated: boolean; user?: User }> {
    try {
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated && data.user) {
          // Update user data in localStorage
          this.setUser(data.user)
          return { authenticated: true, user: data.user }
        }
      }
      
      // If not authenticated, clear local data
      this.logout()
      return { authenticated: false }
    } catch (error) {
      console.error('Auth verification error:', error)
      return { authenticated: false }
    }
  },

  /**
   * Clear all authentication data (logout)
   */
  logout(): void {
    this.removeToken()
    this.removeUser()
  }
}
