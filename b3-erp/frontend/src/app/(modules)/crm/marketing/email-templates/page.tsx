'use client';

import { useState } from 'react';
import {
  Mail, Search, Plus, Eye, Edit, Copy, Trash2, Play, Pause,
  BarChart3, TrendingUp, Users, Target, Calendar, Clock,
  FileText, Send, CheckCircle, XCircle, AlertCircle, Zap,
  Filter, Download, Upload, Settings, Tag, MoreVertical,
  ArrowUpRight, Sparkles, Activity, MousePointer, Archive
} from 'lucide-react';
import { useToast } from '@/components/ui';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'welcome' | 'follow-up' | 'nurture' | 'promotional' | 'transactional';
  description: string;
  previewText: string;
  content: string;
  status: 'active' | 'inactive' | 'draft';
  tags: string[];
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  createdBy: string;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface AutomationSequence {
  id: string;
  name: string;
  trigger: 'new_lead' | 'status_change' | 'time_based' | 'form_submit' | 'purchase' | 'abandoned_cart';
  status: 'active' | 'paused' | 'draft';
  steps: number;
  enrolled: number;
  completed: number;
  avgCompletionTime: string;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Welcome Series - First Contact',
    subject: 'Welcome to {{company_name}} - Let\'s Get Started!',
    category: 'welcome',
    description: 'Initial welcome email for new leads and customers',
    previewText: 'Thanks for joining us. Here\'s what to expect next...',
    content: 'Welcome email content with personalization...',
    status: 'active',
    tags: ['onboarding', 'new-customer', 'automated'],
    usageCount: 1245,
    lastUsed: '2025-10-27',
    createdAt: '2025-01-15',
    createdBy: 'Sarah Johnson',
    openRate: 68.5,
    clickRate: 24.3,
    conversionRate: 12.8
  },
  {
    id: 'TPL-002',
    name: 'Product Demo Follow-up',
    subject: 'Great meeting you, {{customer_name}}! Next steps for {{company}}',
    category: 'follow-up',
    description: 'Follow-up email after product demonstration',
    previewText: 'Thank you for attending our demo. Here are the resources we discussed...',
    content: 'Demo follow-up content...',
    status: 'active',
    tags: ['demo', 'follow-up', 'sales'],
    usageCount: 867,
    lastUsed: '2025-10-26',
    createdAt: '2025-02-20',
    createdBy: 'Michael Chen',
    openRate: 72.1,
    clickRate: 31.5,
    conversionRate: 18.2
  },
  {
    id: 'TPL-003',
    name: 'Monthly Newsletter - Industry Insights',
    subject: 'Manufacturing Trends: {{month}} Edition',
    category: 'nurture',
    description: 'Monthly newsletter with industry insights and updates',
    previewText: 'This month\'s top trends and insights for manufacturing leaders...',
    content: 'Newsletter content...',
    status: 'active',
    tags: ['newsletter', 'nurture', 'content'],
    usageCount: 2134,
    lastUsed: '2025-10-25',
    createdAt: '2025-01-10',
    createdBy: 'Emily Rodriguez',
    openRate: 45.8,
    clickRate: 15.2,
    conversionRate: 5.4
  },
  {
    id: 'TPL-004',
    name: 'Limited Time Offer - Q4 Promotion',
    subject: 'Exclusive Q4 Savings: {{discount_percentage}}% Off for {{company}}',
    category: 'promotional',
    description: 'Promotional email for quarterly sales campaign',
    previewText: 'Special pricing just for you. Valid until {{expiry_date}}...',
    content: 'Promotional content...',
    status: 'active',
    tags: ['promotion', 'discount', 'seasonal'],
    usageCount: 543,
    lastUsed: '2025-10-24',
    createdAt: '2025-09-01',
    createdBy: 'David Martinez',
    openRate: 58.3,
    clickRate: 22.7,
    conversionRate: 15.9
  },
  {
    id: 'TPL-005',
    name: 'Order Confirmation',
    subject: 'Order #{{order_id}} Confirmed - Thank you!',
    category: 'transactional',
    description: 'Automated order confirmation email',
    previewText: 'Your order has been confirmed and is being processed...',
    content: 'Order confirmation details...',
    status: 'active',
    tags: ['transactional', 'order', 'automated'],
    usageCount: 3421,
    lastUsed: '2025-10-28',
    createdAt: '2024-12-05',
    createdBy: 'System',
    openRate: 89.2,
    clickRate: 35.6,
    conversionRate: 8.3
  },
  {
    id: 'TPL-006',
    name: 'Lead Nurture - Educational Series Day 3',
    subject: 'Mastering {{topic}}: Advanced Strategies',
    category: 'nurture',
    description: 'Third email in educational nurture sequence',
    previewText: 'Today we\'re diving deeper into best practices...',
    content: 'Educational content...',
    status: 'active',
    tags: ['nurture', 'education', 'series'],
    usageCount: 698,
    lastUsed: '2025-10-27',
    createdAt: '2025-03-12',
    createdBy: 'Sarah Johnson',
    openRate: 52.4,
    clickRate: 19.8,
    conversionRate: 9.2
  },
  {
    id: 'TPL-007',
    name: 'Abandoned Quote Follow-up',
    subject: 'Your quote for {{product_name}} is waiting',
    category: 'follow-up',
    description: 'Re-engagement email for abandoned quotes',
    previewText: 'We noticed you didn\'t complete your quote. Can we help?',
    content: 'Abandoned quote content...',
    status: 'active',
    tags: ['follow-up', 'abandoned', 'recovery'],
    usageCount: 421,
    lastUsed: '2025-10-26',
    createdAt: '2025-04-08',
    createdBy: 'Michael Chen',
    openRate: 61.7,
    clickRate: 28.4,
    conversionRate: 21.5
  },
  {
    id: 'TPL-008',
    name: 'Customer Feedback Request',
    subject: 'How was your experience with {{company_name}}?',
    category: 'transactional',
    description: 'Post-purchase feedback and review request',
    previewText: 'We\'d love to hear about your experience...',
    content: 'Feedback request content...',
    status: 'active',
    tags: ['feedback', 'survey', 'post-purchase'],
    usageCount: 1567,
    lastUsed: '2025-10-27',
    createdAt: '2025-02-28',
    createdBy: 'Emily Rodriguez',
    openRate: 42.1,
    clickRate: 31.8,
    conversionRate: 24.6
  },
  {
    id: 'TPL-009',
    name: 'Webinar Invitation',
    subject: 'You\'re Invited: {{webinar_title}} on {{date}}',
    category: 'promotional',
    description: 'Invitation to upcoming webinar or event',
    previewText: 'Join us for an exclusive webinar featuring industry experts...',
    content: 'Webinar invitation content...',
    status: 'active',
    tags: ['webinar', 'event', 'invitation'],
    usageCount: 892,
    lastUsed: '2025-10-25',
    createdAt: '2025-05-18',
    createdBy: 'David Martinez',
    openRate: 55.9,
    clickRate: 42.3,
    conversionRate: 18.7
  },
  {
    id: 'TPL-010',
    name: 'Re-engagement - We Miss You',
    subject: 'We miss you, {{customer_name}}. Here\'s something special!',
    category: 'nurture',
    description: 'Win-back campaign for inactive customers',
    previewText: 'It\'s been a while! Here\'s an exclusive offer to welcome you back...',
    content: 'Re-engagement content...',
    status: 'active',
    tags: ['re-engagement', 'win-back', 'inactive'],
    usageCount: 324,
    lastUsed: '2025-10-23',
    createdAt: '2025-06-22',
    createdBy: 'Sarah Johnson',
    openRate: 38.6,
    clickRate: 16.9,
    conversionRate: 11.3
  },
  {
    id: 'TPL-011',
    name: 'Case Study Spotlight',
    subject: 'See how {{customer_company}} achieved {{result}}',
    category: 'nurture',
    description: 'Customer success story and case study',
    previewText: 'Discover how companies like yours are succeeding...',
    content: 'Case study content...',
    status: 'draft',
    tags: ['case-study', 'social-proof', 'nurture'],
    usageCount: 0,
    lastUsed: 'Never',
    createdAt: '2025-10-15',
    createdBy: 'Michael Chen',
    openRate: 0,
    clickRate: 0,
    conversionRate: 0
  }
];

const mockAutomationSequences: AutomationSequence[] = [
  {
    id: 'SEQ-001',
    name: 'New Lead Onboarding',
    trigger: 'new_lead',
    status: 'active',
    steps: 5,
    enrolled: 1234,
    completed: 892,
    avgCompletionTime: '7 days'
  },
  {
    id: 'SEQ-002',
    name: 'Post-Demo Nurture',
    trigger: 'status_change',
    status: 'active',
    steps: 4,
    enrolled: 567,
    completed: 423,
    avgCompletionTime: '5 days'
  },
  {
    id: 'SEQ-003',
    name: 'Quarterly Newsletter Series',
    trigger: 'time_based',
    status: 'active',
    steps: 3,
    enrolled: 5678,
    completed: 4890,
    avgCompletionTime: '90 days'
  },
  {
    id: 'SEQ-004',
    name: 'Abandoned Cart Recovery',
    trigger: 'abandoned_cart',
    status: 'paused',
    steps: 3,
    enrolled: 234,
    completed: 156,
    avgCompletionTime: '3 days'
  }
];

export default function EmailTemplatesPage() {
  const { addToast } = useToast();
  const [templates] = useState<EmailTemplate[]>(mockTemplates);
  const [sequences] = useState<AutomationSequence[]>(mockAutomationSequences);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | EmailTemplate['category']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.status === 'active').length,
    totalSent: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgOpenRate: templates.reduce((sum, t) => sum + t.openRate, 0) / templates.length,
    avgClickRate: templates.reduce((sum, t) => sum + t.clickRate, 0) / templates.length,
    avgConversionRate: templates.reduce((sum, t) => sum + t.conversionRate, 0) / templates.length
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'welcome': return 'bg-blue-100 text-blue-700';
      case 'follow-up': return 'bg-purple-100 text-purple-700';
      case 'nurture': return 'bg-green-100 text-green-700';
      case 'promotional': return 'bg-orange-100 text-orange-700';
      case 'transactional': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'new_lead': return <Users className="w-4 h-4" />;
      case 'status_change': return <Activity className="w-4 h-4" />;
      case 'time_based': return <Clock className="w-4 h-4" />;
      case 'form_submit': return <FileText className="w-4 h-4" />;
      case 'purchase': return <CheckCircle className="w-4 h-4" />;
      case 'abandoned_cart': return <AlertCircle className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const handleCloneTemplate = (template: EmailTemplate) => {
    addToast({
      title: 'Template Cloned',
      message: `"${template.name}" has been cloned successfully`,
      variant: 'success'
    });
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    addToast({
      title: 'Template Deleted',
      message: `"${template.name}" has been deleted`,
      variant: 'success'
    });
  };

  const handleToggleStatus = (template: EmailTemplate) => {
    const newStatus = template.status === 'active' ? 'inactive' : 'active';
    addToast({
      title: 'Status Updated',
      message: `Template is now ${newStatus}`,
      variant: 'success'
    });
  };

  const handleCreateTemplate = () => {
    addToast({
      title: 'Template Created',
      message: 'New email template created successfully',
      variant: 'success'
    });
  };

  const handleRunABTest = (template: EmailTemplate) => {
    addToast({
      title: 'A/B Test Started',
      message: `A/B test initiated for "${template.name}"`,
      variant: 'info'
    });
  };

  return (
    <div className="w-full h-full px-3 py-2  space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates & Automation</h1>
          <p className="text-sm text-gray-600 mt-1">Create, manage, and automate email campaigns</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalTemplates}</div>
          <div className="text-blue-100 text-sm">Total Templates</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.activeTemplates}</div>
          <div className="text-green-100 text-sm">Active</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalSent.toLocaleString()}</div>
          <div className="text-purple-100 text-sm">Emails Sent</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.avgOpenRate.toFixed(1)}%</div>
          <div className="text-orange-100 text-sm">Avg Open Rate</div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <MousePointer className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.avgClickRate.toFixed(1)}%</div>
          <div className="text-teal-100 text-sm">Avg Click Rate</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.avgConversionRate.toFixed(1)}%</div>
          <div className="text-pink-100 text-sm">Avg Conversion</div>
        </div>
      </div>

      {/* Automation Sequences Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Active Automation Sequences</h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {sequences.map(sequence => (
              <div key={sequence.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTriggerIcon(sequence.trigger)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(sequence.status)}`}>
                      {sequence.status}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{sequence.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Steps:</span>
                    <span className="font-medium text-gray-900">{sequence.steps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enrolled:</span>
                    <span className="font-medium text-gray-900">{sequence.enrolled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium text-gray-900">{sequence.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Time:</span>
                    <span className="font-medium text-gray-900">{sequence.avgCompletionTime}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(sequence.completed / sequence.enrolled) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {((sequence.completed / sequence.enrolled) * 100).toFixed(1)}% completion rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="welcome">Welcome</option>
              <option value="follow-up">Follow-up</option>
              <option value="nurture">Nurture</option>
              <option value="promotional">Promotional</option>
              <option value="transactional">Transactional</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    {template.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{template.description}</p>
                  <p className="text-sm text-gray-900 font-medium">Subject: {template.subject}</p>
                </div>
              </div>

              {/* Template Stats */}
              <div className="grid grid-cols-4 gap-3 mb-2">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-blue-600 mb-1">
                    <Send className="w-3 h-3" />
                    <span className="text-xs">Sent</span>
                  </div>
                  <div className="text-lg font-bold text-blue-900">{template.usageCount}</div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-green-600 mb-1">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">Open</span>
                  </div>
                  <div className="text-lg font-bold text-green-900">{template.openRate.toFixed(1)}%</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-purple-600 mb-1">
                    <MousePointer className="w-3 h-3" />
                    <span className="text-xs">Click</span>
                  </div>
                  <div className="text-lg font-bold text-purple-900">{template.clickRate.toFixed(1)}%</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-orange-600 mb-1">
                    <Target className="w-3 h-3" />
                    <span className="text-xs">Conv</span>
                  </div>
                  <div className="text-lg font-bold text-orange-900">{template.conversionRate.toFixed(1)}%</div>
                </div>
              </div>

              {/* Template Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span>Created by {template.createdBy}</span>
                  <span>Last used: {template.lastUsed}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Preview</span>
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Edit className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Edit</span>
                </button>
                <button
                  onClick={() => handleCloneTemplate(template)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Clone</span>
                </button>
                <button
                  onClick={() => handleRunABTest(template)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600">A/B Test</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal Placeholder */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Template Preview</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Template Name</label>
                  <p className="text-gray-900 mt-1">{selectedTemplate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject Line</label>
                  <p className="text-gray-900 mt-1">{selectedTemplate.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Preview Text</label>
                  <p className="text-gray-600 mt-1">{selectedTemplate.previewText}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Body</label>
                  <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-gray-600 italic">WYSIWYG Editor Placeholder</p>
                    <p className="text-sm text-gray-500 mt-2">Rich text editor would be implemented here with merge fields support: {'{'}{'{'} customer_name {'}'}{'}'}, {'{'}{'{'} company {'}'}{'}'}, etc.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
