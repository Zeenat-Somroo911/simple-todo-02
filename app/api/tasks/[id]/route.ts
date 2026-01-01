/**
 * Task API Route - GET, PUT, DELETE for single task
 */
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth-utils'
import { z } from 'zod'

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z.string().optional(),
  category: z.string().optional()
})

// GET - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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
    const taskId = parseInt(resolvedParams.id)
    
    const [task] = await sql`
      SELECT 
        id, user_id, title, description, completed, priority,
        due_date, category, created_at, updated_at
      FROM tasks
      WHERE id = ${taskId} AND user_id = ${userId}
    `
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(task)
  } catch (error) {
    console.error('Get task error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PUT - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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
    const taskId = parseInt(resolvedParams.id)
    const body = await request.json()
    
    // Validate input
    const validatedData = updateTaskSchema.parse(body)
    
    // Check if task exists and belongs to user
    const [existingTask] = await sql`
      SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${userId}
    `
    
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // If no updates, return existing task
    if (Object.keys(validatedData).length === 0) {
      const [task] = await sql`
        SELECT 
          id, user_id, title, description, completed, priority,
          due_date, category, created_at, updated_at
        FROM tasks
        WHERE id = ${taskId} AND user_id = ${userId}
      `
      return NextResponse.json(task)
    }
    
    // Get current task to preserve unchanged fields
    const [currentTask] = await sql`
      SELECT title, description, completed, priority, due_date, category
      FROM tasks
      WHERE id = ${taskId} AND user_id = ${userId}
    `
    
    // Update task with new values or keep existing
    const [task] = await sql`
      UPDATE tasks
      SET 
        title = ${validatedData.title ?? currentTask.title},
        description = ${validatedData.description ?? currentTask.description},
        completed = ${validatedData.completed ?? currentTask.completed},
        priority = ${validatedData.priority ?? currentTask.priority},
        due_date = ${validatedData.due_date ? new Date(validatedData.due_date) : currentTask.due_date},
        category = ${validatedData.category ?? currentTask.category},
        updated_at = NOW()
      WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING 
        id, user_id, title, description, completed, priority,
        due_date, category, created_at, updated_at
    `
    
    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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
    const taskId = parseInt(resolvedParams.id)
    
    // Check if task exists and belongs to user
    const [task] = await sql`
      SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${userId}
    `
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // Delete task
    await sql`
      DELETE FROM tasks WHERE id = ${taskId} AND user_id = ${userId}
    `
    
    console.log(`Task ${taskId} deleted successfully for user ${userId}`)
    
    // Return success response with 204 No Content
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete task error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete task'
    return NextResponse.json(
      { 
        error: 'Failed to delete task',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

