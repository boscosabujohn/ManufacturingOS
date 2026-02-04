'use client'

import { useState } from 'react'
import {
  Calculator,
  Package,
  TrendingUp,
  AlertCircle,
  FileText,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Layers
} from 'lucide-react'

interface StandardCost {
  id: string
  productCode: string
  productName: string
  category: string
  version: string
  effectiveDate: string
  expiryDate: string | null
  status: 'active' | 'draft' | 'expired' | 'superseded'
  materialCost: number
  laborCost: number
  overheadCost: number
  totalCost: number
  uom: string
  lastUpdated: string
  updatedBy: string
}

interface CostBreakdown {
  category: string
  items: {
    description: string
    quantity: number
    rate: number
    amount: number
    uom: string
  }[]
}

export default function StandardCostingPage() {
  const [standardCosts] = useState<StandardCost[]>([
    {
      id: 'SC-001',
      productCode: 'PRD-HP500',
      productName: 'Hydraulic Press HP-500',
      category: 'Finished Goods',
      version: 'V2.0',
      effectiveDate: '2025-01-01',
      expiryDate: null,
      status: 'active',
      materialCost: 850000,
      laborCost: 250000,
      overheadCost: 180000,
      totalCost: 1280000,
      uom: 'Each',
      lastUpdated: '2025-01-15',
      updatedBy: 'Cost Accountant'
    },
    {
      id: 'SC-002',
      productCode: 'PRD-CM350',
      productName: 'CNC Machine CM-350',
      category: 'Finished Goods',
      version: 'V1.5',
      effectiveDate: '2024-10-01',
      expiryDate: null,
      status: 'active',
      materialCost: 1250000,
      laborCost: 380000,
      overheadCost: 270000,
      totalCost: 1900000,
      uom: 'Each',
      lastUpdated: '2024-10-10',
      updatedBy: 'Cost Accountant'
    },
    {
      id: 'SC-003',
      productCode: 'PRD-CP1000',
      productName: 'Control Panel CP-1000',
      category: 'Finished Goods',
      version: 'V3.1',
      effectiveDate: '2025-03-01',
      expiryDate: null,
      status: 'active',
      materialCost: 420000,
      laborCost: 95000,
      overheadCost: 68000,
      totalCost: 583000,
      uom: 'Each',
      lastUpdated: '2025-03-05',
      updatedBy: 'Senior Cost Analyst'
    },
    {
      id: 'SC-004',
      productCode: 'PRD-CS200',
      productName: 'Conveyor System CS-200',
      category: 'Finished Goods',
      version: 'V2.2',
      effectiveDate: '2024-12-01',
      expiryDate: null,
      status: 'active',
      materialCost: 650000,
      laborCost: 180000,
      overheadCost: 125000,
      totalCost: 955000,
      uom: 'Each',
      lastUpdated: '2024-12-08',
      updatedBy: 'Cost Accountant'
    },
    {
      id: 'SC-005',
      productCode: 'PRD-HP400',
      productName: 'Hydraulic Press HP-400',
      category: 'Finished Goods',
      version: 'V1.8',
      effectiveDate: '2024-08-01',
      expiryDate: '2024-12-31',
      status: 'expired',
      materialCost: 720000,
      laborCost: 210000,
      overheadCost: 152000,
      totalCost: 1082000,
      uom: 'Each',
      lastUpdated: '2024-08-05',
      updatedBy: 'Former Cost Analyst'
    }
  ])

  const [selectedCost, setSelectedCost] = useState<StandardCost | null>(standardCosts[0])

  const materialBreakdown: CostBreakdown = {
    category: 'Materials',
    items: [
      { description: 'Steel Plates 304 Grade', quantity: 500, rate: 850, amount: 425000, uom: 'kg' },
      { description: 'Hydraulic Cylinders', quantity: 4, rate: 45000, amount: 180000, uom: 'pcs' },
      { description: 'Control Valves', quantity: 8, rate: 12500, amount: 100000, uom: 'pcs' },
      { description: 'Electrical Components', quantity: 1, rate: 85000, amount: 85000, uom: 'lot' },
      { description: 'Fasteners & Hardware', quantity: 1, rate: 35000, amount: 35000, uom: 'lot' },
      { description: 'Paint & Coating', quantity: 50, rate: 500, amount: 25000, uom: 'ltr' }
    ]
  }

  const laborBreakdown: CostBreakdown = {
    category: 'Labor',
    items: [
      { description: 'Fabrication Labor', quantity: 80, rate: 1200, amount: 96000, uom: 'hrs' },
      { description: 'Assembly Labor', quantity: 60, rate: 1100, amount: 66000, uom: 'hrs' },
      { description: 'Testing & QC', quantity: 24, rate: 1500, amount: 36000, uom: 'hrs' },
      { description: 'Finishing & Painting', quantity: 32, rate: 950, amount: 30400, uom: 'hrs' },
      { description: 'Supervision', quantity: 16, rate: 1350, amount: 21600, uom: 'hrs' }
    ]
  }

  const overheadBreakdown: CostBreakdown = {
    category: 'Overheads',
    items: [
      { description: 'Factory Rent & Utilities', quantity: 1, rate: 45000, amount: 45000, uom: 'allocation' },
      { description: 'Machine Depreciation', quantity: 1, rate: 58000, amount: 58000, uom: 'allocation' },
      { description: 'Quality Control', quantity: 1, rate: 22000, amount: 22000, uom: 'allocation' },
      { description: 'Maintenance & Tools', quantity: 1, rate: 18000, amount: 18000, uom: 'allocation' },
      { description: 'Administration', quantity: 1, rate: 25000, amount: 25000, uom: 'allocation' },
      { description: 'Other Overheads', quantity: 1, rate: 12000, amount: 12000, uom: 'allocation' }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'superseded':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalMaterial = materialBreakdown.items.reduce((sum, item) => sum + item.amount, 0)
  const totalLabor = laborBreakdown.items.reduce((sum, item) => sum + item.amount, 0)
  const totalOverhead = overheadBreakdown.items.reduce((sum, item) => sum + item.amount, 0)
  const grandTotal = totalMaterial + totalLabor + totalOverhead

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-3 py-2">
      <div className="w-full space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Standard Costing</h1>
            <p className="text-gray-600 mt-1">Define and manage standard costs for products</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md">
            <Calculator className="h-5 w-5" />
            New Standard Cost
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Standards</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{standardCosts.filter(c => c.status === 'active').length}</p>
                <p className="text-xs text-blue-700 mt-1">Products</p>
              </div>
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg Material Cost</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {formatCurrency(standardCosts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.materialCost, 0) / standardCosts.filter(c => c.status === 'active').length)}
                </p>
                <p className="text-xs text-green-700 mt-1">Per unit</p>
              </div>
              <Package className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Draft Standards</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{standardCosts.filter(c => c.status === 'draft').length}</p>
                <p className="text-xs text-purple-700 mt-1">Pending approval</p>
              </div>
              <Clock className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Expired</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{standardCosts.filter(c => c.status === 'expired').length}</p>
                <p className="text-xs text-orange-700 mt-1">Need update</p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Standard Costs List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Standard Costs</h2>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-3">
                {standardCosts.map((cost) => (
                  <div
                    key={cost.id}
                    onClick={() => setSelectedCost(cost)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCost?.id === cost.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{cost.productName}</p>
                        <p className="text-sm text-gray-600 mt-1">{cost.productCode}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cost.status)}`}>
                        {cost.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(cost.totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Version: {cost.version}</span>
                        <span className="text-gray-500">{cost.effectiveDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cost Breakdown Details */}
          <div className="lg:col-span-2 space-y-3">
            {selectedCost && (
              <>
                {/* Header Card */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-3 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCost.productName}</h2>
                      <p className="text-purple-100 mt-1">{selectedCost.productCode} • Version {selectedCost.version}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm">
                        <Eye className="h-5 w-5" />
                        <span>View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm">
                        <Edit className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-purple-200 text-sm">Material Cost</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(selectedCost.materialCost)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Labor Cost</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(selectedCost.laborCost)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Overhead Cost</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(selectedCost.overheadCost)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-400/30">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-100">Total Standard Cost</span>
                      <span className="text-3xl font-bold">{formatCurrency(selectedCost.totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {/* Material Breakdown */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Package className="h-5 w-5 text-green-600" />
                          Materials
                        </h4>
                        <span className="font-bold text-green-600">{formatCurrency(totalMaterial)}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Qty</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Rate</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {materialBreakdown.items.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-900">{item.description}</td>
                                <td className="px-4 py-2 text-right text-gray-600">{item.quantity} {item.uom}</td>
                                <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                                <td className="px-4 py-2 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Labor Breakdown */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Layers className="h-5 w-5 text-blue-600" />
                          Labor
                        </h4>
                        <span className="font-bold text-blue-600">{formatCurrency(totalLabor)}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Hours</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Rate</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {laborBreakdown.items.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-900">{item.description}</td>
                                <td className="px-4 py-2 text-right text-gray-600">{item.quantity} {item.uom}</td>
                                <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                                <td className="px-4 py-2 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Overhead Breakdown */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          Overheads
                        </h4>
                        <span className="font-bold text-purple-600">{formatCurrency(totalOverhead)}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-600">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {overheadBreakdown.items.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-900">{item.description}</td>
                                <td className="px-4 py-2 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="pt-4 border-t-2 border-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total Standard Cost</span>
                        <span className="text-2xl font-bold text-purple-600">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
