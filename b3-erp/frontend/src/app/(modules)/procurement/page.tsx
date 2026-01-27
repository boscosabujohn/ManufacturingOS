'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  FileText,
  ArrowUpRight,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react'
import {
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { purchaseOrderService, PurchaseOrder as POType } from '@/services/purchase-order.service'
import { purchaseRequisitionService } from '@/services/purchase-requisition.service'
import { goodsReceiptService } from '@/services/goods-receipt.service'
import { procurementRFQService } from '@/services/procurement-rfq.service'

interface ProcurementStats {
  totalPOs: number
  pendingApprovals: number
  activePOs: number
  completedThisMonth: number
  totalSpend: number
  avgLeadTime: number
  activeVendors: number
  pendingGRNs: number
  savingsThisMonth: number
  requisitionsOpen: number
}

interface PurchaseOrder {
  id: string
  vendor: string
  items: number
  totalAmount: number
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_received' | 'completed'
  createdDate: string
  expectedDelivery: string
  priority: 'high' | 'medium' | 'low'
}

interface VendorPerformance {
  id: string
  name: string
  category: string
  rating: number
  onTimeDelivery: number
  qualityScore: number
  totalOrders: number
  activeOrders: number
}

// Chart data
interface SpendTrend {
  month: string
  spent: number
  budget: number
  savings: number
}

interface CategorySpend {
  category: string
  value: number
  percentage: number
}

interface VendorMetrics {
  vendor: string
  onTime: number
  quality: number
  cost: number
  response: number
}

interface POStatusData {
  status: string
  count: number
  value: number
}

export default function ProcurementDashboard() {
  const [stats, setStats] = useState<ProcurementStats>({
    totalPOs: 0,
    pendingApprovals: 0,
    activePOs: 0,
    completedThisMonth: 0,
    totalSpend: 0,
    avgLeadTime: 12,
    activeVendors: 0,
    pendingGRNs: 0,
    savingsThisMonth: 456000,
    requisitionsOpen: 0
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [recentPOs, setRecentPOs] = useState<PurchaseOrder[]>([])

  // Monthly spending trend data
  const [spendTrend] = useState<SpendTrend[]>([
    { month: 'Jan', spent: 2850000, budget: 3000000, savings: 150000 },
    { month: 'Feb', spent: 3200000, budget: 3500000, savings: 300000 },
    { month: 'Mar', spent: 2950000, budget: 3200000, savings: 250000 },
    { month: 'Apr', spent: 3450000, budget: 3800000, savings: 350000 },
    { month: 'May', spent: 3100000, budget: 3400000, savings: 300000 },
    { month: 'Jun', spent: 3680000, budget: 4000000, savings: 320000 },
    { month: 'Jul', spent: 3320000, budget: 3600000, savings: 280000 },
    { month: 'Aug', spent: 3890000, budget: 4200000, savings: 310000 },
    { month: 'Sep', spent: 3560000, budget: 3800000, savings: 240000 },
    { month: 'Oct', spent: 3568000, budget: 4000000, savings: 432000 }
  ])

  // Category-wise spending
  const [categorySpend] = useState<CategorySpend[]>([
    { category: 'Raw Materials', value: 12500000, percentage: 35 },
    { category: 'Components', value: 8900000, percentage: 25 },
    { category: 'Equipment', value: 7100000, percentage: 20 },
    { category: 'Services', value: 3560000, percentage: 10 },
    { category: 'Consumables', value: 2140000, percentage: 6 },
    { category: 'Others', value: 1480000, percentage: 4 }
  ])

  // PO Status Distribution
  const [poStatusData, setPOStatusData] = useState<POStatusData[]>([])

  // Vendor performance metrics for radar chart
  const [vendorMetrics] = useState<VendorMetrics[]>([
    { vendor: 'Top Vendors', onTime: 95, quality: 92, cost: 88, response: 90 },
    { vendor: 'Average', onTime: 85, quality: 80, cost: 75, response: 78 }
  ])

  const [topVendors] = useState<VendorPerformance[]>([
    {
      id: 'VEN-001',
      name: 'Steel Suppliers Ltd',
      category: 'Raw Materials',
      rating: 4.8,
      onTimeDelivery: 95,
      qualityScore: 92,
      totalOrders: 145,
      activeOrders: 8
    },
    {
      id: 'VEN-002',
      name: 'Hydraulics International',
      category: 'Components',
      rating: 4.6,
      onTimeDelivery: 88,
      qualityScore: 90,
      totalOrders: 98,
      activeOrders: 5
    },
    {
      id: 'VEN-003',
      name: 'Electronic Components Co',
      category: 'Electronics',
      rating: 4.9,
      onTimeDelivery: 97,
      qualityScore: 95,
      totalOrders: 132,
      activeOrders: 6
    },
    {
      id: 'VEN-004',
      name: 'Industrial Supplies Inc',
      category: 'General Supplies',
      rating: 4.4,
      onTimeDelivery: 85,
      qualityScore: 88,
      totalOrders: 87,
      activeOrders: 3
    }
  ])

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const CHART_COLORS = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899'
  }

  // Load dashboard data from services
  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch all data in parallel
      const [poData, prData, grStats, rfqStats] = await Promise.all([
        purchaseOrderService.getAllPurchaseOrders(),
        purchaseRequisitionService.getAllRequisitions(),
        goodsReceiptService.getReceiptStats(),
        procurementRFQService.getRFQStats()
      ])

      // Calculate PO stats
      const purchaseOrders = poData.data
      const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)
      const activePOs = purchaseOrders.filter(po =>
        ['Approved', 'Sent to Vendor', 'Partially Received'].includes(po.status)
      ).length
      const pendingApprovalPOs = purchaseOrders.filter(po => po.status === 'Pending Approval').length
      const completedPOs = purchaseOrders.filter(po =>
        ['Fully Received', 'Closed'].includes(po.status)
      ).length

      // Get unique vendors
      const uniqueVendors = new Set(purchaseOrders.map(po => po.vendorId))

      // Calculate pending requisitions
      const pendingRequisitions = prData.data.filter(pr =>
        ['Draft', 'Pending Approval'].includes(pr.status)
      ).length

      // Update stats
      setStats({
        totalPOs: purchaseOrders.length,
        pendingApprovals: pendingApprovalPOs,
        activePOs: activePOs,
        completedThisMonth: completedPOs,
        totalSpend: totalSpend,
        avgLeadTime: 12,
        activeVendors: uniqueVendors.size,
        pendingGRNs: grStats.pendingCount + grStats.qualityCheckCount,
        savingsThisMonth: 456000,
        requisitionsOpen: pendingRequisitions
      })

      // Map recent POs for display
      const mappedPOs: PurchaseOrder[] = purchaseOrders.slice(0, 4).map(po => ({
        id: po.poNumber,
        vendor: po.vendorName,
        items: po.items.length,
        totalAmount: po.totalAmount,
        status: mapPOStatus(po.status),
        createdDate: po.orderDate,
        expectedDelivery: po.deliveryDate,
        priority: determinePriority(po)
      }))
      setRecentPOs(mappedPOs)

      // Calculate PO status distribution
      const statusCounts: Record<string, { count: number; value: number }> = {}
      purchaseOrders.forEach(po => {
        if (!statusCounts[po.status]) {
          statusCounts[po.status] = { count: 0, value: 0 }
        }
        statusCounts[po.status].count++
        statusCounts[po.status].value += po.totalAmount
      })

      const statusData: POStatusData[] = Object.entries(statusCounts).map(([status, data]) => ({
        status,
        count: data.count,
        value: data.value
      }))
      setPOStatusData(statusData)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to map PO status
  const mapPOStatus = (status: string): PurchaseOrder['status'] => {
    const statusMap: Record<string, PurchaseOrder['status']> = {
      'Draft': 'draft',
      'Pending Approval': 'pending_approval',
      'Approved': 'approved',
      'Sent to Vendor': 'sent',
      'Partially Received': 'partially_received',
      'Fully Received': 'completed',
      'Closed': 'completed',
      'Cancelled': 'draft'
    }
    return statusMap[status] || 'draft'
  }

  // Helper function to determine priority based on delivery date
  const determinePriority = (po: POType): 'high' | 'medium' | 'low' => {
    const today = new Date()
    const deliveryDate = new Date(po.deliveryDate)
    const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilDelivery <= 7) return 'high'
    if (daysUntilDelivery <= 14) return 'medium'
    return 'low'
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadDashboardData()
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'approved':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'sent':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'partially_received':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{(entry.value / 100000).toFixed(1)}L
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading procurement data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procurement Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time insights and analytics for procurement operations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 ${isRefreshing ? 'animate-pulse' : ''
                }`}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md">
              <ShoppingCart className="h-5 w-5" />
              New Purchase Order
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active POs</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.activePOs}</p>
                <p className="text-xs text-blue-700 mt-1">{stats.pendingApprovals} pending approval</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Spend</p>
                <p className="text-2xl font-bold text-green-900 mt-1">₹{(stats.totalSpend / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-green-700 mt-1">This month</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Vendors</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.activeVendors}</p>
                <p className="text-xs text-purple-700 mt-1">{stats.totalPOs} total POs</p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Lead Time</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.avgLeadTime} days</p>
                <p className="text-xs text-orange-700 mt-1">{stats.pendingGRNs} pending GRNs</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Spending Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Spending Trend Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">Budget vs Actual Spending</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Filter</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Download className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Download</span>
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendTrend}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="budget"
                  stroke={CHART_COLORS.success}
                  fillOpacity={1}
                  fill="url(#colorBudget)"
                  strokeWidth={2}
                  name="Budget"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke={CHART_COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                  strokeWidth={2}
                  name="Spent"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke={CHART_COLORS.warning}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.warning }}
                  name="Savings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Spend Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Category Spend</h3>
              <PieChart className="h-5 w-5 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={categorySpend}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categorySpend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categorySpend.slice(0, 3).map((cat, index) => (
                <div key={cat.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-gray-600">{cat.category}</span>
                  </div>
                  <span className="font-semibold text-gray-900">₹{(cat.value / 100000).toFixed(0)}L</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PO Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">PO Status Distribution</h3>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={poStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis dataKey="status" type="category" stroke="#888" fontSize={11} width={100} />
                <Tooltip formatter={(value: number) => value} />
                <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Vendor Performance Radar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vendor Performance</h3>
              <Activity className="h-5 w-5 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={[
                { metric: 'On-Time', top: 95, avg: 85 },
                { metric: 'Quality', top: 92, avg: 80 },
                { metric: 'Cost', top: 88, avg: 75 },
                { metric: 'Response', top: 90, avg: 78 },
                { metric: 'Flexibility', top: 86, avg: 72 }
              ]}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="metric" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                <Radar name="Top Vendors" dataKey="top" stroke={CHART_COLORS.success} fill={CHART_COLORS.success} fillOpacity={0.6} />
                <Radar name="Average" dataKey="avg" stroke={CHART_COLORS.warning} fill={CHART_COLORS.warning} fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Avg Processing Time</p>
                  <p className="text-2xl font-bold mt-1">2.3 days</p>
                  <p className="text-xs text-blue-100 mt-1 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    12% faster than last month
                  </p>
                </div>
                <Clock className="h-10 w-10 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Cost Savings Rate</p>
                  <p className="text-2xl font-bold mt-1">8.2%</p>
                  <p className="text-xs text-green-100 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    ₹{(stats.savingsThisMonth / 100000).toFixed(1)}L this month
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Compliance Rate</p>
                  <p className="text-2xl font-bold mt-1">94.5%</p>
                  <p className="text-xs text-purple-100 mt-1">Policy adherence</p>
                </div>
                <CheckCircle className="h-10 w-10 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Purchase Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Purchase Orders</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPOs.map((po) => (
                  <div key={po.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{po.id}</p>
                        <p className="text-sm text-gray-600 mt-1">{po.vendor}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(po.status)}`}>
                        {po.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600">{po.items} items</p>
                        <p className="font-semibold text-gray-900 mt-1">₹{po.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getPriorityColor(po.priority)}`}>
                          {po.priority.toUpperCase()}
                        </p>
                        <p className="text-gray-600 mt-1 text-xs">Due: {po.expectedDelivery}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topVendors.map((vendor) => (
                  <div key={vendor.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{vendor.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{vendor.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-gray-900">{vendor.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">On-Time</p>
                        <p className="font-semibold text-gray-900">{vendor.onTimeDelivery}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Quality</p>
                        <p className="font-semibold text-gray-900">{vendor.qualityScore}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Active POs</p>
                        <p className="font-semibold text-gray-900">{vendor.activeOrders}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedThisMonth}</p>
                <p className="text-xs text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.savingsThisMonth / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Requisitions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.requisitionsOpen}</p>
                <p className="text-xs text-orange-600 mt-1">Requires action</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
