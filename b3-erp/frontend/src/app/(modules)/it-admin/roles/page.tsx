'use client';

import { useState } from 'react';
import { Search, Download, Eye, Edit, Copy } from 'lucide-react';

interface Role {
  id: string;
  roleName: string;
  roleType: 'system' | 'custom';
  usersCount: number;
  permissionsCount: number;
  description: string;
  createdDate: string;
  createdBy: string;
  lastModified: string;
  modifiedBy: string;
  status: 'active' | 'inactive';
  permissions: string[];
  modules: string[];
  priority: number;
  isDefault: boolean;
}

const mockRoles: Role[] = [
  {
    id: 'ROLE001',
    roleName: 'System Administrator',
    roleType: 'system',
    usersCount: 3,
    permissionsCount: 50,
    description: 'Full system access with all permissions',
    createdDate: '2023-01-01',
    createdBy: 'System',
    lastModified: '2025-09-15',
    modifiedBy: 'Ravi Kumar',
    status: 'active',
    permissions: ['Read', 'Write', 'Delete', 'Approve', 'Export'],
    modules: ['All Modules'],
    priority: 1,
    isDefault: true
  },
  {
    id: 'ROLE002',
    roleName: 'Production Manager',
    roleType: 'custom',
    usersCount: 5,
    permissionsCount: 35,
    description: 'Manage production operations and workflows',
    createdDate: '2023-02-15',
    createdBy: 'Ravi Kumar',
    lastModified: '2025-08-20',
    modifiedBy: 'Ravi Kumar',
    status: 'active',
    permissions: ['Read', 'Write', 'Approve', 'Export'],
    modules: ['Production', 'Inventory', 'Quality Control'],
    priority: 2,
    isDefault: false
  },
  {
    id: 'ROLE003',
    roleName: 'Quality Inspector',
    roleType: 'custom',
    usersCount: 8,
    permissionsCount: 20,
    description: 'Quality control and inspection permissions',
    createdDate: '2023-03-10',
    createdBy: 'Priya Sharma',
    lastModified: '2025-07-05',
    modifiedBy: 'Amit Patel',
    status: 'active',
    permissions: ['Read', 'Write', 'Export'],
    modules: ['Quality Control', 'Production', 'Reports'],
    priority: 3,
    isDefault: false
  },
  {
    id: 'ROLE004',
    roleName: 'Inventory Supervisor',
    roleType: 'custom',
    usersCount: 6,
    permissionsCount: 25,
    description: 'Inventory management and stock control',
    createdDate: '2023-04-22',
    createdBy: 'Ravi Kumar',
    lastModified: '2025-06-10',
    modifiedBy: 'Neha Desai',
    status: 'active',
    permissions: ['Read', 'Write', 'Approve', 'Export'],
    modules: ['Inventory', 'Warehouse', 'Purchasing'],
    priority: 3,
    isDefault: false
  },
  {
    id: 'ROLE005',
    roleName: 'Sales Representative',
    roleType: 'system',
    usersCount: 12,
    permissionsCount: 15,
    description: 'Sales operations and customer management',
    createdDate: '2023-01-01',
    createdBy: 'System',
    lastModified: '2025-05-18',
    modifiedBy: 'Ravi Kumar',
    status: 'active',
    permissions: ['Read', 'Write', 'Export'],
    modules: ['Sales', 'Customers', 'Orders'],
    priority: 4,
    isDefault: true
  },
  {
    id: 'ROLE006',
    roleName: 'Finance Auditor',
    roleType: 'custom',
    usersCount: 2,
    permissionsCount: 18,
    description: 'Financial reporting and audit access',
    createdDate: '2024-01-15',
    createdBy: 'Ravi Kumar',
    lastModified: '2025-03-25',
    modifiedBy: 'Ravi Kumar',
    status: 'inactive',
    permissions: ['Read', 'Export'],
    modules: ['Finance', 'Reports', 'Audit'],
    priority: 5,
    isDefault: false
  }
];

export default function RolesPage() {
  const [roles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleTypeFilter, setRoleTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRoles = roles.filter(role => {
    const matchesSearch =
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRoleType = roleTypeFilter === 'all' || role.roleType === roleTypeFilter;
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;

    return matchesSearch && matchesRoleType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.status === 'active').length;
  const customRoles = roles.filter(r => r.roleType === 'custom').length;
  const avgPermissions = Math.round(roles.reduce((sum, r) => sum + r.permissionsCount, 0) / roles.length);

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

  const getRoleTypeBadgeClass = (roleType: string) => {
    switch (roleType) {
      case 'system':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'custom':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleExport = () => {
    console.log('Exporting roles report...');
  };

  const handleView = (roleId: string) => {
    console.log('Viewing role:', roleId);
  };

  const handleEdit = (roleId: string) => {
    console.log('Editing role:', roleId);
  };

  const handleDuplicate = (roleId: string) => {
    console.log('Duplicating role:', roleId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage system roles and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Roles</p>
              <p className="text-3xl font-bold mt-2">{totalRoles}</p>
              <p className="text-indigo-100 text-xs mt-2">All defined roles</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Roles</p>
              <p className="text-3xl font-bold mt-2">{activeRoles}</p>
              <p className="text-green-100 text-xs mt-2">{((activeRoles / totalRoles) * 100).toFixed(1)}% of total</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Custom Roles</p>
              <p className="text-3xl font-bold mt-2">{customRoles}</p>
              <p className="text-purple-100 text-xs mt-2">User-defined roles</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Permissions</p>
              <p className="text-3xl font-bold mt-2">{avgPermissions}</p>
              <p className="text-orange-100 text-xs mt-2">Per role average</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
              placeholder="Search by Role ID, Name, or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleTypeFilter}
            onChange={(e) => setRoleTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="custom">Custom</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{role.roleName}</div>
                      <div className="text-xs text-gray-500">{role.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleTypeBadgeClass(role.roleType)}`}>
                      {role.roleType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{role.usersCount}</span> users
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{role.permissionsCount}</span> permissions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {role.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {role.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(role.status)}`}>
                      {role.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(role.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Role"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(role.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Edit Role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(role.id)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Duplicate Role"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
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
              <span className="font-medium">{Math.min(endIndex, filteredRoles.length)}</span> of{' '}
              <span className="font-medium">{filteredRoles.length}</span> roles
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
