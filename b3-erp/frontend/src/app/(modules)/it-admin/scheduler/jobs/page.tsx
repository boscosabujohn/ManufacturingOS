'use client';

import { useState } from 'react';
import { Clock, Play, Pause, Calendar, AlertCircle, CheckCircle2, XCircle, RefreshCw, Plus, Edit, Trash2, Eye, Filter, Download } from 'lucide-react';

interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  type: string;
  schedule: string;
  cronExpression: string;
  status: string;
  lastRun?: string;
  lastRunStatus?: string;
  nextRun: string;
  duration?: string;
  successRate: number;
  totalRuns: number;
  failedRuns: number;
  enabled: boolean;
  priority: string;
  createdBy: string;
  createdAt: string;
}

interface JobStats {
  totalJobs: number;
  activeJobs: number;
  pausedJobs: number;
  completedToday: number;
  failedToday: number;
  scheduledNext: number;
}

const SchedulerJobsPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);

  const [jobs, setJobs] = useState<ScheduledJob[]>([
    {
      id: '1',
      name: 'Database Backup',
      description: 'Full database backup to remote storage',
      type: 'Backup',
      schedule: 'Every day at 2:00 AM',
      cronExpression: '0 2 * * *',
      status: 'Active',
      lastRun: '2025-10-21 02:00:00',
      lastRunStatus: 'Success',
      nextRun: '2025-10-22 02:00:00',
      duration: '45 minutes',
      successRate: 98.5,
      totalRuns: 365,
      failedRuns: 5,
      enabled: true,
      priority: 'Critical',
      createdBy: 'Admin',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Daily Sales Report',
      description: 'Generate and email daily sales summary report',
      type: 'Report',
      schedule: 'Every day at 8:00 AM',
      cronExpression: '0 8 * * *',
      status: 'Active',
      lastRun: '2025-10-21 08:00:00',
      lastRunStatus: 'Success',
      nextRun: '2025-10-22 08:00:00',
      duration: '12 minutes',
      successRate: 99.2,
      totalRuns: 298,
      failedRuns: 2,
      enabled: true,
      priority: 'High',
      createdBy: 'Rajesh Kumar',
      createdAt: '2024-02-15',
    },
    {
      id: '3',
      name: 'Cleanup Temp Files',
      description: 'Remove temporary files older than 7 days',
      type: 'Cleanup',
      schedule: 'Every Sunday at 3:00 AM',
      cronExpression: '0 3 * * 0',
      status: 'Active',
      lastRun: '2025-10-20 03:00:00',
      lastRunStatus: 'Success',
      nextRun: '2025-10-27 03:00:00',
      duration: '8 minutes',
      successRate: 100,
      totalRuns: 52,
      failedRuns: 0,
      enabled: true,
      priority: 'Medium',
      createdBy: 'System',
      createdAt: '2024-01-01',
    },
    {
      id: '4',
      name: 'Inventory Sync',
      description: 'Synchronize inventory with external system',
      type: 'Data Sync',
      schedule: 'Every 4 hours',
      cronExpression: '0 */4 * * *',
      status: 'Active',
      lastRun: '2025-10-21 16:00:00',
      lastRunStatus: 'Failed',
      nextRun: '2025-10-21 20:00:00',
      duration: '23 minutes',
      successRate: 94.5,
      totalRuns: 1800,
      failedRuns: 99,
      enabled: true,
      priority: 'High',
      createdBy: 'Sneha Reddy',
      createdAt: '2024-03-01',
    },
    {
      id: '5',
      name: 'Email Newsletter',
      description: 'Send weekly newsletter to subscribers',
      type: 'Email Campaign',
      schedule: 'Every Friday at 10:00 AM',
      cronExpression: '0 10 * * 5',
      status: 'Paused',
      lastRun: '2025-10-18 10:00:00',
      lastRunStatus: 'Success',
      nextRun: '2025-10-25 10:00:00',
      duration: '35 minutes',
      successRate: 97.8,
      totalRuns: 45,
      failedRuns: 1,
      enabled: false,
      priority: 'Low',
      createdBy: 'Priya Sharma',
      createdAt: '2024-06-01',
    },
    {
      id: '6',
      name: 'Data Archive',
      description: 'Archive old transaction records to cold storage',
      type: 'Archive',
      schedule: 'First day of every month at 1:00 AM',
      cronExpression: '0 1 1 * *',
      status: 'Active',
      lastRun: '2025-10-01 01:00:00',
      lastRunStatus: 'Success',
      nextRun: '2025-11-01 01:00:00',
      duration: '2 hours 15 minutes',
      successRate: 100,
      totalRuns: 10,
      failedRuns: 0,
      enabled: true,
      priority: 'Medium',
      createdBy: 'Admin',
      createdAt: '2024-01-01',
    },
    {
      id: '7',
      name: 'System Health Check',
      description: 'Monitor system resources and send alerts',
      type: 'Monitoring',
      schedule: 'Every 15 minutes',
      cronExpression: '*/15 * * * *',
      status: 'Active',
      lastRun: '2025-10-21 18:15:00',
      lastRunStatus: 'Success',
      nextRun: '2025-10-21 18:30:00',
      duration: '2 minutes',
      successRate: 99.8,
      totalRuns: 35000,
      failedRuns: 70,
      enabled: true,
      priority: 'Critical',
      createdBy: 'System',
      createdAt: '2024-01-01',
    },
    {
      id: '8',
      name: 'Customer Feedback Digest',
      description: 'Compile and send customer feedback summary',
      type: 'Report',
      schedule: 'Every Monday at 9:00 AM',
      cronExpression: '0 9 * * 1',
      status: 'Active',
      lastRun: '2025-10-21 09:00:00',
      lastRunStatus: 'Success',
      nextRun: '2025-10-28 09:00:00',
      duration: '18 minutes',
      successRate: 98.0,
      totalRuns: 42,
      failedRuns: 1,
      enabled: true,
      priority: 'Medium',
      createdBy: 'Vikram Singh',
      createdAt: '2024-04-15',
    },
  ]);

  const stats: JobStats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.enabled && j.status === 'Active').length,
    pausedJobs: jobs.filter(j => !j.enabled || j.status === 'Paused').length,
    completedToday: jobs.filter(j => j.lastRunStatus === 'Success').length,
    failedToday: jobs.filter(j => j.lastRunStatus === 'Failed').length,
    scheduledNext: jobs.filter(j => j.enabled).length,
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && job.enabled) ||
                         (filterStatus === 'paused' && !job.enabled);
    const matchesType = filterType === 'all' || job.type === filterType;
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getLastRunStatusColor = (status?: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLastRunStatusIcon = (status?: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600';
      case 'High':
        return 'text-orange-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleRunNow = (jobId: string) => {
    alert(`Running job ${jobId} immediately...`);
  };

  const handleToggleStatus = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, enabled: !job.enabled, status: !job.enabled ? 'Active' : 'Paused' } : job
    ));
  };

  const handleViewDetails = (job: ScheduledJob) => {
    setSelectedJob(job);
  };

  const handleCloseDetails = () => {
    setSelectedJob(null);
  };

  const handleExport = () => {
    alert('Exporting scheduled jobs...');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scheduled Jobs</h1>
              <p className="text-gray-600">Manage automated tasks and scheduled processes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Job
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Jobs</span>
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalJobs}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Paused</span>
            <Pause className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-600">{stats.pausedJobs}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Failed</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.failedToday}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Scheduled</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.scheduledNext}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Backup">Backup</option>
            <option value="Report">Report</option>
            <option value="Cleanup">Cleanup</option>
            <option value="Data Sync">Data Sync</option>
            <option value="Email Campaign">Email Campaign</option>
            <option value="Archive">Archive</option>
            <option value="Monitoring">Monitoring</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Job Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Schedule</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Last Run</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Next Run</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Success Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-gray-900 ${getPriorityColor(job.priority)}`}>
                          {job.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{job.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-sm text-gray-900">{job.schedule}</div>
                      <code className="text-xs text-gray-500">{job.cronExpression}</code>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {job.lastRun ? (
                      <div>
                        <div className="text-sm text-gray-900">{job.lastRun}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {getLastRunStatusIcon(job.lastRunStatus)}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLastRunStatusColor(job.lastRunStatus)}`}>
                            {job.lastRunStatus}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Never run</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {job.nextRun}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              job.successRate >= 95 ? 'bg-green-500' : 
                              job.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${job.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{job.successRate}%</span>
                      </div>
                      <div className="text-xs text-gray-500">{job.totalRuns} runs, {job.failedRuns} failed</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRunNow(job.id)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Run Now"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(job.id)}
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title={job.enabled ? "Pause" : "Resume"}
                      >
                        {job.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 p-1" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700 p-1" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No scheduled jobs found</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Job Details</h3>
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
                  <div className="bg-gray-50 rounded-lg p-3 font-semibold text-gray-900">{selectedJob.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedJob.type}
                  </span>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.description}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Schedule</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.schedule}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cron Expression</label>
                  <code className="block bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.cronExpression}</code>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedJob.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    selectedJob.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    selectedJob.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedJob.priority}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Run</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.lastRun || 'Never'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Run Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLastRunStatusColor(selectedJob.lastRunStatus)}`}>
                    {selectedJob.lastRunStatus || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Next Run</label>
                  <div className="bg-blue-50 rounded-lg p-3 text-gray-900">{selectedJob.nextRun}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Average Duration</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.duration || 'N/A'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Success Rate</label>
                  <div className="bg-green-50 rounded-lg p-3 font-bold text-green-800">{selectedJob.successRate}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Total Runs</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.totalRuns}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Failed Runs</label>
                  <div className="bg-red-50 rounded-lg p-3 font-bold text-red-800">{selectedJob.failedRuns}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created By</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.createdBy}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedJob.createdAt}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleRunNow(selectedJob.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Run Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulerJobsPage;
