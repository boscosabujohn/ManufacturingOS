'use client';

import React, { useState } from 'react';
import {
  Shield,
  User,
  Clock,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Monitor
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'post'
  | 'reverse'
  | 'void'
  | 'export'
  | 'login'
  | 'logout';

export type AuditModule =
  | 'journal_entry'
  | 'invoice'
  | 'payment'
  | 'receipt'
  | 'bank_reconciliation'
  | 'asset'
  | 'budget'
  | 'consolidation'
  | 'system';

export type SeverityLevel = 'info' | 'warning' | 'error' | 'critical';

export interface FieldChange {
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: AuditAction;
  module: AuditModule;
  recordId: string;
  recordType: string;
  description: string;
  changes: FieldChange[];
  ipAddress: string;
  device: string;
  location?: string;
  sessionId: string;
  severity: SeverityLevel;
  success: boolean;
  errorMessage?: string;
}

export interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  uniqueUsers: number;
  failedActions: number;
  criticalEvents: number;
  byAction: Record<AuditAction, number>;
  byModule: Record<AuditModule, number>;
}

export interface AuditTrailData {
  logs: AuditLog[];
  stats: AuditStats;
  dateRange: {
    start: string;
    end: string;
  };
}

// ============================================================================
// PROPS
// ============================================================================

export interface AuditTrailAdvancedProps {
  data?: AuditTrailData;
  onExport?: (format: 'csv' | 'excel' | 'pdf', filters?: any) => void;
  onViewDetails?: (logId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function AuditTrailAdvanced({
  data,
  onExport,
  onViewDetails
}: AuditTrailAdvancedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [moduleFilter, setModuleFilter] = useState<AuditModule | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showOnlyFailures, setShowOnlyFailures] = useState(false);

  // Filter logs
  const filteredLogs =
    data?.logs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recordId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesFailures = !showOnlyFailures || !log.success;

      return matchesSearch && matchesAction && matchesModule && matchesSeverity && matchesFailures;
    }) || [];

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadge = (action: AuditAction) => {
    const styles: Record<AuditAction, string> = {
      create: 'bg-green-100 text-green-700 border-green-200',
      update: 'bg-blue-100 text-blue-700 border-blue-200',
      delete: 'bg-red-100 text-red-700 border-red-200',
      approve: 'bg-purple-100 text-purple-700 border-purple-200',
      reject: 'bg-orange-100 text-orange-700 border-orange-200',
      post: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      reverse: 'bg-pink-100 text-pink-700 border-pink-200',
      void: 'bg-gray-100 text-gray-700 border-gray-200',
      export: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      login: 'bg-teal-100 text-teal-700 border-teal-200',
      logout: 'bg-slate-100 text-slate-700 border-slate-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[action]}`}>
        {action.toUpperCase()}
      </span>
    );
  };

  const getSeverityBadge = (severity: SeverityLevel, success: boolean) => {
    if (!success) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3" />
          FAILED
        </span>
      );
    }

    const styles = {
      info: 'bg-blue-100 text-blue-700 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      error: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200'
    };

    const icons = {
      info: CheckCircle,
      warning: AlertTriangle,
      error: AlertTriangle,
      critical: AlertTriangle
    };

    const Icon = icons[severity];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[severity]}`}>
        <Icon className="w-3 h-3" />
        {severity.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-600" />
            Advanced Audit Trail
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete transaction and user activity history | {data?.dateRange.start} to {data?.dateRange.end}
          </p>
        </div>
        <button
          onClick={() => onExport?.('excel')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Audit Log
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Total Events</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{data?.stats.totalLogs.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase">Today</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{data?.stats.todayLogs}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase">Active Users</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{data?.stats.uniqueUsers}</p>
            </div>
            <User className="w-8 h-8 text-purple-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 uppercase">Failed Actions</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{data?.stats.failedActions}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 uppercase">Critical</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{data?.stats.criticalEvents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search user, description, record ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="approve">Approve</option>
            <option value="post">Post</option>
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Modules</option>
            <option value="journal_entry">Journal Entry</option>
            <option value="invoice">Invoice</option>
            <option value="payment">Payment</option>
            <option value="consolidation">Consolidation</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border border-gray-300 rounded-lg px-4 py-2">
            <input
              type="checkbox"
              checked={showOnlyFailures}
              onChange={(e) => setShowOnlyFailures(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            Failures Only
          </label>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredLogs.length} of {data?.logs.length || 0} audit events
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Record</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP / Location</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 font-mono">{formatTimestamp(log.timestamp)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                      <p className="text-xs text-gray-500">{log.userEmail}</p>
                      <p className="text-xs text-gray-400">{log.userRole}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">{log.module.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-mono text-gray-900">{log.recordId}</p>
                      <p className="text-xs text-gray-500">{log.recordType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 max-w-xs truncate">{log.description}</p>
                    {log.changes.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{log.changes.length} field(s) changed</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="text-gray-900 font-mono">{log.ipAddress}</p>
                      {log.location && <p className="text-gray-500 mt-1">{log.location}</p>}
                      <p className="text-gray-400 mt-1">{log.device}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{getSeverityBadge(log.severity, log.success)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-purple-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Audit Event Details
                </h3>
                <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Timestamp</p>
                  <p className="text-gray-900 font-mono mt-1">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Event ID</p>
                  <p className="text-gray-900 font-mono mt-1">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Action</p>
                  <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <div className="mt-1">{getSeverityBadge(selectedLog.severity, selectedLog.success)}</div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">User Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLog.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLog.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Role</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLog.userRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Session ID</p>
                    <p className="text-sm font-mono text-gray-900">{selectedLog.sessionId}</p>
                  </div>
                </div>
              </div>

              {/* Record Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Record Information</h4>
                <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600">Module</p>
                    <p className="text-sm font-medium text-blue-900 capitalize">{selectedLog.module.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Record Type</p>
                    <p className="text-sm font-medium text-blue-900">{selectedLog.recordType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-blue-600">Record ID</p>
                    <p className="text-sm font-mono font-medium text-blue-900">{selectedLog.recordId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-blue-600">Description</p>
                    <p className="text-sm text-blue-900">{selectedLog.description}</p>
                  </div>
                </div>
              </div>

              {/* Field Changes */}
              {selectedLog.changes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Field Changes</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Field</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Old Value</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">New Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedLog.changes.map((change, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{change.field}</td>
                            <td className="px-4 py-2 text-sm text-red-600 font-mono">
                              {change.oldValue !== null ? String(change.oldValue) : '-'}
                            </td>
                            <td className="px-4 py-2 text-sm text-green-600 font-mono">
                              {change.newValue !== null ? String(change.newValue) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* System Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">System Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">IP Address</p>
                    <p className="text-sm font-mono text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Device</p>
                    <p className="text-sm text-gray-900">{selectedLog.device}</p>
                  </div>
                  {selectedLog.location && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm text-gray-900">{selectedLog.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Details */}
              {!selectedLog.success && selectedLog.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">Error Details</p>
                      <p className="text-sm text-red-700 mt-1">{selectedLog.errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
