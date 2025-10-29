'use client'

import { useState } from 'react'
import { Link2, ExternalLink, ArrowRight, FileText, Package, CreditCard, Wrench, TrendingUp, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui'

/**
 * Inter-Module Connection Types
 * Defines relationships between different ERP modules
 */

export interface ModuleConnection {
  id: string
  sourceModule: string
  targetModule: string
  connectionType: 'one-to-one' | 'one-to-many' | 'many-to-many'
  sourceRecord: {
    id: string
    type: string
    name: string
  }
  targetRecords: {
    id: string
    type: string
    name: string
    status?: string
    amount?: number
    date?: string
    url: string
  }[]
  status: 'active' | 'pending' | 'disconnected'
}

/**
 * CRM to Sales Connections
 */
export interface CRMToSalesConnection {
  opportunityId: string
  opportunityName: string
  quotes: {
    id: string
    name: string
    amount: number
    status: 'draft' | 'sent' | 'accepted' | 'rejected'
    validUntil: string
    url: string
  }[]
  orders: {
    id: string
    orderNumber: string
    amount: number
    status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
    orderDate: string
    url: string
  }[]
}

/**
 * CRM to Finance Connections
 */
export interface CRMToFinanceConnection {
  customerId: string
  customerName: string
  invoices: {
    id: string
    invoiceNumber: string
    amount: number
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
    dueDate: string
    url: string
  }[]
  payments: {
    id: string
    paymentNumber: string
    amount: number
    method: string
    status: 'pending' | 'completed' | 'failed'
    paymentDate: string
    url: string
  }[]
  creditLimit: number
  outstandingBalance: number
}

/**
 * Sales to Production Connections
 */
export interface SalesToProductionConnection {
  orderId: string
  orderNumber: string
  workOrders: {
    id: string
    workOrderNumber: string
    product: string
    quantity: number
    status: 'planned' | 'released' | 'in_progress' | 'completed' | 'on_hold'
    startDate: string
    endDate?: string
    url: string
  }[]
}

/**
 * Production to Inventory Connections
 */
export interface ProductionToInventoryConnection {
  workOrderId: string
  workOrderNumber: string
  materialConsumption: {
    id: string
    materialCode: string
    materialName: string
    quantityRequired: number
    quantityConsumed: number
    quantityAvailable: number
    status: 'available' | 'insufficient' | 'reserved'
    url: string
  }[]
  finishedGoods: {
    id: string
    productCode: string
    productName: string
    quantityProduced: number
    quantityReceived: number
    warehouseLocation: string
    url: string
  }[]
}

/**
 * Procurement to Inventory Connections
 */
export interface ProcurementToInventoryConnection {
  purchaseOrderId: string
  purchaseOrderNumber: string
  goodsReceipts: {
    id: string
    receiptNumber: string
    receivedDate: string
    items: {
      materialCode: string
      materialName: string
      orderedQuantity: number
      receivedQuantity: number
      status: 'complete' | 'partial' | 'pending'
    }[]
    url: string
  }[]
  qualityInspections: {
    id: string
    inspectionNumber: string
    status: 'passed' | 'failed' | 'pending'
    inspectionDate: string
    url: string
  }[]
}

/**
 * Reusable Component to Display Module Connections
 */
interface ModuleConnectionPanelProps {
  title: string
  icon: React.ReactNode
  connections: {
    label: string
    count: number
    items: {
      id: string
      name: string
      status: string
      statusColor: string
      url: string
      metadata?: { label: string; value: string }[]
    }[]
  }[]
  onCreateNew?: (type: string) => void
}

export function ModuleConnectionPanel({ title, icon, connections, onCreateNew }: ModuleConnectionPanelProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleNavigate = (url: string, name: string) => {
    addToast({
      title: 'Navigating',
      message: `Opening ${name}...`,
      variant: 'info'
    })
    router.push(url)
  }

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-600">Inter-module connections and related records</p>
            </div>
          </div>
          <Link2 className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Connection Sections */}
      <div className="p-4 space-y-3">
        {connections.map((connection, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => setExpandedSection(expandedSection === connection.label ? null : connection.label)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{connection.label}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {connection.count}
                </span>
              </div>
              <ArrowRight
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  expandedSection === connection.label ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Section Content */}
            {expandedSection === connection.label && (
              <div className="p-3 space-y-2 bg-white">
                {connection.items.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No {connection.label.toLowerCase()} found</p>
                    {onCreateNew && (
                      <button
                        onClick={() => onCreateNew(connection.label)}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Create New
                      </button>
                    )}
                  </div>
                ) : (
                  connection.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                      onClick={() => handleNavigate(item.url, item.name)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </div>
                        {item.metadata && (
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            {item.metadata.map((meta, i) => (
                              <span key={i}>
                                <span className="font-medium">{meta.label}:</span> {meta.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {onCreateNew && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <button
            onClick={() => onCreateNew('general')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Create New Record
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Specific Connection Components
 */

export function CRMToSalesConnections({ connection }: { connection: CRMToSalesConnection }) {
  const connections = [
    {
      label: 'Quotes',
      count: connection.quotes.length,
      items: connection.quotes.map(q => ({
        id: q.id,
        name: q.name,
        status: q.status.charAt(0).toUpperCase() + q.status.slice(1),
        statusColor:
          q.status === 'accepted' ? 'bg-green-100 text-green-700' :
          q.status === 'sent' ? 'bg-blue-100 text-blue-700' :
          q.status === 'rejected' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700',
        url: q.url,
        metadata: [
          { label: 'Amount', value: `₹${(q.amount / 100000).toFixed(2)}L` },
          { label: 'Valid Until', value: q.validUntil }
        ]
      }))
    },
    {
      label: 'Orders',
      count: connection.orders.length,
      items: connection.orders.map(o => ({
        id: o.id,
        name: o.orderNumber,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        statusColor:
          o.status === 'completed' ? 'bg-green-100 text-green-700' :
          o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
          o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700',
        url: o.url,
        metadata: [
          { label: 'Amount', value: `₹${(o.amount / 100000).toFixed(2)}L` },
          { label: 'Order Date', value: o.orderDate }
        ]
      }))
    }
  ]

  return (
    <ModuleConnectionPanel
      title="Sales Connections"
      icon={<FileText className="w-5 h-5" />}
      connections={connections}
    />
  )
}

export function CRMToFinanceConnections({ connection }: { connection: CRMToFinanceConnection }) {
  const connections = [
    {
      label: 'Invoices',
      count: connection.invoices.length,
      items: connection.invoices.map(inv => ({
        id: inv.id,
        name: inv.invoiceNumber,
        status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
        statusColor:
          inv.status === 'paid' ? 'bg-green-100 text-green-700' :
          inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
          inv.status === 'sent' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700',
        url: inv.url,
        metadata: [
          { label: 'Amount', value: `₹${(inv.amount / 100000).toFixed(2)}L` },
          { label: 'Due Date', value: inv.dueDate }
        ]
      }))
    },
    {
      label: 'Payments',
      count: connection.payments.length,
      items: connection.payments.map(pay => ({
        id: pay.id,
        name: pay.paymentNumber,
        status: pay.status.charAt(0).toUpperCase() + pay.status.slice(1),
        statusColor:
          pay.status === 'completed' ? 'bg-green-100 text-green-700' :
          pay.status === 'failed' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700',
        url: pay.url,
        metadata: [
          { label: 'Amount', value: `₹${(pay.amount / 100000).toFixed(2)}L` },
          { label: 'Date', value: pay.paymentDate },
          { label: 'Method', value: pay.method }
        ]
      }))
    }
  ]

  return (
    <div className="space-y-4">
      {/* Credit Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-purple-600 font-medium">Credit Limit</div>
            <div className="text-lg font-bold text-purple-900">
              ₹{(connection.creditLimit / 100000).toFixed(2)}L
            </div>
          </div>
          <div>
            <div className="text-xs text-orange-600 font-medium">Outstanding</div>
            <div className="text-lg font-bold text-orange-900">
              ₹{(connection.outstandingBalance / 100000).toFixed(2)}L
            </div>
          </div>
          <div>
            <div className="text-xs text-green-600 font-medium">Available Credit</div>
            <div className="text-lg font-bold text-green-900">
              ₹{((connection.creditLimit - connection.outstandingBalance) / 100000).toFixed(2)}L
            </div>
          </div>
        </div>
      </div>

      <ModuleConnectionPanel
        title="Finance Connections"
        icon={<CreditCard className="w-5 h-5" />}
        connections={connections}
      />
    </div>
  )
}

export function SalesToProductionConnections({ connection }: { connection: SalesToProductionConnection }) {
  const connections = [
    {
      label: 'Work Orders',
      count: connection.workOrders.length,
      items: connection.workOrders.map(wo => ({
        id: wo.id,
        name: wo.workOrderNumber,
        status: wo.status.replace('_', ' ').charAt(0).toUpperCase() + wo.status.slice(1),
        statusColor:
          wo.status === 'completed' ? 'bg-green-100 text-green-700' :
          wo.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
          wo.status === 'on_hold' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700',
        url: wo.url,
        metadata: [
          { label: 'Product', value: wo.product },
          { label: 'Qty', value: wo.quantity.toString() },
          { label: 'Start', value: wo.startDate }
        ]
      }))
    }
  ]

  return (
    <ModuleConnectionPanel
      title="Production Connections"
      icon={<Wrench className="w-5 h-5" />}
      connections={connections}
    />
  )
}

export function ProductionToInventoryConnections({ connection }: { connection: ProductionToInventoryConnection }) {
  const connections = [
    {
      label: 'Material Consumption',
      count: connection.materialConsumption.length,
      items: connection.materialConsumption.map(mat => ({
        id: mat.id,
        name: `${mat.materialCode} - ${mat.materialName}`,
        status: mat.status.charAt(0).toUpperCase() + mat.status.slice(1),
        statusColor:
          mat.status === 'available' ? 'bg-green-100 text-green-700' :
          mat.status === 'insufficient' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700',
        url: mat.url,
        metadata: [
          { label: 'Required', value: mat.quantityRequired.toString() },
          { label: 'Consumed', value: mat.quantityConsumed.toString() },
          { label: 'Available', value: mat.quantityAvailable.toString() }
        ]
      }))
    },
    {
      label: 'Finished Goods',
      count: connection.finishedGoods.length,
      items: connection.finishedGoods.map(fg => ({
        id: fg.id,
        name: `${fg.productCode} - ${fg.productName}`,
        status: 'Received',
        statusColor: 'bg-green-100 text-green-700',
        url: fg.url,
        metadata: [
          { label: 'Produced', value: fg.quantityProduced.toString() },
          { label: 'Received', value: fg.quantityReceived.toString() },
          { label: 'Location', value: fg.warehouseLocation }
        ]
      }))
    }
  ]

  return (
    <ModuleConnectionPanel
      title="Inventory Connections"
      icon={<Package className="w-5 h-5" />}
      connections={connections}
    />
  )
}

export function ProcurementToInventoryConnections({ connection }: { connection: ProcurementToInventoryConnection }) {
  const connections = [
    {
      label: 'Goods Receipts',
      count: connection.goodsReceipts.length,
      items: connection.goodsReceipts.map(gr => ({
        id: gr.id,
        name: gr.receiptNumber,
        status: `${gr.items.length} items`,
        statusColor: 'bg-blue-100 text-blue-700',
        url: gr.url,
        metadata: [
          { label: 'Date', value: gr.receivedDate },
          { label: 'Items', value: gr.items.length.toString() }
        ]
      }))
    },
    {
      label: 'Quality Inspections',
      count: connection.qualityInspections.length,
      items: connection.qualityInspections.map(qi => ({
        id: qi.id,
        name: qi.inspectionNumber,
        status: qi.status.charAt(0).toUpperCase() + qi.status.slice(1),
        statusColor:
          qi.status === 'passed' ? 'bg-green-100 text-green-700' :
          qi.status === 'failed' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700',
        url: qi.url,
        metadata: [
          { label: 'Date', value: qi.inspectionDate }
        ]
      }))
    }
  ]

  return (
    <ModuleConnectionPanel
      title="Inventory & Quality Connections"
      icon={<Package className="w-5 h-5" />}
      connections={connections}
    />
  )
}
