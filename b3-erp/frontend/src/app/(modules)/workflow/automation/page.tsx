'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Eye, Edit, Trash2, Play, Pause, Power,
  Zap, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp,
  ChevronLeft, ChevronRight, Settings, RefreshCw, Calendar,
  Activity, Filter, BarChart3, Target, Bot, Users, GitBranch
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'schedule' | 'event' | 'condition' | 'manual';
  triggerDetails: string;
  action: string;
  status: 'active' | 'paused' | 'error' | 'draft';
  frequency: string;
  lastRun: string;
  nextRun: string;
  executionCount: number;
  successRate: number;
  avgExecutionTime: string;
  category: 'procurement' | 'production' | 'finance' | 'hr' | 'inventory' | 'sales';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: string;
}

const mockAutomations: AutomationRule[] = [
  {
    id: 'AUTO001',
    name: 'Auto Purchase Requisition',
    description: 'Automatically create purchase requisitions when inventory falls below minimum stock level',
    trigger: 'condition',
    triggerDetails: 'Stock Level < Minimum Stock',
    action: 'Create Purchase Requisition',
    status: 'active',
    frequency: 'Real-time',
    lastRun: '2025-10-17 09:30',
    nextRun: 'Real-time',
    executionCount: 1247,
    successRate: 98.5,
    avgExecutionTime: '1.2s',
    category: 'procurement',
    priority: 'high',
    createdBy: 'System Admin',
    createdAt: '2025-08-15',
  },
  {
    id: 'AUTO002',
    name: 'Daily Production Report',
    description: 'Generate and email daily production summary reports to management',
    trigger: 'schedule',
    triggerDetails: 'Daily at 6:00 PM',
    action: 'Generate Report & Send Email',
    status: 'active',
    frequency: 'Daily',
    lastRun: '2025-10-16 18:00',
    nextRun: '2025-10-17 18:00',
    executionCount: 89,
    successRate: 100,
    avgExecutionTime: '4.5s',
    category: 'production',
    priority: 'medium',
    createdBy: 'Production Manager',
    createdAt: '2025-09-01',
  },
  {
    id: 'AUTO003',
    name: 'Invoice Payment Reminder',
    description: 'Send payment reminders to customers for overdue invoices',
    trigger: 'schedule',
    triggerDetails: 'Daily at 9:00 AM',
    action: 'Send Email Notification',
    status: 'active',
    frequency: 'Daily',
    lastRun: '2025-10-17 09:00',
    nextRun: '2025-10-18 09:00',
    executionCount: 156,
    successRate: 94.2,
    avgExecutionTime: '2.8s',
    category: 'finance',
    priority: 'high',
    createdBy: 'Finance Controller',
    createdAt: '2025-08-20',
  },
  {
    id: 'AUTO004',
    name: 'Employee Birthday Notification',
    description: 'Send birthday wishes to employees and notify HR team',
    trigger: 'schedule',
    triggerDetails: 'Daily at 8:00 AM',
    action: 'Send Email & Create Task',
    status: 'active',
    frequency: 'Daily',
    lastRun: '2025-10-17 08:00',
    nextRun: '2025-10-18 08:00',
    executionCount: 94,
    successRate: 100,
    avgExecutionTime: '0.9s',
    category: 'hr',
    priority: 'low',
    createdBy: 'HR Manager',
    createdAt: '2025-09-10',
  },
  {
    id: 'AUTO005',
    name: 'Quality Check Assignment',
    description: 'Auto-assign quality checks when production orders reach completion stage',
    trigger: 'event',
    triggerDetails: 'Production Order Completed',
    action: 'Assign QC Task',
    status: 'active',
    frequency: 'Event-driven',
    lastRun: '2025-10-17 11:45',
    nextRun: 'On Event',
    executionCount: 342,
    successRate: 97.8,
    avgExecutionTime: '1.5s',
    category: 'production',
    priority: 'critical',
    createdBy: 'QC Manager',
    createdAt: '2025-08-25',
  },
  {
    id: 'AUTO006',
    name: 'Inventory Cycle Count',
    description: 'Schedule automated cycle counts for high-value inventory items',
    trigger: 'schedule',
    triggerDetails: 'Weekly on Monday',
    action: 'Create Cycle Count Task',
    status: 'active',
    frequency: 'Weekly',
    lastRun: '2025-10-14 07:00',
    nextRun: '2025-10-21 07:00',
    executionCount: 12,
    successRate: 91.7,
    avgExecutionTime: '3.2s',
    category: 'inventory',
    priority: 'medium',
    createdBy: 'Inventory Manager',
    createdAt: '2025-09-05',
  },
  {
    id: 'AUTO007',
    name: 'Sales Lead Distribution',
    description: 'Automatically distribute new sales leads to sales representatives based on territory',
    trigger: 'event',
    triggerDetails: 'New Lead Created',
    action: 'Assign to Sales Rep',
    status: 'active',
    frequency: 'Event-driven',
    lastRun: '2025-10-17 10:15',
    nextRun: 'On Event',
    executionCount: 234,
    successRate: 99.1,
    avgExecutionTime: '0.8s',
    category: 'sales',
    priority: 'high',
    createdBy: 'Sales Director',
    createdAt: '2025-09-15',
  },
  {
    id: 'AUTO008',
    name: 'Expense Approval Escalation',
    description: 'Escalate pending expense approvals after 3 days to next level manager',
    trigger: 'condition',
    triggerDetails: 'Pending > 3 Days',
    action: 'Escalate Approval',
    status: 'paused',
    frequency: 'Real-time',
    lastRun: '2025-10-15 14:20',
    nextRun: 'Paused',
    executionCount: 67,
    successRate: 88.1,
    avgExecutionTime: '1.1s',
    category: 'finance',
    priority: 'medium',
    createdBy: 'Finance Manager',
    createdAt: '2025-09-20',
  },
  {
    id: 'AUTO009',
    name: 'Customer Satisfaction Survey',
    description: 'Send satisfaction survey to customers after order delivery',
    trigger: 'event',
    triggerDetails: 'Order Delivered',
    action: 'Send Survey Email',
    status: 'active',
    frequency: 'Event-driven',
    lastRun: '2025-10-17 13:20',
    nextRun: 'On Event',
    executionCount: 189,
    successRate: 96.3,
    avgExecutionTime: '2.1s',
    category: 'sales',
    priority: 'low',
    createdBy: 'Customer Success',
    createdAt: '2025-10-01',
  },
  {
    id: 'AUTO010',
    name: 'Material Shortage Alert',
    description: 'Alert production planning team when material shortages are detected for scheduled orders',
    trigger: 'condition',
    triggerDetails: 'Material Shortage Detected',
    action: 'Send Alert & Create Task',
    status: 'error',
    frequency: 'Real-time',
    lastRun: '2025-10-17 12:00',
    nextRun: 'Error - Needs Fix',
    executionCount: 45,
    successRate: 77.8,
    avgExecutionTime: '1.8s',
    category: 'production',
    priority: 'critical',
    createdBy: 'Production Planner',
    createdAt: '2025-10-05',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-700',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const categoryColors = {
  procurement: 'bg-purple-100 text-purple-700',
  production: 'bg-indigo-100 text-indigo-700',
  finance: 'bg-green-100 text-green-700',
  hr: 'bg-pink-100 text-pink-700',
  inventory: 'bg-teal-100 text-teal-700',
  sales: 'bg-blue-100 text-blue-700',
};

const triggerIcons = {
  schedule: Clock,
  event: Zap,
  condition: Target,
  manual: Users,
};

export default function WorkflowAutomationPage() {
  const router = useRouter();
  const [automations, setAutomations] = useState<AutomationRule[]>(mockAutomations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch =
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || automation.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || automation.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAutomations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAutomations = filteredAutomations.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: automations.length,
    active: automations.filter((a) => a.status === 'active').length,
    paused: automations.filter((a) => a.status === 'paused').length,
    error: automations.filter((a) => a.status === 'error').length,
    totalExecutions: automations.reduce((sum, a) => sum + a.executionCount, 0),
    avgSuccessRate: (automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length).toFixed(1),
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(automations.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'active' ? 'paused' as const : 'active' as const }
        : a
    ));
  };

  const handleDeleteAutomation = (id: string) => {
    if (confirm('Are you sure you want to delete this automation rule?')) {
      setAutomations(automations.filter((a) => a.id !== id));
    }
  };

  const handleRunNow = (automation: AutomationRule) => {
    alert(`Running automation: ${automation.name}`);
    const updatedAutomations = automations.map(a =>
      a.id === automation.id
        ? {
            ...a,
            lastRun: new Date().toISOString().split('T').join(' ').substring(0, 16),
            executionCount: a.executionCount + 1,
          }
        : a
    );
    setAutomations(updatedAutomations);
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTriggerIcon = (trigger: AutomationRule['trigger']) => {
    const Icon = triggerIcons[trigger];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
            <p className="text-gray-600 mt-1">Automate business processes and tasks</p>
          </div>
          <button
            onClick={() => router.push('/workflow/automation/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Automation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Rules</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Paused</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.paused}</p>
            </div>
            <Pause className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Errors</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.error}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Executions</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalExecutions}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Success Rate</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.avgSuccessRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search automations by name, description, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="error">Error</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="procurement">Procurement</option>
              <option value="production">Production</option>
              <option value="finance">Finance</option>
              <option value="hr">HR</option>
              <option value="inventory">Inventory</option>
              <option value="sales">Sales</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        )}
      </div>

      {/* Automation Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {paginatedAutomations.map((automation) => (
          <div
            key={automation.id}
            className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            {/* Automation Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[automation.status]}`}>
                    {automation.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColors[automation.priority]}`}>
                    {automation.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColors[automation.category]}`}>
                    {automation.category}
                  </span>
                  <span className="text-xs text-gray-500">ID: {automation.id}</span>
                </div>
              </div>
            </div>

            {/* Trigger and Action Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-1">
                  {getTriggerIcon(automation.trigger)}
                  <p className="text-xs font-medium text-blue-900">Trigger</p>
                </div>
                <p className="text-xs text-blue-700 font-semibold">{automation.trigger}</p>
                <p className="text-xs text-gray-600 mt-1">{automation.triggerDetails}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-1">
                  <GitBranch className="h-4 w-4 text-green-700" />
                  <p className="text-xs font-medium text-green-900">Action</p>
                </div>
                <p className="text-xs text-green-700 font-semibold">{automation.action}</p>
                <p className="text-xs text-gray-600 mt-1">{automation.frequency}</p>
              </div>
            </div>

            {/* Execution Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Executions</p>
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">{automation.executionCount}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                <div className="flex items-center space-x-1">
                  <CheckCircle className={`h-3 w-3 ${getSuccessRateColor(automation.successRate)}`} />
                  <span className={`text-sm font-semibold ${getSuccessRateColor(automation.successRate)}`}>
                    {automation.successRate}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg Time</p>
                <span className="text-sm font-semibold text-gray-900">{automation.avgExecutionTime}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Next Run</p>
                <span className="text-xs font-semibold text-gray-900 truncate block">{automation.nextRun}</span>
              </div>
            </div>

            {/* Execution Timeline */}
            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Last: {automation.lastRun}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{automation.createdBy}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleAutomation(automation.id)}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  automation.status === 'active'
                    ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                    : 'text-green-600 bg-green-50 hover:bg-green-100'
                }`}
              >
                {automation.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Activate</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleRunNow(automation)}
                className="flex items-center justify-center px-3 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                title="Run Now"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push(`/workflow/automation/edit/${automation.id}`)}
                className="flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push(`/workflow/automation/view/${automation.id}`)}
                className="flex items-center justify-center px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteAutomation(automation.id)}
                className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAutomations.length)} of {filteredAutomations.length} automation rules
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
