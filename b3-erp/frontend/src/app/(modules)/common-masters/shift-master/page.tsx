'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, Clock, Sun, Moon, CalendarDays, DollarSign, AlertCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockShifts, Shift } from '@/data/common-masters/shifts';

export default function ShiftMasterPage() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterApplicable, setFilterApplicable] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered data
  const filteredData = useMemo(() => {
    return shifts.filter(shift => {
      const matchesSearch =
        shift.shiftName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.shiftCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || shift.shiftType === filterType;
      const matchesApplicable = filterApplicable === 'all' || shift.applicableFor === filterApplicable;

      return matchesSearch && matchesType && matchesApplicable;
    });
  }, [shifts, searchTerm, filterType, filterApplicable]);

  const getShiftTypeIcon = (type: string) => {
    const icons = {
      'general': Sun,
      'production': Clock,
      'rotational': CalendarDays,
      'flexible': AlertCircle,
      'night': Moon
    };
    const Icon = icons[type as keyof typeof icons] || Clock;
    return Icon;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'general': 'bg-blue-100 text-blue-800',
      'production': 'bg-green-100 text-green-800',
      'rotational': 'bg-orange-100 text-orange-800',
      'flexible': 'bg-purple-100 text-purple-800',
      'night': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Table columns
  const columns: Column<Shift>[] = [
    {
      id: 'icon',
      header: '',
      accessor: 'shiftType',
      sortable: false,
      width: 'w-12',
      align: 'center',
      render: (value) => {
        const Icon = getShiftTypeIcon(value);
        return (
          <div style={{ color: shifts.find(s => s.shiftType === value)?.color }}>
            <Icon className="w-5 h-5" />
          </div>
        );
      }
    },
    {
      id: 'code',
      header: 'Shift Code',
      accessor: 'shiftCode',
      sortable: true,
      width: 'w-32',
      render: (value) => <span className="font-mono font-semibold text-blue-600">{value}</span>
    },
    {
      id: 'name',
      header: 'Shift Name',
      accessor: 'shiftName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }}></span>
            {value}
          </div>
          <div className="text-xs text-gray-500 capitalize">{row.shiftType}</div>
        </div>
      )
    },
    {
      id: 'timing',
      header: 'Timing',
      accessor: 'timing',
      sortable: false,
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {value.startTime} - {value.endTime}
          </div>
          <div className="text-xs text-gray-500">{value.duration} hours</div>
        </div>
      )
    },
    {
      id: 'breaks',
      header: 'Breaks',
      accessor: 'breaks',
      sortable: false,
      render: (value: Shift['breaks']) => (
        <div className="text-xs text-gray-600">
          {value.length > 0 ? (
            value.map((brk: { type: string; duration: number }, idx: number) => (
              <div key={idx}>
                {brk.type}: {brk.duration}min
              </div>
            ))
          ) : (
            <span className="text-gray-400">No breaks</span>
          )}
        </div>
      )
    },
    {
      id: 'applicable',
      header: 'Applicable For',
      accessor: 'applicableFor',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
          {value}
        </span>
      )
    },
    {
      id: 'allowances',
      header: 'Allowances',
      accessor: 'allowances',
      sortable: false,
      render: (value) => (
        <div className="text-xs text-gray-600">
          {value.shiftAllowance > 0 && (
            <div>Shift: ₹{value.shiftAllowance.toLocaleString()}/mo</div>
          )}
          {value.nightAllowance && (
            <div>Night: ₹{value.nightAllowance.toLocaleString()}/mo</div>
          )}
          <div className="text-gray-500">OT: {value.overtimeMultiplier}x</div>
        </div>
      )
    },
    {
      id: 'attendance',
      header: 'Attendance Rules',
      accessor: 'attendance',
      sortable: false,
      render: (value) => (
        <div className="text-xs text-gray-600">
          <div>Grace: {value.graceTime}min</div>
          <div>Min: {value.minimumHours}hrs</div>
          <div>Half-day: {value.halfDayThreshold}hrs</div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          text={value ? 'Active' : 'Inactive'}
        />
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
              console.log('Edit shift:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete ${row.shiftName}?`)) {
                setShifts(prev => prev.filter(s => s.id !== row.id));
              }
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterApplicable('all');
  };

  const activeFilterCount = [
    filterType !== 'all',
    filterApplicable !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => {
    const totalAllowances = shifts.reduce((sum, s) =>
      sum + s.allowances.shiftAllowance + (s.allowances.nightAllowance || 0), 0);

    return {
      totalShifts: shifts.length,
      activeShifts: shifts.filter(s => s.isActive).length,
      productionShifts: shifts.filter(s => s.shiftType === 'production' || s.shiftType === 'night').length,
      flexibleShifts: shifts.filter(s => s.shiftType === 'flexible').length,
      avgAllowance: Math.round(totalAllowances / shifts.length),
      nightShifts: shifts.filter(s => s.shiftType === 'night').length
    };
  }, [shifts]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-7 h-7 text-blue-600" />
            Shift Master
          </h1>
          <p className="text-gray-600 mt-1">Manage work shifts, timings, and attendance rules for manufacturing operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => console.log('Add Shift')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shift</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Total Shifts
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalShifts}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Active Shifts</div>
          <div className="text-2xl font-bold text-green-600">{stats.activeShifts}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Sun className="w-4 h-4" /> Production
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.productionShifts}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Moon className="w-4 h-4" /> Night Shifts
          </div>
          <div className="text-2xl font-bold text-indigo-600">{stats.nightShifts}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Flexible
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.flexibleShifts}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Avg Allow.
          </div>
          <div className="text-2xl font-bold text-orange-600">₹{stats.avgAllowance}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shifts by name or code..."
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shift Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="production">Production</option>
                <option value="rotational">Rotational</option>
                <option value="flexible">Flexible</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable For
              </label>
              <select
                value={filterApplicable}
                onChange={(e) => setFilterApplicable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="office">Office</option>
                <option value="factory">Factory</option>
                <option value="showroom">Showroom</option>
                <option value="warehouse">Warehouse</option>
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
            defaultSort: { column: 'code', direction: 'asc' }
          }}
          emptyMessage="No shifts found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Shift Configuration for Kitchen Manufacturing
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ 3-shift production system (A, B, C) for 24x7 manufacturing operations</li>
          <li>✓ Night shift allowances as per Factories Act 1948 requirements</li>
          <li>✓ Flexible timing options for office staff to improve work-life balance</li>
          <li>✓ Showroom shifts covering 7 days with rotational weekly offs</li>
          <li>✓ Grace periods and half-day rules for attendance management</li>
          <li>✓ Overtime multipliers (2x-3x) as per labor law compliance</li>
        </ul>
      </div>
    </div>
  );
}
