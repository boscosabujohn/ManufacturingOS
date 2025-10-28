'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail, Building2, User, Users, Calendar, TrendingUp, X, Globe, Clock, CheckCircle, MessageSquare, FileText, PhoneCall, Video, Send, Activity, ArrowRight, Circle, ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { DataTable, EmptyState, LoadingState, PageToolbar } from '@/components/ui';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source: string;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc',
    email: 'john.smith@techsolutions.com',
    phone: '+1 234-567-8900',
    status: 'qualified',
    source: 'Website',
    value: 45000,
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-01',
    lastContact: '2025-10-08',
  },
  {
    id: '2',
    name: 'Emily Davis',
    company: 'Global Manufacturing Ltd',
    email: 'emily.davis@globalmanuf.com',
    phone: '+1 234-567-8901',
    status: 'new',
    source: 'Referral',
    value: 75000,
    assignedTo: 'Michael Chen',
    createdAt: '2025-10-05',
    lastContact: '2025-10-05',
  },
  {
    id: '3',
    name: 'Robert Wilson',
    company: 'Precision Parts Co',
    email: 'r.wilson@precisionparts.com',
    phone: '+1 234-567-8902',
    status: 'proposal',
    source: 'Trade Show',
    value: 120000,
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-09-28',
    lastContact: '2025-10-07',
  },
  {
    id: '4',
    name: 'Lisa Anderson',
    company: 'Industrial Automation Inc',
    email: 'l.anderson@indauto.com',
    phone: '+1 234-567-8903',
    status: 'negotiation',
    source: 'LinkedIn',
    value: 95000,
    assignedTo: 'David Park',
    createdAt: '2025-09-15',
    lastContact: '2025-10-09',
  },
  {
    id: '5',
    name: 'James Martinez',
    company: 'Smart Systems Corp',
    email: 'j.martinez@smartsys.com',
    phone: '+1 234-567-8904',
    status: 'contacted',
    source: 'Cold Call',
    value: 60000,
    assignedTo: 'Michael Chen',
    createdAt: '2025-10-03',
    lastContact: '2025-10-06',
  },
];

interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'task' | 'proposal' | 'video_call';
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: {
    previousStatus?: string;
    newStatus?: string;
    duration?: string;
    outcome?: string;
    attachments?: number;
  };
}

interface LeadStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  icon: any;
  color: string;
}

// Mock activities for Lead ID 1
const mockActivities: LeadActivity[] = [
  {
    id: 'a1',
    leadId: '1',
    type: 'status_change',
    title: 'Status Changed',
    description: 'Lead status updated from "Contacted" to "Qualified"',
    performedBy: 'Sarah Johnson',
    timestamp: '2025-10-08 14:30',
    metadata: { previousStatus: 'contacted', newStatus: 'qualified' }
  },
  {
    id: 'a2',
    leadId: '1',
    type: 'call',
    title: 'Phone Call',
    description: 'Discussed product requirements and pricing options. Client is interested in modular kitchen solutions.',
    performedBy: 'Sarah Johnson',
    timestamp: '2025-10-08 10:15',
    metadata: { duration: '45 mins', outcome: 'Positive' }
  },
  {
    id: 'a3',
    leadId: '1',
    type: 'email',
    title: 'Email Sent',
    description: 'Sent product catalog and pricing information',
    performedBy: 'Sarah Johnson',
    timestamp: '2025-10-07 16:20',
    metadata: { attachments: 3 }
  },
  {
    id: 'a4',
    leadId: '1',
    type: 'meeting',
    title: 'Site Visit Scheduled',
    description: 'Arranged site visit for kitchen measurement and design consultation on Oct 15, 2025',
    performedBy: 'Sarah Johnson',
    timestamp: '2025-10-06 11:00',
    metadata: { duration: '2 hours' }
  },
  {
    id: 'a5',
    leadId: '1',
    type: 'note',
    title: 'Added Note',
    description: 'Client has a budget of $45K-50K. Looking for premium finish with granite countertops.',
    performedBy: 'Sarah Johnson',
    timestamp: '2025-10-05 09:30'
  },
  {
    id: 'a6',
    leadId: '1',
    type: 'call',
    title: 'Initial Contact',
    description: 'First contact call. Introduced our kitchen solutions and gathered basic requirements.',
    performedBy: 'Sarah Johnson',
    timestamp: '2025-10-02 14:45',
    metadata: { duration: '20 mins', outcome: 'Interested' }
  },
  {
    id: 'a7',
    leadId: '1',
    type: 'status_change',
    title: 'Lead Created',
    description: 'New lead created from website inquiry',
    performedBy: 'System',
    timestamp: '2025-10-01 09:00',
    metadata: { newStatus: 'new' }
  }
];

const getLeadStages = (lead: Lead): LeadStage[] => {
  const stages: LeadStage[] = [
    { id: 'new', name: 'New Lead', status: 'completed', date: lead.createdAt, icon: Circle, color: 'blue' },
    { id: 'contacted', name: 'Contacted', status: 'completed', date: '2025-10-02', icon: PhoneCall, color: 'purple' },
    { id: 'qualified', name: 'Qualified', status: 'current', date: '2025-10-08', icon: CheckCircle, color: 'green' },
    { id: 'proposal', name: 'Proposal Sent', status: 'pending', icon: FileText, color: 'yellow' },
    { id: 'negotiation', name: 'Negotiation', status: 'pending', icon: MessageSquare, color: 'orange' },
    { id: 'won', name: 'Won', status: 'pending', icon: TrendingUp, color: 'emerald' }
  ];

  return stages;
};

const activityIcons = {
  call: PhoneCall,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  status_change: Activity,
  task: CheckCircle,
  proposal: FileText,
  video_call: Video
};

const activityColors = {
  call: 'bg-blue-100 text-blue-600 border-blue-200',
  email: 'bg-purple-100 text-purple-600 border-purple-200',
  meeting: 'bg-green-100 text-green-600 border-green-200',
  note: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  status_change: 'bg-orange-100 text-orange-600 border-orange-200',
  task: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  proposal: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  video_call: 'bg-pink-100 text-pink-600 border-pink-200'
};

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  qualified: 'bg-green-100 text-green-700',
  proposal: 'bg-yellow-100 text-yellow-700',
  negotiation: 'bg-orange-100 text-orange-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: leads.length,
    newLeads: leads.filter((l) => l.status === 'new').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    totalValue: leads.reduce((sum, l) => sum + l.value, 0),
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter((l) => l.id !== id));
    }
  };

  const handleViewLead = (lead: Lead) => {
    router.push(`/crm/leads/view/${lead.id}`);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header with Toolbar */}
      <PageToolbar
       
        subtitle={`${stats.total} leads · ${stats.newLeads} new · ${stats.qualified} qualified`}
        breadcrumbs={[
          { label: 'CRM', href: '/crm' },
          { label: 'Leads' }
        ]}
        actions={[
          {
            label: 'Export',
            icon: Download,
            variant: 'secondary',
            onClick: () => console.log('Export leads')
          },
          {
            label: 'Refresh',
            icon: RefreshCw,
            variant: 'secondary',
            onClick: () => console.log('Refresh leads')
          },
          {
            label: 'Add New Lead',
            icon: Plus,
            variant: 'primary',
            href: '/crm/leads/add'
          }
        ]}
        tabs={[
          { id: 'all', label: 'All Leads', count: stats.total },
          { id: 'new', label: 'New', count: stats.newLeads },
          { id: 'qualified', label: 'Qualified', count: stats.qualified }
        ]}
        activeTab={statusFilter}
        onTabChange={(tabId) => setStatusFilter(tabId === 'all' ? 'all' : tabId)}
      />

      {/* Stats Grid (moved below toolbar) */}
      <div className="mb-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Leads</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">New Leads</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.newLeads}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Qualified</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.qualified}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Total Value</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">${(stats.totalValue / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingState message="Loading leads..." />
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchQuery || statusFilter !== 'all' ? "No leads found" : "No leads yet"}
          description={
            searchQuery || statusFilter !== 'all'
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by adding your first lead to the system."
          }
          action={{
            label: "Add New Lead",
            onClick: () => router.push('/crm/leads/add'),
            icon: Plus
          }}
          secondaryAction={
            searchQuery || statusFilter !== 'all'
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }
                }
              : undefined
          }
        />
      ) : (
        <DataTable
          data={filteredLeads}
          columns={[
          {
            key: 'name',
            header: 'Lead',
            sortable: true,
            render: (lead) => (
              <div>
                <div className="font-medium text-gray-900">{lead.name}</div>
                <div className="text-sm text-gray-500">{lead.source}</div>
              </div>
            )
          },
          {
            key: 'company',
            header: 'Company',
            sortable: true
          },
          {
            key: 'email',
            header: 'Contact',
            render: (lead) => (
              <div>
                <div className="text-sm">{lead.email}</div>
                <div className="text-sm text-gray-500">{lead.phone}</div>
              </div>
            )
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (lead) => (
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lead.status as keyof typeof statusColors] || ""}`}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
            )
          },
          {
            key: 'value',
            header: 'Value',
            sortable: true,
            render: (lead) => (
              <span className="font-semibold">${lead.value.toLocaleString()}</span>
            )
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (lead) => (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleViewLead(lead)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                 
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => router.push(`/crm/leads/edit/${lead.id}`)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                 
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteLead(lead.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                 
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )
          }
        ]}
        pagination={{
          enabled: true,
          pageSize: itemsPerPage,
          currentPage: currentPage,
          onPageChange: setCurrentPage
        }}
        sorting={{
          enabled: true,
          defaultSort: { column: 'name', direction: 'asc' }
        }}
        onRowClick={(lead) => handleViewLead(lead)}
        />
      )}

      {/* Lead Detail Modal - Enhanced View */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h2>
                  <p className="text-sm text-gray-600">{selectedLead.company}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Status and Value Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-xs font-medium text-green-600 uppercase mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedLead.status]}`}>
                    {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs font-medium text-blue-600 uppercase mb-1">Deal Value</p>
                  <p className="text-2xl font-bold text-blue-900">${selectedLead.value.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs font-medium text-purple-600 uppercase mb-1">Source</p>
                  <p className="text-lg font-semibold text-purple-900">{selectedLead.source}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <p className="text-xs font-medium text-orange-600 uppercase mb-1">Assigned To</p>
                  <p className="text-lg font-semibold text-orange-900">{selectedLead.assignedTo}</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Name</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Job Title</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Company Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Company Name</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedLead.company}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Website</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Industry</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Company Size</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                        <a href={`mailto:${selectedLead.email}`} className="text-sm text-blue-600 hover:underline break-all">{selectedLead.email}</a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                        <a href={`tel:${selectedLead.phone}`} className="text-sm text-blue-600 hover:underline">{selectedLead.phone}</a>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Mobile</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Fax</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Street Address</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">City</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">State/Province</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Postal Code</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Country</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Lead Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Lead Status</p>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[selectedLead.status]}`}>
                        {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Lead Rating</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Lead Source</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedLead.source}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Sub-Source</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Referred By</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Campaign</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunity Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Opportunity Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Estimated Value</p>
                      <p className="text-lg font-bold text-blue-900">${selectedLead.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Expected Close Date</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Win Probability</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Product Interest</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Social Media
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">LinkedIn</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Twitter</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Facebook</p>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Progress Tracker */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Lead Progress
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6">
                  {/* Progress Stages */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {getLeadStages(selectedLead).map((stage, index) => {
                        const StageIcon = stage.icon;
                        const isLast = index === getLeadStages(selectedLead).length - 1;

                        return (
                          <div key={stage.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center relative z-10">
                              {/* Stage Icon */}
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                stage.status === 'completed'
                                  ? 'bg-green-500 border-green-600'
                                  : stage.status === 'current'
                                  ? 'bg-blue-500 border-blue-600 ring-4 ring-blue-200'
                                  : 'bg-gray-200 border-gray-300'
                              }`}>
                                <StageIcon className={`h-6 w-6 ${
                                  stage.status === 'completed' || stage.status === 'current'
                                    ? 'text-white'
                                    : 'text-gray-400'
                                }`} />
                              </div>

                              {/* Stage Name */}
                              <div className="mt-2 text-center">
                                <p className={`text-xs font-semibold ${
                                  stage.status === 'current' ? 'text-blue-900' : 'text-gray-700'
                                }`}>
                                  {stage.name}
                                </p>
                                {stage.date && (
                                  <p className="text-xs text-gray-500 mt-0.5">{stage.date}</p>
                                )}
                              </div>
                            </div>

                            {/* Connector Line */}
                            {!isLast && (
                              <div className={`flex-1 h-1 mx-2 rounded ${
                                stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Activity Timeline
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {/* Add Activity Actions */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
                      <PhoneCall className="h-4 w-4" />
                      <span>Log Call</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium">
                      <Mail className="h-4 w-4" />
                      <span>Send Email</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule Meeting</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      <span>Add Note</span>
                    </button>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {mockActivities
                      .filter(activity => activity.leadId === selectedLead.id)
                      .map((activity, index) => {
                        const ActivityIcon = activityIcons[activity.type];
                        const isLast = index === mockActivities.filter(a => a.leadId === selectedLead.id).length - 1;

                        return (
                          <div key={activity.id} className="relative">
                            {/* Timeline connector */}
                            {!isLast && (
                              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-300"></div>
                            )}

                            <div className="flex items-start space-x-3">
                              {/* Activity Icon */}
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${activityColors[activity.type]}`}>
                                <ActivityIcon className="h-5 w-5" />
                              </div>

                              {/* Activity Content */}
                              <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">{activity.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      by {activity.performedBy} • {activity.timestamp}
                                    </p>
                                  </div>
                                  {activity.metadata?.outcome && (
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                      activity.metadata.outcome === 'Positive'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {activity.metadata.outcome}
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-700 mb-2">{activity.description}</p>

                                {/* Activity Metadata */}
                                {activity.metadata && (
                                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                    {activity.metadata.duration && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{activity.metadata.duration}</span>
                                      </div>
                                    )}
                                    {activity.metadata.attachments && (
                                      <div className="flex items-center space-x-1">
                                        <FileText className="h-3 w-3" />
                                        <span>{activity.metadata.attachments} attachments</span>
                                      </div>
                                    )}
                                    {activity.metadata.previousStatus && activity.metadata.newStatus && (
                                      <div className="flex items-center space-x-1">
                                        <ArrowRight className="h-3 w-3" />
                                        <span className="capitalize">{activity.metadata.previousStatus}</span>
                                        <ArrowRight className="h-3 w-3" />
                                        <span className="capitalize font-semibold">{activity.metadata.newStatus}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Key Dates
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedLead.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <PhoneCall className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Last Contact</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedLead.lastContact}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Activities</p>
                        <p className="text-sm font-semibold text-gray-900">{mockActivities.filter(a => a.leadId === selectedLead.id).length} Total</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push(`/crm/leads/edit/${selectedLead.id}`)}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Lead</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
