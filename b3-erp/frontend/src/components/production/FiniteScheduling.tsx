'use client';

import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Layers, Zap, Download, RefreshCw, BarChart3, Settings, Play, Pause } from 'lucide-react';

export type ScheduleStatus = 'scheduled' | 'in-progress' | 'completed' | 'delayed' | 'blocked';
export type ConstraintType = 'resource' | 'material' | 'tooling' | 'labor' | 'sequence';
export type PriorityLevel = 'critical' | 'high' | 'normal' | 'low';

export interface ScheduledJob {
  id: string;
  jobNumber: string;
  productName: string;
  workCenter: string;
  status: ScheduleStatus;
  priority: PriorityLevel;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  duration: number;
  setupTime: number;
  quantity: number;
  completedQty: number;
  constraints: ConstraintType[];
  utilizationPercent: number;
}

export interface WorkCenter {
  id: string;
  name: string;
  type: string;
  capacity: number;
  currentLoad: number;
  utilization: number;
  activeJobs: number;
  scheduledJobs: number;
  efficiency: number;
  availability: number;
}

export interface ScheduleConstraint {
  id: string;
  type: ConstraintType;
  description: string;
  impactedJobs: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution?: string;
}

const FiniteScheduling: React.FC = () => {
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<string | null>(null);

  // Mock data - Scheduled jobs
  const jobs: ScheduledJob[] = [
    {
      id: 'JOB001',
      jobNumber: 'WO-2025-1234',
      productName: 'Precision Gear Assembly',
      workCenter: 'CNC-01',
      status: 'in-progress',
      priority: 'high',
      scheduledStart: '2025-10-24 08:00',
      scheduledEnd: '2025-10-24 14:30',
      actualStart: '2025-10-24 08:15',
      duration: 390,
      setupTime: 45,
      quantity: 500,
      completedQty: 285,
      constraints: ['tooling'],
      utilizationPercent: 57,
    },
    {
      id: 'JOB002',
      jobNumber: 'WO-2025-1235',
      productName: 'Motor Housing',
      workCenter: 'CNC-02',
      status: 'scheduled',
      priority: 'normal',
      scheduledStart: '2025-10-24 09:00',
      scheduledEnd: '2025-10-24 16:00',
      duration: 420,
      setupTime: 60,
      quantity: 300,
      completedQty: 0,
      constraints: [],
      utilizationPercent: 0,
    },
    {
      id: 'JOB003',
      jobNumber: 'WO-2025-1236',
      productName: 'Valve Body Machining',
      workCenter: 'CNC-01',
      status: 'delayed',
      priority: 'critical',
      scheduledStart: '2025-10-24 07:00',
      scheduledEnd: '2025-10-24 12:00',
      actualStart: '2025-10-24 07:30',
      duration: 300,
      setupTime: 30,
      quantity: 200,
      completedQty: 85,
      constraints: ['material', 'tooling'],
      utilizationPercent: 42.5,
    },
    {
      id: 'JOB004',
      jobNumber: 'WO-2025-1237',
      productName: 'Shaft Turning',
      workCenter: 'LATHE-01',
      status: 'completed',
      priority: 'normal',
      scheduledStart: '2025-10-23 14:00',
      scheduledEnd: '2025-10-23 18:00',
      actualStart: '2025-10-23 14:00',
      actualEnd: '2025-10-23 17:45',
      duration: 240,
      setupTime: 30,
      quantity: 150,
      completedQty: 150,
      constraints: [],
      utilizationPercent: 100,
    },
    {
      id: 'JOB005',
      jobNumber: 'WO-2025-1238',
      productName: 'Bearing Seat Boring',
      workCenter: 'MILL-01',
      status: 'blocked',
      priority: 'high',
      scheduledStart: '2025-10-24 10:00',
      scheduledEnd: '2025-10-24 15:00',
      duration: 300,
      setupTime: 40,
      quantity: 400,
      completedQty: 0,
      constraints: ['resource', 'material', 'sequence'],
      utilizationPercent: 0,
    },
  ];

  // Mock data - Work centers
  const workCenters: WorkCenter[] = [
    {
      id: 'WC001',
      name: 'CNC-01',
      type: 'CNC Machining',
      capacity: 16,
      currentLoad: 12.5,
      utilization: 78,
      activeJobs: 2,
      scheduledJobs: 5,
      efficiency: 92,
      availability: 95,
    },
    {
      id: 'WC002',
      name: 'CNC-02',
      type: 'CNC Machining',
      capacity: 16,
      currentLoad: 8.5,
      utilization: 53,
      activeJobs: 1,
      scheduledJobs: 3,
      efficiency: 88,
      availability: 98,
    },
    {
      id: 'WC003',
      name: 'LATHE-01',
      type: 'Turning Center',
      capacity: 24,
      currentLoad: 18,
      utilization: 75,
      activeJobs: 3,
      scheduledJobs: 6,
      efficiency: 85,
      availability: 92,
    },
    {
      id: 'WC004',
      name: 'MILL-01',
      type: 'Milling Center',
      capacity: 16,
      currentLoad: 14,
      utilization: 87.5,
      activeJobs: 2,
      scheduledJobs: 4,
      efficiency: 90,
      availability: 94,
    },
    {
      id: 'WC005',
      name: 'GRIND-01',
      type: 'Grinding',
      capacity: 8,
      currentLoad: 3,
      utilization: 37.5,
      activeJobs: 1,
      scheduledJobs: 2,
      efficiency: 95,
      availability: 100,
    },
  ];

  // Mock data - Constraints
  const constraints: ScheduleConstraint[] = [
    {
      id: 'CON001',
      type: 'material',
      description: 'Steel raw material delivery delayed by 2 hours',
      impactedJobs: 3,
      severity: 'high',
      resolution: 'Expedite supplier delivery, reschedule affected jobs',
    },
    {
      id: 'CON002',
      type: 'tooling',
      description: 'Carbide insert shortage for CNC operations',
      impactedJobs: 2,
      severity: 'medium',
      resolution: 'Emergency tooling order placed, substitute tooling identified',
    },
    {
      id: 'CON003',
      type: 'resource',
      description: 'Operator shortage due to unplanned absence',
      impactedJobs: 1,
      severity: 'high',
      resolution: 'Cross-trained operator assigned from Assembly',
    },
    {
      id: 'CON004',
      type: 'sequence',
      description: 'Prerequisite heat treatment operation not completed',
      impactedJobs: 1,
      severity: 'critical',
      resolution: 'Expedite heat treatment, adjust downstream schedule',
    },
  ];

  const getStatusColor = (status: ScheduleStatus): string => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: PriorityLevel): string => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getConstraintColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler functions
  const handleReoptimize = () => {
    console.log('Re-optimizing schedule with current constraints...');
    alert('Re-optimizing schedule with current constraints and capacity limits...\n\nOptimization criteria:\n- Minimize makespan\n- Maximize resource utilization\n- Respect constraints and priorities\n- Balance workload across work centers');
  };

  const handleExportSchedule = () => {
    console.log('Exporting finite schedule to Excel...');
    alert('Exporting Finite Schedule Report to Excel...\n\nIncludes:\n- Work center utilization\n- Scheduled jobs timeline\n- Constraint analysis\n- Capacity planning data');
  };

  const handleViewGantt = () => {
    console.log('Opening Gantt chart view...');
    alert('Opening interactive Gantt chart view...\n\nFeatures:\n- Visual timeline of all jobs\n- Drag-and-drop rescheduling\n- Dependency visualization\n- Real-time conflict detection');
  };

  const handleScheduleSettings = () => {
    console.log('Opening schedule settings...');
    alert('Schedule Settings\n\nConfigure:\n- Optimization algorithms\n- Constraint priorities\n- Capacity buffers\n- Scheduling rules and policies');
  };

  const handleStartJob = (job: ScheduledJob) => {
    if (job.status === 'in-progress') {
      alert(`Job ${job.jobNumber} is already in progress.\n\nCurrent progress: ${job.completedQty}/${job.quantity} units (${job.utilizationPercent}%)`);
      return;
    }
    if (job.status === 'completed') {
      alert(`Job ${job.jobNumber} is already completed.`);
      return;
    }
    if (job.constraints.length > 0) {
      if (confirm(`Warning: Job ${job.jobNumber} has active constraints:\n${job.constraints.join(', ')}\n\nDo you want to start this job anyway?`)) {
        console.log('Starting job with constraints:', job);
        alert(`Job ${job.jobNumber} started!\n\nProduct: ${job.productName}\nWork Center: ${job.workCenter}\nQuantity: ${job.quantity} units\n\n⚠️ Monitor constraints closely.`);
      }
    } else {
      if (confirm(`Start job ${job.jobNumber}?\n\nProduct: ${job.productName}\nWork Center: ${job.workCenter}\nQuantity: ${job.quantity} units\nDuration: ${job.duration} min`)) {
        console.log('Starting job:', job);
        alert(`Job ${job.jobNumber} started successfully!\n\nOperators notified.\nReal-time tracking enabled.`);
      }
    }
  };

  const handlePauseJob = (job: ScheduledJob) => {
    if (job.status !== 'in-progress') {
      alert(`Job ${job.jobNumber} is not currently in progress.`);
      return;
    }
    if (confirm(`Pause job ${job.jobNumber}?\n\nCurrent progress: ${job.completedQty}/${job.quantity} units\n\nWork will be temporarily suspended.`)) {
      console.log('Pausing job:', job);
      alert(`Job ${job.jobNumber} paused.\n\nProgress saved: ${job.completedQty} units completed.\nWork center ${job.workCenter} will be available for other jobs.`);
    }
  };

  const handleResolveConstraint = (constraint: ScheduleConstraint) => {
    if (constraint.resolution) {
      if (confirm(`Mark constraint as resolved?\n\nType: ${constraint.type}\nDescription: ${constraint.description}\n\nResolution: ${constraint.resolution}\n\nThis will unblock ${constraint.impactedJobs} job(s).`)) {
        console.log('Resolving constraint:', constraint);
        alert(`Constraint resolved successfully!\n\n${constraint.impactedJobs} job(s) unblocked.\nSchedule will be automatically re-optimized.`);
      }
    } else {
      alert(`Resolve ${constraint.type} constraint:\n\n${constraint.description}\n\nImpacts: ${constraint.impactedJobs} job(s)\nSeverity: ${constraint.severity}\n\nPlease provide resolution details and update the constraint status.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Finite Capacity Scheduling</h2>
              <p className="text-blue-100">Constraint-based planning with real-time optimization</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleReoptimize}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-optimize</span>
            </button>
            <button
              onClick={handleViewGantt}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Gantt View</span>
            </button>
            <button
              onClick={handleScheduleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleExportSchedule}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.filter(j => j.status === 'scheduled' || j.status === 'in-progress').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-green-600">
                {jobs.filter(j => j.status === 'in-progress').length}
              </p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-yellow-600">
                {jobs.filter(j => j.status === 'delayed').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-red-600">
                {jobs.filter(j => j.status === 'blocked').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-purple-600">
                {(workCenters.reduce((sum, wc) => sum + wc.utilization, 0) / workCenters.length).toFixed(0)}%
              </p>
            </div>
            <Layers className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Work Center Capacity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Work Center Capacity & Utilization</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (hrs)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Load</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workCenters.map((wc) => (
                <tr key={wc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{wc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wc.capacity} hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wc.currentLoad} hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            wc.utilization >= 85 ? 'bg-red-500' :
                            wc.utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${wc.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{wc.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wc.activeJobs} / {wc.scheduledJobs}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${wc.efficiency >= 90 ? 'text-green-600' : wc.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {wc.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${wc.availability >= 95 ? 'text-green-600' : wc.availability >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {wc.availability}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Jobs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Production Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Job Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Work Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Constraints</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.jobNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.workCenter}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>{job.scheduledStart}</div>
                    <div className="text-xs">to {job.scheduledEnd}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.duration} min
                    <div className="text-xs text-gray-500">Setup: {job.setupTime} min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${job.utilizationPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{job.completedQty}/{job.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.constraints.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {job.constraints.map((c, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {job.status === 'in-progress' ? (
                        <button
                          onClick={() => handlePauseJob(job)}
                          className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          title="Pause Job"
                        >
                          <Pause className="h-4 w-4" />
                          <span>Pause</span>
                        </button>
                      ) : job.status === 'scheduled' || job.status === 'delayed' || job.status === 'blocked' ? (
                        <button
                          onClick={() => handleStartJob(job)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          title="Start Job"
                        >
                          <Play className="h-4 w-4" />
                          <span>Start</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          Completed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Constraints */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Schedule Constraints</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {constraints.map((constraint) => (
            <div key={constraint.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConstraintColor(constraint.severity)}`}>
                      {constraint.severity}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 uppercase">
                      {constraint.type}
                    </span>
                    <span className="text-sm text-gray-600">
                      Impacts {constraint.impactedJobs} job{constraint.impactedJobs > 1 ? 's' : ''}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{constraint.description}</h4>
                  {constraint.resolution && (
                    <p className="text-sm text-gray-700 p-2 bg-green-50 rounded">
                      <strong>Resolution:</strong> {constraint.resolution}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleResolveConstraint(constraint)}
                  className="ml-4 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Resolve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiniteScheduling;
