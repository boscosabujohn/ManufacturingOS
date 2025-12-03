'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Layers,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface MaterialCost {
  id: string
  materialCode: string
  materialName: string
  category: string
  unit: string
  standardCost: number
  currentCost: number
  variance: number
  variancePercent: number
  supplier: string
  lastPurchasePrice: number
  lastPurchaseDate: string
  avgLeadTime: number
  minimumOrderQty: number
  usagePerMonth: number
  status: 'stable' | 'increasing' | 'decreasing' | 'volatile'
}

interface CategoryStats {
  category: string
  totalMaterials: number
  avgCost: number
  totalVariance: number
  status: 'stable' | 'increasing' | 'decreasing'
}

export default function MaterialsCostingPage() {
  const router = useRouter()

  const [materialCosts] = useState<MaterialCost[]>([
    {
      id: 'MAT-001',
      materialCode: 'SS304-18G',
      materialName: 'Stainless Steel 304 - 18 Gauge Sheet',
      category: 'Raw Material - Sinks',
      unit: 'SQ.FT',
      standardCost: 185,
      currentCost: 195,
      variance: 10,
      variancePercent: 5.4,
      supplier: 'Steel India Ltd',
      lastPurchasePrice: 195,
      lastPurchaseDate: '2025-10-15',
      avgLeadTime: 7,
      minimumOrderQty: 100,
      usagePerMonth: 450,
      status: 'increasing'
    },
    {
      id: 'MAT-002',
      materialCode: 'BRASS-C360',
      materialName: 'Brass C360 Rod for Faucet Bodies',
      category: 'Raw Material - Faucets',
      unit: 'KG',
      standardCost: 680,
      currentCost: 665,
      variance: -15,
      variancePercent: -2.2,
      supplier: 'Metals Trading Co',
      lastPurchasePrice: 665,
      lastPurchaseDate: '2025-10-12',
      avgLeadTime: 5,
      minimumOrderQty: 50,
      usagePerMonth: 180,
      status: 'decreasing'
    },
    {
      id: 'MAT-003',
      materialCode: 'GRANITE-BLK',
      materialName: 'Black Galaxy Granite Slab',
      category: 'Raw Material - Countertops',
      unit: 'SQ.FT',
      standardCost: 425,
      currentCost: 425,
      variance: 0,
      variancePercent: 0,
      supplier: 'Stone Masters Pvt Ltd',
      lastPurchasePrice: 425,
      lastPurchaseDate: '2025-10-10',
      avgLeadTime: 10,
      minimumOrderQty: 50,
      usagePerMonth: 220,
      status: 'stable'
    },
    {
      id: 'MAT-004',
      materialCode: 'CHROME-PL',
      materialName: 'Chrome Plating Material',
      category: 'Finishing - Faucets',
      unit: 'LITER',
      standardCost: 1250,
      currentCost: 1340,
      variance: 90,
      variancePercent: 7.2,
      supplier: 'Chemical Solutions Ltd',
      lastPurchasePrice: 1340,
      lastPurchaseDate: '2025-10-18',
      avgLeadTime: 3,
      minimumOrderQty: 20,
      usagePerMonth: 85,
      status: 'volatile'
    },
    {
      id: 'MAT-005',
      materialCode: 'ALUM-CAST',
      materialName: 'Aluminum Alloy for Cookware Casting',
      category: 'Raw Material - Cookware',
      unit: 'KG',
      standardCost: 285,
      currentCost: 275,
      variance: -10,
      variancePercent: -3.5,
      supplier: 'Aluminum Corp India',
      lastPurchasePrice: 275,
      lastPurchaseDate: '2025-10-16',
      avgLeadTime: 4,
      minimumOrderQty: 100,
      usagePerMonth: 320,
      status: 'stable'
    },
    {
      id: 'MAT-006',
      materialCode: 'TEFLON-COAT',
      materialName: 'Non-Stick Teflon Coating',
      category: 'Finishing - Cookware',
      unit: 'KG',
      standardCost: 1850,
      currentCost: 1920,
      variance: 70,
      variancePercent: 3.8,
      supplier: 'Coating Tech Pvt Ltd',
      lastPurchasePrice: 1920,
      lastPurchaseDate: '2025-10-14',
      avgLeadTime: 6,
      minimumOrderQty: 25,
      usagePerMonth: 65,
      status: 'increasing'
    },
    {
      id: 'MAT-007',
      materialCode: 'MOTOR-1HP',
      materialName: '1HP Motor for Kitchen Chimney',
      category: 'Components - Appliances',
      unit: 'PCS',
      standardCost: 3200,
      currentCost: 3150,
      variance: -50,
      variancePercent: -1.6,
      supplier: 'Motors & Drives Ltd',
      lastPurchasePrice: 3150,
      lastPurchaseDate: '2025-10-13',
      avgLeadTime: 12,
      minimumOrderQty: 10,
      usagePerMonth: 85,
      status: 'stable'
    },
    {
      id: 'MAT-008',
      materialCode: 'PLY-BWP',
      materialName: 'BWP Grade Plywood for Cabinets',
      category: 'Raw Material - Cabinets',
      unit: 'SHEET',
      standardCost: 1450,
      currentCost: 1520,
      variance: 70,
      variancePercent: 4.8,
      supplier: 'Wood Industries Ltd',
      lastPurchasePrice: 1520,
      lastPurchaseDate: '2025-10-17',
      avgLeadTime: 5,
      minimumOrderQty: 20,
      usagePerMonth: 140,
      status: 'increasing'
    },
    {
      id: 'MAT-009',
      materialCode: 'QUARTZ-WHT',
      materialName: 'White Quartz Stone Slab',
      category: 'Raw Material - Countertops',
      unit: 'SQ.FT',
      standardCost: 385,
      currentCost: 385,
      variance: 0,
      variancePercent: 0,
      supplier: 'Stone Masters Pvt Ltd',
      lastPurchasePrice: 385,
      lastPurchaseDate: '2025-10-11',
      avgLeadTime: 10,
      minimumOrderQty: 50,
      usagePerMonth: 195,
      status: 'stable'
    },
    {
      id: 'MAT-010',
      materialCode: 'SILICONE-SEAL',
      materialName: 'Food Grade Silicone Sealant',
      category: 'Components - Sinks',
      unit: 'TUBE',
      standardCost: 145,
      currentCost: 158,
      variance: 13,
      variancePercent: 9.0,
      supplier: 'Sealants & Adhesives Co',
      lastPurchasePrice: 158,
      lastPurchaseDate: '2025-10-19',
      avgLeadTime: 3,
      minimumOrderQty: 50,
      usagePerMonth: 280,
      status: 'volatile'
    },
    {
      id: 'MAT-011',
      materialCode: 'RUBBER-GSKT',
      materialName: 'EPDM Rubber Gaskets',
      category: 'Components - Faucets',
      unit: 'PCS',
      standardCost: 12,
      currentCost: 12,
      variance: 0,
      variancePercent: 0,
      supplier: 'Rubber Products Ltd',
      lastPurchasePrice: 12,
      lastPurchaseDate: '2025-10-08',
      avgLeadTime: 4,
      minimumOrderQty: 500,
      usagePerMonth: 1850,
      status: 'stable'
    },
    {
      id: 'MAT-012',
      materialCode: 'PAINT-ENAMEL',
      materialName: 'Heat Resistant Enamel Paint',
      category: 'Finishing - Appliances',
      unit: 'LITER',
      standardCost: 680,
      currentCost: 715,
      variance: 35,
      variancePercent: 5.1,
      supplier: 'Industrial Paints Ltd',
      lastPurchasePrice: 715,
      lastPurchaseDate: '2025-10-16',
      avgLeadTime: 4,
      minimumOrderQty: 10,
      usagePerMonth: 45,
      status: 'increasing'
    }
  ])

  const [categoryStats] = useState<CategoryStats[]>([
    { category: 'Raw Material - Sinks', totalMaterials: 8, avgCost: 1850, totalVariance: 4.2, status: 'increasing' },
    { category: 'Raw Material - Faucets', totalMaterials: 6, avgCost: 2150, totalVariance: -1.5, status: 'stable' },
    { category: 'Raw Material - Countertops', totalMaterials: 5, avgCost: 4250, totalVariance: 0.8, status: 'stable' },
    { category: 'Raw Material - Cookware', totalMaterials: 7, avgCost: 1680, totalVariance: -2.1, status: 'decreasing' },
    { category: 'Raw Material - Cabinets', totalMaterials: 9, avgCost: 3200, totalVariance: 4.5, status: 'increasing' },
    { category: 'Components', totalMaterials: 15, avgCost: 850, totalVariance: 2.8, status: 'stable' },
    { category: 'Finishing Materials', totalMaterials: 10, avgCost: 1250, totalVariance: 5.6, status: 'increasing' }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'increasing':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'decreasing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'volatile':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return 'text-red-600'
    if (variance > 0) return 'text-orange-600'
    if (variance < -5) return 'text-blue-600'
    if (variance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const totalMaterials = materialCosts.length
  const avgVariance = materialCosts.reduce((sum, m) => sum + m.variancePercent, 0) / totalMaterials
  const increasingCount = materialCosts.filter(m => m.status === 'increasing').length
  const volatileCount = materialCosts.filter(m => m.status === 'volatile').length

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Materials Costing</h1>
            <p className="text-sm text-gray-600 mt-1">Track and analyze material cost variations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Update Costs
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Materials</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalMaterials}</p>
              <p className="text-xs text-blue-700 mt-1">Tracked items</p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Variance</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{avgVariance.toFixed(1)}%</p>
              <p className="text-xs text-orange-700 mt-1">From standard cost</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Cost Increasing</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{increasingCount}</p>
              <p className="text-xs text-red-700 mt-1">Materials trending up</p>
            </div>
            <TrendingUp className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Volatile Materials</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{volatileCount}</p>
              <p className="text-xs text-yellow-700 mt-1">High fluctuation</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Category Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{cat.category}</p>
                    <p className="text-xs text-gray-600 mt-1">{cat.totalMaterials} materials</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cat.status)}`}>
                    {cat.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Cost:</span>
                    <span className="font-semibold text-gray-900">₹{cat.avgCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Variance:</span>
                    <span className={`font-semibold ${getVarianceColor(cat.totalVariance)}`}>
                      {cat.totalVariance > 0 ? '+' : ''}{cat.totalVariance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Material Cost Details</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Standard Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage/Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materialCosts.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{material.materialName}</p>
                      <p className="text-xs text-gray-600 mt-1">{material.materialCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{material.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{material.standardCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">per {material.unit}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{material.currentCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{material.lastPurchaseDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {material.variancePercent > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      ) : material.variancePercent < 0 ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                      <div>
                        <p className={`text-sm font-semibold ${getVarianceColor(material.variancePercent)}`}>
                          {material.variancePercent > 0 ? '+' : ''}{material.variancePercent.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">₹{material.variance > 0 ? '+' : ''}{material.variance}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{material.supplier}</p>
                    <p className="text-xs text-gray-600">{material.avgLeadTime} days lead</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{material.usagePerMonth} {material.unit}</p>
                    <p className="text-xs text-gray-600">MOQ: {material.minimumOrderQty}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>
                      {material.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
