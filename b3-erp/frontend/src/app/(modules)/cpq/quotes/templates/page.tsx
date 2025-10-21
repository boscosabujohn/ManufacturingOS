'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Copy,
  Star,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

interface QuoteTemplate {
  id: string
  name: string
  description: string
  category: string
  sections: number
  lastUsed: string
  usageCount: number
  isFavorite: boolean
  status: 'active' | 'inactive'
}

export default function CPQQuotesTemplatesPage() {
  const router = useRouter()

  const [templates] = useState<QuoteTemplate[]>([
    {
      id: 'TPL-001',
      name: 'Premium Kitchen Package',
      description: 'Complete template for premium modular kitchen quotations',
      category: 'Premium',
      sections: 8,
      lastUsed: '2024-10-18',
      usageCount: 234,
      isFavorite: true,
      status: 'active'
    },
    {
      id: 'TPL-002',
      name: 'L-Shaped Kitchen Standard',
      description: 'Standard quotation template for L-shaped kitchen layouts',
      category: 'Standard',
      sections: 6,
      lastUsed: '2024-10-17',
      usageCount: 187,
      isFavorite: true,
      status: 'active'
    },
    {
      id: 'TPL-003',
      name: 'Island Kitchen Deluxe',
      description: 'Comprehensive template for island kitchen configurations',
      category: 'Deluxe',
      sections: 10,
      lastUsed: '2024-10-15',
      usageCount: 145,
      isFavorite: false,
      status: 'active'
    },
    {
      id: 'TPL-004',
      name: 'Builder Economy Package',
      description: 'Quick quote template for builder economy projects',
      category: 'Economy',
      sections: 5,
      lastUsed: '2024-10-12',
      usageCount: 312,
      isFavorite: true,
      status: 'active'
    },
    {
      id: 'TPL-005',
      name: 'Straight Kitchen Basic',
      description: 'Simple template for straight kitchen layouts',
      category: 'Basic',
      sections: 4,
      lastUsed: '2024-10-10',
      usageCount: 98,
      isFavorite: false,
      status: 'active'
    },
    {
      id: 'TPL-006',
      name: 'Custom Design Package',
      description: 'Flexible template for custom kitchen designs',
      category: 'Custom',
      sections: 12,
      lastUsed: '2024-10-08',
      usageCount: 67,
      isFavorite: false,
      status: 'active'
    },
    {
      id: 'TPL-007',
      name: 'Renovation Quote',
      description: 'Template for kitchen renovation projects',
      category: 'Renovation',
      sections: 7,
      lastUsed: '2024-09-25',
      usageCount: 45,
      isFavorite: false,
      status: 'inactive'
    }
  ])

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Premium: 'bg-purple-100 text-purple-700 border-purple-200',
      Deluxe: 'bg-blue-100 text-blue-700 border-blue-200',
      Standard: 'bg-green-100 text-green-700 border-green-200',
      Economy: 'bg-orange-100 text-orange-700 border-orange-200',
      Basic: 'bg-gray-100 text-gray-700 border-gray-200',
      Custom: 'bg-pink-100 text-pink-700 border-pink-200',
      Renovation: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return colors[category] || colors.Standard
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const favorites = templates.filter(t => t.isFavorite)
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)

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
            New Template
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Templates</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{templates.length}</p>
              <p className="text-xs text-blue-700 mt-1">Available templates</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {templates.filter(t => t.status === 'active').length}
              </p>
              <p className="text-xs text-green-700 mt-1">In use</p>
            </div>
            <ToggleRight className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Favorites</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{favorites.length}</p>
              <p className="text-xs text-purple-700 mt-1">Most used</p>
            </div>
            <Star className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Usage</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{totalUsage}</p>
              <p className="text-xs text-orange-700 mt-1">Times used</p>
            </div>
            <Copy className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Templates ({templates.length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Premium ({templates.filter(t => t.category === 'Premium').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Standard ({templates.filter(t => t.category === 'Standard').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Economy ({templates.filter(t => t.category === 'Economy').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{template.name}</h3>
                  {template.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{template.id}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Sections</p>
                <p className="font-semibold text-gray-900">{template.sections}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Usage</p>
                <p className="font-semibold text-gray-900">{template.usageCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
              <span>Last used: {new Date(template.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              <span className={`px-2 py-0.5 rounded-full border ${getStatusColor(template.status)}`}>
                {template.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                <Plus className="h-3 w-3" />
                Use Template
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quote Template Features:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Pre-configured Sections:</strong> Standard sections like customer info, line items, terms & conditions</li>
          <li><strong>Customizable Fields:</strong> Add or remove fields based on project requirements</li>
          <li><strong>Pricing Rules:</strong> Templates can include pre-defined pricing rules and discounts</li>
          <li><strong>Branding:</strong> Each template maintains consistent company branding and formatting</li>
        </ul>
      </div>
    </div>
  )
}
