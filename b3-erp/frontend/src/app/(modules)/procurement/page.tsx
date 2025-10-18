'use client'

import { useState } from 'react'
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
  Package
} from 'lucide-react'

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

export default function ProcurementDashboard() {
  const [stats] = useState<ProcurementStats>({
    totalPOs: 234,
    pendingApprovals: 12,
    activePOs: 45,
    completedThisMonth: 67,
    totalSpend: 35680000,
    avgLeadTime: 12,
    activeVendors: 56,
    pendingGRNs: 8,
    savingsThisMonth: 456000,
    requisitionsOpen: 18
  })

  const [recentPOs] = useState<PurchaseOrder[]>([
    {
      id: 'PO-2025-145',
      vendor: 'Steel Suppliers Ltd',
      items: 5,
      totalAmount: 2450000,
      status: 'sent',
      createdDate: '2025-10-15',
      expectedDelivery: '2025-10-25',
      priority: 'high'
    },
    {
      id: 'PO-2025-146',
      vendor: 'Hydraulics International',
      items: 3,
      totalAmount: 1850000,
      status: 'partially_received',
      createdDate: '2025-10-14',
      expectedDelivery: '2025-10-22',
      priority: 'medium'
    },
    {
      id: 'PO-2025-147',
      vendor: 'Electronic Components Co',
      items: 12,
      totalAmount: 567000,
      status: 'pending_approval',
      createdDate: '2025-10-17',
      expectedDelivery: '2025-10-27',
      priority: 'high'
    },
    {
      id: 'PO-2025-148',
      vendor: 'Industrial Supplies Inc',
      items: 8,
      totalAmount: 890000,
      status: 'approved',
      createdDate: '2025-10-16',
      expectedDelivery: '2025-10-26',
      priority: 'low'
    }
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
            <p className="text-gray-600 mt-1">Purchase orders, vendor management, and procurement analytics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md">
            <ShoppingCart className="h-5 w-5" />
            New Purchase Order
          </button>
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
