/**
 * Initialize Database - Run this once to create tables
 */
import { NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'DATABASE_URL not set',
          message: 'Please set DATABASE_URL in .env.local file',
          instruction: 'Create .env.local file in project root with: DATABASE_URL=your_neon_db_connection_string'
        },
        { status: 500 }
      )
    }
    
    const result = await initDatabase()
    
    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully',
      tables: result.tables || ['users', 'tasks'],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Database initialization failed'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Database initialization failed',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          error: String(error),
          stack: errorStack
        } : undefined,
        troubleshooting: [
          'Check if DATABASE_URL is correct in .env.local',
          'Verify Neon DB connection string format',
          'Ensure database credentials are correct'
        ]
      },
      { status: 500 }
    )
  }
}

