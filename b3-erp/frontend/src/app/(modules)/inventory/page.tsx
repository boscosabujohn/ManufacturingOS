'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import { KPICard, CardSkeleton } from '@/components/ui'
import {
  ViewStockDetailsModal,
  AddStockItemModal,
  QuickAdjustmentModal,
  LowStockAlertModal,
  StockItem,
  AddStockItemData,
  QuickAdjustmentData,
  LowStockItem as ModalLowStockItem
} from '@/components/inventory/InventoryStockModals'
import { ExportStockDataModal, ExportStockDataConfig } from '@/components/inventory/InventoryExportModals'

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
  const [isLoading, setIsLoading] = useState(false)
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

  // Modal state
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isQuickAdjustOpen, setIsQuickAdjustOpen] = useState(false)
  const [isLowStockAlertOpen, setIsLowStockAlertOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

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

  // Modal handlers
  const handleViewItem = (item: any) => {
    // Convert to StockItem format
    const stockItem: StockItem = {
      id: item.id,
      itemCode: item.sku || item.itemCode || '',
      itemName: item.name || item.itemName || '',
      description: item.description || '',
      category: item.category || '',
      uom: item.uom || 'Pieces',
      barcode: item.barcode || '',
      currentQuantity: item.currentStock || item.quantity || item.current_quantity || 0,
      available: item.available || item.currentStock || item.quantity || 0,
      reserved: item.reserved || 0,
      onOrder: item.on_order || 0,
      minLevel: item.min_level || 0,
      maxLevel: item.max_level || 100,
      reorderPoint: item.reorderLevel || item.reorder_point || 10,
      safetyStock: item.safety_stock || 5,
      costPrice: item.cost_price || 0,
      sellingPrice: item.selling_price || 0,
      supplier: item.supplier || '',
      leadTime: item.lead_time || 7,
      valuationMethod: item.valuation_method || 'FIFO',
      enableSerial: item.enable_serial || false,
      enableBatch: item.enable_batch || false,
      trackExpiry: item.track_expiry || false,
      status: item.status || 'active',
      locations: item.locations || []
    }
    setSelectedItem(stockItem)
    setIsViewDetailsOpen(true)
  }

  const handleAddItem = () => {
    setIsAddItemOpen(true)
  }

  const handleAddItemSubmit = (data: AddStockItemData) => {
    console.log('Adding stock item:', data)
    // TODO: Implement API call to add stock item
    setIsAddItemOpen(false)
  }

  const handleQuickAdjust = () => {
    if (selectedItem) {
      setIsViewDetailsOpen(false)
      setIsQuickAdjustOpen(true)
    }
  }

  const handleQuickAdjustSubmit = (data: QuickAdjustmentData) => {
    console.log('Adjusting stock:', data)
    // TODO: Implement API call to adjust stock
    setIsQuickAdjustOpen(false)
  }

  const handleLowStockAlert = () => {
    setIsLowStockAlertOpen(true)
  }

  const handleExport = () => {
    setIsExportOpen(true)
  }

  const handleExportSubmit = (config: ExportStockDataConfig) => {
    console.log('Exporting stock data:', config)
    // TODO: Implement API call to export stock data
    setIsExportOpen(false)
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowUpRight className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              <Package className="h-5 w-5" />
              <span>Add Stock Item</span>
            </button>
          </div>
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
               
                value={stats.totalItems.toLocaleString()}
                icon={Package}
                color="blue"
                description="Active SKUs"
              />
              <KPICard
               
                value={`₹${(stats.totalValue / 10000000).toFixed(1)}Cr`}
                icon={BarChart3}
                color="green"
                description="Current Inventory"
              />
              <KPICard
               
                value={stats.lowStockItems}
                icon={AlertTriangle}
                color="red"
                description={`${stats.outOfStockItems} out of stock`}
              />
              <KPICard
               
                value={stats.warehouseCount}
                icon={Warehouse}
                color="purple"
                description={`${stats.stockAccuracy}% accuracy`}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Stock Movements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Movements</h2>
                <Link
                  href="/inventory/movements"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
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
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    {lowStockItems.length} Items
                  </span>
                  <button
                    onClick={handleLowStockAlert}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleViewItem(item)}
                    className="flex items-start justify-between p-3 rounded-lg border border-orange-200 bg-orange-50 cursor-pointer hover:shadow-md transition-shadow"
                  >
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewItem(item)
                        }}
                        className="mt-2 px-3 py-1 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700 transition-colors"
                      >
                        View Details
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
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard
               
                value={`${stats.avgTurnoverRate}x`}
                icon={RefreshCw}
                color="blue"
                trend={{ value: 12, isPositive: true, label: 'from last month' }}
              />
              <KPICard
               
                value={stats.monthlyMovements}
                icon={Activity}
                color="green"
                trend={{ value: 8, isPositive: true, label: 'from last month' }}
              />
              <KPICard
               
                value={`${stats.stockAccuracy}%`}
                icon={BarChart3}
                color="purple"
                trend={{ value: 0.5, isPositive: true, label: 'from last cycle' }}
              />
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewStockDetailsModal
        isOpen={isViewDetailsOpen}
        onClose={() => setIsViewDetailsOpen(false)}
        item={selectedItem}
        onEdit={() => alert('Edit not implemented yet')}
        onAdjust={handleQuickAdjust}
        onTransfer={() => alert('Transfer not implemented yet')}
        onGenerateBarcode={() => alert('Barcode generation not implemented yet')}
        onExport={handleExport}
      />

      <AddStockItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSubmit={handleAddItemSubmit}
      />

      <QuickAdjustmentModal
        isOpen={isQuickAdjustOpen}
        onClose={() => setIsQuickAdjustOpen(false)}
        onAdjust={handleQuickAdjustSubmit}
        item={selectedItem}
      />

      <LowStockAlertModal
        isOpen={isLowStockAlertOpen}
        onClose={() => setIsLowStockAlertOpen(false)}
        items={[]} // TODO: Pass actual low stock items - needs conversion to ModalLowStockItem format
        onCreatePurchaseOrders={(ids) => console.log('Create POs for:', ids)}
        onAdjustLevels={(ids) => console.log('Adjust levels for:', ids)}
        onDismissAlerts={(ids) => console.log('Dismiss alerts for:', ids)}
      />

      <ExportStockDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExportSubmit}
      />
    </div>
  )
}
