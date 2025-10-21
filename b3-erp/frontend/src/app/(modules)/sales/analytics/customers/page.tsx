'use client'

import { useState } from 'react'
import { ArrowLeft, Users, DollarSign, ShoppingCart, TrendingUp, TrendingDown, Star, Calendar, Award, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CustomerAnalytics {
  id: string
  name: string
  type: 'contractor' | 'dealer' | 'builder' | 'vip' | 'institutional' | 'retail'
  location: string
  region: string
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  lifetimeValue: number
  firstOrderDate: string
  lastOrderDate: string
  favoriteCategory: string
  orderFrequency: number
  paymentTerms: string
  creditLimit: number
  outstandingBalance: number
  satisfaction: number
  reorderRate: number
  growthRate: number
}

export default function CustomersAnalyticsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [sortBy, setSortBy] = useState('revenue')

  const [customers] = useState<CustomerAnalytics[]>([
    {
      id: 'CUST-001',
      name: 'Luxury Homes & Villas',
      type: 'vip',
      location: 'Mumbai',
      region: 'West India',
      totalOrders: 45,
      totalRevenue: 8925000,
      avgOrderValue: 198333,
      lifetimeValue: 12500000,
      firstOrderDate: '2024-03-15',
      lastOrderDate: '2025-10-18',
      favoriteCategory: 'Countertops',
      orderFrequency: 2.5,
      paymentTerms: 'Net 30',
      creditLimit: 5000000,
      outstandingBalance: 1250000,
      satisfaction: 4.8,
      reorderRate: 92,
      growthRate: 35.5
    },
    {
      id: 'CUST-002',
      name: 'Premium Builders Group',
      type: 'builder',
      location: 'Chennai',
      region: 'South India',
      totalOrders: 67,
      totalRevenue: 7845000,
      avgOrderValue: 117090,
      lifetimeValue: 9800000,
      firstOrderDate: '2023-11-20',
      lastOrderDate: '2025-10-19',
      favoriteCategory: 'Kitchen Storage',
      orderFrequency: 3.2,
      paymentTerms: 'Net 45',
      creditLimit: 3000000,
      outstandingBalance: 890000,
      satisfaction: 4.5,
      reorderRate: 85,
      growthRate: 28.3
    },
    {
      id: 'CUST-003',
      name: 'Elite Contractors Pvt Ltd',
      type: 'contractor',
      location: 'Delhi',
      region: 'North India',
      totalOrders: 52,
      totalRevenue: 6723000,
      avgOrderValue: 129288,
      lifetimeValue: 8200000,
      firstOrderDate: '2024-01-10',
      lastOrderDate: '2025-10-17',
      favoriteCategory: 'Kitchen Sinks',
      orderFrequency: 2.8,
      paymentTerms: 'Net 30',
      creditLimit: 2500000,
      outstandingBalance: 675000,
      satisfaction: 4.6,
      reorderRate: 88,
      growthRate: 22.7
    },
    {
      id: 'CUST-004',
      name: 'City Hospital Kitchen Department',
      type: 'institutional',
      location: 'Delhi',
      region: 'North India',
      totalOrders: 38,
      totalRevenue: 5234000,
      avgOrderValue: 137737,
      lifetimeValue: 6500000,
      firstOrderDate: '2024-02-05',
      lastOrderDate: '2025-10-15',
      favoriteCategory: 'Kitchen Appliances',
      orderFrequency: 2.1,
      paymentTerms: 'Net 60',
      creditLimit: 4000000,
      outstandingBalance: 1100000,
      satisfaction: 4.7,
      reorderRate: 95,
      growthRate: 18.9
    },
    {
      id: 'CUST-005',
      name: 'Modern Kitchen Solutions',
      type: 'dealer',
      location: 'Bangalore',
      region: 'South India',
      totalOrders: 89,
      totalRevenue: 4567000,
      avgOrderValue: 51315,
      lifetimeValue: 5800000,
      firstOrderDate: '2023-08-15',
      lastOrderDate: '2025-10-20',
      favoriteCategory: 'Kitchen Faucets',
      orderFrequency: 4.5,
      paymentTerms: 'Net 30',
      creditLimit: 1500000,
      outstandingBalance: 345000,
      satisfaction: 4.4,
      reorderRate: 78,
      growthRate: 31.2
    },
    {
      id: 'CUST-006',
      name: 'Builders Association India',
      type: 'builder',
      location: 'Kolkata',
      region: 'East India',
      totalOrders: 41,
      totalRevenue: 3987000,
      avgOrderValue: 97244,
      lifetimeValue: 5200000,
      firstOrderDate: '2024-04-20',
      lastOrderDate: '2025-10-19',
      favoriteCategory: 'Kitchen Appliances',
      orderFrequency: 2.3,
      paymentTerms: 'Net 45',
      creditLimit: 2000000,
      outstandingBalance: 560000,
      satisfaction: 4.3,
      reorderRate: 82,
      growthRate: 25.6
    },
    {
      id: 'CUST-007',
      name: 'Home Decor Plus (Dealer)',
      type: 'dealer',
      location: 'Pune',
      region: 'West India',
      totalOrders: 76,
      totalRevenue: 3456000,
      avgOrderValue: 45474,
      lifetimeValue: 4300000,
      firstOrderDate: '2023-12-01',
      lastOrderDate: '2025-10-18',
      favoriteCategory: 'Kitchen Accessories',
      orderFrequency: 3.8,
      paymentTerms: 'Net 30',
      creditLimit: 1200000,
      outstandingBalance: 290000,
      satisfaction: 4.5,
      reorderRate: 81,
      growthRate: 27.4
    },
    {
      id: 'CUST-008',
      name: 'Sharma Builders Pvt Ltd',
      type: 'contractor',
      location: 'Gurgaon',
      region: 'North India',
      totalOrders: 34,
      totalRevenue: 2987000,
      avgOrderValue: 87853,
      lifetimeValue: 3800000,
      firstOrderDate: '2024-05-10',
      lastOrderDate: '2025-10-18',
      favoriteCategory: 'Kitchen Ventilation',
      orderFrequency: 2.0,
      paymentTerms: 'Net 30',
      creditLimit: 1800000,
      outstandingBalance: 445000,
      satisfaction: 4.2,
      reorderRate: 76,
      growthRate: 19.8
    },
    {
      id: 'CUST-009',
      name: 'Kitchen World (Dealer Network)',
      type: 'dealer',
      location: 'Hyderabad',
      region: 'South India',
      totalOrders: 98,
      totalRevenue: 2756000,
      avgOrderValue: 28122,
      lifetimeValue: 3500000,
      firstOrderDate: '2023-07-20',
      lastOrderDate: '2025-10-20',
      favoriteCategory: 'Cookware',
      orderFrequency: 5.2,
      paymentTerms: 'Net 15',
      creditLimit: 1000000,
      outstandingBalance: 178000,
      satisfaction: 4.3,
      reorderRate: 89,
      growthRate: 33.1
    },
    {
      id: 'CUST-010',
      name: 'College Hostel Management',
      type: 'institutional',
      location: 'Bangalore',
      region: 'South India',
      totalOrders: 29,
      totalRevenue: 2445000,
      avgOrderValue: 84310,
      lifetimeValue: 3200000,
      firstOrderDate: '2024-06-15',
      lastOrderDate: '2025-10-17',
      favoriteCategory: 'Cookware',
      orderFrequency: 1.8,
      paymentTerms: 'Net 60',
      creditLimit: 2500000,
      outstandingBalance: 675000,
      satisfaction: 4.6,
      reorderRate: 87,
      growthRate: 21.5
    },
    {
      id: 'CUST-011',
      name: 'Smart Contractors Ltd',
      type: 'contractor',
      location: 'Ahmedabad',
      region: 'West India',
      totalOrders: 43,
      totalRevenue: 2134000,
      avgOrderValue: 49628,
      lifetimeValue: 2800000,
      firstOrderDate: '2024-03-25',
      lastOrderDate: '2025-10-16',
      favoriteCategory: 'Kitchen Accessories',
      orderFrequency: 2.4,
      paymentTerms: 'Net 30',
      creditLimit: 1500000,
      outstandingBalance: 334000,
      satisfaction: 4.4,
      reorderRate: 79,
      growthRate: 24.3
    },
    {
      id: 'CUST-012',
      name: 'VIP Homes & Interiors',
      type: 'vip',
      location: 'Mumbai',
      region: 'West India',
      totalOrders: 28,
      totalRevenue: 1987000,
      avgOrderValue: 70964,
      lifetimeValue: 2600000,
      firstOrderDate: '2024-07-10',
      lastOrderDate: '2025-10-14',
      favoriteCategory: 'Kitchen Faucets',
      orderFrequency: 1.9,
      paymentTerms: 'Net 30',
      creditLimit: 2000000,
      outstandingBalance: 445000,
      satisfaction: 4.9,
      reorderRate: 93,
      growthRate: 29.7
    }
  ])

  const customerTypes = ['all', 'contractor', 'dealer', 'builder', 'vip', 'institutional', 'retail']
  const regions = ['all', 'North India', 'South India', 'East India', 'West India']
  const sortOptions = [
    { value: 'revenue', label: 'Total Revenue (High to Low)' },
    { value: 'orders', label: 'Total Orders (High to Low)' },
    { value: 'ltv', label: 'Lifetime Value (High to Low)' },
    { value: 'satisfaction', label: 'Satisfaction (High to Low)' },
    { value: 'growth', label: 'Growth Rate (High to Low)' }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contractor':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'dealer':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'builder':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'vip':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'institutional':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'retail':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredCustomers = customers
    .filter(customer => {
      const matchesType = selectedType === 'all' || customer.type === selectedType
      const matchesRegion = selectedRegion === 'all' || customer.region === selectedRegion
      return matchesType && matchesRegion
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue
        case 'orders':
          return b.totalOrders - a.totalOrders
        case 'ltv':
          return b.lifetimeValue - a.lifetimeValue
        case 'satisfaction':
          return b.satisfaction - a.satisfaction
        case 'growth':
          return b.growthRate - a.growthRate
        default:
          return 0
      }
    })

  const stats = {
    totalCustomers: filteredCustomers.length,
    totalRevenue: filteredCustomers.reduce((sum, c) => sum + c.totalRevenue, 0),
    avgLifetimeValue: filteredCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0) / filteredCustomers.length,
    avgSatisfaction: filteredCustomers.reduce((sum, c) => sum + c.satisfaction, 0) / filteredCustomers.length,
    avgReorderRate: filteredCustomers.reduce((sum, c) => sum + c.reorderRate, 0) / filteredCustomers.length
  }

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Insights into customer behavior and performance</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Customers</p>
              <p className="text-3xl font-bold mt-1">{stats.totalCustomers}</p>
              <p className="text-xs text-blue-100 mt-1">Active accounts</p>
            </div>
            <Users className="h-10 w-10 text-blue-200" />
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
              <p className="text-sm font-medium text-purple-100">Avg LTV</p>
              <p className="text-3xl font-bold mt-1">₹{(stats.avgLifetimeValue / 100000).toFixed(1)}L</p>
              <p className="text-xs text-purple-100 mt-1">Lifetime value</p>
            </div>
            <Award className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-100">Avg Satisfaction</p>
              <p className="text-3xl font-bold mt-1">{stats.avgSatisfaction.toFixed(1)}</p>
              <p className="text-xs text-yellow-100 mt-1">Out of 5.0</p>
            </div>
            <Star className="h-10 w-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-100">Reorder Rate</p>
              <p className="text-3xl font-bold mt-1">{stats.avgReorderRate.toFixed(0)}%</p>
              <p className="text-xs text-pink-100 mt-1">Avg repeat rate</p>
            </div>
            <ShoppingCart className="h-10 w-10 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {customerTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer, index) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.location}, {customer.region}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(customer.type)}`}>
                  {customer.type.toUpperCase()}
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Total Revenue</p>
                  <p className="font-semibold text-green-900">₹{(customer.totalRevenue / 100000).toFixed(2)}L</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Total Orders</p>
                  <p className="font-semibold text-blue-900">{customer.totalOrders}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-700 mb-1">Avg Order</p>
                  <p className="font-semibold text-purple-900">₹{(customer.avgOrderValue / 1000).toFixed(0)}K</p>
                </div>
              </div>

              {/* Lifetime Value */}
              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-700 mb-1">Lifetime Value</p>
                    <p className="font-bold text-orange-900 text-lg">₹{(customer.lifetimeValue / 100000).toFixed(2)}L</p>
                  </div>
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <p className="text-xs text-gray-600">Satisfaction</p>
                  </div>
                  <p className="font-semibold text-gray-900">{customer.satisfaction}/5.0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    <p className="text-xs text-gray-600">Reorder Rate</p>
                  </div>
                  <p className="font-semibold text-gray-900">{customer.reorderRate}%</p>
                </div>
              </div>

              {/* Growth & Favorite Category */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {customer.growthRate >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <p className="text-xs text-gray-600">Growth Rate</p>
                  </div>
                  <p className={`font-semibold ${customer.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(customer.growthRate)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Package className="h-4 w-4 text-purple-600" />
                    <p className="text-xs text-gray-600">Top Category</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-xs">{customer.favoriteCategory}</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-4 text-sm space-y-1">
                <p className="text-gray-600">Order Frequency: <span className="font-medium text-gray-900">{customer.orderFrequency}x/month</span></p>
                <p className="text-gray-600">Payment Terms: <span className="font-medium text-gray-900">{customer.paymentTerms}</span></p>
                <p className="text-gray-600">Credit Limit: <span className="font-medium text-gray-900">₹{(customer.creditLimit / 100000).toFixed(1)}L</span></p>
                <p className="text-gray-600">Outstanding: <span className={`font-medium ${customer.outstandingBalance > customer.creditLimit * 0.7 ? 'text-red-600' : 'text-gray-900'}`}>₹{(customer.outstandingBalance / 100000).toFixed(2)}L</span></p>
              </div>

              {/* Timeline */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">Customer Since</p>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-gray-700">First Order: <span className="font-medium text-gray-900">{new Date(customer.firstOrderDate).toLocaleDateString('en-IN')}</span></p>
                  <p className="text-gray-700">Last Order: <span className="font-medium text-gray-900">{new Date(customer.lastOrderDate).toLocaleDateString('en-IN')}</span></p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  View Profile
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Orders
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No customers found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
