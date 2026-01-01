/**
 * Authentication utilities - JWT and password hashing
 */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// JWT Secret - must be set in production
const JWT_SECRET = process.env.JWT_SECRET_KEY
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET_KEY environment variable is required in production')
}
// Fallback only for development
const JWT_SECRET_FINAL = JWT_SECRET || 'dev-secret-key-change-in-production'

const JWT_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES || '1440' // 24 hours

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Verify a password
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Create JWT token
 */
export function createToken(userId: string): string {
  const expiresInMinutes = parseInt(JWT_EXPIRES_IN, 10) || 1440
  return jwt.sign({ sub: userId }, JWT_SECRET_FINAL, {
    expiresIn: `${expiresInMinutes}m`
  })
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): { sub: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_FINAL) as { sub: string }
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Get user ID from request (from cookie or header)
 */
export function getUserIdFromRequest(request: Request): string | null {
  // Try to get token from cookie
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const token = cookies['token']
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        return decoded.sub
      }
    }
  }

  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (decoded) {
      return decoded.sub
    }
  }

  return null
}

