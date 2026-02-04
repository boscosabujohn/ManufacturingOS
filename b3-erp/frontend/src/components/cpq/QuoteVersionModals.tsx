'use client'

import { X, GitBranch, TrendingUp, TrendingDown, FileText, AlertCircle, Eye, Copy, Clock } from 'lucide-react'
import { useState } from 'react'

export interface QuoteVersion {
  id: string
  quoteNumber: string
  version: string
  customerName: string
  value: number
  changes: string[]
  changeType: 'price-increase' | 'price-decrease' | 'items-added' | 'items-removed' | 'terms-updated'
  createdBy: string
  createdDate: string
  status: 'draft' | 'sent' | 'current' | 'superseded'
}

interface ViewVersionModalProps {
  isOpen: boolean
  onClose: () => void
  version: QuoteVersion | null
  onCompare?: () => void
  onCreateNew?: () => void
}

interface CompareVersionsModalProps {
  isOpen: boolean
  onClose: () => void
  version1: QuoteVersion | null
  version2: QuoteVersion | null
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

interface VersionTimelineModalProps {
  isOpen: boolean
  onClose: () => void
  quoteNumber: string
  versions: QuoteVersion[]
}

export function ViewVersionModal({ isOpen, onClose, version, onCompare, onCreateNew }: ViewVersionModalProps) {
  if (!isOpen || !version) return null

  const getChangeTypeColor = (type: string) => {
    const colors: any = {
      'price-increase': 'bg-red-100 text-red-700 border-red-200',
      'price-decrease': 'bg-green-100 text-green-700 border-green-200',
      'items-added': 'bg-blue-100 text-blue-700 border-blue-200',
      'items-removed': 'bg-orange-100 text-orange-700 border-orange-200',
      'terms-updated': 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colors[type] || colors['items-added']
  }

  const getChangeTypeIcon = (type: string) => {
    if (type === 'price-increase') return <TrendingUp className="h-5 w-5" />
    if (type === 'price-decrease') return <TrendingDown className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <GitBranch className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">{version.quoteNumber} - {version.version}</h2>
              <p className="text-sm opacity-90">{version.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Version Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Version ID</label>
              <p className="text-gray-900 font-mono">{version.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                version.status === 'current' ? 'bg-green-100 text-green-700 border-green-200' :
                version.status === 'sent' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                version.status === 'superseded' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {version.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
              <p className="text-gray-900">{version.createdBy}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
              <p className="text-gray-900">
                {new Date(version.createdDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Quote Value */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quote Value</h3>
            <p className="text-4xl font-bold text-green-900">
              ₹{(version.value / 100000).toFixed(2)}L
            </p>
            <p className="text-sm text-gray-600 mt-2">
              = ₹{version.value.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Change Type */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Type</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getChangeTypeColor(version.changeType)}`}>
              {getChangeTypeIcon(version.changeType)}
              <span className="font-semibold capitalize">{version.changeType.replace(/-/g, ' ')}</span>
            </div>
          </div>

          {/* Changes Made */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Changes Made in This Version</h3>
            <ul className="space-y-2">
              {version.changes.map((change, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700">{change}</span>
                </li>
              ))}
            </ul>
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
              {onCompare && (
                <button
                  onClick={onCompare}
                  className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <GitBranch className="h-4 w-4" />
                  Compare Versions
                </button>
              )}
              {onCreateNew && version.status === 'current' && (
                <button
                  onClick={onCreateNew}
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Create New Version
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompareVersionsModal({ isOpen, onClose, version1, version2 }: CompareVersionsModalProps) {
  if (!isOpen || !version1 || !version2) return null

  const valueDiff = version2.value - version1.value
  const percentChange = ((valueDiff / version1.value) * 100).toFixed(2)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <GitBranch className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Compare Versions</h2>
              <p className="text-sm opacity-90">{version1.version} vs {version2.version}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Value Comparison */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Value Comparison</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">{version1.version}</p>
                <p className="text-2xl font-bold text-gray-900">₹{(version1.value / 100000).toFixed(2)}L</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  valueDiff > 0 ? 'bg-red-100 text-red-700' : valueDiff < 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {valueDiff > 0 ? <TrendingUp className="h-5 w-5" /> : valueDiff < 0 ? <TrendingDown className="h-5 w-5" /> : null}
                  <span className="font-bold">
                    {valueDiff > 0 ? '+' : ''}{percentChange}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {valueDiff > 0 ? '+' : ''}₹{(Math.abs(valueDiff) / 100000).toFixed(2)}L
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">{version2.version}</p>
                <p className="text-2xl font-bold text-gray-900">₹{(version2.value / 100000).toFixed(2)}L</p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* Version 1 */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{version1.version}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                    version1.status === 'current' ? 'bg-green-100 text-green-700 border-green-200' :
                    version1.status === 'superseded' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {version1.status}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Change Type</label>
                  <p className="text-sm text-gray-900 capitalize">{version1.changeType.replace(/-/g, ' ')}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Created By</label>
                  <p className="text-sm text-gray-900">{version1.createdBy}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(version1.createdDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Changes</label>
                  <ul className="space-y-1">
                    {version1.changes.map((change, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Version 2 */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">{version2.version}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">Status</label>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                    version2.status === 'current' ? 'bg-green-100 text-green-700 border-green-200' :
                    version2.status === 'superseded' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {version2.status}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">Change Type</label>
                  <p className="text-sm text-blue-900 capitalize">{version2.changeType.replace(/-/g, ' ')}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">Created By</label>
                  <p className="text-sm text-blue-900">{version2.createdBy}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">Date</label>
                  <p className="text-sm text-blue-900">
                    {new Date(version2.createdDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-2">Changes</label>
                  <ul className="space-y-1">
                    {version2.changes.map((change, idx) => (
                      <li key={idx} className="text-xs text-blue-900 flex items-start gap-1">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function VersionTimelineModal({ isOpen, onClose, quoteNumber, versions }: VersionTimelineModalProps) {
  if (!isOpen) return null

  const sortedVersions = [...versions].sort((a, b) =>
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Version Timeline</h2>
              <p className="text-sm opacity-90">{quoteNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-3">
              {sortedVersions.map((version, index) => (
                <div key={version.id} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center ${
                    version.status === 'current' ? 'bg-green-100 border-4 border-green-500' :
                    version.status === 'sent' ? 'bg-blue-100 border-4 border-blue-500' :
                    'bg-gray-100 border-4 border-gray-300'
                  }`}>
                    <span className="text-lg font-bold text-gray-900">{version.version}</span>
                  </div>

                  {/* Content Card */}
                  <div className={`bg-white rounded-lg border-2 p-3 ${
                    version.status === 'current' ? 'border-green-300 shadow-lg' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{version.version}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(version.createdDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        version.status === 'current' ? 'bg-green-100 text-green-700' :
                        version.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        version.status === 'superseded' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {version.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Created by: <span className="font-medium text-gray-900">{version.createdBy}</span></p>
                      <p className="text-lg font-bold text-green-700 mt-1">
                        ₹{(version.value / 100000).toFixed(2)}L
                      </p>
                    </div>

                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        version.changeType === 'price-increase' ? 'bg-red-100 text-red-700' :
                        version.changeType === 'price-decrease' ? 'bg-green-100 text-green-700' :
                        version.changeType === 'items-added' ? 'bg-blue-100 text-blue-700' :
                        version.changeType === 'items-removed' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {version.changeType.replace(/-/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Changes:</p>
                      <ul className="space-y-1">
                        {version.changes.map((change, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 mt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState({
    status: [] as string[],
    changeTypes: [] as string[],
    dateRange: { start: '', end: '' }
  })

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      status: [],
      changeTypes: [],
      dateRange: { start: '', end: '' }
    })
  }

  const toggleArrayFilter = (key: 'status' | 'changeTypes', value: string) => {
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
          <h2 className="text-xl font-bold">Filter Versions</h2>
          <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['current', 'sent', 'superseded', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('status', status)}
                  className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
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

          {/* Change Types */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Change Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'price-increase',
                'price-decrease',
                'items-added',
                'items-removed',
                'terms-updated'
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('changeTypes', type)}
                  className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                    filters.changeTypes.includes(type)
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
