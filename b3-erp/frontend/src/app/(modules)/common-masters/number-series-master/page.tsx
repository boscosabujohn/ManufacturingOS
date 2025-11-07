'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Download, Filter, X, Hash, TrendingUp, AlertCircle, FileText, CheckCircle, XCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockNumberSeries, NumberSeries, getNumberSeriesStats } from '@/data/common-masters/number-series';

export default function NumberSeriesMasterPage() {
  const [numberSeries, setNumberSeries] = useState<NumberSeries[]>(mockNumberSeries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleViewSeries = (row: NumberSeries) => {
    showToast(`Viewing series: ${row.seriesName}`, 'info');
  };

  const handleEditSeries = (row: NumberSeries) => {
    showToast(`Opening editor for: ${row.seriesName}`, 'info');
  };

  const handleExport = () => {
    showToast('Exporting number series data...', 'success');
  };

  const handleAddSeries = () => {
    showToast('Opening form to add new number series', 'info');
  };

  // Filtered data
  const filteredData = useMemo(() => {
    return numberSeries.filter(series => {
      const matchesSearch =
        series.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.seriesCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.documentType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModule = filterModule === 'all' || series.module === filterModule;

      return matchesSearch && matchesModule;
    });
  }, [numberSeries, searchTerm, filterModule]);

  const getModuleColor = (module: string) => {
    const colors = {
      'sales': 'bg-blue-100 text-blue-800',
      'purchase': 'bg-green-100 text-green-800',
      'inventory': 'bg-purple-100 text-purple-800',
      'finance': 'bg-yellow-100 text-yellow-800',
      'hr': 'bg-pink-100 text-pink-800',
      'production': 'bg-orange-100 text-orange-800',
      'quality': 'bg-indigo-100 text-indigo-800'
    };
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUsagePercentage = (series: NumberSeries) => {
    return Math.round(((series.currentNumber - series.startingNumber) / (series.endingNumber - series.startingNumber)) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Table columns
  const columns: Column<NumberSeries>[] = [
    {
      id: 'series',
      header: 'Series',
      accessor: 'seriesName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            <span className="font-mono font-semibold text-blue-600">{row.seriesCode}</span>
          </div>
          <div className="text-xs text-gray-500">{row.documentType}</div>
        </div>
      )
    },
    {
      id: 'module',
      header: 'Module',
      accessor: 'module',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getModuleColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      id: 'format',
      header: 'Format',
      accessor: 'sampleFormat',
      sortable: false,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-mono font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            Reset: {row.resetFrequency}
          </div>
        </div>
      )
    },
    {
      id: 'current',
      header: 'Current Number',
      accessor: 'currentNumber',
      sortable: true,
      render: (value, row) => {
        const usage = getUsagePercentage(row);
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{value}</div>
            <div className={`text-xs font-medium ${getUsageColor(usage)}`}>
              {usage}% used
              {usage >= 80 && <AlertCircle className="inline w-3 h-3 ml-1" />}
            </div>
          </div>
        );
      }
    },
    {
      id: 'range',
      header: 'Range',
      accessor: 'startingNumber',
      sortable: false,
      render: (value, row) => (
        <div className="text-sm text-gray-600">
          {value} - {row.endingNumber}
        </div>
      )
    },
    {
      id: 'generated',
      header: 'Generated',
      accessor: 'documentsGenerated',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            Last: {new Date(row.lastGeneratedDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      header: 'Settings',
      accessor: 'allowManualEntry',
      sortable: false,
      render: (value, row) => (
        <div className="text-xs space-y-0.5">
          {row.defaultSeries && <div className="text-blue-600">✓ Default</div>}
          {value && <div className="text-green-600">✓ Manual Entry</div>}
          {row.validateSequence && <div className="text-purple-600">✓ Validate</div>}
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
              handleViewSeries(row);
            }}
          >
            View
          </button>
          <button
            className="text-green-600 hover:text-green-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleEditSeries(row);
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
    setFilterModule('all');
  };

  const activeFilterCount = [
    filterModule !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => getNumberSeriesStats(), [numberSeries]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50 to-violet-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 ${
            toast.type === 'success' ? 'bg-green-50 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
              <p className={`text-sm font-medium ${
                toast.type === 'success' ? 'text-green-800' :
                toast.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-none p-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Hash className="w-7 h-7 text-indigo-600" />
              Number Series Master
            </h1>
            <p className="text-gray-600 mt-1">Manage document numbering sequences across modules</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleAddSeries}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Series</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Total Series</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-orange-600" /> Near Limit
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.nearingLimit}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Production</div>
            <div className="text-2xl font-bold text-orange-600">{stats.production}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Sales</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.sales}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Total Docs
            </div>
            <div className="text-2xl font-bold text-purple-600">{(stats.totalGenerated / 1000).toFixed(1)}K</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6">
        <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex-none p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by series name, code, or document type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
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
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module
                  </label>
                  <select
                    value={filterModule}
                    onChange={(e) => setFilterModule(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Modules</option>
                    <option value="sales">Sales</option>
                    <option value="purchase">Purchase</option>
                    <option value="inventory">Inventory</option>
                    <option value="finance">Finance</option>
                    <option value="hr">HR</option>
                    <option value="production">Production</option>
                    <option value="quality">Quality</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-auto">
            <DataTable
              data={filteredData}
              columns={columns}
              pagination={{
                enabled: true,
                pageSize: 10
              }}
              sorting={{
                enabled: true,
                defaultSort: { column: 'series', direction: 'asc' }
              }}
              emptyMessage="No number series found"
              emptyDescription="Try adjusting your search or filters to find what you're looking for."
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
