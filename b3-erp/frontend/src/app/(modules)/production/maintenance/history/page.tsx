'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface MaintenanceHistory {
  id: string;
  maintenanceId: string;
  equipmentCode: string;
  equipmentName: string;
  maintenanceType: 'preventive' | 'corrective' | 'breakdown' | 'inspection';
  startDate: string;
  completionDate: string;
  duration: number; // hours
  technician: string;
  status: 'completed' | 'partially-completed' | 'failed';
  workDescription: string;
  partsReplaced: string[];
  cost: number;
  downtime: number;
  remarks: string;
  nextScheduled: string;
}

export default function MaintenanceHistoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedHistory, setSelectedHistory] = useState<MaintenanceHistory | null>(null);

  const maintenanceHistory: MaintenanceHistory[] = [
    {
      id: '1',
      maintenanceId: 'MH-2025-089',
      equipmentCode: 'WELD-ST-01',
      equipmentName: 'TIG Welding Station #1',
      maintenanceType: 'inspection',
      startDate: '2025-10-15 08:00',
      completionDate: '2025-10-15 10:30',
      duration: 2.5,
      technician: 'Ramesh Technician',
      status: 'completed',
      workDescription: 'Routine safety inspection, gas leak detection, and electrode condition check',
      partsReplaced: [],
      cost: 4500,
      downtime: 0,
      remarks: 'All systems operational. No issues found.',
      nextScheduled: '2025-11-15'
    },
    {
      id: '2',
      maintenanceId: 'MH-2025-088',
      equipmentCode: 'CNC-CUT-01',
      equipmentName: 'CNC Cutting Machine #1',
      maintenanceType: 'preventive',
      startDate: '2025-10-10 07:00',
      completionDate: '2025-10-10 13:00',
      duration: 6,
      technician: 'Sunil Technician',
      status: 'completed',
      workDescription: 'Spindle bearing lubrication, coolant system flush, and calibration check',
      partsReplaced: ['Coolant filter', 'Drive belt'],
      cost: 18500,
      downtime: 6,
      remarks: 'Replaced worn drive belt. Machine running smoothly.',
      nextScheduled: '2025-11-10'
    },
    {
      id: '3',
      maintenanceId: 'MH-2025-087',
      equipmentCode: 'PAINT-BOOTH-01',
      equipmentName: 'Powder Coating Booth #1',
      maintenanceType: 'corrective',
      startDate: '2025-10-08 14:00',
      completionDate: '2025-10-09 11:00',
      duration: 21,
      technician: 'Maintenance Team A',
      status: 'completed',
      workDescription: 'Filter replacement, exhaust fan motor repair, and temperature sensor calibration',
      partsReplaced: ['Air filter set', 'Exhaust fan motor', 'Temperature sensor'],
      cost: 45000,
      downtime: 21,
      remarks: 'Major overhaul completed. Booth performance improved significantly.',
      nextScheduled: '2025-11-08'
    },
    {
      id: '4',
      maintenanceId: 'MH-2025-086',
      equipmentCode: 'POLISH-01',
      equipmentName: 'Polishing Machine #1',
      maintenanceType: 'breakdown',
      startDate: '2025-10-05 10:30',
      completionDate: '2025-10-05 16:45',
      duration: 6.25,
      technician: 'Senior Tech Team',
      status: 'completed',
      workDescription: 'Emergency repair - motor overheating issue. Motor bearing replacement and cooling system check',
      partsReplaced: ['Motor bearings', 'Cooling fan'],
      cost: 32000,
      downtime: 6.25,
      remarks: 'Motor bearing failure due to inadequate lubrication. Preventive schedule adjusted.',
      nextScheduled: '2025-10-20'
    },
    {
      id: '5',
      maintenanceId: 'MH-2025-085',
      equipmentCode: 'LASER-CUT-02',
      equipmentName: 'Laser Cutting Machine #2',
      maintenanceType: 'preventive',
      startDate: '2025-10-03 06:00',
      completionDate: '2025-10-03 10:00',
      duration: 4,
      technician: 'Sunil Technician',
      status: 'completed',
      workDescription: 'Quarterly laser calibration, optical lens cleaning, and gas pressure check',
      partsReplaced: ['Protective lens'],
      cost: 22000,
      downtime: 4,
      remarks: 'Laser power optimized. Cutting quality improved.',
      nextScheduled: '2026-01-03'
    },
    {
      id: '6',
      maintenanceId: 'MH-2025-084',
      equipmentCode: 'PRESS-HYDRO-01',
      equipmentName: 'Hydraulic Press Machine',
      maintenanceType: 'corrective',
      startDate: '2025-09-28 08:00',
      completionDate: '2025-09-29 15:30',
      duration: 31.5,
      technician: 'Senior Tech Team',
      status: 'partially-completed',
      workDescription: 'Hydraulic seal replacement and pressure system overhaul',
      partsReplaced: ['Main cylinder seals', 'Hydraulic oil'],
      cost: 68000,
      downtime: 31.5,
      remarks: 'Seals replaced but minor leak persists. Follow-up scheduled.',
      nextScheduled: '2025-10-15'
    },
    {
      id: '7',
      maintenanceId: 'MH-2025-083',
      equipmentCode: 'FORK-LIFT-03',
      equipmentName: 'Forklift #3',
      maintenanceType: 'preventive',
      startDate: '2025-09-25 15:00',
      completionDate: '2025-09-25 17:00',
      duration: 2,
      technician: 'Fleet Technician',
      status: 'completed',
      workDescription: 'Monthly inspection: tire pressure check, brake system, and battery maintenance',
      partsReplaced: [],
      cost: 3500,
      downtime: 0,
      remarks: 'Routine maintenance completed. All systems OK.',
      nextScheduled: '2025-10-25'
    },
    {
      id: '8',
      maintenanceId: 'MH-2025-082',
      equipmentCode: 'ASSY-LINE-01',
      equipmentName: 'Assembly Conveyor Line #1',
      maintenanceType: 'breakdown',
      startDate: '2025-09-20 11:30',
      completionDate: '2025-09-21 09:00',
      duration: 21.5,
      technician: 'Maintenance Team Lead',
      status: 'completed',
      workDescription: 'Emergency repair - conveyor chain break. Chain replacement and motor alignment',
      partsReplaced: ['Conveyor chain', 'Drive sprocket', 'Safety guards'],
      cost: 95000,
      downtime: 21.5,
      remarks: 'Critical breakdown resolved. Production resumed. Chain wear monitoring recommended.',
      nextScheduled: '2025-10-20'
    }
  ];

  const filteredHistory = maintenanceHistory.filter(record => {
    const matchesSearch =
      record.maintenanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || record.maintenanceType === filterType;

    let matchesPeriod = true;
    if (filterPeriod !== 'all') {
      const recordDate = new Date(record.completionDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (filterPeriod) {
        case 'week':
          matchesPeriod = daysDiff <= 7;
          break;
        case 'month':
          matchesPeriod = daysDiff <= 30;
          break;
        case 'quarter':
          matchesPeriod = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesType && matchesPeriod;
  });

  const totalRecords = maintenanceHistory.length;
  const totalCost = maintenanceHistory.reduce((sum, r) => sum + r.cost, 0);
  const totalDowntime = maintenanceHistory.reduce((sum, r) => sum + r.downtime, 0);
  const avgDuration = maintenanceHistory.reduce((sum, r) => sum + r.duration, 0) / totalRecords;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive': return 'bg-blue-100 text-blue-800';
      case 'corrective': return 'bg-yellow-100 text-yellow-800';
      case 'breakdown': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'partially-completed': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (record: MaintenanceHistory) => {
    setSelectedHistory(record);
  };

  const handleExport = () => {
    alert('Exporting maintenance history to Excel...');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance History</h1>
            <p className="text-sm text-gray-500 mt-1">View past maintenance records and analytics</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export History
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-orange-600">₹{(totalCost / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downtime</p>
              <p className="text-2xl font-bold text-red-600">{totalDowntime.toFixed(1)}h</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-blue-600">{avgDuration.toFixed(1)}h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search maintenance history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="preventive">Preventive</option>
              <option value="corrective">Corrective</option>
              <option value="breakdown">Breakdown</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{record.maintenanceId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{record.equipmentCode}</div>
                    <div className="text-sm text-gray-500">{record.equipmentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(record.maintenanceType)}`}>
                      {record.maintenanceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.startDate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.completionDate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.duration}h</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.technician}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">₹{(record.cost / 1000).toFixed(1)}K</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${record.downtime > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {record.downtime}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Maintenance Record - {selectedHistory.maintenanceId}</h2>
              <button
                onClick={() => setSelectedHistory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Equipment Code</label>
                  <p className="text-gray-900">{selectedHistory.equipmentCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Equipment Name</label>
                  <p className="text-gray-900">{selectedHistory.equipmentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Maintenance Type</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedHistory.maintenanceType)}`}>
                    {selectedHistory.maintenanceType}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedHistory.status)}`}>
                    {selectedHistory.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date/Time</label>
                  <p className="text-gray-900">{selectedHistory.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Completion Date/Time</label>
                  <p className="text-gray-900">{selectedHistory.completionDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-gray-900">{selectedHistory.duration} hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Technician</label>
                  <p className="text-gray-900">{selectedHistory.technician}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cost</label>
                  <p className="text-gray-900 font-semibold">₹{selectedHistory.cost.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Downtime</label>
                  <p className={`font-semibold ${selectedHistory.downtime > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedHistory.downtime} hours
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Next Scheduled</label>
                  <p className="text-gray-900">{selectedHistory.nextScheduled}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Work Description</label>
                <p className="text-gray-900 mt-1">{selectedHistory.workDescription}</p>
              </div>
              {selectedHistory.partsReplaced.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Parts Replaced</label>
                  <ul className="mt-1 space-y-1">
                    {selectedHistory.partsReplaced.map((part, idx) => (
                      <li key={idx} className="text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {part}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Remarks</label>
                <p className="text-gray-900 mt-1">{selectedHistory.remarks}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedHistory(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
