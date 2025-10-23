'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Factory, MapPin, Users, Activity, TrendingUp } from 'lucide-react';

interface ProductionLine {
  id: string;
  code: string;
  name: string;
  department: string;
  location: string;
  lineType: string;
  workCenters: number;
  operators: number;
  capacity: number;
  efficiency: number;
  utilization: number;
  status: 'operational' | 'idle' | 'maintenance' | 'offline';
  shiftSchedule: string;
  supervisor: string;
}

export default function LinesSettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock production lines data
  const productionLines: ProductionLine[] = [
    {
      id: 'LINE-001',
      code: 'ASSY-LINE-01',
      name: 'Assembly Line 1',
      department: 'Assembly Department',
      location: 'Building A - Floor 1',
      lineType: 'Final Assembly',
      workCenters: 8,
      operators: 12,
      capacity: 100,
      efficiency: 92.5,
      utilization: 88.3,
      status: 'operational',
      shiftSchedule: '3 Shifts',
      supervisor: 'John Miller'
    },
    {
      id: 'LINE-002',
      code: 'ASSY-LINE-02',
      name: 'Assembly Line 2',
      department: 'Assembly Department',
      location: 'Building A - Floor 1',
      lineType: 'Sub-Assembly',
      workCenters: 6,
      operators: 10,
      capacity: 80,
      efficiency: 89.7,
      utilization: 85.2,
      status: 'operational',
      shiftSchedule: '2 Shifts',
      supervisor: 'Sarah Johnson'
    },
    {
      id: 'LINE-003',
      code: 'FAB-LINE-01',
      name: 'Fabrication Line 1',
      department: 'Fabrication Department',
      location: 'Building B - Bay A',
      lineType: 'Metal Fabrication',
      workCenters: 10,
      operators: 15,
      capacity: 120,
      efficiency: 94.2,
      utilization: 91.5,
      status: 'operational',
      shiftSchedule: '3 Shifts',
      supervisor: 'Michael Chen'
    },
    {
      id: 'LINE-004',
      code: 'WELD-LINE-01',
      name: 'Welding Line 1',
      department: 'Welding Department',
      location: 'Building A - Bay B',
      lineType: 'Automated Welding',
      workCenters: 5,
      operators: 8,
      capacity: 60,
      efficiency: 91.8,
      utilization: 87.9,
      status: 'operational',
      shiftSchedule: '2 Shifts',
      supervisor: 'Robert Davis'
    },
    {
      id: 'LINE-005',
      code: 'FINISH-LINE-01',
      name: 'Finishing Line 1',
      department: 'Finishing Department',
      location: 'Building B - Floor 2',
      lineType: 'Surface Finishing',
      workCenters: 7,
      operators: 11,
      capacity: 70,
      efficiency: 87.3,
      utilization: 82.4,
      status: 'maintenance',
      shiftSchedule: '2 Shifts',
      supervisor: 'Lisa Anderson'
    },
    {
      id: 'LINE-006',
      code: 'PAINT-LINE-01',
      name: 'Paint Line 1',
      department: 'Finishing Department',
      location: 'Building C - Floor 1',
      lineType: 'Powder Coating',
      workCenters: 4,
      operators: 6,
      capacity: 50,
      efficiency: 90.5,
      utilization: 86.8,
      status: 'operational',
      shiftSchedule: '2 Shifts',
      supervisor: 'James Wilson'
    },
    {
      id: 'LINE-007',
      code: 'PACK-LINE-01',
      name: 'Packaging Line 1',
      department: 'Packaging Department',
      location: 'Building C - Floor 2',
      lineType: 'Automated Packaging',
      workCenters: 6,
      operators: 9,
      capacity: 90,
      efficiency: 93.8,
      utilization: 89.5,
      status: 'operational',
      shiftSchedule: '3 Shifts',
      supervisor: 'Emily Brown'
    },
    {
      id: 'LINE-008',
      code: 'QC-LINE-01',
      name: 'Quality Control Line 1',
      department: 'Quality Department',
      location: 'Building B - Floor 1',
      lineType: 'Inspection & Testing',
      workCenters: 5,
      operators: 7,
      capacity: 45,
      efficiency: 96.2,
      utilization: 92.3,
      status: 'operational',
      shiftSchedule: '2 Shifts',
      supervisor: 'David Martinez'
    },
    {
      id: 'LINE-009',
      code: 'CNC-LINE-01',
      name: 'CNC Machining Line 1',
      department: 'Machining Department',
      location: 'Building D - Bay A',
      lineType: 'CNC Machining',
      workCenters: 8,
      operators: 5,
      capacity: 75,
      efficiency: 95.5,
      utilization: 90.8,
      status: 'operational',
      shiftSchedule: '3 Shifts',
      supervisor: 'Kevin Lee'
    },
    {
      id: 'LINE-010',
      code: 'MAINT-LINE-01',
      name: 'Maintenance Line',
      department: 'Maintenance Department',
      location: 'Building D - Floor 1',
      lineType: 'Service & Repair',
      workCenters: 3,
      operators: 8,
      capacity: 30,
      efficiency: 78.9,
      utilization: 65.4,
      status: 'idle',
      shiftSchedule: '1 Shift',
      supervisor: 'Patrick Taylor'
    }
  ];

  const filteredLines = productionLines.filter(line => {
    const matchesSearch = line.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         line.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         line.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         line.supervisor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || line.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700';
      case 'idle': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'offline': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return 'text-green-600';
    if (utilization >= 70) return 'text-yellow-600';
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
            <h1 className="text-2xl font-bold text-gray-900">Production Lines</h1>
            <p className="text-sm text-gray-500 mt-1">Manage production lines and configurations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Production Line</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Lines</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{productionLines.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Factory className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Operational</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {productionLines.filter(line => line.status === 'operational').length}
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
                {productionLines.reduce((sum, line) => sum + line.operators, 0)}
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
                {(productionLines.reduce((sum, line) => sum + line.efficiency, 0) / productionLines.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-700" />
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
              placeholder="Search by name, code, department, or supervisor..."
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
            <option value="operational">Operational</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Production Lines List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Work Centers</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Operators</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLines.map((line) => (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{line.code}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{line.name}</div>
                    <div className="text-xs text-gray-500">{line.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {line.lineType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {line.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">{line.workCenters}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      {line.operators}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">{line.capacity}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-bold ${getEfficiencyColor(line.efficiency)}`}>{line.efficiency}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-bold ${getUtilizationColor(line.utilization)}`}>{line.utilization}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{line.supervisor}</div>
                    <div className="text-xs text-gray-500">{line.shiftSchedule}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(line.status)}`}>
                      {line.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No production lines found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
