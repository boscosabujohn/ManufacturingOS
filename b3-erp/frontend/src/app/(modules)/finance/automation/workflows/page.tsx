'use client'

import { useState } from 'react'
import { Zap, Play, Pause, CheckCircle, Settings, GitBranch, Clock, TrendingUp } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  trigger: string
  triggerType: 'scheduled' | 'event' | 'manual' | 'conditional'
  actions: string[]
  frequency: string
  lastRun: string
  nextRun: string
  executionCount: number
  successRate: number
  status: 'active' | 'paused' | 'draft'
  category: 'accounting' | 'reconciliation' | 'reporting' | 'compliance'
}

export default function AutomatedWorkflowsPage() {
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Monthly Depreciation Calculation',
      description: 'Automatically calculate and post depreciation for all fixed assets',
      trigger: 'Last day of month at 11:00 PM',
      triggerType: 'scheduled',
      actions: ['Calculate depreciation', 'Create journal entries', 'Post to GL', 'Send notification'],
      frequency: 'Monthly',
      lastRun: '2025-09-30 23:00:00',
      nextRun: '2025-10-31 23:00:00',
      executionCount: 24,
      successRate: 100,
      status: 'active',
      category: 'accounting'
    },
    {
      id: '2',
      name: 'Bank Reconciliation Auto-Match',
      description: 'Match bank statement entries with GL transactions automatically',
      trigger: 'Bank statement import',
      triggerType: 'event',
      actions: ['Load bank statement', 'Match transactions', 'Create reconciliation report', 'Flag discrepancies'],
      frequency: 'Daily',
      lastRun: '2025-10-18 08:00:00',
      nextRun: 'On bank statement upload',
      executionCount: 142,
      successRate: 95,
      status: 'active',
      category: 'reconciliation'
    },
    {
      id: '3',
      name: 'Accounts Receivable Aging Report',
      description: 'Generate and email AR aging reports to management',
      trigger: 'Every Monday at 9:00 AM',
      triggerType: 'scheduled',
      actions: ['Calculate aging buckets', 'Generate PDF report', 'Email to stakeholders', 'Update dashboard'],
      frequency: 'Weekly',
      lastRun: '2025-10-14 09:00:00',
      nextRun: '2025-10-21 09:00:00',
      executionCount: 48,
      successRate: 98,
      status: 'active',
      category: 'reporting'
    },
    {
      id: '4',
      name: 'GST Return Auto-Compilation',
      description: 'Compile GST data and prepare draft return for review',
      trigger: '5th day of month at 10:00 AM',
      triggerType: 'scheduled',
      actions: ['Extract GST transactions', 'Reconcile with GSTR-2A', 'Generate GSTR-3B draft', 'Alert tax team'],
      frequency: 'Monthly',
      lastRun: '2025-10-05 10:00:00',
      nextRun: '2025-11-05 10:00:00',
      executionCount: 12,
      successRate: 92,
      status: 'active',
      category: 'compliance'
    },
    {
      id: '5',
      name: 'Invoice Approval Workflow',
      description: 'Route invoices for approval based on amount thresholds',
      trigger: 'Invoice creation',
      triggerType: 'event',
      actions: ['Check approval threshold', 'Route to approver', 'Send notification', 'Track approval status'],
      frequency: 'Real-time',
      lastRun: '2025-10-18 14:30:00',
      nextRun: 'On invoice creation',
      executionCount: 856,
      successRate: 99,
      status: 'active',
      category: 'accounting'
    },
    {
      id: '6',
      name: 'Period-End Accrual Posting',
      description: 'Post standard accrual entries at month-end',
      trigger: 'Last day of month at 6:00 PM',
      triggerType: 'scheduled',
      actions: ['Calculate accruals', 'Create accrual JEs', 'Post to GL', 'Generate reversal entries'],
      frequency: 'Monthly',
      lastRun: '2025-09-30 18:00:00',
      nextRun: '2025-10-31 18:00:00',
      executionCount: 18,
      successRate: 100,
      status: 'paused',
      category: 'accounting'
    }
  ])

  const [stats] = useState({
    totalWorkflows: 24,
    activeWorkflows: 22,
    pausedWorkflows: 2,
    totalExecutions: 3420,
    averageSuccessRate: 97.5
  })

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'event': return <Zap className="h-4 w-4" />
      case 'conditional': return <GitBranch className="h-4 w-4" />
      default: return <Play className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accounting': return 'bg-blue-100 text-blue-700'
      case 'reconciliation': return 'bg-green-100 text-green-700'
      case 'reporting': return 'bg-purple-100 text-purple-700'
      case 'compliance': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automated Workflows</h1>
            <p className="text-gray-600 mt-1">Rule-based automation engine for financial processes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700">
            <Zap className="h-5 w-5" />
            Create Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="h-6 w-6 text-violet-600" />
              <span className="text-sm text-gray-600">Total Workflows</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Play className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeWorkflows}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Pause className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-gray-600">Paused</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pausedWorkflows}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Executions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.totalExecutions.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-600">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.averageSuccessRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(workflow.category)}`}>
                      {workflow.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    workflow.status === 'active' ? 'bg-green-100 text-green-700' :
                    workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {workflow.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  {getTriggerIcon(workflow.triggerType)}
                  <span className="text-gray-600">Trigger:</span>
                  <span className="font-medium text-gray-900">{workflow.trigger}</span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Actions:</span>
                  <ul className="mt-1 space-y-1">
                    {workflow.actions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <span className="text-violet-600">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Last Run</p>
                  <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Next Run</p>
                  <p className="text-sm font-medium text-gray-900">{workflow.nextRun}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Executions</p>
                  <p className="text-sm font-medium text-gray-900">{workflow.executionCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="text-sm font-medium text-green-600">{workflow.successRate}%</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Settings className="h-4 w-4" />
                  Configure
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm">
                  <Play className="h-4 w-4" />
                  Run Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Workflow Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Triggers</h4>
              <ul className="space-y-1 text-sm">
                <li>• Time-based scheduling (cron expressions)</li>
                <li>• Event-based (document creation, status changes)</li>
                <li>• Conditional logic (amount thresholds, approvals)</li>
                <li>• Manual execution on-demand</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Actions</h4>
              <ul className="space-y-1 text-sm">
                <li>• Create journal entries and post to GL</li>
                <li>• Send email/SMS notifications</li>
                <li>• Generate and export reports</li>
                <li>• Update records and trigger approvals</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Monitoring</h4>
              <ul className="space-y-1 text-sm">
                <li>• Execution history and audit logs</li>
                <li>• Success/failure tracking</li>
                <li>• Error notifications and retry logic</li>
                <li>• Performance metrics and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
