'use client';

import { useState } from 'react';
import { AlertTriangle, XCircle, Bug, Code, Server, Database, Globe, Filter, Download, Eye, Search, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ErrorLog {
  id: string;
  errorId: string;
  timestamp: string;
  severity: string;
  errorType: string;
  source: string;
  message: string;
  stackTrace: string;
  affectedUsers: number;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  status: string;
  assignedTo?: string;
  resolution?: string;
  user?: string;
  ipAddress?: string;
  url?: string;
  userAgent?: string;
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  highErrors: number;
  mediumErrors: number;
  lowErrors: number;
  resolvedToday: number;
}

const ErrorMonitoringPage = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const [errors] = useState<ErrorLog[]>([
    {
      id: '1',
      errorId: 'ERR-20251021-001',
      timestamp: '2025-10-21 18:30:45',
      severity: 'Critical',
      errorType: 'NullPointerException',
      source: 'OrderService',
      message: 'Null reference when calculating order total',
      stackTrace: 'java.lang.NullPointerException: Cannot invoke "Order.getTotal()" because "order" is null\n  at OrderService.calculateTotal(OrderService.java:145)\n  at OrderController.createOrder(OrderController.java:89)\n  at jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)',
      affectedUsers: 5,
      occurrences: 12,
      firstSeen: '2025-10-21 15:20:00',
      lastSeen: '2025-10-21 18:30:45',
      status: 'Open',
      assignedTo: 'Rajesh Kumar',
      user: 'amit.patel@company.com',
      ipAddress: '117.198.144.73',
      url: '/api/orders/create',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0',
    },
    {
      id: '2',
      errorId: 'ERR-20251021-002',
      timestamp: '2025-10-21 18:25:32',
      severity: 'High',
      errorType: 'SQLException',
      source: 'DatabaseService',
      message: 'Database connection timeout',
      stackTrace: 'java.sql.SQLException: Connection timed out after 30000ms\n  at DatabaseConnection.connect(DatabaseConnection.java:67)\n  at DataService.executeQuery(DataService.java:120)',
      affectedUsers: 15,
      occurrences: 23,
      firstSeen: '2025-10-21 14:00:00',
      lastSeen: '2025-10-21 18:25:32',
      status: 'In Progress',
      assignedTo: 'Sneha Reddy',
      user: 'priya.sharma@company.com',
      ipAddress: '103.50.161.89',
      url: '/api/reports/sales',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/119.0',
    },
    {
      id: '3',
      errorId: 'ERR-20251021-003',
      timestamp: '2025-10-21 18:20:15',
      severity: 'Medium',
      errorType: 'ValidationException',
      source: 'UserService',
      message: 'Invalid email format in user registration',
      stackTrace: 'ValidationException: Email format is invalid\n  at EmailValidator.validate(EmailValidator.java:34)\n  at UserService.createUser(UserService.java:78)',
      affectedUsers: 8,
      occurrences: 8,
      firstSeen: '2025-10-21 16:45:00',
      lastSeen: '2025-10-21 18:20:15',
      status: 'Open',
      user: 'test.user@invalid',
      ipAddress: '192.168.1.100',
      url: '/api/users/register',
      userAgent: 'PostmanRuntime/7.32.3',
    },
    {
      id: '4',
      errorId: 'ERR-20251021-004',
      timestamp: '2025-10-21 18:15:08',
      severity: 'Critical',
      errorType: 'OutOfMemoryError',
      source: 'ReportGenerator',
      message: 'Java heap space exceeded while generating large report',
      stackTrace: 'java.lang.OutOfMemoryError: Java heap space\n  at ReportGenerator.generatePDF(ReportGenerator.java:234)\n  at ReportController.downloadReport(ReportController.java:156)',
      affectedUsers: 3,
      occurrences: 3,
      firstSeen: '2025-10-21 17:30:00',
      lastSeen: '2025-10-21 18:15:08',
      status: 'In Progress',
      assignedTo: 'Vikram Singh',
      user: 'vikram.singh@company.com',
      ipAddress: '117.198.144.73',
      url: '/api/reports/generate/annual',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.0',
    },
    {
      id: '5',
      errorId: 'ERR-20251020-015',
      timestamp: '2025-10-20 16:45:23',
      severity: 'High',
      errorType: 'FileNotFoundException',
      source: 'FileService',
      message: 'Requested file not found in storage',
      stackTrace: 'java.io.FileNotFoundException: /uploads/documents/invoice-2025-001.pdf (No such file or directory)\n  at FileService.getFile(FileService.java:89)\n  at DocumentController.downloadFile(DocumentController.java:45)',
      affectedUsers: 2,
      occurrences: 2,
      firstSeen: '2025-10-20 16:45:23',
      lastSeen: '2025-10-20 16:50:12',
      status: 'Resolved',
      assignedTo: 'Anjali Desai',
      resolution: 'File restored from backup',
      user: 'deepika.rao@company.com',
      ipAddress: '202.54.1.78',
      url: '/api/documents/download/1234',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/118.0',
    },
    {
      id: '6',
      errorId: 'ERR-20251021-006',
      timestamp: '2025-10-21 18:10:42',
      severity: 'Low',
      errorType: 'ResourceNotFoundException',
      source: 'APIGateway',
      message: '404 - Endpoint not found',
      stackTrace: 'ResourceNotFoundException: The requested resource was not found\n  at APIGateway.routeRequest(APIGateway.java:123)',
      affectedUsers: 1,
      occurrences: 1,
      firstSeen: '2025-10-21 18:10:42',
      lastSeen: '2025-10-21 18:10:42',
      status: 'Open',
      user: 'test.developer@company.com',
      ipAddress: '10.0.1.100',
      url: '/api/v2/legacy/endpoint',
      userAgent: 'curl/7.88.1',
    },
    {
      id: '7',
      errorId: 'ERR-20251021-007',
      timestamp: '2025-10-21 18:05:33',
      severity: 'Medium',
      errorType: 'AuthenticationException',
      source: 'AuthService',
      message: 'Invalid JWT token signature',
      stackTrace: 'AuthenticationException: JWT signature does not match\n  at JWTValidator.verify(JWTValidator.java:67)\n  at AuthService.validateToken(AuthService.java:234)',
      affectedUsers: 4,
      occurrences: 6,
      firstSeen: '2025-10-21 17:00:00',
      lastSeen: '2025-10-21 18:05:33',
      status: 'Open',
      user: 'unknown',
      ipAddress: '88.99.111.222',
      url: '/api/auth/validate',
      userAgent: 'Python/3.9 requests/2.28.0',
    },
    {
      id: '8',
      errorId: 'ERR-20251021-008',
      timestamp: '2025-10-21 18:00:18',
      severity: 'High',
      errorType: 'ConcurrentModificationException',
      source: 'InventoryService',
      message: 'Concurrent stock update conflict',
      stackTrace: 'java.util.ConcurrentModificationException\n  at InventoryService.updateStock(InventoryService.java:178)\n  at OrderService.reserveStock(OrderService.java:234)',
      affectedUsers: 10,
      occurrences: 18,
      firstSeen: '2025-10-21 12:00:00',
      lastSeen: '2025-10-21 18:00:18',
      status: 'In Progress',
      assignedTo: 'Rahul Mehta',
      user: 'system',
      ipAddress: '10.0.2.50',
      url: '/api/inventory/update',
      userAgent: 'Internal Service',
    },
  ]);

  const stats: ErrorStats = {
    totalErrors: errors.length,
    criticalErrors: errors.filter(e => e.severity === 'Critical').length,
    highErrors: errors.filter(e => e.severity === 'High').length,
    mediumErrors: errors.filter(e => e.severity === 'Medium').length,
    lowErrors: errors.filter(e => e.severity === 'Low').length,
    resolvedToday: errors.filter(e => e.status === 'Resolved').length,
  };

  const filteredErrors = errors.filter(error => {
    const matchesSeverity = filterSeverity === 'all' || error.severity === filterSeverity;
    const matchesType = filterType === 'all' || error.errorType === filterType;
    const matchesStatus = filterStatus === 'all' || error.status === filterStatus;
    const matchesSearch = error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         error.errorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         error.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesType && matchesStatus && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.toLowerCase().includes('database')) return <Database className="w-4 h-4" />;
    if (source.toLowerCase().includes('service') || source.toLowerCase().includes('controller')) return <Server className="w-4 h-4" />;
    if (source.toLowerCase().includes('api') || source.toLowerCase().includes('gateway')) return <Globe className="w-4 h-4" />;
    return <Code className="w-4 h-4" />;
  };

  const handleExport = () => {
    alert('Exporting error logs...');
  };

  const handleViewDetails = (error: ErrorLog) => {
    setSelectedError(error);
  };

  const handleCloseDetails = () => {
    setSelectedError(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bug className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Error Monitoring</h1>
              <p className="text-gray-600">Track and resolve application errors and exceptions</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Errors
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Errors</span>
            <Bug className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalErrors}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.criticalErrors}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">High</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.highErrors}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Medium</span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.mediumErrors}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Low</span>
            <AlertTriangle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.lowErrors}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by error ID, message, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="NullPointerException">NullPointerException</option>
            <option value="SQLException">SQLException</option>
            <option value="ValidationException">ValidationException</option>
            <option value="OutOfMemoryError">OutOfMemoryError</option>
            <option value="FileNotFoundException">FileNotFoundException</option>
            <option value="AuthenticationException">AuthenticationException</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Errors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Error ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Source</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Message</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Impact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredErrors.map((error) => (
                <tr key={error.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-red-50 text-red-800 px-2 py-1 rounded font-medium">
                      {error.errorId}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {error.timestamp}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                      {error.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Bug className="w-4 h-4 text-red-500" />
                      <span>{error.errorType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {getSourceIcon(error.source)}
                      <span>{error.source}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={error.message}>
                      {error.message}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span>{error.occurrences} times</span>
                      </div>
                      <div className="text-xs text-gray-500">{error.affectedUsers} users</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(error.status)}`}>
                      {error.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleViewDetails(error)}
                      className="text-red-600 hover:text-red-700 p-1"
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

        {filteredErrors.length === 0 && (
          <div className="text-center py-12">
            <Bug className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No errors found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Error Details</h3>
              <button
                onClick={handleCloseDetails}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Error ID</label>
                  <code className="block bg-red-50 rounded-lg p-3 text-sm font-medium text-red-800">{selectedError.errorId}</code>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Timestamp</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedError.timestamp}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Severity</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedError.severity)}`}>
                    {selectedError.severity}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedError.status)}`}>
                    {selectedError.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Error Type</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedError.errorType}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Source</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedError.source}</div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Error Message</label>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-gray-900">{selectedError.message}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Occurrences</label>
                  <div className="bg-orange-50 rounded-lg p-3 font-bold text-orange-800">{selectedError.occurrences} times</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Affected Users</label>
                  <div className="bg-orange-50 rounded-lg p-3 font-bold text-orange-800">{selectedError.affectedUsers} users</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">First Seen</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedError.firstSeen}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Seen</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedError.lastSeen}</div>
                </div>

                {selectedError.assignedTo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Assigned To</label>
                    <div className="bg-blue-50 rounded-lg p-3 text-gray-900">{selectedError.assignedTo}</div>
                  </div>
                )}

                {selectedError.resolution && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Resolution</label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-gray-900">{selectedError.resolution}</div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">User</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{selectedError.user || 'Unknown'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">IP Address</label>
                  <code className="block bg-gray-50 rounded-lg p-3 text-sm text-gray-900">{selectedError.ipAddress || 'N/A'}</code>
                </div>

                {selectedError.url && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Request URL</label>
                    <code className="block bg-gray-50 rounded-lg p-3 text-sm text-gray-900 break-all">{selectedError.url}</code>
                  </div>
                )}

                {selectedError.userAgent && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">User Agent</label>
                    <code className="block bg-gray-50 rounded-lg p-3 text-xs text-gray-900">{selectedError.userAgent}</code>
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Stack Trace</label>
                  <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                    {selectedError.stackTrace}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorMonitoringPage;
