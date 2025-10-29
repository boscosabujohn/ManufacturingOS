'use client'

import { useState, useEffect } from 'react'
import { X, Play, CheckCircle, XCircle, AlertCircle, ChevronRight, Code, Zap } from 'lucide-react'

export interface WorkflowTest {
  id?: string
  workflowId: string
  scenario: string
  testData: Record<string, any>
  results?: {
    success: boolean
    steps: {
      name: string
      status: 'pending' | 'running' | 'success' | 'failed'
      message?: string
      duration?: number
    }[]
    totalDuration?: number
    error?: string
  }
}

interface WorkflowTestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (test: WorkflowTest) => void
  workflowTest?: WorkflowTest
  mode?: 'add' | 'edit'
}

// Mock scenarios
const testScenarios = [
  { id: 'happy-path', name: 'Happy Path', description: 'Test the ideal flow with valid data' },
  { id: 'error-handling', name: 'Error Handling', description: 'Test error cases and edge conditions' },
  { id: 'boundary-conditions', name: 'Boundary Conditions', description: 'Test with minimum and maximum values' },
  { id: 'concurrent-execution', name: 'Concurrent Execution', description: 'Test parallel workflow execution' },
  { id: 'data-validation', name: 'Data Validation', description: 'Test input validation rules' }
]

// Mock workflow steps
const mockWorkflowSteps = [
  { name: 'Initialize Workflow', duration: 120 },
  { name: 'Validate Input Data', duration: 80 },
  { name: 'Process Business Logic', duration: 350 },
  { name: 'Update Database', duration: 200 },
  { name: 'Send Notifications', duration: 150 },
  { name: 'Finalize and Log', duration: 100 }
]

export default function WorkflowTestModal({ isOpen, onClose, onSave, workflowTest, mode = 'add' }: WorkflowTestModalProps) {
  const [formData, setFormData] = useState<WorkflowTest>({
    workflowId: '',
    scenario: '',
    testData: {}
  })

  const [testDataInput, setTestDataInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<WorkflowTest['results']>()

  useEffect(() => {
    if (workflowTest && mode === 'edit') {
      setFormData(workflowTest)
      setTestDataInput(JSON.stringify(workflowTest.testData, null, 2))
      setTestResults(workflowTest.results)
    } else {
      setFormData({
        workflowId: '',
        scenario: '',
        testData: {}
      })
      setTestDataInput('{\n  "key": "value"\n}')
      setTestResults(undefined)
    }
    setErrors({})
    setIsRunning(false)
  }, [workflowTest, mode, isOpen])

  const handleChange = (field: keyof WorkflowTest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTestDataChange = (value: string) => {
    setTestDataInput(value)
    try {
      const parsed = JSON.parse(value)
      setFormData(prev => ({ ...prev, testData: parsed }))
      if (errors.testData) {
        setErrors(prev => ({ ...prev, testData: '' }))
      }
    } catch (e) {
      // Invalid JSON, will be caught in validation
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.workflowId.trim()) {
      newErrors.workflowId = 'Workflow ID is required'
    }

    if (!formData.scenario) {
      newErrors.scenario = 'Test scenario is required'
    }

    try {
      JSON.parse(testDataInput)
    } catch (e) {
      newErrors.testData = 'Invalid JSON format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const simulateWorkflowTest = async () => {
    setIsRunning(true)

    const steps = mockWorkflowSteps.map(step => ({
      ...step,
      status: 'pending' as const
    }))

    setTestResults({
      success: false,
      steps,
      totalDuration: 0
    })

    let totalDuration = 0
    const shouldFail = formData.scenario === 'error-handling' && Math.random() > 0.5

    for (let i = 0; i < steps.length; i++) {
      // Update to running
      setTestResults(prev => ({
        ...prev!,
        steps: prev!.steps.map((s, idx) =>
          idx === i ? { ...s, status: 'running' as const } : s
        )
      }))

      await new Promise(resolve => setTimeout(resolve, steps[i].duration))

      // Check if should fail at this step
      const failed = shouldFail && i === 2

      totalDuration += steps[i].duration

      // Update to success or failed
      setTestResults(prev => ({
        ...prev!,
        steps: prev!.steps.map((s, idx) =>
          idx === i
            ? {
                ...s,
                status: failed ? 'failed' : 'success',
                message: failed ? 'Business logic validation failed' : undefined
              }
            : s
        ),
        totalDuration
      }))

      if (failed) {
        setTestResults(prev => ({
          ...prev!,
          success: false,
          error: 'Workflow execution failed at step: Process Business Logic'
        }))
        setIsRunning(false)
        return
      }
    }

    setTestResults(prev => ({
      ...prev!,
      success: true,
      totalDuration
    }))

    setIsRunning(false)
  }

  const handleRunTest = async () => {
    if (validateForm()) {
      await simulateWorkflowTest()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({
        ...formData,
        results: testResults
      })
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'running':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            {mode === 'edit' ? 'Edit Workflow Test' : 'New Workflow Test'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Workflow ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.workflowId}
              onChange={(e) => handleChange('workflowId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.workflowId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., workflow-order-processing-v2"
              autoFocus
            />
            {errors.workflowId && (
              <p className="mt-1 text-sm text-red-600">{errors.workflowId}</p>
            )}
          </div>

          {/* Test Scenario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Scenario <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {testScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => handleChange('scenario', scenario.id)}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                    formData.scenario === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <ChevronRight className={`w-5 h-5 mt-0.5 ${
                      formData.scenario === scenario.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{scenario.name}</div>
                      <div className="text-sm text-gray-600">{scenario.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.scenario && (
              <p className="mt-1 text-sm text-red-600">{errors.scenario}</p>
            )}
          </div>

          {/* Test Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Test Data (JSON) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={testDataInput}
              onChange={(e) => handleTestDataChange(e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                errors.testData ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='{"key": "value"}'
            />
            {errors.testData && (
              <p className="mt-1 text-sm text-red-600">{errors.testData}</p>
            )}
          </div>

          {/* Run Test Button */}
          <div>
            <button
              type="button"
              onClick={handleRunTest}
              disabled={isRunning}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              <Play className="w-5 h-5" />
              {isRunning ? 'Running Test...' : 'Run Test'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="border border-gray-300 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Test Results</h3>
                {testResults.success !== undefined && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    testResults.success
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {testResults.success ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Success</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Failed</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Workflow Steps */}
              <div className="space-y-2">
                {testResults.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      step.status === 'failed'
                        ? 'bg-red-50'
                        : step.status === 'success'
                        ? 'bg-green-50'
                        : step.status === 'running'
                        ? 'bg-blue-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{step.name}</div>
                      {step.message && (
                        <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {step.message}
                        </div>
                      )}
                      {step.duration && step.status === 'success' && (
                        <div className="text-xs text-gray-500 mt-1">{step.duration}ms</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {testResults.totalDuration !== undefined && (
                <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">
                  <strong>Total Duration:</strong> {testResults.totalDuration}ms
                </div>
              )}

              {testResults.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-900">Error</div>
                      <div className="text-sm text-red-700">{testResults.error}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!testResults}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {mode === 'edit' ? 'Save Changes' : 'Save Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
