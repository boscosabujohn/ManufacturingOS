'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, ChevronRight, Filter } from 'lucide-react'

export type ExecutionStatus = 'running' | 'success' | 'failed' | 'warning' | 'cancelled';

export interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: ExecutionStatus;
  triggeredBy: string;
  steps: ExecutionStep[];
  errorCount: number;
  warningCount: number;
}

export interface ExecutionStep {
  id: string;
  stepName: string;
  nodeType: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: ExecutionStatus;
  input?: any;
  output?: any;
  error?: string;
  retryCount?: number;
}

export default function ExecutionLogs() {
  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: 'EXEC-001',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      startTime: '2025-01-24 14:30:25',
      endTime: '2025-01-24 14:30:32',
      duration: 7.2,
      status: 'success',
      triggeredBy: 'po.created event',
      errorCount: 0,
      warningCount: 0,
      steps: [
        {
          id: 'S1',
          stepName: 'PO Created Trigger',
          nodeType: 'trigger',
          startTime: '2025-01-24 14:30:25',
          endTime: '2025-01-24 14:30:25',
          duration: 0.1,
          status: 'success',
          input: { poNumber: 'PO-12345', amount: 150000 },
          output: { triggered: true }
        },
        {
          id: 'S2',
          stepName: 'Amount > ₹1L?',
          nodeType: 'condition',
          startTime: '2025-01-24 14:30:25',
          endTime: '2025-01-24 14:30:26',
          duration: 0.5,
          status: 'success',
          input: { amount: 150000, threshold: 100000 },
          output: { result: true, branch: 'true' }
        },
        {
          id: 'S3',
          stepName: 'Send to Manager',
          nodeType: 'action',
          startTime: '2025-01-24 14:30:26',
          endTime: '2025-01-24 14:30:29',
          duration: 3.2,
          status: 'success',
          input: { approver: 'manager@company.com', poNumber: 'PO-12345' },
          output: { emailSent: true, notificationId: 'NOTIF-789' }
        },
        {
          id: 'S4',
          stepName: 'Approved?',
          nodeType: 'condition',
          startTime: '2025-01-24 14:30:29',
          endTime: '2025-01-24 14:30:30',
          duration: 0.8,
          status: 'success',
          input: { approvalStatus: 'approved' },
          output: { result: true, branch: 'approved' }
        },
        {
          id: 'S5',
          stepName: 'Create PO',
          nodeType: 'action',
          startTime: '2025-01-24 14:30:30',
          endTime: '2025-01-24 14:30:32',
          duration: 2.6,
          status: 'success',
          input: { poData: { /* ... */ } },
          output: { poCreated: true, poId: 'PO-12345' }
        }
      ]
    },
    {
      id: 'EXEC-002',
      workflowId: 'WF-002',
      workflowName: 'Inventory Reorder Automation',
      startTime: '2025-01-24 13:15:10',
      endTime: '2025-01-24 13:15:18',
      duration: 8.5,
      status: 'warning',
      triggeredBy: 'stock.low event',
      errorCount: 0,
      warningCount: 1,
      steps: [
        {
          id: 'S6',
          stepName: 'Stock Level Check',
          nodeType: 'trigger',
          startTime: '2025-01-24 13:15:10',
          endTime: '2025-01-24 13:15:11',
          duration: 0.3,
          status: 'success',
          input: { itemSku: 'RAW-001', stockLevel: 15 },
          output: { triggered: true }
        },
        {
          id: 'S7',
          stepName: 'Critical Stock?',
          nodeType: 'condition',
          startTime: '2025-01-24 13:15:11',
          endTime: '2025-01-24 13:15:11',
          duration: 0.2,
          status: 'success',
          input: { stockLevel: 15, reorderPoint: 50 },
          output: { result: true, urgency: 'high' }
        },
        {
          id: 'S8',
          stepName: 'Create Urgent PO',
          nodeType: 'action',
          startTime: '2025-01-24 13:15:11',
          endTime: '2025-01-24 13:15:15',
          duration: 4.2,
          status: 'success',
          input: { supplier: 'SUP-001', quantity: 500 },
          output: { poCreated: true, poId: 'PO-12347' }
        },
        {
          id: 'S9',
          stepName: 'Notify Procurement',
          nodeType: 'action',
          startTime: '2025-01-24 13:15:15',
          endTime: '2025-01-24 13:15:18',
          duration: 3.8,
          status: 'warning',
          input: { team: 'procurement@company.com' },
          output: { emailSent: true },
          error: 'Email sent but one recipient bounced'
        }
      ]
    },
    {
      id: 'EXEC-003',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      startTime: '2025-01-24 12:05:15',
      endTime: '2025-01-24 12:05:20',
      duration: 5.3,
      status: 'failed',
      triggeredBy: 'po.created event',
      errorCount: 1,
      warningCount: 0,
      steps: [
        {
          id: 'S10',
          stepName: 'PO Created Trigger',
          nodeType: 'trigger',
          startTime: '2025-01-24 12:05:15',
          endTime: '2025-01-24 12:05:15',
          duration: 0.1,
          status: 'success',
          input: { poNumber: 'PO-12348' },
          output: { triggered: true }
        },
        {
          id: 'S11',
          stepName: 'Amount > ₹1L?',
          nodeType: 'condition',
          startTime: '2025-01-24 12:05:15',
          endTime: '2025-01-24 12:05:16',
          duration: 0.4,
          status: 'success',
          input: { amount: 250000 },
          output: { result: true }
        },
        {
          id: 'S12',
          stepName: 'Send to Manager',
          nodeType: 'action',
          startTime: '2025-01-24 12:05:16',
          endTime: '2025-01-24 12:05:20',
          duration: 4.8,
          status: 'failed',
          input: { approver: 'invalid-email' },
          error: 'SMTP Error: Invalid recipient email address',
          retryCount: 3
        }
      ]
    },
    {
      id: 'EXEC-004',
      workflowId: 'WF-003',
      workflowName: 'Quality Control Routing',
      startTime: '2025-01-24 11:45:00',
      status: 'running',
      triggeredBy: 'goods.received event',
      errorCount: 0,
      warningCount: 0,
      steps: [
        {
          id: 'S13',
          stepName: 'Goods Received Trigger',
          nodeType: 'trigger',
          startTime: '2025-01-24 11:45:00',
          endTime: '2025-01-24 11:45:00',
          duration: 0.1,
          status: 'success',
          input: { grn: 'GRN-5678' },
          output: { triggered: true }
        },
        {
          id: 'S14',
          stepName: 'Supplier Check',
          nodeType: 'condition',
          startTime: '2025-01-24 11:45:00',
          endTime: '2025-01-24 11:45:01',
          duration: 0.3,
          status: 'success',
          input: { supplierId: 'SUP-999', tenure: 2 },
          output: { newSupplier: true }
        },
        {
          id: 'S15',
          stepName: 'Route to Full QC',
          nodeType: 'action',
          startTime: '2025-01-24 11:45:01',
          duration: 0,
          status: 'running',
          input: { grn: 'GRN-5678', qcType: 'full' }
        }
      ]
    }
  ]);

  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | 'all'>('all');
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);
      // Update running logs
      setLogs(prev => prev.map(log => {
        if (log.status === 'running') {
          const runningStep = log.steps.find(s => s.status === 'running');
          if (runningStep) {
            runningStep.duration = Math.round((Date.now() - new Date(runningStep.startTime).getTime()) / 100) / 10;
          }
        }
        return log;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ExecutionStatus) => {
    const colors = {
      running: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-gray-100 text-gray-700'
    };
    return colors[status];
  };

  const filteredLogs = logs.filter(log => statusFilter === 'all' || log.status === statusFilter);

  const statusCounts = {
    all: logs.length,
    running: logs.filter(l => l.status === 'running').length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    warning: logs.filter(l => l.status === 'warning').length,
    cancelled: logs.filter(l => l.status === 'cancelled').length
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Execution Logs & Monitoring
            </h2>
            <p className="text-gray-600 mt-1">Real-time workflow execution tracking</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'running', 'success', 'failed', 'warning'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const isExpanded = expandedLogs.has(log.id);
          return (
            <div key={log.id} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-colors"
                onClick={() => toggleExpand(log.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-600" /> : <ChevronRight className="h-5 w-5 text-gray-600" />}
                    {getStatusIcon(log.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{log.workflowName}</h3>
                      <p className="text-sm text-gray-600">
                        {log.startTime}
                        {log.duration && ` • ${log.duration}s`}
                        {log.status === 'running' && ' • In Progress'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {log.errorCount > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        {log.errorCount} errors
                      </span>
                    )}
                    {log.warningCount > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        {log.warningCount} warnings
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(log.status)}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 bg-gray-50">
                  <div className="space-y-3">
                    {log.steps.map((step, idx) => (
                      <div key={step.id} className="p-3 bg-white border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <span className="font-medium text-gray-900">{step.stepName}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{step.nodeType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {step.retryCount && step.retryCount > 0 && (
                              <span className="text-xs text-orange-600">
                                {step.retryCount} retries
                              </span>
                            )}
                            <span className="text-sm text-gray-600">{step.duration}s</span>
                          </div>
                        </div>

                        {step.input && (
                          <div className="mb-2">
                            <div className="text-xs font-medium text-gray-700 mb-1">INPUT:</div>
                            <div className="bg-blue-50 p-2 rounded text-xs font-mono text-gray-800 max-h-20 overflow-auto">
                              {JSON.stringify(step.input, null, 2)}
                            </div>
                          </div>
                        )}

                        {step.output && (
                          <div className="mb-2">
                            <div className="text-xs font-medium text-gray-700 mb-1">OUTPUT:</div>
                            <div className="bg-green-50 p-2 rounded text-xs font-mono text-gray-800 max-h-20 overflow-auto">
                              {JSON.stringify(step.output, null, 2)}
                            </div>
                          </div>
                        )}

                        {step.error && (
                          <div className="bg-red-50 p-2 rounded">
                            <div className="text-xs font-medium text-red-700 mb-1">ERROR:</div>
                            <div className="text-xs text-red-600">{step.error}</div>
                          </div>
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

      {filteredLogs.length === 0 && (
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No execution logs found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
