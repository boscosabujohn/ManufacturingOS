'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Percent,
  Edit2,
  Save,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Plus,
  TrendingUp
} from 'lucide-react'

interface MarkupSetting {
  id: string
  category: string
  subcategory: string
  defaultMarkup: number
  minMarkup: number
  maxMarkup: number
  costBasis: 'material-only' | 'material-labor' | 'full-cost'
  approvalRequired: boolean
  approvalThreshold: number
  lastUpdated: string
  updatedBy: string
  status: 'active' | 'inactive'
}

export default function EstimationSettingsMarkupPage() {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)

  const [markupSettings] = useState<MarkupSetting[]>([
    {
      id: 'MKP-001',
      category: 'Kitchen Sinks',
      subcategory: 'Standard Sinks',
      defaultMarkup: 48.0,
      minMarkup: 40.0,
      maxMarkup: 55.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 40.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-002',
      category: 'Kitchen Sinks',
      subcategory: 'Premium Sinks',
      defaultMarkup: 52.0,
      minMarkup: 45.0,
      maxMarkup: 60.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 45.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-003',
      category: 'Kitchen Faucets',
      subcategory: 'Chrome Faucets',
      defaultMarkup: 50.6,
      minMarkup: 45.0,
      maxMarkup: 58.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 45.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-004',
      category: 'Kitchen Faucets',
      subcategory: 'Premium Faucets',
      defaultMarkup: 55.0,
      minMarkup: 48.0,
      maxMarkup: 65.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 48.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-005',
      category: 'Cookware',
      subcategory: 'Non-Stick',
      defaultMarkup: 56.0,
      minMarkup: 50.0,
      maxMarkup: 65.0,
      costBasis: 'full-cost',
      approvalRequired: false,
      approvalThreshold: 50.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-006',
      category: 'Cookware',
      subcategory: 'Stainless Steel',
      defaultMarkup: 55.0,
      minMarkup: 48.0,
      maxMarkup: 62.0,
      costBasis: 'full-cost',
      approvalRequired: false,
      approvalThreshold: 48.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-007',
      category: 'Kitchen Appliances',
      subcategory: 'Chimneys',
      defaultMarkup: 54.0,
      minMarkup: 48.0,
      maxMarkup: 62.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 48.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-008',
      category: 'Kitchen Cabinets',
      subcategory: 'Base Cabinets',
      defaultMarkup: 45.0,
      minMarkup: 38.0,
      maxMarkup: 52.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 38.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-009',
      category: 'Kitchen Cabinets',
      subcategory: 'Wall Cabinets',
      defaultMarkup: 46.0,
      minMarkup: 40.0,
      maxMarkup: 53.0,
      costBasis: 'full-cost',
      approvalRequired: true,
      approvalThreshold: 40.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-010',
      category: 'Countertops',
      subcategory: 'Granite',
      defaultMarkup: 47.5,
      minMarkup: 42.0,
      maxMarkup: 55.0,
      costBasis: 'material-labor',
      approvalRequired: true,
      approvalThreshold: 42.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-011',
      category: 'Countertops',
      subcategory: 'Quartz',
      defaultMarkup: 48.0,
      minMarkup: 43.0,
      maxMarkup: 56.0,
      costBasis: 'material-labor',
      approvalRequired: true,
      approvalThreshold: 43.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    },
    {
      id: 'MKP-012',
      category: 'Kitchen Accessories',
      subcategory: 'Storage Solutions',
      defaultMarkup: 51.5,
      minMarkup: 45.0,
      maxMarkup: 60.0,
      costBasis: 'full-cost',
      approvalRequired: false,
      approvalThreshold: 45.0,
      lastUpdated: '2025-10-01',
      updatedBy: 'Admin',
      status: 'active'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCostBasisColor = (basis: string) => {
    switch (basis) {
      case 'material-only':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'material-labor':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'full-cost':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalSettings = markupSettings.length
  const avgMarkup = markupSettings.reduce((sum, s) => sum + s.defaultMarkup, 0) / totalSettings
  const activeSettings = markupSettings.filter(s => s.status === 'active').length
  const requireApproval = markupSettings.filter(s => s.approvalRequired).length

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
            <h1 className="text-2xl font-bold text-gray-900">Markup Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Configure default markup percentages by category</p>
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
            Add Setting
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Settings</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalSettings}</p>
              <p className="text-xs text-blue-700 mt-1">Categories configured</p>
            </div>
            <Percent className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Markup</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{avgMarkup.toFixed(1)}%</p>
              <p className="text-xs text-green-700 mt-1">Default markup</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Active</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{activeSettings}</p>
              <p className="text-xs text-purple-700 mt-1">In use</p>
            </div>
            <Percent className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Require Approval</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{requireApproval}</p>
              <p className="text-xs text-orange-700 mt-1">Need manager approval</p>
            </div>
            <Percent className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Markup Settings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Markup Configuration</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Markup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min - Max Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Basis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {markupSettings.map((setting) => (
                <tr key={setting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">{setting.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{setting.subcategory}</p>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === setting.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={setting.defaultMarkup}
                          className="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-green-600">{setting.defaultMarkup.toFixed(1)}%</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{setting.minMarkup.toFixed(1)}%</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-sm text-gray-900">{setting.maxMarkup.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCostBasisColor(setting.costBasis)}`}>
                      {setting.costBasis.toUpperCase().replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-medium ${setting.approvalRequired ? 'text-orange-600' : 'text-gray-600'}`}>
                        {setting.approvalRequired ? 'Required' : 'Not Required'}
                      </p>
                      {setting.approvalRequired && (
                        <p className="text-xs text-gray-600 mt-1">Below {setting.approvalThreshold}%</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(setting.status)}`}>
                      {setting.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === setting.id ? (
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                         
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(setting.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                         
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
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
