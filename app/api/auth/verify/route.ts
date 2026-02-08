/**
 * Verify Authentication - Check if user is authenticated
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth-utils'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      // Return 200 with authenticated: false instead of 401 to avoid noisy console errors
      // 401 status causes browser to log "Failed to load resource" which is expected for unauthenticated users
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      )
    }
    
    // Get user data
    const [user] = await sql`
      SELECT id, email, name, created_at
      FROM users
      WHERE id = ${userId}
    `
    
    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      )
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('Verify auth error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    )
  }
}

