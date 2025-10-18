'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  CheckSquare,
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Filter,
  Eye,
} from 'lucide-react';

interface Task {
  id: string;
  taskNumber: string;
  taskName: string;
  projectNumber: string;
  projectName: string;
  deliverable: string;
  assignedTo: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed' | 'Blocked';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    taskNumber: 'TSK-001',
    taskName: 'Site Survey and Measurements',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-002',
    assignedTo: 'Ramesh Nair',
    startDate: '2024-01-15',
    dueDate: '2024-01-20',
    completedDate: '2024-01-19',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    estimatedHours: 40,
    actualHours: 38,
    dependencies: [],
  },
  {
    id: '2',
    taskNumber: 'TSK-002',
    taskName: 'Equipment Procurement',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-001',
    assignedTo: 'Procurement Team',
    startDate: '2024-01-20',
    dueDate: '2024-02-10',
    completedDate: '2024-02-08',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    estimatedHours: 80,
    actualHours: 75,
    dependencies: ['TSK-001'],
  },
  {
    id: '3',
    taskNumber: 'TSK-003',
    taskName: 'Install Cooking Range Units',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-003',
    assignedTo: 'Suresh Patel',
    startDate: '2024-03-05',
    dueDate: '2024-03-15',
    status: 'In Progress',
    priority: 'High',
    progress: 70,
    estimatedHours: 120,
    actualHours: 85,
    dependencies: ['TSK-002'],
  },
  {
    id: '4',
    taskNumber: 'TSK-004',
    taskName: 'Exhaust System Installation',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-003',
    assignedTo: 'HVAC Team',
    startDate: '2024-03-10',
    dueDate: '2024-03-20',
    status: 'In Progress',
    priority: 'High',
    progress: 55,
    estimatedHours: 100,
    actualHours: 60,
    dependencies: ['TSK-003'],
  },
  {
    id: '5',
    taskNumber: 'TSK-005',
    taskName: 'Cold Room Panel Assembly',
    projectNumber: 'PRJ-2024-002',
    projectName: 'BigBasket Cold Storage',
    deliverable: 'DEL-004',
    assignedTo: 'Assembly Team',
    startDate: '2024-02-25',
    dueDate: '2024-03-10',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    estimatedHours: 200,
    actualHours: 92,
    dependencies: [],
  },
  {
    id: '6',
    taskNumber: 'TSK-006',
    taskName: 'Refrigeration Unit Testing',
    projectNumber: 'PRJ-2024-002',
    projectName: 'BigBasket Cold Storage',
    deliverable: 'DEL-004',
    assignedTo: 'QC Team',
    startDate: '2024-03-12',
    dueDate: '2024-03-18',
    status: 'To Do',
    priority: 'High',
    progress: 0,
    estimatedHours: 80,
    actualHours: 0,
    dependencies: ['TSK-005'],
  },
  {
    id: '7',
    taskNumber: 'TSK-007',
    taskName: 'Switchgear Panel Wiring',
    projectNumber: 'PRJ-2024-003',
    projectName: 'L&T Switchgear Panel',
    deliverable: 'DEL-007',
    assignedTo: 'Electrical Team',
    startDate: '2024-02-15',
    dueDate: '2024-02-25',
    completedDate: '2024-02-26',
    status: 'Completed',
    priority: 'Medium',
    progress: 100,
    estimatedHours: 160,
    actualHours: 168,
    dependencies: [],
  },
  {
    id: '8',
    taskNumber: 'TSK-008',
    taskName: 'Factory Acceptance Test (FAT)',
    projectNumber: 'PRJ-2024-003',
    projectName: 'L&T Switchgear Panel',
    deliverable: 'DEL-006',
    assignedTo: 'Test Engineer',
    startDate: '2024-03-01',
    dueDate: '2024-03-10',
    status: 'Review',
    priority: 'High',
    progress: 90,
    estimatedHours: 60,
    actualHours: 58,
    dependencies: ['TSK-007'],
  },
  {
    id: '9',
    taskNumber: 'TSK-009',
    taskName: 'Design Drawings Preparation',
    projectNumber: 'PRJ-2024-004',
    projectName: 'ITC Grand Kitchen Renovation',
    deliverable: 'DEL-009',
    assignedTo: 'CAD Team',
    startDate: '2024-03-01',
    dueDate: '2024-03-08',
    status: 'In Progress',
    priority: 'High',
    progress: 80,
    estimatedHours: 60,
    actualHours: 52,
    dependencies: [],
  },
  {
    id: '10',
    taskNumber: 'TSK-010',
    taskName: 'Client Approval Process',
    projectNumber: 'PRJ-2024-004',
    projectName: 'ITC Grand Kitchen Renovation',
    deliverable: 'DEL-009',
    assignedTo: 'Project Manager',
    startDate: '2024-03-09',
    dueDate: '2024-03-15',
    status: 'Blocked',
    priority: 'High',
    progress: 20,
    estimatedHours: 20,
    actualHours: 5,
    dependencies: ['TSK-009'],
  },
];

export default function TasksListPage() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate statistics
  const stats = {
    total: tasks.length,
    toDo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    blocked: tasks.filter(t => t.status === 'Blocked').length,
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Review': return 'bg-purple-100 text-purple-700';
      case 'To Do': return 'bg-gray-100 text-gray-700';
      case 'Blocked': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-orange-100 text-orange-700';
      case 'Low': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Completed') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track all project tasks and activities</p>
        </div>
        <Link
          href="/project-management/tasks/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">To Do</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.toDo}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.blocked}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {paginatedTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Checkbox */}
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        readOnly
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.taskName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {overdue && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Task #</p>
                          <p className="text-sm font-medium text-gray-900">{task.taskNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Project</p>
                          <p className="text-sm font-medium text-gray-900">{task.projectNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deliverable</p>
                          <p className="text-sm font-medium text-blue-600">{task.deliverable}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Assigned To</p>
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">{task.assignedTo}</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-gray-900">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              task.status === 'Completed' ? 'bg-green-600' :
                              task.status === 'Blocked' ? 'bg-red-600' :
                              'bg-blue-600'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Dates and Hours */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Due:</span>
                          <span className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hours:</span>
                          <span className="font-medium text-gray-900 ml-1">
                            {task.actualHours} / {task.estimatedHours}h
                          </span>
                        </div>
                      </div>

                      {/* Dependencies */}
                      {task.dependencies.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Dependencies: </span>
                          <span className="text-xs text-blue-600">{task.dependencies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/project-management/tasks/view/${task.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTasks.length)} of{' '}
            {filteredTasks.length} tasks
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
