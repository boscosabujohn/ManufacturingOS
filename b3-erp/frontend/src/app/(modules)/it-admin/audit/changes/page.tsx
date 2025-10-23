'use client';

import { useState } from 'react';
import { History, Database, User, Settings, FileText, Shield, Edit, Trash2, Filter, Download, Eye, Search, XCircle, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

interface SystemChangeLog {
  id: string;
  changeId: string;
  timestamp: string;
  userId: string;
  userName: string;
  email: string;
  department: string;
  role: string;
  category: string;
  changeType: string;
  targetModule: string;
  targetEntity: string;
  action: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  location: string;
  device: string;
  approvalStatus: string;
  approvedBy?: string;
  approvalDate?: string;
  reason?: string;
  impact: string;
}

interface ChangeStats {
  totalChanges: number;
  userChanges: number;
  settingsChanges: number;
  dataChanges: number;
  pendingApproval: number;
  criticalChanges: number;
}

const SystemChangesAuditPage = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterImpact, setFilterImpact] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [selectedChange, setSelectedChange] = useState<SystemChangeLog | null>(null);

  const [changes] = useState<SystemChangeLog[]>([
    {
      id: '1',
      changeId: 'CHG-20251021-001',
      timestamp: '2025-10-21 10:30:45',
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      department: 'IT',
      role: 'Admin',
      category: 'User Management',
      changeType: 'Role Assignment',
      targetModule: 'User Management',
      targetEntity: 'User: Priya Sharma',
      action: 'Modified',
      fieldChanged: 'Role',
      oldValue: 'HR Executive',
      newValue: 'HR Manager',
      ipAddress: '103.21.244.45',
      location: 'Mumbai, India',
      device: 'Desktop',
      approvalStatus: 'Approved',
      approvedBy: 'Vikram Singh',
      approvalDate: '2025-10-21 10:35:00',
      reason: 'Promotion to managerial role',
      impact: 'Medium',
    },
    {
      id: '2',
      changeId: 'CHG-20251021-002',
      timestamp: '2025-10-21 09:15:23',
      userId: 'USR002',
      userName: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      department: 'HR',
      role: 'HR Manager',
      category: 'System Settings',
      changeType: 'Configuration Change',
      targetModule: 'Email Settings',
      targetEntity: 'SMTP Configuration',
      action: 'Modified',
      fieldChanged: 'SMTP Port',
      oldValue: '465',
      newValue: '587',
      ipAddress: '103.50.161.89',
      location: 'Bangalore, India',
      device: 'Laptop',
      approvalStatus: 'Approved',
      approvedBy: 'Rajesh Kumar',
      approvalDate: '2025-10-21 09:20:00',
      reason: 'TLS configuration update',
      impact: 'High',
    },
    {
      id: '3',
      changeId: 'CHG-20251021-003',
      timestamp: '2025-10-21 11:45:12',
      userId: 'USR003',
      userName: 'Amit Patel',
      email: 'amit.patel@company.com',
      department: 'Sales',
      role: 'Sales Manager',
      category: 'Master Data',
      changeType: 'Data Update',
      targetModule: 'Customer Master',
      targetEntity: 'Customer: ABC Industries Ltd',
      action: 'Modified',
      fieldChanged: 'Credit Limit',
      oldValue: '₹5,00,000',
      newValue: '₹10,00,000',
      ipAddress: '117.198.144.73',
      location: 'Ahmedabad, India',
      device: 'Desktop',
      approvalStatus: 'Pending',
      reason: 'Increased business volume',
      impact: 'High',
    },
    {
      id: '4',
      changeId: 'CHG-20251021-004',
      timestamp: '2025-10-21 08:30:56',
      userId: 'USR004',
      userName: 'Sneha Reddy',
      email: 'sneha.reddy@company.com',
      department: 'IT',
      role: 'IT Manager',
      category: 'Security',
      changeType: 'Security Policy',
      targetModule: 'Security Settings',
      targetEntity: 'Password Policy',
      action: 'Modified',
      fieldChanged: 'Password Expiry Days',
      oldValue: '90',
      newValue: '60',
      ipAddress: '182.68.205.12',
      location: 'Hyderabad, India',
      device: 'Laptop',
      approvalStatus: 'Approved',
      approvedBy: 'Rajesh Kumar',
      approvalDate: '2025-10-21 08:35:00',
      reason: 'Enhanced security compliance',
      impact: 'Critical',
    },
    {
      id: '5',
      changeId: 'CHG-20251021-005',
      timestamp: '2025-10-21 14:20:33',
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      department: 'IT',
      role: 'Admin',
      category: 'User Management',
      changeType: 'User Creation',
      targetModule: 'User Management',
      targetEntity: 'User: Rahul Mehta',
      action: 'Created',
      fieldChanged: 'User Account',
      oldValue: '-',
      newValue: 'Active',
      ipAddress: '103.21.244.45',
      location: 'Mumbai, India',
      device: 'Desktop',
      approvalStatus: 'Auto-Approved',
      reason: 'New employee onboarding',
      impact: 'Low',
    },
    {
      id: '6',
      changeId: 'CHG-20251021-006',
      timestamp: '2025-10-21 13:15:45',
      userId: 'USR005',
      userName: 'Vikram Singh',
      email: 'vikram.singh@company.com',
      department: 'Operations',
      role: 'Operations Manager',
      category: 'System Settings',
      changeType: 'Configuration Change',
      targetModule: 'Workflow Settings',
      targetEntity: 'Purchase Order Approval',
      action: 'Modified',
      fieldChanged: 'Approval Threshold',
      oldValue: '₹1,00,000',
      newValue: '₹2,00,000',
      ipAddress: '117.198.144.73',
      location: 'Delhi, India',
      device: 'Desktop',
      approvalStatus: 'Pending',
      reason: 'Streamline approval process',
      impact: 'High',
    },
    {
      id: '7',
      changeId: 'CHG-20251021-007',
      timestamp: '2025-10-21 12:05:22',
      userId: 'USR006',
      userName: 'Anjali Desai',
      email: 'anjali.desai@company.com',
      department: 'Finance',
      role: 'Finance Manager',
      category: 'Master Data',
      changeType: 'Data Update',
      targetModule: 'Supplier Master',
      targetEntity: 'Supplier: XYZ Components Pvt Ltd',
      action: 'Modified',
      fieldChanged: 'Payment Terms',
      oldValue: 'Net 30',
      newValue: 'Net 45',
      ipAddress: '157.48.123.45',
      location: 'Pune, India',
      device: 'Laptop',
      approvalStatus: 'Approved',
      approvedBy: 'Vikram Singh',
      approvalDate: '2025-10-21 12:10:00',
      reason: 'Negotiated better payment terms',
      impact: 'Medium',
    },
    {
      id: '8',
      changeId: 'CHG-20251021-008',
      timestamp: '2025-10-21 15:30:12',
      userId: 'USR007',
      userName: 'Deepika Rao',
      email: 'deepika.rao@company.com',
      department: 'IT',
      role: 'IT Manager',
      category: 'Security',
      changeType: 'Access Control',
      targetModule: 'IP Whitelist',
      targetEntity: 'IP: 203.45.67.89',
      action: 'Deleted',
      fieldChanged: 'IP Address',
      oldValue: '203.45.67.89 (Office - Kolkata)',
      newValue: '-',
      ipAddress: '202.54.1.78',
      location: 'Kolkata, India',
      device: 'Desktop',
      approvalStatus: 'Approved',
      approvedBy: 'Rajesh Kumar',
      approvalDate: '2025-10-21 15:35:00',
      reason: 'Office relocation',
      impact: 'Medium',
    },
    {
      id: '9',
      changeId: 'CHG-20251021-009',
      timestamp: '2025-10-21 16:45:33',
      userId: 'USR008',
      userName: 'Rahul Mehta',
      email: 'rahul.mehta@company.com',
      department: 'Production',
      role: 'Production Supervisor',
      category: 'Master Data',
      changeType: 'Data Update',
      targetModule: 'Item Master',
      targetEntity: 'Item: RAW-MAT-1234',
      action: 'Modified',
      fieldChanged: 'Reorder Level',
      oldValue: '100 units',
      newValue: '150 units',
      ipAddress: '115.96.200.123',
      location: 'Chennai, India',
      device: 'Tablet',
      approvalStatus: 'Pending',
      reason: 'Increased production demand',
      impact: 'Low',
    },
    {
      id: '10',
      changeId: 'CHG-20251021-010',
      timestamp: '2025-10-21 17:20:45',
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      department: 'IT',
      role: 'Admin',
      category: 'User Management',
      changeType: 'User Deactivation',
      targetModule: 'User Management',
      targetEntity: 'User: Amit Patel',
      action: 'Modified',
      fieldChanged: 'Status',
      oldValue: 'Active',
      newValue: 'Inactive',
      ipAddress: '103.21.244.45',
      location: 'Mumbai, India',
      device: 'Desktop',
      approvalStatus: 'Approved',
      approvedBy: 'Vikram Singh',
      approvalDate: '2025-10-21 17:25:00',
      reason: 'Employee resignation',
      impact: 'Medium',
    },
  ]);

  const stats: ChangeStats = {
    totalChanges: changes.length,
    userChanges: changes.filter(c => c.category === 'User Management').length,
    settingsChanges: changes.filter(c => c.category === 'System Settings').length,
    dataChanges: changes.filter(c => c.category === 'Master Data').length,
    pendingApproval: changes.filter(c => c.approvalStatus === 'Pending').length,
    criticalChanges: changes.filter(c => c.impact === 'Critical').length,
  };

  const filteredChanges = changes.filter(change => {
    const matchesCategory = filterCategory === 'all' || change.category === filterCategory;
    const matchesType = filterType === 'all' || change.changeType === filterType;
    const matchesImpact = filterImpact === 'all' || change.impact === filterImpact;
    const matchesApproval = filterApproval === 'all' || change.approvalStatus === filterApproval;
    const matchesSearch = change.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         change.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         change.changeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesImpact && matchesApproval && matchesSearch;
  });

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
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

  const getApprovalColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'auto-approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'user management':
        return <User className="w-4 h-4" />;
      case 'system settings':
        return <Settings className="w-4 h-4" />;
      case 'master data':
        return <Database className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'modified':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleViewDetails = (change: SystemChangeLog) => {
    setSelectedChange(change);
  };

  const handleExport = () => {
    alert('Exporting system changes audit logs...');
  };

  const handleCloseDetails = () => {
    setSelectedChange(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Changes Audit</h1>
              <p className="text-gray-600">Track all system configuration and data changes</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
            <span className="text-sm text-gray-600">Total Changes</span>
            <History className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalChanges}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">User Changes</span>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.userChanges}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Settings</span>
            <Settings className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.settingsChanges}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Data Changes</span>
            <Database className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.dataChanges}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending</span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical</span>
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.criticalChanges}</div>
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
                placeholder="Search by user, entity, or change ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="User Management">User Management</option>
            <option value="System Settings">System Settings</option>
            <option value="Master Data">Master Data</option>
            <option value="Security">Security</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Role Assignment">Role Assignment</option>
            <option value="Configuration Change">Configuration</option>
            <option value="Data Update">Data Update</option>
            <option value="Security Policy">Security Policy</option>
            <option value="User Creation">User Creation</option>
            <option value="User Deactivation">Deactivation</option>
          </select>
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Impact</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterApproval}
            onChange={(e) => setFilterApproval(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Change ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Change</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Impact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Approval</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChanges.map((change) => (
                <tr key={change.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-purple-50 text-purple-800 px-2 py-1 rounded font-medium">
                      {change.changeId}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {change.timestamp}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{change.userName}</div>
                      <div className="text-xs text-gray-500">{change.department} - {change.role}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {getCategoryIcon(change.category)}
                      <span>{change.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getActionIcon(change.action)}
                        <span className="text-sm font-medium text-gray-900">{change.action}</span>
                      </div>
                      <div className="text-sm text-gray-600">{change.targetEntity}</div>
                      <div className="text-xs text-gray-500">{change.fieldChanged}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(change.impact)}`}>
                      {change.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getApprovalColor(change.approvalStatus)}`}>
                      {change.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleViewDetails(change)}
                      className="text-purple-600 hover:text-purple-700 p-1"
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

        {filteredChanges.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No change logs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Change Details</h3>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Change ID</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm font-medium text-purple-800">{selectedChange.changeId}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Timestamp</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-900">{selectedChange.timestamp}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Changed By</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900">{selectedChange.userName}</div>
                    <div className="text-sm text-gray-600">{selectedChange.email}</div>
                    <div className="text-sm text-gray-500">{selectedChange.department} - {selectedChange.role}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category & Type</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(selectedChange.category)}
                      <span className="text-gray-900">{selectedChange.category}</span>
                    </div>
                    <div className="text-sm text-gray-600">{selectedChange.changeType}</div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Target Entity</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900">{selectedChange.targetEntity}</div>
                    <div className="text-sm text-gray-600">Module: {selectedChange.targetModule}</div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Change Details</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Action</div>
                        <div className="flex items-center gap-2">
                          {getActionIcon(selectedChange.action)}
                          <span className="font-medium text-gray-900">{selectedChange.action}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Field</div>
                        <div className="font-medium text-gray-900">{selectedChange.fieldChanged}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Impact</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(selectedChange.impact)}`}>
                          {selectedChange.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Old Value</label>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <code className="text-sm text-red-800">{selectedChange.oldValue}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">New Value</label>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <code className="text-sm text-green-800">{selectedChange.newValue}</code>
                  </div>
                </div>

                {selectedChange.reason && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">{selectedChange.reason}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Approval Status</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getApprovalColor(selectedChange.approvalStatus)}`}>
                      {selectedChange.approvalStatus}
                    </span>
                    {selectedChange.approvedBy && (
                      <div className="mt-2 text-sm text-gray-600">
                        Approved by: {selectedChange.approvedBy}
                        <div className="text-xs text-gray-500">{selectedChange.approvalDate}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm bg-white px-2 py-1 rounded border border-gray-200">{selectedChange.ipAddress}</code>
                    <div className="text-sm text-gray-600 mt-2">{selectedChange.location}</div>
                    <div className="text-sm text-gray-500">{selectedChange.device}</div>
                  </div>
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

export default SystemChangesAuditPage;
