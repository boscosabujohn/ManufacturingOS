'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Settings, MapPin, Users, Clock, Activity } from 'lucide-react';

interface WorkCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  location: string;
  type: string;
  capacity: number;
  operators: number;
  efficiency: number;
  status: 'active' | 'inactive' | 'maintenance';
  costPerHour: number;
  workingHours: string;
}

export default function WorkCentersSettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock work centers data
  const workCenters: WorkCenter[] = [
    {
      id: 'WC-001',
      code: 'ASSY-LINE-01',
      name: 'Assembly Line 1',
      department: 'Assembly Department',
      location: 'Building A - Floor 1',
      type: 'Assembly Line',
      capacity: 100,
      operators: 8,
      efficiency: 92.5,
      status: 'active',
      costPerHour: 450,
      workingHours: '08:00 - 17:00'
    },
    {
      id: 'WC-002',
      code: 'CNC-CUT-01',
      name: 'CNC Cutting Station 1',
      department: 'Cutting Department',
      location: 'Building A - Bay A',
      type: 'CNC Machine',
      capacity: 50,
      operators: 3,
      efficiency: 95.2,
      status: 'active',
      costPerHour: 380,
      workingHours: '08:00 - 20:00'
    },
    {
      id: 'WC-003',
      code: 'WELD-ST-01',
      name: 'Welding Station 1',
      department: 'Welding Department',
      location: 'Building A - Bay B',
      type: 'Welding Station',
      capacity: 40,
      operators: 4,
      efficiency: 88.7,
      status: 'active',
      costPerHour: 320,
      workingHours: '08:00 - 17:00'
    },
    {
      id: 'WC-004',
      code: 'POLISH-01',
      name: 'Polishing Station 1',
      department: 'Finishing Department',
      location: 'Building B - Floor 1',
      type: 'Manual Station',
      capacity: 30,
      operators: 6,
      efficiency: 85.3,
      status: 'active',
      costPerHour: 280,
      workingHours: '08:00 - 17:00'
    },
    {
      id: 'WC-005',
      code: 'PAINT-BOOTH-01',
      name: 'Paint Booth 1',
      department: 'Finishing Department',
      location: 'Building B - Floor 2',
      type: 'Paint Booth',
      capacity: 25,
      operators: 3,
      efficiency: 90.8,
      status: 'maintenance',
      costPerHour: 350,
      workingHours: '08:00 - 17:00'
    },
    {
      id: 'WC-006',
      code: 'PRESS-HYDRO-01',
      name: 'Hydraulic Press 1',
      department: 'Forming Department',
      location: 'Building C - Bay A',
      type: 'Press Machine',
      capacity: 60,
      operators: 2,
      efficiency: 93.5,
      status: 'active',
      costPerHour: 420,
      workingHours: '08:00 - 20:00'
    },
    {
      id: 'WC-007',
      code: 'LASER-CUT-02',
      name: 'Laser Cutting Station 2',
      department: 'Cutting Department',
      location: 'Building A - Bay B',
      type: 'Laser Cutter',
      capacity: 45,
      operators: 2,
      efficiency: 91.2,
      status: 'active',
      costPerHour: 400,
      workingHours: '08:00 - 20:00'
    },
    {
      id: 'WC-008',
      code: 'QC-STATION-01',
      name: 'Quality Control Station 1',
      department: 'Quality Department',
      location: 'Building B - Floor 1',
      type: 'Inspection Station',
      capacity: 35,
      operators: 4,
      efficiency: 96.5,
      status: 'active',
      costPerHour: 300,
      workingHours: '08:00 - 17:00'
    },
    {
      id: 'WC-009',
      code: 'PACK-LINE-01',
      name: 'Packaging Line 1',
      department: 'Packaging Department',
      location: 'Building C - Floor 1',
      type: 'Packaging Line',
      capacity: 80,
      operators: 5,
      efficiency: 87.9,
      status: 'active',
      costPerHour: 250,
      workingHours: '08:00 - 17:00'
    },
    {
      id: 'WC-010',
      code: 'MAINT-SHOP-01',
      name: 'Maintenance Workshop',
      department: 'Maintenance Department',
      location: 'Building D - Floor 1',
      type: 'Service Center',
      capacity: 20,
      operators: 6,
      efficiency: 82.4,
      status: 'inactive',
      costPerHour: 280,
      workingHours: '08:00 - 17:00'
    }
  ];

  const filteredWorkCenters = workCenters.filter(wc => {
    const matchesSearch = wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Centers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage production work centers and stations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Work Center</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Work Centers</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{workCenters.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Settings className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Centers</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {workCenters.filter(wc => wc.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Operators</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {workCenters.reduce((sum, wc) => sum + wc.operators, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Efficiency</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {(workCenters.reduce((sum, wc) => sum + wc.efficiency, 0) / workCenters.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Activity className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, code, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Work Centers List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Operators</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/Hour</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkCenters.map((wc) => (
                <tr key={wc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{wc.code}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{wc.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {wc.workingHours}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{wc.department}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {wc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {wc.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">{wc.capacity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      {wc.operators}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-bold ${getEfficiencyColor(wc.efficiency)}`}>{wc.efficiency}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    ${wc.costPerHour}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wc.status)}`}>
                      {wc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No work centers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
