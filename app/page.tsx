'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { CheckSquare, Shield, Lock, ArrowRight, Sparkles, Zap, Infinity, Star } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (auth.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full mx-auto">
          <div className="text-center space-y-12">
            {/* Hero Section */}
            <div className="space-y-8 animate-fade-in">
              {/* Logo with Glow Effect */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <CheckSquare className="w-14 h-14 text-white" />
                  </div>
                </div>
              </div>

              {/* Main Heading with Gradient */}
              <div className="space-y-4 text-center">
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
                    Evolution of Todo
                  </span>
                </h1>
                <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-purple-300 font-semibold">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span>AI-Native Task Management System</span>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed text-center px-4">
                  Professional enterprise task management with secure authentication.
                  <br />
                  <span className="text-purple-300 font-medium">Experience the future of productivity.</span>
                </p>
              </div>

              {/* CTA Buttons with Premium Style */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/register" className="group">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <button className="relative flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform group-hover:scale-105 shadow-2xl">
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Link>
                <Link href="/login" className="group">
                  <button className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform group-hover:scale-105 shadow-xl">
                    <span>Sign In</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Premium Features Section */}
            <div className="pt-16 mt-16 border-t border-white/10">
              <div className="space-y-12">
                <div className="space-y-2 text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    Enterprise <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Features</span>
                  </h2>
                  <p className="text-gray-400 text-lg">Everything you need for professional task management</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature Card 1 */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform group-hover:scale-105">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 shadow-lg">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-white mb-3">
                        Secure Authentication
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        JWT-based authentication with Better Auth framework for enterprise-grade security
                      </p>
                    </div>
                  </div>

                  {/* Feature Card 2 */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform group-hover:scale-105">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 shadow-lg">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-white mb-3">
                        Smart Management
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Create, update, search, and filter tasks with priority levels, categories, and due dates
                      </p>
                    </div>
                  </div>

                  {/* Feature Card 3 */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform group-hover:scale-105">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-4 shadow-lg">
                        <Lock className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-white mb-3">
                        Complete Privacy
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Complete data isolation ensures your tasks remain private and secure
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Premium Badges */}
                <div className="flex flex-wrap justify-center gap-4 pt-8">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300 font-medium">Premium UI/UX</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2">
                    <Infinity className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300 font-medium">Unlimited Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300 font-medium">Lightning Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
