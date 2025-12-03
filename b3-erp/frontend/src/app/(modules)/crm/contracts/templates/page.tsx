'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Copy, Trash2, Star, FileText, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'service' | 'subscription' | 'license' | 'support' | 'maintenance' | 'custom';
  defaultDuration: number; // in months
  defaultValue: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  autoRenew: boolean;
  renewalNoticeDays: number;
  paymentTerms: string;
  clauses: string[];
  usageCount: number;
  lastUsed?: string;
  createdDate: string;
  isFavorite: boolean;
  tags: string[];
  includesSLA: boolean;
  includesTermination: boolean;
  includesIPRights: boolean;
  includesConfidentiality: boolean;
}

const mockTemplates: ContractTemplate[] = [
  {
    id: '1',
    name: 'Enterprise Software License Agreement',
    description: 'Comprehensive software licensing agreement for enterprise customers with multi-year terms',
    category: 'license',
    defaultDuration: 36,
    defaultValue: 450000,
    billingCycle: 'annually',
    autoRenew: true,
    renewalNoticeDays: 90,
    paymentTerms: 'Net 30',
    clauses: ['License Grant', 'Usage Restrictions', 'Maintenance & Support', 'Warranty', 'Liability Limitations'],
    usageCount: 34,
    lastUsed: '2024-10-15',
    createdDate: '2023-09-10',
    isFavorite: true,
    tags: ['Enterprise', 'Software', 'Multi-Year'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: true,
    includesConfidentiality: true,
  },
  {
    id: '2',
    name: 'SaaS Subscription Agreement',
    description: 'Standard monthly or annual SaaS subscription contract with auto-renewal',
    category: 'subscription',
    defaultDuration: 12,
    defaultValue: 24000,
    billingCycle: 'monthly',
    autoRenew: true,
    renewalNoticeDays: 30,
    paymentTerms: 'Credit Card - Immediate',
    clauses: ['Service Description', 'Subscription Terms', 'Data Processing', 'Uptime SLA', 'Cancellation Policy'],
    usageCount: 56,
    lastUsed: '2024-10-18',
    createdDate: '2023-08-15',
    isFavorite: true,
    tags: ['SaaS', 'Subscription', 'Cloud'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: false,
    includesConfidentiality: true,
  },
  {
    id: '3',
    name: 'Professional Services Agreement',
    description: 'Consulting and professional services contract with milestone-based payments',
    category: 'service',
    defaultDuration: 12,
    defaultValue: 180000,
    billingCycle: 'one-time',
    autoRenew: false,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30 - Milestone Based',
    clauses: ['Scope of Work', 'Deliverables', 'Payment Schedule', 'Change Orders', 'Acceptance Criteria'],
    usageCount: 42,
    lastUsed: '2024-10-12',
    createdDate: '2023-10-01',
    isFavorite: true,
    tags: ['Consulting', 'Professional Services', 'Project'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: true,
    includesConfidentiality: true,
  },
  {
    id: '4',
    name: 'Premium Support Package',
    description: 'Annual premium support and maintenance agreement with 24/7 coverage',
    category: 'support',
    defaultDuration: 12,
    defaultValue: 85000,
    billingCycle: 'annually',
    autoRenew: true,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30',
    clauses: ['Support Coverage', 'Response Times', 'Escalation Procedures', 'Remote Access', 'Reporting'],
    usageCount: 28,
    lastUsed: '2024-10-10',
    createdDate: '2023-11-20',
    isFavorite: false,
    tags: ['Support', 'Maintenance', 'Premium'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: false,
    includesConfidentiality: true,
  },
  {
    id: '5',
    name: 'Cloud Infrastructure Services',
    description: 'Monthly cloud hosting and infrastructure management services',
    category: 'service',
    defaultDuration: 12,
    defaultValue: 36000,
    billingCycle: 'monthly',
    autoRenew: true,
    renewalNoticeDays: 30,
    paymentTerms: 'Net 15',
    clauses: ['Infrastructure Specifications', 'Uptime Guarantee', 'Backup & Recovery', 'Security Measures', 'Scalability'],
    usageCount: 18,
    lastUsed: '2024-10-08',
    createdDate: '2024-01-10',
    isFavorite: false,
    tags: ['Cloud', 'Infrastructure', 'Hosting'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: false,
    includesConfidentiality: true,
  },
  {
    id: '6',
    name: 'Custom Development Agreement',
    description: 'Software development contract for custom applications and integrations',
    category: 'custom',
    defaultDuration: 6,
    defaultValue: 120000,
    billingCycle: 'one-time',
    autoRenew: false,
    renewalNoticeDays: 30,
    paymentTerms: 'Net 30 - 40% Upfront',
    clauses: ['Development Scope', 'Technical Specifications', 'Testing & QA', 'Source Code Ownership', 'Warranty Period'],
    usageCount: 15,
    lastUsed: '2024-09-28',
    createdDate: '2024-02-05',
    isFavorite: false,
    tags: ['Development', 'Custom', 'Software'],
    includesSLA: false,
    includesTermination: true,
    includesIPRights: true,
    includesConfidentiality: true,
  },
  {
    id: '7',
    name: 'Maintenance & Support Agreement',
    description: 'Standard annual maintenance contract with business hours support',
    category: 'maintenance',
    defaultDuration: 12,
    defaultValue: 48000,
    billingCycle: 'annually',
    autoRenew: true,
    renewalNoticeDays: 60,
    paymentTerms: 'Net 30',
    clauses: ['Maintenance Services', 'Update Schedule', 'Support Hours', 'Bug Fixes', 'Minor Enhancements'],
    usageCount: 38,
    lastUsed: '2024-10-14',
    createdDate: '2023-07-15',
    isFavorite: true,
    tags: ['Maintenance', 'Support', 'Annual'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: false,
    includesConfidentiality: false,
  },
  {
    id: '8',
    name: 'Managed Services Agreement',
    description: 'Comprehensive managed IT services with proactive monitoring',
    category: 'service',
    defaultDuration: 24,
    defaultValue: 96000,
    billingCycle: 'monthly',
    autoRenew: true,
    renewalNoticeDays: 90,
    paymentTerms: 'Net 15',
    clauses: ['Service Catalog', 'Monitoring & Alerting', 'Incident Management', 'Change Management', 'Performance Metrics'],
    usageCount: 22,
    lastUsed: '2024-10-05',
    createdDate: '2023-12-01',
    isFavorite: false,
    tags: ['Managed Services', 'IT', 'Monitoring'],
    includesSLA: true,
    includesTermination: true,
    includesIPRights: false,
    includesConfidentiality: true,
  },
];

export default function ContractTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'service' | 'subscription' | 'license' | 'support' | 'maintenance' | 'custom'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ContractTemplate | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesFavorites = !showFavoritesOnly || template.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const stats = {
    totalTemplates: templates.length,
    favorites: templates.filter(t => t.isFavorite).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgValue: Math.round(templates.reduce((sum, t) => sum + t.defaultValue, 0) / templates.length),
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service': return 'bg-blue-100 text-blue-700';
      case 'subscription': return 'bg-purple-100 text-purple-700';
      case 'license': return 'bg-green-100 text-green-700';
      case 'support': return 'bg-orange-100 text-orange-700';
      case 'maintenance': return 'bg-teal-100 text-teal-700';
      case 'custom': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBillingCycleColor = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return 'bg-blue-50 text-blue-700';
      case 'quarterly': return 'bg-purple-50 text-purple-700';
      case 'annually': return 'bg-green-50 text-green-700';
      case 'one-time': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleCreateTemplate = () => {
    router.push('/crm/contracts/templates/create');
  };

  const handleUseTemplate = (template: ContractTemplate) => {
    router.push(`/crm/contracts/create?templateId=${template.id}`);
  };

  const handleViewTemplate = (template: ContractTemplate) => {
    router.push(`/crm/contracts/templates/view/${template.id}`);
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    router.push(`/crm/contracts/templates/edit/${template.id}`);
  };

  const handleDeleteClick = (template: ContractTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <FileText className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalTemplates}</div>
            <div className="text-blue-100">Total Templates</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <Star className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.favorites}</div>
            <div className="text-yellow-100">Favorites</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalUsage}</div>
            <div className="text-purple-100">Total Uses</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <DollarSign className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">${(stats.avgValue / 1000).toFixed(0)}K</div>
            <div className="text-green-100">Avg Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="service">Service</option>
              <option value="subscription">Subscription</option>
              <option value="license">License</option>
              <option value="support">Support</option>
              <option value="maintenance">Maintenance</option>
              <option value="custom">Custom</option>
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                showFavoritesOnly ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'border-gray-300 text-gray-700'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
              Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Template Header */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {template.isFavorite && (
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>

            {/* Template Details */}
            <div className="p-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Default Value</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ${(template.defaultValue / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Duration</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {template.defaultDuration} {template.defaultDuration === 1 ? 'month' : 'months'}
                  </div>
                </div>
              </div>

              {/* Contract Features */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Billing Cycle</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getBillingCycleColor(template.billingCycle)}`}>
                    {template.billingCycle.replace('-', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto-Renew</span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    template.autoRenew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {template.autoRenew ? (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        Yes
                      </>
                    ) : 'No'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Notice Period</span>
                  <span className="font-medium text-gray-900">
                    {template.renewalNoticeDays} days
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payment Terms</span>
                  <span className="font-medium text-gray-900 text-xs">
                    {template.paymentTerms}
                  </span>
                </div>
              </div>

              {/* Included Clauses */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">Key Clauses ({template.clauses.length}):</div>
                <div className="space-y-1">
                  {template.clauses.slice(0, 3).map((clause, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {clause}
                    </div>
                  ))}
                  {template.clauses.length > 3 && (
                    <div className="text-xs text-blue-600 font-medium">
                      +{template.clauses.length - 3} more clauses
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Features */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="text-xs font-medium text-gray-700 mb-2">Legal Protections:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-1 text-xs ${template.includesSLA ? 'text-green-700' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    SLA
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${template.includesTermination ? 'text-green-700' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    Termination
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${template.includesIPRights ? 'text-green-700' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    IP Rights
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${template.includesConfidentiality ? 'text-green-700' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" />
                    NDA
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Times Used</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{template.usageCount}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>Last Used</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  title="Use this template to create a new contract"
                >
                  <Copy className="w-4 h-4" />
                  Use Template
                </button>
                <button
                  onClick={() => handleViewTemplate(template)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  title="View template details"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  title="Edit template"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(template)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                  title="Delete template"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Delete</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Created: {new Date(template.createdDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setTemplateToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Contract Template"
        message={
          templateToDelete
            ? `Are you sure you want to delete "${templateToDelete.name}"? This template has been used ${templateToDelete.usageCount} time${templateToDelete.usageCount !== 1 ? 's' : ''}. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
