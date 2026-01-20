'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Target,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  Download,
  ExternalLink,
  Award
} from 'lucide-react'

interface CompetitivePrice {
  id: string
  productCode: string
  productName: string
  category: string
  ourPrice: number
  ourCost: number
  ourMargin: number
  competitor1: string
  competitor1Price: number
  competitor1Position: 'lower' | 'higher' | 'same'
  competitor2: string
  competitor2Price: number
  competitor2Position: 'lower' | 'higher' | 'same'
  competitor3: string
  competitor3Price: number
  competitor3Position: 'lower' | 'higher' | 'same'
  marketAvg: number
  priceIndex: number
  recommendation: 'increase' | 'decrease' | 'maintain' | 'monitor'
  priceDifferential: number
  status: 'competitive' | 'overpriced' | 'underpriced'
}

interface CompetitorProfile {
  name: string
  marketShare: number
  avgPriceIndex: number
  productsTracked: number
  positioning: 'premium' | 'mid-range' | 'value'
}

export default function CompetitivePricingPage() {
  const router = useRouter()

  const [competitivePrices] = useState<CompetitivePrice[]>([
    {
      id: 'CP-001',
      productCode: 'KIT-SS-001',
      productName: 'Premium Undermount Kitchen Sink',
      category: 'Kitchen Sinks',
      ourPrice: 12500,
      ourCost: 8450,
      ourMargin: 32.4,
      competitor1: 'Nirali',
      competitor1Price: 13200,
      competitor1Position: 'higher',
      competitor2: 'Carysil',
      competitor2Price: 12800,
      competitor2Position: 'higher',
      competitor3: 'Franke',
      competitor3Price: 14500,
      competitor3Position: 'higher',
      marketAvg: 13375,
      priceIndex: 93.5,
      recommendation: 'increase',
      priceDifferential: -875,
      status: 'underpriced'
    },
    {
      id: 'CP-002',
      productCode: 'KIT-FAU-001',
      productName: 'Premium Chrome Kitchen Faucet',
      category: 'Kitchen Faucets',
      ourPrice: 5800,
      ourCost: 3850,
      ourMargin: 33.6,
      competitor1: 'Jaquar',
      competitor1Price: 6200,
      competitor1Position: 'higher',
      competitor2: 'Grohe',
      competitor2Price: 7500,
      competitor2Position: 'higher',
      competitor3: 'Hindware',
      competitor3Price: 5500,
      competitor3Position: 'lower',
      marketAvg: 6400,
      priceIndex: 90.6,
      recommendation: 'maintain',
      priceDifferential: -600,
      status: 'competitive'
    },
    {
      id: 'CP-003',
      productCode: 'KIT-CW-001',
      productName: 'Non-Stick Aluminum Frying Pan (12")',
      category: 'Cookware',
      ourPrice: 1950,
      ourCost: 1250,
      ourMargin: 35.9,
      competitor1: 'Prestige',
      competitor1Price: 1850,
      competitor1Position: 'lower',
      competitor2: 'Hawkins',
      competitor2Price: 1750,
      competitor2Position: 'lower',
      competitor3: 'Pigeon',
      competitor3Price: 1650,
      competitor3Position: 'lower',
      marketAvg: 1800,
      priceIndex: 108.3,
      recommendation: 'decrease',
      priceDifferential: 150,
      status: 'overpriced'
    },
    {
      id: 'CP-004',
      productCode: 'KIT-CHIM-001',
      productName: 'Auto-Clean Kitchen Chimney 90cm',
      category: 'Kitchen Appliances',
      ourPrice: 28000,
      ourCost: 18500,
      ourMargin: 33.9,
      competitor1: 'Elica',
      competitor1Price: 29500,
      competitor1Position: 'higher',
      competitor2: 'Faber',
      competitor2Price: 27500,
      competitor2Position: 'lower',
      competitor3: 'Glen',
      competitor3Price: 26800,
      competitor3Position: 'lower',
      marketAvg: 27950,
      priceIndex: 100.2,
      recommendation: 'maintain',
      priceDifferential: 50,
      status: 'competitive'
    },
    {
      id: 'CP-005',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet (24" x 34")',
      category: 'Kitchen Cabinets',
      ourPrice: 18500,
      ourCost: 12800,
      ourMargin: 30.8,
      competitor1: 'Godrej',
      competitor1Price: 19200,
      competitor1Position: 'higher',
      competitor2: 'Sleek',
      competitor2Price: 18800,
      competitor2Position: 'higher',
      competitor3: 'Hafele',
      competitor3Price: 22000,
      competitor3Position: 'higher',
      marketAvg: 20000,
      priceIndex: 92.5,
      recommendation: 'increase',
      priceDifferential: -1500,
      status: 'underpriced'
    },
    {
      id: 'CP-006',
      productCode: 'KIT-CT-001',
      productName: 'Black Galaxy Granite Countertop',
      category: 'Countertops',
      ourPrice: 42000,
      ourCost: 28500,
      ourMargin: 32.1,
      competitor1: 'Asian Granito',
      competitor1Price: 44000,
      competitor1Position: 'higher',
      competitor2: 'Kajaria',
      competitor2Price: 43500,
      competitor2Position: 'higher',
      competitor3: 'Somany',
      competitor3Price: 41500,
      competitor3Position: 'lower',
      marketAvg: 43000,
      priceIndex: 97.7,
      recommendation: 'maintain',
      priceDifferential: -1000,
      status: 'competitive'
    },
    {
      id: 'CP-007',
      productCode: 'KIT-SS-002',
      productName: 'Double Bowl Kitchen Sink',
      category: 'Kitchen Sinks',
      ourPrice: 14500,
      ourCost: 9850,
      ourMargin: 32.1,
      competitor1: 'Nirali',
      competitor1Price: 15000,
      competitor1Position: 'higher',
      competitor2: 'Carysil',
      competitor2Price: 14800,
      competitor2Position: 'higher',
      competitor3: 'Futura',
      competitor3Price: 13800,
      competitor3Position: 'lower',
      marketAvg: 14533,
      priceIndex: 99.8,
      recommendation: 'maintain',
      priceDifferential: -33,
      status: 'competitive'
    },
    {
      id: 'CP-008',
      productCode: 'KIT-FAU-002',
      productName: 'Pull-Down Spray Kitchen Faucet',
      category: 'Kitchen Faucets',
      ourPrice: 7800,
      ourCost: 5200,
      ourMargin: 33.3,
      competitor1: 'Jaquar',
      competitor1Price: 8500,
      competitor1Position: 'higher',
      competitor2: 'Kohler',
      competitor2Price: 9200,
      competitor2Position: 'higher',
      competitor3: 'Hindware',
      competitor3Price: 7200,
      competitor3Position: 'lower',
      marketAvg: 8300,
      priceIndex: 94.0,
      recommendation: 'increase',
      priceDifferential: -500,
      status: 'underpriced'
    },
    {
      id: 'CP-009',
      productCode: 'KIT-CW-002',
      productName: 'Stainless Steel Pressure Cooker (5L)',
      category: 'Cookware',
      ourPrice: 3800,
      ourCost: 2450,
      ourMargin: 35.5,
      competitor1: 'Prestige',
      competitor1Price: 3950,
      competitor1Position: 'higher',
      competitor2: 'Hawkins',
      competitor2Price: 3750,
      competitor2Position: 'lower',
      competitor3: 'Butterfly',
      competitor3Price: 3600,
      competitor3Position: 'lower',
      marketAvg: 3775,
      priceIndex: 100.7,
      recommendation: 'maintain',
      priceDifferential: 25,
      status: 'competitive'
    },
    {
      id: 'CP-010',
      productCode: 'KIT-ACC-001',
      productName: 'Pull-Out Kitchen Organizer',
      category: 'Kitchen Accessories',
      ourPrice: 4850,
      ourCost: 3200,
      ourMargin: 34.0,
      competitor1: 'Hafele',
      competitor1Price: 5200,
      competitor1Position: 'higher',
      competitor2: 'Ebco',
      competitor2Price: 4900,
      competitor2Position: 'higher',
      competitor3: 'Hettich',
      competitor3Price: 5400,
      competitor3Position: 'higher',
      marketAvg: 5167,
      priceIndex: 93.9,
      recommendation: 'increase',
      priceDifferential: -317,
      status: 'underpriced'
    },
    {
      id: 'CP-011',
      productCode: 'KIT-CT-002',
      productName: 'White Quartz Countertop',
      category: 'Countertops',
      ourPrice: 39500,
      ourCost: 26800,
      ourMargin: 32.2,
      competitor1: 'Asian Granito',
      competitor1Price: 41000,
      competitor1Position: 'higher',
      competitor2: 'Caesarstone',
      competitor2Price: 45000,
      competitor2Position: 'higher',
      competitor3: 'Somany',
      competitor3Price: 38500,
      competitor3Position: 'lower',
      marketAvg: 41500,
      priceIndex: 95.2,
      recommendation: 'maintain',
      priceDifferential: -2000,
      status: 'competitive'
    },
    {
      id: 'CP-012',
      productCode: 'KIT-CAB-002',
      productName: 'Wall Cabinet with Glass Door (30" x 30")',
      category: 'Kitchen Cabinets',
      ourPrice: 13800,
      ourCost: 9500,
      ourMargin: 31.2,
      competitor1: 'Godrej',
      competitor1Price: 14500,
      competitor1Position: 'higher',
      competitor2: 'Sleek',
      competitor2Price: 14200,
      competitor2Position: 'higher',
      competitor3: 'Hafele',
      competitor3Price: 16500,
      competitor3Position: 'higher',
      marketAvg: 15067,
      priceIndex: 91.6,
      recommendation: 'increase',
      priceDifferential: -1267,
      status: 'underpriced'
    }
  ])

  const competitorProfiles: CompetitorProfile[] = [
    { name: 'Nirali', marketShare: 18, avgPriceIndex: 105, productsTracked: 45, positioning: 'premium' },
    { name: 'Carysil', marketShare: 15, avgPriceIndex: 103, productsTracked: 38, positioning: 'premium' },
    { name: 'Jaquar', marketShare: 22, avgPriceIndex: 110, productsTracked: 52, positioning: 'premium' },
    { name: 'Prestige', marketShare: 25, avgPriceIndex: 98, productsTracked: 68, positioning: 'mid-range' },
    { name: 'Hindware', marketShare: 16, avgPriceIndex: 95, productsTracked: 42, positioning: 'mid-range' },
    { name: 'Godrej', marketShare: 20, avgPriceIndex: 102, productsTracked: 35, positioning: 'premium' },
    { name: 'Hafele', marketShare: 12, avgPriceIndex: 115, productsTracked: 28, positioning: 'premium' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'competitive':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'overpriced':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'underpriced':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'increase':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'decrease':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'maintain':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'monitor':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPositioningColor = (positioning: string) => {
    switch (positioning) {
      case 'premium':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'mid-range':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'value':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const avgPriceIndex = competitivePrices.reduce((sum, p) => sum + p.priceIndex, 0) / competitivePrices.length
  const competitiveCount = competitivePrices.filter(p => p.status === 'competitive').length
  const underpricedCount = competitivePrices.filter(p => p.status === 'underpriced').length
  const overpricedCount = competitivePrices.filter(p => p.status === 'overpriced').length

  return (
    <div className="w-full h-full px-4 py-6">
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Price Index</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{avgPriceIndex.toFixed(1)}</p>
              <p className="text-xs text-blue-700 mt-1">vs market avg (100)</p>
            </div>
            <Target className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Competitive</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{competitiveCount}</p>
              <p className="text-xs text-green-700 mt-1">Well positioned</p>
            </div>
            <Award className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Underpriced</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{underpricedCount}</p>
              <p className="text-xs text-yellow-700 mt-1">Opportunity to increase</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Overpriced</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{overpricedCount}</p>
              <p className="text-xs text-red-700 mt-1">Risk of losing sales</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Competitor Profiles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Key Competitor Profiles</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitorProfiles.map((comp) => (
              <div key={comp.name} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{comp.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{comp.productsTracked} products tracked</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPositioningColor(comp.positioning)}`}>
                    {comp.positioning.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Market Share:</span>
                    <span className="font-semibold text-gray-900">{comp.marketShare}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${comp.marketShare * 4}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price Index:</span>
                    <span className={`font-semibold ${comp.avgPriceIndex > 100 ? 'text-red-600' : 'text-green-600'}`}>
                      {comp.avgPriceIndex}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitive Pricing Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Price Comparison by Product</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Our Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competitors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Avg</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Index</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Differential</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitivePrices.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                      <p className="text-xs text-gray-600 mt-1">{product.productCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-blue-600">₹{product.ourPrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{product.ourMargin.toFixed(1)}% margin</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">{product.competitor1}:</span>
                        <span className="font-medium">₹{product.competitor1Price.toLocaleString()}</span>
                        {product.competitor1Position === 'higher' ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">{product.competitor2}:</span>
                        <span className="font-medium">₹{product.competitor2Price.toLocaleString()}</span>
                        {product.competitor2Position === 'higher' ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{product.marketAvg.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-bold ${
                      product.priceIndex < 95 ? 'text-yellow-600' :
                      product.priceIndex > 105 ? 'text-red-600' :
                      'text-green-600'
                    }`}>
                      {product.priceIndex.toFixed(1)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {product.priceDifferential > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      ) : product.priceDifferential < 0 ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : null}
                      <span className={`text-sm font-semibold ${
                        product.priceDifferential > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.priceDifferential > 0 ? '+' : ''}₹{product.priceDifferential.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(product.recommendation)}`}>
                      {product.recommendation.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {product.status.toUpperCase()}
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
