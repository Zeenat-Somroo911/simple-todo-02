'use client'

import { motion } from 'framer-motion'
import { Task } from '@/types/task'
import { CheckCircle2, Circle, AlertCircle, TrendingUp, Target } from 'lucide-react'
import { isPast } from 'date-fns'
import { cn } from '@/lib/cn'

interface TaskStatsProps {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const activeTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Overdue tasks (not completed and past due date)
  const overdueTasks = tasks.filter(t => !t.completed && t.due_date && isPast(new Date(t.due_date))).length

  // Priority breakdown
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length
  const mediumPriority = tasks.filter(t => !t.completed && t.priority === 'medium').length
  const lowPriority = tasks.filter(t => !t.completed && t.priority === 'low').length

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Circle,
      gradient: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      iconBg: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      ringColor: 'ring-indigo-200',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      ringColor: 'ring-emerald-200',
    },
    {
      label: 'Active',
      value: activeTasks,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconBg: 'bg-amber-500',
      textColor: 'text-amber-700',
      ringColor: 'ring-amber-200',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      gradient: 'from-rose-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
      iconBg: 'bg-rose-500',
      textColor: 'text-rose-700',
      ringColor: 'ring-rose-200',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className={cn(
                'relative overflow-hidden rounded-2xl p-5 border-2 border-transparent transition-all',
                stat.bgColor,
                'hover:shadow-xl hover:border-white cursor-pointer'
              )}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-5', stat.gradient)} />
              </div>

              <div className="relative">
                {/* Icon */}
                <div className={cn(
                  'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4',
                  'bg-white shadow-lg',
                  stat.iconBg.replace('bg-', 'shadow-'),
                  'shadow-lg'
                )}>
                  <Icon className={cn('w-6 h-6 text-white', stat.iconBg)} />
                </div>

                {/* Value with count-up effect */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  className={cn('text-4xl font-bold mb-1', stat.textColor)}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <div className="text-sm font-medium text-slate-600">{stat.label}</div>
              </div>

              {/* Decorative corner accent */}
              <div className={cn(
                'absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10',
                stat.iconBg
              )} />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Completion Rate Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Completion Rate</h3>
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            {completionRate}%
          </motion.span>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>

        {/* Milestone markers */}
        <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Priority Breakdown */}
      {activeTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
            Active Tasks by Priority
          </h3>

          <div className="space-y-4">
            {[
              { priority: 'High Priority', count: highPriority, color: 'rose', value: highPriority },
              { priority: 'Medium Priority', count: mediumPriority, color: 'amber', value: mediumPriority },
              { priority: 'Low Priority', count: lowPriority, color: 'indigo', value: lowPriority },
            ].map((item, index) => {
              const percentage = activeTasks > 0 ? (item.count / activeTasks) * 100 : 0
              return (
                <div key={item.priority} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        item.color === 'rose' && 'bg-rose-500',
                        item.color === 'amber' && 'bg-amber-500',
                        item.color === 'indigo' && 'bg-indigo-500'
                      )} />
                      <span className="text-sm font-semibold text-slate-700">{item.priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-bold',
                        item.color === 'rose' && 'text-rose-700',
                        item.color === 'amber' && 'text-amber-700',
                        item.color === 'indigo' && 'text-indigo-700'
                      )}>
                        {item.count}
                      </span>
                      <span className="text-xs text-slate-400">({Math.round(percentage)}%)</span>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        item.color === 'rose' && 'bg-rose-500',
                        item.color === 'amber' && 'bg-amber-500',
                        item.color === 'indigo' && 'bg-indigo-500'
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
