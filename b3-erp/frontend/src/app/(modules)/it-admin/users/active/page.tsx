'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Plus, Download, Filter, MoreVertical, CheckCircle, Mail, Trash2, Eye, Lock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
  avatar: string;
}

const activeUsers: User[] = [
  {
    id: '001',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-98765-43210',
    department: 'Operations',
    role: 'Manager',
    joinDate: '2024-01-15',
    avatar: '🧑‍💼'
  },
  {
    id: '002',
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91-98765-43211',
    department: 'Sales',
    role: 'Executive',
    joinDate: '2024-02-10',
    avatar: '👩‍💼'
  },
  {
    id: '003',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91-98765-43212',
    department: 'IT',
    role: 'Administrator',
    joinDate: '2024-03-05',
    avatar: '🧑‍💻'
  },
  {
    id: '004',
    name: 'Sneha Sharma',
    email: 'sneha@example.com',
    phone: '+91-98765-43213',
    department: 'HR',
    role: 'Specialist',
    joinDate: '2024-04-20',
    avatar: '👩‍💼'
  },
  {
    id: '005',
    name: 'Vikram Desai',
    email: 'vikram@example.com',
    phone: '+91-98765-43214',
    department: 'Finance',
    role: 'Analyst',
    joinDate: '2024-05-12',
    avatar: '🧑‍💼'
  },
  {
    id: '006',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    phone: '+91-98765-43215',
    department: 'Marketing',
    role: 'Manager',
    joinDate: '2024-06-18',
    avatar: '👩‍💼'
  }
];

export default function ActiveUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const departments = ['all', 'Operations', 'Sales', 'IT', 'HR', 'Finance', 'Marketing'];
  const roles = ['all', 'Manager', 'Executive', 'Administrator', 'Specialist', 'Analyst'];

  const filteredUsers = activeUsers.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchRole = selectedRole === 'all' || user.role === selectedRole;
    return matchSearch && matchDept && matchRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="w-10 h-10 text-emerald-600" />
              Active Users
            </h1>
            <p className="text-slate-600 mt-2">{filteredUsers.length} active users in system</p>
          </div>
          <button 
            onClick={() => router.push('/it-admin/users/create')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{user.avatar}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-600">{user.role}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-600">{user.phone}</p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Department:</span> {user.department}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Joined:</span> {new Date(user.joinDate).toLocaleDateString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Active</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => router.push(`/it-admin/users/${user.id}`)}
                  className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm font-medium flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Reset Password
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No active users found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
