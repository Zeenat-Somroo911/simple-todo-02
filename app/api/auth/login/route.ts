/**
 * Login API Route
 */
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth-utils'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user
    const [user] = await sql`
      SELECT id, email, name, hashed_password, created_at
      FROM users
      WHERE email = ${validatedData.email}
    `
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.hashed_password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create JWT token
    const token = createToken(user.id)
    
    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token
    })
    
    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    // Check for database connection errors
    if (
      (error && typeof error === 'object' && 'code' in error && error.code === 'ENOTFOUND') ||
      (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && (error.message.includes('dummy') || error.message.includes('fetch failed')))
    ) {
      const errorMessage = error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' ? error.message : 'Unknown error'
      console.error('❌ Database connection error:', errorMessage)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: 'DATABASE_URL is not configured. Please create a .env.local file with your database connection string.',
          hint: 'See .env.example for format'
        },
        { status: 500 }
      )
    }
    
    console.error('Login error:', error)
    const errorMessage = error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { error: 'Login failed', message: errorMessage },
      { status: 500 }
    )
  }
}

