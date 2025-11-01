'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Edit,
  Trash2,
  FileText,
  Download,
  Upload,
  History,
  PieChart,
  Target,
  Bell,
  Lock,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  AddBudgetItemModal,
  EditBudgetItemModal,
  RecordActualCostModal,
  VarianceAnalysisModal,
  BudgetForecastModal,
  CostBreakdownModal,
  BudgetAllocationModal,
  BudgetHistoryModal,
  BudgetAlertSettingsModal,
  BudgetApprovalModal,
  BudgetBaselineModal,
  BudgetTemplateModal,
  ExportBudgetModal,
  ImportBudgetModal,
  BudgetComparisonModal,
} from '@/components/project-management/BudgetModals';

interface BudgetItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  status: 'Under Budget' | 'On Budget' | 'Over Budget';
}

const mockBudgetItems: BudgetItem[] = [
  {
    id: '1',
    category: 'Equipment',
    subcategory: 'Cooking Equipment',
    description: 'Gas ranges, ovens, fryers',
    estimatedCost: 2800000,
    actualCost: 2775000,
    variance: 25000,
    variancePercent: 0.89,
    status: 'Under Budget',
  },
  {
    id: '2',
    category: 'Equipment',
    subcategory: 'Refrigeration',
    description: 'Walk-in coolers, freezers',
    estimatedCost: 2200000,
    actualCost: 2150000,
    variance: 50000,
    variancePercent: 2.27,
    status: 'Under Budget',
  },
  {
    id: '3',
    category: 'Equipment',
    subcategory: 'HVAC & Exhaust',
    description: 'Exhaust hoods, ventilation',
    estimatedCost: 800000,
    actualCost: 875000,
    variance: -75000,
    variancePercent: -9.38,
    status: 'Over Budget',
  },
  {
    id: '4',
    category: 'Civil Work',
    subcategory: 'Floor Preparation',
    description: 'Flooring, waterproofing',
    estimatedCost: 300000,
    actualCost: 320000,
    variance: -20000,
    variancePercent: -6.67,
    status: 'Over Budget',
  },
  {
    id: '5',
    category: 'Civil Work',
    subcategory: 'Plumbing',
    description: 'Pipes, drainage, fixtures',
    estimatedCost: 250000,
    actualCost: 270000,
    variance: -20000,
    variancePercent: -8.0,
    status: 'Over Budget',
  },
  {
    id: '6',
    category: 'Civil Work',
    subcategory: 'Electrical',
    description: 'Wiring, panels, lighting',
    estimatedCost: 250000,
    actualCost: 260000,
    variance: -10000,
    variancePercent: -4.0,
    status: 'Over Budget',
  },
  {
    id: '7',
    category: 'Labor',
    subcategory: 'Installation',
    description: 'Installation crew wages',
    estimatedCost: 600000,
    actualCost: 420000,
    variance: 180000,
    variancePercent: 30.0,
    status: 'Under Budget',
  },
  {
    id: '8',
    category: 'Labor',
    subcategory: 'Supervision',
    description: 'Project manager, supervisors',
    estimatedCost: 400000,
    actualCost: 280000,
    variance: 120000,
    variancePercent: 30.0,
    status: 'Under Budget',
  },
  {
    id: '9',
    category: 'Testing & QC',
    subcategory: 'Quality Inspection',
    description: 'QC testing, certifications',
    estimatedCost: 200000,
    actualCost: 0,
    variance: 200000,
    variancePercent: 100.0,
    status: 'Under Budget',
  },
  {
    id: '10',
    category: 'Commissioning',
    subcategory: 'Testing & Training',
    description: 'Final testing, staff training',
    estimatedCost: 300000,
    actualCost: 0,
    variance: 300000,
    variancePercent: 100.0,
    status: 'Under Budget',
  },
  {
    id: '11',
    category: 'Contingency',
    subcategory: 'Buffer',
    description: 'Contingency reserve',
    estimatedCost: 400000,
    actualCost: 50000,
    variance: 350000,
    variancePercent: 87.5,
    status: 'Under Budget',
  },
];

export default function BudgetPlanningPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(mockBudgetItems);
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal states
  const [showEditItem, setShowEditItem] = useState(false);
  const [showRecordCost, setShowRecordCost] = useState(false);
  const [showVarianceAnalysis, setShowVarianceAnalysis] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showBaseline, setShowBaseline] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);

  // Calculate totals
  const estimatedCost = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const actualCost = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
  const variance = estimatedCost - actualCost;
  const variancePercent = (variance / estimatedCost) * 100;
  
  const totals = {
    estimatedCost,
    actualCost,
    variance,
    variancePercent,
  };

  // Group by category
  const categories = Array.from(new Set(budgetItems.map(item => item.category)));
  const categorySummary = categories.map(category => {
    const categoryItems = budgetItems.filter(item => item.category === category);
    const estimated = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    const actual = categoryItems.reduce((sum, item) => sum + item.actualCost, 0);
    const variance = estimated - actual;
    return {
      category,
      estimated,
      actual,
      variance,
      variancePercent: (variance / estimated) * 100,
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Budget': return 'bg-green-100 text-green-700';
      case 'On Budget': return 'bg-blue-100 text-blue-700';
      case 'Over Budget': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Modal handlers
  const handleAddItem = (item: any) => {
    console.log('Adding budget item:', item);
    setShowAddModal(false);
  };

  const handleEditItem = (item: any) => {
    console.log('Editing budget item:', item);
    setShowEditItem(false);
    setSelectedItem(null);
  };

  const handleRecordCost = (cost: any) => {
    console.log('Recording actual cost:', cost);
    setShowRecordCost(false);
    setSelectedItem(null);
  };

  const handleAllocation = (allocation: any) => {
    console.log('Applying budget allocation:', allocation);
    setShowAllocation(false);
  };

  const handleAlertSettings = (settings: any) => {
    console.log('Saving alert settings:', settings);
    setShowAlertSettings(false);
  };

  const handleApproval = (approval: any) => {
    console.log('Submitting for approval:', approval);
    setShowApproval(false);
  };

  const handleBaseline = (baseline: any) => {
    console.log('Setting baseline:', baseline);
    setShowBaseline(false);
  };

  const handleTemplate = (template: any) => {
    console.log('Applying template:', template);
    setShowTemplate(false);
  };

  const handleExport = (format: string) => {
    console.log('Exporting budget:', format);
    setShowExport(false);
  };

  const handleImport = (file: File) => {
    console.log('Importing budget:', file);
    setShowImport(false);
  };

  const openEditModal = (item: BudgetItem) => {
    setSelectedItem(item);
    setShowEditItem(true);
  };

  const openRecordCostModal = (item: BudgetItem) => {
    setSelectedItem(item);
    setShowRecordCost(true);
  };

  const openVarianceModal = (item: BudgetItem) => {
    setSelectedItem(item);
    setShowVarianceAnalysis(true);
  };

  const openHistoryModal = (item: BudgetItem) => {
    setSelectedItem(item);
    setShowHistory(true);
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplate(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Templates
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Import
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForecast(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Forecast
            </button>
            <button
              onClick={() => setShowCostBreakdown(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PieChart className="w-5 h-5" />
              Breakdown
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Compare
            </button>
            <button
              onClick={() => setShowAllocation(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Target className="w-5 h-5" />
              Allocate
            </button>
            <button
              onClick={() => setShowAlertSettings(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              Alerts
            </button>
            <button
              onClick={() => setShowBaseline(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Target className="w-5 h-5" />
              Baseline
            </button>
            <button
              onClick={() => setShowApproval(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-5 h-5" />
              Approve
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Budget</p>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.estimatedCost)}</p>
          <p className="text-sm text-gray-500 mt-1">Estimated cost</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Actual Spent</p>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(totals.actualCost)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((totals.actualCost / totals.estimatedCost) * 100)}% of budget
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Variance</p>
            {totals.variance >= 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${totals.variance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {formatCurrency(Math.abs(totals.variance))}
          </p>
          <p className={`text-sm mt-1 ${totals.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totals.variance >= 0 ? 'Under' : 'Over'} budget ({Math.abs(totals.variancePercent).toFixed(1)}%)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Remaining</p>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">
            {formatCurrency(totals.estimatedCost - totals.actualCost)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Available to spend</p>
        </div>
      </div>

      {/* Category Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Budget by Category</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {categorySummary.map((cat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{cat.category}</h3>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(cat.actual)} / {formatCurrency(cat.estimated)}
                    </p>
                    <p className={`text-xs ${cat.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cat.variance >= 0 ? '↓' : '↑'} {formatCurrency(Math.abs(cat.variance))} ({Math.abs(cat.variancePercent).toFixed(1)}%)
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      cat.actual > cat.estimated ? 'bg-red-500' :
                      cat.actual > cat.estimated * 0.9 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((cat.actual / cat.estimated) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Budget Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Budget Line Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.category}</p>
                      <p className="text-sm text-gray-500">{item.subcategory}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{item.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(item.estimatedCost)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(item.actualCost)}</p>
                    <p className="text-xs text-gray-500">
                      {item.estimatedCost > 0 ? Math.round((item.actualCost / item.estimatedCost) * 100) : 0}% spent
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {item.variance >= 0 ? (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${item.variance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                          {formatCurrency(Math.abs(item.variance))}
                        </p>
                        <p className={`text-xs ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(item.variancePercent).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openRecordCostModal(item)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Record Cost"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openVarianceModal(item)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Variance Analysis"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openHistoryModal(item)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="px-6 py-4" colSpan={2}>
                  <p className="text-sm font-bold text-gray-900">TOTAL</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(totals.estimatedCost)}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(totals.actualCost)}</p>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-sm font-bold ${totals.variance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {formatCurrency(Math.abs(totals.variance))}
                  </p>
                </td>
                <td className="px-6 py-4" colSpan={2}>
                  <p className={`text-sm font-bold ${totals.variance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {totals.variance >= 0 ? 'Under Budget' : 'Over Budget'}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Utilization Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Utilization</h2>
        <div className="space-y-4">
          {categorySummary.map((cat, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                <span className="text-sm text-gray-600">
                  {Math.round((cat.actual / cat.estimated) * 100)}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className={`h-8 rounded-full flex items-center justify-end pr-2 ${
                      cat.actual > cat.estimated ? 'bg-red-500' :
                      cat.actual > cat.estimated * 0.9 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((cat.actual / cat.estimated) * 100, 100)}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(cat.actual)}
                    </span>
                  </div>
                </div>
                <div className="absolute top-1/2 transform -translate-y-1/2 right-2 text-xs text-gray-600">
                  of {formatCurrency(cat.estimated)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddBudgetItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      {selectedItem && (
        <>
          <EditBudgetItemModal
            isOpen={showEditItem}
            onClose={() => {
              setShowEditItem(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onSave={handleEditItem}
          />

          <RecordActualCostModal
            isOpen={showRecordCost}
            onClose={() => {
              setShowRecordCost(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onRecord={handleRecordCost}
          />

          <VarianceAnalysisModal
            isOpen={showVarianceAnalysis}
            onClose={() => {
              setShowVarianceAnalysis(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
          />

          <BudgetHistoryModal
            isOpen={showHistory}
            onClose={() => {
              setShowHistory(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
          />
        </>
      )}

      <BudgetForecastModal
        isOpen={showForecast}
        onClose={() => setShowForecast(false)}
        budgetItems={budgetItems}
      />

      <CostBreakdownModal
        isOpen={showCostBreakdown}
        onClose={() => setShowCostBreakdown(false)}
        budgetItems={budgetItems}
      />

      <BudgetAllocationModal
        isOpen={showAllocation}
        onClose={() => setShowAllocation(false)}
        onAllocate={handleAllocation}
      />

      <BudgetAlertSettingsModal
        isOpen={showAlertSettings}
        onClose={() => setShowAlertSettings(false)}
        onSave={handleAlertSettings}
      />

      <BudgetApprovalModal
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        onSubmit={handleApproval}
      />

      <BudgetBaselineModal
        isOpen={showBaseline}
        onClose={() => setShowBaseline(false)}
        onSave={handleBaseline}
      />

      <BudgetTemplateModal
        isOpen={showTemplate}
        onClose={() => setShowTemplate(false)}
        onApply={handleTemplate}
      />

      <ExportBudgetModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        onExport={handleExport}
      />

      <ImportBudgetModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <BudgetComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        budgetItems={budgetItems}
      />
      </div>
    </div>
  );
}
