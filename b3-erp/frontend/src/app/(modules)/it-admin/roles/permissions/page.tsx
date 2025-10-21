'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Shield, CheckCircle, XCircle, Edit, Save } from 'lucide-react';

interface Permission {
  id: string;
  module: string;
  resource: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    export: boolean;
    approve: boolean;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
}

export default function RolePermissionsPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [searchTerm, setSearchTerm] = useState('');

  const roles: Role[] = [
    {
      id: 'admin',
      name: 'System Administrator',
      description: 'Full system access with all permissions',
      userCount: 5,
      permissions: [
        {
          id: '1',
          module: 'User Management',
          resource: 'Users',
          actions: { create: true, read: true, update: true, delete: true, export: true, approve: true }
        },
        {
          id: '2',
          module: 'User Management',
          resource: 'Roles',
          actions: { create: true, read: true, update: true, delete: true, export: true, approve: true }
        },
        {
          id: '3',
          module: 'Sales',
          resource: 'Orders',
          actions: { create: true, read: true, update: true, delete: true, export: true, approve: true }
        },
        {
          id: '4',
          module: 'Production',
          resource: 'Work Orders',
          actions: { create: true, read: true, update: true, delete: true, export: true, approve: true }
        },
        {
          id: '5',
          module: 'Inventory',
          resource: 'Stock',
          actions: { create: true, read: true, update: true, delete: true, export: true, approve: true }
        }
      ]
    },
    {
      id: 'manager',
      name: 'Department Manager',
      description: 'Manage department operations and approve requests',
      userCount: 18,
      permissions: [
        {
          id: '1',
          module: 'User Management',
          resource: 'Users',
          actions: { create: false, read: true, update: true, delete: false, export: true, approve: false }
        },
        {
          id: '2',
          module: 'Sales',
          resource: 'Orders',
          actions: { create: true, read: true, update: true, delete: false, export: true, approve: true }
        },
        {
          id: '3',
          module: 'Production',
          resource: 'Work Orders',
          actions: { create: true, read: true, update: true, delete: false, export: true, approve: true }
        },
        {
          id: '4',
          module: 'Inventory',
          resource: 'Stock',
          actions: { create: false, read: true, update: true, delete: false, export: true, approve: true }
        }
      ]
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      description: 'Supervise daily operations and team activities',
      userCount: 35,
      permissions: [
        {
          id: '1',
          module: 'Sales',
          resource: 'Orders',
          actions: { create: true, read: true, update: true, delete: false, export: false, approve: false }
        },
        {
          id: '2',
          module: 'Production',
          resource: 'Work Orders',
          actions: { create: true, read: true, update: true, delete: false, export: false, approve: false }
        },
        {
          id: '3',
          module: 'Inventory',
          resource: 'Stock',
          actions: { create: false, read: true, update: true, delete: false, export: false, approve: false }
        }
      ]
    },
    {
      id: 'operator',
      name: 'Operator',
      description: 'Execute tasks and update work progress',
      userCount: 82,
      permissions: [
        {
          id: '1',
          module: 'Production',
          resource: 'Work Orders',
          actions: { create: false, read: true, update: true, delete: false, export: false, approve: false }
        },
        {
          id: '2',
          module: 'Inventory',
          resource: 'Stock',
          actions: { create: false, read: true, update: false, delete: false, export: false, approve: false }
        }
      ]
    },
    {
      id: 'viewer',
      name: 'Read Only',
      description: 'View-only access to reports and data',
      userCount: 45,
      permissions: [
        {
          id: '1',
          module: 'Sales',
          resource: 'Orders',
          actions: { create: false, read: true, update: false, delete: false, export: true, approve: false }
        },
        {
          id: '2',
          module: 'Production',
          resource: 'Work Orders',
          actions: { create: false, read: true, update: false, delete: false, export: true, approve: false }
        },
        {
          id: '3',
          module: 'Inventory',
          resource: 'Stock',
          actions: { create: false, read: true, update: false, delete: false, export: true, approve: false }
        }
      ]
    }
  ];

  const currentRole = roles.find(r => r.id === selectedRole);
  const filteredPermissions = currentRole?.permissions.filter(p =>
    p.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.resource.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage role-based access control and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Roles ({roles.length})</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className={`w-4 h-4 ${selectedRole === role.id ? 'text-blue-600' : 'text-gray-600'}`} />
                  <p className="font-semibold text-gray-900">{role.name}</p>
                </div>
                <p className="text-xs text-gray-600 mb-2">{role.description}</p>
                <p className="text-xs text-gray-500">{role.userCount} users</p>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentRole?.name}</h2>
              <p className="text-sm text-gray-500">{currentRole?.description}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Module</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Resource</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Create</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Read</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Update</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Delete</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Export</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Approve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPermissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{perm.module}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{perm.resource}</td>
                    <td className="px-4 py-3 text-center">
                      {perm.actions.create ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {perm.actions.read ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {perm.actions.update ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {perm.actions.delete ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {perm.actions.export ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {perm.actions.approve ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Permission Types:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700">
              <div><span className="font-medium">Create:</span> Add new records</div>
              <div><span className="font-medium">Read:</span> View existing records</div>
              <div><span className="font-medium">Update:</span> Modify records</div>
              <div><span className="font-medium">Delete:</span> Remove records</div>
              <div><span className="font-medium">Export:</span> Download/export data</div>
              <div><span className="font-medium">Approve:</span> Approve requests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
