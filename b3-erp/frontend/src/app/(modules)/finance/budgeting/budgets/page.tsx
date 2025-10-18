'use client';

import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Copy,
  Lock,
  Unlock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Budget {
  id: string;
  budgetCode: string;
  budgetName: string;
  fiscalYear: string;
  department: string;
  costCenter: string;
  budgetType: 'Operating' | 'Capital' | 'Project' | 'Department' | 'Revenue';
  totalBudget: number;
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  variancePercent: number;
  status: 'Draft' | 'Approved' | 'Active' | 'Locked' | 'Closed';
  startDate: string;
  endDate: string;
  approvedBy?: string;
  approvedDate?: string;
  revisions: number;
}

export default function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Sample budgets data
  const budgets: Budget[] = [
    {
      id: 'BUD001',
      budgetCode: 'BUD-2025-OPS-001',
      budgetName: 'Operations Budget FY 2025',
      fiscalYear: '2025',
      department: 'Operations',
      costCenter: 'CC-OPS-001',
      budgetType: 'Operating',
      totalBudget: 50000000,
      allocated: 48000000,
      spent: 35000000,
      remaining: 13000000,
      variance: -2000000,
      variancePercent: -4.0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvedBy: 'John Doe',
      approvedDate: '2024-12-15',
      revisions: 2
    },
    {
      id: 'BUD002',
      budgetCode: 'BUD-2025-CAP-001',
      budgetName: 'Capital Expenditure FY 2025',
      fiscalYear: '2025',
      department: 'Finance',
      costCenter: 'CC-FIN-001',
      budgetType: 'Capital',
      totalBudget: 25000000,
      allocated: 20000000,
      spent: 12000000,
      remaining: 8000000,
      variance: 5000000,
      variancePercent: 20.0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvedBy: 'Jane Smith',
      approvedDate: '2024-12-20',
      revisions: 1
    },
    {
      id: 'BUD003',
      budgetCode: 'BUD-2025-MKT-001',
      budgetName: 'Marketing Budget Q1 2025',
      fiscalYear: '2025',
      department: 'Marketing',
      costCenter: 'CC-MKT-001',
      budgetType: 'Department',
      totalBudget: 5000000,
      allocated: 5000000,
      spent: 3800000,
      remaining: 1200000,
      variance: 0,
      variancePercent: 0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      approvedBy: 'Robert Brown',
      approvedDate: '2024-12-10',
      revisions: 0
    },
    {
      id: 'BUD004',
      budgetCode: 'BUD-2025-IT-001',
      budgetName: 'IT Infrastructure Upgrade',
      fiscalYear: '2025',
      department: 'IT',
      costCenter: 'CC-IT-001',
      budgetType: 'Project',
      totalBudget: 15000000,
      allocated: 12000000,
      spent: 10500000,
      remaining: 1500000,
      variance: 3000000,
      variancePercent: 20.0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      approvedBy: 'Jane Smith',
      approvedDate: '2024-12-01',
      revisions: 3
    },
    {
      id: 'BUD005',
      budgetCode: 'BUD-2025-REV-001',
      budgetName: 'Revenue Budget FY 2025',
      fiscalYear: '2025',
      department: 'Sales',
      costCenter: 'CC-SAL-001',
      budgetType: 'Revenue',
      totalBudget: 150000000,
      allocated: 150000000,
      spent: 95000000,
      remaining: 55000000,
      variance: 0,
      variancePercent: 0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvedBy: 'John Doe',
      approvedDate: '2024-11-30',
      revisions: 1
    },
    {
      id: 'BUD006',
      budgetCode: 'BUD-2025-HR-001',
      budgetName: 'HR Department Budget Q1',
      fiscalYear: '2025',
      department: 'Human Resources',
      costCenter: 'CC-HR-001',
      budgetType: 'Department',
      totalBudget: 8000000,
      allocated: 8000000,
      spent: 2100000,
      remaining: 5900000,
      variance: 0,
      variancePercent: 0,
      status: 'Approved',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      approvedBy: 'Robert Brown',
      approvedDate: '2024-12-28',
      revisions: 0
    },
    {
      id: 'BUD007',
      budgetCode: 'BUD-2025-ENG-001',
      budgetName: 'Engineering R&D Budget',
      fiscalYear: '2025',
      department: 'Engineering',
      costCenter: 'CC-ENG-001',
      budgetType: 'Operating',
      totalBudget: 20000000,
      allocated: 18000000,
      spent: 16500000,
      remaining: 1500000,
      variance: 2000000,
      variancePercent: 10.0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvedBy: 'Jane Smith',
      approvedDate: '2024-12-05',
      revisions: 2
    },
    {
      id: 'BUD008',
      budgetCode: 'BUD-2025-FAC-001',
      budgetName: 'Facilities Maintenance',
      fiscalYear: '2025',
      department: 'Facilities',
      costCenter: 'CC-FAC-001',
      budgetType: 'Operating',
      totalBudget: 6000000,
      allocated: 6000000,
      spent: 6200000,
      remaining: -200000,
      variance: 0,
      variancePercent: 0,
      status: 'Active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvedBy: 'John Doe',
      approvedDate: '2024-12-18',
      revisions: 1
    }
  ];

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch =
      budget.budgetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.budgetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || budget.budgetType === typeFilter;
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || budget.department === departmentFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  // Calculate statistics
  const totalBudgeted = budgets
    .filter(b => b.status === 'Active')
    .reduce((sum, b) => sum + b.totalBudget, 0);

  const totalSpent = budgets
    .filter(b => b.status === 'Active')
    .reduce((sum, b) => sum + b.spent, 0);

  const totalRemaining = budgets
    .filter(b => b.status === 'Active')
    .reduce((sum, b) => sum + b.remaining, 0);

  const overBudgetCount = budgets.filter(b => b.remaining < 0).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      Approved: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      Active: 'bg-green-500/20 text-green-400 border-green-500/50',
      Locked: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      Closed: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    const icons = {
      Draft: Edit,
      Approved: CheckCircle,
      Active: Target,
      Locked: Lock,
      Closed: XCircle
    };
    const Icon = icons[status as keyof typeof icons];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getBudgetTypeBadge = (type: string) => {
    const colors = {
      Operating: 'bg-blue-500/20 text-blue-400',
      Capital: 'bg-purple-500/20 text-purple-400',
      Project: 'bg-green-500/20 text-green-400',
      Department: 'bg-orange-500/20 text-orange-400',
      Revenue: 'bg-cyan-500/20 text-cyan-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  const getUtilizationPercentage = (spent: number, total: number) => {
    return ((spent / total) * 100).toFixed(1);
  };

  const getUtilizationColor = (spent: number, total: number) => {
    const percent = (spent / total) * 100;
    if (percent > 100) return 'bg-red-500';
    if (percent > 90) return 'bg-orange-500';
    if (percent > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Budget Management</h1>
            <p className="text-gray-400">Create, track, and manage organizational budgets</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            Create Budget
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalBudgeted)}</div>
            <div className="text-blue-100 text-sm">Total Budgeted</div>
            <div className="mt-2 text-xs text-blue-100">
              {budgets.filter(b => b.status === 'Active').length} active budgets
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalSpent)}</div>
            <div className="text-orange-100 text-sm">Total Spent</div>
            <div className="mt-2 text-xs text-orange-100">
              {((totalSpent / totalBudgeted) * 100).toFixed(1)}% utilized
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalRemaining)}</div>
            <div className="text-green-100 text-sm">Total Remaining</div>
            <div className="mt-2 text-xs text-green-100">Available for allocation</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 opacity-80" />
              <XCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{overBudgetCount}</div>
            <div className="text-red-100 text-sm">Over Budget</div>
            <div className="mt-2 text-xs text-red-100">Requires attention</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by budget name, code, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="Operating">Operating</option>
                <option value="Capital">Capital</option>
                <option value="Project">Project</option>
                <option value="Department">Department</option>
                <option value="Revenue">Revenue</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active</option>
                <option value="Locked">Locked</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Engineering</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Budgets Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Budget Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total Budget</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Spent</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Remaining</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Utilization</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget) => {
                  const utilizationPercent = parseFloat(getUtilizationPercentage(budget.spent, budget.totalBudget));
                  const isOverBudget = budget.remaining < 0;

                  return (
                    <tr key={budget.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{budget.budgetName}</div>
                          <div className="text-sm text-gray-400 font-mono">{budget.budgetCode}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getBudgetTypeBadge(budget.budgetType)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{budget.department}</div>
                        <div className="text-xs text-gray-400">{budget.costCenter}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {formatCurrency(budget.totalBudget)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-orange-400'}`}>
                          {formatCurrency(budget.spent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                          {isOverBudget && '('}{formatCurrency(budget.remaining)}{isOverBudget && ')'}
                        </div>
                        {budget.variance !== 0 && (
                          <div className={`text-xs mt-1 ${budget.variance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            Variance: {budget.variance > 0 && '+'}{formatCurrency(budget.variance)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium mb-1 ${
                            utilizationPercent > 100 ? 'text-red-400' :
                            utilizationPercent > 90 ? 'text-orange-400' :
                            utilizationPercent > 75 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {utilizationPercent.toFixed(1)}%
                          </span>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getUtilizationColor(budget.spent, budget.totalBudget)}`}
                              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(budget.status)}
                        {budget.revisions > 0 && (
                          <div className="text-xs text-gray-400 mt-1">Rev {budget.revisions}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Edit Budget">
                            <Edit className="w-4 h-4 text-green-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Copy Budget">
                            <Copy className="w-4 h-4 text-purple-400" />
                          </button>
                          {budget.status === 'Active' ? (
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Lock Budget">
                              <Unlock className="w-4 h-4 text-orange-400" />
                            </button>
                          ) : (
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Unlock Budget">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No budgets found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBudgets.length > 0 && (
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">
              Showing {filteredBudgets.length} of {budgets.length} budgets
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
