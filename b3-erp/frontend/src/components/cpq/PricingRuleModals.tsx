'use client'

import { useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Save,
  Play,
  AlertCircle,
  CheckCircle,
  Code,
  Zap,
  Filter,
  DollarSign,
  Percent,
  Calendar,
  Users,
  Package
} from 'lucide-react'
import type {
  PricingRule,
  RuleType,
  RuleOperator,
  RuleAction,
  RuleCondition,
  RuleActionConfig
} from './PricingRulesEngine'

interface CreateRuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: Partial<PricingRule>) => void
}

interface EditRuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: PricingRule) => void
  rule: PricingRule | null
}

interface TestRuleModalProps {
  isOpen: boolean
  onClose: () => void
  rule: PricingRule | null
}

export const CreateRuleModal: React.FC<CreateRuleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'discount' as RuleType,
    priority: 1,
    status: 'draft' as 'active' | 'inactive' | 'draft',
    validFrom: '',
    validTo: ''
  })

  const [conditions, setConditions] = useState<RuleCondition[]>([
    {
      id: 'cond-1',
      field: 'quantity',
      operator: 'greater_than' as RuleOperator,
      value: '',
      logicOperator: 'AND'
    }
  ])

  const [actions, setActions] = useState<RuleActionConfig[]>([
    {
      type: 'add_discount' as RuleAction,
      value: 0,
      applyTo: 'total_price'
    }
  ])

  const ruleTypes: { value: RuleType; label: string; icon: any }[] = [
    { value: 'discount', label: 'Discount Rule', icon: Percent },
    { value: 'markup', label: 'Markup Rule', icon: DollarSign },
    { value: 'price_override', label: 'Price Override', icon: Code },
    { value: 'bundle', label: 'Bundle Pricing', icon: Package },
    { value: 'volume', label: 'Volume Discount', icon: Users },
    { value: 'time_based', label: 'Time-Based', icon: Calendar }
  ]

  const operators: RuleOperator[] = ['equals', 'greater_than', 'less_than', 'between', 'in', 'contains']
  const actionTypes: RuleAction[] = ['set_price', 'add_discount', 'multiply', 'add_amount', 'set_min', 'set_max']

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      {
        id: `cond-${conditions.length + 1}`,
        field: 'quantity',
        operator: 'greater_than',
        value: '',
        logicOperator: 'AND'
      }
    ])
  }

  const handleRemoveCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id))
    }
  }

  const handleConditionChange = (id: string, field: keyof RuleCondition, value: any) => {
    setConditions(conditions.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const handleAddAction = () => {
    setActions([
      ...actions,
      {
        type: 'add_discount',
        value: 0,
        applyTo: 'total_price'
      }
    ])
  }

  const handleRemoveAction = (index: number) => {
    if (actions.length > 1) {
      setActions(actions.filter((_, i) => i !== index))
    }
  }

  const handleActionChange = (index: number, field: keyof RuleActionConfig, value: any) => {
    setActions(actions.map((a, i) =>
      i === index ? { ...a, [field]: value } : a
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRule: Partial<PricingRule> = {
      ...formData,
      conditions,
      actions,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      executionCount: 0
    }

    onSave(newRule)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Pricing Rule</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Volume Discount - 10% off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as RuleType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ruleTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Brief description of what this rule does..."
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Conditions</h3>
              <button
                type="button"
                onClick={handleAddCondition}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Condition
              </button>
            </div>

            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {index > 0 && (
                    <div className="mb-3">
                      <select
                        value={condition.logicOperator}
                        onChange={(e) => handleConditionChange(condition.id, 'logicOperator', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded bg-purple-50 text-purple-700 font-semibold text-sm"
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Field</label>
                      <select
                        value={condition.field}
                        onChange={(e) => handleConditionChange(condition.id, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="quantity">Quantity</option>
                        <option value="total_price">Total Price</option>
                        <option value="customer_segment">Customer Segment</option>
                        <option value="product_category">Product Category</option>
                        <option value="date">Date</option>
                        <option value="order_value">Order Value</option>
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Operator</label>
                      <select
                        value={condition.operator}
                        onChange={(e) => handleConditionChange(condition.id, 'operator', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}>{op.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter value"
                      />
                    </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(condition.id)}
                        disabled={conditions.length === 1}
                        className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              <button
                type="button"
                onClick={handleAddAction}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Action
              </button>
            </div>

            <div className="space-y-3">
              {actions.map((action, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Action Type</label>
                      <select
                        value={action.type}
                        onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {actionTypes.map(at => (
                          <option key={at} value={at}>{at.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                      <input
                        type="number"
                        value={action.value}
                        onChange={(e) => handleActionChange(index, 'value', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                      />
                    </div>

                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Apply To</label>
                      <select
                        value={action.applyTo}
                        onChange={(e) => handleActionChange(index, 'applyTo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="total_price">Total Price</option>
                        <option value="unit_price">Unit Price</option>
                        <option value="subtotal">Subtotal</option>
                        <option value="specific_item">Specific Item</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(index)}
                        disabled={actions.length === 1}
                        className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Create Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EditRuleModal: React.FC<EditRuleModalProps> = ({ isOpen, onClose, onSave, rule }) => {
  const [formData, setFormData] = useState<PricingRule | null>(rule)

  if (!isOpen || !rule) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      onSave({
        ...formData,
        lastModified: new Date().toISOString()
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Edit Pricing Rule</h2>
            <p className="text-sm opacity-90 mt-1">{rule.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a simplified edit modal. In production, this would include all fields similar to the Create modal with pre-filled data.
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input
                type="text"
                value={formData?.name || ''}
                onChange={(e) => setFormData(formData ? { ...formData, name: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData?.description || ''}
                onChange={(e) => setFormData(formData ? { ...formData, description: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <input
                  type="number"
                  value={formData?.priority || 1}
                  onChange={(e) => setFormData(formData ? { ...formData, priority: parseInt(e.target.value) } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData?.status || 'draft'}
                  onChange={(e) => setFormData(formData ? { ...formData, status: e.target.value as any } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const TestRuleModal: React.FC<TestRuleModalProps> = ({ isOpen, onClose, rule }) => {
  const [testData, setTestData] = useState({
    quantity: 10,
    totalPrice: 1000,
    customerSegment: 'premium',
    productCategory: 'electronics',
    orderValue: 5000
  })

  const [testResult, setTestResult] = useState<{
    passed: boolean
    message: string
    calculations: { field: string; value: string }[]
  } | null>(null)

  const handleRunTest = () => {
    if (!rule) return

    // Simulate rule evaluation
    const passed = Math.random() > 0.3 // 70% pass rate for demo

    setTestResult({
      passed,
      message: passed
        ? 'Rule conditions matched! Actions would be applied.'
        : 'Rule conditions did not match. No actions would be applied.',
      calculations: [
        { field: 'Original Price', value: `₹${testData.totalPrice.toLocaleString()}` },
        { field: 'Discount Applied', value: passed ? '10%' : '0%' },
        { field: 'Final Price', value: passed ? `₹${(testData.totalPrice * 0.9).toLocaleString()}` : `₹${testData.totalPrice.toLocaleString()}` },
        { field: 'Savings', value: passed ? `₹${(testData.totalPrice * 0.1).toLocaleString()}` : '₹0' }
      ]
    })
  }

  if (!isOpen || !rule) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Test Pricing Rule</h2>
            <p className="text-sm opacity-90 mt-1">{rule.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Rule Info */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Rule Configuration</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Type:</span> {rule.type}</p>
              <p><span className="font-medium">Priority:</span> {rule.priority}</p>
              <p><span className="font-medium">Status:</span> <span className={`inline-block px-2 py-1 rounded text-xs ${
                rule.status === 'active' ? 'bg-green-100 text-green-700' :
                rule.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{rule.status.toUpperCase()}</span></p>
            </div>
          </div>

          {/* Test Data Input */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Test Data</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={testData.quantity}
                  onChange={(e) => setTestData({ ...testData, quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (₹)</label>
                <input
                  type="number"
                  value={testData.totalPrice}
                  onChange={(e) => setTestData({ ...testData, totalPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segment</label>
                <select
                  value={testData.customerSegment}
                  onChange={(e) => setTestData({ ...testData, customerSegment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                <select
                  value={testData.productCategory}
                  onChange={(e) => setTestData({ ...testData, productCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="electronics">Electronics</option>
                  <option value="machinery">Machinery</option>
                  <option value="components">Components</option>
                  <option value="tools">Tools</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunTest}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              <Play className="h-5 w-5" />
              Run Test
            </button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`rounded-lg p-3 border-2 ${
              testResult.passed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3 mb-2">
                {testResult.passed ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <h4 className={`text-lg font-semibold ${
                    testResult.passed ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {testResult.passed ? 'Test Passed' : 'Test Failed'}
                  </h4>
                  <p className={`text-sm ${
                    testResult.passed ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResult.message}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-gray-700">Calculations:</h5>
                <div className="bg-white rounded-lg p-3 space-y-2">
                  {testResult.calculations.map((calc, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{calc.field}:</span>
                      <span className="font-semibold text-gray-900">{calc.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
