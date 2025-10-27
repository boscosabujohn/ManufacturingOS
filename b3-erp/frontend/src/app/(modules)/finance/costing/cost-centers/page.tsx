'use client';

import React, { useState } from 'react';
import {
  Building,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  manager: string;
  type: 'Production' | 'Service' | 'Administrative' | 'Sales' | 'R&D';
  status: 'Active' | 'Inactive';
  budgetAllocated: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  employeeCount: number;
  openingDate: string;
  description: string;
}

export default function CostCentersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Sample cost centers data
  const costCenters: CostCenter[] = [
    {
      id: 'CC001',
      code: 'CC-OPS-001',
      name: 'Operations - Manufacturing',
      department: 'Operations',
      manager: 'John Doe',
      type: 'Production',
      status: 'Active',
      budgetAllocated: 50000000,
      actualCost: 48500000,
      variance: 1500000,
      variancePercent: 3.0,
      employeeCount: 120,
      openingDate: '2020-01-01',
      description: 'Main manufacturing and production operations'
    },
    {
      id: 'CC002',
      code: 'CC-IT-001',
      name: 'Information Technology',
      department: 'IT',
      manager: 'Jane Smith',
      type: 'Service',
      status: 'Active',
      budgetAllocated: 15000000,
      actualCost: 16200000,
      variance: -1200000,
      variancePercent: -8.0,
      employeeCount: 35,
      openingDate: '2020-01-01',
      description: 'IT infrastructure and support services'
    },
    {
      id: 'CC003',
      code: 'CC-SAL-001',
      name: 'Sales & Marketing',
      department: 'Sales',
      manager: 'Robert Brown',
      type: 'Sales',
      status: 'Active',
      budgetAllocated: 25000000,
      actualCost: 23800000,
      variance: 1200000,
      variancePercent: 4.8,
      employeeCount: 45,
      openingDate: '2020-01-01',
      description: 'Sales operations and marketing activities'
    },
    {
      id: 'CC004',
      code: 'CC-HR-001',
      name: 'Human Resources',
      department: 'Human Resources',
      manager: 'Sarah Wilson',
      type: 'Administrative',
      status: 'Active',
      budgetAllocated: 8000000,
      actualCost: 7950000,
      variance: 50000,
      variancePercent: 0.6,
      employeeCount: 15,
      openingDate: '2020-01-01',
      description: 'HR operations and employee management'
    },
    {
      id: 'CC005',
      code: 'CC-RD-001',
      name: 'Research & Development',
      department: 'Engineering',
      manager: 'Michael Chen',
      type: 'R&D',
      status: 'Active',
      budgetAllocated: 20000000,
      actualCost: 19500000,
      variance: 500000,
      variancePercent: 2.5,
      employeeCount: 28,
      openingDate: '2021-06-01',
      description: 'Product research and development'
    },
    {
      id: 'CC006',
      code: 'CC-FIN-001',
      name: 'Finance & Accounting',
      department: 'Finance',
      manager: 'Emily Davis',
      type: 'Administrative',
      status: 'Active',
      budgetAllocated: 10000000,
      actualCost: 9800000,
      variance: 200000,
      variancePercent: 2.0,
      employeeCount: 22,
      openingDate: '2020-01-01',
      description: 'Financial operations and accounting'
    },
    {
      id: 'CC007',
      code: 'CC-QA-001',
      name: 'Quality Assurance',
      department: 'Operations',
      manager: 'David Martinez',
      type: 'Service',
      status: 'Active',
      budgetAllocated: 6000000,
      actualCost: 6100000,
      variance: -100000,
      variancePercent: -1.7,
      employeeCount: 18,
      openingDate: '2020-03-01',
      description: 'Quality control and assurance'
    },
    {
      id: 'CC008',
      code: 'CC-LOG-001',
      name: 'Logistics & Warehouse',
      department: 'Operations',
      manager: 'Lisa Anderson',
      type: 'Service',
      status: 'Active',
      budgetAllocated: 12000000,
      actualCost: 11500000,
      variance: 500000,
      variancePercent: 4.2,
      employeeCount: 40,
      openingDate: '2020-01-01',
      description: 'Warehouse and logistics operations'
    },
    {
      id: 'CC009',
      code: 'CC-CUST-001',
      name: 'Customer Service',
      department: 'Sales',
      manager: 'James Taylor',
      type: 'Service',
      status: 'Active',
      budgetAllocated: 5000000,
      actualCost: 4800000,
      variance: 200000,
      variancePercent: 4.0,
      employeeCount: 25,
      openingDate: '2020-01-01',
      description: 'Customer support and service operations'
    },
    {
      id: 'CC010',
      code: 'CC-FAC-001',
      name: 'Facilities Management',
      department: 'Operations',
      manager: 'Patricia White',
      type: 'Administrative',
      status: 'Active',
      budgetAllocated: 7000000,
      actualCost: 7200000,
      variance: -200000,
      variancePercent: -2.9,
      employeeCount: 12,
      openingDate: '2020-01-01',
      description: 'Facilities and building management'
    }
  ];

  const filteredCostCenters = costCenters.filter(cc => {
    const matchesSearch =
      cc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.manager.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || cc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || cc.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || cc.department === departmentFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  // Calculate statistics
  const totalBudget = costCenters.reduce((sum, cc) => sum + cc.budgetAllocated, 0);
  const totalActual = costCenters.reduce((sum, cc) => sum + cc.actualCost, 0);
  const totalVariance = costCenters.reduce((sum, cc) => sum + cc.variance, 0);
  const totalEmployees = costCenters.reduce((sum, cc) => sum + cc.employeeCount, 0);
  const overBudgetCount = costCenters.filter(cc => cc.variance < 0).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      Production: 'bg-blue-500/20 text-blue-400',
      Service: 'bg-green-500/20 text-green-400',
      Administrative: 'bg-purple-500/20 text-purple-400',
      Sales: 'bg-orange-500/20 text-orange-400',
      'R&D': 'bg-cyan-500/20 text-cyan-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-500/20 text-green-400 border-green-500/50',
      Inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    const icons = {
      Active: CheckCircle,
      Inactive: AlertCircle
    };
    const Icon = icons[status as keyof typeof icons];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getVarianceIndicator = (variance: number, percent: number) => {
    const isFavorable = variance >= 0;
    return (
      <div className={`flex flex-col ${isFavorable ? 'text-green-400' : 'text-red-400'}`}>
        <div className="font-medium">
          {isFavorable ? '+' : ''}{formatCurrency(variance)}
        </div>
        <div className="text-xs">
          {isFavorable ? '+' : ''}{percent.toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Cost Centers</h1>
            <p className="text-gray-400">Manage and monitor departmental cost centers</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            Add Cost Center
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <Building className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{costCenters.length}</div>
            <div className="text-blue-100 text-sm">Total Cost Centers</div>
            <div className="mt-2 text-xs text-blue-100">{costCenters.filter(cc => cc.status === 'Active').length} active</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalBudget)}</div>
            <div className="text-purple-100 text-sm">Total Budget</div>
            <div className="mt-2 text-xs text-purple-100">Allocated amount</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalActual)}</div>
            <div className="text-orange-100 text-sm">Total Spent</div>
            <div className="mt-2 text-xs text-orange-100">
              {((totalActual / totalBudget) * 100).toFixed(1)}% utilized
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {totalVariance >= 0 ? '+' : ''}{formatCurrency(totalVariance)}
            </div>
            <div className="text-green-100 text-sm">Overall Variance</div>
            <div className="mt-2 text-xs text-green-100">
              {totalVariance >= 0 ? 'Under' : 'Over'} budget
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{totalEmployees}</div>
            <div className="text-cyan-100 text-sm">Total Employees</div>
            <div className="mt-2 text-xs text-cyan-100">Across all centers</div>
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
                  placeholder="Search by name, code, or manager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="Production">Production</option>
                <option value="Service">Service</option>
                <option value="Administrative">Administrative</option>
                <option value="Sales">Sales</option>
                <option value="R&D">R&D</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Cost Centers Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Cost Center</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Manager</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Budget</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actual Cost</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Variance</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Utilization</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Employees</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCostCenters.map((cc) => {
                  const utilizationPercent = (cc.actualCost / cc.budgetAllocated) * 100;

                  return (
                    <tr key={cc.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{cc.name}</div>
                          <div className="text-sm text-gray-400 font-mono">{cc.code}</div>
                          <div className="text-xs text-gray-500 mt-1">{cc.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(cc.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-white text-sm">{cc.manager}</div>
                            <div className="text-xs text-gray-400">Manager</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {formatCurrency(cc.budgetAllocated)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-medium ${cc.variance < 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {formatCurrency(cc.actualCost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {getVarianceIndicator(cc.variance, cc.variancePercent)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium mb-1 ${
                            utilizationPercent > 100 ? 'text-red-400' :
                            utilizationPercent > 90 ? 'text-orange-400' :
                            'text-green-400'
                          }`}>
                            {utilizationPercent.toFixed(1)}%
                          </span>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                utilizationPercent > 100 ? 'bg-red-500' :
                                utilizationPercent > 90 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-medium">{cc.employeeCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(cc.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-green-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <BarChart3 className="w-4 h-4 text-purple-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCostCenters.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No cost centers found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCostCenters.length > 0 && (
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">
              Showing {filteredCostCenters.length} of {costCenters.length} cost centers
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
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
