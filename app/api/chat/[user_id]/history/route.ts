/**
 * Chat History API Route - GET conversation history
 * Proxies to FastAPI backend
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth-utils'

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(
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
    
    // Verify user can only access their own chat history
    if (resolvedParams.user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }
    
    // Get conversation_id from query params if provided
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversation_id')
    
    // Build FastAPI URL
    let url = `${FASTAPI_URL}/api/${resolvedParams.user_id}/chat/history`
    if (conversationId) {
      url += `?conversation_id=${conversationId}`
    }
    
    // Get cookies from the incoming request to forward to FastAPI
    const cookieHeader = request.headers.get('cookie') || ''
    
    // Forward request to FastAPI
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader, // Forward cookies from the request
      },
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(
        error,
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

