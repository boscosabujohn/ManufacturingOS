'use client'

import { useState } from 'react'
import { GitBranch, CheckCircle, Clock, XCircle, User, ArrowRight } from 'lucide-react'

export default function ApprovalWorkflowsPage() {
  const [workflows] = useState([
    { id: '1', name: 'Journal Entry Approval', levels: 3, type: 'Sequential', active: true, pendingApprovals: 5 },
    { id: '2', name: 'Payment Approval', levels: 2, type: 'Parallel', active: true, pendingApprovals: 12 },
    { id: '3', name: 'Budget Approval', levels: 4, type: 'Sequential', active: true, pendingApprovals: 3 },
    { id: '4', name: 'Purchase Order Approval', levels: 2, type: 'Parallel', active: true, pendingApprovals: 8 }
  ])

  const [pendingItems] = useState([
    { id: 'JE-123', type: 'Journal Entry', amount: 500000, submittedBy: 'John Doe', currentLevel: 1, totalLevels: 3, approver: 'Jane Smith' },
    { id: 'PAY-456', type: 'Payment', amount: 250000, submittedBy: 'Robert Brown', currentLevel: 2, totalLevels: 2, approver: 'CFO' },
    { id: 'BUD-789', type: 'Budget', amount: 10000000, submittedBy: 'Sarah Wilson', currentLevel: 1, totalLevels: 4, approver: 'Department Head' }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-3 py-2">
      <div className="w-full space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Workflows</h1>
          <p className="text-gray-600 mt-1">Multi-level approval configuration and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <GitBranch className="h-6 w-6 text-green-600" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${workflow.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {workflow.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{workflow.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Type: {workflow.type}</p>
                <p>Levels: {workflow.levels}</p>
                <p className="font-semibold text-orange-600">Pending: {workflow.pendingApprovals}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          </div>
          <div className="p-6 space-y-2">
            {pendingItems.map((item) => (
              <div key={item.id} className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.type} - {item.id}</h3>
                    <p className="text-sm text-gray-600">Submitted by: {item.submittedBy}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">{formatCurrency(item.amount)}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Level {item.currentLevel}/{item.totalLevels}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Awaiting approval from: <span className="font-semibold">{item.approver}</span></span>
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: item.totalLevels }).map((_, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        idx < item.currentLevel - 1 ? 'bg-green-500' :
                        idx === item.currentLevel - 1 ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`}>
                        {idx < item.currentLevel - 1 ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : idx === item.currentLevel - 1 ? (
                          <Clock className="h-5 w-5 text-white" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      {idx < item.totalLevels - 1 && <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
