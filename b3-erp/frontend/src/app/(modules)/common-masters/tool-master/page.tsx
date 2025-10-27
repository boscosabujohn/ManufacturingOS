'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, Wrench, AlertCircle, Package, Calendar } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockTools, Tool, getToolStats, getLowStockTools } from '@/data/common-masters/tools';

export default function ToolMasterPage() {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered data
  const filteredData = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch =
        tool.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.toolCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || tool.toolType === filterType;
      const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || tool.status === filterStatus;

      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [tools, searchTerm, filterType, filterCategory, filterStatus]);

  const getTypeColor = (type: string) => {
    const colors = {
      'cutting': 'bg-blue-100 text-blue-800',
      'measuring': 'bg-purple-100 text-purple-800',
      'holding': 'bg-green-100 text-green-800',
      'power': 'bg-orange-100 text-orange-800',
      'hand': 'bg-yellow-100 text-yellow-800',
      'jigs_fixtures': 'bg-indigo-100 text-indigo-800',
      'safety': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'in_use': 'bg-blue-100 text-blue-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'calibration': 'bg-purple-100 text-purple-800',
      'retired': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'excellent': 'text-green-600',
      'good': 'text-blue-600',
      'fair': 'text-yellow-600',
      'poor': 'text-red-600'
    };
    return colors[condition as keyof typeof colors] || 'text-gray-600';
  };

  const getStockStatus = (tool: Tool) => {
    if (tool.currentStock <= tool.reorderLevel) return 'critical';
    if (tool.currentStock <= tool.minimumStock) return 'low';
    return 'normal';
  };

  // Table columns
  const columns: Column<Tool>[] = [
    {
      id: 'tool',
      header: 'Tool',
      accessor: 'toolName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            <span className="font-mono font-semibold text-blue-600">{row.toolCode}</span>
          </div>
          <div className="text-xs text-gray-500">{row.manufacturer}</div>
        </div>
      )
    },
    {
      id: 'type',
      header: 'Type',
      accessor: 'toolType',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(value)}`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    {
      id: 'stock',
      header: 'Stock',
      accessor: 'currentStock',
      sortable: true,
      render: (value, row) => {
        const status = getStockStatus(row);
        return (
          <div className="text-sm">
            <div className={`font-bold ${status === 'critical' ? 'text-red-600' : status === 'low' ? 'text-yellow-600' : 'text-green-600'}`}>
              {value} {row.unitOfMeasure}
              {status !== 'normal' && <AlertCircle className="inline w-3 h-3 ml-1" />}
            </div>
            <div className="text-xs text-gray-500">Min: {row.minimumStock} | Reorder: {row.reorderLevel}</div>
          </div>
        );
      }
    },
    {
      id: 'lifecycle',
      header: 'Lifecycle',
      accessor: 'remainingLife',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className={`font-medium ${value <= 20 ? 'text-red-600' : value <= 50 ? 'text-yellow-600' : 'text-green-600'}`}>
            {value}% remaining
          </div>
          <div className="text-xs text-gray-500">
            {row.currentUsage}/{row.lifeExpectancy} {row.lifeUnit}
          </div>
        </div>
      )
    },
    {
      id: 'calibration',
      header: 'Calibration',
      accessor: 'requiresCalibration',
      sortable: false,
      render: (value, row) => {
        if (!value) return <span className="text-xs text-gray-400">N/A</span>;
        const daysUntil = row.nextCalibrationDate ?
          Math.floor((new Date(row.nextCalibrationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 999;
        return (
          <div className="text-xs">
            <div className={`font-medium ${daysUntil <= 7 ? 'text-red-600' : daysUntil <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
              {daysUntil <= 0 ? 'Overdue!' : `${daysUntil} days`}
              {daysUntil <= 30 && <Calendar className="inline w-3 h-3 ml-1" />}
            </div>
            <div className="text-gray-500">
              {row.nextCalibrationDate ? new Date(row.nextCalibrationDate).toLocaleDateString() : '-'}
            </div>
          </div>
        );
      }
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: 'unitCost',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">₹{value}</div>
          <div className="text-xs text-gray-500">Total: ₹{value * row.currentStock}</div>
        </div>
      )
    },
    {
      id: 'condition',
      header: 'Condition',
      accessor: 'condition',
      sortable: true,
      render: (value) => (
        <div className={`text-sm font-medium capitalize ${getConditionColor(value)}`}>
          {value}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(value)}`}>
          {value.replace('_', ' ')}
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
              console.log('View tool:', row);
            }}
          >
            View
          </button>
          <button
            className="text-green-600 hover:text-green-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit tool:', row);
            }}
          >
            Edit
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  const activeFilterCount = [
    filterType !== 'all',
    filterCategory !== 'all',
    filterStatus !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => getToolStats(), [tools]);
  const lowStockCount = useMemo(() => getLowStockTools().length, [tools]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="w-7 h-7 text-blue-600" />
            Tool Master
          </h1>
          <p className="text-gray-600 mt-1">Manage manufacturing tools, equipment, and inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export tools')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => console.log('Add tool')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Tools</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-600" /> Low Stock
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-orange-600" /> Calibration
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.needsCalibration}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Precision Tools</div>
          <div className="text-2xl font-bold text-purple-600">{stats.precisionInstruments}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Value</div>
          <div className="text-2xl font-bold text-blue-600">₹{(stats.totalValue / 1000).toFixed(0)}K</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tool name, code, manufacturer..."
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
                Tool Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="cutting">Cutting</option>
                <option value="measuring">Measuring</option>
                <option value="holding">Holding</option>
                <option value="power">Power</option>
                <option value="hand">Hand</option>
                <option value="jigs_fixtures">Jigs & Fixtures</option>
                <option value="safety">Safety</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="consumable">Consumable</option>
                <option value="durable">Durable</option>
                <option value="precision_instrument">Precision Instrument</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="calibration">Calibration</option>
                <option value="retired">Retired</option>
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
            defaultSort: { column: 'tool', direction: 'asc' }
          }}
          emptyMessage="No tools found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Tool Management & Calibration
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Precision instruments require annual calibration with NABL-certified labs</li>
          <li>✓ Consumable tools automatically trigger reorder when stock reaches reorder level</li>
          <li>✓ Tool lifecycle tracking helps predict replacement needs and budget planning</li>
          <li>✓ Serial number tracking for high-value and calibrated tools ensures accountability</li>
          <li>✓ Safety equipment must meet Indian Standards (IS) specifications</li>
          <li>✓ Regular condition assessments ensure tool reliability and quality output</li>
        </ul>
      </div>
    </div>
  );
}
