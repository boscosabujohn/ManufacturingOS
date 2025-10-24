'use client';

import React, { useState } from 'react';
import { GitBranch, CheckCircle, XCircle, Clock, User, DollarSign, AlertTriangle } from 'lucide-react';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type RequestType = 'purchase-requisition' | 'purchase-order' | 'contract' | 'supplier-onboarding' | 'budget-change';

export interface ApprovalRequest {
  id: string;
  requestNumber: string;
  type: RequestType;
  title: string;
  requestedBy: string;
  requestDate: string;
  amount: number;
  status: ApprovalStatus;
  currentApprover: string;
  approvalLevel: number;
  totalLevels: number;
  daysOpen: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ApprovalStep {
  level: number;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvalDate?: string;
  comments?: string;
  timeToApprove?: number;
}

export interface WorkflowRule {
  id: string;
  name: string;
  type: RequestType;
  amountRange: { min: number; max: number | null };
  approvers: string[];
  autoApprove: boolean;
  notificationDays: number[];
  escalationDays: number;
  active: boolean;
}

const ApprovalWorkflows: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Mock data - Approval requests
  const requests: ApprovalRequest[] = [
    {
      id: 'REQ001',
      requestNumber: 'PR-2025-1234',
      type: 'purchase-requisition',
      title: 'Office Furniture Procurement',
      requestedBy: 'John Smith',
      requestDate: '2025-10-20',
      amount: 45000,
      status: 'pending',
      currentApprover: 'Sarah Johnson',
      approvalLevel: 2,
      totalLevels: 3,
      daysOpen: 4,
      priority: 'medium',
    },
    {
      id: 'REQ002',
      requestNumber: 'PO-2025-5678',
      type: 'purchase-order',
      title: 'Steel Raw Materials - Q4 Supply',
      requestedBy: 'Michael Chen',
      requestDate: '2025-10-22',
      amount: 2500000,
      status: 'pending',
      currentApprover: 'Robert Wilson',
      approvalLevel: 3,
      totalLevels: 4,
      daysOpen: 2,
      priority: 'high',
    },
    {
      id: 'REQ003',
      requestNumber: 'CNT-2025-089',
      type: 'contract',
      title: 'IT Services Master Agreement Renewal',
      requestedBy: 'Emily Davis',
      requestDate: '2025-10-15',
      amount: 1800000,
      status: 'approved',
      currentApprover: 'Lisa Anderson',
      approvalLevel: 4,
      totalLevels: 4,
      daysOpen: 9,
      priority: 'high',
    },
    {
      id: 'REQ004',
      requestNumber: 'SUP-2025-045',
      type: 'supplier-onboarding',
      title: 'New Supplier: Global Components Ltd.',
      requestedBy: 'David Lee',
      requestDate: '2025-10-18',
      amount: 0,
      status: 'pending',
      currentApprover: 'Sarah Johnson',
      approvalLevel: 1,
      totalLevels: 2,
      daysOpen: 6,
      priority: 'low',
    },
    {
      id: 'REQ005',
      requestNumber: 'PR-2025-1189',
      type: 'purchase-requisition',
      title: 'Emergency Maintenance Equipment',
      requestedBy: 'Robert Wilson',
      requestDate: '2025-10-23',
      amount: 125000,
      status: 'pending',
      currentApprover: 'Michael Chen',
      approvalLevel: 1,
      totalLevels: 2,
      daysOpen: 1,
      priority: 'urgent',
    },
    {
      id: 'REQ006',
      requestNumber: 'BUD-2025-012',
      type: 'budget-change',
      title: 'Q4 Procurement Budget Adjustment',
      requestedBy: 'Lisa Anderson',
      requestDate: '2025-10-10',
      amount: 500000,
      status: 'rejected',
      currentApprover: 'CFO',
      approvalLevel: 4,
      totalLevels: 4,
      daysOpen: 14,
      priority: 'high',
    },
  ];

  // Mock data - Approval steps for a request
  const approvalSteps: ApprovalStep[] = [
    {
      level: 1,
      approver: 'Michael Chen',
      role: 'Department Manager',
      status: 'approved',
      approvalDate: '2025-10-21',
      comments: 'Approved. Aligns with department requirements.',
      timeToApprove: 18,
    },
    {
      level: 2,
      approver: 'Sarah Johnson',
      role: 'Procurement Director',
      status: 'pending',
      comments: undefined,
      timeToApprove: undefined,
    },
    {
      level: 3,
      approver: 'Robert Wilson',
      role: 'VP Operations',
      status: 'pending',
      comments: undefined,
      timeToApprove: undefined,
    },
    {
      level: 4,
      approver: 'Lisa Anderson',
      role: 'CFO',
      status: 'pending',
      comments: undefined,
      timeToApprove: undefined,
    },
  ];

  // Mock data - Workflow rules
  const workflowRules: WorkflowRule[] = [
    {
      id: 'RULE001',
      name: 'Standard PR - Low Value',
      type: 'purchase-requisition',
      amountRange: { min: 0, max: 50000 },
      approvers: ['Department Manager', 'Procurement Manager'],
      autoApprove: false,
      notificationDays: [1, 3],
      escalationDays: 5,
      active: true,
    },
    {
      id: 'RULE002',
      name: 'Standard PR - Medium Value',
      type: 'purchase-requisition',
      amountRange: { min: 50000, max: 250000 },
      approvers: ['Department Manager', 'Procurement Director', 'VP Operations'],
      autoApprove: false,
      notificationDays: [1, 2, 4],
      escalationDays: 7,
      active: true,
    },
    {
      id: 'RULE003',
      name: 'Standard PR - High Value',
      type: 'purchase-requisition',
      amountRange: { min: 250000, max: null },
      approvers: ['Department Manager', 'Procurement Director', 'VP Operations', 'CFO'],
      autoApprove: false,
      notificationDays: [1, 2, 3],
      escalationDays: 5,
      active: true,
    },
    {
      id: 'RULE004',
      name: 'Purchase Order - All Values',
      type: 'purchase-order',
      amountRange: { min: 0, max: null },
      approvers: ['Procurement Manager', 'Procurement Director', 'VP Operations', 'CFO'],
      autoApprove: false,
      notificationDays: [1, 2],
      escalationDays: 3,
      active: true,
    },
    {
      id: 'RULE005',
      name: 'Contract Approval',
      type: 'contract',
      amountRange: { min: 0, max: null },
      approvers: ['Procurement Director', 'Legal', 'VP Operations', 'CFO'],
      autoApprove: false,
      notificationDays: [2, 5, 7],
      escalationDays: 10,
      active: true,
    },
    {
      id: 'RULE006',
      name: 'Supplier Onboarding',
      type: 'supplier-onboarding',
      amountRange: { min: 0, max: 0 },
      approvers: ['Procurement Manager', 'Procurement Director'],
      autoApprove: false,
      notificationDays: [2, 5],
      escalationDays: 7,
      active: true,
    },
  ];

  const getStatusColor = (status: ApprovalStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'skipped':
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <GitBranch className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Approval Workflows</h2>
            <p className="text-blue-100">Multi-level approval routing and tracking</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue (5+ days)</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'pending' && r.daysOpen >= 5).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Approval Requests */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approval Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Approver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Open</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRequest(request.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.requestNumber}</div>
                      <div className="text-xs text-gray-500">{request.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {request.requestedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.amount > 0 ? `$${(request.amount / 1000).toFixed(0)}K` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.currentApprover}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(request.approvalLevel / request.totalLevels) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{request.approvalLevel}/{request.totalLevels}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${request.daysOpen >= 5 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      {request.daysOpen} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Steps Example */}
      {selectedRequest && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Approval Chain - {requests.find(r => r.id === selectedRequest)?.requestNumber}</h3>
          </div>
          <div className="p-6">
            <div className="relative">
              {approvalSteps.map((step, index) => (
                <div key={step.level} className="flex items-start mb-8 last:mb-0">
                  <div className="flex flex-col items-center mr-4">
                    {getStepStatusIcon(step.status)}
                    {index < approvalSteps.length - 1 && (
                      <div className={`w-0.5 h-16 mt-2 ${step.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Level {step.level}: {step.approver}</h4>
                        <p className="text-xs text-gray-500">{step.role}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        step.status === 'approved' ? 'bg-green-100 text-green-800' :
                        step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        step.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    {step.approvalDate && (
                      <p className="text-xs text-gray-600 mb-1">Approved on: {step.approvalDate}</p>
                    )}
                    {step.timeToApprove && (
                      <p className="text-xs text-gray-600 mb-1">Time to approve: {step.timeToApprove} hours</p>
                    )}
                    {step.comments && (
                      <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">{step.comments}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Rules */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Rules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Levels</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approvers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflowRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{rule.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(rule.amountRange.min / 1000).toFixed(0)}K - {rule.amountRange.max ? `$${(rule.amountRange.max / 1000).toFixed(0)}K` : 'Unlimited'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.approvers.length} levels</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-xs">
                      {rule.approvers.map((approver, idx) => (
                        <div key={idx} className="text-xs">
                          {idx + 1}. {approver}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.escalationDays} days</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rule.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflows;
