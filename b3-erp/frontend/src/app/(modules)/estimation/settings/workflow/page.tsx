'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GitBranch,
  Edit2,
  Save,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Plus,
  Users,
  CheckCircle
} from 'lucide-react'

interface WorkflowStage {
  id: string
  stageCode: string
  stageName: string
  stageOrder: number
  description: string
  approverRole: string
  approvalRequired: boolean
  autoAdvance: boolean
  notifyOnEntry: boolean
  notifyOnApproval: boolean
  maxDaysInStage: number
  escalationEnabled: boolean
  escalationDays: number
  escalateTo: string
  allowReject: boolean
  allowRevision: boolean
  status: 'active' | 'inactive'
}

export default function EstimationSettingsWorkflowPage() {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)

  const [workflowStages] = useState<WorkflowStage[]>([
    {
      id: 'WF-001',
      stageCode: 'DRAFT',
      stageName: 'Draft',
      stageOrder: 1,
      description: 'Initial draft stage where estimate is being prepared',
      approverRole: 'None',
      approvalRequired: false,
      autoAdvance: false,
      notifyOnEntry: false,
      notifyOnApproval: false,
      maxDaysInStage: 7,
      escalationEnabled: true,
      escalationDays: 5,
      escalateTo: 'Sales Manager',
      allowReject: false,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-002',
      stageCode: 'REVIEW',
      stageName: 'Technical Review',
      stageOrder: 2,
      description: 'Technical review by estimation manager',
      approverRole: 'Estimation Manager',
      approvalRequired: true,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: true,
      maxDaysInStage: 2,
      escalationEnabled: true,
      escalationDays: 2,
      escalateTo: 'Senior Manager',
      allowReject: true,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-003',
      stageCode: 'PRICING',
      stageName: 'Pricing Approval',
      stageOrder: 3,
      description: 'Pricing and margin approval by sales manager',
      approverRole: 'Sales Manager',
      approvalRequired: true,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: true,
      maxDaysInStage: 2,
      escalationEnabled: true,
      escalationDays: 2,
      escalateTo: 'Director',
      allowReject: true,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-004',
      stageCode: 'MGR-APPROVE',
      stageName: 'Manager Approval',
      stageOrder: 4,
      description: 'Final approval by senior manager for estimates above threshold',
      approverRole: 'Senior Manager',
      approvalRequired: true,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: true,
      maxDaysInStage: 3,
      escalationEnabled: true,
      escalationDays: 3,
      escalateTo: 'Director',
      allowReject: true,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-005',
      stageCode: 'DIR-APPROVE',
      stageName: 'Director Approval',
      stageOrder: 5,
      description: 'Director approval for high-value estimates (above 50L)',
      approverRole: 'Director',
      approvalRequired: true,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: true,
      maxDaysInStage: 5,
      escalationEnabled: true,
      escalationDays: 4,
      escalateTo: 'CEO',
      allowReject: true,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-006',
      stageCode: 'APPROVED',
      stageName: 'Approved',
      stageOrder: 6,
      description: 'Estimate approved and ready to send to customer',
      approverRole: 'None',
      approvalRequired: false,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: false,
      maxDaysInStage: 30,
      escalationEnabled: true,
      escalationDays: 25,
      escalateTo: 'Sales Manager',
      allowReject: false,
      allowRevision: false,
      status: 'active'
    },
    {
      id: 'WF-007',
      stageCode: 'SENT',
      stageName: 'Sent to Customer',
      stageOrder: 7,
      description: 'Estimate sent to customer, awaiting response',
      approverRole: 'None',
      approvalRequired: false,
      autoAdvance: false,
      notifyOnEntry: false,
      notifyOnApproval: false,
      maxDaysInStage: 30,
      escalationEnabled: true,
      escalationDays: 20,
      escalateTo: 'Sales Manager',
      allowReject: false,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-008',
      stageCode: 'NEGOTIATION',
      stageName: 'Under Negotiation',
      stageOrder: 8,
      description: 'Customer negotiating terms and pricing',
      approverRole: 'Sales Manager',
      approvalRequired: true,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: false,
      maxDaysInStage: 15,
      escalationEnabled: true,
      escalationDays: 12,
      escalateTo: 'Senior Manager',
      allowReject: false,
      allowRevision: true,
      status: 'active'
    },
    {
      id: 'WF-009',
      stageCode: 'CONVERTED',
      stageName: 'Converted to Order',
      stageOrder: 9,
      description: 'Estimate accepted and converted to sales order',
      approverRole: 'None',
      approvalRequired: false,
      autoAdvance: true,
      notifyOnEntry: true,
      notifyOnApproval: false,
      maxDaysInStage: 0,
      escalationEnabled: false,
      escalationDays: 0,
      escalateTo: 'None',
      allowReject: false,
      allowRevision: false,
      status: 'active'
    },
    {
      id: 'WF-010',
      stageCode: 'REJECTED',
      stageName: 'Rejected',
      stageOrder: 10,
      description: 'Estimate rejected by approver or customer',
      approverRole: 'None',
      approvalRequired: false,
      autoAdvance: false,
      notifyOnEntry: true,
      notifyOnApproval: false,
      maxDaysInStage: 0,
      escalationEnabled: false,
      escalationDays: 0,
      escalateTo: 'None',
      allowReject: false,
      allowRevision: true,
      status: 'active'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalStages = workflowStages.length
  const approvalStages = workflowStages.filter(s => s.approvalRequired).length
  const activeStages = workflowStages.filter(s => s.status === 'active').length
  const escalationEnabled = workflowStages.filter(s => s.escalationEnabled).length

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Configure estimation approval workflow stages</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Stage
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Stages</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalStages}</p>
              <p className="text-xs text-blue-700 mt-1">Workflow stages</p>
            </div>
            <GitBranch className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeStages}</p>
              <p className="text-xs text-green-700 mt-1">In use</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Approval Stages</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{approvalStages}</p>
              <p className="text-xs text-purple-700 mt-1">Require approval</p>
            </div>
            <Users className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Escalation Enabled</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{escalationEnabled}</p>
              <p className="text-xs text-orange-700 mt-1">With escalation</p>
            </div>
            <GitBranch className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Workflow Stages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Workflow Stages Configuration</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stages..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escalation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions Allowed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workflowStages.sort((a, b) => a.stageOrder - b.stageOrder).map((stage) => (
                <tr key={stage.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                      {stage.stageOrder}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{stage.stageName}</p>
                      <p className="text-xs text-gray-600 mt-1">{stage.stageCode}</p>
                      <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{stage.approverRole}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      stage.approvalRequired
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {stage.approvalRequired ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{stage.maxDaysInStage || '-'}</p>
                    {stage.maxDaysInStage > 0 && (
                      <p className="text-xs text-gray-600 mt-1">days</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {stage.escalationEnabled ? (
                      <div>
                        <p className="text-sm text-orange-600 font-medium">After {stage.escalationDays} days</p>
                        <p className="text-xs text-gray-600 mt-1">to {stage.escalateTo}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {stage.allowReject && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Reject</span>
                      )}
                      {stage.allowRevision && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Revise</span>
                      )}
                      {stage.autoAdvance && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Auto</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(stage.status)}`}>
                      {stage.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === stage.id ? (
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                         
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(stage.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                         
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
