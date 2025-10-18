'use client'

import { useState } from 'react'
import {
  Building,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Users,
  Package,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react'

interface ProfitCenter {
  id: string
  code: string
  name: string
  manager: string
  type: 'product_line' | 'business_unit' | 'region' | 'division'
  revenue: number
  directCosts: number
  allocatedCosts: number
  grossProfit: number
  grossProfitMargin: number
  netProfit: number
  netProfitMargin: number
  employeeCount: number
  customers: number
  status: 'active' | 'inactive'
}

export default function ProfitCentersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [profitCenters] = useState<ProfitCenter[]>([
    {
      id: 'PC-001',
      code: 'PC-HYDPRESS',
      name: 'Hydraulic Press Division',
      manager: 'John Doe',
      type: 'product_line',
      revenue: 250000000,
      directCosts: 150000000,
      allocatedCosts: 35000000,
      grossProfit: 100000000,
      grossProfitMargin: 40,
      netProfit: 65000000,
      netProfitMargin: 26,
      employeeCount: 85,
      customers: 45,
      status: 'active'
    },
    {
      id: 'PC-002',
      code: 'PC-CNC',
      name: 'CNC Machines Division',
      manager: 'Jane Smith',
      type: 'product_line',
      revenue: 180000000,
      directCosts: 108000000,
      allocatedCosts: 28000000,
      grossProfit: 72000000,
      grossProfitMargin: 40,
      netProfit: 44000000,
      netProfitMargin: 24.44,
      employeeCount: 65,
      customers: 38,
      status: 'active'
    },
    {
      id: 'PC-003',
      code: 'PC-AUTO',
      name: 'Automation Solutions',
      manager: 'Robert Brown',
      type: 'business_unit',
      revenue: 320000000,
      directCosts: 192000000,
      allocatedCosts: 48000000,
      grossProfit: 128000000,
      grossProfitMargin: 40,
      netProfit: 80000000,
      netProfitMargin: 25,
      employeeCount: 120,
      customers: 62,
      status: 'active'
    },
    {
      id: 'PC-004',
      code: 'PC-NORTH',
      name: 'North Region',
      manager: 'Sarah Wilson',
      type: 'region',
      revenue: 150000000,
      directCosts: 97500000,
      allocatedCosts: 22500000,
      grossProfit: 52500000,
      grossProfitMargin: 35,
      netProfit: 30000000,
      netProfitMargin: 20,
      employeeCount: 55,
      customers: 78,
      status: 'active'
    },
    {
      id: 'PC-005',
      code: 'PC-SOUTH',
      name: 'South Region',
      manager: 'Michael Chen',
      type: 'region',
      revenue: 120000000,
      directCosts: 78000000,
      allocatedCosts: 18000000,
      grossProfit: 42000000,
      grossProfitMargin: 35,
      netProfit: 24000000,
      netProfitMargin: 20,
      employeeCount: 42,
      customers: 65,
      status: 'active'
    },
    {
      id: 'PC-006',
      code: 'PC-SPARES',
      name: 'Spare Parts Division',
      manager: 'Emily Davis',
      type: 'product_line',
      revenue: 80000000,
      directCosts: 56000000,
      allocatedCosts: 12000000,
      grossProfit: 24000000,
      grossProfitMargin: 30,
      netProfit: 12000000,
      netProfitMargin: 15,
      employeeCount: 28,
      customers: 125,
      status: 'active'
    },
    {
      id: 'PC-007',
      code: 'PC-SERVICE',
      name: 'After-Sales Service',
      manager: 'David Martinez',
      type: 'business_unit',
      revenue: 95000000,
      directCosts: 52250000,
      allocatedCosts: 14250000,
      grossProfit: 42750000,
      grossProfitMargin: 45,
      netProfit: 28500000,
      netProfitMargin: 30,
      employeeCount: 48,
      customers: 95,
      status: 'active'
    }
  ])

  const filteredCenters = profitCenters.filter(center => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.manager.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || center.type === typeFilter
    const matchesStatus = statusFilter === 'all' || center.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      product_line: 'bg-blue-100 text-blue-700',
      business_unit: 'bg-purple-100 text-purple-700',
      region: 'bg-green-100 text-green-700',
      division: 'bg-orange-100 text-orange-700'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  // Calculate totals
  const totalRevenue = profitCenters.reduce((sum, pc) => sum + pc.revenue, 0)
  const totalGrossProfit = profitCenters.reduce((sum, pc) => sum + pc.grossProfit, 0)
  const totalNetProfit = profitCenters.reduce((sum, pc) => sum + pc.netProfit, 0)
  const avgNetMargin = (totalNetProfit / totalRevenue) * 100

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profit Centers</h1>
            <p className="text-gray-600 mt-1">Monitor profitability across divisions, product lines, and regions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md">
            <Plus className="h-5 w-5" />
            Add Profit Center
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-blue-700 mt-1">All profit centers</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Gross Profit</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalGrossProfit)}</p>
                <p className="text-xs text-green-700 mt-1">{((totalGrossProfit/totalRevenue)*100).toFixed(1)}% margin</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Net Profit</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(totalNetProfit)}</p>
                <p className="text-xs text-purple-700 mt-1">{avgNetMargin.toFixed(1)}% margin</p>
              </div>
              <Target className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Profit Centers</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{profitCenters.length}</p>
                <p className="text-xs text-orange-700 mt-1">{profitCenters.filter(pc => pc.status === 'active').length} active</p>
              </div>
              <Building className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, code, or manager..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="product_line">Product Line</option>
                <option value="business_unit">Business Unit</option>
                <option value="region">Region</option>
                <option value="division">Division</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Profit Centers List */}
        <div className="space-y-4">
          {filteredCenters.map((center) => (
            <div key={center.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                      <p className="text-sm text-gray-600">{center.code} • Managed by {center.manager}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(center.type)}`}>
                          {center.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {center.employeeCount} employees
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {center.customers} customers
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Net Profit Margin</p>
                    <p className={`text-3xl font-bold ${
                      center.netProfitMargin >= 25 ? 'text-green-600' :
                      center.netProfitMargin >= 15 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{center.netProfitMargin.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-blue-600 mb-1">Revenue</p>
                    <p className="text-lg font-semibold text-blue-900">{formatCurrency(center.revenue)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-xs text-orange-600 mb-1">Direct Costs</p>
                    <p className="text-lg font-semibold text-orange-900">{formatCurrency(center.directCosts)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-green-600 mb-1">Gross Profit</p>
                    <p className="text-lg font-semibold text-green-900">{formatCurrency(center.grossProfit)}</p>
                    <p className="text-xs text-green-700 mt-1">{center.grossProfitMargin}% margin</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-xs text-red-600 mb-1">Allocated Costs</p>
                    <p className="text-lg font-semibold text-red-900">{formatCurrency(center.allocatedCosts)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-purple-600 mb-1">Net Profit</p>
                    <p className="text-lg font-semibold text-purple-900">{formatCurrency(center.netProfit)}</p>
                    <p className="text-xs text-purple-700 mt-1">{center.netProfitMargin.toFixed(1)}% margin</p>
                  </div>
                </div>

                {/* Profit Margin Visualization */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Profitability Performance</span>
                    <span className="text-gray-600">
                      {formatCurrency(center.netProfit)} / {formatCurrency(center.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        center.netProfitMargin >= 25 ? 'bg-green-600' :
                        center.netProfitMargin >= 15 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(center.netProfitMargin * 2, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <BarChart3 className="h-4 w-4" />
                    Performance Report
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                    Edit Center
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
