'use client'

import React, { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Calendar, Filter, Download, RefreshCw, Settings, Info, Plus,
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, Target, Zap,
  PieChart as PieChartIcon, BarChart3, Activity, Eye, Edit
} from 'lucide-react'

export default function BudgetTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  // Budget Overview Data
  const budgetOverview = {
    totalBudget: 5000000,
    allocated: 4500000,
    spent: 2850000,
    committed: 650000,
    available: 1000000,
    utilizationRate: 74,
    savingsAchieved: 185000,
  }

  // Department Budgets
  const departmentBudgets = [
    { name: 'Production', budget: 2000000, spent: 1450000, committed: 250000, available: 300000 },
    { name: 'R&D', budget: 800000, spent: 520000, committed: 150000, available: 130000 },
    { name: 'IT', budget: 600000, spent: 380000, committed: 100000, available: 120000 },
    { name: 'Facilities', budget: 500000, spent: 320000, committed: 80000, available: 100000 },
    { name: 'Marketing', budget: 400000, spent: 180000, committed: 70000, available: 150000 },
    { name: 'HR', budget: 200000, spent: 0, committed: 0, available: 200000 },
  ]

  // Category Budgets
  const categoryBudgets = [
    { category: 'Raw Materials', budget: 1800000, spent: 1350000, variance: -50000 },
    { category: 'Equipment', budget: 1200000, spent: 850000, variance: 350000 },
    { category: 'Services', budget: 800000, spent: 450000, variance: 350000 },
    { category: 'Software', budget: 400000, spent: 120000, variance: 280000 },
    { category: 'Office Supplies', budget: 300000, spent: 80000, variance: 220000 },
  ]

  // Monthly Spend Trend
  const monthlyTrend = [
    { month: 'Jan', budget: 416667, actual: 385000, forecast: 390000 },
    { month: 'Feb', budget: 416667, actual: 425000, forecast: 420000 },
    { month: 'Mar', budget: 416667, actual: 445000, forecast: 440000 },
    { month: 'Apr', budget: 416667, actual: 465000, forecast: 460000 },
    { month: 'May', budget: 416667, actual: 475000, forecast: 470000 },
    { month: 'Jun', budget: 416667, actual: 485000, forecast: 480000 },
    { month: 'Jul', budget: 416667, forecast: 490000 },
    { month: 'Aug', budget: 416667, forecast: 495000 },
    { month: 'Sep', budget: 416667, forecast: 500000 },
    { month: 'Oct', budget: 416667, forecast: 505000 },
    { month: 'Nov', budget: 416667, forecast: 510000 },
    { month: 'Dec', budget: 416667, forecast: 515000 },
  ]

  // Budget Alerts
  const budgetAlerts = [
    { type: 'warning', department: 'Production', message: 'Budget utilization at 85%, approaching limit', threshold: 85 },
    { type: 'danger', department: 'R&D', message: 'Budget exceeded by $20,000', threshold: 100 },
    { type: 'info', department: 'Marketing', message: 'Quarterly budget review due', threshold: 0 },
    { type: 'success', department: 'IT', message: 'Cost savings of $45,000 achieved', threshold: 0 },
  ]

  // Spend by Quarter
  const quarterlySpend = [
    { quarter: 'Q1', budget: 1250000, actual: 1255000, categories: { raw: 450000, equipment: 350000, services: 255000, other: 200000 } },
    { quarter: 'Q2', budget: 1250000, actual: 1425000, categories: { raw: 520000, equipment: 400000, services: 285000, other: 220000 } },
    { quarter: 'Q3', budget: 1250000, actual: 0, categories: { raw: 0, equipment: 0, services: 0, other: 0 } },
    { quarter: 'Q4', budget: 1250000, actual: 0, categories: { raw: 0, equipment: 0, services: 0, other: 0 } },
  ]

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 70) return 'text-green-600'
    if (percentage < 90) return 'text-amber-600'
    return 'text-red-600'
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500'
    if (percentage < 90) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Tracking & Spend Analysis</h1>
            <p className="text-gray-600 mt-1">Monitor budgets, track spending, and analyze variances</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Set Budget
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Year</option>
            <option value="last">Last Year</option>
            <option value="quarter">This Quarter</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="production">Production</option>
            <option value="rd">R&D</option>
            <option value="it">IT</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="raw">Raw Materials</option>
            <option value="equipment">Equipment</option>
            <option value="services">Services</option>
          </select>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Budget</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${(budgetOverview.totalBudget / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-600 mt-1">Annual allocation</div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }} />
            </div>
            <span className="text-xs text-gray-600">90% allocated</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Spent YTD</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${(budgetOverview.spent / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-600 mt-1">57% of budget</div>
          <div className="mt-3 flex items-center gap-1 text-green-600">
            <ArrowDown className="h-4 w-4" />
            <span className="text-xs">5% under budget</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Committed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${(budgetOverview.committed / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600 mt-1">Pending orders</div>
          <div className="mt-3 text-xs text-amber-600">Will impact available budget</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Available</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${(budgetOverview.available / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-600 mt-1">Remaining budget</div>
          <div className="mt-3 flex items-center gap-1 text-purple-600">
            <Zap className="h-4 w-4" />
            <span className="text-xs">20% available</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Spend Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Monthly Spend Trend & Forecast
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#3B82F6" name="Actual Spend" />
              <Line type="monotone" dataKey="budget" stroke="#EF4444" strokeWidth={2} name="Budget" />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600">Average Monthly</div>
              <div className="text-lg font-bold text-blue-900">$475K</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-600">Projected EOY</div>
              <div className="text-lg font-bold text-green-900">$5.7M</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-xs text-gray-600">Variance</div>
              <div className="text-lg font-bold text-amber-900">+14%</div>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Budget Alerts
          </h3>
          <div className="space-y-3">
            {budgetAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  alert.type === 'danger' ? 'bg-red-50 border-red-200' :
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                  alert.type === 'success' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === 'danger' && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                  {alert.type === 'info' && <Info className="h-5 w-5 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{alert.department}</div>
                    <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Alerts →
          </button>
        </div>
      </div>

      {/* Department Budgets */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Department Budget Status
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Budget</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Spent</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Committed</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Available</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Utilization</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentBudgets.map((dept, idx) => {
                const utilization = ((dept.spent + dept.committed) / dept.budget) * 100
                return (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{dept.name}</td>
                    <td className="text-right py-3 px-4">${(dept.budget / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-4">${(dept.spent / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-4">${(dept.committed / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-4">${(dept.available / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressBarColor(utilization)}`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                          {utilization.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      {utilization < 70 && <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />}
                      {utilization >= 70 && utilization < 90 && <AlertTriangle className="h-5 w-5 text-amber-600 mx-auto" />}
                      {utilization >= 90 && <AlertTriangle className="h-5 w-5 text-red-600 mx-auto" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-medium">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">${(budgetOverview.allocated / 1000000).toFixed(1)}M</td>
                <td className="text-right py-3 px-4">${(budgetOverview.spent / 1000000).toFixed(1)}M</td>
                <td className="text-right py-3 px-4">${(budgetOverview.committed / 1000).toFixed(0)}K</td>
                <td className="text-right py-3 px-4">${(budgetOverview.available / 1000000).toFixed(1)}M</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${budgetOverview.utilizationRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{budgetOverview.utilizationRate}%</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Category Spend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Budget vs Actual */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-green-600" />
            Category Budget Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryBudgets}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="spent"
              >
                {categoryBudgets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryBudgets.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                  <span className="text-sm">{cat.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">${(cat.spent / 1000).toFixed(0)}K</span>
                  <span className={`text-sm font-medium ${cat.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cat.variance >= 0 ? '+' : ''}{(cat.variance / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly Spend Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Quarterly Spend Pattern
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quarterlySpend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
              <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600">Q2 Spend</div>
              <div className="text-lg font-bold text-blue-900">$1.43M</div>
              <div className="text-xs text-red-600 mt-1">+14% over budget</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-600">Projected Q3</div>
              <div className="text-lg font-bold text-green-900">$1.35M</div>
              <div className="text-xs text-green-600 mt-1">+8% from Q2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Setting Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Set Department Budget</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Select Department</option>
                    {departmentBudgets.map((dept) => (
                      <option key={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                  <input
                    type="number"
                    placeholder="Enter budget amount"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Period</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Annual</option>
                    <option>Quarterly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Set Budget
                </button>
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}