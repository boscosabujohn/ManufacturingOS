'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, Users, Settings, Search, Eye, Filter } from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
  createdDate: string;
  members: GroupMember[];
}

export default function UserGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<UserGroup[]>([
    {
      id: '1',
      name: 'Operations Managers',
      description: 'Managers in operations department with full access',
      memberCount: 5,
      permissions: ['view', 'edit', 'export', 'manage_users'],
      createdDate: '2024-01-10',
      members: [
        { id: '1', name: 'Raj Kumar', email: 'raj.kumar@company.com', role: 'Manager' },
        { id: '2', name: 'Priya Singh', email: 'priya.singh@company.com', role: 'Senior Manager' },
        { id: '3', name: 'Amit Patel', email: 'amit.patel@company.com', role: 'Manager' },
        { id: '4', name: 'Neha Sharma', email: 'neha.sharma@company.com', role: 'Coordinator' },
        { id: '5', name: 'Vikram Singh', email: 'vikram.singh@company.com', role: 'Manager' }
      ]
    },
    {
      id: '2',
      name: 'Sales Team',
      description: 'Sales executives and team leads',
      memberCount: 8,
      permissions: ['view', 'edit', 'export'],
      createdDate: '2024-01-12',
      members: [
        { id: '6', name: 'Arun Kumar', email: 'arun.kumar@company.com', role: 'Executive' },
        { id: '7', name: 'Deepak Nair', email: 'deepak.nair@company.com', role: 'Executive' },
        { id: '8', name: 'Kavya Reddy', email: 'kavya.reddy@company.com', role: 'Team Lead' },
        { id: '9', name: 'Sanjay Verma', email: 'sanjay.verma@company.com', role: 'Executive' },
        { id: '10', name: 'Meera Gupta', email: 'meera.gupta@company.com', role: 'Executive' },
        { id: '11', name: 'Rohan Singh', email: 'rohan.singh@company.com', role: 'Executive' },
        { id: '12', name: 'Anjali Kumar', email: 'anjali.kumar@company.com', role: 'Team Lead' },
        { id: '13', name: 'Harsh Patel', email: 'harsh.patel@company.com', role: 'Executive' }
      ]
    },
    {
      id: '3',
      name: 'IT Administrators',
      description: 'System administrators with elevated privileges',
      memberCount: 3,
      permissions: ['view', 'edit', 'delete', 'export', 'manage_users', 'system_config'],
      createdDate: '2024-01-08',
      members: [
        { id: '14', name: 'Sumit Mishra', email: 'sumit.mishra@company.com', role: 'Administrator' },
        { id: '15', name: 'Pooja Desai', email: 'pooja.desai@company.com', role: 'Specialist' },
        { id: '16', name: 'Ravi Singh', email: 'ravi.singh@company.com', role: 'Technician' }
      ]
    },
    {
      id: '4',
      name: 'HR Team',
      description: 'Human resources department staff',
      memberCount: 4,
      permissions: ['view', 'edit', 'export'],
      createdDate: '2024-01-15',
      members: [
        { id: '17', name: 'Anita Sharma', email: 'anita.sharma@company.com', role: 'Manager' },
        { id: '18', name: 'Rahul Desai', email: 'rahul.desai@company.com', role: 'Specialist' },
        { id: '19', name: 'Divya Patel', email: 'divya.patel@company.com', role: 'Coordinator' },
        { id: '20', name: 'Vikram Kumar', email: 'vikram.kumar@company.com', role: 'Analyst' }
      ]
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPermission, setFilterPermission] = useState('');

  const allPermissions = ['view', 'edit', 'delete', 'export', 'manage_users', 'system_config'];

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPermission === '' || group.permissions.includes(filterPermission))
  );

  const handleDeleteMember = (groupId: string, memberId: string) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, members: g.members.filter(m => m.id !== memberId), memberCount: g.memberCount - 1 }
        : g
    ));
  };

  const getPermissionColor = (permission: string) => {
    const colors: Record<string, string> = {
      'view': 'bg-blue-100 text-blue-800',
      'edit': 'bg-green-100 text-green-800',
      'delete': 'bg-red-100 text-red-800',
      'export': 'bg-purple-100 text-purple-800',
      'manage_users': 'bg-orange-100 text-orange-800',
      'system_config': 'bg-indigo-100 text-indigo-800'
    };
    return colors[permission] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">User Groups</h1>
              <p className="text-slate-600 mt-1">Manage user groups and permissions</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/it-admin/users/groups/new')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            New Group
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterPermission}
            onChange={(e) => setFilterPermission(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All Permissions</option>
            {allPermissions.map(perm => (
              <option key={perm} value={perm}>
                {perm.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.map(group => (
            <div key={group.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Group Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{group.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{group.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Permissions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.permissions.map(perm => (
                    <span
                      key={perm}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPermissionColor(perm)}`}
                    >
                      {perm.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {group.memberCount} members
                  </span>
                  <span>Created: {new Date(group.createdDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Members Preview */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-900">Members ({group.members.length})</h4>
                  <button
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowDetails(true);
                    }}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View All
                  </button>
                </div>

                {/* Member List Preview */}
                <div className="space-y-2">
                  {group.members.slice(0, 3).map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                        <p className="text-xs text-slate-600 truncate">{member.email}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap ml-2">
                        {member.role}
                      </span>
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <p className="text-xs text-slate-600 pt-2">+{group.members.length - 3} more</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Members Detail Modal */}
        {showDetails && selectedGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 sticky top-0 bg-white flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedGroup.name}</h2>
                  <p className="text-sm text-slate-600 mt-1">{selectedGroup.members.length} members</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Members List */}
              <div className="p-6">
                <div className="space-y-3">
                  {selectedGroup.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-600">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {member.role}
                        </span>
                        <button
                          onClick={() => handleDeleteMember(selectedGroup.id, member.id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Members
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
