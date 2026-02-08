'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit2, LogOut, User, Bot, Sparkles, ArrowRight } from 'lucide-react'
import { auth } from '@/lib/auth'
import { taskAPI, authAPI } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import type { Task } from '@/types/task'
import type { User as UserType } from '@/types/user'
import { EditTaskModal } from '@/components/EditTaskModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import AddTaskForm from '@/components/AddTaskForm'

export default function DashboardPage() {
  const router = useRouter()
  const toast = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)

  // Modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<{ id: number; title: string } | null>(null)

  // Color rotation for vibrant cards
  const colorRotation = [
    { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
  ]

  useEffect(() => {
    // Verify authentication with server
    const checkAuth = async () => {
      try {
        const authResult = await auth.verifyAuth()
        
        if (!authResult.authenticated || !authResult.user) {
          router.push('/login')
          return
        }
        
        setUser(authResult.user)
        
        // Load tasks
        loadTasks(authResult.user.id)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      }
    }
    
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadTasks = async (userId: string) => {
    try {
      setLoading(true)
      const tasksData = await taskAPI.getTasks(userId)
      setTasks(tasksData)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    dueDate?: string,
    category?: string
  ) => {
    if (!user || !title.trim()) return

    try {
      const createdTask = await taskAPI.createTask(user.id, {
        title: title.trim(),
        description: description || '',
        priority: priority || 'medium',
        due_date: dueDate,
        category: category,
      })
      setTasks([...tasks, createdTask])
      toast.success('Task added!')
    } catch {
      toast.error('Failed to add task')
      throw new Error('Failed to add task')
    }
  }

  const handleEditTask = async (
    taskId: number,
    data: {
      title: string
      description: string
      priority: 'low' | 'medium' | 'high'
      due_date?: string
      category?: string
    }
  ) => {
    if (!user) return

    try {
      const updatedTask = await taskAPI.updateTask(user.id, taskId, data)
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ))
      toast.success('Task updated successfully!')
    } catch (error) {
      toast.error('Failed to update task')
      throw error
    }
  }

  const handleDeleteTask = async () => {
    if (!user || !deletingTask) return

    try {
      await taskAPI.deleteTask(user.id, deletingTask.id)
      setTasks(tasks.filter(task => task.id !== deletingTask.id))
      setDeletingTask(null) // Close modal
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Delete task error:', error)
      toast.error('Failed to delete task')
      // Don't throw error, just show toast
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      auth.logout()
      router.push('/login')
    } catch {
      // Even if logout API fails, clear local data and redirect
      auth.logout()
      router.push('/login')
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-white font-semibold">Loading your tasks...</p>
          <p className="text-gray-400 mt-2">Preparing your workspace</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10">
        {/* Top Bar with User Info */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex justify-end items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm hidden sm:inline font-semibold">Logout</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header with Premium Glow */}
          <div className="text-center mb-8 md:mb-12 mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                What&apos;s the Plan for Today?
              </span>
            </h1>
            <p className="text-gray-300 text-lg">Stay organized, stay productive</p>
          </div>

          {/* Chat with AI Assistant Card */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/chat')}
              className="group w-full relative overflow-hidden"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-6 md:p-8 shadow-2xl transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)]">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  {/* Icon Section */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                        <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                      Chat with AI Assistant
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs md:text-sm font-semibold">
                        <Sparkles className="w-3 h-3" />
                        AI Powered
                      </span>
                    </h2>
                    <p className="text-purple-100 text-sm md:text-base mb-3">
                      Manage your tasks using natural language
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/90 text-sm font-medium">
                      <span>Try it now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 hidden md:block">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Add Task Form Section */}
          <div className="mb-8">
            <AddTaskForm onAdd={handleAddTask} />
          </div>

          {/* Task List with Premium Cards */}
          {loading && tasks.length === 0 ? (
            <div className="text-center text-gray-300 text-lg mt-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center mt-16 space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mb-6">
                <div className="text-5xl">📝</div>
              </div>
              <p className="text-xl font-semibold text-white">No tasks yet.</p>
              <p className="text-gray-400">Add one to get started on your journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reversed order - newest tasks appear at top with highest numbers */}
              {[...tasks].reverse().map((task, index) => {
                const taskNumber = tasks.length - index
                const colorIndex = (tasks.length - 1 - index) % colorRotation.length
                const color = colorRotation[colorIndex]

                return (
                  <div
                    key={task.id}
                    className="group relative"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${color.bg.replace('bg-', 'from-')} ${color.bg.replace('bg-', 'to-')} rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300`}></div>
                    <div className={`relative ${color.bg} rounded-2xl p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all transform group-hover:scale-[1.02] ${color.hover}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg md:text-xl font-semibold flex-1 mr-4 text-white">
                          <span className="font-extrabold text-2xl mr-2">{taskNumber}</span>
                          <span className="opacity-90">{task.title}</span>
                        </span>
                        <div className="flex gap-2 md:gap-3 flex-shrink-0">
                        <button
                          onClick={() => {
                            const taskToDelete = tasks.find(t => t.id === task.id)
                            if (taskToDelete) {
                              setDeletingTask({ id: task.id, title: taskToDelete.title })
                            }
                          }}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                          title="Delete task"
                        >
                          <Trash2 size={18} className="md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                          title="Edit task"
                        >
                          <Edit2 size={18} className="md:w-5 md:h-5" />
                        </button>
                        </div>
                      </div>
                      {/* Priority, Category, Due Date - Concise */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-100' :
                          task.priority === 'medium' ? 'bg-orange-500/20 text-orange-100' :
                          'bg-blue-500/20 text-blue-100'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        {task.category && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white">
                            {task.category}
                          </span>
                        )}
                        {task.due_date && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white">
                            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEditTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title || ''}
      />
    </div>
  )
}
