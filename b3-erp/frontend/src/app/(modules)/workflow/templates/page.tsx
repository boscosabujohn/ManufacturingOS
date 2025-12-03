'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Eye, Edit, Trash2, Copy, Play, Pause,
  FileText, GitBranch, Users, Clock, CheckCircle, XCircle,
  AlertCircle, ChevronLeft, ChevronRight, Settings, Download,
  Upload, Filter, Calendar, Tag, BarChart3, Activity
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'approval' | 'automation' | 'notification' | 'custom';
  status: 'active' | 'draft' | 'archived';
  version: string;
  steps: number;
  usageCount: number;
  avgDuration: string;
  successRate: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
}

const mockTemplates: WorkflowTemplate[] = [
  {
    id: 'WT001',
    name: 'Purchase Order Approval',
    description: 'Multi-level approval workflow for purchase orders exceeding budget thresholds',
    category: 'approval',
    status: 'active',
    version: '2.3',
    steps: 5,
    usageCount: 247,
    avgDuration: '2.5 hrs',
    successRate: 94.5,
    createdBy: 'Admin User',
    createdAt: '2025-08-15',
    lastModified: '2025-10-12',
    tags: ['procurement', 'finance', 'critical'],
  },
  {
    id: 'WT002',
    name: 'Employee Onboarding',
    description: 'Automated workflow for new employee registration and setup',
    category: 'automation',
    status: 'active',
    version: '1.8',
    steps: 8,
    usageCount: 89,
    avgDuration: '3 days',
    successRate: 98.2,
    createdBy: 'HR Manager',
    createdAt: '2025-09-01',
    lastModified: '2025-10-10',
    tags: ['hr', 'onboarding', 'automation'],
  },
  {
    id: 'WT003',
    name: 'Production Order Notification',
    description: 'Automated notifications for production order status changes',
    category: 'notification',
    status: 'active',
    version: '1.2',
    steps: 3,
    usageCount: 532,
    avgDuration: '5 mins',
    successRate: 99.8,
    createdBy: 'Production Manager',
    createdAt: '2025-09-15',
    lastModified: '2025-10-08',
    tags: ['production', 'notifications'],
  },
  {
    id: 'WT004',
    name: 'Sales Quote Approval',
    description: 'Tiered approval process for sales quotations based on discount levels',
    category: 'approval',
    status: 'active',
    version: '3.1',
    steps: 4,
    usageCount: 178,
    avgDuration: '1.2 hrs',
    successRate: 91.3,
    createdBy: 'Sales Director',
    createdAt: '2025-07-20',
    lastModified: '2025-10-14',
    tags: ['sales', 'crm', 'approval'],
  },
  {
    id: 'WT005',
    name: 'Invoice Payment Reconciliation',
    description: 'Automated workflow for invoice payment matching and reconciliation',
    category: 'automation',
    status: 'active',
    version: '2.0',
    steps: 6,
    usageCount: 412,
    avgDuration: '45 mins',
    successRate: 96.7,
    createdBy: 'Finance Controller',
    createdAt: '2025-08-25',
    lastModified: '2025-10-11',
    tags: ['finance', 'accounting', 'automation'],
  },
  {
    id: 'WT006',
    name: 'Quality Control Process',
    description: 'Multi-stage quality inspection and approval workflow',
    category: 'approval',
    status: 'active',
    version: '1.5',
    steps: 7,
    usageCount: 156,
    avgDuration: '4 hrs',
    successRate: 88.9,
    createdBy: 'QC Manager',
    createdAt: '2025-09-10',
    lastModified: '2025-10-09',
    tags: ['quality', 'production', 'inspection'],
  },
  {
    id: 'WT007',
    name: 'Expense Reimbursement',
    description: 'Employee expense submission and approval workflow',
    category: 'approval',
    status: 'active',
    version: '2.7',
    steps: 4,
    usageCount: 321,
    avgDuration: '1 day',
    successRate: 93.8,
    createdBy: 'HR Manager',
    createdAt: '2025-08-01',
    lastModified: '2025-10-13',
    tags: ['hr', 'finance', 'expenses'],
  },
  {
    id: 'WT008',
    name: 'Inventory Reorder Alert',
    description: 'Automated alerts when inventory falls below reorder point',
    category: 'notification',
    status: 'active',
    version: '1.0',
    steps: 2,
    usageCount: 678,
    avgDuration: '1 min',
    successRate: 99.9,
    createdBy: 'Inventory Manager',
    createdAt: '2025-09-20',
    lastModified: '2025-10-07',
    tags: ['inventory', 'alerts', 'procurement'],
  },
  {
    id: 'WT009',
    name: 'Project Milestone Tracking',
    description: 'Custom workflow for project milestone completion and sign-off',
    category: 'custom',
    status: 'draft',
    version: '0.9',
    steps: 9,
    usageCount: 0,
    avgDuration: 'N/A',
    successRate: 0,
    createdBy: 'Project Manager',
    createdAt: '2025-10-05',
    lastModified: '2025-10-15',
    tags: ['projects', 'milestones', 'tracking'],
  },
  {
    id: 'WT010',
    name: 'Customer Complaint Resolution',
    description: 'End-to-end workflow for handling customer complaints and feedback',
    category: 'custom',
    status: 'active',
    version: '1.4',
    steps: 6,
    usageCount: 94,
    avgDuration: '2 days',
    successRate: 90.4,
    createdBy: 'Support Manager',
    createdAt: '2025-09-05',
    lastModified: '2025-10-10',
    tags: ['support', 'crm', 'complaints'],
  },
];

const categoryColors = {
  approval: 'bg-blue-100 text-blue-700',
  automation: 'bg-green-100 text-green-700',
  notification: 'bg-purple-100 text-purple-700',
  custom: 'bg-orange-100 text-orange-700',
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-700',
};

export default function WorkflowTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === 'active').length,
    draft: templates.filter((t) => t.status === 'draft').length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgSuccessRate: (templates.reduce((sum, t) => sum + t.successRate, 0) / templates.length).toFixed(1),
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this workflow template?')) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleDuplicateTemplate = (template: WorkflowTemplate) => {
    const newTemplate = {
      ...template,
      id: `WT${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      status: 'draft' as const,
      version: '1.0',
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleActivateTemplate = (id: string) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, status: 'active' as const } : t
    ));
  };

  const handleBulkAction = (action: string) => {
    if (selectedTemplates.length === 0) {
      alert('Please select at least one template');
      return;
    }

    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedTemplates.length} template(s)?`)) {
          setTemplates(templates.filter(t => !selectedTemplates.includes(t.id)));
          setSelectedTemplates([]);
        }
        break;
      case 'archive':
        setTemplates(templates.map(t =>
          selectedTemplates.includes(t.id) ? { ...t, status: 'archived' as const } : t
        ));
        setSelectedTemplates([]);
        break;
      case 'export':
        alert('Exporting selected templates...');
        break;
    }
  };

  const toggleTemplateSelection = (id: string) => {
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTemplates.length === paginatedTemplates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(paginatedTemplates.map(t => t.id));
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Templates</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm font-medium text-yellow-600">Draft</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.draft}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalUsage}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Avg Success Rate</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.avgSuccessRate}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6 space-x-3">
        <button
          onClick={() => alert('Import template functionality')}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </button>
        <button
          onClick={() => router.push('/workflow/templates/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, description, or tags..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="approval">Approval</option>
              <option value="automation">Automation</option>
              <option value="notification">Notification</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedTemplates.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedTemplates.length} template(s) selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('export')}
              className="px-3 py-1.5 text-sm bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              className="px-3 py-1.5 text-sm bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50"
            >
              Archive
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 text-sm bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {paginatedTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all ${
              selectedTemplates.includes(template.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => toggleTemplateSelection(template.id)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[template.status]}`}>
                      {template.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColors[template.category]}`}>
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">v{template.version}</span>
                    <span className="text-xs text-gray-500">ID: {template.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Template Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Steps</p>
                <div className="flex items-center space-x-1">
                  <GitBranch className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">{template.steps}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Usage</p>
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">{template.usageCount}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg Duration</p>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-900">{template.avgDuration}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                <div className="flex items-center space-x-1">
                  <CheckCircle className={`h-4 w-4 ${getSuccessRateColor(template.successRate)}`} />
                  <span className={`text-sm font-semibold ${getSuccessRateColor(template.successRate)}`}>
                    {template.successRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Template Meta */}
            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>Created by {template.createdBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Modified {template.lastModified}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push(`/workflow/templates/view/${template.id}`)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => router.push(`/workflow/templates/edit/${template.id}`)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDuplicateTemplate(template)}
                className="flex items-center justify-center px-3 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
               
              >
                <Copy className="h-4 w-4" />
              </button>
              {template.status === 'draft' && (
                <button
                  onClick={() => handleActivateTemplate(template.id)}
                  className="flex items-center justify-center px-3 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                 
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
               
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedTemplates.length === paginatedTemplates.length && paginatedTemplates.length > 0}
            onChange={toggleSelectAll}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} templates
          </span>
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
