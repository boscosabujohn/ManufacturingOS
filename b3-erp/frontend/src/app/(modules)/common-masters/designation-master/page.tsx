'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, TrendingUp, Users } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockDesignations, Designation } from '@/data/common-masters/designations';

export default function DesignationMasterPage() {
  const [designations, setDesignations] = useState<Designation[]>(mockDesignations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique filter options
  const departments = useMemo(() => {
    const unique = Array.from(new Set(designations.map(d => d.department))).sort();
    return unique;
  }, [designations]);

  const levels = useMemo(() => {
    const unique = Array.from(new Set(designations.map(d => d.level))).sort((a, b) => a - b);
    return unique;
  }, [designations]);

  const grades = useMemo(() => {
    const unique = Array.from(new Set(designations.map(d => d.grade))).sort();
    return unique;
  }, [designations]);

  // Filtered data
  const filteredData = useMemo(() => {
    return designations.filter(designation => {
      const matchesSearch =
        designation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = filterDepartment === 'all' || designation.department === filterDepartment;
      const matchesLevel = filterLevel === 'all' || designation.level === parseInt(filterLevel);
      const matchesGrade = filterGrade === 'all' || designation.grade === filterGrade;

      return matchesSearch && matchesDepartment && matchesLevel && matchesGrade;
    });
  }, [designations, searchTerm, filterDepartment, filterLevel, filterGrade]);

  // Table columns
  const columns: Column<Designation>[] = [
    {
      id: 'code',
      header: 'Code',
      accessor: 'code',
      sortable: true,
      width: 'w-32',
      render: (value) => <span className="font-mono font-semibold text-blue-600">{value}</span>
    },
    {
      id: 'name',
      header: 'Designation',
      accessor: 'name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.reportingTo && (
            <div className="text-xs text-gray-500">Reports to: {row.reportingTo}</div>
          )}
        </div>
      )
    },
    {
      id: 'level',
      header: 'Level',
      accessor: 'level',
      sortable: true,
      align: 'center',
      render: (value) => {
        const colors = ['bg-purple-100 text-purple-800', 'bg-indigo-100 text-indigo-800', 'bg-blue-100 text-blue-800',
                        'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800',
                        'bg-red-100 text-red-800', 'bg-pink-100 text-pink-800', 'bg-gray-100 text-gray-800'];
        return (
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold ${colors[value - 1] || colors[8]}`}>
            {value}
          </span>
        );
      }
    },
    {
      id: 'grade',
      header: 'Grade',
      accessor: 'grade',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value}
        </span>
      )
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (value) => <span className="text-gray-900">{value}</span>
    },
    {
      id: 'salary',
      header: 'Salary Range',
      accessor: 'minSalary',
      sortable: true,
      render: (_, row) => (
        <div className="text-sm">
          {row.minSalary && row.maxSalary ? (
            <div className="font-mono">
              <div className="text-gray-600">₹{(row.minSalary / 100000).toFixed(1)}L</div>
              <div className="text-gray-400 text-xs">to ₹{(row.maxSalary / 100000).toFixed(1)}L</div>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      )
    },
    {
      id: 'headCount',
      header: 'Headcount',
      accessor: 'headCount',
      sortable: true,
      align: 'center',
      render: (value) => value ? (
        <div className="flex items-center justify-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
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
              console.log('Edit designation:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this designation?')) {
                setDesignations(prev => prev.filter(d => d.id !== row.id));
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
    setFilterDepartment('all');
    setFilterLevel('all');
    setFilterGrade('all');
  };

  const activeFilterCount = [
    filterDepartment !== 'all',
    filterLevel !== 'all',
    filterGrade !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  const totalHeadcount = designations.reduce((sum, d) => sum + (d.headCount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Designation Master</h1>
          <p className="text-gray-600 mt-1">Manage organizational designations and hierarchy</p>
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
            onClick={() => console.log('Add Designation')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Designation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Designations</div>
          <div className="text-2xl font-bold text-gray-900">{designations.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Departments</div>
          <div className="text-2xl font-bold text-blue-600">{departments.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Levels</div>
          <div className="text-2xl font-bold text-purple-600">{levels.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Grades</div>
          <div className="text-2xl font-bold text-indigo-600">{grades.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Headcount</div>
          <div className="text-2xl font-bold text-green-600">{totalHeadcount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by designation name, code, or department..."
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
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level.toString()}>Level {level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
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
            defaultSort: { column: 'level', direction: 'asc' }
          }}
          emptyMessage="No designations found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>
    </div>
  );
}
