/**
 * Register API Route
 */
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth-utils'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${validatedData.email}
    `
    
    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Create user ID
    const uuid = uuidv4()
    const userId = `usr_${uuid.replace(/-/g, '').substring(0, 12)}`
    
    // Insert user
    await sql`
      INSERT INTO users (id, email, name, hashed_password)
      VALUES (${userId}, ${validatedData.email}, ${validatedData.name}, ${hashedPassword})
    `
    
    // Get created user
    const users = await sql`
      SELECT id, email, name, created_at
      FROM users
      WHERE id = ${userId}
    `
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
    
    const user = users[0]
    
    // Create JWT token
    const token = createToken(userId)
    
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Register error:', error)
    
    // More detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

