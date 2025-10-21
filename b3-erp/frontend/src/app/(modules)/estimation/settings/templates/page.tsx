'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Edit2,
  Copy,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Plus,
  Star
} from 'lucide-react'

interface EstimateTemplate {
  id: string
  templateCode: string
  templateName: string
  category: string
  description: string
  sections: number
  lineItems: number
  defaultMarkup: number
  usageCount: number
  lastUsed: string
  createdBy: string
  createdDate: string
  isDefault: boolean
  status: 'active' | 'draft' | 'archived'
}

export default function EstimationSettingsTemplatesPage() {
  const router = useRouter()

  const [templates] = useState<EstimateTemplate[]>([
    {
      id: 'TPL-001',
      templateCode: 'MOD-KIT-STD',
      templateName: 'Standard Modular Kitchen',
      category: 'Modular Kitchen',
      description: 'Standard template for 10x10 ft modular kitchen with base and wall cabinets, countertop, and sink',
      sections: 8,
      lineItems: 35,
      defaultMarkup: 48,
      usageCount: 145,
      lastUsed: '2025-10-18',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      isDefault: true,
      status: 'active'
    },
    {
      id: 'TPL-002',
      templateCode: 'MOD-KIT-PREM',
      templateName: 'Premium Modular Kitchen',
      category: 'Modular Kitchen',
      description: 'Premium template with island, breakfast counter, premium appliances, and high-end finishes',
      sections: 12,
      lineItems: 58,
      defaultMarkup: 52,
      usageCount: 87,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'TPL-003',
      templateCode: 'COMM-KIT',
      templateName: 'Commercial Kitchen',
      category: 'Commercial Kitchen',
      description: 'Template for restaurant/commercial kitchen with industrial equipment and compliance requirements',
      sections: 10,
      lineItems: 45,
      defaultMarkup: 55,
      usageCount: 64,
      lastUsed: '2025-10-17',
      createdBy: 'Admin',
      createdDate: '2024-02-10',
      isDefault: true,
      status: 'active'
    },
    {
      id: 'TPL-004',
      templateCode: 'L-SHAPE',
      templateName: 'L-Shaped Kitchen',
      category: 'L-Shaped Kitchen',
      description: 'L-shaped layout optimized for medium-sized kitchens with efficient workflow',
      sections: 7,
      lineItems: 32,
      defaultMarkup: 48,
      usageCount: 112,
      lastUsed: '2025-10-20',
      createdBy: 'Amit Sharma',
      createdDate: '2024-03-05',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'TPL-005',
      templateCode: 'ISLAND-KIT',
      templateName: 'Island Kitchen',
      category: 'Island Kitchen',
      description: 'Island kitchen with central cooking island and surrounding work areas',
      sections: 10,
      lineItems: 48,
      defaultMarkup: 50,
      usageCount: 78,
      lastUsed: '2025-10-16',
      createdBy: 'Neha Patel',
      createdDate: '2024-03-20',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'TPL-006',
      templateCode: 'PARALLEL-KIT',
      templateName: 'Parallel Kitchen',
      category: 'Parallel Kitchen',
      description: 'Galley-style parallel kitchen for narrow spaces with efficient storage',
      sections: 6,
      lineItems: 28,
      defaultMarkup: 47,
      usageCount: 95,
      lastUsed: '2025-10-15',
      createdBy: 'Vikram Singh',
      createdDate: '2024-04-10',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'TPL-007',
      templateCode: 'U-SHAPE',
      templateName: 'U-Shaped Kitchen',
      category: 'U-Shaped Kitchen',
      description: 'U-shaped layout with three walls of cabinets and counters',
      sections: 9,
      lineItems: 42,
      defaultMarkup: 49,
      usageCount: 89,
      lastUsed: '2025-10-14',
      createdBy: 'Amit Sharma',
      createdDate: '2024-04-25',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'TPL-008',
      templateCode: 'COMPACT-KIT',
      templateName: 'Compact Kitchen',
      category: 'Compact Kitchen',
      description: 'Space-saving design for small apartments and studio units',
      sections: 5,
      lineItems: 22,
      defaultMarkup: 45,
      usageCount: 156,
      lastUsed: '2025-10-19',
      createdBy: 'Ravi Kumar',
      createdDate: '2024-05-12',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'TPL-009',
      templateCode: 'BUILDER-PKG',
      templateName: 'Builder Package',
      category: 'Builder Package',
      description: 'Standard builder package for residential projects with bulk discounting',
      sections: 6,
      lineItems: 18,
      defaultMarkup: 42,
      usageCount: 43,
      lastUsed: '2025-10-12',
      createdBy: 'Admin',
      createdDate: '2024-06-01',
      isDefault: true,
      status: 'active'
    },
    {
      id: 'TPL-010',
      templateCode: 'RENOVATION',
      templateName: 'Kitchen Renovation',
      category: 'Renovation',
      description: 'Template for kitchen renovation projects including demolition and disposal',
      sections: 9,
      lineItems: 38,
      defaultMarkup: 50,
      usageCount: 67,
      lastUsed: '2025-10-13',
      createdBy: 'Neha Patel',
      createdDate: '2024-07-15',
      isDefault: false,
      status: 'active'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalTemplates = templates.length
  const activeTemplates = templates.filter(t => t.status === 'active').length
  const defaultTemplates = templates.filter(t => t.isDefault).length
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estimate Templates</h1>
            <p className="text-sm text-gray-600 mt-1">Pre-configured templates for quick estimates</p>
          </div>
        </div>
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
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalTemplates}</p>
              <p className="text-xs text-blue-700 mt-1">All templates</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeTemplates}</p>
              <p className="text-xs text-green-700 mt-1">Ready to use</p>
            </div>
            <FileText className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Default Templates</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{defaultTemplates}</p>
              <p className="text-xs text-purple-700 mt-1">Category defaults</p>
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
            <FileText className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {template.templateCode}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                      {template.status.toUpperCase()}
                    </span>
                    {template.isDefault && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{template.templateName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.category}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{template.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Sections</p>
                  <p className="text-lg font-bold text-blue-900">{template.sections}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Line Items</p>
                  <p className="text-lg font-bold text-green-900">{template.lineItems}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 mb-1">Default Markup</p>
                  <p className="text-lg font-bold text-purple-900">{template.defaultMarkup}%</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-600 mb-1">Usage Count</p>
                  <p className="text-lg font-bold text-orange-900">{template.usageCount}</p>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-4 space-y-1">
                <p>Created by {template.createdBy} on {template.createdDate}</p>
                <p>Last used: {template.lastUsed}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
