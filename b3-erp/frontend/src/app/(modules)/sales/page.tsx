'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  FileText,
  CheckCircle,
  Target,
  ArrowUpRight,
  Award
} from 'lucide-react'
import { KPICard, CardSkeleton } from '@/components/ui'

interface SalesStats {
  totalRevenue: number
  revenueGrowth: number
  activeOrders: number
  pendingQuotations: number
  customersActive: number
  avgOrderValue: number
  conversionRate: number
  targetAchievement: number
  ordersThisMonth: number
  quotationsThisMonth: number
}

interface SalesOrder {
  id: string
  customer: string
  product: string
  quantity: number
  value: number
  status: 'draft' | 'confirmed' | 'in_production' | 'ready_to_ship' | 'shipped' | 'delivered'
  orderDate: string
  deliveryDate: string
  priority: 'high' | 'medium' | 'low'
}

interface TopCustomer {
  id: string
  name: string
  industry: string
  totalOrders: number
  totalRevenue: number
  activeOrders: number
  creditLimit: number
  outstandingAmount: number
}

export default function SalesDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats] = useState<SalesStats>({
    totalRevenue: 125680000,
    revenueGrowth: 18.5,
    activeOrders: 67,
    pendingQuotations: 34,
    customersActive: 145,
    avgOrderValue: 1875000,
    conversionRate: 42.5,
    targetAchievement: 87.3,
    ordersThisMonth: 89,
    quotationsThisMonth: 134
  })

  const [recentOrders] = useState<SalesOrder[]>([
    {
      id: 'SO-2025-234',
      customer: 'ABC Manufacturing Ltd',
      product: 'Hydraulic Press HP-500',
      quantity: 10,
      value: 25000000,
      status: 'in_production',
      orderDate: '2025-10-12',
      deliveryDate: '2025-11-15',
      priority: 'high'
    },
    {
      id: 'SO-2025-235',
      customer: 'XYZ Industries Inc',
      product: 'CNC Machine CM-350',
      quantity: 5,
      value: 18750000,
      status: 'confirmed',
      orderDate: '2025-10-15',
      deliveryDate: '2025-11-20',
      priority: 'high'
    },
    {
      id: 'SO-2025-236',
      customer: 'Tech Solutions Pvt Ltd',
      product: 'Control Panel CP-1000',
      quantity: 15,
      value: 12000000,
      status: 'ready_to_ship',
      orderDate: '2025-10-10',
      deliveryDate: '2025-10-22',
      priority: 'medium'
    },
    {
      id: 'SO-2025-237',
      customer: 'Global Exports Corp',
      product: 'Conveyor System CS-200',
      quantity: 8,
      value: 9600000,
      status: 'shipped',
      orderDate: '2025-10-08',
      deliveryDate: '2025-10-20',
      priority: 'low'
    }
  ])

  const [topCustomers] = useState<TopCustomer[]>([
    {
      id: 'CUST-001',
      name: 'ABC Manufacturing Ltd',
      industry: 'Automotive',
      totalOrders: 45,
      totalRevenue: 450000000,
      activeOrders: 8,
      creditLimit: 50000000,
      outstandingAmount: 12500000
    },
    {
      id: 'CUST-002',
      name: 'XYZ Industries Inc',
      industry: 'Heavy Engineering',
      totalOrders: 38,
      totalRevenue: 380000000,
      activeOrders: 5,
      creditLimit: 40000000,
      outstandingAmount: 8000000
    },
    {
      id: 'CUST-003',
      name: 'Tech Solutions Pvt Ltd',
      industry: 'Electronics',
      totalOrders: 52,
      totalRevenue: 320000000,
      activeOrders: 6,
      creditLimit: 35000000,
      outstandingAmount: 5600000
    },
    {
      id: 'CUST-004',
      name: 'Global Exports Corp',
      industry: 'Exports',
      totalOrders: 29,
      totalRevenue: 275000000,
      activeOrders: 4,
      creditLimit: 30000000,
      outstandingAmount: 4200000
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'in_production':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'ready_to_ship':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'shipped':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
            <p className="text-gray-600 mt-1">Sales orders, quotations, and customer management</p>
          </div>
          <Link
            href="/sales/orders/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-md"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>New Sales Order</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard

                value={`₹${(stats.totalRevenue / 10000000).toFixed(1)}Cr`}
                icon={DollarSign}
                color="green"
                trend={{ value: stats.revenueGrowth, isPositive: true, label: 'growth' }}
              />
              <KPICard

                value={stats.activeOrders}
                icon={ShoppingBag}
                color="blue"
                description={`${stats.ordersThisMonth} this month`}
              />
              <KPICard

                value={stats.customersActive}
                icon={Users}
                color="purple"
                description={`${stats.conversionRate}% conversion`}
              />
              <KPICard

                value={`${stats.targetAchievement}%`}
                icon={Target}
                color="yellow"
                description="Monthly target"
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Sales Orders</h2>
                <Link
                  href="/sales/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-700">{order.product}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {order.quantity} units</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">₹{(order.value / 10000000).toFixed(2)}Cr</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority.toUpperCase()}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">Delivery: {order.deliveryDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
                <Link
                  href="/sales/customers"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{customer.industry}</p>
                      </div>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Total Revenue</p>
                        <p className="font-semibold text-gray-900">₹{(customer.totalRevenue / 10000000).toFixed(1)}Cr</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Active Orders</p>
                        <p className="font-semibold text-gray-900">{customer.activeOrders}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Total Orders</p>
                        <p className="font-semibold text-gray-900">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Outstanding</p>
                        <p className="font-semibold text-orange-600">₹{(customer.outstandingAmount / 10000000).toFixed(1)}Cr</p>
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
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard

                value={`₹${(stats.avgOrderValue / 100000).toFixed(1)}L`}
                icon={TrendingUp}
                color="green"
                trend={{ value: 12, isPositive: true, label: 'from last month' }}
              />
              <KPICard

                value={stats.pendingQuotations}
                icon={FileText}
                color="yellow"
                description={`${stats.quotationsThisMonth} sent this month`}
              />
              <KPICard

                value={`${stats.conversionRate}%`}
                icon={CheckCircle}
                color="blue"
                trend={{ value: 3.5, isPositive: true, label: 'improvement' }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
