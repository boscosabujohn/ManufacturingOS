'use client'

import { useState } from 'react'
import { X, Plus, CheckCircle, Download, Eye, TrendingUp, FileText, Calendar, Users, Star, AlertCircle, Copy, Trash2 } from 'lucide-react'

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

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template?: ContractTemplate | null
  onSave: (template: any) => void
}

interface ViewTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: ContractTemplate | null
  onUse: (template: ContractTemplate) => void
  onEdit: (template: ContractTemplate) => void
}

interface UseTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: ContractTemplate | null
  on Generate: (data: any) => void
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export function TemplateModal({ isOpen, onClose, template, onSave }: TemplateModalProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'Sales',
    type: template?.type || 'sales',
    status: template?.status || 'draft',
    selectedClauses: [] as string[]
  })

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill all required fields')
      return
    }
    onSave(formData)
  }

  const clauseOptions = [
    { id: 'confidentiality', name: 'Confidentiality Agreement', category: 'Essential' },
    { id: 'ip-rights', name: 'Intellectual Property Rights', category: 'Legal' },
    { id: 'payment-terms', name: 'Payment Terms', category: 'Financial' },
    { id: 'delivery', name: 'Delivery & Installation', category: 'Operational' },
    { id: 'warranty', name: 'Warranty Terms', category: 'Operational' },
    { id: 'termination', name: 'Termination Clause', category: 'Legal' },
    { id: 'liability', name: 'Limitation of Liability', category: 'Legal' },
    { id: 'dispute', name: 'Dispute Resolution', category: 'Legal' },
    { id: 'data-protection', name: 'Data Protection & Privacy', category: 'Compliance' },
    { id: 'force-majeure', name: 'Force Majeure', category: 'Operational' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">
              {template ? 'Edit Template' : 'Create New Template'}
            </h2>
            <p className="text-sm opacity-90">Build reusable contract templates</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Premium Service Agreement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe when to use this template..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Sales">Sales</option>
                  <option value="Service">Service</option>
                  <option value="Legal">Legal</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sales">Sales Contract</option>
                  <option value="service">Service Agreement</option>
                  <option value="nda">Non-Disclosure Agreement</option>
                  <option value="partnership">Partnership Agreement</option>
                  <option value="employment">Employment Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clause Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Clauses</h3>
            <div className="grid grid-cols-2 gap-3">
              {clauseOptions.map((clause) => (
                <label
                  key={clause.id}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedClauses.includes(clause.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          selectedClauses: [...formData.selectedClauses, clause.id]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          selectedClauses: formData.selectedClauses.filter(id => id !== clause.id)
                        })
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{clause.name}</p>
                    <p className="text-xs text-gray-500">{clause.category}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {formData.selectedClauses.length} clauses selected
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {template ? 'Update Template' : 'Create Template'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ViewTemplateModal({ isOpen, onClose, template, onUse, onEdit }: ViewTemplateModalProps) {
  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">{template.name}</h2>
              <p className="text-sm opacity-90">{template.id}</p>
            </div>
            {template.isFavorite && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Usage Count</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{template.usageCount}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-green-600" />
                <p className="text-xs font-semibold text-green-900">Clauses</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{template.clauses}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <p className="text-xs font-semibold text-orange-900">Avg Duration</p>
              </div>
              <p className="text-2xl font-bold text-orange-900">{template.avgDuration}</p>
            </div>
          </div>

          {/* Template Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Template Information</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Description</p>
                <p className="text-sm text-gray-900">{template.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{template.category}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{template.type}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Pages</p>
                  <p className="text-sm font-semibold text-gray-900">{template.pages} pages</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{template.status}</p>
                </div>
              </div>

              {template.avgContractValue > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Average Contract Value</p>
                  <p className="text-lg font-bold text-blue-900">
                    ₹{(template.avgContractValue / 100000).toFixed(2)}L
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-600">Created By</p>
                  <p className="font-semibold text-gray-900">{template.createdBy}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(template.createdDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Used</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(template.lastUsed).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onUse(template)
                onClose()
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Use This Template
            </button>
            <button
              onClick={() => {
                onEdit(template)
                onClose()
              }}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Edit Template
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UseTemplateModal({ isOpen, onClose, template, onGenerate }: UseTemplateModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    contractValue: '',
    startDate: '',
    endDate: ''
  })

  if (!isOpen || !template) return null

  const handleGenerate = () => {
    if (!formData.customerName || !formData.contractValue) {
      alert('Please fill all required fields')
      return
    }
    onGenerate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Generate Contract</h2>
            <p className="text-sm opacity-90">Using: {template.name}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Value (₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Generate Contract
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    types: [] as string[],
    statuses: [] as string[],
    usageRange: { min: 0, max: 1000 },
    onlyFavorites: false
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">Filter Templates</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {['Sales', 'Service', 'Legal', 'Partnership'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilters({
                      ...filters,
                      categories: filters.categories.includes(cat)
                        ? filters.categories.filter(c => c !== cat)
                        : [...filters.categories, cat]
                    })
                  }}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    filters.categories.includes(cat)
                      ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['active', 'draft', 'archived'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilters({
                      ...filters,
                      statuses: filters.statuses.includes(status)
                        ? filters.statuses.filter(s => s !== status)
                        : [...filters.statuses, status]
                    })
                  }}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    filters.statuses.includes(status)
                      ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Only */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyFavorites}
                onChange={(e) => setFilters({ ...filters, onlyFavorites: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">Show Favorites Only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onApply(filters)
                onClose()
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={() => setFilters({
                categories: [],
                types: [],
                statuses: [],
                usageRange: { min: 0, max: 1000 },
                onlyFavorites: false
              })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
