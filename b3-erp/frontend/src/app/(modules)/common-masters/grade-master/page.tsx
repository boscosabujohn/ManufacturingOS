'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, TrendingUp, Award, DollarSign, Users, Calendar, Shield } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockGrades, Grade } from '@/data/common-masters/grades';

export default function GradeMasterPage() {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered data
  const filteredData = useMemo(() => {
    return grades.filter(grade => {
      const matchesSearch =
        grade.gradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.gradeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || grade.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [grades, searchTerm, filterCategory]);

  const getCategoryColor = (category: string) => {
    const colors = {
      executive: 'bg-purple-100 text-purple-800',
      management: 'bg-blue-100 text-blue-800',
      supervisory: 'bg-green-100 text-green-800',
      staff: 'bg-yellow-100 text-yellow-800',
      worker: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Table columns
  const columns: Column<Grade>[] = [
    {
      id: 'code',
      header: 'Grade Code',
      accessor: 'gradeCode',
      sortable: true,
      width: 'w-28',
      render: (value) => <span className="font-mono font-semibold text-blue-600">{value}</span>
    },
    {
      id: 'name',
      header: 'Grade Name',
      accessor: 'gradeName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">Level {row.level}</div>
        </div>
      )
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(value)} capitalize`}>
          {value}
        </span>
      )
    },
    {
      id: 'salary',
      header: 'Salary Range (Annual)',
      accessor: 'salaryRange',
      sortable: false,
      render: (value) => (
        <div className="text-sm">
          <div className="font-mono font-medium text-gray-900">
            ₹{(value.minSalary / 100000).toFixed(1)}L - ₹{(value.maxSalary / 100000).toFixed(1)}L
          </div>
          <div className="text-xs text-gray-500">
            Mid: ₹{((value.minSalary + value.maxSalary) / 200000).toFixed(1)}L
          </div>
        </div>
      )
    },
    {
      id: 'leaves',
      header: 'Leave Entitlement',
      accessor: 'leaveEntitlement',
      sortable: false,
      render: (value) => (
        <div className="text-xs text-gray-600">
          <div>EL: {value.earnedLeave} days</div>
          <div>CL: {value.casualLeave} days</div>
          <div>SL: {value.sickLeave} days</div>
        </div>
      )
    },
    {
      id: 'benefits',
      header: 'Benefits',
      accessor: 'benefits',
      sortable: false,
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.pfApplicable && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              PF
            </span>
          )}
          {value.esiApplicable && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              ESI
            </span>
          )}
          {value.gratuityApplicable && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              Gratuity
            </span>
          )}
          {value.medicalInsurance && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              Medical
            </span>
          )}
        </div>
      )
    },
    {
      id: 'terms',
      header: 'Terms',
      accessor: 'probationPeriod',
      sortable: false,
      render: (_, row) => (
        <div className="text-xs text-gray-600">
          <div>Probation: {row.probationPeriod} mo</div>
          <div>Notice: {row.noticePeriod} mo</div>
          <div className="capitalize">Review: {row.appraisalCycle}</div>
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
              console.log('Edit grade:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete ${row.gradeName}?`)) {
                setGrades(prev => prev.filter(g => g.id !== row.id));
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
    setFilterCategory('all');
  };

  const activeFilterCount = [
    filterCategory !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  // Statistics
  const stats = useMemo(() => {
    const totalPositions = grades.reduce((sum, g) => sum + g.eligibleDesignations.length, 0);
    const avgSalary = grades.reduce((sum, g) =>
      sum + (g.salaryRange.minSalary + g.salaryRange.maxSalary) / 2, 0) / grades.length;

    return {
      totalGrades: grades.length,
      activeGrades: grades.filter(g => g.isActive).length,
      categories: Array.from(new Set(grades.map(g => g.category))).length,
      totalPositions,
      avgSalary: Math.round(avgSalary / 100000),
      withInsurance: grades.filter(g => g.benefits.medicalInsurance).length
    };
  }, [grades]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-7 h-7 text-purple-600" />
            Grade Master
          </h1>
          <p className="text-gray-600 mt-1">Manage employee grades, salary bands, and benefits structure</p>
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
            onClick={() => console.log('Add Grade')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Grade</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Award className="w-4 h-4" /> Total Grades
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalGrades}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Active Grades</div>
          <div className="text-2xl font-bold text-green-600">{stats.activeGrades}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Categories</div>
          <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Users className="w-4 h-4" /> Designations
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalPositions}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Avg Salary
          </div>
          <div className="text-2xl font-bold text-orange-600">₹{stats.avgSalary}L</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Shield className="w-4 h-4" /> Insurance
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.withInsurance}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search grades by name, code, or description..."
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-1 gap-4">
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
                <option value="executive">Executive</option>
                <option value="management">Management</option>
                <option value="supervisory">Supervisory</option>
                <option value="staff">Staff</option>
                <option value="worker">Worker</option>
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
            pageSize: 12
          }}
          sorting={{
            enabled: true,
            defaultSort: { column: 'code', direction: 'asc' }
          }}
          emptyMessage="No grades found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Grade Structure Guidelines for Kitchen Manufacturing
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ 11 grades covering Executive to Worker levels for comprehensive org structure</li>
          <li>✓ Salary bands compliant with minimum wages for Maharashtra manufacturing industry</li>
          <li>✓ PF applicable for all grades, ESI for grades with salary ≤ ₹21,000/month</li>
          <li>✓ Leave entitlements as per Factories Act 1948 and Shops & Establishments Act</li>
          <li>✓ Medical insurance for staff grades and above</li>
          <li>✓ Probation periods ranging from 1-6 months based on seniority</li>
        </ul>
      </div>
    </div>
  );
}
