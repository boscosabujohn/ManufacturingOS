'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, AlertTriangle, CheckCircle, Clock, XCircle, ArrowUpCircle, User, Calendar, Download, Filter } from 'lucide-react';

interface ServiceRequest {
  id: string;
  ticketNumber: string;
  priority: 'P1 - Critical' | 'P2 - High' | 'P3 - Medium' | 'P4 - Low';
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  customerId: string;
  customerName: string;
  issueDescription: string;
  channel: 'Phone' | 'Email' | 'Web' | 'Mobile' | 'WhatsApp' | 'Chat';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  responseDeadline: string;
  resolutionDeadline: string;
  slaStatus: 'on_track' | 'at_risk' | 'breached' | 'met';
  responseTime?: number; // hours
  resolutionTime?: number; // hours
  escalationLevel: number;
  equipmentModel?: string;
}

const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    ticketNumber: 'TICKET-2025-000123',
    priority: 'P1 - Critical',
    status: 'in_progress',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    issueDescription: 'Chimney motor not working - smoke entering kitchen',
    channel: 'Phone',
    assignedTo: 'ENG001',
    assignedToName: 'Rajesh Kumar',
    createdAt: '2025-10-17T09:30:00',
    responseDeadline: '2025-10-17T11:30:00',
    resolutionDeadline: '2025-10-17T15:30:00',
    slaStatus: 'on_track',
    responseTime: 0.5,
    escalationLevel: 0,
    equipmentModel: 'Chimney Auto Clean 90cm',
  },
  {
    id: '2',
    ticketNumber: 'TICKET-2025-000118',
    priority: 'P2 - High',
    status: 'acknowledged',
    customerId: 'CUST002',
    customerName: 'Prestige Developers Bangalore',
    issueDescription: 'Built-in oven temperature not reaching set level',
    channel: 'Email',
    assignedTo: 'ENG002',
    assignedToName: 'Amit Sharma',
    createdAt: '2025-10-17T08:00:00',
    responseDeadline: '2025-10-17T12:00:00',
    resolutionDeadline: '2025-10-18T08:00:00',
    slaStatus: 'on_track',
    responseTime: 2,
    escalationLevel: 0,
    equipmentModel: 'Built-in Oven 60L',
  },
  {
    id: '3',
    ticketNumber: 'TICKET-2025-000115',
    priority: 'P3 - Medium',
    status: 'resolved',
    customerId: 'CUST003',
    customerName: 'Urban Interiors & Designers',
    issueDescription: 'Hob auto-ignition not sparking on burner 3',
    channel: 'Web',
    assignedTo: 'ENG003',
    assignedToName: 'Priya Patel',
    createdAt: '2025-10-16T14:00:00',
    responseDeadline: '2025-10-16T22:00:00',
    resolutionDeadline: '2025-10-18T14:00:00',
    slaStatus: 'met',
    responseTime: 3,
    resolutionTime: 18,
    escalationLevel: 0,
    equipmentModel: 'Built-in Hob 4 Burner Gas',
  },
  {
    id: '4',
    ticketNumber: 'TICKET-2025-000089',
    priority: 'P1 - Critical',
    status: 'open',
    customerId: 'CUST004',
    customerName: 'Elite Contractors & Builders',
    issueDescription: 'Dishwasher water leaking - flooding issue',
    channel: 'Phone',
    createdAt: '2025-10-17T10:15:00',
    responseDeadline: '2025-10-17T12:15:00',
    resolutionDeadline: '2025-10-17T16:15:00',
    slaStatus: 'at_risk',
    escalationLevel: 1,
    equipmentModel: 'Dishwasher 14 Place Settings',
  },
  {
    id: '5',
    ticketNumber: 'TICKET-2025-000102',
    priority: 'P4 - Low',
    status: 'closed',
    customerId: 'CUST005',
    customerName: 'DLF Universal Projects',
    issueDescription: 'Microwave turntable making noise',
    channel: 'WhatsApp',
    assignedTo: 'ENG004',
    assignedToName: 'Sanjay Gupta',
    createdAt: '2025-10-15T11:00:00',
    responseDeadline: '2025-10-16T11:00:00',
    resolutionDeadline: '2025-10-18T11:00:00',
    slaStatus: 'met',
    responseTime: 20,
    resolutionTime: 48,
    escalationLevel: 0,
    equipmentModel: 'Microwave Oven 30L',
  },
  {
    id: '6',
    ticketNumber: 'TICKET-2025-000095',
    priority: 'P2 - High',
    status: 'in_progress',
    customerId: 'CUST006',
    customerName: 'Signature Interiors Pune',
    issueDescription: 'Induction hob not detecting cookware',
    channel: 'Mobile',
    assignedTo: 'ENG001',
    assignedToName: 'Rajesh Kumar',
    createdAt: '2025-10-16T16:00:00',
    responseDeadline: '2025-10-16T20:00:00',
    resolutionDeadline: '2025-10-17T16:00:00',
    slaStatus: 'breached',
    responseTime: 5,
    escalationLevel: 1,
    equipmentModel: 'Induction Hob 4 Burner',
  },
  {
    id: '7',
    ticketNumber: 'TICKET-2025-000077',
    priority: 'P3 - Medium',
    status: 'acknowledged',
    customerId: 'CUST007',
    customerName: 'Royal Homes Hyderabad',
    issueDescription: 'RO filter replacement required - TDS high',
    channel: 'Email',
    assignedTo: 'ENG005',
    assignedToName: 'Neha Singh',
    createdAt: '2025-10-17T07:00:00',
    responseDeadline: '2025-10-17T15:00:00',
    resolutionDeadline: '2025-10-19T07:00:00',
    slaStatus: 'on_track',
    responseTime: 4,
    escalationLevel: 0,
    equipmentModel: 'RO Water Purifier 10L',
  },
  {
    id: '8',
    ticketNumber: 'TICKET-2025-000134',
    priority: 'P2 - High',
    status: 'open',
    customerId: 'CUST008',
    customerName: 'Modern Living Ahmedabad',
    issueDescription: 'Chimney suction power reduced - not effective',
    channel: 'Chat',
    createdAt: '2025-10-17T09:00:00',
    responseDeadline: '2025-10-17T13:00:00',
    resolutionDeadline: '2025-10-18T09:00:00',
    slaStatus: 'on_track',
    escalationLevel: 0,
    equipmentModel: 'Chimney Curved Glass 60cm',
  },
];

const priorityColors = {
  'P1 - Critical': 'bg-red-100 text-red-700 border-red-300',
  'P2 - High': 'bg-orange-100 text-orange-700 border-orange-300',
  'P3 - Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'P4 - Low': 'bg-blue-100 text-blue-700 border-blue-300',
};

const statusColors = {
  open: 'bg-blue-100 text-blue-700',
  acknowledged: 'bg-cyan-100 text-cyan-700',
  in_progress: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  open: Clock,
  acknowledged: CheckCircle,
  in_progress: ArrowUpCircle,
  resolved: CheckCircle,
  closed: XCircle,
  cancelled: XCircle,
};

const slaStatusColors = {
  on_track: 'text-green-600',
  at_risk: 'text-yellow-600',
  breached: 'text-red-600',
  met: 'text-green-600',
};

const channelColors = {
  'Phone': 'bg-blue-100 text-blue-700',
  'Email': 'bg-purple-100 text-purple-700',
  'Web': 'bg-cyan-100 text-cyan-700',
  'Mobile': 'bg-orange-100 text-orange-700',
  'WhatsApp': 'bg-green-100 text-green-700',
  'Chat': 'bg-pink-100 text-pink-700',
};

export default function ServiceRequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter service requests
  const filteredRequests = mockServiceRequests.filter((request) => {
    const matchesSearch =
      request.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalRequests: mockServiceRequests.length,
    openRequests: mockServiceRequests.filter(r => ['open', 'acknowledged', 'in_progress'].includes(r.status)).length,
    slaBreached: mockServiceRequests.filter(r => r.slaStatus === 'breached').length,
    p1Critical: mockServiceRequests.filter(r => r.priority === 'P1 - Critical' && ['open', 'acknowledged', 'in_progress'].includes(r.status)).length,
    avgResponseTime: mockServiceRequests.filter(r => r.responseTime).reduce((sum, r) => sum + (r.responseTime || 0), 0) / mockServiceRequests.filter(r => r.responseTime).length || 0,
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const diff = deadlineTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return <span className="text-red-600 font-medium">Overdue</span>;
    if (hours < 2) return <span className="text-red-600 font-medium">{hours}h {minutes}m left</span>;
    if (hours < 4) return <span className="text-orange-600 font-medium">{hours}h {minutes}m left</span>;
    return <span className="text-gray-600">{hours}h {minutes}m left</span>;
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-orange-600">{stats.openRequests}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">SLA Breached</p>
              <p className="text-2xl font-bold text-red-600">{stats.slaBreached}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">P1 Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.p1Critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime.toFixed(1)}h</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by ticket number, customer, or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/after-sales-service/service-requests/sla-dashboard')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              SLA Dashboard
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => router.push('/after-sales-service/service-requests/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Request
            </button>
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue & Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRequests.map((request) => {
                const StatusIcon = statusIcons[request.status];
                return (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{request.ticketNumber}</span>
                        <span className="text-sm text-gray-600">{request.customerName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityColors[request.priority]}`}>
                        {request.priority}
                      </span>
                      {request.escalationLevel > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-red-600 font-medium">
                            Escalated L{request.escalationLevel}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-xs">
                        <span className="text-sm text-gray-900 truncate">{request.issueDescription}</span>
                        {request.equipmentModel && (
                          <span className="text-xs text-gray-500 mt-1">{request.equipmentModel}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${channelColors[request.channel]}`}>
                        {request.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {request.assignedToName ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{request.assignedToName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-xs font-medium ${slaStatusColors[request.slaStatus]}`}>
                          {request.slaStatus.replace('_', ' ').toUpperCase()}
                        </span>
                        {['open', 'acknowledged', 'in_progress'].includes(request.status) && (
                          <div className="text-xs mt-1">
                            {getTimeRemaining(request.resolutionDeadline)}
                          </div>
                        )}
                        {request.responseTime && (
                          <span className="text-xs text-gray-500 mt-1">
                            Response: {request.responseTime}h
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/after-sales-service/service-requests/view/${request.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/after-sales-service/service-requests/edit/${request.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
