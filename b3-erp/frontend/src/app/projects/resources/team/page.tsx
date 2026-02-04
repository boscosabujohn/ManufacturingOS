'use client';

import { useMemo, useState } from 'react';
import { Users, Search, Filter, PlusCircle, UserPlus, Shield, Mail } from 'lucide-react';

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects: number;
  active: boolean;
};

const TEAM: Member[] = [
  { id: 'E-101', name: 'Amit Singh', email: 'amit.singh@example.com', role: 'Project Manager', department: 'Projects', projects: 4, active: true },
  { id: 'E-214', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'Designer', department: 'Design', projects: 3, active: true },
  { id: 'E-307', name: 'Rahul Kumar', email: 'rahul.kumar@example.com', role: 'Engineer', department: 'Engineering', projects: 5, active: true },
  { id: 'E-118', name: 'Sara Ali', email: 'sara.ali@example.com', role: 'Installer', department: 'Installation', projects: 2, active: false },
];

export default function TeamManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all'|'active'|'inactive'>('all');
  const depts = useMemo(() => ['all', ...Array.from(new Set(TEAM.map(t => t.department)))], []);
  const filtered = useMemo(() => TEAM.filter(m => {
    const matchSearch = [m.name, m.email, m.role, m.department, m.id].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchDept = deptFilter==='all' ? true : m.department === deptFilter;
    const matchStatus = statusFilter==='all' ? true : statusFilter==='active' ? m.active : !m.active;
    return matchSearch && matchDept && matchStatus;
  }), [searchTerm, deptFilter, statusFilter]);

  return (
    <div className="p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          Team Management
        </h1>
        <p className="text-gray-600 mt-2">Manage project teams and roles</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Team Members</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">68</p>
            </div>
            <Users className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Project Managers</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">8</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold text-green-900 mt-1">32</p>
            </div>
            <Users className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Departments</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">12</p>
            </div>
            <Users className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <select value={deptFilter} onChange={(e)=>setDeptFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {depts.map(d => <option key={d} value={d}>{d==='all'?'All Departments':d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="ml-auto px-3 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"><UserPlus className="h-4 w-4" /> Add Member</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Member</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Projects</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{m.name}</span>
                      <span className="text-xs text-gray-500">{m.id} • {m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.projects}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${m.active?'bg-green-50 text-green-700':'bg-gray-100 text-gray-700'}`}>{m.active?'Active':'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center gap-1"><Mail className="h-4 w-4" /> Contact</button>
                      <button className="text-teal-700 hover:text-teal-900 text-sm flex items-center gap-1"><Shield className="h-4 w-4" /> Permissions</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No team members</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
