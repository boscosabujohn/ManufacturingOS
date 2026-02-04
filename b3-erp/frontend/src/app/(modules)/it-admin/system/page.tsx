'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Eye, Edit, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SystemConfig {
  id: string;
  settingName: string;
  category: 'security' | 'performance' | 'integration' | 'backup' | 'email' | 'notification';
  currentValue: string;
  defaultValue: string;
  description: string;
  lastModified: string;
  modifiedBy: string;
  dataType: string;
  validationRule: string;
  status: 'active' | 'inactive';
  isRequired: boolean;
  module: string;
  priority: number;
  tags: string[];
}

const mockSystemConfigs: SystemConfig[] = [
  {
    id: 'CFG001',
    settingName: 'Session Timeout',
    category: 'security',
    currentValue: '30 minutes',
    defaultValue: '15 minutes',
    description: 'User session timeout duration for inactive sessions',
    lastModified: '2025-10-15',
    modifiedBy: 'Ravi Kumar',
    dataType: 'integer',
    validationRule: 'Range: 5-120 minutes',
    status: 'active',
    isRequired: true,
    module: 'Authentication',
    priority: 1,
    tags: ['security', 'session', 'timeout']
  },
  {
    id: 'CFG002',
    settingName: 'Max Upload Size',
    category: 'performance',
    currentValue: '50 MB',
    defaultValue: '25 MB',
    description: 'Maximum file upload size for attachments',
    lastModified: '2025-10-10',
    modifiedBy: 'Priya Sharma',
    dataType: 'integer',
    validationRule: 'Range: 1-100 MB',
    status: 'active',
    isRequired: true,
    module: 'File Management',
    priority: 2,
    tags: ['performance', 'upload', 'limit']
  },
  {
    id: 'CFG003',
    settingName: 'API Rate Limit',
    category: 'integration',
    currentValue: '1000 requests/hour',
    defaultValue: '500 requests/hour',
    description: 'API request rate limiting per client',
    lastModified: '2025-09-28',
    modifiedBy: 'Amit Patel',
    dataType: 'integer',
    validationRule: 'Range: 100-5000',
    status: 'active',
    isRequired: true,
    module: 'API Gateway',
    priority: 2,
    tags: ['api', 'rate-limit', 'integration']
  },
  {
    id: 'CFG004',
    settingName: 'Backup Schedule',
    category: 'backup',
    currentValue: 'Daily at 2:00 AM',
    defaultValue: 'Weekly at 2:00 AM',
    description: 'Automated database backup schedule',
    lastModified: '2025-09-15',
    modifiedBy: 'Ravi Kumar',
    dataType: 'cron',
    validationRule: 'Valid cron expression',
    status: 'active',
    isRequired: true,
    module: 'Backup System',
    priority: 1,
    tags: ['backup', 'schedule', 'database']
  },
  {
    id: 'CFG005',
    settingName: 'SMTP Server',
    category: 'email',
    currentValue: 'smtp.b3erp.com:587',
    defaultValue: 'smtp.gmail.com:587',
    description: 'SMTP server configuration for email notifications',
    lastModified: '2025-08-20',
    modifiedBy: 'Neha Desai',
    dataType: 'string',
    validationRule: 'Valid hostname:port',
    status: 'active',
    isRequired: true,
    module: 'Email Service',
    priority: 2,
    tags: ['email', 'smtp', 'notification']
  },
  {
    id: 'CFG006',
    settingName: 'Alert Threshold',
    category: 'notification',
    currentValue: '85%',
    defaultValue: '80%',
    description: 'System resource usage alert threshold',
    lastModified: '2025-07-10',
    modifiedBy: 'Vikram Singh',
    dataType: 'percentage',
    validationRule: 'Range: 50-95%',
    status: 'inactive',
    isRequired: false,
    module: 'Monitoring',
    priority: 3,
    tags: ['notification', 'alert', 'threshold']
  }
];

export default function SystemPage() {
  const [configs] = useState<SystemConfig[]>(mockSystemConfigs);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleExport = () => {
    showToast('Exporting system configuration...', 'info');
  };

  const handleView = (configId: string) => {
    showToast(`Viewing configuration: ${configId}`, 'info');
  };

  const handleEdit = (configId: string) => {
    showToast(`Opening editor for configuration: ${configId}`, 'info');
  };

  const handleReset = (configId: string) => {
    showToast(`Resetting configuration ${configId} to default`, 'success');
  };

  const filteredConfigs = configs.filter(config => {
    const matchesSearch =
      config.settingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.currentValue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || config.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || config.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConfigs = filteredConfigs.slice(startIndex, endIndex);

  const systemHealth = 98.5;
  const uptime = 99.97;
  const storageUsed = 67.3;
  const activeSessions = 142;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'performance':
        return 'bg-blue-100 text-blue-800';
      case 'integration':
        return 'bg-purple-100 text-purple-800';
      case 'backup':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-yellow-100 text-yellow-800';
      case 'notification':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-fuchsia-50 to-purple-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
          {toast.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-500" />}
          <span className="text-sm font-medium text-gray-900">{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex-none p-3 pb-4 space-y-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
            <p className="text-gray-600 mt-1">Manage system settings and parameters</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-fuchsia-300 rounded-lg text-fuchsia-700 hover:bg-fuchsia-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors">
              <span>Add Configuration</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-3 text-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">System Health</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{systemHealth}%</p>
              <p className="text-green-600 text-xs mt-2">All systems operational</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-3 text-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Uptime</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{uptime}%</p>
              <p className="text-blue-600 text-xs mt-2">Last 30 days average</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-3 text-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Storage Used</p>
              <p className="text-3xl font-bold text-orange-700 mt-2">{storageUsed}%</p>
              <p className="text-orange-600 text-xs mt-2">340 GB of 500 GB</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-3 text-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold text-purple-700 mt-2">{activeSessions}</p>
              <p className="text-purple-600 text-xs mt-2">Current user sessions</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden px-6">
        <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Filters Section */}
          <div className="flex-none p-3 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Config ID, Name, Description, or Value..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
          </div>

                        </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="security">Security</option>
                <option value="performance">Performance</option>
                <option value="integration">Integration</option>
                <option value="backup">Backup</option>
                <option value="email">Email</option>
                <option value="notification">Notification</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* DataTable - Scrollable */}
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Config ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Setting Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default Value
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified By
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {currentConfigs.map((config) => (
                <tr key={config.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {config.id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{config.settingName}</div>
                      <div className="text-xs text-gray-500">{config.description}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadgeClass(config.category)}`}>
                      {config.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {config.currentValue}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {config.defaultValue}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {config.lastModified}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {config.modifiedBy}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(config.status)}`}>
                      {config.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(config.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                       
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(config.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                       
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReset(config.id)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                       
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-3 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, filteredConfigs.length)}</span> of{' '}
              <span className="font-medium">{filteredConfigs.length}</span> configurations
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
                        ? 'bg-fuchsia-600 text-white border-fuchsia-600'
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
