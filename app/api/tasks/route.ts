/**
 * Tasks API Route - GET (all tasks) and POST (create task)
 */
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth-utils'
import { z } from 'zod'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  due_date: z.string().optional(),
  category: z.string().optional()
})

// GET - Get all tasks for user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get user_id from query params (for compatibility with existing frontend)
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('user_id') || userId
    
    // Verify user can only access their own tasks
    if (requestedUserId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }
    
    const tasks = await sql`
      SELECT 
        id, user_id, title, description, completed, priority,
        due_date, category, created_at, updated_at
      FROM tasks
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Get user_id from body (for compatibility)
    const requestedUserId = body.user_id || userId
    
    // Verify user can only create tasks for themselves
    if (requestedUserId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }
    
    // Validate input
    const validatedData = createTaskSchema.parse(body)
    
    // Create task
    const [task] = await sql`
      INSERT INTO tasks (user_id, title, description, priority, due_date, category)
      VALUES (
        ${userId},
        ${validatedData.title},
        ${validatedData.description || ''},
        ${validatedData.priority || 'medium'},
        ${validatedData.due_date ? new Date(validatedData.due_date) : null},
        ${validatedData.category || null}
      )
      RETURNING 
        id, user_id, title, description, completed, priority,
        due_date, category, created_at, updated_at
    `
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

