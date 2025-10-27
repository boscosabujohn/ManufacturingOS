'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Search, Filter, PlusCircle, Download, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Package, Users, Clock, Wrench } from 'lucide-react';

interface BudgetItem {
  id: string;
  projectCode: string;
  projectName: string;
  category: 'labor' | 'materials' | 'equipment' | 'subcontractor' | 'overhead' | 'contingency';
  phase: string;
  workPackage: string;
  budgetAmount: number;
  committedAmount: number;
  actualSpent: number;
  forecastToComplete: number;
  variance: number;
  variancePercent: number;
  status: 'on-budget' | 'over-budget' | 'under-budget' | 'at-risk';
  startDate: string;
  endDate: string;
  approvedBy: string;
  approvedDate: string;
  lastUpdated: string;
  notes?: string;
}

// Mock data for budget items
const mockBudgetData: BudgetItem[] = [
  {
    id: 'BUDG-001',
    projectCode: 'PROJ-2025-001',
    projectName: 'Manufacturing Plant Expansion',
    category: 'labor',
    phase: 'Phase 1 - Foundation',
    workPackage: 'WP-101 Site Preparation',
    budgetAmount: 2500000,
    committedAmount: 2100000,
    actualSpent: 1850000,
    forecastToComplete: 400000,
    variance: -250000,
    variancePercent: -10,
    status: 'over-budget',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    approvedBy: 'Rajesh Kumar',
    approvedDate: '2025-03-15',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-002',
    projectCode: 'PROJ-2025-001',
    projectName: 'Manufacturing Plant Expansion',
    category: 'materials',
    phase: 'Phase 1 - Foundation',
    workPackage: 'WP-102 Concrete Works',
    budgetAmount: 3500000,
    committedAmount: 2800000,
    actualSpent: 2600000,
    forecastToComplete: 750000,
    variance: 150000,
    variancePercent: 4.3,
    status: 'on-budget',
    startDate: '2025-04-15',
    endDate: '2025-07-15',
    approvedBy: 'Rajesh Kumar',
    approvedDate: '2025-03-15',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-003',
    projectCode: 'PROJ-2025-001',
    projectName: 'Manufacturing Plant Expansion',
    category: 'equipment',
    phase: 'Phase 2 - Structure',
    workPackage: 'WP-201 Steel Fabrication',
    budgetAmount: 4200000,
    committedAmount: 3800000,
    actualSpent: 3200000,
    forecastToComplete: 850000,
    variance: 150000,
    variancePercent: 3.6,
    status: 'on-budget',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    approvedBy: 'Priya Sharma',
    approvedDate: '2025-06-10',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-004',
    projectCode: 'PROJ-2025-002',
    projectName: 'ERP System Implementation',
    category: 'subcontractor',
    phase: 'Phase 1 - Analysis',
    workPackage: 'WP-301 Requirements Gathering',
    budgetAmount: 1200000,
    committedAmount: 1100000,
    actualSpent: 950000,
    forecastToComplete: 200000,
    variance: 50000,
    variancePercent: 4.2,
    status: 'on-budget',
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    approvedBy: 'Amit Patel',
    approvedDate: '2025-04-20',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-005',
    projectCode: 'PROJ-2025-002',
    projectName: 'ERP System Implementation',
    category: 'labor',
    phase: 'Phase 2 - Development',
    workPackage: 'WP-302 Custom Module Development',
    budgetAmount: 2800000,
    committedAmount: 2500000,
    actualSpent: 2100000,
    forecastToComplete: 800000,
    variance: -100000,
    variancePercent: -3.6,
    status: 'at-risk',
    startDate: '2025-07-01',
    endDate: '2025-10-31',
    approvedBy: 'Amit Patel',
    approvedDate: '2025-06-15',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-006',
    projectCode: 'PROJ-2025-003',
    projectName: 'Solar Power Installation',
    category: 'equipment',
    phase: 'Phase 1 - Procurement',
    workPackage: 'WP-401 Solar Panels',
    budgetAmount: 5500000,
    committedAmount: 5200000,
    actualSpent: 4800000,
    forecastToComplete: 600000,
    variance: 100000,
    variancePercent: 1.8,
    status: 'under-budget',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    approvedBy: 'Sunita Reddy',
    approvedDate: '2025-05-15',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-007',
    projectCode: 'PROJ-2025-003',
    projectName: 'Solar Power Installation',
    category: 'labor',
    phase: 'Phase 2 - Installation',
    workPackage: 'WP-402 Panel Mounting',
    budgetAmount: 1800000,
    committedAmount: 1600000,
    actualSpent: 1350000,
    forecastToComplete: 400000,
    variance: 50000,
    variancePercent: 2.8,
    status: 'on-budget',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    approvedBy: 'Sunita Reddy',
    approvedDate: '2025-08-10',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-008',
    projectCode: 'PROJ-2025-004',
    projectName: 'Warehouse Automation',
    category: 'equipment',
    phase: 'Phase 1 - Equipment',
    workPackage: 'WP-501 AGV Systems',
    budgetAmount: 6200000,
    committedAmount: 5800000,
    actualSpent: 5100000,
    forecastToComplete: 1200000,
    variance: -100000,
    variancePercent: -1.6,
    status: 'at-risk',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    approvedBy: 'Vikram Singh',
    approvedDate: '2025-07-15',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-009',
    projectCode: 'PROJ-2025-004',
    projectName: 'Warehouse Automation',
    category: 'subcontractor',
    phase: 'Phase 2 - Integration',
    workPackage: 'WP-502 WMS Integration',
    budgetAmount: 1500000,
    committedAmount: 1400000,
    actualSpent: 1150000,
    forecastToComplete: 300000,
    variance: 50000,
    variancePercent: 3.3,
    status: 'on-budget',
    startDate: '2025-10-01',
    endDate: '2026-01-31',
    approvedBy: 'Vikram Singh',
    approvedDate: '2025-09-10',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-010',
    projectCode: 'PROJ-2025-005',
    projectName: 'Quality Lab Setup',
    category: 'materials',
    phase: 'Phase 1 - Construction',
    workPackage: 'WP-601 Lab Infrastructure',
    budgetAmount: 2200000,
    committedAmount: 2000000,
    actualSpent: 1750000,
    forecastToComplete: 500000,
    variance: -50000,
    variancePercent: -2.3,
    status: 'at-risk',
    startDate: '2025-07-01',
    endDate: '2025-10-31',
    approvedBy: 'Meera Iyer',
    approvedDate: '2025-06-20',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-011',
    projectCode: 'PROJ-2025-005',
    projectName: 'Quality Lab Setup',
    category: 'equipment',
    phase: 'Phase 2 - Equipment',
    workPackage: 'WP-602 Testing Instruments',
    budgetAmount: 3800000,
    committedAmount: 3500000,
    actualSpent: 3100000,
    forecastToComplete: 600000,
    variance: 100000,
    variancePercent: 2.6,
    status: 'on-budget',
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    approvedBy: 'Meera Iyer',
    approvedDate: '2025-10-05',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-012',
    projectCode: 'PROJ-2025-001',
    projectName: 'Manufacturing Plant Expansion',
    category: 'overhead',
    phase: 'All Phases',
    workPackage: 'WP-901 Project Management',
    budgetAmount: 800000,
    committedAmount: 700000,
    actualSpent: 620000,
    forecastToComplete: 120000,
    variance: 60000,
    variancePercent: 7.5,
    status: 'under-budget',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    approvedBy: 'Rajesh Kumar',
    approvedDate: '2025-03-15',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'BUDG-013',
    projectCode: 'PROJ-2025-001',
    projectName: 'Manufacturing Plant Expansion',
    category: 'contingency',
    phase: 'All Phases',
    workPackage: 'WP-902 Risk Reserve',
    budgetAmount: 1200000,
    committedAmount: 300000,
    actualSpent: 180000,
    forecastToComplete: 200000,
    variance: 820000,
    variancePercent: 68.3,
    status: 'under-budget',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    approvedBy: 'Rajesh Kumar',
    approvedDate: '2025-03-15',
    lastUpdated: '2025-10-20'
  }
];

export default function ProjectBudgetPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBudget = mockBudgetData.reduce((sum, item) => sum + item.budgetAmount, 0);
    const totalCommitted = mockBudgetData.reduce((sum, item) => sum + item.committedAmount, 0);
    const totalSpent = mockBudgetData.reduce((sum, item) => sum + item.actualSpent, 0);
    const totalForecast = mockBudgetData.reduce((sum, item) => sum + item.forecastToComplete, 0);
    const totalVariance = mockBudgetData.reduce((sum, item) => sum + item.variance, 0);
    const available = totalBudget - totalCommitted;
    const utilizationPercent = (totalCommitted / totalBudget) * 100;
    const estimateAtCompletion = totalSpent + totalForecast;
    const variancePercent = (totalVariance / totalBudget) * 100;

    const onBudgetCount = mockBudgetData.filter(item => item.status === 'on-budget').length;
    const overBudgetCount = mockBudgetData.filter(item => item.status === 'over-budget').length;
    const atRiskCount = mockBudgetData.filter(item => item.status === 'at-risk').length;

    return {
      totalBudget,
      totalCommitted,
      totalSpent,
      totalForecast,
      totalVariance,
      available,
      utilizationPercent,
      estimateAtCompletion,
      variancePercent,
      onBudgetCount,
      overBudgetCount,
      atRiskCount
    };
  }, []);

  // Get unique projects
  const projects = useMemo(() => {
    const projectSet = new Set(mockBudgetData.map(item => item.projectName));
    return Array.from(projectSet).sort();
  }, []);

  // Filter budget items
  const filteredBudgetItems = useMemo(() => {
    return mockBudgetData.filter(item => {
      const matchesSearch =
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workPackage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesProject = selectedProject === 'all' || item.projectName === selectedProject;

      return matchesSearch && matchesCategory && matchesStatus && matchesProject;
    });
  }, [searchTerm, selectedCategory, selectedStatus, selectedProject]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      'labor': <Users className="h-4 w-4" />,
      'materials': <Package className="h-4 w-4" />,
      'equipment': <Wrench className="h-4 w-4" />,
      'subcontractor': <Users className="h-4 w-4" />,
      'overhead': <DollarSign className="h-4 w-4" />,
      'contingency': <AlertCircle className="h-4 w-4" />
    };
    return icons[category as keyof typeof icons] || <DollarSign className="h-4 w-4" />;
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      'labor': 'bg-blue-100 text-blue-800',
      'materials': 'bg-green-100 text-green-800',
      'equipment': 'bg-purple-100 text-purple-800',
      'subcontractor': 'bg-orange-100 text-orange-800',
      'overhead': 'bg-gray-100 text-gray-800',
      'contingency': 'bg-yellow-100 text-yellow-800'
    };
    return badges[category as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'on-budget': 'bg-green-100 text-green-800',
      'over-budget': 'bg-red-100 text-red-800',
      'under-budget': 'bg-blue-100 text-blue-800',
      'at-risk': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'on-budget') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'over-budget') return <TrendingDown className="h-4 w-4 text-red-600" />;
    if (status === 'under-budget') return <TrendingUp className="h-4 w-4 text-blue-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-teal-600" />
          Project Budget Management
        </h1>
        <p className="text-gray-600 mt-2">Budget planning, allocation, and variance tracking by project and work package • FY 2025-26</p>
      </div>

      {/* Summary Cards - 6 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-700 text-sm font-medium">Total Budget</p>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">₹{(stats.totalBudget / 10000000).toFixed(2)}Cr</p>
          <p className="text-xs text-blue-600 mt-1">{mockBudgetData.length} items</p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-teal-700 text-sm font-medium">Committed</p>
            <Package className="h-5 w-5 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-900">₹{(stats.totalCommitted / 10000000).toFixed(2)}Cr</p>
          <p className="text-xs text-teal-600 mt-1">{stats.utilizationPercent.toFixed(1)}% utilized</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-700 text-sm font-medium">Actual Spent</p>
            <TrendingDown className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">₹{(stats.totalSpent / 10000000).toFixed(2)}Cr</p>
          <p className="text-xs text-purple-600 mt-1">{((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of budget</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-700 text-sm font-medium">Available</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">₹{(stats.available / 100000).toFixed(0)}L</p>
          <p className="text-xs text-green-600 mt-1">Unallocated funds</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-700 text-sm font-medium">Forecast EAC</p>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">₹{(stats.estimateAtCompletion / 10000000).toFixed(2)}Cr</p>
          <p className="text-xs text-orange-600 mt-1">Est. at completion</p>
        </div>

        <div className={`rounded-lg p-4 border ${
          stats.totalVariance >= 0
            ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${stats.totalVariance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              Net Variance
            </p>
            {stats.totalVariance >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${stats.totalVariance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {stats.totalVariance >= 0 ? '+' : ''}₹{(Math.abs(stats.totalVariance) / 100000).toFixed(0)}L
          </p>
          <p className={`text-xs mt-1 ${stats.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.variancePercent.toFixed(1)}% variance
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search project, WP, phase..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="labor">Labor</option>
              <option value="materials">Materials</option>
              <option value="equipment">Equipment</option>
              <option value="subcontractor">Subcontractor</option>
              <option value="overhead">Overhead</option>
              <option value="contingency">Contingency</option>
            </select>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="on-budget">On Budget</option>
              <option value="over-budget">Over Budget</option>
              <option value="under-budget">Under Budget</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budget Items List */}
      <div className="space-y-4 mb-6">
        {filteredBudgetItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.projectName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                      {item.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-medium text-teal-600">{item.workPackage}</span>
                    <span>•</span>
                    <span>{item.phase}</span>
                    <span>•</span>
                    <span>{item.projectCode}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {item.variance >= 0 ? (
                    <span className="text-sm font-medium text-green-700">
                      +₹{(item.variance / 100000).toFixed(1)}L ({item.variancePercent.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-700">
                      -₹{(Math.abs(item.variance) / 100000).toFixed(1)}L ({Math.abs(item.variancePercent).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1">Budget Amount</p>
                <p className="text-lg font-bold text-blue-900">
                  ₹{(item.budgetAmount / 100000).toFixed(2)}L
                </p>
                <p className="text-xs text-blue-700 mt-1">Approved budget</p>
              </div>

              <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                <p className="text-xs text-teal-600 font-medium mb-1">Committed</p>
                <p className="text-lg font-bold text-teal-900">
                  ₹{(item.committedAmount / 100000).toFixed(2)}L
                </p>
                <p className="text-xs text-teal-700 mt-1">
                  {((item.committedAmount / item.budgetAmount) * 100).toFixed(0)}% committed
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <p className="text-xs text-purple-600 font-medium mb-1">Actual Spent</p>
                <p className="text-lg font-bold text-purple-900">
                  ₹{(item.actualSpent / 100000).toFixed(2)}L
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {((item.actualSpent / item.budgetAmount) * 100).toFixed(0)}% spent
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-orange-600 font-medium mb-1">Forecast to Complete</p>
                <p className="text-lg font-bold text-orange-900">
                  ₹{(item.forecastToComplete / 100000).toFixed(2)}L
                </p>
                <p className="text-xs text-orange-700 mt-1">Remaining cost</p>
              </div>

              <div className={`rounded-lg p-3 border ${
                item.variance >= 0
                  ? 'bg-green-50 border-green-100'
                  : 'bg-red-50 border-red-100'
              }`}>
                <p className={`text-xs font-medium mb-1 ${
                  item.variance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  EAC (Est. at Completion)
                </p>
                <p className={`text-lg font-bold ${
                  item.variance >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  ₹{((item.actualSpent + item.forecastToComplete) / 100000).toFixed(2)}L
                </p>
                <p className={`text-xs mt-1 ${
                  item.variance >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  Variance: {item.variance >= 0 ? '+' : ''}₹{(Math.abs(item.variance) / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">
                  {new Date(item.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(item.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Approved By:</span>
                <span className="font-medium text-gray-900">{item.approvedBy} • {new Date(item.approvedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {item.notes && (
              <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-600">{item.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guidelines Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-teal-600" />
          Budget Management Guidelines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Budget Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Labor:</strong> Direct labor costs including project team salaries, wages, and benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Materials:</strong> Raw materials, supplies, and consumables required for project execution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Equipment:</strong> Machinery, tools, and equipment purchases or rentals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Subcontractor:</strong> Third-party services and contractor costs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 font-bold">•</span>
                <span><strong>Overhead:</strong> Indirect costs including project management, admin, utilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Contingency:</strong> Risk reserve for unforeseen events and changes (typically 10-20% of budget)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Budget Status Indicators</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>On Budget:</strong> Within ±5% variance of approved budget, project on track</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Over Budget:</strong> Exceeding approved budget by {'>'}5%, requires corrective action</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Under Budget:</strong> Spending less than approved budget by {'>'}5%, may indicate scope reduction or savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>At Risk:</strong> Trending toward over-budget, requires monitoring and potential intervention</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Key Budget Metrics</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span><strong>Budget Amount:</strong> Original approved budget for the work package</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span><strong>Committed:</strong> Budget allocated to purchase orders, contracts, and commitments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span><strong>Actual Spent:</strong> Funds actually expended to date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span><strong>Forecast to Complete:</strong> Estimated remaining cost to finish the work</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span><strong>EAC (Estimate at Completion):</strong> Actual Spent + Forecast to Complete</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span><strong>Variance:</strong> Budget Amount - EAC (positive = under budget, negative = over budget)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Regular Reviews:</strong> Review budget vs. actuals weekly, update forecasts monthly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Early Warning:</strong> Flag variances {'>'}5% immediately for corrective action</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Change Control:</strong> Document all budget changes through formal change request process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Contingency Management:</strong> Release contingency only after formal approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Cost Tracking:</strong> Track costs at work package level for granular visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Forecasting:</strong> Update forecasts based on actual performance trends and remaining work</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
