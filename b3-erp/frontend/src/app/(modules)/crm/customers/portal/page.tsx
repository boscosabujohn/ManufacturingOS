'use client';

import { useState } from 'react';
import { Globe, Users, Lock, Key, Settings, CheckCircle, XCircle, Clock, Activity, Download, Upload, Eye, Edit, Trash2, Plus, FileText, Package, DollarSign, BarChart3, AlertCircle, Shield, Monitor } from 'lucide-react';

interface PortalUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  loginCount: number;
  permissions: string[];
  accountValue: number;
}

interface PortalAccess {
  feature: string;
  description: string;
  enabled: boolean;
  icon: any;
  category: string;
}

const mockPortalUsers: PortalUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    company: 'TechCorp Global Inc.',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-10-20T09:30:00',
    loginCount: 342,
    permissions: ['orders', 'invoices', 'support', 'documents', 'analytics', 'settings'],
    accountValue: 12500000,
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@techcorp.de',
    company: 'TechCorp Europe GmbH',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-10-20T08:15:00',
    loginCount: 287,
    permissions: ['orders', 'invoices', 'support', 'documents', 'analytics'],
    accountValue: 2800000,
  },
  {
    id: '3',
    name: 'Robert Davis',
    email: 'robert.davis@globalmfg.com',
    company: 'GlobalManufacturing Corp',
    role: 'user',
    status: 'active',
    lastLogin: '2024-10-19T16:45:00',
    loginCount: 156,
    permissions: ['orders', 'invoices', 'support', 'documents'],
    accountValue: 8500000,
  },
  {
    id: '4',
    name: 'Elizabeth Wilson',
    email: 'elizabeth.wilson@financehub.com',
    company: 'FinanceHub International',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-10-20T10:00:00',
    loginCount: 421,
    permissions: ['orders', 'invoices', 'support', 'documents', 'analytics', 'settings'],
    accountValue: 6200000,
  },
  {
    id: '5',
    name: 'Michael Chen',
    email: 'michael.chen@startup.io',
    company: 'StartupTech Inc.',
    role: 'user',
    status: 'active',
    lastLogin: '2024-10-18T14:20:00',
    loginCount: 89,
    permissions: ['orders', 'invoices', 'support'],
    accountValue: 450000,
  },
  {
    id: '6',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@enterprise.com',
    company: 'Enterprise Solutions Ltd.',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2024-09-15T11:30:00',
    loginCount: 23,
    permissions: ['documents'],
    accountValue: 1200000,
  },
  {
    id: '7',
    name: 'David Martinez',
    email: 'david.martinez@newclient.com',
    company: 'NewClient Corp',
    role: 'user',
    status: 'pending',
    lastLogin: '',
    loginCount: 0,
    permissions: ['orders', 'invoices'],
    accountValue: 0,
  },
];

const portalFeatures: PortalAccess[] = [
  {
    feature: 'Order Management',
    description: 'View and place orders, track shipments',
    enabled: true,
    icon: Package,
    category: 'Commerce',
  },
  {
    feature: 'Invoice & Payments',
    description: 'Access invoices, make payments, view history',
    enabled: true,
    icon: DollarSign,
    category: 'Finance',
  },
  {
    feature: 'Support Tickets',
    description: 'Create and manage support requests',
    enabled: true,
    icon: AlertCircle,
    category: 'Support',
  },
  {
    feature: 'Document Library',
    description: 'Access contracts, specifications, and resources',
    enabled: true,
    icon: FileText,
    category: 'Documents',
  },
  {
    feature: 'Analytics Dashboard',
    description: 'View usage analytics and reports',
    enabled: true,
    icon: BarChart3,
    category: 'Analytics',
  },
  {
    feature: 'Product Catalog',
    description: 'Browse products and pricing',
    enabled: true,
    icon: Monitor,
    category: 'Commerce',
  },
  {
    feature: 'API Access',
    description: 'REST API for integration',
    enabled: false,
    icon: Key,
    category: 'Technical',
  },
  {
    feature: 'Custom Reports',
    description: 'Generate custom business reports',
    enabled: true,
    icon: Download,
    category: 'Analytics',
  },
];

export default function CustomerPortalPage() {
  const [users] = useState<PortalUser[]>(mockPortalUsers);
  const [features] = useState<PortalAccess[]>(portalFeatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user' | 'viewer'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'activity'>('users');

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesStatus && matchesRole;
    });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    totalLogins: users.reduce((sum, u) => sum + u.loginCount, 0),
    avgLoginsPerUser: Math.round(users.reduce((sum, u) => sum + u.loginCount, 0) / users.filter(u => u.loginCount > 0).length),
    enabledFeatures: features.filter(f => f.enabled).length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTimeSince = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Portal Management</h1>
            <p className="text-gray-600 mt-1">Manage customer portal access and features</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalUsers}</div>
            <div className="text-blue-100">Total Users</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeUsers}</div>
            <div className="text-green-100">Active Users</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pendingUsers}</div>
            <div className="text-yellow-100">Pending</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalLogins}</div>
            <div className="text-purple-100">Total Logins</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgLoginsPerUser}</div>
            <div className="text-orange-100">Avg Logins/User</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.enabledFeatures}/{features.length}</div>
            <div className="text-teal-100">Features Enabled</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Portal Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'features'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Features & Access
              </div>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Log
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          {user.status}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {user.email}
                          </span>
                          <span>•</span>
                          <span>{user.company}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xs text-blue-600 mb-1">Last Login</div>
                          <div className="text-sm font-semibold text-blue-900">
                            {getTimeSince(user.lastLogin)}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-green-600 mb-1">Total Logins</div>
                          <div className="text-sm font-semibold text-green-900">
                            {user.loginCount.toLocaleString()}
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="text-xs text-purple-600 mb-1">Permissions</div>
                          <div className="text-sm font-semibold text-purple-900">
                            {user.permissions.length}
                          </div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="text-xs text-orange-600 mb-1">Account Value</div>
                          <div className="text-sm font-semibold text-orange-900">
                            ${(user.accountValue / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs text-gray-600 mb-2">Portal Access:</div>
                        <div className="flex flex-wrap gap-2">
                          {user.permissions.map((permission) => (
                            <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${feature.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-6 h-6 ${feature.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.feature}</h3>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {feature.category}
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={feature.enabled}
                      onChange={() => {}}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${feature.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {feature.enabled ? 'Enabled for all users' : 'Currently disabled'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {users.filter(u => u.lastLogin).slice(0, 10).map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">Logged in from {user.company}</div>
                </div>
                <div className="text-sm text-gray-500">{getTimeSince(user.lastLogin)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
