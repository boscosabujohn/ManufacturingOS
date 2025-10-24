'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Zap, Activity } from 'lucide-react'

export interface WorkflowKPI {
  workflowId: string;
  workflowName: string;
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  warningCount: number;
  successRate: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  lastExecution: string;
  trend: 'up' | 'down' | 'stable';
}

export interface SystemMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutionsToday: number;
  successRateToday: number;
  averageExecutionTime: number;
  errorRateToday: number;
  peakExecutionTime: string;
}

export default function KPIMonitoring() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalWorkflows: 12,
    activeWorkflows: 8,
    totalExecutionsToday: 247,
    successRateToday: 94.3,
    averageExecutionTime: 5.8,
    errorRateToday: 3.2,
    peakExecutionTime: '14:00 - 15:00'
  });

  const [workflowKPIs] = useState<WorkflowKPI[]>([
    {
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      totalExecutions: 1250,
      successCount: 1189,
      failureCount: 38,
      warningCount: 23,
      successRate: 95.1,
      averageDuration: 7.2,
      minDuration: 3.5,
      maxDuration: 15.8,
      lastExecution: '2025-01-24 14:30:32',
      trend: 'up'
    },
    {
      workflowId: 'WF-002',
      workflowName: 'Inventory Reorder Automation',
      totalExecutions: 890,
      successCount: 856,
      failureCount: 12,
      warningCount: 22,
      successRate: 96.2,
      averageDuration: 8.5,
      minDuration: 5.2,
      maxDuration: 18.3,
      lastExecution: '2025-01-24 13:15:18',
      trend: 'stable'
    },
    {
      workflowId: 'WF-003',
      workflowName: 'Quality Control Routing',
      totalExecutions: 650,
      successCount: 589,
      failureCount: 45,
      warningCount: 16,
      successRate: 90.6,
      averageDuration: 12.3,
      minDuration: 6.8,
      maxDuration: 32.5,
      lastExecution: '2025-01-24 11:45:00',
      trend: 'down'
    },
    {
      workflowId: 'WF-004',
      workflowName: 'Invoice Processing',
      totalExecutions: 2100,
      successCount: 2058,
      failureCount: 28,
      warningCount: 14,
      successRate: 98.0,
      averageDuration: 4.2,
      minDuration: 2.1,
      maxDuration: 9.8,
      lastExecution: '2025-01-24 15:20:45',
      trend: 'up'
    },
    {
      workflowId: 'WF-005',
      workflowName: 'Employee Onboarding',
      totalExecutions: 156,
      successCount: 148,
      failureCount: 5,
      warningCount: 3,
      successRate: 94.9,
      averageDuration: 25.6,
      minDuration: 18.2,
      maxDuration: 45.3,
      lastExecution: '2025-01-23 16:30:00',
      trend: 'stable'
    },
    {
      workflowId: 'WF-006',
      workflowName: 'Leave Approval Process',
      totalExecutions: 980,
      successCount: 945,
      failureCount: 15,
      warningCount: 20,
      successRate: 96.4,
      averageDuration: 3.8,
      minDuration: 1.5,
      maxDuration: 12.5,
      lastExecution: '2025-01-24 10:15:22',
      trend: 'up'
    }
  ]);

  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);

      // Simulate real-time metric updates
      setSystemMetrics(prev => ({
        ...prev,
        totalExecutionsToday: prev.totalExecutionsToday + Math.floor(Math.random() * 3),
        successRateToday: Math.round((prev.successRateToday + (Math.random() - 0.5) * 0.1) * 10) / 10,
        averageExecutionTime: Math.round((prev.averageExecutionTime + (Math.random() - 0.5) * 0.2) * 10) / 10,
        errorRateToday: Math.max(0, Math.round((prev.errorRateToday + (Math.random() - 0.5) * 0.1) * 10) / 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              KPI Monitoring Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Real-time workflow performance metrics and analytics</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
      </div>

      {/* System-wide Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{systemMetrics.totalExecutionsToday}</div>
          <div className="text-sm text-gray-600">Executions Today</div>
          <div className="text-xs text-gray-500 mt-2">
            {systemMetrics.activeWorkflows} of {systemMetrics.totalWorkflows} workflows active
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{systemMetrics.successRateToday}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
          <div className="text-xs text-gray-500 mt-2">
            Above target (90%)
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <Activity className="h-5 w-5 text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{systemMetrics.averageExecutionTime}s</div>
          <div className="text-sm text-gray-600">Avg Execution Time</div>
          <div className="text-xs text-gray-500 mt-2">
            Peak: {systemMetrics.peakExecutionTime}
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <TrendingDown className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{systemMetrics.errorRateToday}%</div>
          <div className="text-sm text-gray-600">Error Rate</div>
          <div className="text-xs text-gray-500 mt-2">
            Below threshold (5%)
          </div>
        </div>
      </div>

      {/* Workflow Performance Table */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Performance</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed metrics for each workflow</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Workflow Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Executions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Avg Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Last Execution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflowKPIs.map((kpi) => (
                <tr key={kpi.workflowId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{kpi.workflowName}</div>
                    <div className="text-xs text-gray-500">{kpi.workflowId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{kpi.totalExecutions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {kpi.failureCount} failures • {kpi.warningCount} warnings
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-2xl font-bold ${getSuccessRateColor(kpi.successRate)}`}>
                      {kpi.successRate}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          kpi.successRate >= 95 ? 'bg-green-600' : kpi.successRate >= 90 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${kpi.successRate}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{kpi.averageDuration}s</div>
                    <div className="text-xs text-gray-500">
                      {kpi.minDuration}s - {kpi.maxDuration}s
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-gray-700">{kpi.successCount} success</span>
                      </div>
                      {kpi.failureCount > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <XCircle className="h-3 w-3 text-red-600" />
                          <span className="text-gray-700">{kpi.failureCount} failed</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {kpi.lastExecution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.trend)}
                      <span className="text-sm text-gray-700 capitalize">{kpi.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Distribution</h3>
          <div className="space-y-4">
            {workflowKPIs.slice(0, 5).map((kpi) => (
              <div key={kpi.workflowId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{kpi.workflowName}</span>
                  <span className={`text-sm font-medium ${getSuccessRateColor(kpi.successRate)}`}>
                    {kpi.successRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      kpi.successRate >= 95 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      kpi.successRate >= 90 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${kpi.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Time Comparison</h3>
          <div className="space-y-4">
            {workflowKPIs.slice(0, 5).map((kpi) => (
              <div key={kpi.workflowId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{kpi.workflowName}</span>
                  <span className="text-sm font-medium text-gray-900">{kpi.averageDuration}s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                    style={{ width: `${Math.min((kpi.averageDuration / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
