'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, Users, Shield, MapPin, Briefcase, Clock } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockUsers, User, getUserStats } from '@/data/common-masters/users';

export default function UserMasterPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAccessLevel, setFilterAccessLevel] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique departments and locations
  const departments = useMemo(() => {
    return Array.from(new Set(users.map(u => u.department))).sort();
  }, [users]);

  const locations = useMemo(() => {
    return Array.from(new Set(users.map(u => u.location))).sort();
  }, [users]);

  // Filtered data
  const filteredData = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
      const matchesLocation = filterLocation === 'all' || user.location === filterLocation;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && user.isActive) ||
        (filterStatus === 'inactive' && !user.isActive);
      const matchesAccessLevel = filterAccessLevel === 'all' || user.accessLevel === filterAccessLevel;

      return matchesSearch && matchesDepartment && matchesLocation && matchesStatus && matchesAccessLevel;
    });
  }, [users, searchTerm, filterDepartment, filterLocation, filterStatus, filterAccessLevel]);

  const getStatusColor = (status: string) => {
    const colors = {
      'probation': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'notice_period': 'bg-orange-100 text-orange-800',
      'separated': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelColor = (level: string) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'manager': 'bg-blue-100 text-blue-800',
      'employee': 'bg-green-100 text-green-800',
      'restricted': 'bg-gray-100 text-gray-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Table columns
  const columns: Column<User>[] = [
    {
      id: 'employee',
      header: 'Employee',
      accessor: 'employeeCode',
      sortable: true,
      width: 'w-48',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.fullName}</div>
          <div className="text-xs text-gray-500">
            <span className="font-mono font-semibold text-blue-600">{value}</span> • {row.designation}
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: 'email',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.phone}</div>
        </div>
      )
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{value}</span>
          </div>
          <div className="text-xs text-gray-500">{row.grade}</div>
        </div>
      )
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{value}</span>
          </div>
          <div className="text-xs text-gray-500">{row.branch}</div>
        </div>
      )
    },
    {
      id: 'role',
      header: 'Role & Access',
      accessor: 'role',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getAccessLevelColor(row.accessLevel)}`}>
              {row.accessLevel}
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'employmentStatus',
      header: 'Status',
      accessor: 'employmentStatus',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(value)}`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    {
      id: 'shift',
      header: 'Shift',
      accessor: 'shift',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{value}</span>
        </div>
      )
    },
    {
      id: 'mfa',
      header: 'Security',
      accessor: 'mfaEnabled',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          <div className={value ? 'text-green-600' : 'text-gray-400'}>
            {value ? '🔒 MFA Enabled' : '🔓 MFA Off'}
          </div>
          <div className="text-gray-500 mt-0.5">
            {row.accountLocked ? '🚫 Locked' : '✓ Active'}
          </div>
        </div>
      )
    },
    {
      id: 'accountStatus',
      header: 'Account',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          text={value ? 'Active' : 'Inactive'}
        />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('View user:', row);
            }}
          >
            View
          </button>
          <button
            className="text-green-600 hover:text-green-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit user:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to deactivate ${row.fullName}?`)) {
                setUsers(prev => prev.map(u =>
                  u.id === row.id ? { ...u, isActive: false } : u
                ));
              }
            }}
          >
            Deactivate
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
    setFilterLocation('all');
    setFilterStatus('all');
    setFilterAccessLevel('all');
  };

  const activeFilterCount = [
    filterDepartment !== 'all',
    filterLocation !== 'all',
    filterStatus !== 'all',
    filterAccessLevel !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => getUserStats(), [users]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            User Master
          </h1>
          <p className="text-gray-600 mt-1">Manage employee accounts, roles, and access permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export users')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => console.log('Add user')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">On Probation</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.onProbation}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Managers</div>
          <div className="text-2xl font-bold text-blue-600">{stats.managers}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> MFA Enabled
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.mfaEnabled}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Contract</div>
          <div className="text-2xl font-bold text-orange-600">{stats.contract}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, employee code, email, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <select
                value={filterAccessLevel}
                onChange={(e) => setFilterAccessLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          data={filteredData}
          columns={columns}
          pagination={{
            enabled: true,
            pageSize: 10
          }}
          sorting={{
            enabled: true,
            defaultSort: { column: 'employee', direction: 'asc' }
          }}
          emptyMessage="No users found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          User Account Security & Access Control
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Multi-Factor Authentication (MFA) strongly recommended for all managers and admin users</li>
          <li>✓ Role-based access control (RBAC) ensures users only see data relevant to their permissions</li>
          <li>✓ Probation period employees have restricted access until confirmation</li>
          <li>✓ Password must be changed every 90 days as per IT security policy</li>
          <li>✓ Account automatically locks after 5 failed login attempts</li>
          <li>✓ All user activities are logged for audit and compliance purposes</li>
        </ul>
      </div>
    </div>
  );
}
