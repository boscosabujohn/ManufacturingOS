'use client';

import { useState } from 'react';
import { LogIn, LogOut, Shield, AlertTriangle, CheckCircle2, XCircle, Globe, MapPin, Monitor, Smartphone, Calendar, Filter, Download, Eye, Search } from 'lucide-react';

interface LoginAuditLog {
  id: string;
  userId: string;
  userName: string;
  email: string;
  department: string;
  role: string;
  action: string;
  status: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  os: string;
  sessionId: string;
  duration?: string;
  failureReason?: string;
  mfaUsed: boolean;
}

interface LoginStats {
  totalLogins: number;
  successfulLogins: number;
  failedLogins: number;
  uniqueUsers: number;
  suspiciousAttempts: number;
  mfaLogins: number;
}

const LoginAuditLogsPage = () => {
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDevice, setFilterDevice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<LoginAuditLog | null>(null);

  const [logs] = useState<LoginAuditLog[]>([
    {
      id: '1',
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      department: 'IT',
      role: 'Admin',
      action: 'Login',
      status: 'Success',
      timestamp: '2025-10-21 09:15:23',
      ipAddress: '103.21.244.45',
      location: 'Mumbai, India',
      device: 'Desktop',
      browser: 'Chrome 118.0',
      os: 'Windows 11',
      sessionId: 'SES-20251021-001',
      mfaUsed: true,
    },
    {
      id: '2',
      userId: 'USR002',
      userName: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      department: 'HR',
      role: 'HR Manager',
      action: 'Login',
      status: 'Success',
      timestamp: '2025-10-21 08:45:12',
      ipAddress: '103.50.161.89',
      location: 'Bangalore, India',
      device: 'Laptop',
      browser: 'Firefox 119.0',
      os: 'Windows 10',
      sessionId: 'SES-20251021-002',
      mfaUsed: true,
    },
    {
      id: '3',
      userId: 'USR003',
      userName: 'Unknown',
      email: 'amit.patel@company.com',
      department: '-',
      role: '-',
      action: 'Login Attempt',
      status: 'Failed',
      timestamp: '2025-10-21 08:30:45',
      ipAddress: '192.168.100.50',
      location: 'Unknown',
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
      sessionId: '-',
      failureReason: 'Invalid credentials',
      mfaUsed: false,
    },
    {
      id: '4',
      userId: 'USR004',
      userName: 'Sneha Reddy',
      email: 'sneha.reddy@company.com',
      department: 'Sales',
      role: 'Sales Executive',
      action: 'Login',
      status: 'Success',
      timestamp: '2025-10-21 10:30:56',
      ipAddress: '182.68.205.12',
      location: 'Hyderabad, India',
      device: 'Mobile',
      browser: 'Safari 17.0',
      os: 'iOS 17',
      sessionId: 'SES-20251021-003',
      mfaUsed: false,
    },
    {
      id: '5',
      userId: 'USR005',
      userName: 'Unknown',
      email: '-',
      department: '-',
      role: '-',
      action: 'Login Attempt',
      status: 'Blocked',
      timestamp: '2025-10-21 07:15:32',
      ipAddress: '45.123.67.89',
      location: 'Singapore',
      device: 'Desktop',
      browser: 'Chrome 118.0',
      os: 'Linux',
      sessionId: '-',
      failureReason: 'IP not in whitelist',
      mfaUsed: false,
    },
    {
      id: '6',
      userId: 'USR006',
      userName: 'Vikram Singh',
      email: 'vikram.singh@company.com',
      department: 'Operations',
      role: 'Operations Manager',
      action: 'Logout',
      status: 'Success',
      timestamp: '2025-10-21 18:30:21',
      ipAddress: '117.198.144.73',
      location: 'Delhi, India',
      device: 'Desktop',
      browser: 'Edge 118.0',
      os: 'Windows 11',
      sessionId: 'SES-20251021-004',
      duration: '8h 45m',
      mfaUsed: true,
    },
    {
      id: '7',
      userId: 'USR007',
      userName: 'Anjali Desai',
      email: 'anjali.desai@company.com',
      department: 'Marketing',
      role: 'Marketing Manager',
      action: 'Login',
      status: 'Success',
      timestamp: '2025-10-21 11:20:45',
      ipAddress: '157.48.123.45',
      location: 'Pune, India',
      device: 'Laptop',
      browser: 'Chrome 118.0',
      os: 'macOS Sonoma',
      sessionId: 'SES-20251021-005',
      mfaUsed: true,
    },
    {
      id: '8',
      userId: 'USR003',
      userName: 'Unknown',
      email: 'amit.patel@company.com',
      department: '-',
      role: '-',
      action: 'Login Attempt',
      status: 'Failed',
      timestamp: '2025-10-21 08:32:15',
      ipAddress: '192.168.100.50',
      location: 'Unknown',
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
      sessionId: '-',
      failureReason: 'Invalid credentials',
      mfaUsed: false,
    },
    {
      id: '9',
      userId: 'USR008',
      userName: 'Rahul Mehta',
      email: 'rahul.mehta@company.com',
      department: 'IT',
      role: 'IT Manager',
      action: 'Session Timeout',
      status: 'Auto Logout',
      timestamp: '2025-10-21 14:00:00',
      ipAddress: '202.54.1.78',
      location: 'Kolkata, India',
      device: 'Desktop',
      browser: 'Chrome 118.0',
      os: 'Windows 10',
      sessionId: 'SES-20251021-006',
      duration: '30m',
      mfaUsed: true,
    },
    {
      id: '10',
      userId: 'USR003',
      userName: 'Unknown',
      email: 'amit.patel@company.com',
      department: '-',
      role: '-',
      action: 'Login Attempt',
      status: 'Failed',
      timestamp: '2025-10-21 08:35:22',
      ipAddress: '192.168.100.50',
      location: 'Unknown',
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
      sessionId: '-',
      failureReason: 'Invalid credentials - Account locked',
      mfaUsed: false,
    },
    {
      id: '11',
      userId: 'USR009',
      userName: 'Deepika Rao',
      email: 'deepika.rao@company.com',
      department: 'Production',
      role: 'Production Supervisor',
      action: 'Login',
      status: 'Success',
      timestamp: '2025-10-21 07:00:15',
      ipAddress: '115.96.200.123',
      location: 'Chennai, India',
      device: 'Tablet',
      browser: 'Safari 17.0',
      os: 'iPadOS 17',
      sessionId: 'SES-20251021-007',
      mfaUsed: false,
    },
    {
      id: '12',
      userId: 'USR010',
      userName: 'Unknown',
      email: '-',
      department: '-',
      role: '-',
      action: 'Login Attempt',
      status: 'Suspicious',
      timestamp: '2025-10-21 03:22:45',
      ipAddress: '88.99.111.222',
      location: 'Russia',
      device: 'Desktop',
      browser: 'Chrome 118.0',
      os: 'Linux',
      sessionId: '-',
      failureReason: 'Multiple failed attempts from different locations',
      mfaUsed: false,
    },
  ]);

  const stats: LoginStats = {
    totalLogins: logs.length,
    successfulLogins: logs.filter(l => l.status === 'Success').length,
    failedLogins: logs.filter(l => l.status === 'Failed').length,
    uniqueUsers: new Set(logs.filter(l => l.userId !== '-').map(l => l.userId)).size,
    suspiciousAttempts: logs.filter(l => l.status === 'Suspicious' || l.status === 'Blocked').length,
    mfaLogins: logs.filter(l => l.mfaUsed && l.status === 'Success').length,
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesDevice = filterDevice === 'all' || log.device.toLowerCase() === filterDevice.toLowerCase();
    const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.ipAddress.includes(searchQuery);
    return matchesAction && matchesStatus && matchesDevice && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'blocked':
        return 'bg-orange-100 text-orange-800';
      case 'suspicious':
        return 'bg-purple-100 text-purple-800';
      case 'auto logout':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <LogIn className="w-4 h-4 text-green-600" />;
      case 'logout':
        return <LogOut className="w-4 h-4 text-blue-600" />;
      case 'login attempt':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'session timeout':
        return <XCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
      case 'tablet':
        return <Smartphone className="w-4 h-4" />;
      case 'desktop':
      case 'laptop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (log: LoginAuditLog) => {
    setSelectedLog(log);
  };

  const handleExport = () => {
    alert('Exporting login audit logs...');
  };

  const handleCloseDetails = () => {
    setSelectedLog(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Login Audit Logs</h1>
              <p className="text-gray-600">Track and monitor all user login activities</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Events</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalLogins}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Successful</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.successfulLogins}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Failed</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Unique Users</span>
            <Globe className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Suspicious</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.suspiciousAttempts}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">MFA Used</span>
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.mfaLogins}</div>
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
                placeholder="Search by user, email, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="login attempt">Failed Attempts</option>
            <option value="session timeout">Timeouts</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
            <option value="suspicious">Suspicious</option>
          </select>
          <select
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Devices</option>
            <option value="desktop">Desktop</option>
            <option value="laptop">Laptop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Location</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Device</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">MFA</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{log.userName}</div>
                      {log.email !== '-' && (
                        <div className="text-sm text-gray-500">{log.email}</div>
                      )}
                      {log.department !== '-' && (
                        <div className="text-xs text-gray-400">{log.department} - {log.role}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm text-gray-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{log.ipAddress}</code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {log.location}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getDeviceIcon(log.device)}
                      <div>
                        <div>{log.device}</div>
                        {log.browser !== 'Unknown' && (
                          <div className="text-xs text-gray-400">{log.browser}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {log.mfaUsed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleViewDetails(log)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                     
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No login logs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Login Event Details</h3>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">User Information</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900">{selectedLog.userName}</div>
                    <div className="text-sm text-gray-600">{selectedLog.email}</div>
                    <div className="text-sm text-gray-500">{selectedLog.department} - {selectedLog.role}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Action & Status</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getActionIcon(selectedLog.action)}
                      <span className="font-medium text-gray-900">{selectedLog.action}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Timestamp</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-900">{selectedLog.timestamp}</div>
                    {selectedLog.duration && (
                      <div className="text-sm text-gray-600 mt-1">Duration: {selectedLog.duration}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Session ID</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm text-gray-900">{selectedLog.sessionId}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">IP Address & Location</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm bg-white px-2 py-1 rounded border border-gray-200">{selectedLog.ipAddress}</code>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <MapPin className="w-4 h-4" />
                      {selectedLog.location}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Device Information</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-900 mb-1">
                      {getDeviceIcon(selectedLog.device)}
                      <span>{selectedLog.device}</span>
                    </div>
                    <div className="text-sm text-gray-600">{selectedLog.browser}</div>
                    <div className="text-sm text-gray-600">{selectedLog.os}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Security</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Multi-Factor Authentication:</span>
                      {selectedLog.mfaUsed ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">No</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedLog.failureReason && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Failure Reason</label>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <span className="text-sm text-red-800">{selectedLog.failureReason}</span>
                      </div>
                    </div>
                  </div>
                )}
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

export default LoginAuditLogsPage;
