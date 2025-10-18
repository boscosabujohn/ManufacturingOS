'use client'

import { useState } from 'react'
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Warehouse,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  Activity
} from 'lucide-react'

interface InventoryStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  warehouseCount: number
  avgTurnoverRate: number
  monthlyMovements: number
  stockAccuracy: number
}

interface StockMovement {
  id: string
  item: string
  type: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  warehouse: string
  date: string
  reference: string
}

interface LowStockItem {
  id: string
  name: string
  sku: string
  currentStock: number
  reorderLevel: number
  warehouse: string
  category: string
}

export default function InventoryDashboard() {
  const [stats] = useState<InventoryStats>({
    totalItems: 1248,
    totalValue: 45680000,
    lowStockItems: 23,
    outOfStockItems: 5,
    warehouseCount: 4,
    avgTurnoverRate: 8.5,
    monthlyMovements: 456,
    stockAccuracy: 98.5
  })

  const [recentMovements] = useState<StockMovement[]>([
    {
      id: 'MOV-001',
      item: 'Steel Sheet 304 - 2mm',
      type: 'in',
      quantity: 500,
      warehouse: 'Main Warehouse',
      date: '2025-10-18',
      reference: 'PO-2025-145'
    },
    {
      id: 'MOV-002',
      item: 'Hydraulic Pump HP-500',
      type: 'out',
      quantity: 10,
      warehouse: 'Main Warehouse',
      date: '2025-10-18',
      reference: 'WO-2025-089'
    },
    {
      id: 'MOV-003',
      item: 'Bearing 6205-2RS',
      type: 'transfer',
      quantity: 50,
      warehouse: 'Main to Regional',
      date: '2025-10-17',
      reference: 'TRF-2025-034'
    },
    {
      id: 'MOV-004',
      item: 'Control Panel CP-1000',
      type: 'out',
      quantity: 3,
      warehouse: 'Regional Warehouse',
      date: '2025-10-17',
      reference: 'WO-2025-087'
    },
    {
      id: 'MOV-005',
      item: 'Motor 3-Phase 5HP',
      type: 'adjustment',
      quantity: -2,
      warehouse: 'Main Warehouse',
      date: '2025-10-16',
      reference: 'ADJ-2025-012'
    }
  ])

  const [lowStockItems] = useState<LowStockItem[]>([
    {
      id: 'ITM-001',
      name: 'Welding Electrode E7018',
      sku: 'WE-7018-3.2',
      currentStock: 15,
      reorderLevel: 50,
      warehouse: 'Main Warehouse',
      category: 'Consumables'
    },
    {
      id: 'ITM-002',
      name: 'Hydraulic Oil ISO 68',
      sku: 'OIL-HYD-68',
      currentStock: 8,
      reorderLevel: 20,
      warehouse: 'Main Warehouse',
      category: 'Lubricants'
    },
    {
      id: 'ITM-003',
      name: 'Safety Gloves Type A',
      sku: 'PPE-GLV-A',
      currentStock: 25,
      reorderLevel: 100,
      warehouse: 'Regional Warehouse',
      category: 'PPE'
    },
    {
      id: 'ITM-004',
      name: 'PLC Module SM-321',
      sku: 'PLC-SM321',
      currentStock: 2,
      reorderLevel: 5,
      warehouse: 'Main Warehouse',
      category: 'Electronics'
    }
  ])

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case 'out':
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'transfer':
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      case 'adjustment':
        return <Activity className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getMovementBadgeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'out':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'transfer':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'adjustment':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Real-time stock tracking and warehouse management</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
            <Package className="h-5 w-5" />
            New Stock Entry
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalItems.toLocaleString()}</p>
                <p className="text-xs text-blue-700 mt-1">Active SKUs</p>
              </div>
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900 mt-1">₹{(stats.totalValue / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-green-700 mt-1">Current Inventory</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.lowStockItems}</p>
                <p className="text-xs text-orange-700 mt-1">{stats.outOfStockItems} out of stock</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Warehouses</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.warehouseCount}</p>
                <p className="text-xs text-purple-700 mt-1">{stats.stockAccuracy}% accuracy</p>
              </div>
              <Warehouse className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Stock Movements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Movements</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getMovementIcon(movement.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{movement.item}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getMovementBadgeColor(movement.type)}`}>
                            {movement.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{movement.warehouse}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Ref: {movement.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{movement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {lowStockItems.length} Items
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <p className="font-medium text-gray-900">{item.name}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">SKU: {item.sku}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">{item.warehouse}</span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">{item.currentStock} units</p>
                      <p className="text-xs text-gray-500 mt-1">Min: {item.reorderLevel}</p>
                      <button className="mt-2 px-3 py-1 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700 transition-colors">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Turnover Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgTurnoverRate}x</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Movements</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.monthlyMovements}</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.stockAccuracy}%</p>
                <p className="text-xs text-green-600 mt-1">+0.5% from last cycle</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
