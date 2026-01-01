/**
 * Health Check API Route
 */
import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not set',
        database: 'not_configured'
      }, { status: 500 })
    }

    // Try to connect to database
    try {
      await sql`SELECT 1`
      return NextResponse.json({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      })
    } catch (dbError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        database: 'disconnected',
        error: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

