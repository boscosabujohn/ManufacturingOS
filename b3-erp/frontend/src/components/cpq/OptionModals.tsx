'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, AlertCircle, Sliders, DollarSign } from 'lucide-react'

interface ProductOption {
  id: string
  name: string
  category: string
  type: 'dropdown' | 'checkbox' | 'radio' | 'text'
  required: boolean
  priceImpact: number
  options: string[]
  status: 'active' | 'inactive'
}

interface OptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (option: Partial<ProductOption>) => void
  option?: ProductOption | null
}

interface ViewOptionModalProps {
  isOpen: boolean
  onClose: () => void
  option: ProductOption | null
  onEdit: () => void
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export const OptionModal: React.FC<OptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  option
}) => {
  const [formData, setFormData] = useState({
    name: option?.name || '',
    category: option?.category || '',
    type: option?.type || 'dropdown' as 'dropdown' | 'checkbox' | 'radio' | 'text',
    required: option?.required || false,
    priceImpact: option?.priceImpact || 0,
    status: option?.status || 'active' as 'active' | 'inactive',
    description: '',
    defaultValue: '',
    helpText: '',
  })

  const [choices, setChoices] = useState<string[]>(option?.options || [''])

  if (!isOpen) return null

  const handleAddChoice = () => {
    setChoices([...choices, ''])
  }

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 1) {
      setChoices(choices.filter((_, i) => i !== index))
    }
  }

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...choices]
    updated[index] = value
    setChoices(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const optionData = {
      ...formData,
      options: choices.filter(c => c.trim() !== ''),
    }

    onSave(optionData)
    onClose()
  }

  const categoryOptions = [
    'Cabinets',
    'Hardware',
    'Electrical',
    'Finishes',
    'Fixtures',
    'Accessories',
    'Appliances',
    'Countertops',
    'Storage',
    'Lighting'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold">{option ? 'Edit Option' : 'Add New Option'}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-3">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cabinet Finish"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="dropdown">Dropdown (Select One)</option>
                    <option value="radio">Radio Buttons (Select One)</option>
                    <option value="checkbox">Checkboxes (Select Multiple)</option>
                    <option value="text">Text Input (Free Form)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Impact (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.priceImpact}
                    onChange={(e) => setFormData({ ...formData, priceImpact: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{(formData.priceImpact / 1000).toFixed(0)}K
                  </p>
                </div>

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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe this option..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.required}
                      onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      This is a required option (customers must select a value)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Available Choices (for dropdown, radio, checkbox) */}
            {['dropdown', 'radio', 'checkbox'].includes(formData.type) && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Available Choices</h3>
                  <button
                    type="button"
                    onClick={handleAddChoice}
                    className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Choice
                  </button>
                </div>

                {choices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Sliders className="h-12 w-12 mb-2 text-gray-400" />
                    <p>No choices added yet. Add choices for customers to select from.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {choices.map((choice, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => handleChoiceChange(index, e.target.value)}
                          placeholder={`Choice ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(index)}
                          disabled={choices.length === 1}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 flex gap-2 mt-4">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">Choice Tips</p>
                    <ul className="list-disc list-inside mt-1 text-blue-800 space-y-0.5">
                      <li>Add clear, distinct choices for customers to select</li>
                      <li>Each choice can have its own price impact (future feature)</li>
                      <li>Keep choice names short and descriptive</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Text Input Configuration */}
            {formData.type === 'text' && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Text Input Configuration</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Value
                    </label>
                    <input
                      type="text"
                      value={formData.defaultValue}
                      onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Default text value (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Help Text
                    </label>
                    <input
                      type="text"
                      value={formData.helpText}
                      onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Enter custom dimensions in inches"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
              <div className="bg-white rounded-lg p-3 border border-gray-300">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {formData.name || 'Option Name'}
                  {formData.required && <span className="text-red-600 ml-1">*</span>}
                </label>
                {formData.description && (
                  <p className="text-xs text-gray-600 mb-3">{formData.description}</p>
                )}

                {formData.type === 'dropdown' && (
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select an option</option>
                    {choices.filter(c => c.trim()).map((choice, i) => (
                      <option key={i}>{choice}</option>
                    ))}
                  </select>
                )}

                {formData.type === 'radio' && (
                  <div className="space-y-2">
                    {choices.filter(c => c.trim()).map((choice, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input type="radio" name="preview-radio" className="w-4 h-4" />
                        <span className="text-sm">{choice}</span>
                      </label>
                    ))}
                  </div>
                )}

                {formData.type === 'checkbox' && (
                  <div className="space-y-2">
                    {choices.filter(c => c.trim()).map((choice, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">{choice}</span>
                      </label>
                    ))}
                  </div>
                )}

                {formData.type === 'text' && (
                  <div>
                    <input
                      type="text"
                      placeholder={formData.defaultValue || 'Enter value...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {formData.helpText && (
                      <p className="text-xs text-gray-500 mt-1">{formData.helpText}</p>
                    )}
                  </div>
                )}

                {formData.priceImpact > 0 && (
                  <p className="text-xs text-blue-600 font-medium mt-2">
                    +₹{(formData.priceImpact / 1000).toFixed(0)}K price impact
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Sliders className="h-4 w-4" />
              {option ? 'Update Option' : 'Create Option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ViewOptionModal: React.FC<ViewOptionModalProps> = ({
  isOpen,
  onClose,
  option,
  onEdit
}) => {
  if (!isOpen || !option) return null

  const getTypeColor = (type: string) => {
    const colors: any = {
      dropdown: 'bg-blue-100 text-blue-700 border-blue-200',
      checkbox: 'bg-green-100 text-green-700 border-green-200',
      radio: 'bg-purple-100 text-purple-700 border-purple-200',
      text: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[type] || colors.dropdown
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">{option.name}</h2>
            <p className="text-sm text-blue-100 mt-1">{option.id}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Option Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <Sliders className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm text-blue-600">Category</p>
              <p className="text-lg font-bold text-blue-900">{option.category}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
              <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm text-purple-600">Price Impact</p>
              <p className="text-lg font-bold text-purple-900">₹{(option.priceImpact / 1000).toFixed(0)}K</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
              <div className="text-2xl mb-2">{option.required ? '⚠️' : '✓'}</div>
              <p className="text-sm text-green-600">Requirement</p>
              <p className="text-lg font-bold text-green-900">{option.required ? 'Required' : 'Optional'}</p>
            </div>
          </div>

          {/* Type & Status */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600 mb-2">Input Type</p>
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${getTypeColor(option.type)}`}>
                  {option.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${
                  option.status === 'active'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {option.status.charAt(0).toUpperCase() + option.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Available Choices */}
          {['dropdown', 'radio', 'checkbox'].includes(option.type) && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Available Choices ({option.options.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {option.options.map((choice, index) => (
                  <div key={index} className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-900">{choice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Configurations:</span>
                <span className="font-semibold text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Most Popular Choice:</span>
                <span className="font-semibold text-gray-900">{option.options[0] || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Avg. Selection Rate:</span>
                <span className="font-semibold text-gray-900">85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
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
            Edit Option
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
    categories: [] as string[],
    types: [] as string[],
    required: '',
    status: [] as string[],
    minPriceImpact: '',
    maxPriceImpact: '',
  })

  if (!isOpen) return null

  const categoryOptions = ['Cabinets', 'Hardware', 'Electrical', 'Finishes', 'Fixtures', 'Accessories', 'Appliances', 'Countertops', 'Storage', 'Lighting']
  const typeOptions = [
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'text', label: 'Text Input' }
  ]

  const handleCategoryToggle = (category: string) => {
    setFilters({
      ...filters,
      categories: filters.categories.includes(category)
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories, category]
    })
  }

  const handleTypeToggle = (type: string) => {
    setFilters({
      ...filters,
      types: filters.types.includes(type)
        ? filters.types.filter(t => t !== type)
        : [...filters.types, type]
    })
  }

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
      categories: [],
      types: [],
      required: '',
      status: [],
      minPriceImpact: '',
      maxPriceImpact: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold">Filter Options</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-3">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categoryOptions.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
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

            {/* Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Input Types</label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeToggle(type.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.types.includes(type.value)
                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Requirement</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, required: filters.required === 'required' ? '' : 'required' })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.required === 'required'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Required
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, required: filters.required === 'optional' ? '' : 'optional' })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.required === 'optional'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Optional
                </button>
              </div>
            </div>

            {/* Status */}
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

            {/* Price Impact Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Price Impact Range (₹ Thousands)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min (K)"
                    value={filters.minPriceImpact}
                    onChange={(e) => setFilters({ ...filters, minPriceImpact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max (K)"
                    value={filters.maxPriceImpact}
                    onChange={(e) => setFilters({ ...filters, maxPriceImpact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Filter Tips</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Multiple selections within a category work as OR conditions</li>
                  <li>Different filter categories work as AND conditions</li>
                  <li>Leave fields empty to skip that filter</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 flex items-center justify-between flex-shrink-0">
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
