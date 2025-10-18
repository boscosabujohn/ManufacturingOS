'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, DollarSign, Activity, AlertCircle,
  Download, Filter, RefreshCw, Plus, Minus, Eye, Settings, Bell,
  ArrowUpRight, ArrowDownRight, PieChart, BarChart3, LineChart,
  Wallet, CreditCard, Building, Target, Zap, Users, FileText,
  CheckCircle, Clock, Info, Search, Edit, Trash2, MoreHorizontal
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, AreaChart, BarChart, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, Bar, Line, Cell, PieChart as RechartsPieChart
} from 'recharts';

interface CashFlowEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'inflow' | 'outflow';
  amount: number;
  status: 'actual' | 'projected' | 'pending';
  probability: number;
  source?: string;
  reference?: string;
}

interface CashFlowForecast {
  period: string;
  beginningBalance: number;
  totalInflows: number;
  totalOutflows: number;
  netCashFlow: number;
  endingBalance: number;
  confidence: number;
}

export default function CashFlowManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState('3-months');
  const [selectedView, setSelectedView] = useState('forecast');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);

  // Mock data for cash flow management
  const currentCashPosition = {
    totalCash: 12500000,
    availableCash: 11200000,
    restrictedCash: 1300000,
    shortTermInvestments: 2800000,
    creditLineAvailable: 5000000,
    creditLineUsed: 1200000
  };

  const cashFlowForecast: CashFlowForecast[] = [
    {
      period: 'Week 1',
      beginningBalance: 12500000,
      totalInflows: 3200000,
      totalOutflows: 2800000,
      netCashFlow: 400000,
      endingBalance: 12900000,
      confidence: 95
    },
    {
      period: 'Week 2',
      beginningBalance: 12900000,
      totalInflows: 2800000,
      totalOutflows: 3200000,
      netCashFlow: -400000,
      endingBalance: 12500000,
      confidence: 92
    },
    {
      period: 'Week 3',
      beginningBalance: 12500000,
      totalInflows: 4100000,
      totalOutflows: 2900000,
      netCashFlow: 1200000,
      endingBalance: 13700000,
      confidence: 88
    },
    {
      period: 'Week 4',
      beginningBalance: 13700000,
      totalInflows: 3500000,
      totalOutflows: 3800000,
      netCashFlow: -300000,
      endingBalance: 13400000,
      confidence: 85
    },
    {
      period: 'Month 2',
      beginningBalance: 13400000,
      totalInflows: 15200000,
      totalOutflows: 14800000,
      netCashFlow: 400000,
      endingBalance: 13800000,
      confidence: 78
    },
    {
      period: 'Month 3',
      beginningBalance: 13800000,
      totalInflows: 16800000,
      totalOutflows: 15600000,
      netCashFlow: 1200000,
      endingBalance: 15000000,
      confidence: 72
    }
  ];

  const cashFlowEntries: CashFlowEntry[] = [
    {
      id: '1',
      date: '2024-10-21',
      description: 'Customer Payment - TechCorp Industries',
      category: 'Customer Payments',
      type: 'inflow',
      amount: 2500000,
      status: 'projected',
      probability: 95,
      source: 'AR-2024-001',
      reference: 'INV-2024-0234'
    },
    {
      id: '2',
      date: '2024-10-22',
      description: 'Payroll - October 2024',
      category: 'Payroll',
      type: 'outflow',
      amount: 1850000,
      status: 'actual',
      probability: 100,
      source: 'Payroll System'
    },
    {
      id: '3',
      date: '2024-10-23',
      description: 'Supplier Payment - Manufacturing Supplies',
      category: 'Vendor Payments',
      type: 'outflow',
      amount: 680000,
      status: 'pending',
      probability: 100,
      source: 'AP-2024-156',
      reference: 'PO-2024-0445'
    },
    {
      id: '4',
      date: '2024-10-24',
      description: 'Investment Income - Government Bonds',
      category: 'Investment Income',
      type: 'inflow',
      amount: 125000,
      status: 'projected',
      probability: 98,
      source: 'Investment Portfolio'
    },
    {
      id: '5',
      date: '2024-10-25',
      description: 'Rent Payment - Head Office',
      category: 'Operating Expenses',
      type: 'outflow',
      amount: 85000,
      status: 'actual',
      probability: 100,
      source: 'Facilities Management'
    }
  ];

  const cashFlowByCategory = [
    { name: 'Customer Payments', inflow: 18500000, outflow: 0, net: 18500000, color: '#10B981' },
    { name: 'Vendor Payments', inflow: 0, outflow: 12800000, net: -12800000, color: '#EF4444' },
    { name: 'Payroll', inflow: 0, outflow: 5600000, net: -5600000, color: '#F59E0B' },
    { name: 'Operating Expenses', inflow: 0, outflow: 3200000, net: -3200000, color: '#8B5CF6' },
    { name: 'Investment Income', inflow: 750000, outflow: 0, net: 750000, color: '#06B6D4' },
    { name: 'Loan Payments', inflow: 0, outflow: 450000, net: -450000, color: '#EC4899' }
  ];

  const scenarioAnalysis = [
    {
      scenario: 'Best Case',
      probability: 20,
      endingBalance: 16500000,
      netCashFlow: 4000000,
      assumptions: ['All receivables collected on time', '10% cost reduction', 'New contract signed']
    },
    {
      scenario: 'Most Likely',
      probability: 60,
      endingBalance: 15000000,
      netCashFlow: 2500000,
      assumptions: ['95% collection efficiency', 'Normal operating costs', 'Current growth rate']
    },
    {
      scenario: 'Worst Case',
      probability: 20,
      endingBalance: 13200000,
      netCashFlow: 700000,
      assumptions: ['30% collection delays', 'Unexpected expenses', 'Major customer lost']
    }
  ];

  const cashFlowMetrics = {
    averageDailyBalance: 12850000,
    operatingCashFlowRatio: 1.8,
    cashConversionCycle: 45,
    daysOfCashOnHand: 28,
    cashFlowToDebtRatio: 0.65,
    freeCashFlow: 3200000,
    cashFlowVariability: 12.5
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actual': return 'bg-green-100 text-green-800';
      case 'projected': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cash Flow Management</h1>
            <p className="text-gray-600">
              Advanced cash flow forecasting and liquidity management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1-month">1 Month</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="12-months">12 Months</option>
            </select>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'forecast', label: 'Forecast', icon: TrendingUp },
              { id: 'actual', label: 'Actual vs Projected', icon: BarChart3 },
              { id: 'scenarios', label: 'Scenario Analysis', icon: Target },
              { id: 'metrics', label: 'Cash Metrics', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Current Cash Position Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8 text-blue-200" />
            <ArrowUpRight className="h-6 w-6 text-blue-200" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Cash</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(currentCashPosition.totalCash)}</p>
          <p className="text-blue-200 text-sm">Available: {formatCurrency(currentCashPosition.availableCash)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-green-200" />
            <ArrowUpRight className="h-6 w-6 text-green-200" />
          </div>
          <p className="text-green-100 text-sm mb-1">Free Cash Flow</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(cashFlowMetrics.freeCashFlow)}</p>
          <p className="text-green-200 text-sm">Monthly average</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-8 w-8 text-purple-200" />
            <Info className="h-6 w-6 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Credit Available</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(currentCashPosition.creditLineAvailable - currentCashPosition.creditLineUsed)}</p>
          <p className="text-purple-200 text-sm">Of {formatCurrency(currentCashPosition.creditLineAvailable)} total</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-orange-200" />
            <Clock className="h-6 w-6 text-orange-200" />
          </div>
          <p className="text-orange-100 text-sm mb-1">Days Cash on Hand</p>
          <p className="text-3xl font-bold mb-2">{cashFlowMetrics.daysOfCashOnHand}</p>
          <p className="text-orange-200 text-sm">Based on burn rate</p>
        </div>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === 'forecast' && (
        <div className="space-y-6">
          {/* Cash Flow Forecast Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Cash Flow Forecast</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Confidence Range:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">90%+</span>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
                  <span className="text-xs">80-90%</span>
                  <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                  <span className="text-xs">&lt;80%</span>
                </div>
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cashFlowForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'confidence' ? `${value}%` : formatCurrency(Number(value)),
                      name
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="totalInflows" fill="#10B981" name="Inflows" />
                  <Bar dataKey="totalOutflows" fill="#EF4444" name="Outflows" />
                  <Line
                    type="monotone"
                    dataKey="endingBalance"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Ending Balance"
                    yAxisId="right"
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Confidence %"
                    yAxisId="right"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Forecast</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beginning Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inflows</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outflows</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Cash Flow</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ending Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cashFlowForecast.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.period}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(item.beginningBalance)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">+{formatCurrency(item.totalInflows)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">-{formatCurrency(item.totalOutflows)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.netCashFlow >= 0 ? '+' : ''}{formatCurrency(item.netCashFlow)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(item.endingBalance)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                          {formatPercentage(item.confidence)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'scenarios' && (
        <div className="space-y-6">
          {/* Scenario Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Scenario Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {scenarioAnalysis.map((scenario, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-6 ${
                    scenario.scenario === 'Most Likely'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{scenario.scenario}</h4>
                    <span className="text-sm text-gray-600">{formatPercentage(scenario.probability)} probability</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Ending Balance</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(scenario.endingBalance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Cash Flow</p>
                      <p className={`text-lg font-semibold ${scenario.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenario.netCashFlow >= 0 ? '+' : ''}{formatCurrency(scenario.netCashFlow)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Key Assumptions:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {scenario.assumptions.map((assumption, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {assumption}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Flow by Category */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Cash Flow by Category</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowByCategory} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Legend />
                    <Bar dataKey="inflow" fill="#10B981" name="Inflows" />
                    <Bar dataKey="outflow" fill="#EF4444" name="Outflows" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {cashFlowByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: category.color }}></div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${category.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.net >= 0 ? '+' : ''}{formatCurrency(category.net)}
                      </p>
                      <p className="text-xs text-gray-500">Net flow</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'metrics' && (
        <div className="space-y-6">
          {/* Cash Flow Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-blue-500" />
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Ratio</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Operating Cash Flow Ratio</p>
              <p className="text-3xl font-bold text-gray-900">{cashFlowMetrics.operatingCashFlowRatio}</p>
              <p className="text-xs text-gray-500 mt-2">Current liabilities coverage</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-green-500" />
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Days</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Cash Conversion Cycle</p>
              <p className="text-3xl font-bold text-gray-900">{cashFlowMetrics.cashConversionCycle}</p>
              <p className="text-xs text-gray-500 mt-2">Days to convert investment to cash</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Ratio</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Cash Flow to Debt</p>
              <p className="text-3xl font-bold text-gray-900">{cashFlowMetrics.cashFlowToDebtRatio}</p>
              <p className="text-xs text-gray-500 mt-2">Debt servicing capability</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">%</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Cash Flow Variability</p>
              <p className="text-3xl font-bold text-gray-900">{formatPercentage(cashFlowMetrics.cashFlowVariability)}</p>
              <p className="text-xs text-gray-500 mt-2">Monthly variance</p>
            </div>
          </div>

          {/* Cash Flow Entries */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Cash Flow Entries</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="customer-payments">Customer Payments</option>
                  <option value="vendor-payments">Vendor Payments</option>
                  <option value="payroll">Payroll</option>
                  <option value="operating-expenses">Operating Expenses</option>
                </select>
                <button className="text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cashFlowEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{entry.description}</p>
                          {entry.reference && (
                            <p className="text-xs text-gray-500">Ref: {entry.reference}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.type === 'inflow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.type === 'inflow' ? 'Inflow' : 'Outflow'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        entry.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'inflow' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatPercentage(entry.probability)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}