'use client'

import { useState } from 'react'
import { AlertTriangle, RotateCcw, Bell, Clock, CheckCircle, XCircle, Settings } from 'lucide-react'

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RecoveryAction = 'retry' | 'skip' | 'fallback' | 'notify' | 'manual';

export interface ErrorRule {
  id: string;
  name: string;
  description: string;
  errorPattern: string;
  severity: ErrorSeverity;
  maxRetries: number;
  retryDelay: number;
  recoveryActions: RecoveryAction[];
  fallbackWorkflow?: string;
  notificationChannels: string[];
  enabled: boolean;
}

export interface ErrorEvent {
  id: string;
  workflowId: string;
  workflowName: string;
  stepName: string;
  timestamp: string;
  errorMessage: string;
  severity: ErrorSeverity;
  retryCount: number;
  recoveryAction: RecoveryAction;
  resolved: boolean;
  resolution?: string;
}

export default function ErrorHandling() {
  const [errorRules] = useState<ErrorRule[]>([
    {
      id: 'ERR-RULE-001',
      name: 'SMTP Connection Failure',
      description: 'Handle email service connection errors with retry logic',
      errorPattern: 'SMTP.*connection.*failed|Email.*timeout',
      severity: 'high',
      maxRetries: 3,
      retryDelay: 5000,
      recoveryActions: ['retry', 'fallback', 'notify'],
      fallbackWorkflow: 'Send via alternative email service',
      notificationChannels: ['slack', 'email'],
      enabled: true
    },
    {
      id: 'ERR-RULE-002',
      name: 'Database Connection Error',
      description: 'Retry database operations with exponential backoff',
      errorPattern: 'Database.*connection.*lost|Connection.*refused.*5432',
      severity: 'critical',
      maxRetries: 5,
      retryDelay: 2000,
      recoveryActions: ['retry', 'notify'],
      notificationChannels: ['slack', 'pagerduty'],
      enabled: true
    },
    {
      id: 'ERR-RULE-003',
      name: 'API Rate Limit Exceeded',
      description: 'Wait and retry when API rate limits are hit',
      errorPattern: 'Rate limit exceeded|429 Too Many Requests',
      severity: 'medium',
      maxRetries: 10,
      retryDelay: 60000,
      recoveryActions: ['retry', 'notify'],
      notificationChannels: ['slack'],
      enabled: true
    },
    {
      id: 'ERR-RULE-004',
      name: 'File Not Found',
      description: 'Skip step when file is missing and notify',
      errorPattern: 'File not found|ENOENT',
      severity: 'medium',
      maxRetries: 1,
      retryDelay: 1000,
      recoveryActions: ['skip', 'notify'],
      notificationChannels: ['email'],
      enabled: true
    },
    {
      id: 'ERR-RULE-005',
      name: 'Authorization Failed',
      description: 'Require manual intervention for auth failures',
      errorPattern: 'Unauthorized|401|403 Forbidden',
      severity: 'high',
      maxRetries: 0,
      retryDelay: 0,
      recoveryActions: ['manual', 'notify'],
      notificationChannels: ['slack', 'email', 'pagerduty'],
      enabled: true
    },
    {
      id: 'ERR-RULE-006',
      name: 'Validation Error',
      description: 'Skip invalid records and continue processing',
      errorPattern: 'Validation.*failed|Invalid.*data',
      severity: 'low',
      maxRetries: 0,
      retryDelay: 0,
      recoveryActions: ['skip', 'notify'],
      notificationChannels: ['email'],
      enabled: true
    }
  ]);

  const [errorEvents] = useState<ErrorEvent[]>([
    {
      id: 'EVT-001',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      stepName: 'Send to Manager',
      timestamp: '2025-01-24 12:05:18',
      errorMessage: 'SMTP connection failed: Connection timeout after 30 seconds',
      severity: 'high',
      retryCount: 3,
      recoveryAction: 'fallback',
      resolved: true,
      resolution: 'Successfully sent via alternative email service'
    },
    {
      id: 'EVT-002',
      workflowId: 'WF-003',
      workflowName: 'Quality Control Routing',
      stepName: 'Database Insert',
      timestamp: '2025-01-24 11:30:45',
      errorMessage: 'Database connection lost: Connection refused on port 5432',
      severity: 'critical',
      retryCount: 5,
      recoveryAction: 'retry',
      resolved: true,
      resolution: 'Connection restored on retry attempt 4'
    },
    {
      id: 'EVT-003',
      workflowId: 'WF-004',
      workflowName: 'Invoice Processing',
      stepName: 'External API Call',
      timestamp: '2025-01-24 10:15:22',
      errorMessage: 'Rate limit exceeded: 429 Too Many Requests',
      severity: 'medium',
      retryCount: 2,
      recoveryAction: 'retry',
      resolved: true,
      resolution: 'Successfully completed after 60 second delay'
    },
    {
      id: 'EVT-004',
      workflowId: 'WF-002',
      workflowName: 'Inventory Reorder Automation',
      stepName: 'Read Supplier File',
      timestamp: '2025-01-24 09:45:10',
      errorMessage: 'File not found: /data/suppliers/SUP-999.json',
      severity: 'medium',
      retryCount: 1,
      recoveryAction: 'skip',
      resolved: true,
      resolution: 'Step skipped, workflow continued with default values'
    },
    {
      id: 'EVT-005',
      workflowId: 'WF-005',
      workflowName: 'Employee Onboarding',
      stepName: 'Create User Account',
      timestamp: '2025-01-24 08:20:00',
      errorMessage: 'Unauthorized: 401 Authentication failed',
      severity: 'high',
      retryCount: 0,
      recoveryAction: 'manual',
      resolved: false,
      resolution: 'Waiting for manual intervention'
    },
    {
      id: 'EVT-006',
      workflowId: 'WF-006',
      workflowName: 'Leave Approval Process',
      stepName: 'Validate Leave Data',
      timestamp: '2025-01-24 07:30:15',
      errorMessage: 'Validation failed: Invalid date range (end date before start date)',
      severity: 'low',
      retryCount: 0,
      recoveryAction: 'skip',
      resolved: true,
      resolution: 'Invalid record skipped, notification sent to user'
    }
  ]);

  const getSeverityColor = (severity: ErrorSeverity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity];
  };

  const getRecoveryActionIcon = (action: RecoveryAction) => {
    switch (action) {
      case 'retry':
        return <RotateCcw className="h-4 w-4" />;
      case 'skip':
        return <CheckCircle className="h-4 w-4" />;
      case 'fallback':
        return <AlertTriangle className="h-4 w-4" />;
      case 'notify':
        return <Bell className="h-4 w-4" />;
      case 'manual':
        return <Settings className="h-4 w-4" />;
    }
  };

  const unresolvedCount = errorEvents.filter(e => !e.resolved).length;

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              Error Handling & Recovery
            </h2>
            <p className="text-gray-600 mt-1">Automated error detection, retry logic, and recovery mechanisms</p>
          </div>
          {unresolvedCount > 0 && (
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
              {unresolvedCount} unresolved errors
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Error Rules */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Error Handling Rules</h3>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add Rule
            </button>
          </div>

          {errorRules.map((rule) => (
            <div key={rule.id} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div className={`p-4 border-l-4 ${rule.severity === 'critical' ? 'border-red-500' : rule.severity === 'high' ? 'border-orange-500' : rule.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                        {rule.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={rule.enabled} readOnly className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="font-medium">Pattern:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono">{rule.errorPattern}</code>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="flex items-center gap-1">
                      <RotateCcw className="h-3 w-3" />
                      <span>Max retries: {rule.maxRetries}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Delay: {rule.retryDelay / 1000}s</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">Recovery Actions:</div>
                    <div className="flex flex-wrap gap-1">
                      {rule.recoveryActions.map((action, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {getRecoveryActionIcon(action)}
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>

                  {rule.fallbackWorkflow && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Fallback:</span> {rule.fallbackWorkflow}
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">Notifications:</div>
                    <div className="flex flex-wrap gap-1">
                      {rule.notificationChannels.map((channel, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                          <Bell className="h-3 w-3" />
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Error Events */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Recent Error Events</h3>

          {errorEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div className={`p-4 border-l-4 ${event.resolved ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {event.resolved ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className="font-semibold text-gray-900">{event.workflowName}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Step: <span className="font-medium">{event.stepName}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-xs font-medium text-red-700 mb-1">ERROR MESSAGE:</div>
                    <div className="text-xs text-red-600">{event.errorMessage}</div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp}</span>
                    </div>
                    {event.retryCount > 0 && (
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        <span>{event.retryCount} retries</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Recovery:</span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {getRecoveryActionIcon(event.recoveryAction)}
                      {event.recoveryAction}
                    </span>
                  </div>

                  {event.resolution && (
                    <div className={`p-2 rounded ${event.resolved ? 'bg-green-50' : 'bg-yellow-50'}`}>
                      <div className={`text-xs font-medium mb-1 ${event.resolved ? 'text-green-700' : 'text-yellow-700'}`}>
                        {event.resolved ? 'RESOLVED:' : 'STATUS:'}
                      </div>
                      <div className={`text-xs ${event.resolved ? 'text-green-600' : 'text-yellow-600'}`}>
                        {event.resolution}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!event.resolved && (
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                  <button className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded text-sm">
                    Retry Now
                  </button>
                  <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded text-sm">
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{errorEvents.length}</div>
          </div>
          <div className="text-sm text-gray-600">Total Errors (24h)</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {errorEvents.filter(e => e.resolved).length}
            </div>
          </div>
          <div className="text-sm text-gray-600">Auto-Resolved</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {errorEvents.reduce((sum, e) => sum + e.retryCount, 0)}
            </div>
          </div>
          <div className="text-sm text-gray-600">Total Retries</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{errorRules.filter(r => r.enabled).length}</div>
          </div>
          <div className="text-sm text-gray-600">Active Rules</div>
        </div>
      </div>
    </div>
  );
}
