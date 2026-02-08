/**
 * Chat API Route - POST message to chat
 * Proxies to FastAPI backend
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth-utils'

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> | { user_id: string } }
) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Handle both sync and async params (Next.js 13+ compatibility)
    const resolvedParams = await Promise.resolve(params)
    
    // Verify user can only send messages as themselves
    if (resolvedParams.user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Get cookies from the incoming request to forward to FastAPI
    const cookieHeader = request.headers.get('cookie') || ''
    
    // Forward request to FastAPI
    let response: Response
    try {
      response = await fetch(`${FASTAPI_URL}/api/${resolvedParams.user_id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader, // Forward cookies from the request
        },
        body: JSON.stringify(body),
      })
    } catch (fetchError) {
      // Handle network errors (FastAPI not reachable)
      console.error('Failed to reach FastAPI backend:', fetchError)
      return NextResponse.json(
        { 
          error: 'Cannot connect to backend server',
          detail: 'The FastAPI backend is not reachable. Please ensure it is running on ' + FASTAPI_URL
        },
        { status: 503 }
      )
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Unknown error',
        detail: `HTTP ${response.status}: ${response.statusText}`
      }))
      // Preserve FastAPI error format (detail field) while also supporting error field
      return NextResponse.json(
        error,
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { 
        error: 'Internal server error',
        detail: errorMessage
      },
      { status: 500 }
    )
  }
}

