'use client'

import { X, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface ContractPricing {
  id: string
  contractName: string
  customerId: string
  customerName: string
  contractValue: number
  discount: number
  startDate: string
  endDate: string
  status: 'active' | 'expiring-soon' | 'expired'
  renewalDate: string
}

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contract: ContractPricing) => void
  contract: ContractPricing | null
}

export function ContractModal({ isOpen, onClose, onSave, contract }: ContractModalProps) {
  const [formData, setFormData] = useState<ContractPricing>({
    id: '',
    contractName: '',
    customerId: '',
    customerName: '',
    contractValue: 0,
    discount: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    renewalDate: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (contract) {
      setFormData(contract)
    } else {
      setFormData({
        id: `CT-${Date.now().toString().slice(-3)}`,
        contractName: '',
        customerId: '',
        customerName: '',
        contractValue: 0,
        discount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
        renewalDate: ''
      })
    }
    setErrors({})
  }, [contract, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contractName.trim()) {
      newErrors.contractName = 'Contract name is required'
    }

    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required'
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }

    if (formData.contractValue <= 0) {
      newErrors.contractValue = 'Contract value must be greater than 0'
    }

    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = 'Discount must be between 0 and 100'
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

    if (!formData.renewalDate) {
      newErrors.renewalDate = 'Renewal date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {contract ? 'Edit Contract' : 'New Contract'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contract Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Contract Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!contract}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contractName}
                  onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
                  placeholder="e.g., Annual Supply Agreement - Prestige"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contractName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.contractName && (
                  <p className="mt-1 text-xs text-red-600">{errors.contractName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Customer Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  placeholder="e.g., CUST-1234"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.customerId && (
                  <p className="mt-1 text-xs text-red-600">{errors.customerId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g., Prestige Properties Ltd"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-red-600">{errors.customerName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Pricing Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Value (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 25000000"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contractValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  min="0"
                  step="100000"
                />
                {errors.contractValue && (
                  <p className="mt-1 text-xs text-red-600">{errors.contractValue}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Display: ₹{(formData.contractValue / 10000000).toFixed(2)}Cr
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 18"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.discount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  min="0"
                  max="100"
                  step="0.1"
                />
                {errors.discount && (
                  <p className="mt-1 text-xs text-red-600">{errors.discount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contract Period */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Contract Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Renewal Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.renewalDate}
                  onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.renewalDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.renewalDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.renewalDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Status</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContractPricing['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Contract Summary:</h3>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Contract:</strong> {formData.contractName || 'Not set'}</p>
              <p><strong>Customer:</strong> {formData.customerName || 'Not set'} ({formData.customerId || 'N/A'})</p>
              <p><strong>Value:</strong> ₹{(formData.contractValue / 10000000).toFixed(2)}Cr with {formData.discount}% discount</p>
              <p><strong>Period:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN') : 'N/A'} to {formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-IN') : 'N/A'}</p>
              <p><strong>Renewal:</strong> {formData.renewalDate ? new Date(formData.renewalDate).toLocaleDateString('en-IN') : 'N/A'}</p>
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
              {contract ? 'Update Contract' : 'Create Contract'}
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
    discountRange: { min: 0, max: 0 },
    valueRange: { min: 0, max: 0 }
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
          <h2 className="text-xl font-semibold text-gray-900">Filter Contracts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              {['active', 'expiring-soon', 'expired'].map((status) => (
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
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Range (%)</label>
            <div className="grid grid-cols-2 gap-3">
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

          {/* Value Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value Range (₹Cr)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.valueRange.min || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  valueRange: { ...filters.valueRange, min: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.5"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.valueRange.max || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  valueRange: { ...filters.valueRange, max: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => setFilters({ status: [], discountRange: { min: 0, max: 0 }, valueRange: { min: 0, max: 0 } })}
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
