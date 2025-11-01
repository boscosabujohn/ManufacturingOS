'use client'

import { useState } from 'react'
import { X, Plus, Save, Play, CheckCircle2, ArrowRight, Edit2, Trash2, GripVertical } from 'lucide-react'

export interface Playbook {
  id: string
  playbookCode: string
  playbookName: string
  category: string
  targetSegment: string
  productFocus: string
  stages: number
  avgDealSize: number
  winRate: number
  avgCycleTime: number
  usageCount: number
  successfulDeals: number
  status: 'active' | 'draft' | 'archived'
  createdBy: string
  createdDate: string
  lastUpdated: string
  description: string
}

interface PlaybookStage {
  id: string
  stageName: string
  description: string
  keyActions: string[]
  expectedDuration: number
  successCriteria: string
}

interface PlaybookModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (playbook: Playbook) => void
  playbook: Playbook | null
}

interface ViewPlaybookModalProps {
  isOpen: boolean
  onClose: () => void
  playbook: Playbook
}

interface UsePlaybookModalProps {
  isOpen: boolean
  onClose: () => void
  playbook: Playbook
}

interface StageBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  playbook: Playbook
}

export function PlaybookModal({ isOpen, onClose, onSave, playbook }: PlaybookModalProps) {
  const [formData, setFormData] = useState({
    playbookName: playbook?.playbookName || '',
    playbookCode: playbook?.playbookCode || '',
    category: playbook?.category || '',
    targetSegment: playbook?.targetSegment || '',
    productFocus: playbook?.productFocus || '',
    description: playbook?.description || '',
    status: playbook?.status || 'draft' as 'active' | 'draft' | 'archived',
    stages: playbook?.stages || 5,
    avgCycleTime: playbook?.avgCycleTime || 14
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.playbookName.trim()) newErrors.playbookName = 'Playbook name is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.targetSegment.trim()) newErrors.targetSegment = 'Target segment is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const newPlaybook: Playbook = {
      id: playbook?.id || `PB${Date.now()}`,
      ...formData,
      playbookCode: formData.playbookCode || `PB-${formData.category.substring(0, 4).toUpperCase()}-${String(Date.now()).slice(-3)}`,
      avgDealSize: playbook?.avgDealSize || 0,
      winRate: playbook?.winRate || 0,
      usageCount: playbook?.usageCount || 0,
      successfulDeals: playbook?.successfulDeals || 0,
      createdBy: playbook?.createdBy || 'Current User',
      createdDate: playbook?.createdDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    onSave(newPlaybook)
    onClose()
  }

  const categories = [
    'Modular Kitchen', 'Commercial Kitchen', 'Kitchen Sinks', 'Kitchen Appliances',
    'Renovation', 'Builder Projects', 'Smart Kitchen', 'Compact Kitchen',
    'Sustainable Kitchen', 'Luxury Kitchen', 'Accessories'
  ]

  const segments = [
    'Luxury Residential', 'Middle Income Residential', 'B2B - Hospitality',
    'Retail - All Segments', 'New Home Buyers', 'Home Renovation',
    'B2B - Real Estate Developers', 'Tech-Savvy Urban Professionals',
    'Studio Apartments & Small Homes', 'Environmentally Conscious Buyers',
    'Ultra High Net Worth', 'Existing Customers'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {playbook ? 'Edit Playbook' : 'Create New Playbook'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Playbook Name *
              </label>
              <input
                type="text"
                value={formData.playbookName}
                onChange={(e) => setFormData({ ...formData, playbookName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.playbookName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Premium Modular Kitchen - Luxury Segment"
              />
              {errors.playbookName && (
                <p className="text-red-500 text-sm mt-1">{errors.playbookName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playbook Code
                </label>
                <input
                  type="text"
                  value={formData.playbookCode}
                  onChange={(e) => setFormData({ ...formData, playbookCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Segment *
              </label>
              <select
                value={formData.targetSegment}
                onChange={(e) => setFormData({ ...formData, targetSegment: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.targetSegment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Target Segment</option>
                {segments.map(seg => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
              {errors.targetSegment && (
                <p className="text-red-500 text-sm mt-1">{errors.targetSegment}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Focus
              </label>
              <input
                type="text"
                value={formData.productFocus}
                onChange={(e) => setFormData({ ...formData, productFocus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., High-end modular kitchens with premium appliances"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the playbook strategy and approach"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Stages
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stages}
                  onChange={(e) => setFormData({ ...formData, stages: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avg Cycle Time (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.avgCycleTime}
                  onChange={(e) => setFormData({ ...formData, avgCycleTime: parseInt(e.target.value) || 14 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {playbook ? 'Update Playbook' : 'Create Playbook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ViewPlaybookModal({ isOpen, onClose, playbook }: ViewPlaybookModalProps) {
  if (!isOpen) return null

  const stages: PlaybookStage[] = [
    {
      id: '1',
      stageName: 'Initial Contact & Discovery',
      description: 'Establish connection and understand customer needs',
      keyActions: ['Introduce company and offerings', 'Ask discovery questions', 'Identify pain points', 'Set expectations'],
      expectedDuration: 2,
      successCriteria: 'Customer shares budget range and timeline'
    },
    {
      id: '2',
      stageName: 'Needs Assessment',
      description: 'Deep dive into specific requirements',
      keyActions: ['Site visit or space analysis', 'Lifestyle and cooking habits', 'Design preferences', 'Technical requirements'],
      expectedDuration: 3,
      successCriteria: 'Completed needs assessment document'
    },
    {
      id: '3',
      stageName: 'Solution Design',
      description: 'Create tailored solution proposal',
      keyActions: ['Design concept creation', '3D visualization', 'Material selection', 'Appliance recommendations'],
      expectedDuration: 5,
      successCriteria: 'Customer approves design direction'
    },
    {
      id: '4',
      stageName: 'Proposal & Pricing',
      description: 'Present detailed quotation',
      keyActions: ['Detailed cost breakdown', 'Timeline proposal', 'Payment terms', 'Handle objections'],
      expectedDuration: 3,
      successCriteria: 'Customer reviews and provides feedback'
    },
    {
      id: '5',
      stageName: 'Negotiation & Closing',
      description: 'Finalize terms and close the deal',
      keyActions: ['Address concerns', 'Negotiate pricing', 'Finalize specifications', 'Sign contract'],
      expectedDuration: 2,
      successCriteria: 'Signed contract with deposit'
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Playbook Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{playbook.playbookName}</h3>
            <p className="text-gray-600">{playbook.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">Playbook Code</div>
              <div className="text-lg font-bold text-blue-900">{playbook.playbookCode}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Category</div>
              <div className="text-lg font-bold text-green-900">{playbook.category}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-700 mb-1">Target Segment</div>
              <div className="text-lg font-bold text-purple-900">{playbook.targetSegment}</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-green-600">{playbook.winRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Deal Size</div>
                <div className="text-2xl font-bold text-blue-600">₹{(playbook.avgDealSize / 100000).toFixed(1)}L</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Usage Count</div>
                <div className="text-2xl font-bold text-gray-900">{playbook.usageCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Cycle Time</div>
                <div className="text-2xl font-bold text-purple-600">{playbook.avgCycleTime}d</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Sales Stages ({stages.length})</h4>
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">{stage.stageName}</h5>
                      <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-2">Key Actions:</div>
                          <ul className="space-y-1">
                            {stage.keyActions.map((action, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-2">Success Criteria:</div>
                          <p className="text-xs text-gray-600 mb-2">{stage.successCriteria}</p>
                          <div className="text-xs text-gray-600">
                            Expected Duration: <span className="font-medium">{stage.expectedDuration} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < stages.length - 1 && (
                    <div className="flex justify-center mt-3">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>Created by {playbook.createdBy} on {playbook.createdDate}</div>
              <div>Last updated: {playbook.lastUpdated}</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Play className="h-4 w-4" />
              Use This Playbook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UsePlaybookModal({ isOpen, onClose, playbook }: UsePlaybookModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    opportunityValue: '',
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  })

  if (!isOpen) return null

  const handleStart = () => {
    alert(`Started playbook "${playbook.playbookName}" for customer ${formData.customerName}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Start New Deal with Playbook</h2>
            <p className="text-sm text-gray-600">{playbook.playbookName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Play className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">About This Playbook</h4>
                <p className="text-sm text-gray-700 mb-2">{playbook.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{playbook.stages} stages</span>
                  <span>•</span>
                  <span>{playbook.avgCycleTime} day cycle</span>
                  <span>•</span>
                  <span>{playbook.winRate.toFixed(0)}% win rate</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rajesh & Priya Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input
              type="text"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="CUST-2025-1142"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Deal Value (₹)</label>
              <input
                type="text"
                value={formData.opportunityValue}
                onChange={(e) => setFormData({ ...formData, opportunityValue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2850000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any initial context or notes about this opportunity..."
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-900">
              <strong>Next Steps:</strong> Once you start, you'll be guided through {playbook.stages} stages of the sales process.
              Each stage will provide key actions, success criteria, and best practices to maximize your win rate.
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Playbook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StageBuilderModal({ isOpen, onClose, playbook }: StageBuilderModalProps) {
  const [stages, setStages] = useState<PlaybookStage[]>([
    {
      id: '1',
      stageName: 'Discovery',
      description: 'Understand customer needs',
      keyActions: ['Ask questions', 'Identify pain points'],
      expectedDuration: 3,
      successCriteria: 'Customer shares requirements'
    }
  ])

  const [newStage, setNewStage] = useState<Partial<PlaybookStage>>({
    stageName: '',
    description: '',
    keyActions: [],
    expectedDuration: 1,
    successCriteria: ''
  })

  if (!isOpen) return null

  const addStage = () => {
    if (!newStage.stageName?.trim()) return

    const stage: PlaybookStage = {
      id: `STAGE${Date.now()}`,
      stageName: newStage.stageName,
      description: newStage.description || '',
      keyActions: newStage.keyActions || [],
      expectedDuration: newStage.expectedDuration || 1,
      successCriteria: newStage.successCriteria || ''
    }

    setStages([...stages, stage])
    setNewStage({
      stageName: '',
      description: '',
      keyActions: [],
      expectedDuration: 1,
      successCriteria: ''
    })
  }

  const removeStage = (id: string) => {
    setStages(stages.filter(s => s.id !== id))
  }

  const handleSave = () => {
    alert(`Saved ${stages.length} stages for playbook`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Stage Builder</h2>
            <p className="text-sm text-gray-600">{playbook.playbookName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Stages ({stages.length})</h3>

            {stages.map((stage, index) => (
              <div key={stage.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400 mt-1 cursor-move" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-semibold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{stage.stageName}</h4>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStage(stage.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="ml-11 text-xs text-gray-600">
                      Duration: {stage.expectedDuration} days • {stage.keyActions.length} key actions
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Stage</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage Name</label>
              <input
                type="text"
                value={newStage.stageName}
                onChange={(e) => setNewStage({ ...newStage, stageName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Proposal & Pricing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newStage.description}
                onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of this stage"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  value={newStage.expectedDuration}
                  onChange={(e) => setNewStage({ ...newStage, expectedDuration: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Success Criteria</label>
                <input
                  type="text"
                  value={newStage.successCriteria}
                  onChange={(e) => setNewStage({ ...newStage, successCriteria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What defines success?"
                />
              </div>
            </div>

            <button
              onClick={addStage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Stage
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Stages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
