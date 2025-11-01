'use client'

import { X, Calendar, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface Promotion {
  id: string
  name: string
  type: 'percentage' | 'fixed-amount' | 'bogo' | 'bundle'
  value: string
  startDate: string
  endDate: string
  applicableProducts: string[]
  minPurchase?: number
  status: 'active' | 'scheduled' | 'expired'
  usageCount: number
}

interface PromotionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (promotion: Promotion) => void
  promotion: Promotion | null
}

export function PromotionModal({ isOpen, onClose, onSave, promotion }: PromotionModalProps) {
  const [formData, setFormData] = useState<Promotion>({
    id: '',
    name: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    applicableProducts: [],
    minPurchase: 0,
    status: 'scheduled',
    usageCount: 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [productInput, setProductInput] = useState('')

  const productOptions = [
    'All Products',
    'All Modular Kitchens',
    'L-Shaped Kitchens',
    'Island Kitchens',
    'Parallel Kitchens',
    'Premium Cabinets',
    'Countertops',
    'Cabinet Handles',
    'Drawer Rails',
    'Appliances',
    'Hardware'
  ]

  useEffect(() => {
    if (promotion) {
      setFormData(promotion)
    } else {
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        id: `PROMO-${Date.now().toString().slice(-3)}`,
        name: '',
        type: 'percentage',
        value: '',
        startDate: today,
        endDate: '',
        applicableProducts: [],
        minPurchase: 0,
        status: 'scheduled',
        usageCount: 0
      })
    }
    setErrors({})
    setProductInput('')
  }, [promotion, isOpen])

  const typeLabels = {
    percentage: 'Percentage Discount',
    'fixed-amount': 'Fixed Amount Off',
    bogo: 'Buy One Get One',
    bundle: 'Bundle Discount'
  }

  const valuePlaceholders = {
    percentage: 'e.g., 15',
    'fixed-amount': 'e.g., 50000',
    bogo: 'e.g., Buy 2 Get 1 Free',
    bundle: 'e.g., 75000'
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Promotion name is required'
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Discount value is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (formData.applicableProducts.length === 0) {
      newErrors.applicableProducts = 'At least one product category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Auto-determine status based on dates
      const today = new Date()
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      let status: Promotion['status'] = 'scheduled'
      if (today >= start && today <= end) {
        status = 'active'
      } else if (today > end) {
        status = 'expired'
      }

      // Format value based on type
      let formattedValue = formData.value
      if (formData.type === 'percentage') {
        formattedValue = `${formData.value}% off`
      } else if (formData.type === 'fixed-amount') {
        formattedValue = `₹${parseInt(formData.value).toLocaleString('en-IN')} off`
      } else if (formData.type === 'bundle') {
        formattedValue = `₹${parseInt(formData.value).toLocaleString('en-IN')} off`
      }

      onSave({
        ...formData,
        value: formattedValue,
        status
      })
      onClose()
    }
  }

  const handleAddProduct = () => {
    if (productInput && !formData.applicableProducts.includes(productInput)) {
      setFormData({
        ...formData,
        applicableProducts: [...formData.applicableProducts, productInput]
      })
      setProductInput('')
    }
  }

  const handleRemoveProduct = (product: string) => {
    setFormData({
      ...formData,
      applicableProducts: formData.applicableProducts.filter(p => p !== product)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {promotion ? 'Edit Promotion' : 'New Promotion'}
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
                  Promotion ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!promotion}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promotion Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Festival Mega Sale"
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

          {/* Promotion Type */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Promotion Type</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['percentage', 'fixed-amount', 'bogo', 'bundle'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type, value: '' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Tag className="h-5 w-5 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-center block">
                    {typeLabels[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount Value */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Discount Value</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'percentage' && 'Discount Percentage (%)'}
                {formData.type === 'fixed-amount' && 'Discount Amount (₹)'}
                {formData.type === 'bogo' && 'Offer Description'}
                {formData.type === 'bundle' && 'Bundle Discount (₹)'}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type={formData.type === 'bogo' ? 'text' : 'text'}
                value={formData.value.replace(/[%₹,\s]/g, '').replace(' off', '')}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={valuePlaceholders[formData.type]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.value && (
                <p className="mt-1 text-xs text-red-600">{errors.value}</p>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Promotion Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Applicable Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Applicable Products</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product Categories <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a product category...</option>
                  {productOptions
                    .filter(p => !formData.applicableProducts.includes(p))
                    .map((product) => (
                      <option key={product} value={product}>{product}</option>
                    ))
                  }
                </select>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!productInput}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
              {errors.applicableProducts && (
                <p className="mt-1 text-xs text-red-600">{errors.applicableProducts}</p>
              )}
            </div>

            {/* Selected Products */}
            {formData.applicableProducts.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.applicableProducts.map((product) => (
                    <span
                      key={product}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {product}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product)}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Minimum Purchase */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Additional Conditions</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase Amount (₹) <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                value={formData.minPurchase || ''}
                onChange={(e) => setFormData({ ...formData, minPurchase: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 500000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="10000"
              />
              {formData.minPurchase && formData.minPurchase > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Minimum: ₹{(formData.minPurchase / 100000).toFixed(1)}L
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">Promotion Summary:</h3>
            <div className="space-y-1 text-xs text-orange-700">
              <p><strong>Name:</strong> {formData.name || 'Not set'}</p>
              <p><strong>Type:</strong> {typeLabels[formData.type]}</p>
              <p><strong>Value:</strong> {formData.value || 'Not set'}</p>
              <p><strong>Period:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN') : 'Not set'} to {formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-IN') : 'Not set'}</p>
              <p><strong>Products:</strong> {formData.applicableProducts.length > 0 ? formData.applicableProducts.slice(0, 2).join(', ') + (formData.applicableProducts.length > 2 ? ` +${formData.applicableProducts.length - 2} more` : '') : 'None'}</p>
              {formData.minPurchase && formData.minPurchase > 0 && (
                <p><strong>Minimum Purchase:</strong> ₹{(formData.minPurchase / 100000).toFixed(1)}L</p>
              )}
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
              {promotion ? 'Update Promotion' : 'Create Promotion'}
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
    statuses: [] as string[]
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
          <h2 className="text-xl font-semibold text-gray-900">Filter Promotions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Type</label>
            <div className="space-y-2">
              {['percentage', 'fixed-amount', 'bogo', 'bundle'].map((type) => (
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
                  <span className="ml-2 text-sm text-gray-700 capitalize">{type.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              {['active', 'scheduled', 'expired'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, statuses: [...filters.statuses, status] })
                      } else {
                        setFilters({ ...filters, statuses: filters.statuses.filter(s => s !== status) })
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => setFilters({ types: [], statuses: [] })}
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
