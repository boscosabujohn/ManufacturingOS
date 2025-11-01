'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  PlayCircle
} from 'lucide-react';

interface PreventiveMaintenance {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  taskType: 'inspection' | 'lubrication' | 'calibration' | 'replacement' | 'cleaning';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastCompleted: string;
  nextDue: string;
  estimatedDuration: number; // in hours
  assignedTo: string;
  status: 'scheduled' | 'overdue' | 'in-progress' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  checklistItems: number;
  completedItems: number;
}

export default function PreventiveMaintenancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const maintenanceTasks: PreventiveMaintenance[] = [
    {
      id: 'PM-001',
      equipmentCode: 'CNC-CUT-01',
      equipmentName: 'CNC Cutting Machine #1',
      taskType: 'inspection',
      frequency: 'weekly',
      lastCompleted: '2025-10-13',
      nextDue: '2025-10-20',
      estimatedDuration: 2,
      assignedTo: 'Sunil Technician',
      status: 'scheduled',
      priority: 'high',
      checklistItems: 15,
      completedItems: 0
    },
    {
      id: 'PM-002',
      equipmentCode: 'WELD-ST-01',
      equipmentName: 'TIG Welding Station #1',
      taskType: 'calibration',
      frequency: 'monthly',
      lastCompleted: '2025-09-15',
      nextDue: '2025-10-15',
      estimatedDuration: 4,
      assignedTo: 'Ramesh Technician',
      status: 'overdue',
      priority: 'critical',
      checklistItems: 12,
      completedItems: 0
    },
    {
      id: 'PM-003',
      equipmentCode: 'POLISH-01',
      equipmentName: 'Polishing Machine #1',
      taskType: 'lubrication',
      frequency: 'weekly',
      lastCompleted: '2025-10-18',
      nextDue: '2025-10-25',
      estimatedDuration: 1.5,
      assignedTo: 'Maintenance Team A',
      status: 'scheduled',
      priority: 'medium',
      checklistItems: 8,
      completedItems: 0
    },
    {
      id: 'PM-004',
      equipmentCode: 'PAINT-BOOTH-01',
      equipmentName: 'Powder Coating Booth #1',
      taskType: 'cleaning',
      frequency: 'daily',
      lastCompleted: '2025-10-19',
      nextDue: '2025-10-20',
      estimatedDuration: 1,
      assignedTo: 'Cleaning Crew',
      status: 'in-progress',
      priority: 'medium',
      checklistItems: 6,
      completedItems: 4
    },
    {
      id: 'PM-005',
      equipmentCode: 'PRESS-HYDRO-01',
      equipmentName: 'Hydraulic Press Machine',
      taskType: 'replacement',
      frequency: 'quarterly',
      lastCompleted: '2025-07-15',
      nextDue: '2025-10-15',
      estimatedDuration: 6,
      assignedTo: 'Senior Tech Team',
      status: 'overdue',
      priority: 'high',
      checklistItems: 20,
      completedItems: 0
    },
    {
      id: 'PM-006',
      equipmentCode: 'LASER-CUT-02',
      equipmentName: 'Laser Cutting Machine #2',
      taskType: 'inspection',
      frequency: 'weekly',
      lastCompleted: '2025-10-15',
      nextDue: '2025-10-22',
      estimatedDuration: 2.5,
      assignedTo: 'Sunil Technician',
      status: 'scheduled',
      priority: 'high',
      checklistItems: 18,
      completedItems: 0
    },
    {
      id: 'PM-007',
      equipmentCode: 'ASSY-LINE-01',
      equipmentName: 'Assembly Conveyor Line #1',
      taskType: 'lubrication',
      frequency: 'monthly',
      lastCompleted: '2025-09-20',
      nextDue: '2025-10-20',
      estimatedDuration: 3,
      assignedTo: 'Maintenance Team B',
      status: 'scheduled',
      priority: 'critical',
      checklistItems: 14,
      completedItems: 0
    },
    {
      id: 'PM-008',
      equipmentCode: 'FORK-LIFT-03',
      equipmentName: 'Forklift #3',
      taskType: 'inspection',
      frequency: 'monthly',
      lastCompleted: '2025-09-25',
      nextDue: '2025-10-25',
      estimatedDuration: 1.5,
      assignedTo: 'Fleet Technician',
      status: 'scheduled',
      priority: 'low',
      checklistItems: 10,
      completedItems: 0
    }
  ];

  const filteredTasks = maintenanceTasks.filter(task => {
    const matchesSearch =
      task.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesFrequency = filterFrequency === 'all' || task.frequency === filterFrequency;

    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const totalTasks = maintenanceTasks.length;
  const scheduled = maintenanceTasks.filter(t => t.status === 'scheduled').length;
  const overdue = maintenanceTasks.filter(t => t.status === 'overdue').length;
  const inProgress = maintenanceTasks.filter(t => t.status === 'in-progress').length;
  const completed = maintenanceTasks.filter(t => t.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return '🔍';
      case 'lubrication': return '🛢️';
      case 'calibration': return '⚙️';
      case 'replacement': return '🔧';
      case 'cleaning': return '🧹';
      default: return '🔧';
    }
  };

  const handleStartTask = (task: PreventiveMaintenance) => {
    if (confirm(`Start preventive maintenance task ${task.id} for ${task.equipmentName}?`)) {
      alert(`Task ${task.id} started! Progress tracking enabled.`);
    }
  };

  const handleEditTask = (task: PreventiveMaintenance) => {
    alert(`Edit task ${task.id} - Feature coming soon!`);
  };

  const handleDeleteTask = (task: PreventiveMaintenance) => {
    if (confirm(`Delete preventive maintenance task ${task.id}?`)) {
      alert(`Task ${task.id} deleted successfully!`);
    }
  };

  const handleExport = () => {
    alert('Exporting preventive maintenance schedule to Excel...');
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preventive Maintenance Schedule</h1>
            <p className="text-sm text-gray-500 mt-1">Manage scheduled maintenance tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{scheduled}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{inProgress}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by equipment or task ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="overdue">Overdue</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Done</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{task.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.equipmentCode}</div>
                    <div className="text-sm text-gray-500">{task.equipmentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {getTaskTypeIcon(task.taskType)} {task.taskType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{task.frequency}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{task.lastCompleted}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{task.nextDue}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{task.estimatedDuration}h</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{task.assignedTo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(task.completedItems / task.checklistItems) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {task.completedItems}/{task.checklistItems}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {task.status === 'scheduled' && (
                        <button
                          onClick={() => handleStartTask(task)}
                          className="text-green-600 hover:text-green-900"
                          title="Start Task"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Task"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Preventive Maintenance Schedule</h2>
            <p className="text-gray-600 mb-4">Form fields will be added here...</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('New preventive maintenance schedule created!');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
