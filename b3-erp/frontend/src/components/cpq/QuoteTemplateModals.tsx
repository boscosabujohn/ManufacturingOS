'use client'

import { X, Plus, Trash2, FileText, Star, Copy, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface QuoteTemplate {
  id: string
  name: string
  description: string
  category: string
  sections: number
  lastUsed: string
  usageCount: number
  isFavorite: boolean
  status: 'active' | 'inactive'
}

interface TemplateSection {
  id: string
  name: string
  required: boolean
}

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (template: QuoteTemplate) => void
  template: QuoteTemplate | null
}

interface ViewTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: QuoteTemplate | null
  onEdit: () => void
  onUse: () => void
  onDuplicate: () => void
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

interface UseTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: QuoteTemplate | null
  onConfirm: (quoteData: any) => void
}

export function TemplateModal({ isOpen, onClose, onSave, template }: TemplateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Standard',
    status: 'active' as 'active' | 'inactive',
    isFavorite: false
  })

  const [sections, setSections] = useState<TemplateSection[]>([
    { id: '1', name: 'Customer Information', required: true },
    { id: '2', name: 'Project Details', required: true },
    { id: '3', name: 'Line Items', required: true },
    { id: '4', name: 'Terms & Conditions', required: true }
  ])

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        status: template.status,
        isFavorite: template.isFavorite
      })
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Standard',
        status: 'active',
        isFavorite: false
      })
      setSections([
        { id: '1', name: 'Customer Information', required: true },
        { id: '2', name: 'Project Details', required: true },
        { id: '3', name: 'Line Items', required: true },
        { id: '4', name: 'Terms & Conditions', required: true }
      ])
    }
  }, [template, isOpen])

  const handleAddSection = () => {
    setSections([...sections, {
      id: Date.now().toString(),
      name: '',
      required: false
    }])
  }

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const handleSectionChange = (id: string, field: keyof TemplateSection, value: any) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a template name')
      return
    }

    if (!formData.description.trim()) {
      alert('Please enter a description')
      return
    }

    const newTemplate: QuoteTemplate = {
      id: template?.id || `TPL-${Date.now().toString().slice(-3)}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      sections: sections.length,
      lastUsed: template?.lastUsed || new Date().toISOString().split('T')[0],
      usageCount: template?.usageCount || 0,
      isFavorite: formData.isFavorite,
      status: formData.status
    }

    onSave(newTemplate)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">{template ? 'Edit Template' : 'Create New Template'}</h2>
          <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Left Column */}
            <div className="space-y-2">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Template Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Premium Kitchen Package"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of this template..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Premium">Premium</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                  <option value="Basic">Basic</option>
                  <option value="Custom">Custom</option>
                  <option value="Renovation">Renovation</option>
                </select>
              </div>

              {/* Status and Favorite */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Favorite</label>
                  <label className="flex items-center h-10 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mark as favorite</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Template Sections */}
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Template Sections <span className="text-red-600">*</span>
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {sections.map((section, index) => (
                    <div key={section.id} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => handleSectionChange(section.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Section name..."
                      />
                      <label className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={section.required}
                          onChange={(e) => handleSectionChange(section.id, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-600 whitespace-nowrap">Required</span>
                      </label>
                      {sections.length > 1 && (
                        <button
                          onClick={() => handleRemoveSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddSection}
                    className="w-full px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Template Preview
                </h3>
                <div className="bg-white rounded-lg p-3 border border-gray-300 text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">{formData.name || 'Unnamed Template'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-900">{formData.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Sections:</span>
                    <span className="ml-2 text-gray-900">{sections.length} sections</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full ${
                      formData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {template ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ViewTemplateModal({ isOpen, onClose, template, onEdit, onUse, onDuplicate }: ViewTemplateModalProps) {
  if (!isOpen || !template) return null

  const sampleSections = [
    { name: 'Customer Information', required: true, fields: ['Name', 'Email', 'Phone', 'Address'] },
    { name: 'Project Details', required: true, fields: ['Project Name', 'Location', 'Timeline', 'Budget Range'] },
    { name: 'Line Items', required: true, fields: ['Product/Service', 'Quantity', 'Unit Price', 'Total'] },
    { name: 'Pricing Summary', required: true, fields: ['Subtotal', 'Tax', 'Discount', 'Grand Total'] },
    { name: 'Terms & Conditions', required: true, fields: ['Payment Terms', 'Delivery Terms', 'Warranty Info'] }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">{template.name}</h2>
              <p className="text-sm opacity-90">{template.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Template Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Template ID</label>
              <p className="text-gray-900 font-mono">{template.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                template.category === 'Premium' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                template.category === 'Deluxe' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                template.category === 'Standard' ? 'bg-green-100 text-green-700 border-green-200' :
                template.category === 'Economy' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {template.category}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                template.status === 'active'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {template.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Favorite</label>
              <p className="text-gray-900">
                {template.isFavorite ? (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 inline" />
                ) : (
                  <span className="text-gray-400">Not favorited</span>
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700">{template.description}</p>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <p className="text-sm font-medium text-blue-600">Total Sections</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{template.sections}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
              <p className="text-sm font-medium text-green-600">Times Used</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{template.usageCount}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
              <p className="text-sm font-medium text-purple-600">Last Used</p>
              <p className="text-lg font-bold text-purple-900 mt-1">
                {new Date(template.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Template Structure */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-3 border border-indigo-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Template Structure</h3>
            <div className="space-y-3">
              {sampleSections.slice(0, template.sections).map((section, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{section.name}</h4>
                    {section.required && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Required</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Fields:</span> {section.fields.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <div className="flex gap-3">
              <button
                onClick={onDuplicate}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Edit Template
              </button>
              <button
                onClick={onUse}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UseTemplateModal({ isOpen, onClose, template, onConfirm }: UseTemplateModalProps) {
  const [quoteData, setQuoteData] = useState({
    customerName: '',
    projectName: '',
    validUntil: ''
  })

  useEffect(() => {
    if (isOpen) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      setQuoteData({
        customerName: '',
        projectName: '',
        validUntil: futureDate.toISOString().split('T')[0]
      })
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (!quoteData.customerName.trim()) {
      alert('Please enter customer name')
      return
    }
    if (!quoteData.projectName.trim()) {
      alert('Please enter project name')
      return
    }

    onConfirm({
      ...quoteData,
      templateId: template?.id,
      templateName: template?.name
    })
  }

  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Create Quote from Template</h2>
            <p className="text-sm opacity-90">Using: {template.name}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Quick Setup */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Quick Setup</h3>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Customer Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={quoteData.customerName}
                onChange={(e) => setQuoteData({ ...quoteData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Prestige Properties Ltd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Project Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={quoteData.projectName}
                onChange={(e) => setQuoteData({ ...quoteData, projectName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Apartment 3BHK Kitchen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={quoteData.validUntil}
                onChange={(e) => setQuoteData({ ...quoteData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">What happens next?</p>
              <p>You'll be redirected to the quote builder with all template sections pre-filled. You can customize the quote before saving.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Quote
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
    status: [] as string[],
    favorites: false,
    usageRange: { min: 0, max: 0 }
  })

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      categories: [],
      status: [],
      favorites: false,
      usageRange: { min: 0, max: 0 }
    })
  }

  const toggleArrayFilter = (key: 'categories' | 'status', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v: string) => v !== value)
        : [...prev[key], value]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">Filter Templates</h2>
          <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {['Premium', 'Deluxe', 'Standard', 'Economy', 'Basic', 'Custom', 'Renovation'].map((category) => (
                <button
                  key={category}
                  onClick={() => toggleArrayFilter('categories', category)}
                  className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                    filters.categories.includes(category)
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Status</label>
            <div className="flex gap-2">
              {['active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('status', status)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors capitalize ${
                    filters.status.includes(status)
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.favorites}
                onChange={(e) => setFilters({ ...filters, favorites: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-900">Show only favorites</span>
            </label>
          </div>

          {/* Usage Range */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Usage Count Range</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={filters.usageRange.min || ''}
                onChange={(e) => setFilters({ ...filters, usageRange: { ...filters.usageRange, min: parseInt(e.target.value) || 0 } })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
                min="0"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.usageRange.max || ''}
                onChange={(e) => setFilters({ ...filters, usageRange: { ...filters.usageRange, max: parseInt(e.target.value) || 0 } })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={handleReset}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
