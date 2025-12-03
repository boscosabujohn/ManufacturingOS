'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react'

interface PricingMargin {
  id: string
  productCode: string
  productName: string
  category: string
  costPrice: number
  sellingPrice: number
  marginAmount: number
  marginPercent: number
  targetMargin: number
  varianceFromTarget: number
  competitorPrice: number
  pricePosition: 'premium' | 'competitive' | 'value'
  status: 'healthy' | 'below-target' | 'at-risk'
  volumeSold: number
  revenue: number
}

interface CategoryMargin {
  category: string
  products: number
  avgMargin: number
  targetMargin: number
  totalRevenue: number
  status: 'healthy' | 'below-target' | 'at-risk'
}

export default function PricingMarginsPage() {
  const router = useRouter()

  const [pricingMargins] = useState<PricingMargin[]>([
    {
      id: 'PM-001',
      productCode: 'KIT-SS-001',
      productName: 'Premium Undermount Kitchen Sink',
      category: 'Kitchen Sinks',
      costPrice: 8450,
      sellingPrice: 12500,
      marginAmount: 4050,
      marginPercent: 32.4,
      targetMargin: 30.0,
      varianceFromTarget: 2.4,
      competitorPrice: 13200,
      pricePosition: 'competitive',
      status: 'healthy',
      volumeSold: 125,
      revenue: 1562500
    },
    {
      id: 'PM-002',
      productCode: 'KIT-FAU-001',
      productName: 'Premium Chrome Kitchen Faucet',
      category: 'Kitchen Faucets',
      costPrice: 3850,
      sellingPrice: 5800,
      marginAmount: 1950,
      marginPercent: 33.6,
      targetMargin: 32.0,
      varianceFromTarget: 1.6,
      competitorPrice: 6200,
      pricePosition: 'value',
      status: 'healthy',
      volumeSold: 250,
      revenue: 1450000
    },
    {
      id: 'PM-003',
      productCode: 'KIT-CW-001',
      productName: 'Non-Stick Aluminum Frying Pan (12")',
      category: 'Cookware',
      costPrice: 1250,
      sellingPrice: 1950,
      marginAmount: 700,
      marginPercent: 35.9,
      targetMargin: 35.0,
      varianceFromTarget: 0.9,
      competitorPrice: 1850,
      pricePosition: 'competitive',
      status: 'healthy',
      volumeSold: 450,
      revenue: 877500
    },
    {
      id: 'PM-004',
      productCode: 'KIT-CHIM-001',
      productName: 'Auto-Clean Kitchen Chimney 90cm',
      category: 'Kitchen Appliances',
      costPrice: 18500,
      sellingPrice: 28000,
      marginAmount: 9500,
      marginPercent: 33.9,
      targetMargin: 35.0,
      varianceFromTarget: -1.1,
      competitorPrice: 27500,
      pricePosition: 'competitive',
      status: 'below-target',
      volumeSold: 85,
      revenue: 2380000
    },
    {
      id: 'PM-005',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet (24" x 34")',
      category: 'Kitchen Cabinets',
      costPrice: 12800,
      sellingPrice: 18500,
      marginAmount: 5700,
      marginPercent: 30.8,
      targetMargin: 32.0,
      varianceFromTarget: -1.2,
      competitorPrice: 19200,
      pricePosition: 'value',
      status: 'below-target',
      volumeSold: 95,
      revenue: 1757500
    },
    {
      id: 'PM-006',
      productCode: 'KIT-CT-001',
      productName: 'Black Galaxy Granite Countertop',
      category: 'Countertops',
      costPrice: 28500,
      sellingPrice: 42000,
      marginAmount: 13500,
      marginPercent: 32.1,
      targetMargin: 30.0,
      varianceFromTarget: 2.1,
      competitorPrice: 44000,
      pricePosition: 'value',
      status: 'healthy',
      volumeSold: 42,
      revenue: 1764000
    },
    {
      id: 'PM-007',
      productCode: 'KIT-SS-002',
      productName: 'Double Bowl Kitchen Sink',
      category: 'Kitchen Sinks',
      costPrice: 9850,
      sellingPrice: 14500,
      marginAmount: 4650,
      marginPercent: 32.1,
      targetMargin: 30.0,
      varianceFromTarget: 2.1,
      competitorPrice: 15000,
      pricePosition: 'competitive',
      status: 'healthy',
      volumeSold: 110,
      revenue: 1595000
    },
    {
      id: 'PM-008',
      productCode: 'KIT-FAU-002',
      productName: 'Pull-Down Spray Kitchen Faucet',
      category: 'Kitchen Faucets',
      costPrice: 5200,
      sellingPrice: 7800,
      marginAmount: 2600,
      marginPercent: 33.3,
      targetMargin: 32.0,
      varianceFromTarget: 1.3,
      competitorPrice: 8500,
      pricePosition: 'value',
      status: 'healthy',
      volumeSold: 180,
      revenue: 1404000
    },
    {
      id: 'PM-009',
      productCode: 'KIT-CW-002',
      productName: 'Stainless Steel Pressure Cooker (5L)',
      category: 'Cookware',
      costPrice: 2450,
      sellingPrice: 3800,
      marginAmount: 1350,
      marginPercent: 35.5,
      targetMargin: 35.0,
      varianceFromTarget: 0.5,
      competitorPrice: 3950,
      pricePosition: 'competitive',
      status: 'healthy',
      volumeSold: 320,
      revenue: 1216000
    },
    {
      id: 'PM-010',
      productCode: 'KIT-ACC-001',
      productName: 'Pull-Out Kitchen Organizer',
      category: 'Kitchen Accessories',
      costPrice: 3200,
      sellingPrice: 4850,
      marginAmount: 1650,
      marginPercent: 34.0,
      targetMargin: 30.0,
      varianceFromTarget: 4.0,
      competitorPrice: 5200,
      pricePosition: 'value',
      status: 'healthy',
      volumeSold: 210,
      revenue: 1018500
    },
    {
      id: 'PM-011',
      productCode: 'KIT-CT-002',
      productName: 'White Quartz Countertop',
      category: 'Countertops',
      costPrice: 26800,
      sellingPrice: 39500,
      marginAmount: 12700,
      marginPercent: 32.2,
      targetMargin: 30.0,
      varianceFromTarget: 2.2,
      competitorPrice: 41000,
      pricePosition: 'competitive',
      status: 'healthy',
      volumeSold: 38,
      revenue: 1501000
    },
    {
      id: 'PM-012',
      productCode: 'KIT-CAB-002',
      productName: 'Wall Cabinet with Glass Door (30" x 30")',
      category: 'Kitchen Cabinets',
      costPrice: 9500,
      sellingPrice: 13800,
      marginAmount: 4300,
      marginPercent: 31.2,
      targetMargin: 32.0,
      varianceFromTarget: -0.8,
      competitorPrice: 14500,
      pricePosition: 'value',
      status: 'below-target',
      volumeSold: 105,
      revenue: 1449000
    }
  ])

  const categoryMargins: CategoryMargin[] = [
    { category: 'Kitchen Sinks', products: 2, avgMargin: 32.3, targetMargin: 30.0, totalRevenue: 3157500, status: 'healthy' },
    { category: 'Kitchen Faucets', products: 2, avgMargin: 33.5, targetMargin: 32.0, totalRevenue: 2854000, status: 'healthy' },
    { category: 'Cookware', products: 2, avgMargin: 35.7, targetMargin: 35.0, totalRevenue: 2093500, status: 'healthy' },
    { category: 'Kitchen Appliances', products: 1, avgMargin: 33.9, targetMargin: 35.0, totalRevenue: 2380000, status: 'below-target' },
    { category: 'Kitchen Cabinets', products: 2, avgMargin: 31.0, targetMargin: 32.0, totalRevenue: 3206500, status: 'below-target' },
    { category: 'Countertops', products: 2, avgMargin: 32.2, targetMargin: 30.0, totalRevenue: 3265000, status: 'healthy' },
    { category: 'Kitchen Accessories', products: 1, avgMargin: 34.0, targetMargin: 30.0, totalRevenue: 1018500, status: 'healthy' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'below-target':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'at-risk':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPricePositionColor = (position: string) => {
    switch (position) {
      case 'premium':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'competitive':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'value':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance >= 0) return 'text-green-600'
    return 'text-red-600'
  }

  const totalRevenue = pricingMargins.reduce((sum, p) => sum + p.revenue, 0)
  const avgMargin = pricingMargins.reduce((sum, p) => sum + p.marginPercent, 0) / pricingMargins.length
  const healthyCount = pricingMargins.filter(p => p.status === 'healthy').length
  const belowTargetCount = pricingMargins.filter(p => p.status === 'below-target').length

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalRevenue / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-green-700 mt-1">From all products</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Avg Margin</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{avgMargin.toFixed(1)}%</p>
              <p className="text-xs text-blue-700 mt-1">Across portfolio</p>
            </div>
            <Target className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Healthy Products</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{healthyCount}</p>
              <p className="text-xs text-purple-700 mt-1">Meeting targets</p>
            </div>
            <CheckCircle className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Below Target</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{belowTargetCount}</p>
              <p className="text-xs text-orange-700 mt-1">Need attention</p>
            </div>
            <AlertCircle className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Margins */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryMargins.map((cat) => (
              <div key={cat.category} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{cat.category}</p>
                    <p className="text-xs text-gray-600 mt-1">{cat.products} products</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cat.status)}`}>
                    {cat.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Margin:</span>
                    <span className="font-semibold text-gray-900">{cat.avgMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-semibold text-gray-900">{cat.targetMargin.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        cat.avgMargin >= cat.targetMargin ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${(cat.avgMargin / 40) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-semibold text-green-600">₹{(cat.totalRevenue / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Margins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Product Margin Details</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pricingMargins.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                      <p className="text-xs text-gray-600 mt-1">{product.productCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{product.costPrice.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{product.sellingPrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">vs ₹{product.competitorPrice.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-green-600">{product.marginPercent.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">₹{product.marginAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{product.targetMargin.toFixed(1)}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {product.varianceFromTarget >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${getVarianceColor(product.varianceFromTarget)}`}>
                        {product.varianceFromTarget > 0 ? '+' : ''}{product.varianceFromTarget.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPricePositionColor(product.pricePosition)}`}>
                      {product.pricePosition.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{product.volumeSold} units</p>
                    <p className="text-xs text-green-600">₹{(product.revenue / 100000).toFixed(1)}L</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {product.status.toUpperCase().replace('-', ' ')}
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
