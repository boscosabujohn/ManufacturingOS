'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calculator,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Percent
} from 'lucide-react'
import { CreateRuleModal, EditRuleModal, TestRuleModal } from '@/components/cpq/PricingRuleModals'

interface PricingRule {
  id: string
  name: string
  type: 'markup' | 'discount' | 'formula' | 'tiered'
  condition: string
  value: string
  priority: number
  status: 'active' | 'inactive'
  appliedCount: number
}

export default function CPQPricingRulesPage() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null)

  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: 'PR-001',
      name: 'Premium Material Markup',
      type: 'markup',
      condition: 'If Material = Premium',
      value: '+35%',
      priority: 1,
      status: 'active',
      appliedCount: 156
    },
    {
      id: 'PR-002',
      name: 'Bulk Order Discount',
      type: 'discount',
      condition: 'If Quantity > 10',
      value: '-12%',
      priority: 2,
      status: 'active',
      appliedCount: 89
    },
    {
      id: 'PR-003',
      name: 'Custom Configuration Surcharge',
      type: 'markup',
      condition: 'If Customization = Yes',
      value: '+₹50,000',
      priority: 1,
      status: 'active',
      appliedCount: 203
    },
    {
      id: 'PR-004',
      name: 'Volume Based Tiered Pricing',
      type: 'tiered',
      condition: 'Based on Quantity Tiers',
      value: '5-10: -8%, 11-20: -15%, 21+: -22%',
      priority: 2,
      status: 'active',
      appliedCount: 127
    },
    {
      id: 'PR-005',
      name: 'Smart Appliance Premium',
      type: 'markup',
      condition: 'If Appliance Type = Smart',
      value: '+25%',
      priority: 1,
      status: 'active',
      appliedCount: 94
    },
    {
      id: 'PR-006',
      name: 'Express Delivery Fee',
      type: 'markup',
      condition: 'If Delivery = Express',
      value: '+₹15,000',
      priority: 3,
      status: 'active',
      appliedCount: 67
    },
    {
      id: 'PR-007',
      name: 'Seasonal Discount - Q4',
      type: 'discount',
      condition: 'If Quarter = Q4',
      value: '-10%',
      priority: 3,
      status: 'inactive',
      appliedCount: 45
    },
    {
      id: 'PR-008',
      name: 'Complex Formula Pricing',
      type: 'formula',
      condition: 'Custom calculation',
      value: 'Base * (1 + Complexity/100) + Labor',
      priority: 2,
      status: 'active',
      appliedCount: 112
    }
  ])

  const getTypeColor = (type: string) => {
    const colors: any = {
      markup: 'bg-green-100 text-green-700 border-green-200',
      discount: 'bg-blue-100 text-blue-700 border-blue-200',
      formula: 'bg-purple-100 text-purple-700 border-purple-200',
      tiered: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[type] || colors.markup
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-700 border-red-200'
    if (priority === 2) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  // Handlers
  const handleCreateRule = (rule: any) => {
    const newRule: PricingRule = {
      id: `PR-${String(pricingRules.length + 1).padStart(3, '0')}`,
      name: rule.name,
      type: rule.type as 'markup' | 'discount' | 'formula' | 'tiered',
      condition: rule.description || 'Custom condition',
      value: '+10%', // Simplified for demo
      priority: rule.priority,
      status: rule.status === 'active' ? 'active' : 'inactive',
      appliedCount: 0
    }
    setPricingRules([...pricingRules, newRule])
    setIsCreateModalOpen(false)
  }

  const handleEditRule = (rule: PricingRule) => {
    setSelectedRule(rule)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedRule: any) => {
    setPricingRules(pricingRules.map(r =>
      r.id === updatedRule.id ? {
        ...r,
        name: updatedRule.name,
        priority: updatedRule.priority,
        status: updatedRule.status
      } : r
    ))
    setIsEditModalOpen(false)
    setSelectedRule(null)
  }

  const handleTestRule = (rule: PricingRule) => {
    setSelectedRule(rule)
    setIsTestModalOpen(true)
  }

  const handleToggleStatus = (rule: PricingRule) => {
    setPricingRules(pricingRules.map(r =>
      r.id === rule.id
        ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' }
        : r
    ))
  }

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Type', 'Condition', 'Value', 'Priority', 'Status', 'Applied Count']
    const csvData = filteredRules.map(rule => [
      rule.id,
      `"${rule.name}"`,
      rule.type,
      `"${rule.condition}"`,
      rule.value,
      rule.priority,
      rule.status,
      rule.appliedCount
    ])

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pricing-rules-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedTypeFilter(type)
  }

  // Filtering logic
  const filteredRules = pricingRules.filter(rule => {
    const matchesSearch = searchQuery === '' ||
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.condition.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedTypeFilter === null || rule.type === selectedTypeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Rules</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{filteredRules.length}</p>
              <p className="text-xs text-blue-700 mt-1">Pricing rules {searchQuery || selectedTypeFilter ? 'matching filter' : 'defined'}</p>
            </div>
            <Calculator className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Rules</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {filteredRules.filter(r => r.status === 'active').length}
              </p>
              <p className="text-xs text-green-700 mt-1">Currently applied</p>
            </div>
            <ToggleRight className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Applications</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {filteredRules.reduce((sum, r) => sum + r.appliedCount, 0)}
              </p>
              <p className="text-xs text-purple-700 mt-1">Rules applied to quotes</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Impact</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">±18%</p>
              <p className="text-xs text-orange-700 mt-1">On base pricing</p>
            </div>
            <Percent className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Rule Type Filter */}
      <div className="mb-6 flex gap-3">
        <button onClick={() => handleTypeFilter(null)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedTypeFilter === null
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          All Rules ({pricingRules.length})
        </button>
        <button onClick={() => handleTypeFilter('markup')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          selectedTypeFilter === 'markup'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Markup ({pricingRules.filter(r => r.type === 'markup').length})
        </button>
        <button onClick={() => handleTypeFilter('discount')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          selectedTypeFilter === 'discount'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Discount ({pricingRules.filter(r => r.type === 'discount').length})
        </button>
        <button onClick={() => handleTypeFilter('formula')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          selectedTypeFilter === 'formula'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Formula ({pricingRules.filter(r => r.type === 'formula').length})
        </button>
        <button onClick={() => handleTypeFilter('tiered')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          selectedTypeFilter === 'tiered'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Tiered ({pricingRules.filter(r => r.type === 'tiered').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pricing rules..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pricing Rules Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rule Name</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Applied</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    {searchQuery || selectedTypeFilter ? (
                      <div>
                        <p className="text-lg font-medium mb-2">No matching rules found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium mb-2">No pricing rules yet</p>
                        <p className="text-sm">Click "Add Rule" to create your first pricing rule</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => (
                  <tr key={rule.id} onClick={() => handleTestRule(rule)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                      <div className="text-xs text-gray-500">{rule.id}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeColor(rule.type)}`}>
                        {rule.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-700 max-w-xs">{rule.condition}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-blue-600">{rule.value}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(rule.priority)}`}>
                        P{rule.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-700">{rule.appliedCount}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(rule.status)}`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditRule(rule); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(rule); }} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title={rule.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {rule.status === 'active' ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rule Types Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Pricing Rule Types:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Markup:</strong> Adds a percentage or fixed amount to base price</li>
          <li><strong>Discount:</strong> Reduces price by percentage or fixed amount</li>
          <li><strong>Formula:</strong> Uses custom calculation logic for complex pricing</li>
          <li><strong>Tiered:</strong> Applies different rates based on quantity ranges</li>
        </ul>
      </div>

      {/* Modals */}
      <CreateRuleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRule}
      />

      <EditRuleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        rule={selectedRule}
      />

      <TestRuleModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        rule={selectedRule}
      />
    </div>
  )
}
