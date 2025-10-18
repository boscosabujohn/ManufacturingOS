'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Eye, Download } from 'lucide-react';

interface CostBreakdown {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'Under Budget' | 'On Budget' | 'Over Budget';
}

interface ProjectCost {
  id: string;
  projectId: string;
  projectName: string;
  projectType: string;
  customer: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'On Hold';
  totalBudget: number;
  actualCost: number;
  committedCost: number;
  forecastedCost: number;
  variance: number;
  variancePercent: number;
  costBreakdown: CostBreakdown[];
  profitMargin: number;
  actualProfit: number;
}

export default function ProjectCostingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectCost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const mockProjectCosts: ProjectCost[] = [
    {
      id: 'PC-001',
      projectId: 'PRJ-2025-001',
      projectName: 'Taj Hotels - Commercial Kitchen Setup',
      projectType: 'Commercial Kitchen',
      customer: 'Indian Hotels Company Limited',
      startDate: '2024-12-01',
      endDate: '2025-03-15',
      progress: 68,
      status: 'In Progress',
      totalBudget: 8500000,
      actualCost: 5950000,
      committedCost: 1200000,
      forecastedCost: 8800000,
      variance: -300000,
      variancePercent: -3.5,
      costBreakdown: [
        { category: 'Materials', budgeted: 3400000, actual: 3520000, variance: -120000, variancePercent: -3.5, status: 'Over Budget' },
        { category: 'Labor', budgeted: 1700000, actual: 1580000, variance: 120000, variancePercent: 7.1, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 2125000, actual: 2100000, variance: 25000, variancePercent: 1.2, status: 'On Budget' },
        { category: 'Subcontractors', budgeted: 850000, actual: 750000, variance: 100000, variancePercent: 11.8, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 425000, actual: 0, variance: 425000, variancePercent: 100, status: 'Under Budget' },
      ],
      profitMargin: 15,
      actualProfit: -450000,
    },
    {
      id: 'PC-002',
      projectId: 'PRJ-2025-002',
      projectName: 'BigBasket - Cold Room Installation',
      projectType: 'Cold Room',
      customer: 'Innovative Retail Concepts Pvt Ltd',
      startDate: '2024-12-15',
      endDate: '2025-02-28',
      progress: 85,
      status: 'In Progress',
      totalBudget: 4200000,
      actualCost: 3780000,
      committedCost: 180000,
      forecastedCost: 4050000,
      variance: 150000,
      variancePercent: 3.6,
      costBreakdown: [
        { category: 'Materials', budgeted: 1680000, actual: 1620000, variance: 60000, variancePercent: 3.6, status: 'Under Budget' },
        { category: 'Labor', budgeted: 840000, actual: 810000, variance: 30000, variancePercent: 3.6, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 1260000, actual: 1240000, variance: 20000, variancePercent: 1.6, status: 'On Budget' },
        { category: 'Subcontractors', budgeted: 210000, actual: 110000, variance: 100000, variancePercent: 47.6, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 210000, actual: 0, variance: 210000, variancePercent: 100, status: 'Under Budget' },
      ],
      profitMargin: 20,
      actualProfit: 270000,
    },
    {
      id: 'PC-003',
      projectId: 'PRJ-2025-003',
      projectName: 'L&T Campus - Industrial Kitchen',
      projectType: 'Industrial Kitchen',
      customer: 'Larsen & Toubro Limited',
      startDate: '2024-11-15',
      endDate: '2025-04-30',
      progress: 55,
      status: 'In Progress',
      totalBudget: 12000000,
      actualCost: 7200000,
      committedCost: 2400000,
      forecastedCost: 12900000,
      variance: -900000,
      variancePercent: -7.5,
      costBreakdown: [
        { category: 'Materials', budgeted: 4800000, actual: 3100000, variance: 1700000, variancePercent: 35.4, status: 'Under Budget' },
        { category: 'Labor', budgeted: 2400000, actual: 1580000, variance: 820000, variancePercent: 34.2, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 3000000, actual: 1900000, variance: 1100000, variancePercent: 36.7, status: 'Under Budget' },
        { category: 'Subcontractors', budgeted: 1200000, actual: 620000, variance: 580000, variancePercent: 48.3, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 600000, actual: 0, variance: 600000, variancePercent: 100, status: 'Under Budget' },
      ],
      profitMargin: 18,
      actualProfit: -2700000,
    },
    {
      id: 'PC-004',
      projectId: 'PRJ-2025-004',
      projectName: 'ITC Grand - Bakery Equipment Setup',
      projectType: 'Commercial Kitchen',
      customer: 'ITC Limited',
      startDate: '2024-12-20',
      endDate: '2025-01-31',
      progress: 100,
      status: 'Completed',
      totalBudget: 3500000,
      actualCost: 3320000,
      committedCost: 0,
      forecastedCost: 3320000,
      variance: 180000,
      variancePercent: 5.1,
      costBreakdown: [
        { category: 'Materials', budgeted: 1400000, actual: 1360000, variance: 40000, variancePercent: 2.9, status: 'On Budget' },
        { category: 'Labor', budgeted: 700000, actual: 680000, variance: 20000, variancePercent: 2.9, status: 'On Budget' },
        { category: 'Equipment', budgeted: 1050000, actual: 1000000, variance: 50000, variancePercent: 4.8, status: 'Under Budget' },
        { category: 'Subcontractors', budgeted: 175000, actual: 140000, variance: 35000, variancePercent: 20.0, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 175000, actual: 140000, variance: 35000, variancePercent: 20.0, status: 'Under Budget' },
      ],
      profitMargin: 22,
      actualProfit: 950000,
    },
    {
      id: 'PC-005',
      projectId: 'PRJ-2025-005',
      projectName: 'Godrej Properties - Modular Kitchen',
      projectType: 'Modular Kitchen',
      customer: 'Godrej Properties Limited',
      startDate: '2025-01-05',
      endDate: '2025-01-25',
      progress: 100,
      status: 'Completed',
      totalBudget: 450000,
      actualCost: 412000,
      committedCost: 0,
      forecastedCost: 412000,
      variance: 38000,
      variancePercent: 8.4,
      costBreakdown: [
        { category: 'Materials', budgeted: 180000, actual: 168000, variance: 12000, variancePercent: 6.7, status: 'Under Budget' },
        { category: 'Labor', budgeted: 90000, actual: 84000, variance: 6000, variancePercent: 6.7, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 135000, actual: 125000, variance: 10000, variancePercent: 7.4, status: 'Under Budget' },
        { category: 'Subcontractors', budgeted: 22500, actual: 18000, variance: 4500, variancePercent: 20.0, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 22500, actual: 17000, variance: 5500, variancePercent: 24.4, status: 'Under Budget' },
      ],
      profitMargin: 25,
      actualProfit: 150500,
    },
    {
      id: 'PC-006',
      projectId: 'PRJ-2025-006',
      projectName: 'Siemens - Switchgear Manufacturing Unit',
      projectType: 'Switchgear',
      customer: 'Siemens Limited',
      startDate: '2024-10-01',
      endDate: '2025-05-31',
      progress: 45,
      status: 'In Progress',
      totalBudget: 15000000,
      actualCost: 7500000,
      committedCost: 4500000,
      forecastedCost: 16500000,
      variance: -1500000,
      variancePercent: -10.0,
      costBreakdown: [
        { category: 'Materials', budgeted: 6000000, actual: 3200000, variance: 2800000, variancePercent: 46.7, status: 'Under Budget' },
        { category: 'Labor', budgeted: 3000000, actual: 1600000, variance: 1400000, variancePercent: 46.7, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 4500000, actual: 2100000, variance: 2400000, variancePercent: 53.3, status: 'Under Budget' },
        { category: 'Subcontractors', budgeted: 750000, actual: 400000, variance: 350000, variancePercent: 46.7, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 750000, actual: 200000, variance: 550000, variancePercent: 73.3, status: 'Under Budget' },
      ],
      profitMargin: 15,
      actualProfit: -4500000,
    },
    {
      id: 'PC-007',
      projectId: 'PRJ-2025-007',
      projectName: 'Reliance Retail - Cold Storage',
      projectType: 'Cold Room',
      customer: 'Reliance Retail Limited',
      startDate: '2025-01-10',
      endDate: '2025-04-15',
      progress: 15,
      status: 'In Progress',
      totalBudget: 7500000,
      actualCost: 1500000,
      committedCost: 2250000,
      forecastedCost: 7800000,
      variance: -300000,
      variancePercent: -4.0,
      costBreakdown: [
        { category: 'Materials', budgeted: 3000000, actual: 620000, variance: 2380000, variancePercent: 79.3, status: 'Under Budget' },
        { category: 'Labor', budgeted: 1500000, actual: 310000, variance: 1190000, variancePercent: 79.3, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 2250000, actual: 450000, variance: 1800000, variancePercent: 80.0, status: 'Under Budget' },
        { category: 'Subcontractors', budgeted: 375000, actual: 80000, variance: 295000, variancePercent: 78.7, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 375000, actual: 40000, variance: 335000, variancePercent: 89.3, status: 'Under Budget' },
      ],
      profitMargin: 18,
      actualProfit: -825000,
    },
    {
      id: 'PC-008',
      projectId: 'PRJ-2025-008',
      projectName: 'Marriott Hotel - Kitchen Renovation',
      projectType: 'Commercial Kitchen',
      customer: 'Marriott International',
      startDate: '2025-01-15',
      endDate: '2025-04-30',
      progress: 28,
      status: 'In Progress',
      totalBudget: 9500000,
      actualCost: 3100000,
      committedCost: 1900000,
      forecastedCost: 9200000,
      variance: 300000,
      variancePercent: 3.2,
      costBreakdown: [
        { category: 'Materials', budgeted: 3800000, actual: 1280000, variance: 2520000, variancePercent: 66.3, status: 'Under Budget' },
        { category: 'Labor', budgeted: 1900000, actual: 640000, variance: 1260000, variancePercent: 66.3, status: 'Under Budget' },
        { category: 'Equipment', budgeted: 2850000, actual: 920000, variance: 1930000, variancePercent: 67.7, status: 'Under Budget' },
        { category: 'Subcontractors', budgeted: 475000, actual: 160000, variance: 315000, variancePercent: 66.3, status: 'Under Budget' },
        { category: 'Overheads', budgeted: 475000, actual: 100000, variance: 375000, variancePercent: 78.9, status: 'Under Budget' },
      ],
      profitMargin: 20,
      actualProfit: -1200000,
    },
  ];

  const stats = {
    totalProjects: mockProjectCosts.length,
    activeProjects: mockProjectCosts.filter(p => p.status === 'In Progress').length,
    completedProjects: mockProjectCosts.filter(p => p.status === 'Completed').length,
    totalBudget: mockProjectCosts.reduce((sum, p) => sum + p.totalBudget, 0),
    totalActual: mockProjectCosts.reduce((sum, p) => sum + p.actualCost, 0),
    totalVariance: mockProjectCosts.reduce((sum, p) => sum + p.variance, 0),
    overBudgetProjects: mockProjectCosts.filter(p => p.variance < 0).length,
  };

  const filteredProjects = mockProjectCosts.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < -500000) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostStatusColor = (status: string) => {
    switch (status) {
      case 'Under Budget':
        return 'text-green-600';
      case 'On Budget':
        return 'text-blue-600';
      case 'Over Budget':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Costing (Actual vs Budget)</h1>
          <p className="text-gray-600 mt-1">Comprehensive cost tracking and variance analysis</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeProjects}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedProjects}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Over Budget</p>
              <p className="text-2xl font-bold text-red-600">{stats.overBudgetProjects}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalBudget / 10000000).toFixed(1)}Cr</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actual Cost</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalActual / 10000000).toFixed(1)}Cr</p>
            </div>
            <DollarSign className="h-8 w-8 text-cyan-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Variance</p>
              <p className={`text-2xl font-bold ${getVarianceColor(stats.totalVariance)}`}>
                {stats.totalVariance > 0 ? '+' : ''}₹{(Math.abs(stats.totalVariance) / 100000).toFixed(1)}L
              </p>
            </div>
            {stats.totalVariance >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by project name, ID, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{project.projectId}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{project.projectName}</p>
                <p className="text-xs text-gray-500">{project.customer}</p>
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-semibold text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total Budget</p>
                <p className="text-lg font-bold text-gray-900">₹{(project.totalBudget / 100000).toFixed(2)}L</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Actual Cost</p>
                <p className="text-lg font-bold text-gray-900">₹{(project.actualCost / 100000).toFixed(2)}L</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Forecasted</p>
                <p className="text-lg font-bold text-gray-900">₹{(project.forecastedCost / 100000).toFixed(2)}L</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Variance</p>
                <p className={`text-lg font-bold ${getVarianceColor(project.variance)}`}>
                  {project.variance > 0 ? '+' : ''}₹{(Math.abs(project.variance) / 100000).toFixed(2)}L
                </p>
                <p className={`text-xs font-semibold ${getVarianceColor(project.variance)}`}>
                  ({project.variancePercent > 0 ? '+' : ''}{project.variancePercent.toFixed(1)}%)
                </p>
              </div>
            </div>

            {/* Cost Utilization Bar */}
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Budget Utilization</p>
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${
                    project.actualCost / project.totalBudget > 1
                      ? 'bg-red-500'
                      : project.actualCost / project.totalBudget > 0.9
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((project.actualCost / project.totalBudget) * 100, 100)}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                  {((project.actualCost / project.totalBudget) * 100).toFixed(1)}% Utilized
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-gray-600">Committed</p>
                <p className="font-semibold text-gray-900">₹{(project.committedCost / 100000).toFixed(1)}L</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="text-gray-600">Profit Margin</p>
                <p className="font-semibold text-gray-900">{project.profitMargin}%</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-gray-600">Actual Profit</p>
                <p className={`font-semibold ${project.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{(Math.abs(project.actualProfit) / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProjects.length)}</span> of{' '}
            <span className="font-medium">{filteredProjects.length}</span> projects
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedProject.projectId} - Cost Breakdown</h2>
                <p className="text-sm text-gray-600">{selectedProject.projectName}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(selectedProject.totalBudget / 100000).toFixed(2)}L</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Actual Cost</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(selectedProject.actualCost / 100000).toFixed(2)}L</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Forecasted</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(selectedProject.forecastedCost / 100000).toFixed(2)}L</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedProject.variance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Variance</p>
                  <p className={`text-2xl font-bold ${getVarianceColor(selectedProject.variance)}`}>
                    {selectedProject.variance > 0 ? '+' : ''}₹{(Math.abs(selectedProject.variance) / 100000).toFixed(2)}L
                  </p>
                </div>
              </div>

              {/* Cost Breakdown Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category-wise Cost Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Budgeted</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actual</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Variance</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">%</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedProject.costBreakdown.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            ₹{(item.budgeted / 100000).toFixed(2)}L
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            ₹{(item.actual / 100000).toFixed(2)}L
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${getVarianceColor(item.variance)}`}>
                            {item.variance > 0 ? '+' : ''}₹{(Math.abs(item.variance) / 100000).toFixed(2)}L
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${getVarianceColor(item.variance)}`}>
                            {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-medium ${getCostStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          ₹{(selectedProject.totalBudget / 100000).toFixed(2)}L
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          ₹{(selectedProject.actualCost / 100000).toFixed(2)}L
                        </td>
                        <td className={`px-4 py-3 text-sm text-right ${getVarianceColor(selectedProject.variance)}`}>
                          {selectedProject.variance > 0 ? '+' : ''}₹{(Math.abs(selectedProject.variance) / 100000).toFixed(2)}L
                        </td>
                        <td className={`px-4 py-3 text-sm text-right ${getVarianceColor(selectedProject.variance)}`}>
                          {selectedProject.variancePercent > 0 ? '+' : ''}{selectedProject.variancePercent.toFixed(1)}%
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Details</span>
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
