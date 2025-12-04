'use client';

import React, { useState } from 'react';
import {
  ListChecks,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  Link,
  FileText,
  Percent,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Settings,
  Copy,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Users,
  Building2,
  Briefcase,
  User,
  Target,
  Database
} from 'lucide-react';

interface CustomField {
  id: string;
  name: string;
  apiName: string;
  label: string;
  description: string;
  fieldType: 'text' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'datetime' | 'boolean' | 'picklist' | 'multipicklist' | 'textarea' | 'currency' | 'percent' | 'lookup';
  module: 'opportunity' | 'lead' | 'contact' | 'account' | 'contract' | 'ticket' | 'activity';
  category: 'standard' | 'custom' | 'system';
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'reference';
  isRequired: boolean;
  isUnique: boolean;
  isActive: boolean;
  isSearchable: boolean;
  isEditable: boolean;
  defaultValue?: string;
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  usage: {
    recordsWithValue: number;
    totalRecords: number;
    lastUsed?: string;
  };
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

export default function CustomFieldsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const fields: CustomField[] = [
    {
      id: 'FLD-001',
      name: 'Industry',
      apiName: 'industry',
      label: 'Industry',
      description: 'Primary industry of the account',
      fieldType: 'picklist',
      module: 'account',
      category: 'standard',
      dataType: 'string',
      isRequired: true,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Select the primary industry vertical',
      validation: {
        options: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education']
      },
      usage: {
        recordsWithValue: 342,
        totalRecords: 342,
        lastUsed: '2025-10-20'
      },
      createdBy: 'System',
      createdAt: '2024-01-15',
      lastModified: '2025-10-20'
    },
    {
      id: 'FLD-002',
      name: 'Annual Revenue',
      apiName: 'annual_revenue',
      label: 'Annual Revenue',
      description: 'Company annual revenue in USD',
      fieldType: 'currency',
      module: 'account',
      category: 'standard',
      dataType: 'number',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Enter the estimated or actual annual revenue',
      validation: {
        min: 0,
        max: 999999999999
      },
      usage: {
        recordsWithValue: 298,
        totalRecords: 342,
        lastUsed: '2025-10-20'
      },
      createdBy: 'System',
      createdAt: '2024-01-15',
      lastModified: '2025-10-15'
    },
    {
      id: 'FLD-003',
      name: 'Lead Source',
      apiName: 'lead_source',
      label: 'Lead Source',
      description: 'Origin of the lead',
      fieldType: 'picklist',
      module: 'lead',
      category: 'standard',
      dataType: 'string',
      isRequired: true,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Select how this lead was acquired',
      validation: {
        options: ['Website', 'Referral', 'Trade Show', 'Cold Call', 'Partner', 'Social Media', 'Webinar']
      },
      usage: {
        recordsWithValue: 248,
        totalRecords: 248,
        lastUsed: '2025-10-20'
      },
      createdBy: 'System',
      createdAt: '2024-01-15',
      lastModified: '2025-09-12'
    },
    {
      id: 'FLD-004',
      name: 'Deal Probability',
      apiName: 'deal_probability',
      label: 'Win Probability',
      description: 'Likelihood of closing the deal',
      fieldType: 'percent',
      module: 'opportunity',
      category: 'custom',
      dataType: 'number',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Enter the estimated probability of winning this deal (0-100)',
      validation: {
        min: 0,
        max: 100
      },
      usage: {
        recordsWithValue: 167,
        totalRecords: 189,
        lastUsed: '2025-10-20'
      },
      createdBy: 'Sarah Johnson',
      createdAt: '2024-03-10',
      lastModified: '2025-10-18'
    },
    {
      id: 'FLD-005',
      name: 'Customer Health Score',
      apiName: 'health_score',
      label: 'Health Score',
      description: 'Overall customer health rating',
      fieldType: 'number',
      module: 'account',
      category: 'custom',
      dataType: 'number',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Score from 0-100 indicating customer health',
      validation: {
        min: 0,
        max: 100
      },
      usage: {
        recordsWithValue: 312,
        totalRecords: 342,
        lastUsed: '2025-10-20'
      },
      createdBy: 'Emily Rodriguez',
      createdAt: '2024-04-22',
      lastModified: '2025-10-19'
    },
    {
      id: 'FLD-006',
      name: 'Contract End Date',
      apiName: 'contract_end_date',
      label: 'Contract End Date',
      description: 'Date when the contract expires',
      fieldType: 'date',
      module: 'contract',
      category: 'standard',
      dataType: 'date',
      isRequired: true,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Select the contract expiration date',
      usage: {
        recordsWithValue: 89,
        totalRecords: 89,
        lastUsed: '2025-10-20'
      },
      createdBy: 'System',
      createdAt: '2024-01-15',
      lastModified: '2025-08-30'
    },
    {
      id: 'FLD-007',
      name: 'Next Follow-up Date',
      apiName: 'next_followup_date',
      label: 'Next Follow-up',
      description: 'Scheduled date for next follow-up',
      fieldType: 'datetime',
      module: 'opportunity',
      category: 'custom',
      dataType: 'date',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Set a reminder for the next follow-up activity',
      usage: {
        recordsWithValue: 156,
        totalRecords: 189,
        lastUsed: '2025-10-20'
      },
      createdBy: 'Michael Chen',
      createdAt: '2024-05-15',
      lastModified: '2025-10-17'
    },
    {
      id: 'FLD-008',
      name: 'Decision Maker',
      apiName: 'is_decision_maker',
      label: 'Is Decision Maker?',
      description: 'Indicates if contact is a decision maker',
      fieldType: 'boolean',
      module: 'contact',
      category: 'custom',
      dataType: 'boolean',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      defaultValue: 'false',
      helpText: 'Check if this contact has decision-making authority',
      usage: {
        recordsWithValue: 234,
        totalRecords: 467,
        lastUsed: '2025-10-20'
      },
      createdBy: 'David Park',
      createdAt: '2024-06-08',
      lastModified: '2025-09-25'
    },
    {
      id: 'FLD-009',
      name: 'Preferred Contact Method',
      apiName: 'preferred_contact_method',
      label: 'Preferred Contact Method',
      description: 'How the contact prefers to be reached',
      fieldType: 'picklist',
      module: 'contact',
      category: 'custom',
      dataType: 'string',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Select the contact\'s preferred communication channel',
      validation: {
        options: ['Email', 'Phone', 'SMS', 'LinkedIn', 'Slack', 'Video Call']
      },
      usage: {
        recordsWithValue: 389,
        totalRecords: 467,
        lastUsed: '2025-10-20'
      },
      createdBy: 'Jennifer Martinez',
      createdAt: '2024-07-12',
      lastModified: '2025-10-10'
    },
    {
      id: 'FLD-010',
      name: 'Competitors',
      apiName: 'competitors',
      label: 'Competing Against',
      description: 'List of competitors in this deal',
      fieldType: 'multipicklist',
      module: 'opportunity',
      category: 'custom',
      dataType: 'string',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Select all competitors you are competing against',
      validation: {
        options: ['Competitor A', 'Competitor B', 'Competitor C', 'Competitor D', 'Other']
      },
      usage: {
        recordsWithValue: 134,
        totalRecords: 189,
        lastUsed: '2025-10-19'
      },
      createdBy: 'Sarah Johnson',
      createdAt: '2024-08-20',
      lastModified: '2025-10-05'
    },
    {
      id: 'FLD-011',
      name: 'Special Instructions',
      apiName: 'special_instructions',
      label: 'Special Instructions',
      description: 'Any special handling instructions',
      fieldType: 'textarea',
      module: 'ticket',
      category: 'custom',
      dataType: 'string',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: true,
      isEditable: true,
      helpText: 'Provide detailed instructions for handling this ticket',
      usage: {
        recordsWithValue: 67,
        totalRecords: 156,
        lastUsed: '2025-10-20'
      },
      createdBy: 'Alex Thompson',
      createdAt: '2024-09-05',
      lastModified: '2025-10-12'
    },
    {
      id: 'FLD-012',
      name: 'LinkedIn Profile',
      apiName: 'linkedin_url',
      label: 'LinkedIn Profile URL',
      description: 'Contact\'s LinkedIn profile link',
      fieldType: 'url',
      module: 'contact',
      category: 'custom',
      dataType: 'string',
      isRequired: false,
      isUnique: false,
      isActive: true,
      isSearchable: false,
      isEditable: true,
      helpText: 'Enter the full LinkedIn profile URL',
      validation: {
        pattern: '^https?://.*linkedin\\.com/.*$'
      },
      usage: {
        recordsWithValue: 312,
        totalRecords: 467,
        lastUsed: '2025-10-20'
      },
      createdBy: 'Lisa Anderson',
      createdAt: '2024-10-01',
      lastModified: '2025-10-08'
    }
  ];

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || field.module === moduleFilter;
    const matchesType = typeFilter === 'all' || field.fieldType === typeFilter;
    const matchesCategory = categoryFilter === 'all' || field.category === categoryFilter;
    return matchesSearch && matchesModule && matchesType && matchesCategory;
  });

  const stats = [
    {
      label: 'Total Fields',
      value: fields.length,
      subtitle: `${fields.filter(f => f.isActive).length} active`,
      icon: Database,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Custom Fields',
      value: fields.filter(f => f.category === 'custom').length,
      subtitle: `${fields.filter(f => f.category === 'standard').length} standard`,
      icon: Settings,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Required Fields',
      value: fields.filter(f => f.isRequired).length,
      subtitle: 'Across all modules',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Avg Usage',
      value: Math.round(fields.reduce((sum, f) => sum + (f.usage.recordsWithValue / f.usage.totalRecords * 100), 0) / fields.length) + '%',
      subtitle: 'Field utilization',
      icon: Target,
      color: 'from-green-500 to-green-600'
    }
  ];

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
      case 'textarea': return Type;
      case 'number': return Hash;
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'url': return Link;
      case 'date':
      case 'datetime': return Calendar;
      case 'boolean': return ToggleLeft;
      case 'picklist':
      case 'multipicklist': return ListChecks;
      case 'currency': return DollarSign;
      case 'percent': return Percent;
      case 'lookup': return Users;
      default: return FileText;
    }
  };

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case 'text':
      case 'textarea': return 'bg-blue-100 text-blue-700';
      case 'number':
      case 'currency':
      case 'percent': return 'bg-green-100 text-green-700';
      case 'email':
      case 'phone':
      case 'url': return 'bg-purple-100 text-purple-700';
      case 'date':
      case 'datetime': return 'bg-orange-100 text-orange-700';
      case 'boolean': return 'bg-pink-100 text-pink-700';
      case 'picklist':
      case 'multipicklist': return 'bg-indigo-100 text-indigo-700';
      case 'lookup': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'standard': return 'bg-blue-100 text-blue-700';
      case 'custom': return 'bg-purple-100 text-purple-700';
      case 'system': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'opportunity': return Briefcase;
      case 'lead': return Target;
      case 'contact': return User;
      case 'account': return Building2;
      case 'contract': return FileText;
      case 'ticket': return AlertCircle;
      case 'activity': return Calendar;
      default: return Database;
    }
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6  space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Field
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-white/70 text-xs mt-1">{stat.subtitle}</p>
                </div>
                <Icon className="w-12 h-12 text-white/30" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search Fields
            </label>
            <input
              type="text"
              placeholder="Search by name, API name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Module
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Modules</option>
              <option value="opportunity">Opportunity</option>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="account">Account</option>
              <option value="contract">Contract</option>
              <option value="ticket">Ticket</option>
              <option value="activity">Activity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="picklist">Picklist</option>
              <option value="date">Date</option>
              <option value="boolean">Boolean</option>
              <option value="currency">Currency</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {filteredFields.map((field) => {
          const TypeIcon = getFieldTypeIcon(field.fieldType);
          const ModuleIcon = getModuleIcon(field.module);
          const usagePercent = (field.usage.recordsWithValue / field.usage.totalRecords * 100).toFixed(1);

          return (
            <div
              key={field.id}
              className={`bg-white rounded-lg border-2 transition-all ${
                field.category === 'system' ? 'border-gray-300 bg-gray-50/30' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Field Type Icon */}
                    <div className={`p-3 rounded-lg ${getFieldTypeColor(field.fieldType)} bg-opacity-20`}>
                      <TypeIcon className="w-6 h-6" />
                    </div>

                    {/* Field Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{field.label}</h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-mono rounded">
                          {field.apiName}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getFieldTypeColor(field.fieldType)}`}>
                          {field.fieldType.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(field.category)}`}>
                          {field.category.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{field.description}</p>

                      {/* Field Properties */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <ModuleIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 capitalize">{field.module}</span>
                        </div>
                        {field.isRequired && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-medium text-orange-700">Required</span>
                          </div>
                        )}
                        {field.isUnique && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium text-blue-700">Unique</span>
                          </div>
                        )}
                        {field.isSearchable && (
                          <div className="flex items-center gap-1">
                            <Search className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium text-purple-700">Searchable</span>
                          </div>
                        )}
                        {!field.isEditable && (
                          <div className="flex items-center gap-1">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-700">Read-only</span>
                          </div>
                        )}
                      </div>

                      {/* Validation Rules */}
                      {field.validation && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">VALIDATION</p>
                          <div className="flex flex-wrap gap-2">
                            {field.validation.min !== undefined && (
                              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                Min: {field.validation.min}
                              </span>
                            )}
                            {field.validation.max !== undefined && (
                              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                Max: {field.validation.max}
                              </span>
                            )}
                            {field.validation.pattern && (
                              <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded font-mono">
                                Pattern: {field.validation.pattern}
                              </span>
                            )}
                            {field.validation.options && (
                              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                                {field.validation.options.length} options
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Options for Picklists */}
                      {field.validation?.options && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">OPTIONS</p>
                          <div className="flex flex-wrap gap-1">
                            {field.validation.options.map((option, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Usage Stats */}
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Records with Value</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {field.usage.recordsWithValue} / {field.usage.totalRecords}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Usage Rate</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{usagePercent}%</p>
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  parseFloat(usagePercent) >= 80
                                    ? 'bg-green-500'
                                    : parseFloat(usagePercent) >= 50
                                    ? 'bg-blue-500'
                                    : 'bg-orange-500'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Used</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {field.usage.lastUsed
                              ? new Date(field.usage.lastUsed).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Never'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Created By</p>
                          <p className="text-sm font-semibold text-gray-900">{field.createdBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {field.isActive ? (
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 text-green-600" />
                      </button>
                    ) : (
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      </button>
                    )}
                    <button
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      disabled={field.category === 'system'}
                     
                    >
                      <Edit className={`w-5 h-5 ${field.category === 'system' ? 'text-gray-300' : 'text-blue-600'}`} />
                    </button>
                    <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                      <Copy className="w-5 h-5 text-purple-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={field.category === 'system' || field.category === 'standard'}
                      title={
                        field.category === 'system' || field.category === 'standard'
                          ? 'Cannot delete system/standard fields'
                          : 'Delete Field'
                      }
                    >
                      <Trash2
                        className={`w-5 h-5 ${
                          field.category === 'system' || field.category === 'standard' ? 'text-gray-300' : 'text-red-600'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Custom Field</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field Label</label>
                  <input
                    type="text"
                    placeholder="e.g., Customer Priority"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Name</label>
                  <input
                    type="text"
                    placeholder="e.g., customer_priority"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select module...</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="lead">Lead</option>
                    <option value="contact">Contact</option>
                    <option value="account">Account</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select type...</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="picklist">Picklist</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="currency">Currency</option>
                    <option value="email">Email</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe the purpose of this field..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Help Text</label>
                <input
                  type="text"
                  placeholder="Help text shown to users..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Required field</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Unique values</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Searchable</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Editable</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
