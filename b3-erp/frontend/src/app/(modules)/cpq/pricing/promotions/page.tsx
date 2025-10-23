'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Gift,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Tag,
  TrendingUp
} from 'lucide-react'

interface Promotion {
  id: string
  name: string
  type: 'percentage' | 'fixed-amount' | 'bogo' | 'bundle'
  value: string
  startDate: string
  endDate: string
  applicableProducts: string[]
  minPurchase?: number
  status: 'active' | 'scheduled' | 'expired'
  usageCount: number
}

export default function CPQPricingPromotionsPage() {
  const router = useRouter()

  const [promotions] = useState<Promotion[]>([
    {
      id: 'PROMO-001',
      name: 'Festival Mega Sale',
      type: 'percentage',
      value: '15% off',
      startDate: '2024-10-15',
      endDate: '2024-11-15',
      applicableProducts: ['All Modular Kitchens', 'L-Shaped Kitchens'],
      minPurchase: 500000,
      status: 'active',
      usageCount: 89
    },
    {
      id: 'PROMO-002',
      name: 'New Year Clearance',
      type: 'percentage',
      value: '20% off',
      startDate: '2024-12-26',
      endDate: '2025-01-10',
      applicableProducts: ['Premium Cabinets', 'Countertops'],
      status: 'scheduled',
      usageCount: 0
    },
    {
      id: 'PROMO-003',
      name: 'Bundle & Save - Kitchen Essentials',
      type: 'bundle',
      value: '₹75,000 off',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      applicableProducts: ['Cabinet + Countertop + Hardware'],
      minPurchase: 800000,
      status: 'active',
      usageCount: 45
    },
    {
      id: 'PROMO-004',
      name: 'Buy 2 Get 1 - Hardware Special',
      type: 'bogo',
      value: 'Buy 2 Get 1 Free',
      startDate: '2024-10-10',
      endDate: '2024-10-25',
      applicableProducts: ['Cabinet Handles', 'Drawer Rails'],
      status: 'active',
      usageCount: 127
    },
    {
      id: 'PROMO-005',
      name: 'Early Bird Discount',
      type: 'fixed-amount',
      value: '₹50,000 off',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      applicableProducts: ['All Categories'],
      minPurchase: 1000000,
      status: 'expired',
      usageCount: 34
    },
    {
      id: 'PROMO-006',
      name: 'Summer Sale',
      type: 'percentage',
      value: '12% off',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      applicableProducts: ['Island Kitchens', 'Straight Kitchens'],
      status: 'expired',
      usageCount: 67
    },
    {
      id: 'PROMO-007',
      name: 'Loyalty Reward - Premium Members',
      type: 'percentage',
      value: '10% off',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      applicableProducts: ['All Products'],
      minPurchase: 300000,
      status: 'active',
      usageCount: 156
    }
  ])

  const getTypeColor = (type: string) => {
    const colors: any = {
      percentage: 'bg-blue-100 text-blue-700 border-blue-200',
      'fixed-amount': 'bg-green-100 text-green-700 border-green-200',
      bogo: 'bg-purple-100 text-purple-700 border-purple-200',
      bundle: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[type] || colors.percentage
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-700 border-green-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status] || colors.active
  }

  const activePromotions = promotions.filter(p => p.status === 'active').length
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0)

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Promotion
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Promotions</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{promotions.length}</p>
              <p className="text-xs text-blue-700 mt-1">All time campaigns</p>
            </div>
            <Gift className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Now</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activePromotions}</p>
              <p className="text-xs text-green-700 mt-1">Currently running</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalUsage}</p>
              <p className="text-xs text-purple-700 mt-1">Times applied</p>
            </div>
            <Tag className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Scheduled</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {promotions.filter(p => p.status === 'scheduled').length}
              </p>
              <p className="text-xs text-orange-700 mt-1">Upcoming campaigns</p>
            </div>
            <Calendar className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium">
          All Promotions ({promotions.length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Active ({activePromotions})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Scheduled ({promotions.filter(p => p.status === 'scheduled').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Expired ({promotions.filter(p => p.status === 'expired').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search promotions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promotion Name</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicable To</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                    <div className="text-xs text-gray-500">{promo.id}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeColor(promo.type)}`}>
                      {promo.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-green-700">{promo.value}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {new Date(promo.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="text-xs text-gray-500">to</div>
                    <div className="text-xs text-gray-700">
                      {new Date(promo.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-700 max-w-xs">
                      {promo.applicableProducts.slice(0, 2).join(', ')}
                      {promo.applicableProducts.length > 2 && ` +${promo.applicableProducts.length - 2} more`}
                    </div>
                    {promo.minPurchase && (
                      <div className="text-xs text-gray-500 mt-1">
                        Min: ₹{(promo.minPurchase / 100000).toFixed(1)}L
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">{promo.usageCount}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(promo.status)}`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        {promo.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion Types Info */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-orange-900 mb-2">Promotion Types:</h3>
        <ul className="text-xs text-orange-700 space-y-1">
          <li><strong>Percentage:</strong> Apply a percentage discount on eligible products</li>
          <li><strong>Fixed Amount:</strong> Deduct a fixed amount from the total price</li>
          <li><strong>BOGO (Buy One Get One):</strong> Free or discounted products with purchase</li>
          <li><strong>Bundle:</strong> Special pricing when buying multiple products together</li>
        </ul>
      </div>
    </div>
  )
}
