'use client';

import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  actionType: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'export' | 'approve' | 'reject';
  module: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  affectedRecords: number;
  sessionId: string;
  location: string;
  duration: string;
  changes: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG001',
    timestamp: '2025-10-17 09:30:15',
    user: 'Ravi Kumar',
    actionType: 'login',
    module: 'Authentication',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome 119.0.0.0',
    severity: 'low',
    status: 'Success',
    affectedRecords: 0,
    sessionId: 'SES-20251017-001',
    location: 'Mumbai, India',
    duration: '0s',
    changes: 'N/A'
  },
  {
    id: 'LOG002',
    timestamp: '2025-10-17 09:15:42',
    user: 'Priya Sharma',
    actionType: 'update',
    module: 'Production',
    description: 'Updated production order PO-2025-1045',
    ipAddress: '192.168.1.105',
    userAgent: 'Firefox 118.0',
    severity: 'medium',
    status: 'Success',
    affectedRecords: 1,
    sessionId: 'SES-20251017-002',
    location: 'Delhi, India',
    duration: '2.3s',
    changes: 'Quantity: 100 -> 150'
  },
  {
    id: 'LOG003',
    timestamp: '2025-10-17 08:45:28',
    user: 'Unknown',
    actionType: 'login',
    module: 'Authentication',
    description: 'Failed login attempt - Invalid credentials',
    ipAddress: '203.192.45.78',
    userAgent: 'Chrome 118.0.0.0',
    severity: 'high',
    status: 'Failed',
    affectedRecords: 0,
    sessionId: 'N/A',
    location: 'Unknown',
    duration: '0s',
    changes: 'N/A'
  },
  {
    id: 'LOG004',
    timestamp: '2025-10-17 08:30:19',
    user: 'Amit Patel',
    actionType: 'delete',
    module: 'Inventory',
    description: 'Deleted obsolete inventory item INV-7823',
    ipAddress: '192.168.1.112',
    userAgent: 'Edge 119.0.0.0',
    severity: 'critical',
    status: 'Success',
    affectedRecords: 1,
    sessionId: 'SES-20251017-003',
    location: 'Pune, India',
    duration: '1.8s',
    changes: 'Item permanently removed'
  },
  {
    id: 'LOG005',
    timestamp: '2025-10-17 07:55:03',
    user: 'Neha Desai',
    actionType: 'export',
    module: 'Reports',
    description: 'Exported inventory report for Q3 2025',
    ipAddress: '192.168.1.118',
    userAgent: 'Chrome 119.0.0.0',
    severity: 'medium',
    status: 'Success',
    affectedRecords: 1547,
    sessionId: 'SES-20251017-004',
    location: 'Bangalore, India',
    duration: '5.2s',
    changes: 'CSV export generated'
  },
  {
    id: 'LOG006',
    timestamp: '2025-10-17 07:20:45',
    user: 'Vikram Singh',
    actionType: 'approve',
    module: 'Purchase Orders',
    description: 'Approved purchase order PO-2025-3421',
    ipAddress: '192.168.1.125',
    userAgent: 'Safari 17.0',
    severity: 'medium',
    status: 'Success',
    affectedRecords: 1,
    sessionId: 'SES-20251017-005',
    location: 'Chennai, India',
    duration: '1.5s',
    changes: 'Status: Pending -> Approved'
  }
];

export default function AuditPage() {
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEventType = eventTypeFilter === 'all' || log.actionType === eventTypeFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesEventType && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const totalLogs = auditLogs.length;
  const criticalEvents = auditLogs.filter(l => l.severity === 'critical').length;
  const failedLogins = auditLogs.filter(l => l.actionType === 'login' && l.status === 'Failed').length;
  const changesToday = auditLogs.filter(l =>
    l.timestamp.startsWith('2025-10-17') &&
    (l.actionType === 'create' || l.actionType === 'update' || l.actionType === 'delete')
  ).length;

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'high':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActionTypeBadgeClass = (actionType: string) => {
    switch (actionType) {
      case 'login':
        return 'bg-blue-100 text-blue-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-yellow-100 text-yellow-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'export':
        return 'bg-purple-100 text-purple-800';
      case 'approve':
        return 'bg-teal-100 text-teal-800';
      case 'reject':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = () => {
    console.log('Exporting audit logs...');
  };

  const handleViewDetails = (logId: string) => {
    console.log('Viewing log details:', logId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Monitor system activities and security events</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Logs</p>
              <p className="text-3xl font-bold mt-2">{totalLogs}</p>
              <p className="text-blue-100 text-xs mt-2">All recorded events</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Critical Events</p>
              <p className="text-3xl font-bold mt-2">{criticalEvents}</p>
              <p className="text-red-100 text-xs mt-2">High priority alerts</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Failed Logins</p>
              <p className="text-3xl font-bold mt-2">{failedLogins}</p>
              <p className="text-orange-100 text-xs mt-2">Security attempts</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Changes Today</p>
              <p className="text-3xl font-bold mt-2">{changesToday}</p>
              <p className="text-green-100 text-xs mt-2">Create/Update/Delete</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Log ID, User, Module, or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="export">Export</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Log ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionTypeBadgeClass(log.actionType)}`}>
                      {log.actionType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.module}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getSeverityBadgeClass(log.severity)}`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(log.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, filteredLogs.length)}</span> of{' '}
              <span className="font-medium">{filteredLogs.length}</span> logs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
