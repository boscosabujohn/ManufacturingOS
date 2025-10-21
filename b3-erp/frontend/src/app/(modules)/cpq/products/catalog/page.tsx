'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  Copy,
  Archive,
  DollarSign,
  Tag,
  Grid3x3,
  Image
} from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  category: string
  basePrice: number
  status: 'active' | 'inactive' | 'discontinued'
  variants: number
  lastModified: string
  image: string
}

export default function CPQProductsCatalogPage() {
  const router = useRouter()

  const [products] = useState<Product[]>([
    {
      id: 'PROD-001',
      sku: 'PMK-LUX-001',
      name: 'Premium Modular Kitchen - Island Configuration',
      category: 'Premium Modular Kitchen',
      basePrice: 6500000,
      status: 'active',
      variants: 12,
      lastModified: '2025-10-18',
      image: '🏠'
    },
    {
      id: 'PROD-002',
      sku: 'ISL-STD-001',
      name: 'Standard Island Kitchen Package',
      category: 'Island Kitchen',
      basePrice: 4200000,
      status: 'active',
      variants: 8,
      lastModified: '2025-10-17',
      image: '🏡'
    },
    {
      id: 'PROD-003',
      sku: 'LSH-MOD-001',
      name: 'L-Shaped Modular Kitchen',
      category: 'L-Shaped Kitchen',
      basePrice: 2800000,
      status: 'active',
      variants: 10,
      lastModified: '2025-10-16',
      image: '🏘️'
    },
    {
      id: 'PROD-004',
      sku: 'PAR-STD-001',
      name: 'Parallel Kitchen with Breakfast Counter',
      category: 'Parallel Kitchen',
      basePrice: 3100000,
      status: 'active',
      variants: 6,
      lastModified: '2025-10-15',
      image: '🏚️'
    },
    {
      id: 'PROD-005',
      sku: 'COM-MIN-001',
      name: 'Compact Kitchen for Studio Apartments',
      category: 'Compact Kitchen',
      basePrice: 850000,
      status: 'active',
      variants: 5,
      lastModified: '2025-10-14',
      image: '🏢'
    },
    {
      id: 'PROD-006',
      sku: 'CMR-PRO-001',
      name: 'Commercial Kitchen - Restaurant Setup',
      category: 'Commercial Kitchen',
      basePrice: 12500000,
      status: 'active',
      variants: 15,
      lastModified: '2025-10-13',
      image: '🏭'
    },
    {
      id: 'PROD-007',
      sku: 'INS-HOT-001',
      name: 'Institutional Kitchen - Hotel Package',
      category: 'Institutional Kitchen',
      basePrice: 18500000,
      status: 'active',
      variants: 20,
      lastModified: '2025-10-12',
      image: '🏨'
    },
    {
      id: 'PROD-008',
      sku: 'BLD-PKG-001',
      name: 'Builder Package - Standard Kitchen Bundle',
      category: 'Builder Package',
      basePrice: 22000000,
      status: 'active',
      variants: 8,
      lastModified: '2025-10-10',
      image: '🏗️'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'discontinued':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const categories = [
    'All Categories',
    'Premium Modular Kitchen',
    'Island Kitchen',
    'L-Shaped Kitchen',
    'Parallel Kitchen',
    'Compact Kitchen',
    'Commercial Kitchen',
    'Institutional Kitchen',
    'Builder Package'
  ]

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
            Add Product
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{products.length}</p>
              <p className="text-xs text-blue-700 mt-1">In catalog</p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Products</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {products.filter(p => p.status === 'active').length}
              </p>
              <p className="text-xs text-green-700 mt-1">Available for sale</p>
            </div>
            <Tag className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Variants</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {products.reduce((sum, p) => sum + p.variants, 0)}
              </p>
              <p className="text-xs text-purple-700 mt-1">Configuration options</p>
            </div>
            <Grid3x3 className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Base Price</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                ₹{((products.reduce((sum, p) => sum + p.basePrice, 0) / products.length) / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-orange-700 mt-1">Per product</p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 ${
                category === 'All Categories'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } rounded-lg text-sm font-medium`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-6xl">{product.image}</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-700 text-right">{product.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Base Price:</span>
                  <span className="font-semibold text-blue-600">₹{(product.basePrice / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Variants:</span>
                  <span className="font-medium text-gray-700">{product.variants} options</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Last Modified:</span>
                  <span className="font-medium text-gray-700">{product.lastModified}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 text-xs">
                  <Eye className="h-3 w-3" />
                  View
                </button>
                <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs">
                  <Edit className="h-3 w-3" />
                </button>
                <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{products.length}</span> products
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
