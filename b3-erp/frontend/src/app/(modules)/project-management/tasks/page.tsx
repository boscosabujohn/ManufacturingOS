'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  LayoutGrid,
  List as ListIcon,
  ArrowUpRight,
  ChevronDown,
  GripVertical
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
import { projectManagementService, Project, ProjectTask } from '@/services/ProjectManagementService';

// --- RICH MOCK DATA ---
const MOCK_TASKS: Task[] = [
  {
    id: 'TSK-1001',
    taskNumber: 'TSK-1001',
    taskName: 'Structural Framework Design',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-001',
    assignedTo: 'Rahul Verma',
    startDate: '2024-01-15T09:00:00Z',
    dueDate: '2024-02-01T17:00:00Z',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    estimatedHours: 40,
    actualHours: 42,
    dependencies: [],
    avatar: 'RV'
  },
  {
    id: 'TSK-1002',
    taskNumber: 'TSK-1002',
    taskName: 'Gas Pipeline Routing',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-002',
    assignedTo: 'Vikram Singh',
    startDate: '2024-02-02T09:00:00Z',
    dueDate: '2024-02-10T17:00:00Z',
    status: 'In Progress',
    priority: 'Critical',
    progress: 65,
    estimatedHours: 24,
    actualHours: 18,
    dependencies: ['TSK-1001'],
    avatar: 'VS'
  },
  {
    id: 'TSK-1003',
    taskNumber: 'TSK-1003',
    taskName: 'Equipment Procurement',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-003',
    assignedTo: 'Priya Sharma',
    startDate: '2024-01-20T09:00:00Z',
    dueDate: '2024-02-15T17:00:00Z',
    status: 'Blocked',
    priority: 'High',
    progress: 30,
    estimatedHours: 16,
    actualHours: 12,
    dependencies: [],
    avatar: 'PS'
  },
  {
    id: 'TSK-1004',
    taskNumber: 'TSK-1004',
    taskName: 'Electrical Load Calculation',
    projectNumber: 'PRJ-2024-002',
    projectName: 'BigBasket Cold Storage',
    deliverable: 'DEL-101',
    assignedTo: 'Amit Kumar',
    startDate: '2024-02-05T09:00:00Z',
    dueDate: '2024-02-12T17:00:00Z',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    estimatedHours: 12,
    actualHours: 0,
    dependencies: [],
    avatar: 'AK'
  },
  {
    id: 'TSK-1005',
    taskNumber: 'TSK-1005',
    taskName: 'Safety Review Meeting',
    projectNumber: 'PRJ-2024-002',
    projectName: 'BigBasket Cold Storage',
    deliverable: 'DEL-102',
    assignedTo: 'Sneha Gupta',
    startDate: '2024-02-10T10:00:00Z',
    dueDate: '2024-02-10T11:00:00Z',
    status: 'To Do',
    priority: 'Low',
    progress: 0,
    estimatedHours: 1,
    actualHours: 0,
    dependencies: [],
    avatar: 'SG'
  },
  {
    id: 'TSK-1006',
    taskNumber: 'TSK-1006',
    taskName: 'Final Inspection',
    projectNumber: 'PRJ-2024-001',
    projectName: 'Taj Hotel Commercial Kitchen',
    deliverable: 'DEL-999',
    assignedTo: 'Management',
    startDate: '2024-02-28T09:00:00Z',
    dueDate: '2024-02-28T17:00:00Z',
    status: 'Review',
    priority: 'Critical',
    progress: 0,
    estimatedHours: 8,
    actualHours: 0,
    dependencies: ['TSK-1002', 'TSK-1003'],
    avatar: 'MG'
  }
];

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
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  progress: number;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  avatar?: string; // Initials
}

type ViewMode = 'list' | 'board';
type GroupBy = 'status' | 'priority' | 'assignee';

export default function TasksListPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Hydration fix & Initial Load
  useEffect(() => {
    // Immediate mock data load
    setTasks(MOCK_TASKS);
    setProjects([
      { id: 'all', name: 'All Projects', clientName: '', status: '', priority: '', progress: 0, budgetAllocated: 0, budgetSpent: 0 },
      { id: 'PRJ-2024-001', name: 'Taj Hotel Commercial Kitchen', clientName: '', status: '', priority: '', progress: 0, budgetAllocated: 0, budgetSpent: 0 },
      { id: 'PRJ-2024-002', name: 'BigBasket Cold Storage', clientName: '', status: '', priority: '', progress: 0, budgetAllocated: 0, budgetSpent: 0 },
    ]);
    setLoading(false);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesProject = selectedProjectId === 'all' || task.projectNumber === selectedProjectId;
      const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesProject && matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, selectedProjectId, searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Review': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'To Do': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Blocked': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Status & Priority</th>
              <th className="px-6 py-4">Assignee</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.taskName}</span>
                      <span className="text-xs text-gray-500">{task.taskNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">
                        {task.avatar}
                      </div>
                      <span className="text-sm text-gray-700">{task.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 truncate max-w-[150px]" title={task.projectName}>{task.projectName}</span>
                      <span className="text-xs text-gray-500">{task.projectNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <p>No tasks found matching your filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderKanbanColumn = (status: string, title: string, colorClass: string) => {
    const columnTasks = filteredTasks.filter(t => t.status === status);

    return (
      <div className="flex flex-col min-w-[320px] bg-gray-50 rounded-xl p-4 border border-gray-200 h-[calc(100vh-280px)]">
        <div className={`flex items-center justify-between mb-4 pb-3 border-b border-gray-200 ${colorClass}`}>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {title}
            <span className="bg-white px-2 py-0.5 rounded-md text-xs border border-gray-200 shadow-sm">
              {columnTasks.length}
            </span>
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {columnTasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-medium text-gray-900 mb-1 leading-snug">{task.taskName}</h4>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.projectName}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-100">
                    {task.avatar}
                  </div>
                  <span className="text-xs text-gray-600 truncate max-w-[80px]">{task.assignedTo.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            </div>
          ))}

          {columnTasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-4">
              <p className="text-xs">No tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBoardView = () => (
    <div className="flex gap-3 overflow-x-auto pb-6">
      {renderKanbanColumn('To Do', 'To Do', 'text-gray-700')}
      {renderKanbanColumn('In Progress', 'In Progress', 'text-blue-700')}
      {renderKanbanColumn('Review', 'Review', 'text-purple-700')}
      {renderKanbanColumn('Blocked', 'Blocked', 'text-rose-700')}
      {renderKanbanColumn('Completed', 'Done', 'text-emerald-700')}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading Tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
              <p className="text-sm text-gray-500 mt-1">Track, manage, and deliver deliverables across all projects.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {/* View Toggle */}
              <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Board View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-300 mx-1" />

              {/* Project Filter */}
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id || 'all'}>{p.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-2 overflow-hidden">
        {viewMode === 'list' ? renderListView() : renderBoardView()}
      </div>

      {/* Modals Support - Keeping just the create for now as logic remains same */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data: { taskName: string; projectId: string; assignedTo: string; startDate: string; dueDate: string; priority: string; status: string; description: string }) => {
          console.log('Create:', data);
          setShowCreateModal(false);
        }}
      />

    </div>
  );
}

