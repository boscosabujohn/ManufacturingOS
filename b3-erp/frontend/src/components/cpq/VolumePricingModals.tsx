'use client'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface VolumeTier {
  id: string
  name: string
  category: string
  tier1: { min: number; max: number; discount: number }
  tier2: { min: number; max: number; discount: number }
  tier3: { min: number; max: number; discount: number }
  status: 'active' | 'inactive'
  applied: number
}

interface VolumeTierModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tier: VolumeTier) => void
  tier: VolumeTier | null
}

export function VolumeTierModal({ isOpen, onClose, onSave, tier }: VolumeTierModalProps) {
  const [formData, setFormData] = useState<VolumeTier>({
    id: '',
    name: '',
    category: '',
    tier1: { min: 1, max: 5, discount: 0 },
    tier2: { min: 6, max: 15, discount: 0 },
    tier3: { min: 16, max: 999, discount: 0 },
    status: 'active',
    applied: 0
  })

  const categories = [
    'Modular Kitchens',
    'Cabinets',
    'Countertops',
    'Hardware',
    'Appliances',
    'L-Shaped Kitchens',
    'Island Kitchens',
    'Parallel Kitchens'
  ]

  useEffect(() => {
    if (tier) {
      setFormData(tier)
    } else {
      setFormData({
        id: `VT-${Date.now().toString().slice(-3)}`,
        name: '',
        category: '',
        tier1: { min: 1, max: 5, discount: 0 },
        tier2: { min: 6, max: 15, discount: 0 },
        tier3: { min: 16, max: 999, discount: 0 },
        status: 'active',
        applied: 0
      })
    }
  }, [tier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {tier ? 'Edit Volume Tier' : 'Add Volume Tier'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!tier}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Modular Kitchen Volume Discount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tier 1 Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Tier 1 (Base)</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.tier1.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier1: { ...formData.tier1, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.tier1.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier1: { ...formData.tier1, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={formData.tier1.discount}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier1: { ...formData.tier1, discount: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tier 2 Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Tier 2 (Medium Volume)</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.tier2.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier2: { ...formData.tier2, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.tier2.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier2: { ...formData.tier2, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={formData.tier2.discount}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier2: { ...formData.tier2, discount: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tier 3 Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Tier 3 (High Volume)</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.tier3.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier3: { ...formData.tier3, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.tier3.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier3: { ...formData.tier3, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={formData.tier3.discount}
                    onChange={(e) => setFormData({
                      ...formData,
                      tier3: { ...formData.tier3, discount: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">Tier Preview:</h3>
            <div className="space-y-1 text-xs text-purple-700">
              <p><strong>Tier 1:</strong> {formData.tier1.min}-{formData.tier1.max} units = {formData.tier1.discount}% discount</p>
              <p><strong>Tier 2:</strong> {formData.tier2.min}-{formData.tier2.max} units = {formData.tier2.discount}% discount</p>
              <p><strong>Tier 3:</strong> {formData.tier3.min}+ units = {formData.tier3.discount}% discount</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {tier ? 'Update Tier' : 'Create Tier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState({
    status: [] as string[],
    categories: [] as string[],
    discountRange: { min: 0, max: 0 }
  })

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Filter Volume Tiers</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              {['active', 'inactive'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, status: [...filters.status, status] })
                      } else {
                        setFilters({ ...filters, status: filters.status.filter(s => s !== status) })
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount Range (%)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.discountRange.min || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    discountRange: { ...filters.discountRange, min: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.discountRange.max || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    discountRange: { ...filters.discountRange, max: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => setFilters({ status: [], categories: [], discountRange: { min: 0, max: 0 } })}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
