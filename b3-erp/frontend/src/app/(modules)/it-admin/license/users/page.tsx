'use client'

import { useState } from 'react'
import {
  Users, CheckCircle, XCircle, Clock, Search, Filter,
  Download, UserPlus, UserMinus, Calendar, Shield, Mail
} from 'lucide-react'

interface LicensedUser {
  id: string
  name: string
  email: string
  department: string
  role: string
  licenseType: string
  status: 'active' | 'inactive' | 'suspended'
  assignedDate: string
  lastLogin: string
  modulesAccess: string[]
}

export default function LicenseUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const [users] = useState<LicensedUser[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      department: 'IT Administration',
      role: 'System Administrator',
      licenseType: 'Full Access',
      status: 'active',
      assignedDate: '2024-01-15',
      lastLogin: '2024-10-21 10:30 AM',
      modulesAccess: ['IT Admin', 'User Management', 'Security', 'Database']
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      department: 'Sales',
      role: 'Sales Manager',
      licenseType: 'Full Access',
      status: 'active',
      assignedDate: '2024-01-20',
      lastLogin: '2024-10-21 09:15 AM',
      modulesAccess: ['CRM', 'Sales', 'Quotes', 'Customers']
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@company.com',
      department: 'Production',
      role: 'Production Manager',
      licenseType: 'Full Access',
      status: 'active',
      assignedDate: '2024-02-01',
      lastLogin: '2024-10-21 08:45 AM',
      modulesAccess: ['Production', 'Inventory', 'Quality Control', 'BOM']
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@company.com',
      department: 'Finance',
      role: 'Finance Head',
      licenseType: 'Full Access',
      status: 'active',
      assignedDate: '2024-01-18',
      lastLogin: '2024-10-21 11:00 AM',
      modulesAccess: ['Finance', 'Accounting', 'Reports', 'Budgets']
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@company.com',
      department: 'HR',
      role: 'HR Manager',
      licenseType: 'Full Access',
      status: 'active',
      assignedDate: '2024-02-10',
      lastLogin: '2024-10-20 04:30 PM',
      modulesAccess: ['HR', 'Payroll', 'Recruitment', 'Training']
    },
    {
      id: '6',
      name: 'Anjali Desai',
      email: 'anjali.desai@company.com',
      department: 'Inventory',
      role: 'Inventory Manager',
      licenseType: 'Full Access',
      status: 'active',
      assignedDate: '2024-02-15',
      lastLogin: '2024-10-21 07:20 AM',
      modulesAccess: ['Inventory', 'Warehouse', 'Stock', 'Transfers']
    },
    {
      id: '7',
      name: 'Rahul Mehta',
      email: 'rahul.mehta@company.com',
      department: 'Sales',
      role: 'Sales Executive',
      licenseType: 'Standard',
      status: 'active',
      assignedDate: '2024-03-01',
      lastLogin: '2024-10-21 09:45 AM',
      modulesAccess: ['CRM', 'Sales', 'Customers']
    },
    {
      id: '8',
      name: 'Kavita Joshi',
      email: 'kavita.joshi@company.com',
      department: 'Production',
      role: 'Production Supervisor',
      licenseType: 'Standard',
      status: 'active',
      assignedDate: '2024-03-10',
      lastLogin: '2024-10-21 06:30 AM',
      modulesAccess: ['Production', 'Work Orders', 'Quality']
    },
    {
      id: '9',
      name: 'Manish Gupta',
      email: 'manish.gupta@company.com',
      department: 'IT Support',
      role: 'IT Support Specialist',
      licenseType: 'Limited',
      status: 'active',
      assignedDate: '2024-03-15',
      lastLogin: '2024-10-21 10:00 AM',
      modulesAccess: ['Support', 'Tickets', 'Knowledge Base']
    },
    {
      id: '10',
      name: 'Deepa Nair',
      email: 'deepa.nair@company.com',
      department: 'Finance',
      role: 'Accountant',
      licenseType: 'Standard',
      status: 'inactive',
      assignedDate: '2024-02-20',
      lastLogin: '2024-09-15 03:20 PM',
      modulesAccess: ['Finance', 'Accounting', 'Reports']
    },
    {
      id: '11',
      name: 'Suresh Iyer',
      email: 'suresh.iyer@company.com',
      department: 'Sales',
      role: 'Sales Executive',
      licenseType: 'Standard',
      status: 'suspended',
      assignedDate: '2024-04-01',
      lastLogin: '2024-10-10 02:00 PM',
      modulesAccess: ['CRM', 'Sales']
    },
    {
      id: '12',
      name: 'Pooja Verma',
      email: 'pooja.verma@company.com',
      department: 'HR',
      role: 'HR Executive',
      licenseType: 'Standard',
      status: 'active',
      assignedDate: '2024-04-15',
      lastLogin: '2024-10-21 08:00 AM',
      modulesAccess: ['HR', 'Recruitment', 'Employee Records']
    }
  ])

  const [stats] = useState({
    totalLicenses: 500,
    assignedLicenses: 387,
    availableLicenses: 113,
    activeUsers: 365,
    inactiveUsers: 18,
    suspendedUsers: 4
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50'
      case 'inactive':
        return 'text-gray-600 bg-gray-50'
      case 'suspended':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'inactive':
        return <Clock className="h-5 w-5 text-gray-600" />
      case 'suspended':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case 'Full Access':
        return 'text-purple-600 bg-purple-50'
      case 'Standard':
        return 'text-blue-600 bg-blue-50'
      case 'Limited':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = Array.from(new Set(users.map(u => u.department)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Licensed Users</h1>
          <p className="text-gray-600 mt-1">Manage user license assignments and access</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 inline mr-2" />
            Export Users
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700">
            <UserPlus className="h-4 w-4 inline mr-2" />
            Assign License
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Licenses</p>
              <p className="text-3xl font-bold mt-1">{stats.totalLicenses}</p>
            </div>
            <Users className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Assigned Licenses</p>
              <p className="text-3xl font-bold mt-1">{stats.assignedLicenses}</p>
              <p className="text-xs opacity-75 mt-1">
                {((stats.assignedLicenses / stats.totalLicenses) * 100).toFixed(1)}% utilized
              </p>
            </div>
            <CheckCircle className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Available Licenses</p>
              <p className="text-3xl font-bold mt-1">{stats.availableLicenses}</p>
            </div>
            <UserPlus className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-3xl font-bold mt-1">{stats.activeUsers}</p>
            </div>
            <CheckCircle className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Inactive Users</p>
              <p className="text-3xl font-bold mt-1">{stats.inactiveUsers}</p>
            </div>
            <Clock className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Suspended Users</p>
              <p className="text-3xl font-bold mt-1">{stats.suspendedUsers}</p>
            </div>
            <XCircle className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Licensed Users</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLicenseTypeColor(user.licenseType)}`}>
                      {user.licenseType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {user.assignedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 mr-3">
                      View
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                      <UserMinus className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
