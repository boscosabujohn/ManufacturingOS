'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  User,
  Users,
  Calendar,
  Flag,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Paperclip,
  Tag,
} from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  relatedTo?: {
    type: 'lead' | 'opportunity' | 'account' | 'contact';
    id: string;
    name: string;
  };
  tags?: string[];
  comments?: number;
  attachments?: number;
}

export interface TaskBoardProps {
  tasks: Task[];
  currentUser?: { id: string; name: string };
  onAddTask?: () => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onViewTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onAssignTask?: (taskId: string, userId: string) => void;
  showFilters?: boolean;
  viewMode?: 'board' | 'list';
  className?: string;
}

const TaskCard: React.FC<{
  task: Task;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onView?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}> = ({ task, onEdit, onDelete, onView, onStatusChange }) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { color: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle };
      case 'high':
        return { color: 'bg-orange-100 text-orange-700 border-orange-300', icon: Flag };
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Flag };
      case 'low':
        return { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Flag };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Flag };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const PriorityIcon = priorityConfig.icon;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <button
            onClick={() =>
              onStatusChange &&
              onStatusChange(
                task.id,
                task.status === 'completed' ? 'todo' : 'completed'
              )
            }
            className="mt-0.5"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-600 fill-current" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold text-gray-900 mb-1 ${
                task.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
              {onView && (
                <button
                  onClick={() => onView(task.id)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(task.id)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Priority & Related */}
      <div className="flex items-center space-x-2 mb-3">
        <span
          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityConfig.color}`}
        >
          <PriorityIcon className="h-3 w-3" />
          <span>{task.priority}</span>
        </span>
        {task.relatedTo && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
            {task.relatedTo.type}: {task.relatedTo.name}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Assignee */}
          {task.assignedTo ? (
            <div className="flex items-center space-x-1.5">
              {task.assignedTo.avatar ? (
                <img
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {task.assignedTo.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              )}
              <span className="text-xs text-gray-600">{task.assignedTo.name}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <User className="h-4 w-4" />
              <span>Unassigned</span>
            </div>
          )}

          {/* Comments & Attachments */}
          {(task.comments || task.attachments) && (
            <div className="flex items-center space-x-2">
              {task.comments && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{task.comments}</span>
                </div>
              )}
              {task.attachments && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>{task.attachments}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  currentUser,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onStatusChange,
  onAssignTask,
  showFilters = true,
  viewMode: initialViewMode = 'board',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState(initialViewMode);

  const columns: { status: Task['status']; label: string; color: string }[] = [
    { status: 'todo', label: 'To Do', color: 'bg-gray-100' },
    { status: 'in_progress', label: 'In Progress', color: 'bg-blue-100' },
    { status: 'review', label: 'Review', color: 'bg-purple-100' },
    { status: 'completed', label: 'Completed', color: 'bg-green-100' },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    const matchesAssignee =
      assigneeFilter === 'all' ||
      (assigneeFilter === 'unassigned' && !task.assignedTo) ||
      task.assignedTo?.id === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    review: tasks.filter((t) => t.status === 'review').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date()).length,
  };

  return (
    <div className={className}>
      {/* Stats Bar */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">To Do</p>
          <p className="text-2xl font-bold">{stats.todo}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">In Progress</p>
          <p className="text-2xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Review</p>
          <p className="text-2xl font-bold">{stats.review}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Overdue</p>
          <p className="text-2xl font-bold">{stats.overdue}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showFilters && (
              <>
                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Assignee Filter */}
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Assignees</option>
                  <option value="unassigned">Unassigned</option>
                  {currentUser && <option value={currentUser.id}>My Tasks</option>}
                </select>
              </>
            )}
          </div>

          {/* Add Task Button */}
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.status);

            return (
              <div key={column.status} className={`rounded-lg ${column.color} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{column.label}</h3>
                  <span className="px-2 py-0.5 bg-white rounded-full text-sm font-semibold">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onView={onViewTask}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </div>

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No tasks</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-4">
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onView={onViewTask}
                  onStatusChange={onStatusChange}
                />
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No tasks found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
