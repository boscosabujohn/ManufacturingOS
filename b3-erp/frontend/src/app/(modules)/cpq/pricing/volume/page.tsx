'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  Package,
  Percent
} from 'lucide-react'

interface VolumePricingTier {
  id: string
  name: string
  category: string
  tier1: { min: number; max: number; discount: number }
  tier2: { min: number; max: number; discount: number }
  tier3: { min: number; max: number; discount: number }
  status: 'active' | 'inactive'
  applied: number
}

export default function CPQPricingVolumePage() {
  const router = useRouter()

  const [volumeTiers] = useState<VolumePricingTier[]>([
    {
      id: 'VT-001',
      name: 'Modular Kitchen Volume Discount',
      category: 'Modular Kitchens',
      tier1: { min: 1, max: 5, discount: 0 },
      tier2: { min: 6, max: 15, discount: 10 },
      tier3: { min: 16, max: 999, discount: 18 },
      status: 'active',
      applied: 234
    },
    {
      id: 'VT-002',
      name: 'Cabinet Bulk Pricing',
      category: 'Cabinets',
      tier1: { min: 1, max: 10, discount: 0 },
      tier2: { min: 11, max: 25, discount: 8 },
      tier3: { min: 26, max: 999, discount: 15 },
      status: 'active',
      applied: 187
    },
    {
      id: 'VT-003',
      name: 'Countertop Volume Deal',
      category: 'Countertops',
      tier1: { min: 1, max: 3, discount: 0 },
      tier2: { min: 4, max: 10, discount: 12 },
      tier3: { min: 11, max: 999, discount: 20 },
      status: 'active',
      applied: 156
    },
    {
      id: 'VT-004',
      name: 'Hardware Bulk Order',
      category: 'Hardware',
      tier1: { min: 1, max: 20, discount: 0 },
      tier2: { min: 21, max: 50, discount: 5 },
      tier3: { min: 51, max: 999, discount: 12 },
      status: 'active',
      applied: 298
    },
    {
      id: 'VT-005',
      name: 'Appliance Bundle Discount',
      category: 'Appliances',
      tier1: { min: 1, max: 2, discount: 0 },
      tier2: { min: 3, max: 5, discount: 15 },
      tier3: { min: 6, max: 999, discount: 25 },
      status: 'active',
      applied: 112
    },
    {
      id: 'VT-006',
      name: 'Builder Special - L-Shaped',
      category: 'L-Shaped Kitchens',
      tier1: { min: 1, max: 4, discount: 0 },
      tier2: { min: 5, max: 12, discount: 12 },
      tier3: { min: 13, max: 999, discount: 22 },
      status: 'active',
      applied: 89
    }
  ])

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const totalApplied = volumeTiers.reduce((sum, tier) => sum + tier.applied, 0)
  const avgMaxDiscount = volumeTiers.reduce((sum, tier) => sum + tier.tier3.discount, 0) / volumeTiers.length

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
            Add Tier
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Volume Tiers</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{volumeTiers.length}</p>
              <p className="text-xs text-blue-700 mt-1">Active pricing tiers</p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Applied</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalApplied}</p>
              <p className="text-xs text-green-700 mt-1">Orders with discounts</p>
            </div>
            <TrendingDown className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Max Discount</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgMaxDiscount.toFixed(0)}%</p>
              <p className="text-xs text-purple-700 mt-1">Highest tier average</p>
            </div>
            <Percent className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Categories</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {new Set(volumeTiers.map(t => t.category)).size}
              </p>
              <p className="text-xs text-orange-700 mt-1">Product categories</p>
            </div>
            <Package className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search volume pricing tiers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Volume Pricing Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tier 1 (Base)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tier 2</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tier 3 (Max)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Applied</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volumeTiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{tier.name}</div>
                    <div className="text-xs text-gray-500">{tier.id}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{tier.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {tier.tier1.min}-{tier.tier1.max} units
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {tier.tier1.discount}% off
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {tier.tier2.min}-{tier.tier2.max} units
                    </div>
                    <div className="text-sm font-semibold text-blue-700 mt-1">
                      {tier.tier2.discount}% off
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {tier.tier3.min}+ units
                    </div>
                    <div className="text-sm font-semibold text-green-700 mt-1">
                      {tier.tier3.discount}% off
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">{tier.applied}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(tier.status)}`}>
                      {tier.status}
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
                        {tier.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volume Pricing Info */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-900 mb-2">Volume Pricing Benefits:</h3>
        <ul className="text-xs text-green-700 space-y-1">
          <li><strong>Incentivizes Bulk Orders:</strong> Encourages customers to purchase larger quantities</li>
          <li><strong>Inventory Turnover:</strong> Helps move stock faster with attractive volume discounts</li>
          <li><strong>Customer Loyalty:</strong> Rewards repeat and bulk purchasers with better pricing</li>
          <li><strong>Competitive Edge:</strong> Offers better value for large orders compared to competitors</li>
        </ul>
      </div>
    </div>
  )
}
