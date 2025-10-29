'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search, Link2, Building2, Users, TrendingUp, Target, ArrowLeftRight } from 'lucide-react'

export interface AccountLink {
  id?: string
  sourceAccountId: string
  targetAccountId: string
  targetAccountName: string
  relationshipType: 'parent' | 'child' | 'partner' | 'competitor'
  bidirectional: boolean
}

interface AccountLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (link: AccountLink) => void
  accountLink?: AccountLink
  mode?: 'add' | 'edit'
  currentAccountId?: string
}

// Mock accounts for autocomplete
const mockAccounts = [
  { id: '1', name: 'Acme Corporation', industry: 'Technology', employees: '5000+' },
  { id: '2', name: 'Global Industries Inc', industry: 'Manufacturing', employees: '10000+' },
  { id: '3', name: 'TechStart Solutions', industry: 'Software', employees: '500-1000' },
  { id: '4', name: 'MegaCorp Enterprises', industry: 'Retail', employees: '50000+' },
  { id: '5', name: 'Innovation Labs', industry: 'Research', employees: '100-500' },
  { id: '6', name: 'Strategic Partners LLC', industry: 'Consulting', employees: '1000-5000' },
  { id: '7', name: 'Competitor Systems', industry: 'Technology', employees: '5000+' },
  { id: '8', name: 'Parent Company Holdings', industry: 'Holding', employees: '100000+' }
]

const relationshipConfig = {
  parent: {
    icon: Building2,
    label: 'Parent Company',
    description: 'This account is a parent of the current account',
    color: 'bg-purple-100 text-purple-700 border-purple-300'
  },
  child: {
    icon: Users,
    label: 'Subsidiary/Child',
    description: 'This account is owned or controlled by the current account',
    color: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  partner: {
    icon: TrendingUp,
    label: 'Business Partner',
    description: 'This account has a partnership or collaboration relationship',
    color: 'bg-green-100 text-green-700 border-green-300'
  },
  competitor: {
    icon: Target,
    label: 'Competitor',
    description: 'This account competes in the same market space',
    color: 'bg-red-100 text-red-700 border-red-300'
  }
}

export default function AccountLinkModal({
  isOpen,
  onClose,
  onSave,
  accountLink,
  mode = 'add',
  currentAccountId = 'current-account'
}: AccountLinkModalProps) {
  const [formData, setFormData] = useState<AccountLink>({
    sourceAccountId: currentAccountId,
    targetAccountId: '',
    targetAccountName: '',
    relationshipType: 'partner',
    bidirectional: false
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (accountLink && mode === 'edit') {
      setFormData(accountLink)
      setSearchQuery(accountLink.targetAccountName)
    } else {
      setFormData({
        sourceAccountId: currentAccountId,
        targetAccountId: '',
        targetAccountName: '',
        relationshipType: 'partner',
        bidirectional: false
      })
      setSearchQuery('')
    }
    setErrors({})
    setShowDropdown(false)
  }, [accountLink, mode, isOpen, currentAccountId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (field: keyof AccountLink, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowDropdown(true)
    if (value.trim() === '') {
      setFormData(prev => ({
        ...prev,
        targetAccountId: '',
        targetAccountName: ''
      }))
    }
  }

  const selectAccount = (account: typeof mockAccounts[0]) => {
    setFormData(prev => ({
      ...prev,
      targetAccountId: account.id,
      targetAccountName: account.name
    }))
    setSearchQuery(account.name)
    setShowDropdown(false)
    if (errors.targetAccountId) {
      setErrors(prev => ({ ...prev, targetAccountId: '' }))
    }
  }

  const filteredAccounts = mockAccounts.filter(account =>
    account.id !== currentAccountId &&
    (account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     account.industry.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.targetAccountId) {
      newErrors.targetAccountId = 'Please select an account from the list'
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !showDropdown) {
      onClose()
    } else if (e.key === 'Escape' && showDropdown) {
      setShowDropdown(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Link2 className="w-6 h-6 text-blue-600" />
            {mode === 'edit' ? 'Edit Account Link' : 'Link Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Account Search */}
          <div ref={searchRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Account <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.targetAccountId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Search by account name or industry..."
              autoFocus
            />
            {errors.targetAccountId && (
              <p className="mt-1 text-sm text-red-600">{errors.targetAccountId}</p>
            )}

            {/* Autocomplete Dropdown */}
            {showDropdown && filteredAccounts.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => selectAccount(account)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-gray-900">{account.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{account.industry}</span>
                      <span>{account.employees} employees</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showDropdown && filteredAccounts.length === 0 && searchQuery.trim() !== '' && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                No accounts found matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Selected Account Info */}
          {formData.targetAccountId && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Selected Account</div>
                  <div className="text-sm text-blue-700">{formData.targetAccountName}</div>
                </div>
              </div>
            </div>
          )}

          {/* Relationship Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Relationship Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(relationshipConfig) as Array<keyof typeof relationshipConfig>).map((type) => {
                const config = relationshipConfig[type]
                const Icon = config.icon
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('relationshipType', type)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.relationshipType === type
                        ? config.color
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {config.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bidirectional Link */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bidirectional}
                onChange={(e) => handleChange('bidirectional', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <ArrowLeftRight className="w-4 h-4" />
                  Create Bidirectional Link
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Both accounts will show this relationship in their account links
                </p>
              </div>
            </label>
          </div>

          {/* Relationship Preview */}
          {formData.targetAccountId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Relationship Preview</div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-gray-900">Current Account</span>
                <ArrowLeftRight className={`w-4 h-4 ${formData.bidirectional ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-gray-600">{relationshipConfig[formData.relationshipType].label}</span>
                <ArrowLeftRight className={`w-4 h-4 ${formData.bidirectional ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-900">{formData.targetAccountName}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'edit' ? 'Save Changes' : 'Link Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
