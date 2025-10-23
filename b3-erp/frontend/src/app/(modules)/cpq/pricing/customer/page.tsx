'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Star,
  TrendingUp,
  DollarSign,
  Award
} from 'lucide-react'

interface CustomerPricing {
  id: string
  customerName: string
  customerId: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  baseDiscount: number
  specialTerms: string
  lifetimeValue: number
  activeContracts: number
  lastUpdated: string
}

export default function CPQPricingCustomerPage() {
  const router = useRouter()

  const [customerPricing] = useState<CustomerPricing[]>([
    {
      id: 'CP-001',
      customerName: 'Prestige Properties Ltd',
      customerId: 'CUST-1234',
      tier: 'platinum',
      baseDiscount: 18,
      specialTerms: 'Net 60 days, Free installation on orders > ₹50L',
      lifetimeValue: 12500000,
      activeContracts: 8,
      lastUpdated: '2024-10-15'
    },
    {
      id: 'CP-002',
      customerName: 'Urban Homes Pvt Ltd',
      customerId: 'CUST-2156',
      tier: 'gold',
      baseDiscount: 12,
      specialTerms: 'Net 45 days, Volume discount on bulk orders',
      lifetimeValue: 7800000,
      activeContracts: 5,
      lastUpdated: '2024-10-12'
    },
    {
      id: 'CP-003',
      customerName: 'Elite Builders & Developers',
      customerId: 'CUST-3421',
      tier: 'platinum',
      baseDiscount: 20,
      specialTerms: 'Net 90 days, Dedicated account manager, Priority support',
      lifetimeValue: 15200000,
      activeContracts: 12,
      lastUpdated: '2024-10-18'
    },
    {
      id: 'CP-004',
      customerName: 'Skyline Constructions',
      customerId: 'CUST-4567',
      tier: 'gold',
      baseDiscount: 10,
      specialTerms: 'Net 30 days, Quarterly rebates',
      lifetimeValue: 6300000,
      activeContracts: 4,
      lastUpdated: '2024-10-10'
    },
    {
      id: 'CP-005',
      customerName: 'Modern Living Interiors',
      customerId: 'CUST-5678',
      tier: 'silver',
      baseDiscount: 8,
      specialTerms: 'Net 30 days, Standard warranty',
      lifetimeValue: 3200000,
      activeContracts: 2,
      lastUpdated: '2024-10-08'
    },
    {
      id: 'CP-006',
      customerName: 'Habitat Homes',
      customerId: 'CUST-6789',
      tier: 'silver',
      baseDiscount: 7,
      specialTerms: 'Net 30 days, Basic support',
      lifetimeValue: 2800000,
      activeContracts: 3,
      lastUpdated: '2024-10-05'
    },
    {
      id: 'CP-007',
      customerName: 'Green Valley Builders',
      customerId: 'CUST-7890',
      tier: 'bronze',
      baseDiscount: 5,
      specialTerms: 'Net 15 days, Standard pricing',
      lifetimeValue: 1500000,
      activeContracts: 1,
      lastUpdated: '2024-10-02'
    }
  ])

  const getTierColor = (tier: string) => {
    const colors: any = {
      platinum: 'bg-purple-100 text-purple-700 border-purple-200',
      gold: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      silver: 'bg-gray-100 text-gray-700 border-gray-200',
      bronze: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[tier] || colors.bronze
  }

  const getTierIcon = (tier: string) => {
    if (tier === 'platinum') return <Award className="h-4 w-4" />
    if (tier === 'gold') return <Star className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

  const totalLifetimeValue = customerPricing.reduce((sum, c) => sum + c.lifetimeValue, 0)
  const avgDiscount = customerPricing.reduce((sum, c) => sum + c.baseDiscount, 0) / customerPricing.length

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
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Customers</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{customerPricing.length}</p>
              <p className="text-xs text-blue-700 mt-1">With custom pricing</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Lifetime Value</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ₹{(totalLifetimeValue / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-xs text-green-700 mt-1">Total customer value</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Premium Tiers</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {customerPricing.filter(c => c.tier === 'platinum' || c.tier === 'gold').length}
              </p>
              <p className="text-xs text-purple-700 mt-1">Platinum + Gold</p>
            </div>
            <Award className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Discount</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{avgDiscount.toFixed(1)}%</p>
              <p className="text-xs text-orange-700 mt-1">Across all customers</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tier Filter */}
      <div className="mb-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium">
          All Customers ({customerPricing.length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Platinum ({customerPricing.filter(c => c.tier === 'platinum').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Gold ({customerPricing.filter(c => c.tier === 'gold').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Silver ({customerPricing.filter(c => c.tier === 'silver').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Bronze ({customerPricing.filter(c => c.tier === 'bronze').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Pricing Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Base Discount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Special Terms</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lifetime Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Contracts</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerPricing.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                    <div className="text-xs text-gray-500">{customer.customerId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full border ${getTierColor(customer.tier)}`}>
                      {getTierIcon(customer.tier)}
                      {customer.tier}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-green-700">{customer.baseDiscount}%</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-700 max-w-xs">{customer.specialTerms}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{(customer.lifetimeValue / 100000).toFixed(1)}L
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">{customer.activeContracts}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600">{customer.lastUpdated}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Tier Info */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Customer Tier Benefits:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-700">
          <div>
            <p><strong>Platinum (15-20%):</strong> Highest discount, Net 60-90 days, dedicated support, priority service</p>
            <p className="mt-1"><strong>Gold (10-15%):</strong> Premium discount, Net 45 days, quarterly rebates, enhanced support</p>
          </div>
          <div>
            <p><strong>Silver (7-10%):</strong> Standard discount, Net 30 days, regular warranty, basic support</p>
            <p className="mt-1"><strong>Bronze (3-7%):</strong> Entry discount, Net 15 days, standard terms, self-service</p>
          </div>
        </div>
      </div>
    </div>
  )
}
