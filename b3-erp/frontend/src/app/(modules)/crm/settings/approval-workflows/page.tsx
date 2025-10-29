'use client'

import { useState } from 'react'
import { GitBranch, Plus, Edit2, Trash2, Play, Pause, CheckCircle, XCircle, Clock, Users, AlertTriangle } from 'lucide-react'
import { useToast } from '@/components/ui'

interface ApprovalWorkflow {
  id: string
  name: string
  description: string
  type: 'discount' | 'deal' | 'contract' | 'custom'
  active: boolean
  stages: ApprovalStage[]
  conditions: WorkflowCondition[]
  totalApprovals: number
  pending: number
  approved: number
  rejected: number
  createdAt: string
}

interface ApprovalStage {
  id: string
  name: string
  order: number
  approvers: Approver[]
  approvalType: 'any' | 'all' | 'majority'
  autoApprove?: boolean
  escalationHours?: number
  escalateTo?: string
}

interface Approver {
  id: string
  name: string
  email: string
  role: string
}

interface WorkflowCondition {
  field: string
  operator: string
  value: string | number
}

export default function ApprovalWorkflowsPage() {
  const { addToast } = useToast()
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: '1',
      name: 'Discount Approval - Multi-Level',
      description: 'Approval chain for discounts based on percentage',
      type: 'discount',
      active: true,
      stages: [
        {
          id: 's1',
          name: 'Sales Manager Approval',
          order: 1,
          approvers: [
            { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Sales Manager' }
          ],
          approvalType: 'any',
          autoApprove: false,
          escalationHours: 24
        },
        {
          id: 's2',
          name: 'VP Sales Approval',
          order: 2,
          approvers: [
            { id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', role: 'VP Sales' }
          ],
          approvalType: 'any',
          escalationHours: 48,
          escalateTo: 'CEO'
        }
      ],
      conditions: [
        { field: 'discount_percentage', operator: '>', value: 10 }
      ],
      totalApprovals: 345,
      pending: 12,
      approved: 298,
      rejected: 35,
      createdAt: '2025-09-15'
    },
    {
      id: '2',
      name: 'High-Value Deal Approval',
      description: 'Multi-stage approval for deals > ₹50 Lakhs',
      type: 'deal',
      active: true,
      stages: [
        {
          id: 's3',
          name: 'Regional Sales Head',
          order: 1,
          approvers: [
            { id: 'u3', name: 'Amit Patel', email: 'amit@example.com', role: 'Regional Head - North' },
            { id: 'u4', name: 'Vikram Singh', email: 'vikram@example.com', role: 'Regional Head - South' }
          ],
          approvalType: 'any',
          escalationHours: 24
        },
        {
          id: 's4',
          name: 'Finance Review',
          order: 2,
          approvers: [
            { id: 'u5', name: 'Anjali Verma', email: 'anjali@example.com', role: 'CFO' }
          ],
          approvalType: 'any',
          escalationHours: 48
        },
        {
          id: 's5',
          name: 'Executive Approval',
          order: 3,
          approvers: [
            { id: 'u6', name: 'Sanjay Gupta', email: 'sanjay@example.com', role: 'CEO' }
          ],
          approvalType: 'any',
          escalationHours: 72
        }
      ],
      conditions: [
        { field: 'deal_value', operator: '>', value: 5000000 }
      ],
      totalApprovals: 89,
      pending: 5,
      approved: 67,
      rejected: 17,
      createdAt: '2025-09-20'
    },
    {
      id: '3',
      name: 'Contract Approval - Legal Review',
      description: 'Contract approval with legal and executive sign-off',
      type: 'contract',
      active: true,
      stages: [
        {
          id: 's6',
          name: 'Legal Review',
          order: 1,
          approvers: [
            { id: 'u7', name: 'Neha Reddy', email: 'neha@example.com', role: 'Legal Counsel' },
            { id: 'u8', name: 'Karan Malhotra', email: 'karan@example.com', role: 'Contract Manager' }
          ],
          approvalType: 'all',
          escalationHours: 72
        },
        {
          id: 's7',
          name: 'Finance Approval',
          order: 2,
          approvers: [
            { id: 'u5', name: 'Anjali Verma', email: 'anjali@example.com', role: 'CFO' }
          ],
          approvalType: 'any',
          escalationHours: 48
        },
        {
          id: 's8',
          name: 'Executive Sign-off',
          order: 3,
          approvers: [
            { id: 'u6', name: 'Sanjay Gupta', email: 'sanjay@example.com', role: 'CEO' }
          ],
          approvalType: 'any'
        }
      ],
      conditions: [
        { field: 'contract_value', operator: '>', value: 10000000 },
        { field: 'contract_duration', operator: '>', value: 12 }
      ],
      totalApprovals: 45,
      pending: 3,
      approved: 38,
      rejected: 4,
      createdAt: '2025-09-25'
    },
    {
      id: '4',
      name: 'Express Approval - Small Discounts',
      description: 'Auto-approve discounts < 5% with notification',
      type: 'discount',
      active: true,
      stages: [
        {
          id: 's9',
          name: 'Auto-Approval',
          order: 1,
          approvers: [
            { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Sales Manager' }
          ],
          approvalType: 'any',
          autoApprove: true
        }
      ],
      conditions: [
        { field: 'discount_percentage', operator: '<=', value: 5 }
      ],
      totalApprovals: 1234,
      pending: 0,
      approved: 1234,
      rejected: 0,
      createdAt: '2025-10-01'
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(workflows.map(wf => {
      if (wf.id === workflowId) {
        const newStatus = !wf.active
        addToast({
          title: newStatus ? 'Workflow Activated' : 'Workflow Deactivated',
          message: `${wf.name} has been ${newStatus ? 'activated' : 'deactivated'}`,
          variant: newStatus ? 'success' : 'warning'
        })
        return { ...wf, active: newStatus }
      }
      return wf
    }))
  }

  const deleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(wf => wf.id === workflowId)
    if (workflow && confirm(`Delete workflow "${workflow.name}"?`)) {
      setWorkflows(workflows.filter(wf => wf.id !== workflowId))
      addToast({
        title: 'Workflow Deleted',
        message: `${workflow.name} has been deleted`,
        variant: 'success'
      })
    }
  }

  const getTypeIcon = (type: ApprovalWorkflow['type']) => {
    switch (type) {
      case 'discount': return '💰'
      case 'deal': return '🤝'
      case 'contract': return '📄'
      case 'custom': return '⚙️'
    }
  }

  const getTypeName = (type: ApprovalWorkflow['type']) => {
    switch (type) {
      case 'discount': return 'Discount Approval'
      case 'deal': return 'Deal Approval'
      case 'contract': return 'Contract Approval'
      case 'custom': return 'Custom Workflow'
    }
  }

  const formatConditions = (conditions: WorkflowCondition[]) => {
    return conditions.map(c => {
      const value = typeof c.value === 'number' && c.value > 1000
        ? `₹${(c.value / 100000).toFixed(2)}L`
        : c.value
      return `${c.field.replace('_', ' ')} ${c.operator} ${value}`
    }).join(' AND ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Approval Workflows</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Configure multi-stage approval processes for deals, discounts, and contracts
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Workflow
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Total Workflows</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">{workflows.length}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Active</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {workflows.filter(wf => wf.active).length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="text-sm text-orange-600 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending
              </div>
              <div className="text-2xl font-bold text-orange-900 mt-1">
                {workflows.reduce((sum, wf) => sum + wf.pending, 0)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Approved
              </div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                {workflows.reduce((sum, wf) => sum + wf.approved, 0)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-600 font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Rejected
              </div>
              <div className="text-2xl font-bold text-red-900 mt-1">
                {workflows.reduce((sum, wf) => sum + wf.rejected, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
              workflow.active ? 'border-green-200' : 'border-gray-200'
            } ${selectedWorkflow === workflow.id ? 'ring-2 ring-purple-500' : ''}`}
            onClick={() => setSelectedWorkflow(workflow.id === selectedWorkflow ? null : workflow.id)}
          >
            {/* Workflow Header */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{getTypeIcon(workflow.type)}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{workflow.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  workflow.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {workflow.active ? '● Active' : '○ Inactive'}
                </span>
              </div>

              {/* Conditions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-xs font-medium text-blue-700 mb-1">Trigger Conditions:</div>
                <div className="text-sm text-blue-900 font-mono">{formatConditions(workflow.conditions)}</div>
              </div>

              {/* Approval Stages */}
              <div className="space-y-3 mb-4">
                <div className="text-xs font-medium text-gray-700">Approval Stages:</div>
                {workflow.stages.map((stage, idx) => (
                  <div key={stage.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      {idx < workflow.stages.length - 1 && (
                        <div className="w-0.5 h-8 bg-purple-200 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm text-gray-900">{stage.name}</div>
                        {stage.autoApprove && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            Auto
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{stage.approvers.length} approver(s)</span>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize">{stage.approvalType}</span>
                        {stage.escalationHours && (
                          <>
                            <span className="text-gray-400">•</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            <span>{stage.escalationHours}h escalation</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        {stage.approvers.map(approver => (
                          <div key={approver.id} className="text-xs text-gray-600 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                              {approver.name.charAt(0)}
                            </div>
                            <span>{approver.name}</span>
                            <span className="text-gray-400">({approver.role})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{workflow.totalApprovals}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="text-lg font-bold text-orange-600">{workflow.pending}</div>
                  <div className="text-xs text-orange-600">Pending</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">{workflow.approved}</div>
                  <div className="text-xs text-green-600">Approved</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-600">{workflow.rejected}</div>
                  <div className="text-xs text-red-600">Rejected</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Created: {workflow.createdAt}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWorkflowStatus(workflow.id)
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    workflow.active
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                  title={workflow.active ? 'Pause Workflow' : 'Activate Workflow'}
                >
                  {workflow.active ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToast({ title: 'Edit Workflow', message: 'Editing functionality will be implemented', variant: 'info' })
                  }}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Edit Workflow"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteWorkflow(workflow.id)
                  }}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete Workflow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dialog Placeholder */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Approval Workflow</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Workflow builder will be implemented here with drag-drop stage builder...</p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
