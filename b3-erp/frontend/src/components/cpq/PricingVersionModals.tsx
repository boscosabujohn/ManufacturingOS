'use client'

import { useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Save,
  Tag,
  Calendar,
  TrendingUp,
  TrendingDown,
  GitBranch,
  Eye,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Percent
} from 'lucide-react'
import type {
  PricingVersion,
  VersionStatus,
  ChangeType,
  PriceChange
} from './PricingVersionControl'

interface CreateVersionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (version: Partial<PricingVersion>) => void
}

interface ViewVersionModalProps {
  isOpen: boolean
  onClose: () => void
  version: PricingVersion | null
}

interface CompareVersionsModalProps {
  isOpen: boolean
  onClose: () => void
  version1: PricingVersion | null
  version2: PricingVersion | null
}

export const CreateVersionModal: React.FC<CreateVersionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    version: '',
    name: '',
    description: '',
    changeType: 'price_increase' as ChangeType,
    status: 'draft' as VersionStatus,
    scheduledFor: '',
    notes: ''
  })

  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([
    {
      productId: '',
      productName: '',
      oldPrice: 0,
      newPrice: 0,
      changePercent: 0,
      reason: ''
    }
  ])

  const changeTypes: { value: ChangeType; label: string }[] = [
    { value: 'price_increase', label: 'Price Increase' },
    { value: 'price_decrease', label: 'Price Decrease' },
    { value: 'new_product', label: 'New Products' },
    { value: 'discontinued', label: 'Discontinued Products' },
    { value: 'restructure', label: 'Price Restructure' }
  ]

  const handleAddPriceChange = () => {
    setPriceChanges([
      ...priceChanges,
      {
        productId: '',
        productName: '',
        oldPrice: 0,
        newPrice: 0,
        changePercent: 0,
        reason: ''
      }
    ])
  }

  const handleRemovePriceChange = (index: number) => {
    if (priceChanges.length > 1) {
      setPriceChanges(priceChanges.filter((_, i) => i !== index))
    }
  }

  const handlePriceChangeUpdate = (index: number, field: keyof PriceChange, value: any) => {
    setPriceChanges(priceChanges.map((change, i) => {
      if (i === index) {
        const updated = { ...change, [field]: value }

        // Auto-calculate change percent
        if (field === 'oldPrice' || field === 'newPrice') {
          const oldPrice = field === 'oldPrice' ? parseFloat(value) : change.oldPrice
          const newPrice = field === 'newPrice' ? parseFloat(value) : change.newPrice
          if (oldPrice > 0) {
            updated.changePercent = ((newPrice - oldPrice) / oldPrice) * 100
          }
        }

        return updated
      }
      return change
    }))
  }

  const handleImportPrices = () => {
    // Simulate importing from file/system
    const sampleImport: PriceChange[] = [
      {
        productId: 'PROD-001',
        productName: 'Manufacturing Platform License',
        oldPrice: 50000,
        newPrice: 52500,
        changePercent: 5,
        reason: 'Annual inflation adjustment'
      },
      {
        productId: 'PROD-002',
        productName: 'CRM Module',
        oldPrice: 15000,
        newPrice: 16125,
        changePercent: 7.5,
        reason: 'Enhanced features included'
      },
      {
        productId: 'PROD-003',
        productName: 'Analytics Dashboard',
        oldPrice: 20000,
        newPrice: 20600,
        changePercent: 3,
        reason: 'Market adjustment'
      }
    ]
    setPriceChanges(sampleImport)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validChanges = priceChanges.filter(c => c.productName && c.productId)
    const avgChange = validChanges.length > 0
      ? validChanges.reduce((sum, c) => sum + c.changePercent, 0) / validChanges.length
      : 0

    const newVersion: Partial<PricingVersion> = {
      ...formData,
      changes: validChanges,
      totalItems: validChanges.length,
      avgPriceChange: avgChange,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }

    onSave(newVersion)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Create New Pricing Version</h2>
              <p className="text-sm opacity-90">Define version details and price changes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Version Information</h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Number *</label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., v2.5 or 2025-Q1"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Q1 2025 Price Adjustment"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Brief description of the changes..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Type *</label>
                <select
                  value={formData.changeType}
                  onChange={(e) => setFormData({ ...formData, changeType: e.target.value as ChangeType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {changeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VersionStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule For</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Additional notes or approval requirements..."
              />
            </div>
          </div>

          {/* Price Changes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Price Changes</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleImportPrices}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Upload className="h-4 w-4" />
                  Import Sample
                </button>
                <button
                  type="button"
                  onClick={handleAddPriceChange}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Price Change
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {priceChanges.map((change, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Product ID</label>
                      <input
                        type="text"
                        value={change.productId}
                        onChange={(e) => handlePriceChangeUpdate(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="PROD-001"
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={change.productName}
                        onChange={(e) => handlePriceChangeUpdate(index, 'productName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Product name"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Old Price (₹)</label>
                      <input
                        type="number"
                        value={change.oldPrice}
                        onChange={(e) => handlePriceChangeUpdate(index, 'oldPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        step="0.01"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">New Price (₹)</label>
                      <input
                        type="number"
                        value={change.newPrice}
                        onChange={(e) => handlePriceChangeUpdate(index, 'newPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        step="0.01"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Change %</label>
                      <div className={`px-3 py-2 rounded-lg text-sm font-bold text-center ${
                        change.changePercent > 0 ? 'bg-red-100 text-red-700' :
                        change.changePercent < 0 ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(1)}%
                      </div>
                    </div>

                    <div className="col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => handleRemovePriceChange(index)}
                        disabled={priceChanges.length === 1}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>

                    {change.reason && (
                      <div className="col-span-12">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
                        <input
                          type="text"
                          value={change.reason}
                          onChange={(e) => handlePriceChangeUpdate(index, 'reason', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Reason for price change..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Version Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Changes:</span>
                <span className="font-bold text-blue-900 ml-2">
                  {priceChanges.filter(c => c.productName).length}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Avg Change:</span>
                <span className="font-bold text-blue-900 ml-2">
                  {priceChanges.length > 0
                    ? (priceChanges.reduce((sum, c) => sum + c.changePercent, 0) / priceChanges.length).toFixed(1)
                    : '0.0'}%
                </span>
              </div>
              <div>
                <span className="text-blue-700">Status:</span>
                <span className="font-bold text-blue-900 ml-2 capitalize">{formData.status}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Create Version
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ViewVersionModal: React.FC<ViewVersionModalProps> = ({ isOpen, onClose, version }) => {
  if (!isOpen || !version) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{version.version} - {version.name}</h2>
            <p className="text-sm opacity-90 mt-1">{version.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Version Metadata */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{version.status}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Change Type</p>
              <p className="text-lg font-bold text-gray-900">{version.changeType.replace('_', ' ')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Created By</p>
              <p className="text-lg font-bold text-gray-900">{version.createdBy}</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Change Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-700">Total Changes</p>
                <p className="text-2xl font-bold text-blue-900">{version.totalItems}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Average Price Change</p>
                <p className={`text-2xl font-bold ${
                  version.avgPriceChange > 0 ? 'text-red-600' :
                  version.avgPriceChange < 0 ? 'text-green-600' :
                  'text-gray-900'
                }`}>
                  {version.avgPriceChange > 0 ? '+' : ''}{version.avgPriceChange.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Execution Count</p>
                <p className="text-2xl font-bold text-blue-900">{version.executionCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Price Changes Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Price Changes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product Name</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Old Price</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">→</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">New Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Change</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {version.changes.map((change, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">{change.productId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{change.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{change.oldPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <ArrowRight className="h-4 w-4 text-gray-400 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">
                        ₹{change.newPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          change.changePercent > 0 ? 'bg-red-100 text-red-700' :
                          change.changePercent < 0 ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{change.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Info */}
          {version.approvedBy && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Approved by {version.approvedBy}</span>
                {version.approvedAt && (
                  <span className="text-sm">on {new Date(version.approvedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {version.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">Notes:</p>
              <p className="text-sm text-yellow-800">{version.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={() => {/* Export functionality */}}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Version
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export const CompareVersionsModal: React.FC<CompareVersionsModalProps> = ({ isOpen, onClose, version1, version2 }) => {
  if (!isOpen || !version1 || !version2) return null

  // Find common products and differences
  const allProducts = new Map<string, { v1?: PriceChange; v2?: PriceChange }>()

  version1.changes.forEach(change => {
    allProducts.set(change.productId, { v1: change })
  })

  version2.changes.forEach(change => {
    const existing = allProducts.get(change.productId)
    if (existing) {
      existing.v2 = change
    } else {
      allProducts.set(change.productId, { v2: change })
    }
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Compare Versions</h2>
              <p className="text-sm opacity-90">{version1.version} vs {version2.version}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Version Headers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900">{version1.version}</h3>
              <p className="text-sm text-blue-700 mb-2">{version1.name}</p>
              <div className="space-y-1 text-xs text-blue-600">
                <p>Status: <span className="font-semibold">{version1.status}</span></p>
                <p>Total Changes: <span className="font-semibold">{version1.totalItems}</span></p>
                <p>Avg Change: <span className="font-semibold">{version1.avgPriceChange.toFixed(1)}%</span></p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-900">{version2.version}</h3>
              <p className="text-sm text-green-700 mb-2">{version2.name}</p>
              <div className="space-y-1 text-xs text-green-600">
                <p>Status: <span className="font-semibold">{version2.status}</span></p>
                <p>Total Changes: <span className="font-semibold">{version2.totalItems}</span></p>
                <p>Avg Change: <span className="font-semibold">{version2.avgPriceChange.toFixed(1)}%</span></p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700" colSpan={2}>
                      {version1.version}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-green-700" colSpan={2}>
                      {version2.version}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Difference</th>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2"></th>
                    <th className="px-4 py-2 text-xs text-blue-600">Old</th>
                    <th className="px-4 py-2 text-xs text-blue-600">New</th>
                    <th className="px-4 py-2 text-xs text-green-600">Old</th>
                    <th className="px-4 py-2 text-xs text-green-600">New</th>
                    <th className="px-4 py-2 text-xs text-gray-600">Δ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.from(allProducts.entries()).map(([productId, { v1, v2 }]) => {
                    const productName = v1?.productName || v2?.productName || 'Unknown'
                    const priceDiff = v2 && v1 ? v2.newPrice - v1.newPrice : 0

                    return (
                      <tr key={productId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-semibold text-gray-900">{productName}</div>
                          <div className="text-xs text-gray-500 font-mono">{productId}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {v1 ? `₹${v1.oldPrice.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-blue-900">
                          {v1 ? `₹${v1.newPrice.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {v2 ? `₹${v2.oldPrice.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-green-900">
                          {v2 ? `₹${v2.newPrice.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {priceDiff !== 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              priceDiff > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {priceDiff > 0 ? '+' : ''}₹{Math.abs(priceDiff).toLocaleString()}
                            </span>
                          )}
                          {priceDiff === 0 && v1 && v2 && (
                            <span className="text-xs text-gray-500">Same</span>
                          )}
                          {(!v1 || !v2) && (
                            <span className="text-xs text-orange-600 font-semibold">
                              {!v1 ? 'New in v2' : 'Only in v1'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Comparison Summary</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-purple-700">Common Products:</span>
                <span className="font-bold text-purple-900 ml-2">
                  {Array.from(allProducts.values()).filter(p => p.v1 && p.v2).length}
                </span>
              </div>
              <div>
                <span className="text-purple-700">Only in {version1.version}:</span>
                <span className="font-bold text-purple-900 ml-2">
                  {Array.from(allProducts.values()).filter(p => p.v1 && !p.v2).length}
                </span>
              </div>
              <div>
                <span className="text-purple-700">Only in {version2.version}:</span>
                <span className="font-bold text-purple-900 ml-2">
                  {Array.from(allProducts.values()).filter(p => !p.v1 && p.v2).length}
                </span>
              </div>
              <div>
                <span className="text-purple-700">Total Products:</span>
                <span className="font-bold text-purple-900 ml-2">{allProducts.size}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}
