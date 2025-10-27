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
  TrendingUp,
  Clock
} from 'lucide-react'

interface ContractTemplate {
  id: string
  name: string
  description: string
  category: string
  type: 'sales' | 'service' | 'nda' | 'partnership' | 'employment'
  clauses: number
  pages: number
  usageCount: number
  lastUsed: string
  avgContractValue: number
  avgDuration: string
  isFavorite: boolean
  status: 'active' | 'draft' | 'archived'
  createdBy: string
  createdDate: string
}

export default function CPQContractsTemplatesPage() {
  const router = useRouter()

  const [templates] = useState<ContractTemplate[]>([
    {
      id: 'CTPL-001',
      name: 'Standard Sales Contract',
      description: 'Standard B2B sales agreement for modular kitchen projects',
      category: 'Sales',
      type: 'sales',
      clauses: 15,
      pages: 12,
      usageCount: 234,
      lastUsed: '2024-10-18',
      avgContractValue: 2500000,
      avgDuration: '12 months',
      isFavorite: true,
      status: 'active',
      createdBy: 'Legal Team',
      createdDate: '2024-01-15'
    },
    {
      id: 'CTPL-002',
      name: 'Premium Service Agreement',
      description: 'Comprehensive service contract with extended warranty and support',
      category: 'Service',
      type: 'service',
      clauses: 18,
      pages: 16,
      usageCount: 156,
      lastUsed: '2024-10-17',
      avgContractValue: 3200000,
      avgDuration: '24 months',
      isFavorite: true,
      status: 'active',
      createdBy: 'Legal Team',
      createdDate: '2024-02-20'
    },
    {
      id: 'CTPL-003',
      name: 'Bulk Order Contract',
      description: 'Volume purchase agreement for builder projects with special terms',
      category: 'Sales',
      type: 'sales',
      clauses: 16,
      pages: 14,
      usageCount: 87,
      lastUsed: '2024-10-15',
      avgContractValue: 5800000,
      avgDuration: '18 months',
      isFavorite: false,
      status: 'active',
      createdBy: 'Legal Team',
      createdDate: '2024-03-10'
    },
    {
      id: 'CTPL-004',
      name: 'Maintenance Contract',
      description: 'Annual maintenance agreement for post-installation support',
      category: 'Service',
      type: 'service',
      clauses: 12,
      pages: 8,
      usageCount: 312,
      lastUsed: '2024-10-18',
      avgContractValue: 450000,
      avgDuration: '12 months',
      isFavorite: true,
      status: 'active',
      createdBy: 'Service Team',
      createdDate: '2024-01-25'
    },
    {
      id: 'CTPL-005',
      name: 'NDA - Standard',
      description: 'Non-disclosure agreement for business partners and suppliers',
      category: 'Legal',
      type: 'nda',
      clauses: 8,
      pages: 4,
      usageCount: 445,
      lastUsed: '2024-10-18',
      avgContractValue: 0,
      avgDuration: '36 months',
      isFavorite: true,
      status: 'active',
      createdBy: 'Legal Team',
      createdDate: '2024-01-10'
    },
    {
      id: 'CTPL-006',
      name: 'Partnership Agreement',
      description: 'Strategic partnership contract for dealer/distributor networks',
      category: 'Partnership',
      type: 'partnership',
      clauses: 20,
      pages: 18,
      usageCount: 45,
      lastUsed: '2024-10-10',
      avgContractValue: 0,
      avgDuration: '60 months',
      isFavorite: false,
      status: 'active',
      createdBy: 'Business Development',
      createdDate: '2024-04-05'
    },
    {
      id: 'CTPL-007',
      name: 'Installation Service Contract',
      description: 'Specific contract for kitchen installation services only',
      category: 'Service',
      type: 'service',
      clauses: 10,
      pages: 6,
      usageCount: 198,
      lastUsed: '2024-10-16',
      avgContractValue: 125000,
      avgDuration: '1 month',
      isFavorite: false,
      status: 'active',
      createdBy: 'Operations',
      createdDate: '2024-05-12'
    },
    {
      id: 'CTPL-008',
      name: 'Warranty Extension Contract',
      description: 'Extended warranty agreement beyond standard coverage',
      category: 'Service',
      type: 'service',
      clauses: 9,
      pages: 5,
      usageCount: 267,
      lastUsed: '2024-10-17',
      avgContractValue: 285000,
      avgDuration: '24 months',
      isFavorite: false,
      status: 'active',
      createdBy: 'Service Team',
      createdDate: '2024-06-18'
    }
  ])

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Sales: 'bg-blue-100 text-blue-700 border-blue-200',
      Service: 'bg-green-100 text-green-700 border-green-200',
      Legal: 'bg-purple-100 text-purple-700 border-purple-200',
      Partnership: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[category] || colors.Sales
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <Clock className="h-10 w-10 text-green-600" />
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
              <p className="text-xs text-orange-700 mt-1">Contracts created</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Templates ({totalTemplates})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Sales ({templates.filter(t => t.category === 'Sales').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Service ({templates.filter(t => t.category === 'Service').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Legal ({templates.filter(t => t.category === 'Legal').length})
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
            placeholder="Search templates by name, category, or type..."
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
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(template.status)}`}>
                {template.status}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-4 line-clamp-2">{template.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Clauses</p>
                <p className="font-semibold text-gray-900">{template.clauses}</p>
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
                <p className="text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">{template.avgDuration}</p>
              </div>
            </div>

            {template.avgContractValue > 0 && (
              <div className="mb-3 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Avg Value:</span>
                  <span className="font-semibold text-blue-600">₹{(template.avgContractValue / 100000).toFixed(2)}L</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
              <span>Last used: {new Date(template.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              <span className="text-gray-500">by {template.createdBy}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                <Plus className="h-3 w-3" />
                Use Template
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                aria-label="View"
               
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                aria-label="Edit"
               
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                aria-label="Copy"
               
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Contract Template Features:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Pre-approved Clauses:</strong> Legal-reviewed clauses ensure compliance</li>
          <li><strong>Customizable:</strong> Modify templates while maintaining legal structure</li>
          <li><strong>Version Control:</strong> Track template changes and maintain history</li>
          <li><strong>Usage Analytics:</strong> See which templates are most effective</li>
          <li><strong>Quick Generation:</strong> Create contracts 10x faster with templates</li>
        </ul>
      </div>
    </div>
  )
}
