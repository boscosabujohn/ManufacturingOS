'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Search, Filter, Calendar, User, Tag, Clock, AlertCircle, CheckCircle, XCircle, Flag, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  relatedTo: string;
  relatedType: 'lead' | 'opportunity' | 'customer' | 'internal';
  dueDate: string;
  createdDate: string;
  completedDate?: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  subtasks?: number;
  subtasksCompleted?: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with TechCorp on proposal',
    description: 'Send detailed pricing breakdown and timeline for enterprise implementation',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    relatedTo: 'TechCorp Global Inc.',
    relatedType: 'opportunity',
    dueDate: '2024-10-21T15:00:00',
    createdDate: '2024-10-15T09:00:00',
    tags: ['Sales', 'Proposal', 'Enterprise'],
    estimatedHours: 4,
    subtasks: 3,
    subtasksCompleted: 1,
  },
  {
    id: '2',
    title: 'Prepare Q4 sales presentation',
    description: 'Create comprehensive slides with metrics, goals, and strategy',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    relatedTo: 'Sales Team',
    relatedType: 'internal',
    dueDate: '2024-10-22T17:00:00',
    createdDate: '2024-10-16T10:00:00',
    tags: ['Internal', 'Presentation', 'Q4'],
    estimatedHours: 8,
    actualHours: 3,
    subtasks: 5,
    subtasksCompleted: 2,
  },
  {
    id: '3',
    title: 'Update CRM data for Enterprise accounts',
    description: 'Ensure all contact information and opportunity stages are current',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Michael Chen',
    relatedTo: 'Enterprise Division',
    relatedType: 'customer',
    dueDate: '2024-10-20T16:00:00',
    createdDate: '2024-10-18T11:00:00',
    completedDate: '2024-10-20T14:30:00',
    tags: ['Data', 'Maintenance', 'CRM'],
    estimatedHours: 3,
    actualHours: 2.5,
  },
  {
    id: '4',
    title: 'Schedule product demo with FinanceHub',
    description: 'Coordinate with technical team and client for comprehensive demo',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Emily Rodriguez',
    relatedTo: 'FinanceHub International',
    relatedType: 'opportunity',
    dueDate: '2024-10-21T12:00:00',
    createdDate: '2024-10-19T13:00:00',
    tags: ['Demo', 'Enterprise', 'Coordination'],
    estimatedHours: 2,
    subtasks: 4,
    subtasksCompleted: 2,
  },
  {
    id: '5',
    title: 'Research competitor pricing strategy',
    description: 'Analyze top 3 competitors pricing models and features',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'David Martinez',
    relatedTo: 'Market Research',
    relatedType: 'internal',
    dueDate: '2024-10-23T18:00:00',
    createdDate: '2024-10-17T09:30:00',
    tags: ['Research', 'Competitive', 'Strategy'],
    estimatedHours: 6,
    actualHours: 2,
  },
  {
    id: '6',
    title: 'Send onboarding materials to new client',
    description: 'Package and send welcome kit and getting started guides',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Emily Rodriguez',
    relatedTo: 'StartupTech Inc.',
    relatedType: 'customer',
    dueDate: '2024-10-19T10:00:00',
    createdDate: '2024-10-18T14:00:00',
    completedDate: '2024-10-19T09:15:00',
    tags: ['Onboarding', 'Customer Success'],
    estimatedHours: 1,
    actualHours: 0.5,
  },
  {
    id: '7',
    title: 'Qualify new inbound leads from webinar',
    description: 'Review and score 45 leads from AI webinar series',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Michael Chen',
    relatedTo: 'AI Webinar Campaign',
    relatedType: 'lead',
    dueDate: '2024-10-21T16:00:00',
    createdDate: '2024-10-20T08:00:00',
    tags: ['Lead Qualification', 'Webinar', 'Inbound'],
    estimatedHours: 4,
    subtasks: 45,
    subtasksCompleted: 12,
  },
  {
    id: '8',
    title: 'Create case study from successful deployment',
    description: 'Interview client and document implementation success story',
    status: 'in_progress',
    priority: 'low',
    assignedTo: 'Sarah Johnson',
    relatedTo: 'GlobalMfg Corp',
    relatedType: 'customer',
    dueDate: '2024-10-25T17:00:00',
    createdDate: '2024-10-14T10:00:00',
    tags: ['Marketing', 'Case Study', 'Content'],
    estimatedHours: 10,
    actualHours: 4,
    subtasks: 3,
    subtasksCompleted: 1,
  },
  {
    id: '9',
    title: 'Review and update sales playbook',
    description: 'Update objection handling and closing techniques',
    status: 'todo',
    priority: 'low',
    assignedTo: 'David Martinez',
    relatedTo: 'Sales Enablement',
    relatedType: 'internal',
    dueDate: '2024-10-24T15:00:00',
    createdDate: '2024-10-16T11:00:00',
    tags: ['Training', 'Documentation', 'Sales'],
    estimatedHours: 5,
  },
  {
    id: '10',
    title: 'Conduct quarterly business review with top account',
    description: 'Prepare QBR deck and schedule with executive stakeholders',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    relatedTo: 'TechCorp Global Inc.',
    relatedType: 'customer',
    dueDate: '2024-10-22T14:00:00',
    createdDate: '2024-10-15T15:00:00',
    tags: ['QBR', 'Executive', 'Account Management'],
    estimatedHours: 6,
    subtasks: 5,
    subtasksCompleted: 0,
  },
];

export default function TasksPage() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('dueDate');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const assignees = ['all', ...Array.from(new Set(tasks.map(t => t.assignedTo)))];

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee;
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        default:
          return 0;
      }
    });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
    completionRate: (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && new Date(task.dueDate) < new Date();
  };

  return (
    <div className="w-full h-full px-3 py-2 ">
      <div className="mb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckSquare className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-blue-100">Total Tasks</div>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.todo}</div>
            <div className="text-gray-100">To Do</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.inProgress}</div>
            <div className="text-yellow-100">In Progress</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.completed}</div>
            <div className="text-green-100">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.overdue}</div>
            <div className="text-red-100">Overdue</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckSquare className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.completionRate.toFixed(0)}%</div>
            <div className="text-purple-100">Completion</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>
                    {assignee === 'all' ? 'All Assignees' : assignee}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="created">Sort by Created</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg border-2 p-3 hover:shadow-lg transition-shadow ${
              isOverdue(task) ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-3 h-3" />
                    {task.priority}
                  </span>
                  {isOverdue(task) && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      OVERDUE
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Subtasks Progress */}
                {task.subtasks && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-gray-600">Subtasks</span>
                      <span className="font-medium">{task.subtasksCompleted}/{task.subtasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${((task.subtasksCompleted || 0) / task.subtasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Task Details */}
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <User className="w-4 h-4" />
                      Assigned
                    </div>
                    <div className="font-medium text-gray-900">{task.assignedTo}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </div>
                    <div className={`font-medium ${isOverdue(task) ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      Time Tracked
                    </div>
                    <div className="font-medium text-gray-900">
                      {task.actualHours || 0}h / {task.estimatedHours || 0}h
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Related To</div>
                    <div className="font-medium text-gray-900">{task.relatedTo}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">View</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Edit className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Edit</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Delete</span>
                </button>
              </div>
            </div>

            {task.completedDate && (
              <div className="pt-3 border-t border-gray-100 text-sm text-gray-600">
                ✅ Completed on {new Date(task.completedDate).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
