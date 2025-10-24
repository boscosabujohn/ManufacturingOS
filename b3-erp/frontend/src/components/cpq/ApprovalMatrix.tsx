'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Users,
  DollarSign,
  Percent,
  TrendingDown,
  FileText,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Zap,
  Shield,
  Award,
  RefreshCw,
  Send,
  Edit,
  Trash2,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired';
export type ApproverRole = 'sales_rep' | 'sales_manager' | 'director' | 'vp_sales' | 'cfo' | 'ceo';

export interface ApprovalThreshold {
  id: string;
  name: string;
  description: string;
  condition: {
    type: 'deal_value' | 'discount_percent' | 'margin_percent' | 'custom_field';
    operator: 'greater_than' | 'less_than' | 'equals' | 'between';
    value: number | [number, number];
  };
  requiredApprovers: {
    role: ApproverRole;
    count: number;
  }[];
  autoEscalateAfterHours?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Approver {
  id: string;
  name: string;
  role: ApproverRole;
  email: string;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  respondedAt?: string;
  comments?: string;
}

export interface ApprovalRequest {
  id: string;
  quoteId: string;
  quoteName: string;
  customerName: string;
  dealValue: number;
  discountPercent: number;
  marginPercent: number;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  approvers: Approver[];
  threshold: ApprovalThreshold;
  expiresAt?: string;
  escalatedAt?: string;
  escalatedTo?: string;
  currentApprovalLevel: number;
  totalApprovalLevels: number;
  justification: string;
  attachments?: string[];
}

export interface ApprovalMatrixProps {
  thresholds: ApprovalThreshold[];
  approvalRequests: ApprovalRequest[];
  currentUserRole?: ApproverRole;
  onCreateThreshold?: () => void;
  onEditThreshold?: (thresholdId: string) => void;
  onDeleteThreshold?: (thresholdId: string) => void;
  onApprove?: (requestId: string, comments?: string) => void;
  onReject?: (requestId: string, comments: string) => void;
  onEscalate?: (requestId: string) => void;
  onViewRequest?: (requestId: string) => void;
  className?: string;
}

export const ApprovalMatrix: React.FC<ApprovalMatrixProps> = ({
  thresholds,
  approvalRequests,
  currentUserRole,
  onCreateThreshold,
  onEditThreshold,
  onDeleteThreshold,
  onApprove,
  onReject,
  onEscalate,
  onViewRequest,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'thresholds'>('requests');
  const [filter, setFilter] = useState<string>('all');
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const getRoleLabel = (role: ApproverRole): string => {
    const labels: Record<ApproverRole, string> = {
      sales_rep: 'Sales Rep',
      sales_manager: 'Sales Manager',
      director: 'Director',
      vp_sales: 'VP Sales',
      cfo: 'CFO',
      ceo: 'CEO',
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
      case 'expired':
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Expired' };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'CRITICAL' };
      case 'high':
        return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'HIGH' };
      case 'medium':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'MEDIUM' };
      case 'low':
        return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'LOW' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'NORMAL' };
    }
  };

  const filteredRequests = approvalRequests.filter((request) => {
    if (filter === 'all') return true;
    if (filter === 'my-approvals' && currentUserRole) {
      return request.approvers.some((a) => a.role === currentUserRole && a.status === 'pending');
    }
    return request.status === filter;
  });

  const stats = {
    total: approvalRequests.length,
    pending: approvalRequests.filter((r) => r.status === 'pending').length,
    approved: approvalRequests.filter((r) => r.status === 'approved').length,
    rejected: approvalRequests.filter((r) => r.status === 'rejected').length,
    myPending: currentUserRole
      ? approvalRequests.filter((r) => r.approvers.some((a) => a.role === currentUserRole && a.status === 'pending'))
          .length
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

  const handleApprove = (requestId: string) => {
    if (comment) {
      onApprove?.(requestId, comment);
      setComment('');
      setCommentingOn(null);
    } else {
      onApprove?.(requestId);
    }
  };

  const handleReject = (requestId: string) => {
    if (comment) {
      onReject?.(requestId, comment);
      setComment('');
      setCommentingOn(null);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Bar */}
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
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approval Requests ({approvalRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'thresholds'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
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
              {['all', 'my-approvals', 'pending', 'approved', 'rejected', 'escalated'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'my-approvals'
                    ? 'My Approvals'
                    : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const priorityConfig = getPriorityConfig(request.threshold.priority);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedRequests.has(request.id);
                const canApprove =
                  currentUserRole && request.approvers.some((a) => a.role === currentUserRole && a.status === 'pending');

                return (
                  <div
                    key={request.id}
                    className="bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    {/* Request Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{request.quoteName}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                            >
                              {statusConfig.label}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.bg} ${priorityConfig.color}`}
                            >
                              {priorityConfig.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              {request.customerName}
                            </div>
                            <div className="flex items-center text-sm font-semibold text-green-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${request.dealValue.toLocaleString()}
                            </div>
                            <div className="flex items-center text-sm font-semibold text-red-600">
                              <Percent className="h-4 w-4 mr-2" />
                              {request.discountPercent}% Discount
                            </div>
                          </div>

                          {/* Approval Progress */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-gray-500">Approval Progress:</span>
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

                          <p className="text-sm text-gray-600">
                            Requested by {request.requestedBy} on {new Date(request.requestedAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {canApprove && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <ThumbsUp className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setCommentingOn(request.id)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <ThumbsDown className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          {onEscalate && request.status === 'pending' && (
                            <button
                              onClick={() => onEscalate(request.id)}
                              className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                              title="Escalate"
                            >
                              <AlertCircle className="h-5 w-5" />
                            </button>
                          )}
                          {onViewRequest && (
                            <button
                              onClick={() => onViewRequest(request.id)}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpanded(request.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Comment Input for Rejection */}
                      {commentingOn === request.id && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-semibold text-red-900 mb-2">
                            Rejection Reason (Required)
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                            rows={3}
                            placeholder="Please provide a reason for rejection..."
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleReject(request.id)}
                              disabled={!comment.trim()}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => {
                                setCommentingOn(null);
                                setComment('');
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
                        <div className="grid grid-cols-2 gap-6">
                          {/* Justification */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Justification</h4>
                            <p className="text-sm text-gray-700">{request.justification}</p>
                          </div>

                          {/* Approver Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Approver Timeline</h4>
                            <div className="space-y-2">
                              {request.approvers.map((approver) => (
                                <div key={approver.id} className="flex items-start space-x-3">
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
                                      <p className="text-xs text-gray-500 mt-1">
                                        {new Date(approver.respondedAt).toLocaleString()}
                                      </p>
                                    )}
                                    {approver.comments && (
                                      <p className="text-xs text-gray-700 mt-1 italic">"{approver.comments}"</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
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
              <h3 className="text-lg font-bold text-gray-900">Approval Thresholds & Rules</h3>
              {onCreateThreshold && (
                <button
                  onClick={onCreateThreshold}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Threshold</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {thresholds.map((threshold) => {
                const priorityConfig = getPriorityConfig(threshold.priority);

                return (
                  <div
                    key={threshold.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{threshold.name}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.bg} ${priorityConfig.color}`}
                          >
                            {priorityConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{threshold.description}</p>

                        {/* Condition */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Trigger Condition:</p>
                          <p className="text-sm text-blue-800">
                            When {threshold.condition.type.replace('_', ' ')}{' '}
                            {threshold.condition.operator.replace('_', ' ')}{' '}
                            {Array.isArray(threshold.condition.value)
                              ? `${threshold.condition.value[0]} and ${threshold.condition.value[1]}`
                              : threshold.condition.value}
                            {threshold.condition.type.includes('percent') && '%'}
                            {threshold.condition.type === 'deal_value' && ' USD'}
                          </p>
                        </div>

                        {/* Required Approvers */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-gray-700">Required Approvers:</span>
                          {threshold.requiredApprovers.map((req, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              {idx > 0 && <ArrowRight className="h-3 w-3 text-gray-400" />}
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                {req.count}x {getRoleLabel(req.role)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {threshold.autoEscalateAfterHours && (
                          <p className="text-xs text-orange-600 mt-2">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            Auto-escalates after {threshold.autoEscalateAfterHours} hours
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {onEditThreshold && (
                          <button
                            onClick={() => onEditThreshold(threshold.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {onDeleteThreshold && (
                          <button
                            onClick={() => onDeleteThreshold(threshold.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {thresholds.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No approval thresholds configured</p>
                {onCreateThreshold && (
                  <button
                    onClick={onCreateThreshold}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Threshold
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
