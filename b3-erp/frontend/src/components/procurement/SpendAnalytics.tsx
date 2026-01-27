'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, DollarSign, Download, RefreshCw, Settings, Eye, Filter, Calendar, FileText, AlertCircle, Plus, ArrowUpDown } from 'lucide-react';

export interface CategorySpend {
  category: string;
  spend: number;
  percent: number;
  growth: number;
  supplierCount: number;
}

export interface SupplierSpend {
  supplier: string;
  spend: number;
  percent: number;
  transactions: number;
  avgOrderValue: number;
}

export interface MonthlySpend {
  month: string;
  spend: number;
  budget: number;
  variance: number;
}

const SpendAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('YTD');
  const [selectedView, setSelectedView] = useState<string>('category');


  // Handler functions (simplified)
  const handleRefresh = () => {
    console.log('Refreshing spend analytics data...');
    alert('Refreshing Spend Analytics - Updating category spend, supplier rankings, and budget variance data.');
  };

  const handleSettings = () => {
    console.log('Opening spend analytics settings...');
    alert('Spend Analytics Settings - Configure time periods, category mappings, budget thresholds, and dashboard preferences.');
  };

  const handleExport = () => {
    console.log('Exporting spend analytics report...');
    alert('Exporting Spend Analytics Report - This would generate a comprehensive Excel report with spend data and trends.');
  };

  const handleFilterPeriod = () => {
    console.log('Opening period filter...');
    alert('Select Time Period - Choose from current month, quarter, YTD, or custom date range for analysis.');
  };

  const handleViewCategoryDetails = (category: CategorySpend) => {
    console.log('Viewing category details:', category.category);
    alert(`Category Details: ${category.category} - Spend: $${(category.spend / 1000000).toFixed(2)}M, Growth: ${category.growth}%, Suppliers: ${category.supplierCount}`);
  };

  const handleViewSupplierDetails = (supplier: SupplierSpend) => {
    console.log('Viewing supplier details:', supplier.supplier);
    alert(`Supplier Details: ${supplier.supplier} - Spend: $${(supplier.spend / 1000000).toFixed(2)}M, Transactions: ${supplier.transactions}, Avg Order: $${supplier.avgOrderValue.toLocaleString()}`);
  };

  const handleComparePeriods = () => {
    alert('Period Comparison - This would show side-by-side spend comparison across different time periods.');
  };

  const handleBudgetAlert = () => {
    alert('Budget Alert Configuration - Set up spend alerts for threshold breaches and variance notifications.');
  };

  const handleDrillDownMonth = (month: MonthlySpend) => {
    console.log('Drilling down month:', month.month);
    alert(`Monthly Analysis: ${month.month} - Spend: $${(month.spend / 1000).toFixed(0)}K, Budget: $${(month.budget / 1000).toFixed(0)}K, Variance: ${month.variance}%`);
  };

  const handleGenerateReport = () => {
    alert('Generate Custom Report - Build a customized spend report with selected dimensions, metrics, and visualizations.');
  };

  const handleIdentifySavings = () => {
    alert('Spend Savings Opportunities - This would analyze spend data to identify cost optimization opportunities.');
  };

  // Mock data - Category spend
  const categorySpend: CategorySpend[] = [
    { category: 'Raw Materials', spend: 5200000, percent: 42, growth: 8.5, supplierCount: 12 },
    { category: 'Electronic Components', spend: 2450000, percent: 20, growth: -3.2, supplierCount: 8 },
    { category: 'IT Services', spend: 1800000, percent: 15, growth: 12.5, supplierCount: 5 },
    { category: 'Logistics & Transportation', spend: 1350000, percent: 11, growth: 5.8, supplierCount: 6 },
    { category: 'Packaging Materials', spend: 890000, percent: 7, growth: -1.5, supplierCount: 4 },
    { category: 'Maintenance & Repair', spend: 610000, percent: 5, growth: 15.2, supplierCount: 9 },
  ];

  // Mock data - Top suppliers
  const topSuppliers: SupplierSpend[] = [
    { supplier: 'Quality Steel Industries', spend: 3200000, percent: 26, transactions: 124, avgOrderValue: 25806 },
    { supplier: 'Acme Manufacturing Co.', spend: 2450000, percent: 20, transactions: 98, avgOrderValue: 25000 },
    { supplier: 'Global Components Ltd.', spend: 1850000, percent: 15, transactions: 156, avgOrderValue: 11859 },
    { supplier: 'Tech Solutions Inc.', spend: 1800000, percent: 15, transactions: 42, avgOrderValue: 42857 },
    { supplier: 'Precision Parts Manufacturing', spend: 1650000, percent: 13, transactions: 187, avgOrderValue: 8824 },
    { supplier: 'Others', spend: 1350000, percent: 11, transactions: 245, avgOrderValue: 5510 },
  ];

  // Mock data - Monthly spend trend
  const monthlySpend: MonthlySpend[] = [
    { month: 'Jan', spend: 980000, budget: 1000000, variance: -2 },
    { month: 'Feb', spend: 1050000, budget: 1000000, variance: 5 },
    { month: 'Mar', spend: 1120000, budget: 1100000, variance: 1.8 },
    { month: 'Apr', spend: 995000, budget: 1000000, variance: -0.5 },
    { month: 'May', spend: 1230000, budget: 1150000, variance: 7 },
    { month: 'Jun', spend: 1180000, budget: 1150000, variance: 2.6 },
    { month: 'Jul', spend: 1290000, budget: 1200000, variance: 7.5 },
    { month: 'Aug', spend: 1150000, budget: 1150000, variance: 0 },
    { month: 'Sep', spend: 1340000, budget: 1250000, variance: 7.2 },
    { month: 'Oct', spend: 1265000, budget: 1200000, variance: 5.4 },
  ];

  const totalSpend = categorySpend.reduce((sum, c) => sum + c.spend, 0);
  const totalBudget = monthlySpend.reduce((sum, m) => sum + m.budget, 0);
  const totalActualSpend = monthlySpend.reduce((sum, m) => sum + m.spend, 0);
  const overallVariance = ((totalActualSpend - totalBudget) / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Spend Analytics</h2>
              <p className="text-blue-100">Comprehensive spending analysis and insights</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleIdentifySavings}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              title="Identify Savings Opportunities"
            >
              <DollarSign className="h-4 w-4" />
              <span>Savings Opportunities</span>
            </button>
            <button
              onClick={handleGenerateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              title="Generate Custom Report"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
            <button
              onClick={handleFilterPeriod}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Filter Time Period"
            >
              <Calendar className="h-4 w-4" />
              <span>{selectedPeriod}</span>
            </button>
            <button
              onClick={handleComparePeriods}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Compare Periods"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Compare</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Analytics Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Export to Excel"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spend (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalActualSpend / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalBudget / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Variance</p>
              <p className={`text-2xl font-bold ${overallVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {overallVariance > 0 ? '+' : ''}{overallVariance.toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {categorySpend.reduce((sum, c) => sum + c.supplierCount, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Category Spend Analysis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Spend by Category</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suppliers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorySpend.map((category, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(category.spend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.percent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${category.growth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.supplierCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${category.percent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewCategoryDetails(category)}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="View Category Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Suppliers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Suppliers by Spend</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topSuppliers.map((supplier, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(supplier.spend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.percent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.transactions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${supplier.avgOrderValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${supplier.percent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewSupplierDetails(supplier)}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Supplier Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Spend Trend */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spend Trend (2025)</h3>
            </div>
            <button
              onClick={handleBudgetAlert}
              className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              title="Configure Budget Alerts"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Set Alerts</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {monthlySpend.map((month, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Actual: <span className="font-semibold">${(month.spend / 1000).toFixed(0)}K</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Budget: <span className="font-semibold">${(month.budget / 1000).toFixed(0)}K</span>
                    </span>
                    <span className={`text-sm font-bold ${month.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {month.variance > 0 ? '+' : ''}{month.variance}%
                    </span>
                    <button
                      onClick={() => handleDrillDownMonth(month)}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                      title="View Month Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </button>
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="absolute bg-blue-500 h-6 rounded-full"
                    style={{ width: `${(month.budget / 1400000) * 100}%` }}
                  ></div>
                  <div
                    className={`absolute h-6 rounded-full ${month.variance > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(month.spend / 1400000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spend Concentration Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend Concentration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Top 3 Suppliers</p>
            <p className="text-2xl font-bold text-blue-600">
              {topSuppliers.slice(0, 3).reduce((sum, s) => sum + s.percent, 0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">of total spend</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Top 3 Categories</p>
            <p className="text-2xl font-bold text-purple-600">
              {categorySpend.slice(0, 3).reduce((sum, c) => sum + c.percent, 0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">of total spend</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-green-600">
              ${(topSuppliers.reduce((sum, s) => sum + s.avgOrderValue, 0) / topSuppliers.length / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-500 mt-1">across all suppliers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendAnalytics;
