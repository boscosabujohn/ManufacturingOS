'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Plus, Download, Filter, MoreVertical, UserX, Mail, RotateCcw, Eye } from 'lucide-react';

interface InactiveUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  deactivatedDate: string;
  deactivationReason: string;
  avatar: string;
}

const inactiveUsers: InactiveUser[] = [
  {
    id: '101',
    name: 'Arjun Verma',
    email: 'arjun@example.com',
    phone: '+91-98765-43220',
    department: 'Operations',
    role: 'Supervisor',
    deactivatedDate: '2025-08-15',
    deactivationReason: 'Left Organization',
    avatar: '🧑‍💼'
  },
  {
    id: '102',
    name: 'Divya Nair',
    email: 'divya@example.com',
    phone: '+91-98765-43221',
    department: 'Sales',
    role: 'Associate',
    deactivatedDate: '2025-09-01',
    deactivationReason: 'Maternity Leave',
    avatar: '👩‍💼'
  },
  {
    id: '103',
    name: 'Suresh Iyer',
    email: 'suresh@example.com',
    phone: '+91-98765-43222',
    department: 'IT',
    role: 'Technician',
    deactivatedDate: '2025-09-20',
    deactivationReason: 'Medical Leave',
    avatar: '🧑‍💻'
  }
];

export default function InactiveUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState('all');

  const reasons = ['all', 'Left Organization', 'Maternity Leave', 'Medical Leave', 'Extended Leave'];

  const filteredUsers = inactiveUsers.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchReason = selectedReason === 'all' || user.deactivationReason === selectedReason;
    return matchSearch && matchReason;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <UserX className="w-10 h-10 text-red-600" />
              Inactive Users
            </h1>
            <p className="text-slate-600 mt-2">{filteredUsers.length} inactive users in system</p>
          </div>
          <button className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 flex items-center gap-2 font-medium">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Reason Filter */}
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {reasons.map(reason => (
                <option key={reason} value={reason}>
                  {reason === 'all' ? 'All Reasons' : reason}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-4xl">{user.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-slate-600">{user.email} • {user.phone}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm text-slate-600"><span className="font-medium">Department:</span> {user.department}</span>
                      <span className="text-sm text-slate-600"><span className="font-medium">Role:</span> {user.role}</span>
                      <span className="text-sm text-slate-600"><span className="font-medium">Deactivated:</span> {new Date(user.deactivatedDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="px-3 py-1 bg-red-50 rounded-lg border border-red-200 mb-2">
                      <p className="text-sm font-medium text-red-700">{user.deactivationReason}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/it-admin/users/${user.id}`)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm font-medium flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 text-sm font-medium flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reactivate
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <UserX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No inactive users found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
