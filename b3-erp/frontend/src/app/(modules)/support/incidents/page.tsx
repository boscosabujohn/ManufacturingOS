'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, AlertTriangle, Activity, Users, Clock, TrendingUp, Shield, Filter, Download, ArrowUpDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  reportedBy: string;
  assignedTo: string;
  affectedUsers: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed';
  category: 'system_outage' | 'performance' | 'security' | 'data_loss' | 'integration' | 'hardware';
  impact: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: string;
  resolvedDate?: string;
  downtime: number;
  affectedSystems: string[];
  rootCause?: string;
  resolution?: string;
  estimatedResolution?: string;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    incidentNumber: 'INC-2025-001',
    title: 'ERP System Slow Performance',
    description: 'Multiple users reporting significant slowdown in ERP application response times',
    reportedBy: 'Rajesh Kumar',
    assignedTo: 'IT Operations Team',
    affectedUsers: 45,
    severity: 'high',
    status: 'investigating',
    category: 'performance',
    impact: 'high',
    reportedDate: '2025-10-17 09:30',
    downtime: 0,
    affectedSystems: ['ERP Core', 'Database Server'],
    estimatedResolution: '2025-10-17 14:00',
  },
  {
    id: '2',
    incidentNumber: 'INC-2025-002',
    title: 'Production Module Unavailable',
    description: 'Production planning module not loading, preventing work order creation',
    reportedBy: 'Priya Patel',
    assignedTo: 'Application Support',
    affectedUsers: 12,
    severity: 'critical',
    status: 'identified',
    category: 'system_outage',
    impact: 'critical',
    reportedDate: '2025-10-17 08:15',
    downtime: 120,
    affectedSystems: ['Production Module', 'Work Order System'],
    rootCause: 'Database connection pool exhausted',
    estimatedResolution: '2025-10-17 12:00',
  },
  {
    id: '3',
    incidentNumber: 'INC-2025-003',
    title: 'Email Integration Failure',
    description: 'Automated emails for quotations and invoices not being sent',
    reportedBy: 'Amit Singh',
    assignedTo: 'Integration Team',
    affectedUsers: 8,
    severity: 'medium',
    status: 'monitoring',
    category: 'integration',
    impact: 'medium',
    reportedDate: '2025-10-16 16:45',
    downtime: 0,
    affectedSystems: ['Email Gateway', 'SMTP Service'],
    rootCause: 'SMTP server credentials expired',
    resolution: 'Updated SMTP credentials and restarted email service',
    estimatedResolution: '2025-10-16 18:00',
  },
  {
    id: '4',
    incidentNumber: 'INC-2025-004',
    title: 'Inventory Data Sync Issue',
    description: 'Stock levels not syncing between warehouse and main system',
    reportedBy: 'Sanjay Gupta',
    assignedTo: 'Database Team',
    affectedUsers: 6,
    severity: 'high',
    status: 'resolved',
    category: 'data_loss',
    impact: 'high',
    reportedDate: '2025-10-15 11:20',
    resolvedDate: '2025-10-15 15:30',
    downtime: 0,
    affectedSystems: ['Inventory Module', 'Warehouse System'],
    rootCause: 'Replication lag due to network latency',
    resolution: 'Optimized database replication and cleared backlog',
  },
  {
    id: '5',
    incidentNumber: 'INC-2025-005',
    title: 'Report Generation Server Down',
    description: 'Custom report generation service not responding',
    reportedBy: 'Neha Sharma',
    assignedTo: 'Infrastructure Team',
    affectedUsers: 25,
    severity: 'medium',
    status: 'closed',
    category: 'system_outage',
    impact: 'medium',
    reportedDate: '2025-10-14 14:00',
    resolvedDate: '2025-10-14 16:30',
    downtime: 150,
    affectedSystems: ['Reporting Server', 'Analytics Engine'],
    rootCause: 'Memory leak causing server crash',
    resolution: 'Restarted service and deployed memory leak fix',
  },
  {
    id: '6',
    incidentNumber: 'INC-2025-006',
    title: 'Security Alert - Unusual Login Activity',
    description: 'Multiple failed login attempts detected from unknown IP addresses',
    reportedBy: 'Security System',
    assignedTo: 'Security Team',
    affectedUsers: 0,
    severity: 'critical',
    status: 'investigating',
    category: 'security',
    impact: 'high',
    reportedDate: '2025-10-17 07:00',
    downtime: 0,
    affectedSystems: ['Authentication Service', 'Firewall'],
    estimatedResolution: '2025-10-17 11:00',
  },
  {
    id: '7',
    incidentNumber: 'INC-2025-007',
    title: 'Backup Storage Capacity Alert',
    description: 'Backup storage server reaching 95% capacity',
    reportedBy: 'Monitoring System',
    assignedTo: 'Storage Team',
    affectedUsers: 0,
    severity: 'low',
    status: 'new',
    category: 'hardware',
    impact: 'low',
    reportedDate: '2025-10-17 06:00',
    downtime: 0,
    affectedSystems: ['Backup Server', 'Storage Array'],
    estimatedResolution: '2025-10-18 12:00',
  },
  {
    id: '8',
    incidentNumber: 'INC-2025-008',
    title: 'Payment Gateway Integration Error',
    description: 'Online payment processing returning errors for customer transactions',
    reportedBy: 'Vikram Reddy',
    assignedTo: 'Payment Integration Team',
    affectedUsers: 15,
    severity: 'critical',
    status: 'identified',
    category: 'integration',
    impact: 'critical',
    reportedDate: '2025-10-16 10:30',
    downtime: 60,
    affectedSystems: ['Payment Gateway', 'Customer Portal'],
    rootCause: 'API version mismatch after gateway provider update',
    estimatedResolution: '2025-10-16 13:00',
  },
];

const severityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  investigating: 'bg-yellow-100 text-yellow-700',
  identified: 'bg-orange-100 text-orange-700',
  monitoring: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const impactColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function IncidentsPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Incident | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  const handleSort = (field: keyof Incident) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || incident.category === categoryFilter;
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  if (sortField) {
    filteredIncidents = [...filteredIncidents].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue !== undefined && bValue !== undefined && aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue !== undefined && bValue !== undefined && aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
    open: incidents.filter((i) => i.status === 'new' || i.status === 'investigating').length,
    totalDowntime: incidents.reduce((sum, i) => sum + i.downtime, 0),
    affectedUsers: incidents.filter((i) => i.status !== 'closed' && i.status !== 'resolved').reduce((sum, i) => sum + i.affectedUsers, 0),
  };

  const handleDeleteIncident = (id: string) => {
    if (confirm('Are you sure you want to delete this incident?')) {
      setIncidents(incidents.filter((i) => i.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exporting incident data to CSV...');
    console.log('Exporting incidents:', filteredIncidents);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Incidents</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.critical}</p>
              </div>
              <Zap className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Open</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.open}</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Downtime (min)</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.totalDowntime}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Affected Users</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.affectedUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/support/incidents/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Report Incident</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents by number, title, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="identified">Identified</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="system_outage">System Outage</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="data_loss">Data Loss</option>
                <option value="integration">Integration</option>
                <option value="hardware">Hardware</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSeverityFilter('all');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('incidentNumber')}>
                  <div className="flex items-center space-x-1">
                    <span>Incident #</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('affectedUsers')}>
                  <div className="flex items-center space-x-1">
                    <span>Affected</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('reportedDate')}>
                  <div className="flex items-center space-x-1">
                    <span>Reported</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-red-600">{incident.incidentNumber}</div>
                    <div className="text-xs text-gray-500">{incident.reportedBy}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 max-w-xs">{incident.title}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{incident.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{incident.assignedTo}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[incident.severity]}`}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[incident.status]}`}>
                      {incident.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {incident.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${impactColors[incident.impact]}`}>
                      {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{incident.affectedUsers} users</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700">{incident.reportedDate}</div>
                    {incident.downtime > 0 && (
                      <div className="text-xs text-red-600 mt-1">Downtime: {incident.downtime}m</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/support/incidents/view/${incident.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                       
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/support/incidents/edit/${incident.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                       
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIncident(incident.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                       
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredIncidents.length)} of {filteredIncidents.length} incidents
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
    </div>
  );
}
