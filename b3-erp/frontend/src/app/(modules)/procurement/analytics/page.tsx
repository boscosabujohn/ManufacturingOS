'use client'

import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import {
  TrendingUp, TrendingDown, Activity, DollarSign, Package, Users, Calendar, FileText,
  Download, Filter, ChevronDown, ChevronUp, Clock, AlertTriangle, CheckCircle,
  RefreshCw, Printer, Mail, Share2, Settings, Info, ArrowUp, ArrowDown
} from 'lucide-react'

export default function ProcurementAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [expandedSections, setExpandedSections] = useState<string[]>(['spend', 'performance', 'savings'])
  const [refreshing, setRefreshing] = useState(false)

  // Spend Trend Data
  const spendTrendData = [
    { month: 'Jan', actual: 245000, budget: 250000, forecast: 248000, lastYear: 235000 },
    { month: 'Feb', actual: 235000, budget: 250000, forecast: 240000, lastYear: 225000 },
    { month: 'Mar', actual: 265000, budget: 270000, forecast: 268000, lastYear: 255000 },
    { month: 'Apr', actual: 275000, budget: 280000, forecast: 278000, lastYear: 265000 },
    { month: 'May', actual: 285000, budget: 290000, forecast: 288000, lastYear: 275000 },
    { month: 'Jun', actual: 295000, budget: 300000, forecast: 298000, lastYear: 285000 },
  ]

  // Category Spend Distribution
  const categorySpendData = [
    { category: 'Raw Materials', value: 450000, percentage: 35, growth: 12 },
    { category: 'Equipment', value: 320000, percentage: 25, growth: -5 },
    { category: 'Services', value: 256000, percentage: 20, growth: 8 },
    { category: 'IT & Software', value: 128000, percentage: 10, growth: 15 },
    { category: 'Office Supplies', value: 64000, percentage: 5, growth: 3 },
    { category: 'Other', value: 64000, percentage: 5, growth: 0 },
  ]

  // Vendor Performance Metrics
  const vendorPerformanceData = [
    { metric: 'On-time Delivery', value: 92, target: 95, status: 'warning' },
    { metric: 'Quality Score', value: 96, target: 90, status: 'success' },
    { metric: 'Cost Savings', value: 8.5, target: 10, status: 'warning' },
    { metric: 'Contract Compliance', value: 94, target: 95, status: 'warning' },
    { metric: 'Response Time', value: 98, target: 95, status: 'success' },
  ]

  // Department Spend Analysis
  const departmentSpendData = [
    { department: 'Production', budget: 500000, spent: 485000, remaining: 15000, utilization: 97 },
    { department: 'IT', budget: 200000, spent: 178000, remaining: 22000, utilization: 89 },
    { department: 'Facilities', budget: 150000, spent: 145000, remaining: 5000, utilization: 97 },
    { department: 'HR', budget: 100000, spent: 65000, remaining: 35000, utilization: 65 },
    { department: 'Marketing', budget: 80000, spent: 72000, remaining: 8000, utilization: 90 },
    { department: 'R&D', budget: 120000, spent: 105000, remaining: 15000, utilization: 88 },
  ]

  // Savings Opportunities
  const savingsData = [
    { opportunity: 'Bulk Purchase Discounts', potential: 45000, realized: 32000, percentage: 71 },
    { opportunity: 'Early Payment Terms', potential: 28000, realized: 25000, percentage: 89 },
    { opportunity: 'Contract Renegotiation', potential: 65000, realized: 45000, percentage: 69 },
    { opportunity: 'Supplier Consolidation', potential: 38000, realized: 28000, percentage: 74 },
    { opportunity: 'Process Automation', potential: 52000, realized: 35000, percentage: 67 },
  ]

  // Purchase Order Analytics
  const poAnalyticsData = [
    { status: 'Completed', count: 245, value: 1250000 },
    { status: 'In Progress', count: 82, value: 450000 },
    { status: 'Pending Approval', count: 35, value: 180000 },
    { status: 'Draft', count: 12, value: 65000 },
    { status: 'Cancelled', count: 8, value: 42000 },
  ]

  // Supplier Diversity Metrics
  const diversityData = [
    { type: 'Small Business', count: 45, percentage: 35, spend: 280000 },
    { type: 'Women-Owned', count: 28, percentage: 22, spend: 176000 },
    { type: 'Minority-Owned', count: 32, percentage: 25, spend: 200000 },
    { type: 'Veteran-Owned', count: 15, percentage: 12, spend: 96000 },
    { type: 'Other', count: 8, percentage: 6, spend: 48000 },
  ]

  // Lead Time Analysis
  const leadTimeData = [
    { category: 'Raw Materials', avgDays: 15, minDays: 10, maxDays: 25 },
    { category: 'Equipment', avgDays: 45, minDays: 30, maxDays: 60 },
    { category: 'Services', avgDays: 7, minDays: 3, maxDays: 14 },
    { category: 'IT & Software', avgDays: 21, minDays: 14, maxDays: 30 },
    { category: 'Office Supplies', avgDays: 3, minDays: 1, maxDays: 7 },
  ]

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6']

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing analytics data...')
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procurement Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 border rounded-lg hover:bg-gray-50 ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Printer className="h-5 w-5" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Mail className="h-5 w-5" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="raw-materials">Raw Materials</option>
            <option value="equipment">Equipment</option>
            <option value="services">Services</option>
            <option value="it">IT & Software</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="production">Production</option>
            <option value="it">IT</option>
            <option value="facilities">Facilities</option>
            <option value="hr">HR</option>
          </select>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              12.5%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">$1,542,000</div>
          <div className="text-sm text-gray-600 mt-1">Total Spend YTD</div>
          <div className="mt-3 text-xs text-gray-500">Budget: $1,800,000 (86% utilized)</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              8.3%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">$165,000</div>
          <div className="text-sm text-gray-600 mt-1">Cost Savings Achieved</div>
          <div className="mt-3 text-xs text-gray-500">Target: $200,000 (82.5% achieved)</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="flex items-center text-red-600 text-sm">
              <ArrowDown className="h-4 w-4 mr-1" />
              2.1%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">128</div>
          <div className="text-sm text-gray-600 mt-1">Active Suppliers</div>
          <div className="mt-3 text-xs text-gray-500">New this month: 5</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              5.7%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">94.2%</div>
          <div className="text-sm text-gray-600 mt-1">On-Time Delivery Rate</div>
          <div className="mt-3 text-xs text-gray-500">Last month: 89.1%</div>
        </div>
      </div>

      {/* Spend Analysis Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div
          className="p-6 border-b cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('spend')}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Spend Analysis</h2>
            </div>
            {expandedSections.includes('spend') ?
              <ChevronUp className="h-5 w-5" /> :
              <ChevronDown className="h-5 w-5" />
            }
          </div>
        </div>

        {expandedSections.includes('spend') && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spend Trend Chart */}
              <div>
                <h3 className="text-lg font-medium mb-4">Spend Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={spendTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="budget" fill="#E5E7EB" stroke="#9CA3AF" />
                    <Bar dataKey="actual" fill="#3B82F6" />
                    <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="lastYear" stroke="#F59E0B" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div>
                <h3 className="text-lg font-medium mb-4">Category Spend Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categorySpendData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({category, percentage}) => `${category} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categorySpendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Spend Table */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Category Spend Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Spend Amount</th>
                      <th className="text-right py-3 px-4">% of Total</th>
                      <th className="text-right py-3 px-4">YoY Growth</th>
                      <th className="text-center py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorySpendData.map((cat, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{cat.category}</td>
                        <td className="text-right py-3 px-4">${cat.value.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">{cat.percentage}%</td>
                        <td className="text-right py-3 px-4">
                          <span className={`flex items-center justify-end ${cat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cat.growth >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                            {Math.abs(cat.growth)}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex justify-center">
                            <div className="w-16 h-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                  {value: Math.random() * 100},
                                  {value: Math.random() * 100},
                                  {value: Math.random() * 100},
                                  {value: Math.random() * 100},
                                ]}>
                                  <Line type="monotone" dataKey="value" stroke={cat.growth >= 0 ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
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

      {/* Performance Metrics Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div
          className="p-6 border-b cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('performance')}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold">Performance Metrics</h2>
            </div>
            {expandedSections.includes('performance') ?
              <ChevronUp className="h-5 w-5" /> :
              <ChevronDown className="h-5 w-5" />
            }
          </div>
        </div>

        {expandedSections.includes('performance') && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vendor Performance Radar */}
              <div>
                <h3 className="text-lg font-medium mb-4">Vendor Performance Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={vendorPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Current" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Department Budget Utilization */}
              <div>
                <h3 className="text-lg font-medium mb-4">Department Budget Utilization</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentSpendData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="spent" fill="#3B82F6" name="Spent" />
                    <Bar dataKey="remaining" fill="#10B981" name="Remaining" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {vendorPerformanceData.map((kpi, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-sm text-gray-600">{kpi.metric}</div>
                      <div className="text-2xl font-bold mt-1">
                        {kpi.value}{kpi.metric.includes('Cost') ? '%' : ''}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      kpi.status === 'success' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {kpi.status === 'success' ?
                        <CheckCircle className="h-5 w-5 text-green-600" /> :
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      }
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Target: {kpi.target}{kpi.metric.includes('Cost') ? '%' : ''}</span>
                    <span className={`${kpi.value >= kpi.target ? 'text-green-600' : 'text-amber-600'}`}>
                      {kpi.value >= kpi.target ? 'On Track' : 'Below Target'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          kpi.value >= kpi.target ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Savings & Opportunities Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div
          className="p-6 border-b cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('savings')}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Savings & Opportunities</h2>
            </div>
            {expandedSections.includes('savings') ?
              <ChevronUp className="h-5 w-5" /> :
              <ChevronDown className="h-5 w-5" />
            }
          </div>
        </div>

        {expandedSections.includes('savings') && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Savings Realization */}
              <div>
                <h3 className="text-lg font-medium mb-4">Savings Realization</h3>
                <div className="space-y-4">
                  {savingsData.map((saving, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{saving.opportunity}</div>
                        <span className="text-sm text-gray-500">{saving.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>Potential: ${saving.potential.toLocaleString()}</span>
                        <span>Realized: ${saving.realized.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                          style={{ width: `${saving.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-purple-600">Total Savings Opportunity</div>
                      <div className="text-2xl font-bold text-purple-900">$228,000</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-600">Realized to Date</div>
                      <div className="text-2xl font-bold text-purple-900">$165,000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Time Analysis */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lead Time Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leadTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="minDays" fill="#10B981" name="Min Days" />
                    <Bar dataKey="avgDays" fill="#3B82F6" name="Avg Days" />
                    <Bar dataKey="maxDays" fill="#F59E0B" name="Max Days" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">Average Lead Time</div>
                    <div className="text-xl font-bold text-blue-900">18.2 Days</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Lead Time Improvement</div>
                    <div className="text-xl font-bold text-green-900">-12.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Purchase Order Analytics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={poAnalyticsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
              >
                {poAnalyticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {poAnalyticsData.map((po, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[idx % colors.length] }} />
                  <span className="text-sm">{po.status}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {po.count} orders (${(po.value / 1000).toFixed(0)}K)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Diversity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-600" />
            Supplier Diversity Metrics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={diversityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-teal-50 rounded-lg">
              <div className="text-sm text-teal-600">Diverse Suppliers</div>
              <div className="text-xl font-bold text-teal-900">120 / 128</div>
              <div className="text-xs text-teal-700 mt-1">93.75% of total</div>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg">
              <div className="text-sm text-teal-600">Diverse Spend</div>
              <div className="text-xl font-bold text-teal-900">$752K</div>
              <div className="text-xs text-teal-700 mt-1">48.8% of total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation Modal */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <div className="font-medium">Schedule Report</div>
            <div className="text-xs text-gray-500 mt-1">Set up automated reports</div>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Settings className="h-6 w-6 text-gray-600 mb-2" />
            <div className="font-medium">Customize Dashboard</div>
            <div className="text-xs text-gray-500 mt-1">Configure metrics & layout</div>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Info className="h-6 w-6 text-purple-600 mb-2" />
            <div className="font-medium">Data Sources</div>
            <div className="text-xs text-gray-500 mt-1">View data connections</div>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <AlertTriangle className="h-6 w-6 text-amber-600 mb-2" />
            <div className="font-medium">Set Alerts</div>
            <div className="text-xs text-gray-500 mt-1">Configure thresholds</div>
          </button>
        </div>
      </div>
    </div>
  )
}