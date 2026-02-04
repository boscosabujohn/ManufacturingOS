'use client'

import { useState } from 'react'
import { ArrowLeft, Package, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Star, AlertCircle, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductAnalytics {
  code: string
  name: string
  category: string
  unitsSold: number
  revenue: number
  avgPrice: number
  stockLevel: number
  reorderPoint: number
  margin: number
  rating: number
  reviews: number
  returns: number
  returnRate: number
  trend: number
  topRegion: string
  topCustomerType: string
}

export default function ProductsAnalyticsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('revenue')

  const [products] = useState<ProductAnalytics[]>([
    {
      code: 'KIT-CT-002',
      name: 'Premium Quartz Countertop (per sq.ft)',
      category: 'Countertops',
      unitsSold: 2089,
      revenue: 1243355,
      avgPrice: 595,
      stockLevel: 3456,
      reorderPoint: 1000,
      margin: 45,
      rating: 4.7,
      reviews: 234,
      returns: 12,
      returnRate: 0.57,
      trend: 31.2,
      topRegion: 'South India',
      topCustomerType: 'Builders'
    },
    {
      code: 'KIT-AP-001',
      name: '750W Mixer Grinder with 3 Jars',
      category: 'Kitchen Appliances',
      unitsSold: 1567,
      revenue: 998775,
      avgPrice: 637,
      stockLevel: 456,
      reorderPoint: 200,
      margin: 38,
      rating: 4.5,
      reviews: 456,
      returns: 23,
      returnRate: 1.47,
      trend: 23.7,
      topRegion: 'West India',
      topCustomerType: 'Retail'
    },
    {
      code: 'KIT-CB-001',
      name: 'Modular Kitchen Base Cabinet (24")',
      category: 'Kitchen Storage',
      unitsSold: 567,
      revenue: 992250,
      avgPrice: 1750,
      stockLevel: 234,
      reorderPoint: 100,
      margin: 42,
      rating: 4.6,
      reviews: 178,
      returns: 8,
      returnRate: 1.41,
      trend: 15.8,
      topRegion: 'North India',
      topCustomerType: 'Contractors'
    },
    {
      code: 'KIT-FC-002',
      name: 'Brass Kitchen Faucet with Pull-Out Spray',
      category: 'Kitchen Faucets',
      unitsSold: 789,
      revenue: 936210,
      avgPrice: 1187,
      stockLevel: 345,
      reorderPoint: 150,
      margin: 48,
      rating: 4.8,
      reviews: 312,
      returns: 5,
      returnRate: 0.63,
      trend: 18.3,
      topRegion: 'South India',
      topCustomerType: 'VIP'
    },
    {
      code: 'KIT-CH-001',
      name: 'Chimney Hood 60cm with Auto-Clean',
      category: 'Kitchen Ventilation',
      unitsSold: 456,
      revenue: 890400,
      avgPrice: 1952,
      stockLevel: 123,
      reorderPoint: 80,
      margin: 40,
      rating: 4.4,
      reviews: 189,
      returns: 9,
      returnRate: 1.97,
      trend: 8.4,
      topRegion: 'West India',
      topCustomerType: 'Dealers'
    },
    {
      code: 'KIT-SS-001',
      name: 'Stainless Steel Kitchen Sink (Single Bowl)',
      category: 'Kitchen Sinks',
      unitsSold: 678,
      revenue: 761250,
      avgPrice: 1123,
      stockLevel: 450,
      reorderPoint: 200,
      margin: 35,
      rating: 4.3,
      reviews: 267,
      returns: 15,
      returnRate: 2.21,
      trend: 12.5,
      topRegion: 'North India',
      topCustomerType: 'Builders'
    },
    {
      code: 'KIT-CW-001',
      name: 'Granite Coated Non-Stick Cookware Set (7 Pcs)',
      category: 'Cookware',
      unitsSold: 1234,
      revenue: 740400,
      avgPrice: 600,
      stockLevel: 567,
      reorderPoint: 300,
      margin: 32,
      rating: 4.2,
      reviews: 445,
      returns: 34,
      returnRate: 2.75,
      trend: -5.2,
      topRegion: 'East India',
      topCustomerType: 'Retail'
    },
    {
      code: 'KIT-CB-002',
      name: 'Modular Kitchen Wall Cabinet (18")',
      category: 'Kitchen Storage',
      unitsSold: 489,
      revenue: 684600,
      avgPrice: 1400,
      stockLevel: 198,
      reorderPoint: 80,
      margin: 44,
      rating: 4.5,
      reviews: 156,
      returns: 6,
      returnRate: 1.23,
      trend: 15.8,
      topRegion: 'South India',
      topCustomerType: 'Contractors'
    },
    {
      code: 'KIT-AP-002',
      name: '2000W Induction Cooktop Digital',
      category: 'Kitchen Appliances',
      unitsSold: 892,
      revenue: 463360,
      avgPrice: 519,
      stockLevel: 234,
      reorderPoint: 150,
      margin: 36,
      rating: 4.6,
      reviews: 378,
      returns: 11,
      returnRate: 1.23,
      trend: 23.7,
      topRegion: 'West India',
      topCustomerType: 'Retail'
    },
    {
      code: 'KIT-SS-002',
      name: 'Stainless Steel Kitchen Sink (Double Bowl)',
      category: 'Kitchen Sinks',
      unitsSold: 345,
      revenue: 446850,
      avgPrice: 1295,
      stockLevel: 178,
      reorderPoint: 100,
      margin: 37,
      rating: 4.4,
      reviews: 189,
      returns: 7,
      returnRate: 2.03,
      trend: 12.5,
      topRegion: 'South India',
      topCustomerType: 'Builders'
    },
    {
      code: 'KIT-AC-001',
      name: 'Modular Kitchen Basket Organizer',
      category: 'Kitchen Accessories',
      unitsSold: 1567,
      revenue: 391750,
      avgPrice: 250,
      stockLevel: 789,
      reorderPoint: 400,
      margin: 28,
      rating: 4.1,
      reviews: 567,
      returns: 23,
      returnRate: 1.47,
      trend: 6.7,
      topRegion: 'North India',
      topCustomerType: 'Retail'
    },
    {
      code: 'KIT-CW-002',
      name: 'Stainless Steel Pressure Cooker 5L',
      category: 'Cookware',
      unitsSold: 1089,
      revenue: 367965,
      avgPrice: 338,
      stockLevel: 445,
      reorderPoint: 250,
      margin: 30,
      rating: 4.7,
      reviews: 423,
      returns: 8,
      returnRate: 0.73,
      trend: -5.2,
      topRegion: 'East India',
      topCustomerType: 'Institutional'
    },
    {
      code: 'KIT-FC-001',
      name: 'Chrome Kitchen Faucet Single Handle',
      category: 'Kitchen Faucets',
      unitsSold: 567,
      revenue: 312090,
      avgPrice: 550,
      stockLevel: 289,
      reorderPoint: 150,
      margin: 46,
      rating: 4.3,
      reviews: 234,
      returns: 9,
      returnRate: 1.59,
      trend: 18.3,
      topRegion: 'North India',
      topCustomerType: 'Dealers'
    },
    {
      code: 'KIT-CT-001',
      name: 'Granite Countertop (per sq.ft)',
      category: 'Countertops',
      unitsSold: 1234,
      revenue: 296160,
      avgPrice: 240,
      stockLevel: 2345,
      reorderPoint: 800,
      margin: 43,
      rating: 4.5,
      reviews: 178,
      returns: 5,
      returnRate: 0.41,
      trend: 31.2,
      topRegion: 'South India',
      topCustomerType: 'Builders'
    },
    {
      code: 'KIT-AC-002',
      name: 'Stainless Steel Dish Drainer Rack',
      category: 'Kitchen Accessories',
      unitsSold: 1678,
      revenue: 234920,
      avgPrice: 140,
      stockLevel: 678,
      reorderPoint: 350,
      margin: 25,
      rating: 4.0,
      reviews: 489,
      returns: 19,
      returnRate: 1.13,
      trend: 6.7,
      topRegion: 'West India',
      topCustomerType: 'Retail'
    }
  ])

  const categories = ['all', 'Kitchen Sinks', 'Kitchen Faucets', 'Cookware', 'Kitchen Appliances', 'Kitchen Storage', 'Kitchen Ventilation', 'Countertops', 'Kitchen Accessories']

  const sortOptions = [
    { value: 'revenue', label: 'Revenue (High to Low)' },
    { value: 'units', label: 'Units Sold (High to Low)' },
    { value: 'margin', label: 'Margin (High to Low)' },
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'trend', label: 'Growth (High to Low)' }
  ]

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.revenue - a.revenue
        case 'units':
          return b.unitsSold - a.unitsSold
        case 'margin':
          return b.margin - a.margin
        case 'rating':
          return b.rating - a.rating
        case 'trend':
          return b.trend - a.trend
        default:
          return 0
      }
    })

  const stats = {
    totalProducts: filteredProducts.length,
    totalRevenue: filteredProducts.reduce((sum, p) => sum + p.revenue, 0),
    avgMargin: filteredProducts.reduce((sum, p) => sum + p.margin, 0) / filteredProducts.length,
    avgRating: filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length,
    lowStockItems: filteredProducts.filter(p => p.stockLevel < p.reorderPoint).length
  }

  return (
    <div className="w-full h-full px-4 py-2">
      {/* Inline Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Detailed performance metrics for kitchen products</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Products</p>
              <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
              <p className="text-xs text-blue-100 mt-1">Active SKUs</p>
            </div>
            <Package className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">₹{(stats.totalRevenue / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-green-100 mt-1">From selected</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Avg Margin</p>
              <p className="text-3xl font-bold mt-1">{stats.avgMargin.toFixed(1)}%</p>
              <p className="text-xs text-purple-100 mt-1">Profit margin</p>
            </div>
            <BarChart3 className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-100">Avg Rating</p>
              <p className="text-3xl font-bold mt-1">{stats.avgRating.toFixed(1)}</p>
              <p className="text-xs text-yellow-100 mt-1">Out of 5.0</p>
            </div>
            <Star className="h-10 w-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100">Low Stock</p>
              <p className="text-3xl font-bold mt-1">{stats.lowStockItems}</p>
              <p className="text-xs text-red-100 mt-1">Need reorder</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Units Sold</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Avg Price</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Margin</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Rating</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Returns</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Trend</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600 font-mono">{product.code}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{product.category}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gray-900">{product.unitsSold.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-green-600">₹{(product.revenue / 100000).toFixed(2)}L</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-gray-700">₹{product.avgPrice.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-semibold ${product.margin >= 40 ? 'text-green-600' : product.margin >= 30 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {product.margin}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{product.rating}</span>
                      <span className="text-xs text-gray-600">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div>
                      <span className="text-gray-700">{product.returns}</span>
                      <span className={`block text-xs ${product.returnRate > 2 ? 'text-red-600' : 'text-gray-600'}`}>
                        {product.returnRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {product.trend >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-semibold ${product.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(product.trend)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-center">
                      <span className={`font-medium ${product.stockLevel < product.reorderPoint ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stockLevel}
                      </span>
                      {product.stockLevel < product.reorderPoint && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          <span className="text-xs text-red-600">Low</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600">No products found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
