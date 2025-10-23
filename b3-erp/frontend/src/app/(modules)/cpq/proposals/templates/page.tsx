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
  ToggleRight,
  Layers,
  TrendingUp
} from 'lucide-react'

interface ProposalTemplate {
  id: string
  name: string
  description: string
  category: string
  sections: number
  pages: number
  lastUsed: string
  usageCount: number
  successRate: number
  avgDealSize: number
  isFavorite: boolean
  status: 'active' | 'draft' | 'archived'
  thumbnail: string
  createdBy: string
  createdDate: string
}

export default function CPQProposalsTemplatesPage() {
  const router = useRouter()

  const [templates] = useState<ProposalTemplate[]>([
    {
      id: 'TPL-P001',
      name: 'Premium Kitchen Proposal',
      description: 'Comprehensive proposal template for premium modular kitchen projects with 3D visualizations',
      category: 'Premium',
      sections: 12,
      pages: 24,
      lastUsed: '2024-10-18',
      usageCount: 156,
      successRate: 72,
      avgDealSize: 2850000,
      isFavorite: true,
      status: 'active',
      thumbnail: '/templates/premium-kitchen.jpg',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-06-15'
    },
    {
      id: 'TPL-P002',
      name: 'Standard Kitchen Proposal',
      description: 'Standard template for mid-range modular kitchen projects',
      category: 'Standard',
      sections: 8,
      pages: 16,
      lastUsed: '2024-10-17',
      usageCount: 243,
      successRate: 68,
      avgDealSize: 1750000,
      isFavorite: true,
      status: 'active',
      thumbnail: '/templates/standard-kitchen.jpg',
      createdBy: 'Priya Sharma',
      createdDate: '2024-05-20'
    },
    {
      id: 'TPL-P003',
      name: 'L-Shaped Kitchen Proposal',
      description: 'Specialized template for L-shaped kitchen layouts with space optimization',
      category: 'Layout-Specific',
      sections: 10,
      pages: 18,
      lastUsed: '2024-10-16',
      usageCount: 187,
      successRate: 70,
      avgDealSize: 2100000,
      isFavorite: false,
      status: 'active',
      thumbnail: '/templates/l-shaped.jpg',
      createdBy: 'Amit Patel',
      createdDate: '2024-07-10'
    },
    {
      id: 'TPL-P004',
      name: 'Island Kitchen Proposal',
      description: 'Luxury template for island kitchen configurations',
      category: 'Luxury',
      sections: 14,
      pages: 28,
      lastUsed: '2024-10-15',
      usageCount: 92,
      successRate: 75,
      avgDealSize: 4200000,
      isFavorite: true,
      status: 'active',
      thumbnail: '/templates/island.jpg',
      createdBy: 'Neha Gupta',
      createdDate: '2024-08-05'
    },
    {
      id: 'TPL-P005',
      name: 'Builder Economy Package',
      description: 'Quick proposal template for builder economy projects with standard features',
      category: 'Economy',
      sections: 6,
      pages: 12,
      lastUsed: '2024-10-12',
      usageCount: 324,
      successRate: 64,
      avgDealSize: 950000,
      isFavorite: false,
      status: 'active',
      thumbnail: '/templates/economy.jpg',
      createdBy: 'Vikram Singh',
      createdDate: '2024-04-18'
    },
    {
      id: 'TPL-P006',
      name: 'Custom Design Proposal',
      description: 'Flexible template for fully customized kitchen designs',
      category: 'Custom',
      sections: 16,
      pages: 32,
      lastUsed: '2024-10-10',
      usageCount: 78,
      successRate: 78,
      avgDealSize: 5800000,
      isFavorite: false,
      status: 'active',
      thumbnail: '/templates/custom.jpg',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-09-01'
    },
    {
      id: 'TPL-P007',
      name: 'Renovation Proposal',
      description: 'Template for kitchen renovation and remodeling projects',
      category: 'Renovation',
      sections: 9,
      pages: 18,
      lastUsed: '2024-09-28',
      usageCount: 134,
      successRate: 66,
      avgDealSize: 1450000,
      isFavorite: false,
      status: 'active',
      thumbnail: '/templates/renovation.jpg',
      createdBy: 'Priya Sharma',
      createdDate: '2024-07-22'
    },
    {
      id: 'TPL-P008',
      name: 'Quick Quote Proposal',
      description: 'Lightweight template for quick quotations with essential details only',
      category: 'Quick',
      sections: 5,
      pages: 8,
      lastUsed: '2024-10-08',
      usageCount: 412,
      successRate: 58,
      avgDealSize: 725000,
      isFavorite: true,
      status: 'active',
      thumbnail: '/templates/quick.jpg',
      createdBy: 'Amit Patel',
      createdDate: '2024-03-15'
    }
  ])

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Premium: 'bg-purple-100 text-purple-700 border-purple-200',
      Luxury: 'bg-blue-100 text-blue-700 border-blue-200',
      Standard: 'bg-green-100 text-green-700 border-green-200',
      Economy: 'bg-orange-100 text-orange-700 border-orange-200',
      'Layout-Specific': 'bg-pink-100 text-pink-700 border-pink-200',
      Custom: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      Renovation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Quick: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[category] || colors.Standard
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-700 border-green-200',
      draft: 'bg-orange-100 text-orange-700 border-orange-200',
      archived: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status] || colors.active
  }

  const totalTemplates = templates.length
  const activeTemplates = templates.filter(t => t.status === 'active').length
  const favoriteTemplates = templates.filter(t => t.isFavorite).length
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)
  const avgSuccessRate = (templates.reduce((sum, t) => sum + t.successRate, 0) / templates.length).toFixed(1)

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
            Create Template
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Templates</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalTemplates}</p>
              <p className="text-xs text-blue-700 mt-1">Available</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeTemplates}</p>
              <p className="text-xs text-green-700 mt-1">In use</p>
            </div>
            <ToggleRight className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Favorites</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{favoriteTemplates}</p>
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
              <p className="text-xs text-orange-700 mt-1">Proposals created</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-5 border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600">Avg Success Rate</p>
              <p className="text-2xl font-bold text-pink-900 mt-1">{avgSuccessRate}%</p>
              <p className="text-xs text-pink-700 mt-1">Win rate</p>
            </div>
            <Layers className="h-10 w-10 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Templates ({totalTemplates})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Premium
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Standard
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Economy
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Favorites ({favoriteTemplates})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates by name, category, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Template Thumbnail */}
            <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
              <FileText className="h-16 w-16 text-blue-600 opacity-50" />
              {template.isFavorite && (
                <div className="absolute top-2 right-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{template.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(template.status)}`}>
                  {template.status}
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">Sections</p>
                  <p className="font-semibold text-gray-900">{template.sections}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">Pages</p>
                  <p className="font-semibold text-gray-900">{template.pages}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">Usage</p>
                  <p className="font-semibold text-gray-900">{template.usageCount}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">Win Rate</p>
                  <p className="font-semibold text-green-600">{template.successRate}%</p>
                </div>
              </div>

              <div className="mb-3 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Avg Deal Size:</span>
                  <span className="font-semibold text-blue-600">₹{(template.avgDealSize / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 mt-1">
                  <span>Last used:</span>
                  <span>{new Date(template.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                  <Plus className="h-3 w-3" />
                  Use Template
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                  aria-label="View"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                  aria-label="Copy"
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Proposal Template Benefits:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Consistency:</strong> Maintain professional branding and formatting across all proposals</li>
          <li><strong>Speed:</strong> Create proposals 10x faster using pre-built templates</li>
          <li><strong>Success Rate:</strong> Track which templates perform best and replicate winning patterns</li>
          <li><strong>Customization:</strong> Templates are fully customizable while maintaining structure</li>
        </ul>
      </div>
    </div>
  )
}
