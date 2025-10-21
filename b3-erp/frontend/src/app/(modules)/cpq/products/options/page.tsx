'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sliders,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Tag
} from 'lucide-react'

interface ProductOption {
  id: string
  name: string
  category: string
  type: 'dropdown' | 'checkbox' | 'radio' | 'text'
  required: boolean
  priceImpact: number
  options: string[]
  status: 'active' | 'inactive'
}

export default function CPQProductsOptionsPage() {
  const router = useRouter()

  const [productOptions] = useState<ProductOption[]>([
    {
      id: 'OPT-001',
      name: 'Cabinet Finish',
      category: 'Cabinets',
      type: 'dropdown',
      required: true,
      priceImpact: 50000,
      options: ['Matte', 'Glossy', 'Textured', 'Metallic'],
      status: 'active'
    },
    {
      id: 'OPT-002',
      name: 'Handle Type',
      category: 'Hardware',
      type: 'radio',
      required: true,
      priceImpact: 15000,
      options: ['Standard Pull', 'Designer Handle', 'Push-to-Open', 'Integrated'],
      status: 'active'
    },
    {
      id: 'OPT-003',
      name: 'Lighting Package',
      category: 'Electrical',
      type: 'checkbox',
      required: false,
      priceImpact: 45000,
      options: ['Under-cabinet LED', 'Task Lighting', 'Ambient Lighting', 'Smart Controls'],
      status: 'active'
    },
    {
      id: 'OPT-004',
      name: 'Backsplash Material',
      category: 'Finishes',
      type: 'dropdown',
      required: true,
      priceImpact: 35000,
      options: ['Ceramic Tiles', 'Glass', 'Stone', 'Stainless Steel'],
      status: 'active'
    },
    {
      id: 'OPT-005',
      name: 'Sink Configuration',
      category: 'Fixtures',
      type: 'radio',
      required: true,
      priceImpact: 25000,
      options: ['Single Bowl', 'Double Bowl', 'Triple Bowl', 'Undermount'],
      status: 'active'
    },
    {
      id: 'OPT-006',
      name: 'Storage Accessories',
      category: 'Accessories',
      type: 'checkbox',
      required: false,
      priceImpact: 30000,
      options: ['Pull-out Drawers', 'Corner Solutions', 'Spice Racks', 'Cutlery Organizers'],
      status: 'active'
    }
  ])

  const getTypeColor = (type: string) => {
    const colors: any = {
      dropdown: 'bg-blue-100 text-blue-700 border-blue-200',
      checkbox: 'bg-green-100 text-green-700 border-green-200',
      radio: 'bg-purple-100 text-purple-700 border-purple-200',
      text: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[type] || colors.dropdown
  }

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
            Add Option
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Options</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{productOptions.length}</p>
              <p className="text-xs text-blue-700 mt-1">Configuration fields</p>
            </div>
            <Sliders className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Options</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {productOptions.filter(o => o.status === 'active').length}
              </p>
              <p className="text-xs text-green-700 mt-1">Currently available</p>
            </div>
            <ToggleRight className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Required Options</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {productOptions.filter(o => o.required).length}
              </p>
              <p className="text-xs text-purple-700 mt-1">Mandatory fields</p>
            </div>
            <Tag className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Price Impact</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                ₹{(productOptions.reduce((sum, o) => sum + o.priceImpact, 0) / productOptions.length / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-orange-700 mt-1">Per option</p>
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
            placeholder="Search product options..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Options Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Option Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Required</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price Impact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Choices</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productOptions.map((option) => (
                <tr key={option.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{option.name}</div>
                    <div className="text-xs text-gray-500">{option.id}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{option.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeColor(option.type)}`}>
                      {option.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {option.required ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-red-100 text-red-700 border-red-200">
                        Required
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{(option.priceImpact / 1000).toFixed(0)}K
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-700 max-w-xs">
                      {option.options.slice(0, 2).join(', ')}
                      {option.options.length > 2 && ` +${option.options.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(option.status)}`}>
                      {option.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        {option.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                    </div>
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
