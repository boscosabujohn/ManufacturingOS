'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, Clock, AlertTriangle, Play, Lock } from 'lucide-react'

interface CloseTask {
  id: string
  task: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  assignedTo: string
  dueDate: string
}

export default function PeriodClosePage() {
  const [tasks] = useState<CloseTask[]>([
    { id: '1', task: 'Reconcile bank accounts', status: 'completed', assignedTo: 'Finance Team', dueDate: '2025-10-20' },
    { id: '2', task: 'Post all transactions', status: 'completed', assignedTo: 'Accounting Team', dueDate: '2025-10-21' },
    { id: '3', task: 'Review accounts receivable', status: 'in_progress', assignedTo: 'AR Team', dueDate: '2025-10-22' },
    { id: '4', task: 'Review accounts payable', status: 'in_progress', assignedTo: 'AP Team', dueDate: '2025-10-22' },
    { id: '5', task: 'Depreciation calculation', status: 'pending', assignedTo: 'Fixed Assets Team', dueDate: '2025-10-23' },
    { id: '6', task: 'Inventory valuation', status: 'pending', assignedTo: 'Inventory Team', dueDate: '2025-10-23' },
    { id: '7', task: 'Accrue expenses', status: 'pending', assignedTo: 'Finance Team', dueDate: '2025-10-24' },
    { id: '8', task: 'Review trial balance', status: 'pending', assignedTo: 'Controller', dueDate: '2025-10-25' },
    { id: '9', task: 'Generate financial statements', status: 'pending', assignedTo: 'Finance Team', dueDate: '2025-10-26' },
    { id: '10', task: 'Close period', status: 'pending', assignedTo: 'CFO', dueDate: '2025-10-27' }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-600" />
      case 'blocked': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const progress = (completedTasks / tasks.length) * 100

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Period-End Closing</h1>
          <p className="text-gray-600 mt-1">Month-end close checklist and procedures</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">October 2025 Close Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`p-4 rounded-lg border-2 ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                task.status === 'blocked' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="font-semibold text-gray-900">{task.task}</p>
                      <p className="text-sm text-gray-600">{task.assignedTo} • Due: {new Date(task.dueDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 font-semibold">
            <Lock className="h-5 w-5" />
            Close Period
          </button>
        </div>
      </div>
    </div>
  )
}
