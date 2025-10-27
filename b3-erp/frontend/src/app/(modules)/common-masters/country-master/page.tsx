'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Upload, Filter, X } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockCountries, Country } from '@/data/common-masters/countries';

export default function CountryMasterPage() {
  const [countries, setCountries] = useState<Country[]>(mockCountries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContinent, setFilterContinent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique continents for filter
  const continents = useMemo(() => {
    const unique = Array.from(new Set(countries.map(c => c.continent))).sort();
    return unique;
  }, [countries]);

  // Filtered data
  const filteredData = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch =
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.currency.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesContinent = filterContinent === 'all' || country.continent === filterContinent;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && country.isActive) ||
        (filterStatus === 'inactive' && !country.isActive);

      return matchesSearch && matchesContinent && matchesStatus;
    });
  }, [countries, searchTerm, filterContinent, filterStatus]);

  // Table columns
  const columns: Column<Country>[] = [
    {
      id: 'flag',
      header: 'Flag',
      accessor: 'flag',
      sortable: false,
      width: 'w-16',
      align: 'center',
      render: (value) => <span className="text-2xl">{value}</span>
    },
    {
      id: 'code',
      header: 'Code',
      accessor: 'code',
      sortable: true,
      render: (value) => <span className="font-mono font-semibold text-blue-600">{value}</span>
    },
    {
      id: 'name',
      header: 'Country Name',
      accessor: 'name',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      id: 'dialCode',
      header: 'Dial Code',
      accessor: 'dialCode',
      sortable: true,
      render: (value) => <span className="font-mono text-gray-600">{value}</span>
    },
    {
      id: 'currency',
      header: 'Currency',
      accessor: 'currency',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          <span className="text-gray-500">{row.currencySymbol}</span>
        </div>
      )
    },
    {
      id: 'continent',
      header: 'Continent',
      accessor: 'continent',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {value}
        </span>
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
              handleEdit(row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (country: Country) => {
    console.log('Edit country:', country);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this country?')) {
      setCountries(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleExport = () => {
    console.log('Exporting countries data...');
    // TODO: Implement export functionality
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterContinent('all');
    setFilterStatus('all');
  };

  const activeFilterCount = [
    filterContinent !== 'all',
    filterStatus !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Country Master</h1>
          <p className="text-gray-600 mt-1">Manage country master data and configurations</p>
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
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Country</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Countries</div>
          <div className="text-2xl font-bold text-gray-900">{countries.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {countries.filter(c => c.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Continents</div>
          <div className="text-2xl font-bold text-purple-600">{continents.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Currencies</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(countries.map(c => c.currency)).size}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by country name, code, or currency..."
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
                Continent
              </label>
              <select
                value={filterContinent}
                onChange={(e) => setFilterContinent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Continents</option>
                {continents.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
            defaultSort: { column: 'name', direction: 'asc' }
          }}
          emptyMessage="No countries found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Country</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <p>Add Country Form - Under Development</p>
              <button
                onClick={() => setShowAddModal(false)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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
