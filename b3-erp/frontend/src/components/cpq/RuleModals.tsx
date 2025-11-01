'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, AlertCircle, GitBranch, Zap } from 'lucide-react'

interface ConfigurationRule {
  id: string
  name: string
  type: 'compatibility' | 'dependency' | 'constraint' | 'pricing'
  condition: string
  action: string
  priority: number
  status: 'active' | 'inactive'
  affectedProducts: number
}

interface RuleCondition {
  id: string
  field: string
  operator: string
  value: string
}

interface RuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: Partial<ConfigurationRule>) => void
  rule?: ConfigurationRule | null
}

interface ViewRuleModalProps {
  isOpen: boolean
  onClose: () => void
  rule: ConfigurationRule | null
  onEdit: () => void
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export const RuleModal: React.FC<RuleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rule
}) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    type: rule?.type || 'dependency' as 'compatibility' | 'dependency' | 'constraint' | 'pricing',
    priority: rule?.priority || 2,
    status: rule?.status || 'active' as 'active' | 'inactive',
    description: '',
    errorMessage: '',
  })

  const [conditions, setConditions] = useState<RuleCondition[]>([
    { id: '1', field: '', operator: 'equals', value: '' }
  ])

  const [actions, setActions] = useState<string[]>([rule?.action || ''])

  if (!isOpen) return null

  const fieldOptions = [
    'Product Category',
    'Kitchen Type',
    'Cabinet Material',
    'Countertop Type',
    'Finish Type',
    'Handle Type',
    'Appliance Type',
    'Color',
    'Size',
    'Width',
    'Height',
    'Quantity',
    'Package Type',
    'Price Range',
    'Warranty Period'
  ]

  const operatorOptions = {
    text: ['equals', 'not equals', 'contains', 'starts with', 'ends with'],
    number: ['equals', 'not equals', 'greater than', 'less than', 'between'],
    boolean: ['is', 'is not']
  }

  const handleAddCondition = () => {
    setConditions([...conditions, {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    }])
  }

  const handleRemoveCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id))
    }
  }

  const handleConditionChange = (id: string, field: keyof RuleCondition, value: string) => {
    setConditions(conditions.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const handleAddAction = () => {
    setActions([...actions, ''])
  }

  const handleRemoveAction = (index: number) => {
    if (actions.length > 1) {
      setActions(actions.filter((_, i) => i !== index))
    }
  }

  const handleActionChange = (index: number, value: string) => {
    const updated = [...actions]
    updated[index] = value
    setActions(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const conditionString = conditions
      .filter(c => c.field && c.value)
      .map(c => `If ${c.field} ${c.operator} "${c.value}"`)
      .join(' AND ')

    const actionString = actions.filter(a => a.trim()).join('; ')

    const ruleData = {
      ...formData,
      condition: conditionString || 'No condition specified',
      action: actionString || 'No action specified',
      affectedProducts: rule?.affectedProducts || 0,
    }

    onSave(ruleData)
    onClose()
  }

  const getRuleTypeDescription = (type: string) => {
    switch (type) {
      case 'compatibility':
        return 'Defines which options can or cannot be selected together'
      case 'dependency':
        return 'Specifies that selecting one option requires another'
      case 'constraint':
        return 'Sets limits on configuration values (min/max, ranges)'
      case 'pricing':
        return 'Applies dynamic pricing based on selections'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold">{rule ? 'Edit Rule' : 'Create New Rule'}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Premium Finish requires Premium Cabinets"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="compatibility">Compatibility</option>
                    <option value="dependency">Dependency</option>
                    <option value="constraint">Constraint</option>
                    <option value="pricing">Pricing</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRuleTypeDescription(formData.type)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>High Priority (P1) - Critical</option>
                    <option value={2}>Medium Priority (P2) - Important</option>
                    <option value={3}>Low Priority (P3) - Normal</option>
                  </select>
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
                    placeholder="Describe what this rule does..."
                  />
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Conditions (When)</h3>
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Condition
                </button>
              </div>

              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div key={condition.id}>
                    {index > 0 && (
                      <div className="text-center text-sm font-medium text-gray-600 my-2">AND</div>
                    )}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-4">
                          <select
                            value={condition.field}
                            onChange={(e) => handleConditionChange(condition.id, 'field', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select field</option>
                            {fieldOptions.map(field => (
                              <option key={field} value={field}>{field}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-3">
                          <select
                            value={condition.operator}
                            onChange={(e) => handleConditionChange(condition.id, 'operator', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            {operatorOptions.text.map(op => (
                              <option key={op} value={op}>{op}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                            placeholder="Value"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(condition.id)}
                            disabled={conditions.length === 1}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mt-4 flex gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  All conditions must be true for the rule to trigger (AND logic). Define the circumstances under which this rule should apply.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Actions (Then)</h3>
                <button
                  type="button"
                  onClick={handleAddAction}
                  className="px-3 py-1 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Action
                </button>
              </div>

              <div className="space-y-2">
                {actions.map((action, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start gap-2">
                      <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-2" />
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => handleActionChange(index, e.target.value)}
                        placeholder={formData.type === 'pricing' ? 'e.g., Apply 15% discount' : formData.type === 'dependency' ? 'e.g., Require Premium Package' : formData.type === 'constraint' ? 'e.g., Width must be between 8-20 ft' : 'e.g., Exclude Basic Options'}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(index)}
                        disabled={actions.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 rounded-lg p-3 border border-green-200 mt-4 flex gap-2">
                <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900">
                  Define what should happen when conditions are met. Multiple actions will be executed in sequence.
                </p>
              </div>
            </div>

            {/* Error Message Configuration */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Message (Optional)</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message for Users
              </label>
              <textarea
                rows={2}
                value={formData.errorMessage}
                onChange={(e) => setFormData({ ...formData, errorMessage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Premium finish is only available with Premium cabinets. Please upgrade your cabinet selection."
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be shown to users when the rule prevents their selection
              </p>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rule Preview</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-300 space-y-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">IF: </span>
                  <span className="text-sm text-gray-900">
                    {conditions.filter(c => c.field && c.value).length > 0
                      ? conditions.filter(c => c.field && c.value).map(c => `${c.field} ${c.operator} "${c.value}"`).join(' AND ')
                      : 'No conditions defined'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">THEN: </span>
                  <span className="text-sm text-gray-900">
                    {actions.filter(a => a.trim()).length > 0
                      ? actions.filter(a => a.trim()).join('; ')
                      : 'No actions defined'}
                  </span>
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
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4" />
              {rule ? 'Update Rule' : 'Create Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ViewRuleModal: React.FC<ViewRuleModalProps> = ({
  isOpen,
  onClose,
  rule,
  onEdit
}) => {
  if (!isOpen || !rule) return null

  const getTypeColor = (type: string) => {
    const colors: any = {
      compatibility: 'bg-blue-100 text-blue-700 border-blue-200',
      dependency: 'bg-purple-100 text-purple-700 border-purple-200',
      constraint: 'bg-orange-100 text-orange-700 border-orange-200',
      pricing: 'bg-green-100 text-green-700 border-green-200'
    }
    return colors[type] || colors.compatibility
  }

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return 'High (Critical)'
    if (priority === 2) return 'Medium (Important)'
    return 'Low (Normal)'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">{rule.name}</h2>
            <p className="text-sm text-blue-100 mt-1">{rule.id}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Rule Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <GitBranch className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm text-blue-600">Type</p>
              <p className="text-lg font-bold text-blue-900 capitalize">{rule.type}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <AlertCircle className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm text-purple-600">Priority</p>
              <p className="text-lg font-bold text-purple-900">{getPriorityLabel(rule.priority)}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm text-orange-600">Affected</p>
              <p className="text-lg font-bold text-orange-900">{rule.affectedProducts} Products</p>
            </div>
          </div>

          {/* Condition & Action */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rule Logic</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-blue-700 flex-shrink-0">WHEN:</span>
                  <p className="text-sm text-blue-900">{rule.condition}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-green-700 flex-shrink-0">THEN:</span>
                  <p className="text-sm text-green-900">{rule.action}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Execution Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${
                rule.status === 'active'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Rule Type</p>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border capitalize ${getTypeColor(rule.type)}`}>
                {rule.type}
              </span>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Executions (30 days):</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Successful Validations:</span>
                <span className="font-semibold text-gray-900">1,189 (95.3%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Blocked Configurations:</span>
                <span className="font-semibold text-gray-900">58 (4.7%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Last Triggered:</span>
                <span className="font-semibold text-gray-900">2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Impact Analysis */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Analysis</h3>
            <p className="text-sm text-gray-700 mb-2">
              This rule affects <strong>{rule.affectedProducts} products</strong> across multiple categories.
            </p>
            <p className="text-sm text-gray-600">
              Disabling this rule may allow incompatible configurations or remove important pricing rules.
            </p>
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
            Edit Rule
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
    types: [] as string[],
    priorities: [] as number[],
    status: [] as string[],
    minAffectedProducts: '',
    maxAffectedProducts: '',
  })

  if (!isOpen) return null

  const typeOptions = [
    { value: 'compatibility', label: 'Compatibility', color: 'blue' },
    { value: 'dependency', label: 'Dependency', color: 'purple' },
    { value: 'constraint', label: 'Constraint', color: 'orange' },
    { value: 'pricing', label: 'Pricing', color: 'green' }
  ]

  const priorityOptions = [
    { value: 1, label: 'High (P1)', color: 'red' },
    { value: 2, label: 'Medium (P2)', color: 'yellow' },
    { value: 3, label: 'Low (P3)', color: 'gray' }
  ]

  const handleTypeToggle = (type: string) => {
    setFilters({
      ...filters,
      types: filters.types.includes(type)
        ? filters.types.filter(t => t !== type)
        : [...filters.types, type]
    })
  }

  const handlePriorityToggle = (priority: number) => {
    setFilters({
      ...filters,
      priorities: filters.priorities.includes(priority)
        ? filters.priorities.filter(p => p !== priority)
        : [...filters.priorities, priority]
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
      types: [],
      priorities: [],
      status: [],
      minAffectedProducts: '',
      maxAffectedProducts: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-semibold">Filter Rules</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Rule Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Rule Types</label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeToggle(type.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                      filters.types.includes(type.value)
                        ? `bg-${type.color}-100 text-${type.color}-700 border-${type.color}-300`
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Priority Levels</label>
              <div className="grid grid-cols-3 gap-2">
                {priorityOptions.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handlePriorityToggle(priority.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.priorities.includes(priority.value)
                        ? `bg-${priority.color}-100 text-${priority.color}-700 border-${priority.color}-300`
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
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

            {/* Affected Products Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Affected Products Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min products"
                    value={filters.minAffectedProducts}
                    onChange={(e) => setFilters({ ...filters, minAffectedProducts: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max products"
                    value={filters.maxAffectedProducts}
                    onChange={(e) => setFilters({ ...filters, maxAffectedProducts: e.target.value })}
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
                  <li>Multiple selections within a category work as OR conditions</li>
                  <li>Different filter categories work as AND conditions</li>
                  <li>Leave fields empty to skip that filter</li>
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
