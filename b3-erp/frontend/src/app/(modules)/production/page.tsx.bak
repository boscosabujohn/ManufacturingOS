'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Factory,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Settings,
  Users,
  ArrowUpRight,
  Activity
} from 'lucide-react'
import { KPICard, CardSkeleton } from '@/components/ui'

interface ProductionStats {
  activeWorkOrders: number
  completedToday: number
  pendingOrders: number
  rejectedUnits: number
  productionEfficiency: number
  oeeScore: number
  activeLines: number
  totalLines: number
  workforce: number
  plannedOutput: number
  actualOutput: number
}

interface WorkOrder {
  id: string
  product: string
  orderQty: number
  completedQty: number
  status: 'in_progress' | 'completed' | 'pending' | 'delayed'
  priority: 'high' | 'medium' | 'low'
  productionLine: string
  targetDate: string
  progress: number
}

interface ProductionLine {
  id: string
  name: string
  status: 'running' | 'idle' | 'maintenance' | 'stopped'
  currentProduct: string
  efficiency: number
  output: number
  target: number
}

export default function ProductionDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats] = useState<ProductionStats>({
    activeWorkOrders: 45,
    completedToday: 12,
    pendingOrders: 28,
    rejectedUnits: 3,
    productionEfficiency: 87.5,
    oeeScore: 82.3,
    activeLines: 8,
    totalLines: 10,
    workforce: 156,
    plannedOutput: 1200,
    actualOutput: 1050
  })

  const [activeOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-2025-089',
      product: 'Hydraulic Press HP-500',
      orderQty: 50,
      completedQty: 35,
      status: 'in_progress',
      priority: 'high',
      productionLine: 'Line A',
      targetDate: '2025-10-20',
      progress: 70
    },
    {
      id: 'WO-2025-087',
      product: 'Control Panel CP-1000',
      orderQty: 30,
      completedQty: 18,
      status: 'in_progress',
      priority: 'medium',
      productionLine: 'Line B',
      targetDate: '2025-10-22',
      progress: 60
    },
    {
      id: 'WO-2025-092',
      product: 'CNC Machine CM-350',
      orderQty: 20,
      completedQty: 5,
      status: 'delayed',
      priority: 'high',
      productionLine: 'Line C',
      targetDate: '2025-10-19',
      progress: 25
    },
    {
      id: 'WO-2025-084',
      product: 'Conveyor System CS-200',
      orderQty: 15,
      completedQty: 15,
      status: 'completed',
      priority: 'low',
      productionLine: 'Line D',
      targetDate: '2025-10-18',
      progress: 100
    }
  ])

  const [productionLines] = useState<ProductionLine[]>([
    {
      id: 'LINE-A',
      name: 'Production Line A',
      status: 'running',
      currentProduct: 'Hydraulic Press HP-500',
      efficiency: 92,
      output: 138,
      target: 150
    },
    {
      id: 'LINE-B',
      name: 'Production Line B',
      status: 'running',
      currentProduct: 'Control Panel CP-1000',
      efficiency: 85,
      output: 102,
      target: 120
    },
    {
      id: 'LINE-C',
      name: 'Production Line C',
      status: 'running',
      currentProduct: 'CNC Machine CM-350',
      efficiency: 78,
      output: 78,
      target: 100
    },
    {
      id: 'LINE-D',
      name: 'Production Line D',
      status: 'idle',
      currentProduct: '-',
      efficiency: 0,
      output: 0,
      target: 0
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200'
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

  const getLineStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'idle':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'stopped':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Production Management</h1>
            <p className="text-gray-600 mt-1">Real-time production monitoring and control</p>
          </div>
          <Link
            href="/production/work-orders/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
          >
            <Factory className="h-5 w-5" />
            <span>New Work Order</span>
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
               
                value={stats.activeWorkOrders}
                icon={Factory}
                color="blue"
                description={`${stats.completedToday} completed today`}
              />
              <KPICard
               
                value={`${stats.productionEfficiency}%`}
                icon={TrendingUp}
                color="green"
                description="Target: 85%"
              />
              <KPICard
               
                value={`${stats.oeeScore}%`}
                icon={BarChart3}
                color="purple"
                description="Overall Equipment Effectiveness"
              />
              <KPICard
               
                value={`${stats.activeLines}/${stats.totalLines}`}
                icon={Settings}
                color="yellow"
                description={`${stats.workforce} workers active`}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Work Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Active Work Orders</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{order.product}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{order.completedQty}/{order.orderQty} units</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-gray-600">{order.productionLine}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getPriorityColor(order.priority)}`}>
                            {order.priority.toUpperCase()}
                          </span>
                          <span className="text-gray-600">Due: {order.targetDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Production Lines Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Production Lines</h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {stats.activeLines} Active
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {productionLines.map((line) => (
                  <div key={line.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{line.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{line.currentProduct}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLineStatusColor(line.status)}`}>
                        {line.status.toUpperCase()}
                      </span>
                    </div>
                    {line.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Efficiency</span>
                          <span className="font-medium text-gray-900">{line.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              line.efficiency >= 90
                                ? 'bg-green-500'
                                : line.efficiency >= 75
                                ? 'bg-blue-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${line.efficiency}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm mt-3">
                          <span className="text-gray-600">Output</span>
                          <span className="font-medium text-gray-900">
                            {line.output}/{line.target} units
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Production Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Output</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.actualOutput}</p>
                <p className="text-xs text-gray-500 mt-1">Target: {stats.plannedOutput} units</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(stats.actualOutput / stats.plannedOutput) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
                <p className="text-xs text-orange-600 mt-1">Requires scheduling</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quality Rejects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.rejectedUnits}</p>
                <p className="text-xs text-green-600 mt-1">0.3% rejection rate</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
