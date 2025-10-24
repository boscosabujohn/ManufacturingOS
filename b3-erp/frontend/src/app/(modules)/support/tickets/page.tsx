'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, MessageSquare, Clock, User, AlertCircle, CheckCircle, XCircle, Filter, Download, ArrowUpDown, ChevronLeft, ChevronRight, Calendar, Tag, Mail, Phone, Ticket, RefreshCw } from 'lucide-react';
import { FilterPanel, EmptyState, LoadingState, PageToolbar } from '@/components/ui';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  assignedTo: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed' | 'reopened';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'billing' | 'general' | 'complaint' | 'feature_request' | 'installation';
  createdDate: string;
  lastUpdated: string;
  resolvedDate?: string;
  responseTime: number;
  resolutionTime?: number;
  slaStatus: 'within_sla' | 'approaching_sla' | 'breached_sla';
  tags: string[];
  attachments: number;
  comments: number;
  source: 'email' | 'phone' | 'portal' | 'chat' | 'walk_in';
  department: string;
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2025-001',
    subject: 'Installation issue with modular kitchen hardware',
    description: 'Customer facing issues with soft-close hinge installation on upper cabinets',
    customer: 'Sharma Modular Kitchens Pvt Ltd',
    customerEmail: 'rajesh@sharmakitchens.co.in',
    customerPhone: '+91-98765-43210',
    assignedTo: 'Rahul Kumar',
    status: 'in_progress',
    priority: 'high',
    category: 'technical',
    createdDate: '2025-10-15',
    lastUpdated: '2025-10-17',
    responseTime: 45,
    slaStatus: 'within_sla',
    tags: ['hardware', 'installation', 'urgent'],
    attachments: 3,
    comments: 5,
    source: 'email',
    department: 'Technical Support',
  },
  {
    id: '2',
    ticketNumber: 'TKT-2025-002',
    subject: 'Invoice discrepancy for Order #SO-2025-0342',
    description: 'Customer reporting mismatch in quantities between delivery note and invoice',
    customer: 'Urban Interiors & Designers',
    customerEmail: 'anita@urbaninteriors.in',
    customerPhone: '+91-98123-45678',
    assignedTo: 'Priya Patel',
    status: 'pending',
    priority: 'medium',
    category: 'billing',
    createdDate: '2025-10-14',
    lastUpdated: '2025-10-16',
    responseTime: 120,
    slaStatus: 'within_sla',
    tags: ['billing', 'invoice', 'discrepancy'],
    attachments: 2,
    comments: 3,
    source: 'phone',
    department: 'Finance',
  },
  {
    id: '3',
    ticketNumber: 'TKT-2025-003',
    subject: 'Damaged goods received - Drawer channels',
    description: 'Multiple drawer channels arrived damaged in shipment SHP-2025-0567',
    customer: 'Prestige Developers Bangalore',
    customerEmail: 'suresh.m@prestigedev.co.in',
    customerPhone: '+91-80-2345-6789',
    assignedTo: 'Amit Singh',
    status: 'open',
    priority: 'critical',
    category: 'complaint',
    createdDate: '2025-10-17',
    lastUpdated: '2025-10-17',
    responseTime: 15,
    slaStatus: 'approaching_sla',
    tags: ['damaged', 'replacement', 'priority'],
    attachments: 8,
    comments: 2,
    source: 'portal',
    department: 'Quality Control',
  },
  {
    id: '4',
    ticketNumber: 'TKT-2025-004',
    subject: 'Request for custom finish samples',
    description: 'Customer requesting physical samples of custom laminate finishes for approval',
    customer: 'Archana Architects Associates',
    customerEmail: 'archana@archanarchitects.com',
    customerPhone: '+91-22-4567-8901',
    assignedTo: 'Sanjay Gupta',
    status: 'resolved',
    priority: 'low',
    category: 'general',
    createdDate: '2025-10-10',
    lastUpdated: '2025-10-12',
    resolvedDate: '2025-10-12',
    responseTime: 60,
    resolutionTime: 2880,
    slaStatus: 'within_sla',
    tags: ['samples', 'custom', 'finishes'],
    attachments: 0,
    comments: 4,
    source: 'email',
    department: 'Sales Support',
  },
  {
    id: '5',
    ticketNumber: 'TKT-2025-005',
    subject: 'Mobile app feature request - BOQ export',
    description: 'Request to add PDF export functionality for BOQ in mobile application',
    customer: 'DLF Home Solutions Limited',
    customerEmail: 'karthik.r@dlfhomes.co.in',
    customerPhone: '+91-40-3456-7890',
    assignedTo: 'Vikram Reddy',
    status: 'open',
    priority: 'low',
    category: 'feature_request',
    createdDate: '2025-10-16',
    lastUpdated: '2025-10-17',
    responseTime: 240,
    slaStatus: 'within_sla',
    tags: ['enhancement', 'mobile', 'export'],
    attachments: 1,
    comments: 1,
    source: 'portal',
    department: 'IT',
  },
  {
    id: '6',
    ticketNumber: 'TKT-2025-006',
    subject: 'Installation team not arrived on scheduled date',
    description: 'Installation team scheduled for 15th Oct did not arrive at site',
    customer: 'Godrej Furniture & Interiors',
    customerEmail: 'neha.k@godrejinteriors.com',
    customerPhone: '+91-21-4567-8912',
    assignedTo: 'Rahul Kumar',
    status: 'reopened',
    priority: 'critical',
    category: 'installation',
    createdDate: '2025-10-15',
    lastUpdated: '2025-10-17',
    responseTime: 30,
    slaStatus: 'breached_sla',
    tags: ['installation', 'scheduling', 'urgent'],
    attachments: 0,
    comments: 7,
    source: 'phone',
    department: 'Installation Services',
  },
  {
    id: '7',
    ticketNumber: 'TKT-2025-007',
    subject: 'Payment gateway issue on customer portal',
    description: 'Unable to process payment through portal, getting error code PG-404',
    customer: 'Oberoi Realty Projects',
    customerEmail: 'manish@oberoirealty.co.in',
    customerPhone: '+91-22-6789-0123',
    assignedTo: 'Vikram Reddy',
    status: 'in_progress',
    priority: 'high',
    category: 'technical',
    createdDate: '2025-10-16',
    lastUpdated: '2025-10-17',
    responseTime: 90,
    slaStatus: 'within_sla',
    tags: ['portal', 'payment', 'technical'],
    attachments: 2,
    comments: 4,
    source: 'chat',
    department: 'IT',
  },
  {
    id: '8',
    ticketNumber: 'TKT-2025-008',
    subject: 'Delay in delivery acknowledgment',
    description: 'Awaiting delivery confirmation for PO-2025-0892 placed 2 weeks ago',
    customer: 'Decor Studio Chennai',
    customerEmail: 'lakshmi@decorstudio.co.in',
    customerPhone: '+91-44-2876-5432',
    assignedTo: 'Priya Patel',
    status: 'pending',
    priority: 'medium',
    category: 'general',
    createdDate: '2025-10-13',
    lastUpdated: '2025-10-16',
    responseTime: 180,
    slaStatus: 'approaching_sla',
    tags: ['delivery', 'confirmation', 'follow-up'],
    attachments: 1,
    comments: 2,
    source: 'email',
    department: 'Logistics',
  },
  {
    id: '9',
    ticketNumber: 'TKT-2025-009',
    subject: 'Product catalog access request',
    description: 'New customer requesting access to complete product catalog with pricing',
    customer: 'Royal Homes Hyderabad',
    customerEmail: 'vikram@royalhomes.co.in',
    customerPhone: '+91-40-4567-8901',
    assignedTo: 'Sanjay Gupta',
    status: 'closed',
    priority: 'low',
    category: 'general',
    createdDate: '2025-10-08',
    lastUpdated: '2025-10-09',
    resolvedDate: '2025-10-09',
    responseTime: 30,
    resolutionTime: 1440,
    slaStatus: 'within_sla',
    tags: ['catalog', 'access', 'new-customer'],
    attachments: 0,
    comments: 2,
    source: 'walk_in',
    department: 'Sales Support',
  },
  {
    id: '10',
    ticketNumber: 'TKT-2025-010',
    subject: 'Credit limit increase request',
    description: 'Customer requesting credit limit increase from 5L to 10L for ongoing projects',
    customer: 'Cosmos Furniture Mart',
    customerEmail: 'ramesh@cosmosfurniture.in',
    customerPhone: '+91-22-3456-7890',
    assignedTo: 'Priya Patel',
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    createdDate: '2025-10-14',
    lastUpdated: '2025-10-17',
    responseTime: 60,
    slaStatus: 'within_sla',
    tags: ['credit', 'approval', 'finance'],
    attachments: 3,
    comments: 6,
    source: 'email',
    department: 'Finance',
  },
];

const statusColors = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
  reopened: 'bg-red-100 text-red-700',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const slaColors = {
  within_sla: 'bg-green-100 text-green-700',
  approaching_sla: 'bg-yellow-100 text-yellow-700',
  breached_sla: 'bg-red-100 text-red-700',
};

const categoryColors = {
  technical: 'bg-purple-100 text-purple-700',
  billing: 'bg-blue-100 text-blue-700',
  general: 'bg-gray-100 text-gray-700',
  complaint: 'bg-red-100 text-red-700',
  feature_request: 'bg-green-100 text-green-700',
  installation: 'bg-orange-100 text-orange-700',
};

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Ticket | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    const matchesAssignedTo = assignedToFilter === 'all' || ticket.assignedTo === assignedToFilter;
    const matchesSla = slaFilter === 'all' || ticket.slaStatus === slaFilter;
    const matchesSource = sourceFilter === 'all' || ticket.source === sourceFilter;
    const matchesDepartment = departmentFilter === 'all' || ticket.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory &&
           matchesAssignedTo && matchesSla && matchesSource && matchesDepartment;
  });

  if (sortField) {
    filteredTickets = [...filteredTickets].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const assignees = Array.from(new Set(tickets.map(t => t.assignedTo)));
  const departments = Array.from(new Set(tickets.map(t => t.department)));

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    avgResponseTime: Math.round(tickets.reduce((sum, t) => sum + t.responseTime, 0) / tickets.length),
    slaBreach: tickets.filter((t) => t.slaStatus === 'breached_sla').length,
    critical: tickets.filter((t) => t.priority === 'critical').length,
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      setTickets(tickets.filter((t) => t.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exporting ticket data to CSV...');
    console.log('Exporting tickets:', filteredTickets);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(paginatedTickets.map(t => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const isAllSelected = paginatedTickets.length > 0 && paginatedTickets.every(t => selectedTickets.includes(t.id));

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header with Toolbar */}
      <PageToolbar
        title="Support Tickets"
        subtitle={`${stats.total} tickets · ${stats.open} open · ${stats.slaBreach} SLA breach`}
        breadcrumbs={[
          { label: 'Support', href: '/support' },
          { label: 'Tickets' }
        ]}
        actions={[
          {
            label: 'Export',
            icon: Download,
            variant: 'secondary',
            onClick: handleExport
          },
          {
            label: 'Refresh',
            icon: RefreshCw,
            variant: 'secondary',
            onClick: () => console.log('Refresh tickets')
          },
          {
            label: 'New Ticket',
            icon: Plus,
            variant: 'primary',
            href: '/support/tickets/create'
          }
        ]}
        searchPlaceholder="Search tickets by number, subject, customer..."
        onSearch={(query) => setSearchQuery(query)}
        filterCount={showAdvancedFilters ? 7 : 0}
        onFilterToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      <div className="mb-6 mt-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Open</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg Response</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.avgResponseTime}m</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">SLA Breach</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.slaBreach}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Critical</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.critical}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">

        {selectedTickets.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedTickets.length} ticket{selectedTickets.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedTickets([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Assign Bulk
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                Update Status
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {showAdvancedFilters && (
          <FilterPanel
            filters={[
              {
                id: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'all', label: 'All Status' },
                  { value: 'open', label: 'Open' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' },
                  { value: 'reopened', label: 'Reopened' }
                ]
              },
              {
                id: 'priority',
                label: 'Priority',
                type: 'select',
                options: [
                  { value: 'all', label: 'All Priorities' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' }
                ]
              },
              {
                id: 'category',
                label: 'Category',
                type: 'select',
                options: [
                  { value: 'all', label: 'All Categories' },
                  { value: 'technical', label: 'Technical' },
                  { value: 'billing', label: 'Billing' },
                  { value: 'general', label: 'General' },
                  { value: 'complaint', label: 'Complaint' },
                  { value: 'feature_request', label: 'Feature Request' },
                  { value: 'installation', label: 'Installation' }
                ]
              },
              {
                id: 'sla',
                label: 'SLA Status',
                type: 'select',
                options: [
                  { value: 'all', label: 'All SLA Status' },
                  { value: 'within_sla', label: 'Within SLA' },
                  { value: 'approaching_sla', label: 'Approaching SLA' },
                  { value: 'breached_sla', label: 'Breached SLA' }
                ]
              },
              {
                id: 'assignedTo',
                label: 'Assigned To',
                type: 'select',
                options: [
                  { value: 'all', label: 'All Assignees' },
                  ...assignees.map(a => ({ value: a, label: a }))
                ]
              },
              {
                id: 'source',
                label: 'Source',
                type: 'select',
                options: [
                  { value: 'all', label: 'All Sources' },
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: 'Phone' },
                  { value: 'portal', label: 'Portal' },
                  { value: 'chat', label: 'Chat' },
                  { value: 'walk_in', label: 'Walk-in' }
                ]
              },
              {
                id: 'department',
                label: 'Department',
                type: 'select',
                options: [
                  { value: 'all', label: 'All Departments' },
                  ...departments.map(d => ({ value: d, label: d }))
                ]
              }
            ]}
            activeFilters={{
              status: statusFilter,
              priority: priorityFilter,
              category: categoryFilter,
              sla: slaFilter,
              assignedTo: assignedToFilter,
              source: sourceFilter,
              department: departmentFilter
            }}
            onFilterChange={(filterId, value) => {
              switch (filterId) {
                case 'status': setStatusFilter(value); break;
                case 'priority': setPriorityFilter(value); break;
                case 'category': setCategoryFilter(value); break;
                case 'sla': setSlaFilter(value); break;
                case 'assignedTo': setAssignedToFilter(value); break;
                case 'source': setSourceFilter(value); break;
                case 'department': setDepartmentFilter(value); break;
              }
            }}
            onClearAll={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
              setCategoryFilter('all');
              setSlaFilter('all');
              setAssignedToFilter('all');
              setSourceFilter('all');
              setDepartmentFilter('all');
            }}
          />
        )}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-8">
          <LoadingState message="Loading tickets..." />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-8">
          <EmptyState
            icon={Ticket}
            title={
              searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ||
              categoryFilter !== 'all' || assignedToFilter !== 'all' ||
              slaFilter !== 'all' || sourceFilter !== 'all' || departmentFilter !== 'all'
                ? "No tickets found"
                : "No tickets yet"
            }
            description={
              searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ||
              categoryFilter !== 'all' || assignedToFilter !== 'all' ||
              slaFilter !== 'all' || sourceFilter !== 'all' || departmentFilter !== 'all'
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first support ticket."
            }
            action={{
              label: "Create Ticket",
              onClick: () => router.push('/support/tickets/create'),
              icon: Plus
            }}
            secondaryAction={
              searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ||
              categoryFilter !== 'all' || assignedToFilter !== 'all' ||
              slaFilter !== 'all' || sourceFilter !== 'all' || departmentFilter !== 'all'
                ? {
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                      setCategoryFilter('all');
                      setAssignedToFilter('all');
                      setSlaFilter('all');
                      setSourceFilter('all');
                      setDepartmentFilter('all');
                    }
                  }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ticketNumber')}>
                  <div className="flex items-center space-x-1">
                    <span>Ticket #</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdDate')}>
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-blue-600">{ticket.ticketNumber}</div>
                    <div className="text-xs text-gray-500">{ticket.source}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 max-w-xs truncate">{ticket.subject}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket.comments}
                      </span>
                      {ticket.attachments > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {ticket.attachments}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{ticket.customer}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {ticket.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{ticket.assignedTo}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{ticket.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status]}`}>
                      {ticket.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[ticket.priority]}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[ticket.category]}`}>
                      {ticket.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${slaColors[ticket.slaStatus]}`}>
                      {ticket.slaStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700">{ticket.createdDate}</div>
                    <div className="text-xs text-gray-500">Updated: {ticket.lastUpdated}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/support/tickets/view/${ticket.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/support/tickets/edit/${ticket.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Edit Ticket"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Ticket"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
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
      )}
    </div>
  );
}
