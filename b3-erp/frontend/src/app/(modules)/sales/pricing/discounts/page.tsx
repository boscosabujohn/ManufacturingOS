'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, Search, Filter, Percent, Tag, TrendingDown, Calendar, Package, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Discount {
  id: string
  code: string
  name: string
  type: 'percentage' | 'fixed' | 'buyXgetY'
  category: string
  value: number
  minQuantity: number
  minOrderValue: number
  maxDiscount?: number
  applicableProducts: string[]
  validFrom: string
  validTo: string
  status: 'active' | 'scheduled' | 'expired' | 'inactive'
  usageCount: number
  usageLimit?: number
}

export default function DiscountsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [discounts] = useState<Discount[]>([
    {
      id: 'DISC-001',
      code: 'SINK20',
      name: 'Kitchen Sink Volume Discount',
      type: 'percentage',
      category: 'Kitchen Sinks',
      value: 20,
      minQuantity: 50,
      minOrderValue: 500000,
      maxDiscount: 100000,
      applicableProducts: ['KIT-SS-001', 'KIT-SS-002'],
      validFrom: '2025-10-01',
      validTo: '2025-12-31',
      status: 'active',
      usageCount: 23,
      usageLimit: 100
    },
    {
      id: 'DISC-002',
      code: 'FAUCET15',
      name: 'Kitchen Faucet Bulk Order',
      type: 'percentage',
      category: 'Kitchen Faucets',
      value: 15,
      minQuantity: 30,
      minOrderValue: 300000,
      maxDiscount: 50000,
      applicableProducts: ['KIT-FC-001', 'KIT-FC-002'],
      validFrom: '2025-09-15',
      validTo: '2025-11-30',
      status: 'active',
      usageCount: 18,
      usageLimit: 75
    },
    {
      id: 'DISC-003',
      code: 'COOKWARE25',
      name: 'Cookware Set Volume Discount',
      type: 'percentage',
      category: 'Cookware',
      value: 25,
      minQuantity: 100,
      minOrderValue: 800000,
      maxDiscount: 200000,
      applicableProducts: ['KIT-CW-001', 'KIT-CW-002'],
      validFrom: '2025-10-10',
      validTo: '2026-01-31',
      status: 'active',
      usageCount: 12,
      usageLimit: 50
    },
    {
      id: 'DISC-004',
      code: 'APPLIANCE10',
      name: 'Kitchen Appliance Seasonal',
      type: 'percentage',
      category: 'Kitchen Appliances',
      value: 10,
      minQuantity: 20,
      minOrderValue: 400000,
      maxDiscount: 75000,
      applicableProducts: ['KIT-AP-001', 'KIT-AP-002'],
      validFrom: '2025-11-01',
      validTo: '2025-12-15',
      status: 'scheduled',
      usageCount: 0,
      usageLimit: 60
    },
    {
      id: 'DISC-005',
      code: 'CABINET30',
      name: 'Modular Kitchen Cabinet Bulk',
      type: 'percentage',
      category: 'Kitchen Storage',
      value: 30,
      minQuantity: 25,
      minOrderValue: 500000,
      maxDiscount: 150000,
      applicableProducts: ['KIT-CB-001', 'KIT-CB-002'],
      validFrom: '2025-10-01',
      validTo: '2025-12-31',
      status: 'active',
      usageCount: 8,
      usageLimit: 40
    },
    {
      id: 'DISC-006',
      code: 'CHIMNEY12',
      name: 'Kitchen Chimney Volume Deal',
      type: 'percentage',
      category: 'Kitchen Ventilation',
      value: 12,
      minQuantity: 15,
      minOrderValue: 300000,
      maxDiscount: 40000,
      applicableProducts: ['KIT-CH-001'],
      validFrom: '2025-09-01',
      validTo: '2025-11-30',
      status: 'active',
      usageCount: 15,
      usageLimit: 50
    },
    {
      id: 'DISC-007',
      code: 'COUNTER500',
      name: 'Countertop Fixed Discount',
      type: 'fixed',
      category: 'Countertops',
      value: 500,
      minQuantity: 100,
      minOrderValue: 50000,
      applicableProducts: ['KIT-CT-001', 'KIT-CT-002'],
      validFrom: '2025-10-15',
      validTo: '2025-12-31',
      status: 'active',
      usageCount: 34,
      usageLimit: 100
    },
    {
      id: 'DISC-008',
      code: 'ACCESSOR18',
      name: 'Kitchen Accessories Combo',
      type: 'percentage',
      category: 'Kitchen Accessories',
      value: 18,
      minQuantity: 50,
      minOrderValue: 25000,
      maxDiscount: 15000,
      applicableProducts: ['KIT-AC-001', 'KIT-AC-002'],
      validFrom: '2025-08-01',
      validTo: '2025-10-31',
      status: 'active',
      usageCount: 56,
      usageLimit: 80
    },
    {
      id: 'DISC-009',
      code: 'FESTIVAL35',
      name: 'Festival Kitchen Mega Discount',
      type: 'percentage',
      category: 'All Kitchen Products',
      value: 35,
      minQuantity: 10,
      minOrderValue: 200000,
      maxDiscount: 100000,
      applicableProducts: ['ALL'],
      validFrom: '2025-10-20',
      validTo: '2025-11-05',
      status: 'active',
      usageCount: 67,
      usageLimit: 200
    },
    {
      id: 'DISC-010',
      code: 'SINK2PLUS1',
      name: 'Buy 2 Sinks Get 1 Faucet Free',
      type: 'buyXgetY',
      category: 'Kitchen Sinks',
      value: 0,
      minQuantity: 2,
      minOrderValue: 25000,
      applicableProducts: ['KIT-SS-001', 'KIT-SS-002', 'KIT-FC-001'],
      validFrom: '2025-09-01',
      validTo: '2025-11-30',
      status: 'active',
      usageCount: 41,
      usageLimit: 100
    },
    {
      id: 'DISC-011',
      code: 'NEWUSER20',
      name: 'First Kitchen Order Discount',
      type: 'percentage',
      category: 'All Kitchen Products',
      value: 20,
      minQuantity: 5,
      minOrderValue: 50000,
      maxDiscount: 25000,
      applicableProducts: ['ALL'],
      validFrom: '2025-07-01',
      validTo: '2025-12-31',
      status: 'active',
      usageCount: 89,
      usageLimit: 150
    },
    {
      id: 'DISC-012',
      code: 'SUMMER40',
      name: 'Summer Kitchen Clearance',
      type: 'percentage',
      category: 'All Kitchen Products',
      value: 40,
      minQuantity: 20,
      minOrderValue: 300000,
      maxDiscount: 150000,
      applicableProducts: ['ALL'],
      validFrom: '2025-06-01',
      validTo: '2025-08-31',
      status: 'expired',
      usageCount: 156,
      usageLimit: 200
    }
  ])

  const categories = ['all', 'Kitchen Sinks', 'Kitchen Faucets', 'Cookware', 'Kitchen Appliances', 'Kitchen Storage', 'Kitchen Ventilation', 'Countertops', 'Kitchen Accessories', 'All Kitchen Products']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'expired':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />
      case 'fixed':
        return <Tag className="h-4 w-4" />
      case 'buyXgetY':
        return <Package className="h-4 w-4" />
      default:
        return <TrendingDown className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Percentage'
      case 'fixed':
        return 'Fixed Amount'
      case 'buyXgetY':
        return 'Buy X Get Y'
      default:
        return type
    }
  }

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || discount.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    activeDiscounts: discounts.filter(d => d.status === 'active').length,
    totalSavings: discounts.reduce((sum, d) => sum + (d.usageCount * (d.value * 1000)), 0),
    avgDiscountRate: discounts.filter(d => d.type === 'percentage').reduce((sum, d) => sum + d.value, 0) / discounts.filter(d => d.type === 'percentage').length,
    scheduledDiscounts: discounts.filter(d => d.status === 'scheduled').length
  }

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Inline Header */}
      <div className="flex items-center justify-end mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Discount
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Active Discounts</p>
              <p className="text-3xl font-bold mt-1">{stats.activeDiscounts}</p>
              <p className="text-xs text-green-100 mt-1">Currently running</p>
            </div>
            <TrendingDown className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Savings</p>
              <p className="text-3xl font-bold mt-1">₹{(stats.totalSavings / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-purple-100 mt-1">Customer savings</p>
            </div>
            <Tag className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Avg Discount Rate</p>
              <p className="text-3xl font-bold mt-1">{stats.avgDiscountRate.toFixed(1)}%</p>
              <p className="text-xs text-blue-100 mt-1">Across all products</p>
            </div>
            <Percent className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100">Scheduled</p>
              <p className="text-3xl font-bold mt-1">{stats.scheduledDiscounts}</p>
              <p className="text-xs text-orange-100 mt-1">Upcoming discounts</p>
            </div>
            <Calendar className="h-10 w-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by discount code, name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDiscounts.map((discount) => (
          <div key={discount.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(discount.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{discount.name}</h3>
                      <p className="text-sm text-gray-600">Code: {discount.code}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(discount.status)}`}>
                  {discount.status.toUpperCase()}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Discount Type</p>
                  <p className="font-semibold text-gray-900">{getTypeLabel(discount.type)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Value</p>
                  <p className="font-semibold text-gray-900">
                    {discount.type === 'percentage' ? `${discount.value}%` :
                     discount.type === 'fixed' ? `₹${discount.value.toLocaleString('en-IN')}` :
                     'See Details'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Min Quantity</p>
                  <p className="font-semibold text-gray-900">{discount.minQuantity} units</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Min Order Value</p>
                  <p className="font-semibold text-gray-900">₹{(discount.minOrderValue / 100000).toFixed(1)}L</p>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">Category</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  <Package className="h-3 w-3" />
                  {discount.category}
                </span>
              </div>

              {/* Validity */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">
                    Valid: {new Date(discount.validFrom).toLocaleDateString('en-IN')} - {new Date(discount.validTo).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Usage</span>
                  <span className="font-medium text-gray-900">
                    {discount.usageCount} / {discount.usageLimit || '∞'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      discount.usageLimit && (discount.usageCount / discount.usageLimit) * 100 > 75
                        ? 'bg-red-500'
                        : discount.usageLimit && (discount.usageCount / discount.usageLimit) * 100 > 50
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: discount.usageLimit
                        ? `${Math.min((discount.usageCount / discount.usageLimit) * 100, 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>

              {/* Max Discount */}
              {discount.maxDiscount && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-700 mb-1">Maximum Discount Cap</p>
                  <p className="font-semibold text-orange-900">₹{discount.maxDiscount.toLocaleString('en-IN')}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDiscounts.length === 0 && (
        <div className="text-center py-12">
          <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No discounts found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
