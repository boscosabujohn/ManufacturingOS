'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package2,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  Trash2,
  DollarSign,
  Tag,
  ShoppingCart
} from 'lucide-react'

interface Bundle {
  id: string
  name: string
  description: string
  products: number
  basePrice: number
  bundlePrice: number
  savings: number
  status: 'active' | 'inactive'
  popularity: number
}

export default function CPQProductsBundlesPage() {
  const router = useRouter()

  const [bundles] = useState<Bundle[]>([
    {
      id: 'BUN-001',
      name: 'Complete Premium Kitchen Package',
      description: 'Premium modular kitchen with island, appliances, and accessories',
      products: 8,
      basePrice: 8500000,
      bundlePrice: 7650000,
      savings: 10,
      status: 'active',
      popularity: 92
    },
    {
      id: 'BUN-002',
      name: 'Essential Kitchen Starter Bundle',
      description: 'L-shaped kitchen with basic appliances and countertop',
      products: 5,
      basePrice: 3500000,
      bundlePrice: 3150000,
      savings: 10,
      status: 'active',
      popularity: 88
    },
    {
      id: 'BUN-003',
      name: 'Compact Studio Kitchen Set',
      description: 'Space-saving kitchen with essential appliances',
      products: 4,
      basePrice: 1200000,
      bundlePrice: 1020000,
      savings: 15,
      status: 'active',
      popularity: 85
    },
    {
      id: 'BUN-004',
      name: 'Commercial Kitchen Pro Package',
      description: 'Industrial-grade equipment for restaurants',
      products: 12,
      basePrice: 15000000,
      bundlePrice: 13500000,
      savings: 10,
      status: 'active',
      popularity: 78
    },
    {
      id: 'BUN-005',
      name: 'Builder Economy Package',
      description: 'Bulk package for builder projects - 50 units',
      products: 6,
      basePrice: 25000000,
      bundlePrice: 21250000,
      savings: 15,
      status: 'active',
      popularity: 95
    },
    {
      id: 'BUN-006',
      name: 'Luxury Island Kitchen Bundle',
      description: 'Premium island kitchen with wine cellar and smart appliances',
      products: 10,
      basePrice: 12000000,
      bundlePrice: 10200000,
      savings: 15,
      status: 'active',
      popularity: 82
    }
  ])

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
  }

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
            Create Bundle
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Bundles</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{bundles.length}</p>
              <p className="text-xs text-blue-700 mt-1">Active offers</p>
            </div>
            <Package2 className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Savings</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {(bundles.reduce((sum, b) => sum + b.savings, 0) / bundles.length).toFixed(0)}%
              </p>
              <p className="text-xs text-green-700 mt-1">For customers</p>
            </div>
            <Tag className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Products</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {bundles.reduce((sum, b) => sum + b.products, 0)}
              </p>
              <p className="text-xs text-purple-700 mt-1">In bundles</p>
            </div>
            <ShoppingCart className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Bundle Value</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                ₹{(bundles.reduce((sum, b) => sum + b.bundlePrice, 0) / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-xs text-orange-700 mt-1">Total worth</p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bundles by name or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Package2 className="h-16 w-16 text-blue-600" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{bundle.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bundle.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(bundle.status)}`}>
                  {bundle.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium text-gray-900">{bundle.products} items</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium text-gray-900 line-through">₹{(bundle.basePrice / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bundle Price:</span>
                  <span className="font-bold text-green-600">₹{(bundle.bundlePrice / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">Save {bundle.savings}%</span>
                  <span className="text-xs text-gray-500">Popularity: {bundle.popularity}%</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${bundle.popularity}%` }}
                ></div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button
                  className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
