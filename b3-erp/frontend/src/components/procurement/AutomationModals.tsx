'use client'

import React, { useState } from 'react'
import {
  X,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Brain,
  Zap,
  Workflow,
  GitBranch,
  Clock,
  Calendar,
  Target,
  Filter,
  Download,
  FileText,
  Code,
  Activity,
  TrendingUp,
  Eye,
  BarChart3,
  RefreshCw,
  Bell,
  User,
  Mail,
  Sparkles,
  Shield,
  Database,
  ArrowRight,
  Info,
  Plus,
  Trash2,
  Copy,
  Save,
  FileSearch,
  Timer,
  Gauge,
  ChevronRight,
  CheckSquare,
  Layers
} from 'lucide-react'

// ========================
// Type Definitions
// ========================

export interface AutomationData {
  id: string
  name: string
  type: 'workflow' | 'approval' | 'matching' | 'prediction' | 'optimization'
  status: 'active' | 'paused' | 'testing' | 'disabled'
  triggersPerDay: number
  successRate: number
  timeSaved: number
  lastRun: string
  nextRun?: string
  aiEnabled: boolean
  description?: string
  priority?: 'high' | 'medium' | 'low'
  owner?: string
  createdDate?: string
}

export interface AutomationLog {
  id: string
  timestamp: string
  ruleName: string
  ruleId: string
  action: string
  status: 'success' | 'failed' | 'warning'
  duration: number
  details: string
  affectedRecords?: number
  error?: string
}

// ========================
// 1. Configure Rules Modal
// ========================

interface ConfigureRulesModalProps {
  isOpen: boolean
  onClose: () => void
  automation?: AutomationData
  onSubmit: (data: any) => void
  isNew?: boolean
}

export function ConfigureRulesModal({ isOpen, onClose, automation, onSubmit, isNew = false }: ConfigureRulesModalProps) {
  const [ruleName, setRuleName] = useState(automation?.name || '')
  const [ruleType, setRuleType] = useState<AutomationData['type']>(automation?.type || 'workflow')
  const [description, setDescription] = useState(automation?.description || '')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(automation?.priority || 'medium')
  const [aiEnabled, setAiEnabled] = useState(automation?.aiEnabled || false)
  const [selectedTrigger, setSelectedTrigger] = useState('event')
  const [selectedSchedule, setSelectedSchedule] = useState('continuous')
  const [conditions, setConditions] = useState([{ field: '', operator: '', value: '' }])
  const [actions, setActions] = useState([{ type: '', value: '' }])
  const [notifications, setNotifications] = useState({ email: true, inApp: true, slack: false })

  if (!isOpen) return null

  const handleAddCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }])
  }

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleAddAction = () => {
    setActions([...actions, { type: '', value: '' }])
  }

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: ruleName,
      type: ruleType,
      description,
      priority,
      aiEnabled,
      trigger: selectedTrigger,
      schedule: selectedSchedule,
      conditions,
      actions,
      notifications
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">
                  {isNew ? 'Create New Automation Rule' : 'Configure Automation Rule'}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Set up intelligent automation for procurement processes
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Information */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rule Name *
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Auto-approve Low Value POs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Type *
                </label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as AutomationData['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="workflow">Workflow Automation</option>
                  <option value="approval">Approval Process</option>
                  <option value="matching">Document Matching</option>
                  <option value="prediction">AI Prediction</option>
                  <option value="optimization">Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe what this automation rule does..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aiEnabled"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="aiEnabled" className="text-sm text-gray-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Enable AI-powered optimization
              </label>
            </div>
          </div>

          {/* Trigger Configuration */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Trigger Configuration
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When should this rule run?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTrigger('event')}
                  className={`p-3 rounded-lg border-2 transition ${
                    selectedTrigger === 'event'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <Activity className="w-5 h-5 mb-1 text-blue-600" />
                  <div className="text-sm font-medium">On Event</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTrigger('schedule')}
                  className={`p-3 rounded-lg border-2 transition ${
                    selectedTrigger === 'schedule'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <Calendar className="w-5 h-5 mb-1 text-green-600" />
                  <div className="text-sm font-medium">Scheduled</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTrigger('manual')}
                  className={`p-3 rounded-lg border-2 transition ${
                    selectedTrigger === 'manual'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <User className="w-5 h-5 mb-1 text-purple-600" />
                  <div className="text-sm font-medium">Manual</div>
                </button>
              </div>
            </div>

            {selectedTrigger === 'schedule' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Frequency
                </label>
                <select
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="continuous">Continuous (Real-time)</option>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Conditions (When to apply this rule)
              </h3>
              <button
                type="button"
                onClick={handleAddCondition}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Condition
              </button>
            </div>

            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={condition.field}
                  onChange={(e) => {
                    const newConditions = [...conditions]
                    newConditions[index].field = e.target.value
                    setConditions(newConditions)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select field...</option>
                  <option value="amount">Order Amount</option>
                  <option value="supplier">Supplier</option>
                  <option value="category">Category</option>
                  <option value="department">Department</option>
                  <option value="priority">Priority</option>
                </select>
                <select
                  value={condition.operator}
                  onChange={(e) => {
                    const newConditions = [...conditions]
                    newConditions[index].operator = e.target.value
                    setConditions(newConditions)
                  }}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Operator</option>
                  <option value="equals">Equals</option>
                  <option value="greater">Greater than</option>
                  <option value="less">Less than</option>
                  <option value="contains">Contains</option>
                </select>
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) => {
                    const newConditions = [...conditions]
                    newConditions[index].value = e.target.value
                    setConditions(newConditions)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Value"
                />
                {conditions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-green-600" />
                Actions (What to do when conditions are met)
              </h3>
              <button
                type="button"
                onClick={handleAddAction}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Action
              </button>
            </div>

            {actions.map((action, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={action.type}
                  onChange={(e) => {
                    const newActions = [...actions]
                    newActions[index].type = e.target.value
                    setActions(newActions)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select action...</option>
                  <option value="approve">Auto-approve</option>
                  <option value="reject">Auto-reject</option>
                  <option value="notify">Send notification</option>
                  <option value="assign">Assign to user</option>
                  <option value="update">Update field</option>
                  <option value="create">Create record</option>
                </select>
                <input
                  type="text"
                  value={action.value}
                  onChange={(e) => {
                    const newActions = [...actions]
                    newActions[index].value = e.target.value
                    setActions(newActions)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Action details"
                />
                {actions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAction(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              Notification Settings
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications.inApp}
                  onChange={(e) => setNotifications({ ...notifications, inApp: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">In-app notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications.slack}
                  onChange={(e) => setNotifications({ ...notifications, slack: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Slack notifications</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {!isNew && (
                <button
                  type="button"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Rule
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isNew ? 'Create Rule' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 2. Test Automation Modal
// ========================

interface TestAutomationModalProps {
  isOpen: boolean
  onClose: () => void
  automation?: AutomationData
  onSubmit: (data: any) => void
}

export function TestAutomationModal({ isOpen, onClose, automation, onSubmit }: TestAutomationModalProps) {
  const [testScenario, setTestScenario] = useState('standard')
  const [testData, setTestData] = useState('')
  const [runMode, setRunMode] = useState('simulation')
  const [testResults, setTestResults] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  if (!isOpen) return null

  const handleRunTest = () => {
    setIsRunning(true)
    // Simulate test execution
    setTimeout(() => {
      setTestResults({
        status: 'success',
        duration: 1.23,
        recordsProcessed: 45,
        passed: 43,
        failed: 2,
        warnings: 3,
        details: [
          { check: 'Condition validation', status: 'passed', time: 0.12 },
          { check: 'Data integrity', status: 'passed', time: 0.34 },
          { check: 'Action execution', status: 'warning', time: 0.45, message: 'Rate limit approaching' },
          { check: 'Notification delivery', status: 'passed', time: 0.23 },
          { check: 'Error handling', status: 'failed', time: 0.09, message: 'Timeout on edge case' }
        ]
      })
      setIsRunning(false)
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      automationId: automation?.id,
      scenario: testScenario,
      runMode,
      testData,
      results: testResults
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Test Automation Rule</h2>
                <p className="text-green-100 text-sm mt-1">
                  {automation?.name || 'Validate automation before deployment'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Automation Summary */}
          {automation && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Type</div>
                  <div className="font-semibold text-gray-900 capitalize">{automation.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Status</div>
                  <div className={`font-semibold capitalize ${
                    automation.status === 'active' ? 'text-green-600' :
                    automation.status === 'testing' ? 'text-blue-600' :
                    automation.status === 'paused' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {automation.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Success Rate</div>
                  <div className="font-semibold text-green-600">{automation.successRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">AI Enabled</div>
                  <div className="font-semibold">
                    {automation.aiEnabled ? (
                      <span className="text-purple-600 flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-600">No</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Configuration */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Test Configuration
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Scenario
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTestScenario('standard')}
                  className={`p-3 rounded-lg border-2 transition ${
                    testScenario === 'standard'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 mb-1 text-green-600" />
                  <div className="text-sm font-medium">Standard</div>
                  <div className="text-xs text-gray-500">Normal cases</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTestScenario('edge')}
                  className={`p-3 rounded-lg border-2 transition ${
                    testScenario === 'edge'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 mb-1 text-amber-600" />
                  <div className="text-sm font-medium">Edge Cases</div>
                  <div className="text-xs text-gray-500">Unusual scenarios</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTestScenario('stress')}
                  className={`p-3 rounded-lg border-2 transition ${
                    testScenario === 'stress'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <Activity className="w-5 h-5 mb-1 text-red-600" />
                  <div className="text-sm font-medium">Stress Test</div>
                  <div className="text-xs text-gray-500">High volume</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Run Mode
              </label>
              <select
                value={runMode}
                onChange={(e) => setRunMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="simulation">Simulation (No changes)</option>
                <option value="sandbox">Sandbox (Test environment)</option>
                <option value="dry-run">Dry Run (Production data, no execution)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Data (Optional JSON)
              </label>
              <textarea
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                rows={4}
                placeholder='{"orderId": "PO-12345", "amount": 5000, "supplier": "ABC Corp"}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use sample data from the system
              </p>
            </div>
          </div>

          {/* Run Test Button */}
          {!testResults && (
            <div className="text-center py-2">
              <button
                type="button"
                onClick={handleRunTest}
                disabled={isRunning}
                className={`px-8 py-3 rounded-lg text-white font-medium transition flex items-center gap-3 ${
                  isRunning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Test
                  </>
                )}
              </button>
            </div>
          )}

          {/* Test Results */}
          {testResults && (
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Test Results
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setTestResults(null)
                    setIsRunning(false)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Run Again
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-xs text-gray-600 mb-1">Duration</div>
                  <div className="text-lg font-bold text-gray-900">{testResults.duration}s</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-xs text-gray-600 mb-1">Processed</div>
                  <div className="text-lg font-bold text-blue-600">{testResults.recordsProcessed}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-200 text-center">
                  <div className="text-xs text-gray-600 mb-1">Passed</div>
                  <div className="text-lg font-bold text-green-600">{testResults.passed}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200 text-center">
                  <div className="text-xs text-gray-600 mb-1">Warnings</div>
                  <div className="text-lg font-bold text-amber-600">{testResults.warnings}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200 text-center">
                  <div className="text-xs text-gray-600 mb-1">Failed</div>
                  <div className="text-lg font-bold text-red-600">{testResults.failed}</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Detailed Checks</h4>
                {testResults.details.map((detail: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {detail.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {detail.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {detail.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                      <div>
                        <div className="font-medium text-gray-900">{detail.check}</div>
                        {detail.message && (
                          <div className="text-xs text-gray-500">{detail.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{detail.time}s</div>
                  </div>
                ))}
              </div>

              {/* Overall Status */}
              <div className={`p-4 rounded-lg border-2 ${
                testResults.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {testResults.status === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">
                        All critical tests passed! Ready for deployment.
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-900">
                        Some tests failed. Please review before deployment.
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Close
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Results
              </button>
              {testResults && (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Test Report
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 3. View Logs Modal
// ========================

interface ViewLogsModalProps {
  isOpen: boolean
  onClose: () => void
  automation?: AutomationData
  onExport: (data: any) => void
}

export function ViewLogsModal({ isOpen, onClose, automation, onExport }: ViewLogsModalProps) {
  const [timeRange, setTimeRange] = useState('24h')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLog, setSelectedLog] = useState<AutomationLog | null>(null)

  if (!isOpen) return null

  // Mock log data
  const logs: AutomationLog[] = [
    {
      id: 'LOG001',
      timestamp: '2025-11-01 14:32:15',
      ruleName: automation?.name || 'Auto-approve Low Value POs',
      ruleId: automation?.id || 'AUTO001',
      action: 'Auto-approval executed',
      status: 'success',
      duration: 0.45,
      details: 'Successfully processed PO-12345 for $2,500',
      affectedRecords: 1
    },
    {
      id: 'LOG002',
      timestamp: '2025-11-01 14:28:03',
      ruleName: automation?.name || 'Auto-approve Low Value POs',
      ruleId: automation?.id || 'AUTO001',
      action: 'Condition check',
      status: 'warning',
      duration: 0.78,
      details: 'Amount near threshold for PO-12344',
      affectedRecords: 1
    },
    {
      id: 'LOG003',
      timestamp: '2025-11-01 14:15:42',
      ruleName: automation?.name || 'Auto-approve Low Value POs',
      ruleId: automation?.id || 'AUTO001',
      action: 'Auto-approval attempted',
      status: 'failed',
      duration: 1.23,
      details: 'Failed to connect to approval service',
      error: 'TimeoutError: Service timeout after 30 seconds',
      affectedRecords: 0
    },
    {
      id: 'LOG004',
      timestamp: '2025-11-01 13:45:11',
      ruleName: automation?.name || 'Auto-approve Low Value POs',
      ruleId: automation?.id || 'AUTO001',
      action: 'Bulk processing',
      status: 'success',
      duration: 3.56,
      details: 'Processed batch of 12 purchase orders',
      affectedRecords: 12
    },
    {
      id: 'LOG005',
      timestamp: '2025-11-01 12:22:33',
      ruleName: automation?.name || 'Auto-approve Low Value POs',
      ruleId: automation?.id || 'AUTO001',
      action: 'Rule triggered',
      status: 'success',
      duration: 0.23,
      details: 'Rule triggered by new PO submission',
      affectedRecords: 1
    }
  ]

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false
    if (searchQuery && !log.details.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleExport = () => {
    onExport({
      automationId: automation?.id,
      timeRange,
      statusFilter,
      logs: filteredLogs,
      exportDate: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSearch className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Automation Logs</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {automation?.name || 'View execution history and diagnostics'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {/* Filters */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success Only</option>
                  <option value="warning">Warnings Only</option>
                  <option value="failed">Failures Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Logs
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search in details..."
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 text-sm font-medium">Success</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.status === 'success').length}
              </div>
              <div className="text-xs text-gray-600">executions</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-600 text-sm font-medium">Warnings</span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.status === 'warning').length}
              </div>
              <div className="text-xs text-gray-600">warnings</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-600 text-sm font-medium">Failures</span>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.status === 'failed').length}
              </div>
              <div className="text-xs text-gray-600">failures</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 text-sm font-medium">Avg Duration</span>
                <Timer className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(logs.reduce((sum, l) => sum + l.duration, 0) / logs.length).toFixed(2)}s
              </div>
              <div className="text-xs text-gray-600">execution time</div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'success' ? 'bg-green-100 text-green-700' :
                          log.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {log.status === 'success' && <CheckCircle className="w-3 h-3" />}
                          {log.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                          {log.status === 'failed' && <XCircle className="w-3 h-3" />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {log.duration}s
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {log.affectedRecords}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Log Detail Panel */}
          {selectedLog && (
            <div className="bg-gray-50 p-3 rounded-lg border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Log Details: {selectedLog.id}</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="ml-2 font-medium">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium">{selectedLog.duration}s</span>
                </div>
                <div>
                  <span className="text-gray-500">Rule Name:</span>
                  <span className="ml-2 font-medium">{selectedLog.ruleName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Rule ID:</span>
                  <span className="ml-2 font-medium">{selectedLog.ruleId}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Details:</span>
                  <p className="mt-1 p-3 bg-white rounded border border-gray-200">{selectedLog.details}</p>
                </div>
                {selectedLog.error && (
                  <div className="col-span-2">
                    <span className="text-red-600 font-medium">Error:</span>
                    <p className="mt-1 p-3 bg-red-50 rounded border border-red-200 text-red-700 font-mono text-xs">
                      {selectedLog.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Logs
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================
// 4. Manage Automation Modal (Enable/Disable)
// ========================

interface ManageAutomationModalProps {
  isOpen: boolean
  onClose: () => void
  automation?: AutomationData
  onSubmit: (data: any) => void
}

export function ManageAutomationModal({ isOpen, onClose, automation, onSubmit }: ManageAutomationModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AutomationData['status']>(automation?.status || 'active')
  const [reason, setReason] = useState('')
  const [scheduleChange, setScheduleChange] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [notifyTeam, setNotifyTeam] = useState(true)
  const [createBackup, setCreateBackup] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      automationId: automation?.id,
      newStatus: selectedStatus,
      reason,
      scheduleChange,
      scheduledDate,
      scheduledTime,
      notifyTeam,
      createBackup
    })
  }

  const getStatusInfo = (status: AutomationData['status']) => {
    switch (status) {
      case 'active':
        return {
          color: 'green',
          icon: <Play className="w-5 h-5" />,
          description: 'Rule is running and processing transactions'
        }
      case 'paused':
        return {
          color: 'yellow',
          icon: <Pause className="w-5 h-5" />,
          description: 'Rule is temporarily paused, can be resumed anytime'
        }
      case 'testing':
        return {
          color: 'blue',
          icon: <Activity className="w-5 h-5" />,
          description: 'Rule is in testing mode, not affecting production'
        }
      case 'disabled':
        return {
          color: 'gray',
          icon: <XCircle className="w-5 h-5" />,
          description: 'Rule is disabled and not running'
        }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Manage Automation</h2>
                <p className="text-purple-100 text-sm mt-1">
                  {automation?.name || 'Control automation rule status'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Current Status */}
          {automation && (
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current Status</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    automation.status === 'active' ? 'bg-green-100 text-green-700' :
                    automation.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    automation.status === 'testing' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {getStatusInfo(automation.status).icon}
                    <span className="capitalize">{automation.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Last Run</div>
                  <div className="font-medium text-gray-900">{automation.lastRun}</div>
                </div>
              </div>
            </div>
          )}

          {/* Change Status */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Change Status
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {(['active', 'paused', 'testing', 'disabled'] as AutomationData['status'][]).map((status) => {
                const info = getStatusInfo(status)
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedStatus === status
                        ? `border-${info.color}-600 bg-${info.color}-50`
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-2 text-${info.color}-600`}>
                      {info.icon}
                      <span className="font-semibold capitalize">{status}</span>
                    </div>
                    <p className="text-xs text-gray-600">{info.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reason */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Change Reason
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Explain why you're changing the automation status..."
              required
            />
          </div>

          {/* Schedule Change */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="scheduleChange"
                checked={scheduleChange}
                onChange={(e) => setScheduleChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="scheduleChange" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Schedule this change for later
              </label>
            </div>

            {scheduleChange && (
              <div className="grid grid-cols-2 gap-2 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={new Date().toISOString().split('T')[0]}
                    required={scheduleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required={scheduleChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-600" />
              Additional Options
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifyTeam}
                  onChange={(e) => setNotifyTeam(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Notify team members about this change</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={createBackup}
                  onChange={(e) => setCreateBackup(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Database className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Create backup before applying changes</span>
              </label>
            </div>
          </div>

          {/* Impact Warning */}
          {(selectedStatus === 'disabled' || selectedStatus === 'paused') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-900 mb-1">Impact Warning</div>
                <p className="text-sm text-amber-700">
                  {selectedStatus === 'disabled'
                    ? 'Disabling this automation will stop all automatic processing. Manual intervention may be required for affected workflows.'
                    : 'Pausing this automation will temporarily halt processing. Pending items will queue until resumed.'}
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {scheduleChange ? 'Schedule Change' : 'Apply Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
