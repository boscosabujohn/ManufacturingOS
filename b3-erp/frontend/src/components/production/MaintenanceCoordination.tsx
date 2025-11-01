'use client';

import React, { useState } from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Download, RefreshCw, Settings, Eye, Play, CheckSquare, Plus } from 'lucide-react';

export type MaintenanceType = 'preventive' | 'corrective' | 'predictive';
export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed' | 'overdue';

export interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const MaintenanceCoordination: React.FC = () => {
  const tasks: MaintenanceTask[] = [
    {
      id: 'MT001',
      machineId: 'M001',
      machineName: 'CNC Mill #1',
      type: 'preventive',
      status: 'scheduled',
      title: 'Monthly Lubrication & Inspection',
      scheduledDate: '2025-10-25',
      technician: 'Tom Wilson',
      estimatedDuration: 120,
      priority: 'medium',
    },
    {
      id: 'MT002',
      machineId: 'M004',
      machineName: 'Grinder #1',
      type: 'corrective',
      status: 'in-progress',
      title: 'Grinding Wheel Replacement',
      scheduledDate: '2025-10-24',
      technician: 'Sarah Martinez',
      estimatedDuration: 180,
      priority: 'high',
    },
    {
      id: 'MT003',
      machineId: 'M002',
      machineName: 'CNC Lathe #2',
      type: 'predictive',
      status: 'scheduled',
      title: 'Bearing Replacement (Vibration Alert)',
      scheduledDate: '2025-10-26',
      technician: 'Mike Chen',
      estimatedDuration: 240,
      priority: 'high',
    },
    {
      id: 'MT004',
      machineId: 'M003',
      machineName: 'Press #1',
      type: 'preventive',
      status: 'overdue',
      title: 'Hydraulic System Check',
      scheduledDate: '2025-10-22',
      technician: 'Tom Wilson',
      estimatedDuration: 90,
      priority: 'critical',
    },
  ];

  const getStatusColor = (status: MaintenanceStatus): string => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: MaintenanceType): string => {
    switch (type) {
      case 'preventive': return 'bg-green-100 text-green-800';
      case 'corrective': return 'bg-orange-100 text-orange-800';
      case 'predictive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Handler functions
  const handleRefresh = () => {
    alert('Refreshing maintenance schedule...\n\nAll tasks and status will be updated.');
  };

  const handleSettings = () => {
    alert('Maintenance Settings\n\nConfigure:\n- Maintenance schedules\n- Technician assignments\n- Alert rules\n- Task templates');
  };

  const handleExport = () => {
    alert('Exporting Maintenance Report...\n\nIncludes:\n- All maintenance tasks\n- Schedules and assignments\n- Status and priorities\n- Overdue items');
  };

  const handleNewTask = () => {
    alert('Create New Maintenance Task\n\nSelect:\n- Machine/Equipment\n- Task type (Preventive/Corrective/Predictive)\n- Priority and schedule\n- Assign technician');
  };

  const handleViewTask = (task: MaintenanceTask) => {
    alert(`Maintenance Task Details\n\nTask: ${task.title}\nMachine: ${task.machineName}\nType: ${task.type}\nStatus: ${task.status}\nPriority: ${task.priority}\n\nScheduled: ${task.scheduledDate}\nTechnician: ${task.technician}\nDuration: ${task.estimatedDuration} min`);
  };

  const handleStartTask = (task: MaintenanceTask) => {
    if (task.status === 'in-progress') {
      alert(`Task ${task.id} is already in progress.`);
      return;
    }
    if (confirm(`Start maintenance task?\n\n${task.title}\nMachine: ${task.machineName}\nTechnician: ${task.technician}`)) {
      alert(`Task ${task.id} started!\n\nTechnician ${task.technician} has been notified.\nMachine ${task.machineName} marked as under maintenance.`);
    }
  };

  const handleCompleteTask = (task: MaintenanceTask) => {
    if (task.status !== 'in-progress') {
      alert(`Task ${task.id} must be in progress to complete.`);
      return;
    }
    if (confirm(`Mark task as completed?\n\n${task.title}\nMachine: ${task.machineName}\n\nThis will return the machine to service.`)) {
      alert(`Task ${task.id} completed!\n\nMachine ${task.machineName} returned to production.\nMaintenance log updated.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wrench className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Maintenance Coordination</h2>
              <p className="text-yellow-100">Preventive, corrective, and predictive maintenance scheduling</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleNewTask} className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
            <button onClick={handleRefresh} className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button onClick={handleSettings} className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['scheduled', 'in-progress', 'overdue', 'completed'] as MaintenanceStatus[]).map((status) => (
          <div key={status} className={`bg-white p-4 rounded-lg shadow border-l-4 ${status === 'overdue' ? 'border-red-500' : status === 'in-progress' ? 'border-yellow-500' : status === 'completed' ? 'border-green-500' : 'border-blue-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
                <p className={`text-2xl font-bold ${status === 'overdue' ? 'text-red-600' : status === 'in-progress' ? 'text-yellow-600' : status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                  {tasks.filter(t => t.status === status).length}
                </p>
              </div>
              {status === 'overdue' ? <AlertTriangle className="h-8 w-8 text-red-500" /> : status === 'completed' ? <CheckCircle className="h-8 w-8 text-green-500" /> : <Wrench className={`h-8 w-8 ${status === 'in-progress' ? 'text-yellow-500' : 'text-blue-500'}`} />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.machineName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {task.scheduledDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.technician}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.estimatedDuration} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button onClick={() => handleViewTask(task)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      {task.status === 'scheduled' || task.status === 'overdue' ? (
                        <button onClick={() => handleStartTask(task)} className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Start Task">
                          <Play className="h-4 w-4" />
                          <span>Start</span>
                        </button>
                      ) : task.status === 'in-progress' ? (
                        <button onClick={() => handleCompleteTask(task)} className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors" title="Complete Task">
                          <CheckSquare className="h-4 w-4" />
                          <span>Complete</span>
                        </button>
                      ) : null}
                    </div>
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

export default MaintenanceCoordination;
