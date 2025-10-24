'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart, BarChart3, Calendar, Target } from 'lucide-react'

export type BudgetStatus = 'under-budget' | 'on-budget' | 'over-budget' | 'at-risk';
export type CostCategory = 'labor' | 'materials' | 'equipment' | 'overhead' | 'contingency' | 'other';

export interface CostBreakdown {
  category: CostCategory;
  budgeted: number;
  actual: number;
  committed: number;
  forecasted: number;
  variance: number;
  variancePercent: number;
}

export interface ProjectFinancials {
  projectId: string;
  projectName: string;
  totalBudget: number;
  totalActual: number;
  totalCommitted: number;
  totalForecasted: number;
  variance: number;
  variancePercent: number;
  status: BudgetStatus;
  costBreakdown: CostBreakdown[];
  earnedValue: number; // EV
  plannedValue: number; // PV
  scheduleVariance: number; // SV = EV - PV
  costVariance: number; // CV = EV - AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  costPerformanceIndex: number; // CPI = EV / AC
  estimateAtCompletion: number; // EAC
  estimateToComplete: number; // ETC
  varianceAtCompletion: number; // VAC
}

export interface PortfolioFinancials {
  totalBudget: number;
  totalActual: number;
  totalCommitted: number;
  totalForecasted: number;
  totalVariance: number;
  totalVariancePercent: number;
  projectsUnderBudget: number;
  projectsOnBudget: number;
  projectsOverBudget: number;
  projectsAtRisk: number;
  overallCPI: number;
  overallSPI: number;
}

export default function FinancialRollup() {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const [projectFinancials] = useState<ProjectFinancials[]>([
    {
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      totalBudget: 45000000,
      totalActual: 29250000,
      totalCommitted: 5000000,
      totalForecasted: 44500000,
      variance: 500000,
      variancePercent: 1.1,
      status: 'on-budget',
      earnedValue: 29250000,
      plannedValue: 27000000,
      scheduleVariance: 2250000,
      costVariance: 0,
      schedulePerformanceIndex: 1.08,
      costPerformanceIndex: 1.00,
      estimateAtCompletion: 44500000,
      estimateToComplete: 15250000,
      varianceAtCompletion: 500000,
      costBreakdown: [
        { category: 'labor', budgeted: 15000000, actual: 9800000, committed: 2000000, forecasted: 14800000, variance: 200000, variancePercent: 1.3 },
        { category: 'materials', budgeted: 18000000, actual: 11700000, committed: 2500000, forecasted: 17900000, variance: 100000, variancePercent: 0.6 },
        { category: 'equipment', budgeted: 8000000, actual: 5200000, committed: 500000, forecasted: 8000000, variance: 0, variancePercent: 0 },
        { category: 'overhead', budgeted: 3000000, actual: 1950000, committed: 0, forecasted: 2800000, variance: 200000, variancePercent: 6.7 },
        { category: 'contingency', budgeted: 1000000, actual: 600000, committed: 0, forecasted: 1000000, variance: 0, variancePercent: 0 }
      ]
    },
    {
      projectId: 'PRJ-2025-002',
      projectName: 'CNC Machine Upgrade',
      totalBudget: 32000000,
      totalActual: 14400000,
      totalCommitted: 3200000,
      totalForecasted: 31200000,
      variance: 800000,
      variancePercent: 2.5,
      status: 'under-budget',
      earnedValue: 14400000,
      plannedValue: 14400000,
      scheduleVariance: 0,
      costVariance: 0,
      schedulePerformanceIndex: 1.00,
      costPerformanceIndex: 1.00,
      estimateAtCompletion: 31200000,
      estimateToComplete: 16800000,
      varianceAtCompletion: 800000,
      costBreakdown: [
        { category: 'labor', budgeted: 10000000, actual: 4500000, committed: 1000000, forecasted: 9700000, variance: 300000, variancePercent: 3.0 },
        { category: 'materials', budgeted: 14000000, actual: 6300000, committed: 1500000, forecasted: 13500000, variance: 500000, variancePercent: 3.6 },
        { category: 'equipment', budgeted: 5000000, actual: 2250000, committed: 500000, forecasted: 5000000, variance: 0, variancePercent: 0 },
        { category: 'overhead', budgeted: 2500000, actual: 1125000, committed: 200000, forecasted: 2500000, variance: 0, variancePercent: 0 },
        { category: 'contingency', budgeted: 500000, actual: 225000, committed: 0, forecasted: 500000, variance: 0, variancePercent: 0 }
      ]
    },
    {
      projectId: 'PRJ-2025-003',
      projectName: 'Automation System',
      totalBudget: 28000000,
      totalActual: 12600000,
      totalCommitted: 4200000,
      totalForecasted: 31500000,
      variance: -3500000,
      variancePercent: -12.5,
      status: 'over-budget',
      earnedValue: 9800000,
      plannedValue: 14000000,
      scheduleVariance: -4200000,
      costVariance: -2800000,
      schedulePerformanceIndex: 0.70,
      costPerformanceIndex: 0.78,
      estimateAtCompletion: 31500000,
      estimateToComplete: 18900000,
      varianceAtCompletion: -3500000,
      costBreakdown: [
        { category: 'labor', budgeted: 12000000, actual: 5400000, committed: 1800000, forecasted: 13500000, variance: -1500000, variancePercent: -12.5 },
        { category: 'materials', budgeted: 10000000, actual: 4500000, committed: 1500000, forecasted: 11500000, variance: -1500000, variancePercent: -15.0 },
        { category: 'equipment', budgeted: 4000000, actual: 1800000, committed: 700000, forecasted: 4500000, variance: -500000, variancePercent: -12.5 },
        { category: 'overhead', budgeted: 1500000, actual: 675000, committed: 200000, forecasted: 1500000, variance: 0, variancePercent: 0 },
        { category: 'contingency', budgeted: 500000, actual: 225000, committed: 0, forecasted: 500000, variance: 0, variancePercent: 0 }
      ]
    },
    {
      projectId: 'PRJ-2025-004',
      projectName: 'Production Line Setup',
      totalBudget: 56000000,
      totalActual: 5600000,
      totalCommitted: 8400000,
      totalForecasted: 57400000,
      variance: -1400000,
      variancePercent: -2.5,
      status: 'at-risk',
      earnedValue: 8400000,
      plannedValue: 8400000,
      scheduleVariance: 0,
      costVariance: 2800000,
      schedulePerformanceIndex: 1.00,
      costPerformanceIndex: 1.50,
      estimateAtCompletion: 57400000,
      estimateToComplete: 51800000,
      varianceAtCompletion: -1400000,
      costBreakdown: [
        { category: 'labor', budgeted: 20000000, actual: 2000000, committed: 3000000, forecasted: 20500000, variance: -500000, variancePercent: -2.5 },
        { category: 'materials', budgeted: 25000000, actual: 2500000, committed: 3750000, forecasted: 25600000, variance: -600000, variancePercent: -2.4 },
        { category: 'equipment', budgeted: 8000000, actual: 800000, committed: 1200000, forecasted: 8200000, variance: -200000, variancePercent: -2.5 },
        { category: 'overhead', budgeted: 2500000, actual: 250000, committed: 375000, forecasted: 2600000, variance: -100000, variancePercent: -4.0 },
        { category: 'contingency', budgeted: 500000, actual: 50000, committed: 75000, forecasted: 500000, variance: 0, variancePercent: 0 }
      ]
    }
  ]);

  const portfolioFinancials: PortfolioFinancials = {
    totalBudget: projectFinancials.reduce((sum, p) => sum + p.totalBudget, 0),
    totalActual: projectFinancials.reduce((sum, p) => sum + p.totalActual, 0),
    totalCommitted: projectFinancials.reduce((sum, p) => sum + p.totalCommitted, 0),
    totalForecasted: projectFinancials.reduce((sum, p) => sum + p.totalForecasted, 0),
    totalVariance: projectFinancials.reduce((sum, p) => sum + p.variance, 0),
    totalVariancePercent: (projectFinancials.reduce((sum, p) => sum + p.variance, 0) / projectFinancials.reduce((sum, p) => sum + p.totalBudget, 0)) * 100,
    projectsUnderBudget: projectFinancials.filter(p => p.status === 'under-budget').length,
    projectsOnBudget: projectFinancials.filter(p => p.status === 'on-budget').length,
    projectsOverBudget: projectFinancials.filter(p => p.status === 'over-budget').length,
    projectsAtRisk: projectFinancials.filter(p => p.status === 'at-risk').length,
    overallCPI: projectFinancials.reduce((sum, p) => sum + (p.earnedValue / p.totalActual), 0) / projectFinancials.length,
    overallSPI: projectFinancials.reduce((sum, p) => sum + p.schedulePerformanceIndex, 0) / projectFinancials.length
  };

  const getBudgetStatusColor = (status: BudgetStatus) => {
    switch (status) {
      case 'under-budget':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'on-budget':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'over-budget':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  };

  const filteredProjects = selectedProject === 'all'
    ? projectFinancials
    : projectFinancials.filter(p => p.projectId === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              Financial Rollup & Budget Tracking
            </h2>
            <p className="text-gray-600 mt-1">Multi-project financial consolidation with EVM analytics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'summary'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Portfolio Summary
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'detailed'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Detailed View
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'summary' && (
        <>
          {/* Portfolio Overview */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Financial Overview</h3>
            </div>

            <div className="p-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(portfolioFinancials.totalBudget)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">Actual Spend</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(portfolioFinancials.totalActual)}</p>
                  <p className="text-xs text-purple-700 mt-1">
                    {((portfolioFinancials.totalActual / portfolioFinancials.totalBudget) * 100).toFixed(1)}% utilized
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-600 font-medium">Committed</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{formatCurrency(portfolioFinancials.totalCommitted)}</p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  portfolioFinancials.totalVariance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm font-medium ${portfolioFinancials.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Variance
                  </p>
                  <p className={`text-2xl font-bold mt-1 flex items-center gap-2 ${
                    portfolioFinancials.totalVariance >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {portfolioFinancials.totalVariance >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                    {formatCurrency(Math.abs(portfolioFinancials.totalVariance))}
                  </p>
                  <p className={`text-xs mt-1 ${portfolioFinancials.totalVariance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {portfolioFinancials.totalVariancePercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* EVM Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Cost Performance Index (CPI)</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">{portfolioFinancials.overallCPI.toFixed(2)}</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {portfolioFinancials.overallCPI >= 1.0 ? 'Under budget' : 'Over budget'}
                      </p>
                    </div>
                    <Target className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Schedule Performance Index (SPI)</p>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{portfolioFinancials.overallSPI.toFixed(2)}</p>
                      <p className="text-xs text-purple-700 mt-1">
                        {portfolioFinancials.overallSPI >= 1.0 ? 'Ahead of schedule' : 'Behind schedule'}
                      </p>
                    </div>
                    <Calendar className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Project Status Distribution */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Under Budget</p>
                  <p className="text-2xl font-bold text-green-900">{portfolioFinancials.projectsUnderBudget}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">On Budget</p>
                  <p className="text-2xl font-bold text-blue-900">{portfolioFinancials.projectsOnBudget}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-600 font-medium">At Risk</p>
                  <p className="text-2xl font-bold text-yellow-900">{portfolioFinancials.projectsAtRisk}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 font-medium">Over Budget</p>
                  <p className="text-2xl font-bold text-red-900">{portfolioFinancials.projectsOverBudget}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Financial Summary */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-lg font-semibold text-gray-900">Project Financial Summary</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Committed</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Forecasted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CPI</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectFinancials.map((project) => (
                    <tr key={project.projectId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">{project.projectName}</p>
                        <p className="text-xs text-gray-600">{project.projectId}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(project.totalBudget)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(project.totalActual)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(project.totalCommitted)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(project.totalForecasted)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        project.variance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="flex items-center justify-end gap-1">
                          {project.variance >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {formatCurrency(Math.abs(project.variance))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-sm font-bold ${
                          project.costPerformanceIndex >= 1.0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {project.costPerformanceIndex.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBudgetStatusColor(project.status)}`}>
                          {project.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {viewMode === 'detailed' && (
        <>
          {/* Project Filter */}
          <div className="bg-white shadow-md p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Select Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Projects</option>
                {projectFinancials.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Project Financials */}
          {filteredProjects.map((project) => (
            <div key={project.projectId} className="bg-white shadow-lg border border-gray-200">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.projectName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.projectId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBudgetStatusColor(project.status)}`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* EVM Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Planned Value (PV)</p>
                    <p className="text-lg font-bold text-blue-900 mt-1">{formatCurrency(project.plannedValue)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Earned Value (EV)</p>
                    <p className="text-lg font-bold text-green-900 mt-1">{formatCurrency(project.earnedValue)}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Actual Cost (AC)</p>
                    <p className="text-lg font-bold text-purple-900 mt-1">{formatCurrency(project.totalActual)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Estimate at Completion</p>
                    <p className="text-lg font-bold text-yellow-900 mt-1">{formatCurrency(project.estimateAtCompletion)}</p>
                  </div>
                </div>

                {/* Performance Indices */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Cost Performance Index</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{project.costPerformanceIndex.toFixed(2)}</p>
                        <p className="text-xs text-gray-600 mt-1">Cost Variance: {formatCurrency(Math.abs(project.costVariance))}</p>
                      </div>
                      <BarChart3 className={`h-10 w-10 ${project.costPerformanceIndex >= 1.0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Schedule Performance Index</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{project.schedulePerformanceIndex.toFixed(2)}</p>
                        <p className="text-xs text-gray-600 mt-1">Schedule Variance: {formatCurrency(Math.abs(project.scheduleVariance))}</p>
                      </div>
                      <Calendar className={`h-10 w-10 ${project.schedulePerformanceIndex >= 1.0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-gray-600" />
                    Cost Breakdown by Category
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budgeted</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Committed</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Forecasted</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Var</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {project.costBreakdown.map((cost) => (
                          <tr key={cost.category} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-medium text-gray-900 capitalize">{cost.category}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                              {formatCurrency(cost.budgeted)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                              {formatCurrency(cost.actual)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                              {formatCurrency(cost.committed)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                              {formatCurrency(cost.forecasted)}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-right text-sm font-medium ${
                              cost.variance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(Math.abs(cost.variance))}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span className={`text-sm font-bold ${
                                cost.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {cost.variancePercent.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Alert if over budget */}
                {project.status === 'over-budget' && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Budget Overrun Alert</p>
                      <p className="text-sm text-red-700 mt-1">
                        This project is forecasted to exceed budget by {formatCurrency(Math.abs(project.variance))} ({Math.abs(project.variancePercent).toFixed(1)}%).
                        Immediate corrective action required.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
