'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, CheckSquare } from 'lucide-react'
import { authAPI } from '@/lib/api'
import { auth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await auth.verifyAuth()
      if (authResult.authenticated) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })

      // Validate response
      if (!response || !response.user) {
        throw new Error('Invalid response from server')
      }

      // Token is automatically stored in HTTP-only cookie by backend
      // Only store user data in localStorage
      auth.setUser(response.user)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Login error:', error)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (error && typeof error === 'object') {
        // Axios error structure
        if ('response' in error) {
          const axiosError = error as { response?: { data?: { detail?: { error?: { message?: string }; message?: string }; message?: string; error?: string }; status?: number } }
          
          if (axiosError.response?.status === 401) {
            errorMessage = 'Invalid email or password. Please check your credentials.'
          } else if (axiosError.response?.status === 404) {
            errorMessage = 'Server endpoint not found. Please check if backend is running.'
          } else if (axiosError.response?.status === 500) {
            errorMessage = 'Server error. Please try again later.'
          } else if (axiosError.response?.data) {
            // Try different error message formats
            const data = axiosError.response.data
            errorMessage = 
              data.detail?.error?.message ||
              data.detail?.message ||
              data.message ||
              data.error ||
              (typeof data.detail === 'string' ? data.detail : errorMessage)
          }
        } 
        // Network error (CORS, connection refused, etc.)
        else if ('request' in error) {
          errorMessage = 'Cannot connect to server. Please check if backend is running on http://localhost:8000'
        }
        // Standard Error object
        else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 w-full">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-75"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-2xl shadow-2xl">
                <CheckSquare className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 whitespace-nowrap">
            Welcome Back
          </h2>
          <p className="text-lg md:text-xl text-gray-300 whitespace-nowrap">
            Sign in to continue your journey
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl w-full">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Signing in...' : 'Sign in'}
              </div>
            </button>

            <div className="text-sm text-center">
              <span className="text-gray-400">Don&apos;t have an account? </span>
              <Link href="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
