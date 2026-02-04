'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MessageSquare, Clock, AlertCircle, CheckCircle, XCircle, User, Building2, Calendar, TrendingUp, Mail, Phone, Paperclip } from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  customer: string;
  customerCompany: string;
  contactEmail: string;
  contactPhone: string;
  status: 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'billing' | 'feature_request' | 'bug' | 'access' | 'training' | 'other';
  assignedTo: string;
  createdDate: string;
  lastUpdated: string;
  resolvedDate?: string;
  firstResponseTime?: number; // in minutes
  resolutionTime?: number; // in hours
  responseCount: number;
  attachments: number;
  tags: string[];
  relatedContract?: string;
  customerSatisfaction?: 1 | 2 | 3 | 4 | 5;
  slaStatus: 'met' | 'at_risk' | 'breached';
  slaDeadline: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2024-0145',
    subject: 'Unable to access dashboard after latest update',
    description: 'Users reporting 403 error when trying to access main dashboard since this morning update.',
    customer: 'John Smith',
    customerCompany: 'Acme Corporation',
    contactEmail: 'john.smith@acme.com',
    contactPhone: '+1 555-0123',
    status: 'in_progress',
    priority: 'critical',
    category: 'technical',
    assignedTo: 'Sarah Johnson',
    createdDate: '2024-10-20T08:30:00',
    lastUpdated: '2024-10-20T10:15:00',
    firstResponseTime: 12,
    responseCount: 5,
    attachments: 3,
    tags: ['Dashboard', 'Access Issue', 'Update Related'],
    relatedContract: 'CNT-2024-001',
    slaStatus: 'at_risk',
    slaDeadline: '2024-10-20T12:30:00',
  },
  {
    id: '2',
    ticketNumber: 'TKT-2024-0144',
    subject: 'Invoice discrepancy - October billing',
    description: 'Customer questioning additional charges on October invoice. Need to review billing breakdown.',
    customer: 'Emily Davis',
    customerCompany: 'TechStart Inc',
    contactEmail: 'emily.davis@techstart.com',
    contactPhone: '+1 555-0145',
    status: 'pending_customer',
    priority: 'high',
    category: 'billing',
    assignedTo: 'Michael Chen',
    createdDate: '2024-10-19T14:20:00',
    lastUpdated: '2024-10-19T16:45:00',
    firstResponseTime: 45,
    responseCount: 3,
    attachments: 2,
    tags: ['Billing', 'Invoice', 'Clarification'],
    relatedContract: 'CNT-2024-002',
    slaStatus: 'met',
    slaDeadline: '2024-10-21T14:20:00',
  },
  {
    id: '3',
    ticketNumber: 'TKT-2024-0143',
    subject: 'Feature request: Bulk export functionality',
    description: 'Customer requesting ability to export large datasets in bulk rather than one at a time.',
    customer: 'Robert Johnson',
    customerCompany: 'Global Industries Ltd',
    contactEmail: 'robert.j@globalind.com',
    contactPhone: '+1 555-0167',
    status: 'open',
    priority: 'medium',
    category: 'feature_request',
    assignedTo: 'David Park',
    createdDate: '2024-10-18T11:00:00',
    lastUpdated: '2024-10-18T11:00:00',
    responseCount: 0,
    attachments: 1,
    tags: ['Feature Request', 'Export', 'Enhancement'],
    relatedContract: 'CNT-2024-003',
    slaStatus: 'at_risk',
    slaDeadline: '2024-10-20T11:00:00',
  },
  {
    id: '4',
    ticketNumber: 'TKT-2024-0142',
    subject: 'Login issues with SSO integration',
    description: 'SSO authentication failing intermittently. Users having to retry multiple times.',
    customer: 'Lisa Anderson',
    customerCompany: 'Manufacturing Solutions Co',
    contactEmail: 'lisa.a@mfgsolutions.com',
    contactPhone: '+1 555-0189',
    status: 'resolved',
    priority: 'high',
    category: 'bug',
    assignedTo: 'Sarah Johnson',
    createdDate: '2024-10-17T09:15:00',
    lastUpdated: '2024-10-18T14:30:00',
    resolvedDate: '2024-10-18T14:30:00',
    firstResponseTime: 20,
    resolutionTime: 29.25,
    responseCount: 8,
    attachments: 5,
    tags: ['SSO', 'Authentication', 'Bug'],
    relatedContract: 'CNT-2024-004',
    customerSatisfaction: 5,
    slaStatus: 'met',
    slaDeadline: '2024-10-17T17:15:00',
  },
  {
    id: '5',
    ticketNumber: 'TKT-2024-0141',
    subject: 'Request for additional user licenses',
    description: 'Need to add 25 more user licenses to existing enterprise plan.',
    customer: 'James Wilson',
    customerCompany: 'Financial Services Group',
    contactEmail: 'james.w@finservices.com',
    contactPhone: '+1 555-0201',
    status: 'closed',
    priority: 'low',
    category: 'access',
    assignedTo: 'Michael Chen',
    createdDate: '2024-10-16T13:30:00',
    lastUpdated: '2024-10-17T10:15:00',
    resolvedDate: '2024-10-17T09:45:00',
    firstResponseTime: 30,
    resolutionTime: 20.25,
    responseCount: 4,
    attachments: 1,
    tags: ['Licenses', 'Access', 'Upgrade'],
    relatedContract: 'CNT-2024-005',
    customerSatisfaction: 4,
    slaStatus: 'met',
    slaDeadline: '2024-10-18T13:30:00',
  },
  {
    id: '6',
    ticketNumber: 'TKT-2024-0140',
    subject: 'Training session for new features',
    description: 'Customer requesting dedicated training session for Q4 feature releases.',
    customer: 'Maria Garcia',
    customerCompany: 'Retail Innovations',
    contactEmail: 'maria.g@retailinno.com',
    contactPhone: '+1 555-0223',
    status: 'in_progress',
    priority: 'medium',
    category: 'training',
    assignedTo: 'David Park',
    createdDate: '2024-10-15T10:00:00',
    lastUpdated: '2024-10-19T15:30:00',
    firstResponseTime: 60,
    responseCount: 6,
    attachments: 2,
    tags: ['Training', 'Features', 'Education'],
    relatedContract: 'CNT-2024-006',
    slaStatus: 'met',
    slaDeadline: '2024-10-17T10:00:00',
  },
  {
    id: '7',
    ticketNumber: 'TKT-2024-0139',
    subject: 'Data sync delays between systems',
    description: 'Integration data taking 2+ hours to sync instead of normal 15-minute interval.',
    customer: 'Thomas Brown',
    customerCompany: 'Healthcare Systems Inc',
    contactEmail: 'thomas.b@healthsys.com',
    contactPhone: '+1 555-0245',
    status: 'open',
    priority: 'critical',
    category: 'technical',
    assignedTo: 'Sarah Johnson',
    createdDate: '2024-10-20T07:45:00',
    lastUpdated: '2024-10-20T08:00:00',
    firstResponseTime: 15,
    responseCount: 2,
    attachments: 4,
    tags: ['Integration', 'Performance', 'Critical'],
    relatedContract: 'CNT-2024-007',
    slaStatus: 'breached',
    slaDeadline: '2024-10-20T09:45:00',
  },
  {
    id: '8',
    ticketNumber: 'TKT-2024-0138',
    subject: 'API rate limit clarification',
    description: 'Customer hitting rate limits. Requesting information on current limits and upgrade options.',
    customer: 'Patricia Martinez',
    customerCompany: 'E-Commerce Solutions Ltd',
    contactEmail: 'patricia.m@ecomsolutions.com',
    contactPhone: '+1 555-0267',
    status: 'pending_customer',
    priority: 'medium',
    category: 'other',
    assignedTo: 'Michael Chen',
    createdDate: '2024-10-19T16:30:00',
    lastUpdated: '2024-10-20T09:15:00',
    firstResponseTime: 90,
    responseCount: 3,
    attachments: 1,
    tags: ['API', 'Rate Limits', 'Documentation'],
    relatedContract: 'CNT-2024-008',
    slaStatus: 'met',
    slaDeadline: '2024-10-21T16:30:00',
  },
];

export default function SupportTicketsPage() {
  const router = useRouter();
  const [tickets] = useState<SupportTicket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed' | 'cancelled'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'technical' | 'billing' | 'feature_request' | 'bug' | 'access' | 'training' | 'other'>('all');

  const handleCreateTicket = () => {
    router.push('/crm/support/tickets/create');
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    criticalTickets: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length,
    slaBreach: tickets.filter(t => t.slaStatus === 'breached').length,
    avgResponseTime: Math.round(
      tickets.filter(t => t.firstResponseTime).reduce((sum, t) => sum + (t.firstResponseTime || 0), 0) /
      tickets.filter(t => t.firstResponseTime).length
    ),
    avgResolutionTime: tickets.filter(t => t.resolutionTime).length > 0
      ? (tickets.filter(t => t.resolutionTime).reduce((sum, t) => sum + (t.resolutionTime || 0), 0) /
         tickets.filter(t => t.resolutionTime).length).toFixed(1)
      : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      case 'pending_customer': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending_customer': return <MessageSquare className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-50 text-blue-700';
      case 'billing': return 'bg-green-50 text-green-700';
      case 'feature_request': return 'bg-purple-50 text-purple-700';
      case 'bug': return 'bg-red-50 text-red-700';
      case 'access': return 'bg-orange-50 text-orange-700';
      case 'training': return 'bg-teal-50 text-teal-700';
      case 'other': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'met': return 'bg-green-100 text-green-700';
      case 'at_risk': return 'bg-yellow-100 text-yellow-700';
      case 'breached': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeSinceCreated = (createdDate: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(createdDate).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="w-full h-full px-3 py-2 ">
      <div className="mb-8">
        <div className="flex justify-end mb-3">
          <button
            onClick={handleCreateTicket}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
            <MessageSquare className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalTickets}</div>
            <div className="text-blue-100 text-sm">Total Tickets</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <Clock className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.openTickets}</div>
            <div className="text-purple-100 text-sm">Open/Active</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 text-white">
            <AlertCircle className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.criticalTickets}</div>
            <div className="text-red-100 text-sm">Critical</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <XCircle className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.slaBreach}</div>
            <div className="text-orange-100 text-sm">SLA Breach</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
            <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.avgResponseTime}m</div>
            <div className="text-green-100 text-sm">Avg Response</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-3 text-white">
            <CheckCircle className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.avgResolutionTime}h</div>
            <div className="text-teal-100 text-sm">Avg Resolution</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets..."
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_customer">Pending Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug">Bug</option>
              <option value="access">Access</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-2">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`bg-white rounded-lg border p-3 hover:shadow-md transition-shadow ${
              ticket.priority === 'critical' || ticket.slaStatus === 'breached'
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                    {ticket.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSLAStatusColor(ticket.slaStatus)}`}>
                    SLA: {ticket.slaStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{ticket.ticketNumber}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {ticket.customerCompany}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {ticket.customer}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {getTimeSinceCreated(ticket.createdDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{ticket.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-2">
              {/* Response Time */}
              {ticket.firstResponseTime !== undefined && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-blue-700 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">First Response</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{ticket.firstResponseTime}m</div>
                </div>
              )}

              {/* Resolution Time */}
              {ticket.resolutionTime !== undefined && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-green-700 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Resolution</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{ticket.resolutionTime}h</div>
                </div>
              )}

              {/* Responses */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                <div className="flex items-center gap-1 text-purple-700 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-medium">Responses</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{ticket.responseCount}</div>
              </div>

              {/* Attachments */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
                <div className="flex items-center gap-1 text-orange-700 mb-1">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-xs font-medium">Attachments</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">{ticket.attachments}</div>
              </div>

              {/* Assigned To */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3">
                <div className="flex items-center gap-1 text-teal-700 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium">Assigned</span>
                </div>
                <div className="text-sm font-medium text-teal-900 truncate">{ticket.assignedTo}</div>
              </div>

              {/* Customer Satisfaction */}
              {ticket.customerSatisfaction && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-yellow-700 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">CSAT</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {ticket.customerSatisfaction}/5
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < ticket.customerSatisfaction! ? 'bg-yellow-500' : 'bg-yellow-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact & Contract Info */}
            <div className="grid grid-cols-3 gap-2 mb-2 pb-4 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-600 mb-1">Contact Email:</div>
                <a href={`mailto:${ticket.contactEmail}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {ticket.contactEmail}
                </a>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Contact Phone:</div>
                <a href={`tel:${ticket.contactPhone}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {ticket.contactPhone}
                </a>
              </div>
              {ticket.relatedContract && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Related Contract:</div>
                  <div className="text-sm font-medium text-gray-900">{ticket.relatedContract}</div>
                </div>
              )}
            </div>

            {/* SLA Deadline */}
            <div className="mb-2">
              <div className="text-xs text-gray-600 mb-1">SLA Deadline:</div>
              <div className="text-sm text-gray-900">
                {new Date(ticket.slaDeadline).toLocaleString()}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Last updated: {new Date(ticket.lastUpdated).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
