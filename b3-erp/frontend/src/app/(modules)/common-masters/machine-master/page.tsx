'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, Settings, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockMachines, Machine, getMachineStats } from '@/data/common-masters/machines';

export default function MachineMasterPage() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique locations
  const locations = useMemo(() => {
    return Array.from(new Set(machines.map(m => m.location))).sort();
  }, [machines]);

  // Filtered data
  const filteredData = useMemo(() => {
    return machines.filter(machine => {
      const matchesSearch =
        machine.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.machineCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || machine.machineType === filterType;
      const matchesStatus = filterStatus === 'all' || machine.operationalStatus === filterStatus;
      const matchesLocation = filterLocation === 'all' || machine.location === filterLocation;

      return matchesSearch && matchesType && matchesStatus && matchesLocation;
    });
  }, [machines, searchTerm, filterType, filterStatus, filterLocation]);

  const getTypeColor = (type: string) => {
    const colors = {
      'cutting': 'bg-blue-100 text-blue-800',
      'bending': 'bg-purple-100 text-purple-800',
      'welding': 'bg-orange-100 text-orange-800',
      'finishing': 'bg-green-100 text-green-800',
      'assembly': 'bg-yellow-100 text-yellow-800',
      'cnc': 'bg-indigo-100 text-indigo-800',
      'laser': 'bg-red-100 text-red-800',
      'press': 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'running': 'bg-green-100 text-green-800',
      'idle': 'bg-yellow-100 text-yellow-800',
      'maintenance': 'bg-blue-100 text-blue-800',
      'breakdown': 'bg-red-100 text-red-800',
      'retired': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getOEEColor = (oee: number) => {
    if (oee >= 85) return 'text-green-600';
    if (oee >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Table columns
  const columns: Column<Machine>[] = [
    {
      id: 'machine',
      header: 'Machine',
      accessor: 'machineName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            <span className="font-mono font-semibold text-blue-600">{row.machineCode}</span>
          </div>
          <div className="text-xs text-gray-500">{row.manufacturer} {row.model}</div>
        </div>
      )
    },
    {
      id: 'type',
      header: 'Type',
      accessor: 'machineType',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.workCenter}</div>
        </div>
      )
    },
    {
      id: 'capacity',
      header: 'Capacity',
      accessor: 'capacity',
      sortable: false,
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{value.perHour} {value.unit}/hr</div>
          <div className="text-xs text-gray-500">{value.perDay} {value.unit}/day</div>
        </div>
      )
    },
    {
      id: 'oee',
      header: 'OEE',
      accessor: 'oee',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className={`font-bold ${getOEEColor(value)}`}>{value}%</div>
          <div className="text-xs text-gray-500">
            A: {row.availability}% | P: {row.performance}%
          </div>
        </div>
      )
    },
    {
      id: 'utilization',
      header: 'Utilization',
      accessor: 'utilizationRate',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{value}%</div>
          <div className="text-xs text-gray-500">DT: {row.downtimeHours}h</div>
        </div>
      )
    },
    {
      id: 'maintenance',
      header: 'Next Maintenance',
      accessor: 'maintenance',
      sortable: false,
      render: (value) => (
        <div className="text-xs">
          <div className="text-gray-900">{new Date(value.nextDate).toLocaleDateString()}</div>
          <div className="text-gray-500 capitalize">{value.frequency}</div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'operationalStatus',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(value)}`}>
          {value}
        </span>
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
              console.log('View machine:', row);
            }}
          >
            View
          </button>
          <button
            className="text-green-600 hover:text-green-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit machine:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Schedule maintenance:', row);
            }}
          >
            Maintain
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterLocation('all');
  };

  const activeFilterCount = [
    filterType !== 'all',
    filterStatus !== 'all',
    filterLocation !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => getMachineStats(), [machines]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-blue-600" />
            Machine Master
          </h1>
          <p className="text-gray-600 mt-1">Manage production machines, capacity, and maintenance schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export machines')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => console.log('Add machine')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Machine</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Machines</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-600" /> Running
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.running}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">In Maintenance</div>
          <div className="text-2xl font-bold text-blue-600">{stats.maintenance}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-600" /> Breakdown
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.breakdown}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Avg OEE
          </div>
          <div className={`text-2xl font-bold ${getOEEColor(stats.avgOEE)}`}>{stats.avgOEE}%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Utilization</div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgUtilization}%</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by machine name, code, manufacturer, or model..."
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Machine Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="cutting">Cutting</option>
                <option value="bending">Bending</option>
                <option value="welding">Welding</option>
                <option value="finishing">Finishing</option>
                <option value="assembly">Assembly</option>
                <option value="cnc">CNC</option>
                <option value="laser">Laser</option>
                <option value="press">Press</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operational Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="idle">Idle</option>
                <option value="maintenance">Maintenance</option>
                <option value="breakdown">Breakdown</option>
                <option value="retired">Retired</option>
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
            defaultSort: { column: 'machine', direction: 'asc' }
          }}
          emptyMessage="No machines found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Overall Equipment Effectiveness (OEE) Tracking
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ OEE = Availability × Performance × Quality (Target: 85%+)</li>
          <li>✓ Preventive maintenance scheduled based on manufacturer recommendations</li>
          <li>✓ Real-time capacity monitoring for production planning</li>
          <li>✓ Downtime tracking for continuous improvement initiatives</li>
          <li>✓ Safety inspections mandatory before operation of critical equipment</li>
          <li>✓ Machine depreciation calculated using straight-line method</li>
        </ul>
      </div>
    </div>
  );
}
