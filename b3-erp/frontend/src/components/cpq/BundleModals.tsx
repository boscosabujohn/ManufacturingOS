'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, Package2, DollarSign, Tag, ShoppingCart, AlertCircle } from 'lucide-react'

interface Bundle {
  id: string
  name: string
  description: string
  products: number
  basePrice: number
  bundlePrice: number
  savings: number
  status: 'active' | 'inactive'
  popularity: number
}

interface BundleProduct {
  id: string
  name: string
  sku: string
  category: string
  price: number
  quantity: number
}

interface BundleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (bundle: Partial<Bundle>) => void
  bundle?: Bundle | null
}

interface ViewBundleModalProps {
  isOpen: boolean
  onClose: () => void
  bundle: Bundle | null
  onEdit: () => void
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export const BundleModal: React.FC<BundleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  bundle
}) => {
  const [formData, setFormData] = useState({
    name: bundle?.name || '',
    description: bundle?.description || '',
    status: bundle?.status || 'active',
    discountPercentage: bundle?.savings || 10,
  })

  const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([
    { id: 'P-001', name: 'Premium Plywood Cabinets', sku: 'CAB-001', category: 'Cabinets', price: 150000, quantity: 1 },
    { id: 'P-002', name: 'Granite Countertop', sku: 'CNT-001', category: 'Countertops', price: 45000, quantity: 1 },
  ])

  const [availableProducts] = useState<BundleProduct[]>([
    { id: 'P-003', name: 'Stainless Steel Sink', sku: 'SNK-001', category: 'Sinks', price: 12000, quantity: 1 },
    { id: 'P-004', name: 'Modular Kitchen Island', sku: 'ISL-001', category: 'Islands', price: 85000, quantity: 1 },
    { id: 'P-005', name: 'LED Under-Cabinet Lighting', sku: 'LGT-001', category: 'Lighting', price: 8500, quantity: 1 },
    { id: 'P-006', name: 'Smart Chimney Hood', sku: 'APP-001', category: 'Appliances', price: 25000, quantity: 1 },
  ])

  if (!isOpen) return null

  const handleAddProduct = (product: BundleProduct) => {
    if (!bundleProducts.find(p => p.id === product.id)) {
      setBundleProducts([...bundleProducts, { ...product }])
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setBundleProducts(bundleProducts.filter(p => p.id !== productId))
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setBundleProducts(bundleProducts.map(p =>
      p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
    ))
  }

  const calculateBasePrice = () => {
    return bundleProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  }

  const calculateBundlePrice = () => {
    const basePrice = calculateBasePrice()
    return basePrice * (1 - formData.discountPercentage / 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const basePrice = calculateBasePrice()
    const bundlePrice = calculateBundlePrice()

    const bundleData = {
      ...formData,
      products: bundleProducts.length,
      basePrice,
      bundlePrice,
      savings: formData.discountPercentage,
      popularity: bundle?.popularity || 0,
    }

    onSave(bundleData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold">{bundle ? 'Edit Bundle' : 'Create New Bundle'}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bundle Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Premium Kitchen Package"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the bundle offerings..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bundle Products */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bundle Products ({bundleProducts.length})</h3>

              {bundleProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No products added yet. Add products from the list below.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {bundleProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {product.sku} | Category: {product.category}</p>
                          <p className="text-sm font-medium text-blue-600 mt-1">₹{(product.price / 100000).toFixed(2)}L each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-red-600 hover:bg-red-50 rounded p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-300 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Add Products to Bundle</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableProducts.filter(p => !bundleProducts.find(bp => bp.id === p.id)).map((product) => (
                    <div key={product.id} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.sku} | {product.category} | ₹{(product.price / 100000).toFixed(2)}L</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddProduct(product)}
                        className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Products:</span>
                  <span className="font-semibold text-gray-900">{bundleProducts.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Base Price (Individual):</span>
                  <span className="font-semibold text-gray-900">₹{(calculateBasePrice() / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Bundle Discount:</span>
                  <span className="font-semibold text-green-600">{formData.discountPercentage}%</span>
                </div>
                <div className="border-t border-blue-300 pt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Bundle Price:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{(calculateBundlePrice() / 100000).toFixed(2)}L</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">Customer Savings:</span>
                  <span className="font-semibold text-green-600">₹{((calculateBasePrice() - calculateBundlePrice()) / 100000).toFixed(2)}L</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bundleProducts.length === 0}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Package2 className="h-4 w-4" />
              {bundle ? 'Update Bundle' : 'Create Bundle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ViewBundleModal: React.FC<ViewBundleModalProps> = ({
  isOpen,
  onClose,
  bundle,
  onEdit
}) => {
  if (!isOpen || !bundle) return null

  const mockBundleProducts = [
    { id: 'P-001', name: 'Premium Plywood Cabinets', sku: 'CAB-001', category: 'Cabinets', price: 150000, quantity: 2 },
    { id: 'P-002', name: 'Granite Countertop', sku: 'CNT-001', category: 'Countertops', price: 45000, quantity: 1 },
    { id: 'P-003', name: 'Stainless Steel Sink', sku: 'SNK-001', category: 'Sinks', price: 12000, quantity: 1 },
    { id: 'P-004', name: 'Modular Kitchen Island', sku: 'ISL-001', category: 'Islands', price: 85000, quantity: 1 },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">{bundle.name}</h2>
            <p className="text-sm text-blue-100 mt-1">{bundle.id}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Bundle Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <Package2 className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm text-blue-600">Products</p>
              <p className="text-2xl font-bold text-blue-900">{bundle.products}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <Tag className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-sm text-green-600">Savings</p>
              <p className="text-2xl font-bold text-green-900">{bundle.savings}%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm text-purple-600">Bundle Price</p>
              <p className="text-2xl font-bold text-purple-900">₹{(bundle.bundlePrice / 100000).toFixed(2)}L</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <ShoppingCart className="h-8 w-8 text-orange-600 mb-2" />
              <p className="text-sm text-orange-600">Popularity</p>
              <p className="text-2xl font-bold text-orange-900">{bundle.popularity}%</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{bundle.description}</p>
          </div>

          {/* Bundle Products */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bundle Products</h3>
            <div className="space-y-3">
              {mockBundleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {product.sku} | Category: {product.category}</p>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Unit Price</p>
                      <p className="font-semibold text-blue-600">₹{(product.price / 100000).toFixed(2)}L</p>
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        Total: ₹{(product.price * product.quantity / 100000).toFixed(2)}L
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Base Price (Individual Products):</span>
                <span className="font-semibold text-gray-900 line-through">₹{(bundle.basePrice / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Bundle Discount ({bundle.savings}%):</span>
                <span className="font-semibold text-green-600">-₹{((bundle.basePrice - bundle.bundlePrice) / 100000).toFixed(2)}L</span>
              </div>
              <div className="border-t border-blue-300 pt-3 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Final Bundle Price:</span>
                <span className="text-2xl font-bold text-blue-600">₹{(bundle.bundlePrice / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>

          {/* Status & Popularity */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                bundle.status === 'active'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {bundle.status.charAt(0).toUpperCase() + bundle.status.slice(1)}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Popularity Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${bundle.popularity}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{bundle.popularity}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit()
              onClose()
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Edit Bundle
          </button>
        </div>
      </div>
    </div>
  )
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [filters, setFilters] = useState({
    status: [] as string[],
    minProducts: '',
    maxProducts: '',
    minPrice: '',
    maxPrice: '',
    minSavings: '',
    maxSavings: '',
    minPopularity: '',
    maxPopularity: '',
  })

  if (!isOpen) return null

  const handleStatusToggle = (status: string) => {
    setFilters({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      status: [],
      minProducts: '',
      maxProducts: '',
      minPrice: '',
      maxPrice: '',
      minSavings: '',
      maxSavings: '',
      minPopularity: '',
      maxPopularity: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold">Filter Bundles</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleStatusToggle('active')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.status.includes('active')
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusToggle('inactive')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.status.includes('inactive')
                      ? 'bg-gray-200 text-gray-700 border-gray-400'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* Products Count Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Number of Products</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min products"
                    value={filters.minProducts}
                    onChange={(e) => setFilters({ ...filters, minProducts: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max products"
                    value={filters.maxProducts}
                    onChange={(e) => setFilters({ ...filters, maxProducts: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Bundle Price Range (₹ Lakhs)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Savings Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Savings Percentage (%)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min savings"
                    min="0"
                    max="100"
                    value={filters.minSavings}
                    onChange={(e) => setFilters({ ...filters, minSavings: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max savings"
                    min="0"
                    max="100"
                    value={filters.maxSavings}
                    onChange={(e) => setFilters({ ...filters, maxSavings: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Popularity Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Popularity Score (%)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min popularity"
                    min="0"
                    max="100"
                    value={filters.minPopularity}
                    onChange={(e) => setFilters({ ...filters, minPopularity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max popularity"
                    min="0"
                    max="100"
                    value={filters.maxPopularity}
                    onChange={(e) => setFilters({ ...filters, maxPopularity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Filter Tips</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Leave fields empty to skip that filter</li>
                  <li>Multiple status selections work as OR conditions</li>
                  <li>Range filters work as AND conditions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Filters
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
