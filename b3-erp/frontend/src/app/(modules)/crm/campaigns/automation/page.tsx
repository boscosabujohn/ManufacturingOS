'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Workflow, Plus, Search, Play, Pause, CheckCircle, Clock, Users, Mail, Filter as FilterIcon, TrendingUp, Target, Edit, Copy, Trash2, Eye, GitBranch } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui';

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  triggerType: 'form_submit' | 'list_join' | 'tag_added' | 'date_based' | 'behavior' | 'manual';
  steps: number;
  activeContacts: number;
  completedContacts: number;
  conversionRate: number;
  avgCompletionTime: string;
  createdDate: string;
  lastTriggered?: string;
  owner: string;
}

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Welcome Series - New Customers',
    description: '5-email onboarding sequence for new customers with product tutorials and best practices',
    status: 'active',
    trigger: 'Customer signup completed',
    triggerType: 'form_submit',
    steps: 5,
    activeContacts: 342,
    completedContacts: 1847,
    conversionRate: 68.5,
    avgCompletionTime: '7 days',
    createdDate: '2024-01-15',
    lastTriggered: '2024-10-20T09:30:00',
    owner: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Lead Nurture - Enterprise',
    description: 'Multi-touch campaign for enterprise leads with educational content and case studies',
    status: 'active',
    trigger: 'Added to "Enterprise Prospects" list',
    triggerType: 'list_join',
    steps: 8,
    activeContacts: 156,
    completedContacts: 423,
    conversionRate: 24.3,
    avgCompletionTime: '21 days',
    createdDate: '2024-02-10',
    lastTriggered: '2024-10-19T14:20:00',
    owner: 'Michael Chen',
  },
  {
    id: '3',
    name: 'Webinar Follow-up Sequence',
    description: 'Automated follow-up for webinar attendees with recording, resources, and next steps',
    status: 'active',
    trigger: 'Webinar attendance confirmed',
    triggerType: 'tag_added',
    steps: 3,
    activeContacts: 87,
    completedContacts: 645,
    conversionRate: 32.8,
    avgCompletionTime: '5 days',
    createdDate: '2024-03-20',
    lastTriggered: '2024-10-18T11:00:00',
    owner: 'Emily Rodriguez',
  },
  {
    id: '4',
    name: 'Re-engagement Campaign',
    description: 'Win-back sequence for inactive users with personalized offers and feature highlights',
    status: 'active',
    trigger: '60 days of inactivity',
    triggerType: 'behavior',
    steps: 4,
    activeContacts: 234,
    completedContacts: 892,
    conversionRate: 18.7,
    avgCompletionTime: '14 days',
    createdDate: '2024-04-15',
    lastTriggered: '2024-10-20T08:00:00',
    owner: 'David Martinez',
  },
  {
    id: '5',
    name: 'Product Launch Announcement',
    description: 'Scheduled multi-channel campaign for new product launch with countdown and early access',
    status: 'paused',
    trigger: 'Launch date: Nov 15, 2024',
    triggerType: 'date_based',
    steps: 6,
    activeContacts: 0,
    completedContacts: 0,
    conversionRate: 0,
    avgCompletionTime: '10 days',
    createdDate: '2024-09-01',
    owner: 'Sarah Johnson',
  },
  {
    id: '6',
    name: 'Trial Expiration Reminder',
    description: 'Automated reminders and conversion incentives for trial users approaching expiration',
    status: 'active',
    trigger: '7 days before trial ends',
    triggerType: 'date_based',
    steps: 3,
    activeContacts: 128,
    completedContacts: 567,
    conversionRate: 45.2,
    avgCompletionTime: '7 days',
    createdDate: '2024-05-10',
    lastTriggered: '2024-10-20T07:00:00',
    owner: 'Michael Chen',
  },
  {
    id: '7',
    name: 'Customer Success Check-in',
    description: 'Quarterly check-in sequence for existing customers with satisfaction survey and upsell opportunities',
    status: 'active',
    trigger: 'Every 90 days after purchase',
    triggerType: 'date_based',
    steps: 4,
    activeContacts: 98,
    completedContacts: 234,
    conversionRate: 28.6,
    avgCompletionTime: '14 days',
    createdDate: '2024-06-20',
    lastTriggered: '2024-10-15T10:00:00',
    owner: 'Emily Rodriguez',
  },
  {
    id: '8',
    name: 'Abandoned Cart Recovery',
    description: 'Automated recovery sequence for abandoned quote requests with incentives',
    status: 'draft',
    trigger: 'Quote started but not completed',
    triggerType: 'behavior',
    steps: 3,
    activeContacts: 0,
    completedContacts: 0,
    conversionRate: 0,
    avgCompletionTime: '3 days',
    createdDate: '2024-10-10',
    owner: 'David Martinez',
  },
];

export default function CampaignAutomationPage() {
  const router = useRouter();

  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [filterType, setFilterType] = useState<'all' | 'form_submit' | 'list_join' | 'tag_added' | 'date_based' | 'behavior' | 'manual'>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState<Automation | null>(null);

  // Handler functions for automation actions
  const handleCreateAutomation = () => {
    router.push('/crm/campaigns/automation/create');
  };

  const handleViewAutomation = (automation: Automation) => {
    router.push(`/crm/campaigns/automation/view/${automation.id}`);
  };

  const handleEditAutomation = (automation: Automation) => {
    router.push(`/crm/campaigns/automation/edit/${automation.id}`);
  };

  const handleCopyAutomation = (automation: Automation) => {
    const newAutomation = {
      ...automation,
      id: Date.now().toString(),
      name: `${automation.name} (Copy)`,
      status: 'draft' as const,
      activeContacts: 0,
      completedContacts: 0,
      conversionRate: 0,
      lastTriggered: undefined,
    };
    setAutomations([...automations, newAutomation]);
  };

  const handlePauseAutomation = (automation: Automation) => {
    setAutomations(automations.map(a =>
      a.id === automation.id ? { ...a, status: 'paused' } : a
    ));
  };

  const handlePlayAutomation = (automation: Automation) => {
    setAutomations(automations.map(a =>
      a.id === automation.id ? { ...a, status: 'active' } : a
    ));
  };

  const handleDeleteClick = (automation: Automation) => {
    setAutomationToDelete(automation);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (automationToDelete) {
      setAutomations(automations.filter(a => a.id !== automationToDelete.id));
      setShowDeleteDialog(false);
      setAutomationToDelete(null);
    }
  };

  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || automation.status === filterStatus;
    const matchesType = filterType === 'all' || automation.triggerType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalAutomations: automations.length,
    active: automations.filter(a => a.status === 'active').length,
    activeContacts: automations.reduce((sum, a) => sum + a.activeContacts, 0),
    completedContacts: automations.reduce((sum, a) => sum + a.completedContacts, 0),
    avgConversionRate: automations.filter(a => a.completedContacts > 0).length > 0
      ? automations.filter(a => a.completedContacts > 0).reduce((sum, a) => sum + a.conversionRate, 0) / automations.filter(a => a.completedContacts > 0).length
      : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTriggerTypeColor = (type: string) => {
    switch (type) {
      case 'form_submit': return 'bg-blue-100 text-blue-700';
      case 'list_join': return 'bg-purple-100 text-purple-700';
      case 'tag_added': return 'bg-pink-100 text-pink-700';
      case 'date_based': return 'bg-orange-100 text-orange-700';
      case 'behavior': return 'bg-teal-100 text-teal-700';
      case 'manual': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateAutomation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <Workflow className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalAutomations}</div>
            <div className="text-blue-100">Total Workflows</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <Play className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.active}</div>
            <div className="text-green-100">Active</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <Users className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.activeContacts.toLocaleString()}</div>
            <div className="text-purple-100">In Progress</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <CheckCircle className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{(stats.completedContacts / 1000).toFixed(1)}K</div>
            <div className="text-orange-100">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <Target className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.avgConversionRate.toFixed(1)}%</div>
            <div className="text-teal-100">Avg Conversion</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search automations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Triggers</option>
              <option value="form_submit">Form Submit</option>
              <option value="list_join">List Join</option>
              <option value="tag_added">Tag Added</option>
              <option value="date_based">Date Based</option>
              <option value="behavior">Behavior</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <div key={automation.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{automation.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(automation.status)}`}>
                    {automation.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTriggerTypeColor(automation.triggerType)}`}>
                    {automation.triggerType.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{automation.description}</p>

                <div className="flex items-center gap-6 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Trigger: </span>
                    <span className="font-medium text-gray-900">{automation.trigger}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Steps: </span>
                    <span className="font-medium text-gray-900">{automation.steps}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Owner: </span>
                    <span className="font-medium text-gray-900">{automation.owner}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-purple-600 mb-1">In Progress</div>
                    <div className="text-lg font-bold text-purple-900">{automation.activeContacts.toLocaleString()}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-600 mb-1">Completed</div>
                    <div className="text-lg font-bold text-green-900">{automation.completedContacts.toLocaleString()}</div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-xs text-orange-600 mb-1">Conversion Rate</div>
                    <div className="text-lg font-bold text-orange-900">{automation.conversionRate.toFixed(1)}%</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">Avg Time</div>
                    <div className="text-lg font-bold text-blue-900">{automation.avgCompletionTime}</div>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="text-xs text-teal-600 mb-1">Last Triggered</div>
                    <div className="text-sm font-bold text-teal-900">
                      {automation.lastTriggered ? new Date(automation.lastTriggered).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Created: {new Date(automation.createdDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleViewAutomation(automation)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditAutomation(automation)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleCopyAutomation(automation)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                {automation.status === 'active' && (
                  <button
                    onClick={() => handlePauseAutomation(automation)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-yellow-300 rounded-lg hover:bg-yellow-50 text-sm"
                  >
                    <Pause className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600">Pause</span>
                  </button>
                )}
                {automation.status === 'paused' && (
                  <button
                    onClick={() => handlePlayAutomation(automation)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm"
                  >
                    <Play className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Play</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(automation)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAutomations.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automations found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setAutomationToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Automation"
        message={automationToDelete ? `Are you sure you want to delete "${automationToDelete.name}"? This action cannot be undone and will stop all active workflows.` : ''}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
