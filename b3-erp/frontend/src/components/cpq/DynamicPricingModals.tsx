'use client'

import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface DynamicPricingFactor {
  id: string
  name: string
  type: 'demand' | 'inventory' | 'competitor' | 'time' | 'customer'
  currentValue: string
  impact: 'positive' | 'negative' | 'neutral'
  adjustment: string
  lastUpdated: string
}

interface DynamicFactorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (factor: DynamicPricingFactor) => void
  factor: DynamicPricingFactor | null
}

export function DynamicFactorModal({ isOpen, onClose, onSave, factor }: DynamicFactorModalProps) {
  const [formData, setFormData] = useState<DynamicPricingFactor>({
    id: '',
    name: '',
    type: 'demand',
    currentValue: '',
    impact: 'neutral',
    adjustment: '',
    lastUpdated: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (factor) {
      setFormData(factor)
    } else {
      setFormData({
        id: `DF-${Date.now().toString().slice(-3)}`,
        name: '',
        type: 'demand',
        currentValue: '',
        impact: 'neutral',
        adjustment: '+0%',
        lastUpdated: new Date().toISOString()
      })
    }
    setErrors({})
  }, [factor, isOpen])

  const typeDescriptions = {
    demand: 'Adjusts pricing based on product demand trends and forecasts',
    inventory: 'Modifies prices based on current stock levels (high stock = discount, low stock = premium)',
    competitor: 'Responds to competitor pricing changes in real-time',
    time: 'Applies seasonal, promotional, or urgency-based pricing',
    customer: 'Personalizes pricing based on customer segment and loyalty'
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Factor name is required'
    }

    if (!formData.currentValue.trim()) {
      newErrors.currentValue = 'Current value is required'
    }

    if (!formData.adjustment.trim()) {
      newErrors.adjustment = 'Adjustment value is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({
        ...formData,
        lastUpdated: new Date().toISOString()
      })
      onClose()
    }
  }

  const getImpactIcon = (impact: string) => {
    if (impact === 'positive') return <TrendingUp className="h-5 w-5 text-green-600" />
    if (impact === 'negative') return <TrendingDown className="h-5 w-5 text-red-600" />
    return <Activity className="h-5 w-5 text-gray-600" />
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {factor ? 'Edit Dynamic Factor' : 'Add Dynamic Factor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factor ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!factor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., High Demand - Modular Kitchens"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Factor Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Factor Type</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(['demand', 'inventory', 'competitor', 'time', 'customer'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`p-3 border-2 rounded-lg transition-all text-left ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-semibold capitalize">{type}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-600">{typeDescriptions[formData.type]}</p>
            </div>
          </div>

          {/* Current Value */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Current Status</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Value <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                placeholder="e.g., Demand +45%, Stock Level: 12%, Market: -5%"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.currentValue ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.currentValue && (
                <p className="mt-1 text-xs text-red-600">{errors.currentValue}</p>
              )}
            </div>
          </div>

          {/* Impact & Adjustment */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Pricing Impact</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact Direction
                </label>
                <div className="space-y-2">
                  {(['positive', 'negative', 'neutral'] as const).map((impact) => (
                    <button
                      key={impact}
                      type="button"
                      onClick={() => setFormData({ ...formData, impact })}
                      className={`w-full p-3 border-2 rounded-lg transition-all flex items-center gap-3 ${
                        formData.impact === impact
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {getImpactIcon(impact)}
                      <span className="text-sm font-semibold capitalize">{impact}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Adjustment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.adjustment}
                  onChange={(e) => setFormData({ ...formData, adjustment: e.target.value })}
                  placeholder="e.g., +8%, -15%, +₹5000"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.adjustment ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.adjustment && (
                  <p className="mt-1 text-xs text-red-600">{errors.adjustment}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Use + for increase, - for decrease (e.g., +10%, -5%, +₹1000)
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">Factor Summary:</h3>
            <div className="space-y-1 text-xs text-purple-700">
              <p><strong>Factor:</strong> {formData.name || 'Not set'}</p>
              <p><strong>Type:</strong> {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</p>
              <p><strong>Current Value:</strong> {formData.currentValue || 'Not set'}</p>
              <p><strong>Impact:</strong> {formData.impact.charAt(0).toUpperCase() + formData.impact.slice(1)}</p>
              <p><strong>Adjustment:</strong> {formData.adjustment || 'Not set'}</p>
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
              {factor ? 'Update Factor' : 'Create Factor'}
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
    types: [] as string[],
    impacts: [] as string[]
  })

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Filter Dynamic Factors</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Factor Type</label>
            <div className="space-y-2">
              {['demand', 'inventory', 'competitor', 'time', 'customer'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, types: [...filters.types, type] })
                      } else {
                        setFilters({ ...filters, types: filters.types.filter(t => t !== type) })
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Impact Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impact Direction</label>
            <div className="space-y-2">
              {['positive', 'negative', 'neutral'].map((impact) => (
                <label key={impact} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.impacts.includes(impact)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, impacts: [...filters.impacts, impact] })
                      } else {
                        setFilters({ ...filters, impacts: filters.impacts.filter(i => i !== impact) })
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{impact}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-end gap-3">
          <button
            onClick={() => setFilters({ types: [], impacts: [] })}
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
