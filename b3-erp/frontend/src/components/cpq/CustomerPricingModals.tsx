'use client'

import { X, Star, Award, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface CustomerPricing {
  id: string
  customerName: string
  customerId: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  baseDiscount: number
  specialTerms: string
  lifetimeValue: number
  activeContracts: number
  lastUpdated: string
}

interface CustomerPricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customer: CustomerPricing) => void
  customer: CustomerPricing | null
}

export function CustomerPricingModal({ isOpen, onClose, onSave, customer }: CustomerPricingModalProps) {
  const [formData, setFormData] = useState<CustomerPricing>({
    id: '',
    customerName: '',
    customerId: '',
    tier: 'bronze',
    baseDiscount: 0,
    specialTerms: '',
    lifetimeValue: 0,
    activeContracts: 0,
    lastUpdated: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const tierInfo = {
    platinum: { range: '15-20%', color: 'purple', terms: 'Net 60-90 days, dedicated support, priority service' },
    gold: { range: '10-15%', color: 'yellow', terms: 'Net 45 days, quarterly rebates, enhanced support' },
    silver: { range: '7-10%', color: 'gray', terms: 'Net 30 days, regular warranty, basic support' },
    bronze: { range: '3-7%', color: 'orange', terms: 'Net 15 days, standard terms, self-service' }
  }

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    } else {
      setFormData({
        id: `CP-${Date.now().toString().slice(-3)}`,
        customerName: '',
        customerId: '',
        tier: 'bronze',
        baseDiscount: 5,
        specialTerms: 'Net 15 days, standard terms',
        lifetimeValue: 0,
        activeContracts: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      })
    }
    setErrors({})
  }, [customer, isOpen])

  const handleTierChange = (newTier: CustomerPricing['tier']) => {
    const discountRanges = {
      platinum: 18,
      gold: 12,
      silver: 8,
      bronze: 5
    }

    setFormData({
      ...formData,
      tier: newTier,
      baseDiscount: discountRanges[newTier],
      specialTerms: tierInfo[newTier].terms
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }

    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required'
    }

    if (formData.baseDiscount < 0 || formData.baseDiscount > 100) {
      newErrors.baseDiscount = 'Discount must be between 0 and 100'
    }

    if (!formData.specialTerms.trim()) {
      newErrors.specialTerms = 'Special terms are required'
    }

    if (formData.lifetimeValue < 0) {
      newErrors.lifetimeValue = 'Lifetime value cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      })
      onClose()
    }
  }

  const getTierIcon = (tier: string) => {
    if (tier === 'platinum') return <Award className="h-5 w-5" />
    if (tier === 'gold') return <Star className="h-5 w-5" />
    return <Users className="h-5 w-5" />
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {customer ? 'Edit Customer Pricing' : 'Add Customer Pricing'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Customer Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Customer Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lifetime Value (₹)
                </label>
                <input
                  type="number"
                  value={formData.lifetimeValue}
                  onChange={(e) => setFormData({ ...formData, lifetimeValue: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 12500000"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lifetimeValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  step="100000"
                />
                {errors.lifetimeValue && (
                  <p className="mt-1 text-xs text-red-600">{errors.lifetimeValue}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Display: ₹{(formData.lifetimeValue / 100000).toFixed(1)}L
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Contracts
                </label>
                <input
                  type="number"
                  value={formData.activeContracts}
                  onChange={(e) => setFormData({ ...formData, activeContracts: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Tier Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Customer Tier</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => handleTierChange(tier)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.tier === tier
                      ? `border-${tierInfo[tier].color}-500 bg-${tierInfo[tier].color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {getTierIcon(tier)}
                    <span className="text-sm font-semibold capitalize">{tier}</span>
                    <span className="text-xs text-gray-600">{tierInfo[tier].range}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-700">
                <strong>Selected Tier Benefits:</strong> {tierInfo[formData.tier].terms}
              </p>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Pricing Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Discount (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.baseDiscount}
                onChange={(e) => setFormData({ ...formData, baseDiscount: parseFloat(e.target.value) || 0 })}
                placeholder="e.g., 18"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.baseDiscount ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                min="0"
                max="100"
                step="0.1"
              />
              {errors.baseDiscount && (
                <p className="mt-1 text-xs text-red-600">{errors.baseDiscount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Recommended range for {formData.tier}: {tierInfo[formData.tier].range}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Terms <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.specialTerms}
                onChange={(e) => setFormData({ ...formData, specialTerms: e.target.value })}
                placeholder="e.g., Net 60 days, Free installation on orders > ₹50L"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.specialTerms ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.specialTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.specialTerms}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Customer Pricing Summary:</h3>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Customer:</strong> {formData.customerName || 'Not set'} ({formData.customerId || 'N/A'})</p>
              <p><strong>Tier:</strong> {formData.tier.charAt(0).toUpperCase() + formData.tier.slice(1)} with {formData.baseDiscount}% base discount</p>
              <p><strong>Lifetime Value:</strong> ₹{(formData.lifetimeValue / 100000).toFixed(1)}L</p>
              <p><strong>Active Contracts:</strong> {formData.activeContracts}</p>
              <p><strong>Special Terms:</strong> {formData.specialTerms || 'Not set'}</p>
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
              {customer ? 'Update Customer' : 'Add Customer'}
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

interface ViewCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: CustomerPricing | null
  onEdit: () => void
}

export function ViewCustomerModal({ isOpen, onClose, customer, onEdit }: ViewCustomerModalProps) {
  if (!isOpen || !customer) return null

  const getTierIcon = (tier: string) => {
    if (tier === 'platinum') return <Award className="h-6 w-6" />
    if (tier === 'gold') return <Star className="h-6 w-6" />
    return <Users className="h-6 w-6" />
  }

  const getTierColor = (tier: string) => {
    const colors: any = {
      platinum: 'from-purple-600 to-purple-600',
      gold: 'from-yellow-600 to-yellow-600',
      silver: 'from-gray-600 to-gray-600',
      bronze: 'from-orange-600 to-orange-600'
    }
    return colors[tier] || colors.bronze
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${getTierColor(customer.tier)} text-white px-3 py-2 flex items-center justify-between rounded-t-lg`}>
          <div className="flex items-center gap-3">
            {getTierIcon(customer.tier)}
            <div>
              <h2 className="text-xl font-bold">{customer.customerName}</h2>
              <p className="text-sm opacity-90">{customer.customerId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Customer Tier Badge */}
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 ${
              customer.tier === 'platinum' ? 'bg-purple-100 border-purple-300 text-purple-700' :
              customer.tier === 'gold' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
              customer.tier === 'silver' ? 'bg-gray-100 border-gray-300 text-gray-700' :
              'bg-orange-100 border-orange-300 text-orange-700'
            }`}>
              {getTierIcon(customer.tier)}
              <span className="text-lg font-bold capitalize">{customer.tier} Tier</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
              <p className="text-sm font-medium text-green-600">Base Discount</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{customer.baseDiscount}%</p>
              <p className="text-xs text-green-700 mt-1">Off standard pricing</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <p className="text-sm font-medium text-blue-600">Lifetime Value</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                ₹{(customer.lifetimeValue / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-blue-700 mt-1">Total business value</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
              <p className="text-sm font-medium text-purple-600">Active Contracts</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{customer.activeContracts}</p>
              <p className="text-xs text-purple-700 mt-1">Current agreements</p>
            </div>
          </div>

          {/* Special Terms */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Special Terms & Conditions</h3>
            <p className="text-sm text-gray-700">{customer.specialTerms}</p>
          </div>

          {/* Tier Benefits */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Tier Benefits</h3>
            <div className="space-y-2 text-sm text-blue-700">
              {customer.tier === 'platinum' && (
                <>
                  <p>✓ Highest discount tier (15-20%)</p>
                  <p>✓ Net 60-90 days payment terms</p>
                  <p>✓ Dedicated account manager</p>
                  <p>✓ Priority support & service</p>
                  <p>✓ Free installation on large orders</p>
                  <p>✓ Quarterly business reviews</p>
                </>
              )}
              {customer.tier === 'gold' && (
                <>
                  <p>✓ Premium discount tier (10-15%)</p>
                  <p>✓ Net 45 days payment terms</p>
                  <p>✓ Quarterly rebates</p>
                  <p>✓ Enhanced support</p>
                  <p>✓ Volume discounts on bulk orders</p>
                </>
              )}
              {customer.tier === 'silver' && (
                <>
                  <p>✓ Standard discount tier (7-10%)</p>
                  <p>✓ Net 30 days payment terms</p>
                  <p>✓ Regular warranty</p>
                  <p>✓ Basic support</p>
                </>
              )}
              {customer.tier === 'bronze' && (
                <>
                  <p>✓ Entry discount tier (3-7%)</p>
                  <p>✓ Net 15 days payment terms</p>
                  <p>✓ Standard terms</p>
                  <p>✓ Self-service portal</p>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Record Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Customer ID</p>
                <p className="font-mono text-gray-900">{customer.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900">{customer.lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState({
    tiers: [] as string[],
    discountRange: { min: 0, max: 0 },
    lifetimeValueRange: { min: 0, max: 0 }
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
          <h2 className="text-xl font-semibold text-gray-900">Filter Customers</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Tier Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Tier</label>
            <div className="space-y-2">
              {['platinum', 'gold', 'silver', 'bronze'].map((tier) => (
                <label key={tier} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.tiers.includes(tier)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, tiers: [...filters.tiers, tier] })
                      } else {
                        setFilters({ ...filters, tiers: filters.tiers.filter(t => t !== tier) })
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{tier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Discount Range (%)</label>
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

          {/* Lifetime Value Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lifetime Value Range (₹L)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.lifetimeValueRange.min || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  lifetimeValueRange: { ...filters.lifetimeValueRange, min: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.lifetimeValueRange.max || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  lifetimeValueRange: { ...filters.lifetimeValueRange, max: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-end gap-3">
          <button
            onClick={() => setFilters({ tiers: [], discountRange: { min: 0, max: 0 }, lifetimeValueRange: { min: 0, max: 0 } })}
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
