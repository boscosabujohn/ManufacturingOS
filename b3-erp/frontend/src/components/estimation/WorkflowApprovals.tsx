'use client';

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Users,
  ArrowRight,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Bell,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated' | 'withdrawn';
export type ApproverRole = 'estimator' | 'lead_estimator' | 'manager' | 'director' | 'vp' | 'cfo';

export interface Approver {
  id: string;
  name: string;
  email: string;
  role: ApproverRole;
  order: number;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  respondedAt?: string;
  comments?: string;
  declineReason?: string;
}

export interface ApprovalThreshold {
  id: string;
  name: string;
  description: string;
  condition: {
    type: 'estimate_value' | 'margin_percent' | 'risk_score' | 'custom';
    operator: 'greater_than' | 'less_than' | 'between';
    value: number | [number, number];
  };
  requiredApprovers: {
    role: ApproverRole;
    count: number;
    parallel?: boolean;
  }[];
  autoEscalateAfterHours?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ApprovalRequest {
  id: string;
  estimateId: string;
  estimateName: string;
  estimateValue: number;
  marginPercent: number;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  approvers: Approver[];
  threshold: ApprovalThreshold;
  currentLevel: number;
  totalLevels: number;
  dueDate?: string;
  escalatedAt?: string;
  notes?: string;
  attachments?: string[];
}

export interface WorkflowApprovalsProps {
  requests: ApprovalRequest[];
  thresholds: ApprovalThreshold[];
  currentUserRole?: ApproverRole;
  onApprove?: (requestId: string, comments?: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onEscalate?: (requestId: string) => void;
  onWithdraw?: (requestId: string) => void;
  onSendReminder?: (requestId: string, approverId: string) => void;
  onViewDetails?: (requestId: string) => void;
  onCreateThreshold?: () => void;
  onEditThreshold?: (thresholdId: string) => void;
  className?: string;
}

export const WorkflowApprovals: React.FC<WorkflowApprovalsProps> = ({
  requests,
  thresholds,
  currentUserRole,
  onApprove,
  onReject,
  onEscalate,
  onWithdraw,
  onSendReminder,
  onViewDetails,
  onCreateThreshold,
  onEditThreshold,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'thresholds'>('requests');
  const [filter, setFilter] = useState<string>('all');
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
  const [rejectingRequest, setRejectingRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const getRoleLabel = (role: ApproverRole): string => {
    const labels: Record<ApproverRole, string> = {
      estimator: 'Estimator',
      lead_estimator: 'Lead Estimator',
      manager: 'Manager',
      director: 'Director',
      vp: 'VP',
      cfo: 'CFO',
    };
    return labels[role];
  };

  const getStatusConfig = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Pending' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejected' };
      case 'escalated':
        return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Escalated' };
      case 'withdrawn':
        return { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Withdrawn' };
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    if (filter === 'my-approvals' && currentUserRole) {
      return req.approvers.some((a) => a.role === currentUserRole && a.status === 'pending');
    }
    return req.status === filter;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    myPending: currentUserRole
      ? requests.filter((r) => r.approvers.some((a) => a.role === currentUserRole && a.status === 'pending')).length
      : 0,
  };

  const toggleExpanded = (requestId: string) => {
    setExpandedRequests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };

  const handleReject = (requestId: string) => {
    if (rejectReason.trim() && onReject) {
      onReject(requestId, rejectReason);
      setRejectingRequest(null);
      setRejectReason('');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total Requests</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Approved</p>
          <p className="text-3xl font-bold">{stats.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Rejected</p>
          <p className="text-3xl font-bold">{stats.rejected}</p>
        </div>
        {currentUserRole && (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">My Pending</p>
            <p className="text-3xl font-bold">{stats.myPending}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approval Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'thresholds' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approval Thresholds ({thresholds.length})
          </button>
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex items-center space-x-2 mb-6">
              {['all', 'my-approvals', 'pending', 'approved', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'my-approvals' ? 'My Approvals' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedRequests.has(request.id);
                const canApprove = currentUserRole && request.approvers.some((a) => a.role === currentUserRole && a.status === 'pending');

                return (
                  <div key={request.id} className="bg-white border-2 border-gray-200 rounded-lg hover:shadow-lg transition-all">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                            <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{request.estimateName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                {statusConfig.label}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Estimate Value</p>
                                <p className="text-sm font-bold text-gray-900">${request.estimateValue.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Margin</p>
                                <p className="text-sm font-bold text-green-600">{request.marginPercent}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Progress</p>
                                <p className="text-sm font-bold text-blue-600">
                                  {request.currentLevel}/{request.totalLevels} Levels
                                </p>
                              </div>
                            </div>

                            {/* Approval Chain */}
                            <div className="flex items-center space-x-2 mb-2">
                              {request.approvers.map((approver, idx) => (
                                <div key={approver.id} className="flex items-center">
                                  {idx > 0 && <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />}
                                  <div
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      approver.status === 'approved'
                                        ? 'bg-green-100 text-green-700'
                                        : approver.status === 'rejected'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                    title={approver.name}
                                  >
                                    {getRoleLabel(approver.role)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <p className="text-xs text-gray-600">
                              Requested by {request.requestedBy} on {new Date(request.requestedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {canApprove && onApprove && (
                            <button
                              onClick={() => onApprove(request.id)}
                              className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <ThumbsUp className="h-5 w-5" />
                            </button>
                          )}
                          {canApprove && onReject && (
                            <button
                              onClick={() => setRejectingRequest(request.id)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <ThumbsDown className="h-5 w-5" />
                            </button>
                          )}
                          {onViewDetails && (
                            <button
                              onClick={() => onViewDetails(request.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpanded(request.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Reject Form */}
                      {rejectingRequest === request.id && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-semibold text-red-900 mb-2">Rejection Reason (Required)</label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                            rows={3}
                            placeholder="Please provide a reason for rejection..."
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleReject(request.id)}
                              disabled={!rejectReason.trim()}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => {
                                setRejectingRequest(null);
                                setRejectReason('');
                              }}
                              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Approver Details</h4>
                        <div className="space-y-2">
                          {request.approvers.map((approver) => (
                            <div key={approver.id} className="flex items-start space-x-3 bg-white p-3 rounded border border-gray-200">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  approver.status === 'approved'
                                    ? 'bg-green-100 text-green-600'
                                    : approver.status === 'rejected'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-yellow-100 text-yellow-600'
                                }`}
                              >
                                {approver.status === 'approved' ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : approver.status === 'rejected' ? (
                                  <XCircle className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{approver.name}</p>
                                <p className="text-xs text-gray-600">{getRoleLabel(approver.role)}</p>
                                {approver.respondedAt && (
                                  <p className="text-xs text-gray-500 mt-1">{new Date(approver.respondedAt).toLocaleString()}</p>
                                )}
                                {approver.comments && <p className="text-xs text-gray-700 mt-1 italic">"{approver.comments}"</p>}
                                {approver.declineReason && (
                                  <p className="text-xs text-red-700 mt-1">
                                    <strong>Reason:</strong> {approver.declineReason}
                                  </p>
                                )}
                              </div>
                              {onSendReminder && approver.status === 'pending' && (
                                <button
                                  onClick={() => onSendReminder(request.id, approver.id)}
                                  className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                  title="Send Reminder"
                                >
                                  <Bell className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No approval requests found</p>
              </div>
            )}
          </div>
        )}

        {/* Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Approval Thresholds</h3>
              {onCreateThreshold && (
                <button
                  onClick={onCreateThreshold}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>New Threshold</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {thresholds.map((threshold) => (
                <div key={threshold.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{threshold.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{threshold.description}</p>

                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                        <p className="text-xs font-semibold text-blue-900">Condition:</p>
                        <p className="text-sm text-blue-800">
                          When {threshold.condition.type.replace('_', ' ')} {threshold.condition.operator.replace('_', ' ')}{' '}
                          {Array.isArray(threshold.condition.value)
                            ? `${threshold.condition.value[0]} and ${threshold.condition.value[1]}`
                            : threshold.condition.value}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-700">Required Approvers:</span>
                        {threshold.requiredApprovers.map((req, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            {idx > 0 && <ArrowRight className="h-3 w-3 text-gray-400" />}
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                              {req.count}x {getRoleLabel(req.role)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {onEditThreshold && (
                      <button
                        onClick={() => onEditThreshold(threshold.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
