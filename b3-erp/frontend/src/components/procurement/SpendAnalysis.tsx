'use client'

import React, { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Eye,
  Zap,
  Award,
  Briefcase,
  Settings,
  RefreshCw,
  Globe,
  MapPin,
  Tag,
  CreditCard,
  Wallet,
  PiggyBank,
  Calculator,
  FileText,
  Building2,
  Layers,
  GitBranch,
  Percent
} from 'lucide-react'
import {
  CreateCustomReportModal,
  ExportReportModal,
  ScheduleReportModal,
  DashboardCustomizationModal
} from '@/components/procurement/AnalyticsModals'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
  Sankey,
  ComposedChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts'

interface SpendData {
  category: string
  current: number
  previous: number
  budget: number
  variance: number
  trend: 'up' | 'down' | 'stable'
  suppliers: number
  transactions: number
}

interface SavingsOpportunity {
  id: string
  category: string
  type: string
  potential: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeframe: string
  impact: 'low' | 'medium' | 'high'
  status: 'identified' | 'in_progress' | 'realized'
}

export default function SpendAnalysis() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('ytd')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Modal states
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isScheduleReportModalOpen, setIsScheduleReportModalOpen] = useState(false)
  const [isDashboardCustomizationModalOpen, setIsDashboardCustomizationModalOpen] = useState(false)

  // Mock data
  const spendByCategory: SpendData[] = [
    {
      category: 'Raw Materials',
      current: 5200000,
      previous: 4800000,
      budget: 5000000,
      variance: -200000,
      trend: 'up',
      suppliers: 24,
      transactions: 1250
    },
    {
      category: 'IT Services',
      current: 2800000,
      previous: 3000000,
      budget: 2900000,
      variance: 100000,
      trend: 'down',
      suppliers: 15,
      transactions: 450
    },
    {
      category: 'Logistics',
      current: 3500000,
      previous: 3200000,
      budget: 3400000,
      variance: -100000,
      trend: 'up',
      suppliers: 12,
      transactions: 890
    },
    {
      category: 'Professional Services',
      current: 1800000,
      previous: 1600000,
      budget: 1900000,
      variance: 100000,
      trend: 'up',
      suppliers: 28,
      transactions: 320
    },
    {
      category: 'MRO Supplies',
      current: 1200000,
      previous: 1300000,
      budget: 1250000,
      variance: 50000,
      trend: 'down',
      suppliers: 45,
      transactions: 2100
    },
    {
      category: 'Facilities',
      current: 950000,
      previous: 1000000,
      budget: 1000000,
      variance: 50000,
      trend: 'down',
      suppliers: 8,
      transactions: 180
    }
  ]

  const monthlySpendTrend = [
    { month: 'Jan', actual: 2100000, budget: 2200000, forecast: 2150000 },
    { month: 'Feb', actual: 2250000, budget: 2200000, forecast: 2180000 },
    { month: 'Mar', actual: 2180000, budget: 2300000, forecast: 2250000 },
    { month: 'Apr', actual: 2350000, budget: 2300000, forecast: 2280000 },
    { month: 'May', actual: 2420000, budget: 2400000, forecast: 2380000 },
    { month: 'Jun', actual: 2380000, budget: 2400000, forecast: 2400000 }
  ]

  const savingsOpportunities: SavingsOpportunity[] = [
    {
      id: 'OPP001',
      category: 'Raw Materials',
      type: 'Volume Consolidation',
      potential: 520000,
      difficulty: 'medium',
      timeframe: 'Q2 2024',
      impact: 'high',
      status: 'in_progress'
    },
    {
      id: 'OPP002',
      category: 'IT Services',
      type: 'Contract Renegotiation',
      potential: 280000,
      difficulty: 'easy',
      timeframe: 'Q1 2024',
      impact: 'medium',
      status: 'identified'
    },
    {
      id: 'OPP003',
      category: 'Logistics',
      type: 'Route Optimization',
      potential: 350000,
      difficulty: 'hard',
      timeframe: 'Q3 2024',
      impact: 'high',
      status: 'identified'
    },
    {
      id: 'OPP004',
      category: 'MRO Supplies',
      type: 'Supplier Consolidation',
      potential: 180000,
      difficulty: 'easy',
      timeframe: 'Q1 2024',
      impact: 'medium',
      status: 'in_progress'
    }
  ]

  const topSupplierSpend = [
    { supplier: 'Global Materials Inc', spend: 3200000, category: 'Raw Materials', invoices: 245, avgDays: 28 },
    { supplier: 'TechPro Solutions', spend: 1800000, category: 'IT Services', invoices: 85, avgDays: 45 },
    { supplier: 'FastTrack Logistics', spend: 2100000, category: 'Logistics', invoices: 320, avgDays: 15 },
    { supplier: 'Premier Manufacturing', spend: 1500000, category: 'Raw Materials', invoices: 180, avgDays: 30 },
    { supplier: 'Office Supplies Co', spend: 450000, category: 'MRO Supplies', invoices: 520, avgDays: 7 }
  ]

  const spendByRegion = [
    { region: 'North America', spend: 6500000, suppliers: 45, growth: 8.2 },
    { region: 'Europe', spend: 3200000, suppliers: 28, growth: -2.5 },
    { region: 'Asia Pacific', spend: 4800000, suppliers: 62, growth: 15.3 },
    { region: 'Latin America', spend: 950000, suppliers: 12, growth: 5.7 }
  ]

  const costDrivers = [
    { driver: 'Raw Material Prices', impact: 680000, trend: 'increasing' },
    { driver: 'Freight Costs', impact: 420000, trend: 'stable' },
    { driver: 'Exchange Rates', impact: -150000, trend: 'favorable' },
    { driver: 'Volume Changes', impact: 320000, trend: 'increasing' },
    { driver: 'Contract Terms', impact: -280000, trend: 'favorable' }
  ]

  const paymentTermsAnalysis = [
    { terms: 'Net 30', spend: 4500000, suppliers: 35, discount: 0 },
    { terms: 'Net 45', spend: 3200000, suppliers: 28, discount: 0 },
    { terms: 'Net 60', spend: 2800000, suppliers: 22, discount: 0 },
    { terms: '2/10 Net 30', spend: 1500000, suppliers: 12, discount: 2 },
    { terms: 'Immediate', spend: 850000, suppliers: 8, discount: 5 }
  ]

  const spendCube = [
    { category: 'Raw Materials', supplier: 'Global Materials Inc', region: 'Asia Pacific', spend: 2100000 },
    { category: 'Raw Materials', supplier: 'Premier Manufacturing', region: 'North America', spend: 1500000 },
    { category: 'IT Services', supplier: 'TechPro Solutions', region: 'North America', spend: 1800000 },
    { category: 'Logistics', supplier: 'FastTrack Logistics', region: 'North America', spend: 2100000 },
    { category: 'MRO Supplies', supplier: 'Office Supplies Co', region: 'Europe', spend: 450000 }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

  const calculateTotalSpend = () => spendByCategory.reduce((sum, cat) => sum + cat.current, 0)
  const calculateTotalSavings = () => savingsOpportunities.reduce((sum, opp) => sum + opp.potential, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              Spend Analysis & Cost Optimization
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive spend visibility and savings opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ytd">Year to Date</option>
              <option value="quarter">This Quarter</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
            <button
              onClick={() => setIsCreateReportModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Create Report
            </button>
            <button
              onClick={() => setIsScheduleReportModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setIsDashboardCustomizationModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Customize
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total Spend</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${(calculateTotalSpend() / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">+8.3% vs LY</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Cost Savings</span>
              <PiggyBank className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${(calculateTotalSavings() / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">12.5% of spend</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-600 text-sm font-medium">Budget Variance</span>
              <Calculator className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">-$350K</div>
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-600">2.3% over budget</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Active Suppliers</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">187</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowDownRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">-15 consolidated</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-600 text-sm font-medium">Transactions</span>
              <CreditCard className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">5,190</div>
            <div className="flex items-center gap-1 mt-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Avg $3.1K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'categories', 'suppliers', 'optimization', 'trends', 'cube'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'cube' ? 'Spend Cube' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Spend Trend Analysis */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spend Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlySpendTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="budget" fill="#FEF3C7" stroke="#F59E0B" strokeDasharray="5 5" />
                    <Bar dataKey="actual" fill="#3B82F6" />
                    <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={spendByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="current"
                      >
                        {spendByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Region</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={spendByRegion}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                      />
                      <Bar dataKey="spend" fill="#3B82F6">
                        {spendByRegion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Drivers */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Key Cost Drivers</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {costDrivers.map((driver, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            driver.trend === 'increasing' ? 'bg-red-100 text-red-600' :
                            driver.trend === 'favorable' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {driver.trend === 'increasing' ? <TrendingUp className="w-5 h-5" /> :
                             driver.trend === 'favorable' ? <TrendingDown className="w-5 h-5" /> :
                             <Activity className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{driver.driver}</div>
                            <div className="text-sm text-gray-600">Trend: {driver.trend}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          driver.impact > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {driver.impact > 0 ? '+' : ''}${Math.abs(driver.impact / 1000).toFixed(0)}K
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Category Performance Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Current Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">vs Previous</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Budget</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Variance</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Suppliers</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Transactions</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {spendByCategory.map((cat) => (
                      <tr key={cat.category} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{cat.category}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">${(cat.current / 1000000).toFixed(2)}M</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {cat.trend === 'up' ? (
                              <ArrowUpRight className="w-4 h-4 text-red-600" />
                            ) : cat.trend === 'down' ? (
                              <ArrowDownRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <Activity className="w-4 h-4 text-gray-600" />
                            )}
                            <span className={`text-sm ${
                              cat.trend === 'up' ? 'text-red-600' :
                              cat.trend === 'down' ? 'text-green-600' :
                              'text-gray-600'
                            }`}>
                              {((cat.current - cat.previous) / cat.previous * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-900">${(cat.budget / 1000000).toFixed(2)}M</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${
                            cat.variance > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {cat.variance > 0 ? '-' : '+'}${Math.abs(cat.variance / 1000).toFixed(0)}K
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-900">{cat.suppliers}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-900">{cat.transactions.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setShowDrillDown(true)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Category Trends */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Spend Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', rawMaterials: 4800000, itServices: 2600000, logistics: 3000000, mro: 1100000 },
                    { month: 'Feb', rawMaterials: 4900000, itServices: 2700000, logistics: 3100000, mro: 1150000 },
                    { month: 'Mar', rawMaterials: 5000000, itServices: 2750000, logistics: 3200000, mro: 1180000 },
                    { month: 'Apr', rawMaterials: 5100000, itServices: 2800000, logistics: 3300000, mro: 1200000 },
                    { month: 'May', rawMaterials: 5150000, itServices: 2780000, logistics: 3400000, mro: 1190000 },
                    { month: 'Jun', rawMaterials: 5200000, itServices: 2800000, logistics: 3500000, mro: 1200000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="rawMaterials" stroke="#3B82F6" strokeWidth={2} name="Raw Materials" />
                    <Line type="monotone" dataKey="itServices" stroke="#10B981" strokeWidth={2} name="IT Services" />
                    <Line type="monotone" dataKey="logistics" stroke="#F59E0B" strokeWidth={2} name="Logistics" />
                    <Line type="monotone" dataKey="mro" stroke="#EF4444" strokeWidth={2} name="MRO Supplies" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              {/* Top Suppliers */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Suppliers by Spend</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">YTD Spend</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Invoices</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Avg Payment Days</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Spend Trend</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topSupplierSpend.map((supplier) => (
                        <tr key={supplier.supplier} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{supplier.supplier}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-900">{supplier.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">${(supplier.spend / 1000000).toFixed(2)}M</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-900">{supplier.invoices}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              supplier.avgDays <= 30 ? 'bg-green-100 text-green-700' :
                              supplier.avgDays <= 45 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {supplier.avgDays} days
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              <span className="text-gray-700">View</span>
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Supplier Concentration Risk */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Concentration</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Top 10 Suppliers</span>
                        <span className="font-medium">65% of spend</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Top 20 Suppliers</span>
                        <span className="font-medium">82% of spend</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Top 50 Suppliers</span>
                        <span className="font-medium">94% of spend</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={paymentTermsAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ terms, percent }) => `${terms}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="spend"
                      >
                        {paymentTermsAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              {/* Savings Opportunities */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Identified Savings Potential</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Total potential savings of ${(calculateTotalSavings() / 1000000).toFixed(2)}M identified across {savingsOpportunities.length} opportunities
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savingsOpportunities.map((opp) => (
                  <div key={opp.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-sm text-gray-500">{opp.id}</span>
                        <h4 className="font-semibold text-gray-900 mt-1">{opp.type}</h4>
                        <div className="text-sm text-gray-600">{opp.category}</div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        opp.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        opp.status === 'realized' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {opp.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-green-600 mb-3">
                      ${(opp.potential / 1000).toFixed(0)}K
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {opp.timeframe}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        opp.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        opp.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {opp.difficulty}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        opp.impact === 'high' ? 'bg-purple-100 text-purple-700' :
                        opp.impact === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {opp.impact} impact
                      </span>
                    </div>

                    <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Optimization Recommendations */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Cost Optimization Recommendations</h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { action: 'Consolidate MRO suppliers from 45 to 15', savings: '8-12%', effort: 'Medium' },
                    { action: 'Implement dynamic discounting for early payment', savings: '2-3%', effort: 'Low' },
                    { action: 'Renegotiate top 10 supplier contracts', savings: '5-8%', effort: 'High' },
                    { action: 'Automate PO creation for recurring purchases', savings: '15% process cost', effort: 'Medium' },
                    { action: 'Implement category management strategies', savings: '10-15%', effort: 'High' }
                  ].map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{rec.action}</div>
                          <div className="text-sm text-gray-600">Expected savings: {rec.savings}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          rec.effort === 'Low' ? 'bg-green-100 text-green-700' :
                          rec.effort === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {rec.effort} effort
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Advanced Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend Velocity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { week: 'W1', spend: 450000, transactions: 125 },
                      { week: 'W2', spend: 520000, transactions: 142 },
                      { week: 'W3', spend: 480000, transactions: 138 },
                      { week: 'W4', spend: 550000, transactions: 156 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="week" stroke="#6B7280" />
                      <YAxis yAxisId="left" stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="spend" stroke="#3B82F6" fill="#DBEAFE" name="Weekly Spend" />
                      <Area yAxisId="right" type="monotone" dataKey="transactions" stroke="#10B981" fill="#D1FAE5" name="Transactions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Index Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', materials: 100, services: 100, logistics: 100 },
                      { month: 'Feb', materials: 102, services: 99, logistics: 101 },
                      { month: 'Mar', materials: 105, services: 98, logistics: 103 },
                      { month: 'Apr', materials: 104, services: 99, logistics: 105 },
                      { month: 'May', materials: 106, services: 100, logistics: 104 },
                      { month: 'Jun', materials: 108, services: 101, logistics: 106 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" domain={[95, 110]} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Line type="monotone" dataKey="materials" stroke="#EF4444" strokeWidth={2} name="Materials" />
                      <Line type="monotone" dataKey="services" stroke="#10B981" strokeWidth={2} name="Services" />
                      <Line type="monotone" dataKey="logistics" stroke="#F59E0B" strokeWidth={2} name="Logistics" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend Forecast - Next Quarter</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">$7.2M</div>
                    <div className="text-sm text-gray-600 mt-1">Predicted Spend</div>
                    <div className="text-xs text-amber-600 mt-2">+5% vs current</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$450K</div>
                    <div className="text-sm text-gray-600 mt-1">Savings Opportunity</div>
                    <div className="text-xs text-green-600 mt-2">6.3% of spend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">18</div>
                    <div className="text-sm text-gray-600 mt-1">Contracts Expiring</div>
                    <div className="text-xs text-blue-600 mt-2">$2.3M value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-gray-600 mt-1">Budget Utilization</div>
                    <div className="text-xs text-purple-600 mt-2">On track</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cube' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Dimensional Spend Analysis</h3>

              {/* Spend Cube Visualization */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Dimension 1: Category</option>
                      <option>Dimension 1: Supplier</option>
                      <option>Dimension 1: Region</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Dimension 2: Supplier</option>
                      <option>Dimension 2: Category</option>
                      <option>Dimension 2: Region</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Dimension 3: Region</option>
                      <option>Dimension 3: Category</option>
                      <option>Dimension 3: Supplier</option>
                    </select>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <Treemap
                    data={spendCube.map(item => ({
                      name: `${item.category} - ${item.supplier}`,
                      size: item.spend,
                      category: item.category,
                      supplier: item.supplier,
                      region: item.region
                    }))}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="#3B82F6"
                  >
                    {spendCube.map((item, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>

              {/* Cube Analysis Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Region</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Spend</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">% of Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Opportunity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {spendCube.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="text-gray-900">{item.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-900">{item.supplier}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-900">{item.region}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">${(item.spend / 1000000).toFixed(2)}M</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(item.spend / calculateTotalSpend() * 100)}%` }}
                              />
                            </div>
                            <span className="text-sm">{(item.spend / calculateTotalSpend() * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ${((item.spend * 0.08) / 1000).toFixed(0)}K
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spend Analysis Modals */}
      <CreateCustomReportModal
        isOpen={isCreateReportModalOpen}
        onClose={() => setIsCreateReportModalOpen(false)}
        onSubmit={(data) => {
          console.log('Creating spend analysis report:', data)
          setIsCreateReportModalOpen(false)
        }}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onSubmit={(options) => {
          console.log('Exporting spend analysis:', options)
          setIsExportModalOpen(false)
        }}
        reportName="Spend Analysis Report"
      />

      <ScheduleReportModal
        isOpen={isScheduleReportModalOpen}
        onClose={() => setIsScheduleReportModalOpen(false)}
        onSubmit={(data) => {
          console.log('Scheduling spend analysis:', data)
          setIsScheduleReportModalOpen(false)
        }}
      />

      <DashboardCustomizationModal
        isOpen={isDashboardCustomizationModalOpen}
        onClose={() => setIsDashboardCustomizationModalOpen(false)}
        onSubmit={(data) => {
          console.log('Customizing spend dashboard:', data)
          setIsDashboardCustomizationModalOpen(false)
        }}
      />
    </div>
  )
}