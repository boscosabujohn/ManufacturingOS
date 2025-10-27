'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, Calendar, MapPin, Star, Award } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockHolidays, Holiday, getHolidayStats } from '@/data/common-masters/holidays';

export default function HolidayMasterPage() {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered data
  const filteredData = useMemo(() => {
    return holidays.filter(holiday => {
      const matchesSearch =
        holiday.holidayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.holidayCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || holiday.holidayType === filterType;
      const matchesCategory = filterCategory === 'all' || holiday.category === filterCategory;

      const matchesMonth = filterMonth === 'all' ||
        new Date(holiday.date).getMonth() === parseInt(filterMonth);

      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    });
  }, [holidays, searchTerm, filterType, filterCategory, filterMonth]);

  const getTypeColor = (type: string) => {
    const colors = {
      'national': 'bg-red-100 text-red-800',
      'regional': 'bg-orange-100 text-orange-800',
      'festival': 'bg-purple-100 text-purple-800',
      'restricted': 'bg-yellow-100 text-yellow-800',
      'company': 'bg-blue-100 text-blue-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    return category === 'mandatory' ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <Award className="w-4 h-4 text-gray-400" />;
  };

  // Table columns
  const columns: Column<Holiday>[] = [
    {
      id: 'date',
      header: 'Date',
      accessor: 'date',
      sortable: true,
      width: 'w-32',
      render: (value, row) => {
        const date = new Date(value);
        const isUpcoming = date >= new Date();
        return (
          <div className={`text-sm ${isUpcoming ? 'font-semibold' : 'text-gray-500'}`}>
            <div>{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div className="text-xs text-gray-500">{row.dayOfWeek}</div>
          </div>
        );
      }
    },
    {
      id: 'holiday',
      header: 'Holiday',
      accessor: 'holidayName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {getCategoryIcon(row.category)}
            {value}
          </div>
          <div className="text-xs text-gray-500">{row.holidayCode}</div>
        </div>
      )
    },
    {
      id: 'type',
      header: 'Type',
      accessor: 'holidayType',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(value)} capitalize`}>
          {value}
        </span>
      )
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          value === 'mandatory' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      id: 'applicable',
      header: 'Applicable Locations',
      accessor: 'applicableLocations',
      sortable: false,
      render: (value) => (
        <div className="text-sm text-gray-600 flex items-start gap-1">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{value.join(', ')}</span>
        </div>
      )
    },
    {
      id: 'for',
      header: 'For',
      accessor: 'applicableFor',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700 capitalize">{value}</span>
      )
    },
    {
      id: 'description',
      header: 'Description',
      accessor: 'description',
      sortable: false,
      render: (value) => (
        <div className="text-sm text-gray-600 max-w-xs truncate" title={value}>
          {value}
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
              console.log('Edit holiday:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete ${row.holidayName}?`)) {
                setHolidays(prev => prev.filter(h => h.id !== row.id));
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
    setFilterCategory('all');
    setFilterMonth('all');
  };

  const activeFilterCount = [
    filterType !== 'all',
    filterCategory !== 'all',
    filterMonth !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    const upcoming = holidays.filter(h => new Date(h.date) >= today);

    return {
      ...getHolidayStats(),
      upcoming: upcoming.length
    };
  }, [holidays]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-red-600" />
            Holiday Master - 2025
          </h1>
          <p className="text-gray-600 mt-1">Manage public holidays, festival leaves, and company offs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Calendar</span>
          </button>
          <button
            onClick={() => console.log('Add Holiday')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Holidays</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Upcoming</div>
          <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">National</div>
          <div className="text-2xl font-bold text-red-600">{stats.national}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Festivals</div>
          <div className="text-2xl font-bold text-purple-600">{stats.festival}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Mandatory</div>
          <div className="text-2xl font-bold text-green-600">{stats.mandatory}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Restricted</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.restricted}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search holidays by name or code..."
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
                Holiday Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="national">National</option>
                <option value="regional">Regional</option>
                <option value="festival">Festival</option>
                <option value="restricted">Restricted</option>
                <option value="company">Company</option>
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
                <option value="mandatory">Mandatory</option>
                <option value="optional">Optional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Months</option>
                {months.map((month, idx) => (
                  <option key={month} value={idx.toString()}>{month}</option>
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
            pageSize: 15
          }}
          sorting={{
            enabled: true,
            defaultSort: { column: 'date', direction: 'asc' }
          }}
          emptyMessage="No holidays found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Holiday Calendar 2025 - Key Information
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ {stats.mandatory} Mandatory holidays applicable to all employees</li>
          <li>✓ {stats.restricted} Restricted holidays - employees can choose based on company policy</li>
          <li>✓ Regional holidays apply to specific state locations only</li>
          <li>✓ Festival dates (Holi, Diwali, Eid, etc.) are tentative and subject to moon sighting/lunar calendar</li>
          <li>✓ Employees in showrooms with 7-day operations get compensatory offs for holidays worked</li>
          <li>✓ Production shifts maintain essential operations on selected holidays with overtime pay</li>
        </ul>
      </div>
    </div>
  );
}
