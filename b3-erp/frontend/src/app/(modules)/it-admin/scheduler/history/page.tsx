'use client';

import { useState } from 'react';
import { History, CheckCircle2, XCircle, AlertTriangle, Clock, Calendar, Filter, Download, Eye, Search, TrendingUp, BarChart3 } from 'lucide-react';

interface ExecutionHistory {
  id: string;
  jobId: string;
  jobName: string;
  jobType: string;
  executionTime: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  result?: string;
  errorMessage?: string;
  triggeredBy: string;
  recordsProcessed?: number;
  outputFile?: string;
}

interface HistoryStats {
  totalExecutions: number;
  successful: number;
  failed: number;
  warnings: number;
  averageDuration: string;
  longestDuration: string;
}

const SchedulerHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExecution, setSelectedExecution] = useState<ExecutionHistory | null>(null);

  const [history] = useState<ExecutionHistory[]>([
    {
      id: '1',
      jobId: 'JOB-001',
      jobName: 'Database Backup',
      jobType: 'Backup',
      executionTime: '2025-10-21 02:00:00',
      startTime: '2025-10-21 02:00:00',
      endTime: '2025-10-21 02:45:23',
      duration: '45m 23s',
      status: 'Success',
      result: 'Backup completed successfully. All tables backed up.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 1250000,
      outputFile: '/backups/db_backup_20251021_020000.sql.gz',
    },
    {
      id: '2',
      jobId: 'JOB-002',
      jobName: 'Daily Sales Report',
      jobType: 'Report',
      executionTime: '2025-10-21 08:00:00',
      startTime: '2025-10-21 08:00:00',
      endTime: '2025-10-21 08:12:45',
      duration: '12m 45s',
      status: 'Success',
      result: 'Report generated and emailed to 15 recipients.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 8450,
      outputFile: '/reports/sales_daily_20251021.pdf',
    },
    {
      id: '3',
      jobId: 'JOB-004',
      jobName: 'Inventory Sync',
      jobType: 'Data Sync',
      executionTime: '2025-10-21 16:00:00',
      startTime: '2025-10-21 16:00:00',
      endTime: '2025-10-21 16:23:12',
      duration: '23m 12s',
      status: 'Failed',
      result: 'Sync failed due to API timeout.',
      errorMessage: 'Connection timeout: External API did not respond within 30 seconds. Retry count exceeded (3/3).',
      triggeredBy: 'Scheduler',
      recordsProcessed: 0,
    },
    {
      id: '4',
      jobId: 'JOB-007',
      jobName: 'System Health Check',
      jobType: 'Monitoring',
      executionTime: '2025-10-21 18:15:00',
      startTime: '2025-10-21 18:15:00',
      endTime: '2025-10-21 18:17:08',
      duration: '2m 8s',
      status: 'Success',
      result: 'All systems healthy. No alerts triggered.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 156,
    },
    {
      id: '5',
      jobId: 'JOB-008',
      jobName: 'Customer Feedback Digest',
      jobType: 'Report',
      executionTime: '2025-10-21 09:00:00',
      startTime: '2025-10-21 09:00:00',
      endTime: '2025-10-21 09:18:34',
      duration: '18m 34s',
      status: 'Success',
      result: 'Feedback digest compiled from 234 responses.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 234,
      outputFile: '/reports/feedback_digest_20251021.pdf',
    },
    {
      id: '6',
      jobId: 'JOB-003',
      jobName: 'Cleanup Temp Files',
      jobType: 'Cleanup',
      executionTime: '2025-10-20 03:00:00',
      startTime: '2025-10-20 03:00:00',
      endTime: '2025-10-20 03:08:15',
      duration: '8m 15s',
      status: 'Success',
      result: 'Cleaned up 4.2 GB of temporary files older than 7 days.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 8456,
    },
    {
      id: '7',
      jobId: 'JOB-001',
      jobName: 'Database Backup',
      jobType: 'Backup',
      executionTime: '2025-10-20 02:00:00',
      startTime: '2025-10-20 02:00:00',
      endTime: '2025-10-20 02:43:56',
      duration: '43m 56s',
      status: 'Success',
      result: 'Backup completed successfully. All tables backed up.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 1248000,
      outputFile: '/backups/db_backup_20251020_020000.sql.gz',
    },
    {
      id: '8',
      jobId: 'JOB-002',
      jobName: 'Daily Sales Report',
      jobType: 'Report',
      executionTime: '2025-10-20 08:00:00',
      startTime: '2025-10-20 08:00:00',
      endTime: '2025-10-20 08:11:23',
      duration: '11m 23s',
      status: 'Warning',
      result: 'Report generated but email delivery failed for 2 recipients.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 7890,
      outputFile: '/reports/sales_daily_20251020.pdf',
    },
    {
      id: '9',
      jobId: 'JOB-004',
      jobName: 'Inventory Sync',
      jobType: 'Data Sync',
      executionTime: '2025-10-21 12:00:00',
      startTime: '2025-10-21 12:00:00',
      endTime: '2025-10-21 12:22:45',
      duration: '22m 45s',
      status: 'Success',
      result: 'Synchronized 5,678 inventory records successfully.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 5678,
    },
    {
      id: '10',
      jobId: 'JOB-007',
      jobName: 'System Health Check',
      jobType: 'Monitoring',
      executionTime: '2025-10-21 18:00:00',
      startTime: '2025-10-21 18:00:00',
      endTime: '2025-10-21 18:02:15',
      duration: '2m 15s',
      status: 'Success',
      result: 'All systems healthy. No alerts triggered.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 156,
    },
    {
      id: '11',
      jobId: 'JOB-006',
      jobName: 'Data Archive',
      jobType: 'Archive',
      executionTime: '2025-10-01 01:00:00',
      startTime: '2025-10-01 01:00:00',
      endTime: '2025-10-01 03:15:42',
      duration: '2h 15m 42s',
      status: 'Success',
      result: 'Archived 340,000 old transaction records to cold storage.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 340000,
      outputFile: '/archives/transactions_202409.tar.gz',
    },
    {
      id: '12',
      jobId: 'JOB-004',
      jobName: 'Inventory Sync',
      jobType: 'Data Sync',
      executionTime: '2025-10-21 08:00:00',
      startTime: '2025-10-21 08:00:00',
      endTime: '2025-10-21 08:21:34',
      duration: '21m 34s',
      status: 'Success',
      result: 'Synchronized 5,234 inventory records successfully.',
      triggeredBy: 'Scheduler',
      recordsProcessed: 5234,
    },
  ]);

  const stats: HistoryStats = {
    totalExecutions: history.length,
    successful: history.filter(h => h.status === 'Success').length,
    failed: history.filter(h => h.status === 'Failed').length,
    warnings: history.filter(h => h.status === 'Warning').length,
    averageDuration: '18m 32s',
    longestDuration: '2h 15m 42s',
  };

  const filteredHistory = history.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.jobType === filterType;
    const matchesSearch = item.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.jobId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Running':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleViewDetails = (execution: ExecutionHistory) => {
    setSelectedExecution(execution);
  };

  const handleCloseDetails = () => {
    setSelectedExecution(null);
  };

  const handleExport = () => {
    alert('Exporting execution history...');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <History className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Execution History</h1>
              <p className="text-gray-600">View past job executions and performance metrics</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export History
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total</span>
            <History className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalExecutions}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Successful</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Failed</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Warnings</span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Duration</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.averageDuration}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Longest</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.longestDuration}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Warning">Warning</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Backup">Backup</option>
            <option value="Report">Report</option>
            <option value="Cleanup">Cleanup</option>
            <option value="Data Sync">Data Sync</option>
            <option value="Archive">Archive</option>
            <option value="Monitoring">Monitoring</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Job</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Execution Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Records</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Triggered By</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{item.jobName}</div>
                      <code className="text-xs text-gray-500">{item.jobId}</code>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.jobType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {item.executionTime}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{item.duration}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900">
                      {item.recordsProcessed !== undefined ? item.recordsProcessed.toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{item.triggeredBy}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="text-indigo-600 hover:text-indigo-700 p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No execution history found</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Execution Details</h3>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Job Name</label>
                  <div className="bg-gray-50 rounded-lg p-3 font-semibold text-gray-900">{selectedExecution.jobName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Job ID</label>
                  <code className="block bg-gray-50 rounded-lg p-3 text-sm text-gray-900">{selectedExecution.jobId}</code>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Job Type</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedExecution.jobType}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedExecution.status)}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedExecution.status)}`}>
                      {selectedExecution.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Execution Time</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedExecution.executionTime}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                  <div className="bg-blue-50 rounded-lg p-3 font-bold text-blue-800">{selectedExecution.duration}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedExecution.startTime}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedExecution.endTime}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Triggered By</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedExecution.triggeredBy}</div>
                </div>

                {selectedExecution.recordsProcessed !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Records Processed</label>
                    <div className="bg-green-50 rounded-lg p-3 font-bold text-green-800">
                      {selectedExecution.recordsProcessed.toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Result</label>
                  <div className={`rounded-lg p-3 ${
                    selectedExecution.status === 'Success' ? 'bg-green-50 border border-green-200 text-gray-900' :
                    selectedExecution.status === 'Failed' ? 'bg-red-50 border border-red-200 text-gray-900' :
                    'bg-yellow-50 border border-yellow-200 text-gray-900'
                  }`}>
                    {selectedExecution.result}
                  </div>
                </div>

                {selectedExecution.errorMessage && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Error Message</label>
                    <pre className="bg-red-900 text-red-100 rounded-lg p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                      {selectedExecution.errorMessage}
                    </pre>
                  </div>
                )}

                {selectedExecution.outputFile && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Output File</label>
                    <code className="block bg-gray-900 text-green-400 rounded-lg p-3 text-sm break-all">
                      {selectedExecution.outputFile}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulerHistoryPage;
