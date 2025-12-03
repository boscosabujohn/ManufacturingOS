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
  Edit,
  Users,
  RefreshCw,
  FolderTree,
  Link2,
  MessageSquare,
  Paperclip,
  Bell,
  Copy,
  FolderInput,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import {
  CreateTaskModal,
  EditTaskModal,
  AssignTaskModal,
  UpdateStatusModal,
  AddSubtasksModal,
  AddDependenciesModal,
  AddCommentsModal,
  UploadAttachmentsModal,
  SetReminderModal,
  CloneTaskModal,
  MoveTaskModal,
  DeleteTaskModal,
  FilterTasksModal,
  BulkUpdateModal,
  ViewDetailsModal,
} from '@/components/project-management/TasksModals';

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

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSubtasksModal, setShowSubtasksModal] = useState(false);
  const [showDependenciesModal, setShowDependenciesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  // Handler functions
  const handleCreateTask = (data: any) => {
    console.log('Create Task:', data);
    setShowCreateModal(false);
  };

  const handleEditTask = (data: any) => {
    console.log('Edit Task:', data);
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const handleAssignTask = (data: any) => {
    console.log('Assign Task:', data);
    setShowAssignModal(false);
    setSelectedTask(null);
  };

  const handleUpdateStatus = (data: any) => {
    console.log('Update Status:', data);
    setShowStatusModal(false);
    setSelectedTask(null);
  };

  const handleAddSubtasks = (data: any) => {
    console.log('Add Subtasks:', data);
    setShowSubtasksModal(false);
    setSelectedTask(null);
  };

  const handleAddDependencies = (data: any) => {
    console.log('Add Dependencies:', data);
    setShowDependenciesModal(false);
    setSelectedTask(null);
  };

  const handleAddComment = (data: any) => {
    console.log('Add Comment:', data);
    setShowCommentsModal(false);
    setSelectedTask(null);
  };

  const handleUploadAttachment = (data: any) => {
    console.log('Upload Attachment:', data);
    setShowAttachmentsModal(false);
    setSelectedTask(null);
  };

  const handleSetReminder = (data: any) => {
    console.log('Set Reminder:', data);
    setShowReminderModal(false);
    setSelectedTask(null);
  };

  const handleCloneTask = (data: any) => {
    console.log('Clone Task:', data);
    setShowCloneModal(false);
    setSelectedTask(null);
  };

  const handleMoveTask = (data: any) => {
    console.log('Move Task:', data);
    setShowMoveModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    console.log('Delete Task:', selectedTask);
    setShowDeleteModal(false);
    setSelectedTask(null);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Apply Filters:', filters);
    setShowFilterModal(false);
  };

  const handleBulkUpdate = (data: any) => {
    console.log('Bulk Update:', data);
    setShowBulkUpdateModal(false);
  };

  // Helper functions to open modals with selected task
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const openAssignModal = (task: Task) => {
    setSelectedTask(task);
    setShowAssignModal(true);
  };

  const openStatusModal = (task: Task) => {
    setSelectedTask(task);
    setShowStatusModal(true);
  };

  const openSubtasksModal = (task: Task) => {
    setSelectedTask(task);
    setShowSubtasksModal(true);
  };

  const openDependenciesModal = (task: Task) => {
    setSelectedTask(task);
    setShowDependenciesModal(true);
  };

  const openCommentsModal = (task: Task) => {
    setSelectedTask(task);
    setShowCommentsModal(true);
  };

  const openAttachmentsModal = (task: Task) => {
    setSelectedTask(task);
    setShowAttachmentsModal(true);
  };

  const openReminderModal = (task: Task) => {
    setSelectedTask(task);
    setShowReminderModal(true);
  };

  const openCloneModal = (task: Task) => {
    setSelectedTask(task);
    setShowCloneModal(true);
  };

  const openMoveModal = (task: Task) => {
    setSelectedTask(task);
    setShowMoveModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  return (
    <div className="container mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Advanced Filters
          </button>
          <button
            onClick={() => setShowBulkUpdateModal(true)}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Bulk Update
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
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
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openAssignModal(task)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Assign Task"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openStatusModal(task)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Update Status"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDetailsModal(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="More Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block z-10">
                        <button onClick={() => openSubtasksModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <FolderTree className="w-4 h-4" /> Subtasks
                        </button>
                        <button onClick={() => openDependenciesModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Link2 className="w-4 h-4" /> Dependencies
                        </button>
                        <button onClick={() => openCommentsModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Comments
                        </button>
                        <button onClick={() => openAttachmentsModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Paperclip className="w-4 h-4" /> Attachments
                        </button>
                        <button onClick={() => openReminderModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Bell className="w-4 h-4" /> Set Reminder
                        </button>
                        <button onClick={() => openCloneModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Copy className="w-4 h-4" /> Clone Task
                        </button>
                        <button onClick={() => openMoveModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <FolderInput className="w-4 h-4" /> Move Task
                        </button>
                        <button onClick={() => openDeleteModal(task)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
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

      {/* All Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onEdit={handleEditTask}
        task={selectedTask}
      />

      <AssignTaskModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedTask(null);
        }}
        onAssign={handleAssignTask}
        task={selectedTask}
      />

      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateStatus}
        task={selectedTask}
      />

      <AddSubtasksModal
        isOpen={showSubtasksModal}
        onClose={() => {
          setShowSubtasksModal(false);
          setSelectedTask(null);
        }}
        onAdd={handleAddSubtasks}
        task={selectedTask}
      />

      <AddDependenciesModal
        isOpen={showDependenciesModal}
        onClose={() => {
          setShowDependenciesModal(false);
          setSelectedTask(null);
        }}
        onAdd={handleAddDependencies}
        task={selectedTask}
      />

      <AddCommentsModal
        isOpen={showCommentsModal}
        onClose={() => {
          setShowCommentsModal(false);
          setSelectedTask(null);
        }}
        onAdd={handleAddComment}
        task={selectedTask}
      />

      <UploadAttachmentsModal
        isOpen={showAttachmentsModal}
        onClose={() => {
          setShowAttachmentsModal(false);
          setSelectedTask(null);
        }}
        onUpload={handleUploadAttachment}
        task={selectedTask}
      />

      <SetReminderModal
        isOpen={showReminderModal}
        onClose={() => {
          setShowReminderModal(false);
          setSelectedTask(null);
        }}
        onSet={handleSetReminder}
        task={selectedTask}
      />

      <CloneTaskModal
        isOpen={showCloneModal}
        onClose={() => {
          setShowCloneModal(false);
          setSelectedTask(null);
        }}
        onClone={handleCloneTask}
        task={selectedTask}
      />

      <MoveTaskModal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setSelectedTask(null);
        }}
        onMove={handleMoveTask}
        task={selectedTask}
      />

      <DeleteTaskModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTask(null);
        }}
        onDelete={handleDeleteTask}
        task={selectedTask}
      />

      <FilterTasksModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
      />

      <BulkUpdateModal
        isOpen={showBulkUpdateModal}
        onClose={() => setShowBulkUpdateModal(false)}
        onUpdate={handleBulkUpdate}
      />

      <ViewDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}
