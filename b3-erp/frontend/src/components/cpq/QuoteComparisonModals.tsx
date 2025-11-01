'use client'

import { useState } from 'react'
import { X, Plus, Download, Eye, CheckCircle, TrendingUp, TrendingDown, Minus, Package, DollarSign, Calendar } from 'lucide-react'

interface QuoteForComparison {
  id: string
  quoteNumber: string
  version: string
  value: number
  discount: number
  items: number
  deliveryDays: number
  paymentTerms: string
  warranty: string
  validityDays: number
  createdDate: string
}

interface AddQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  availableQuotes: QuoteForComparison[]
  selectedQuotes: string[]
  onAdd: (quoteId: string) => void
}

interface ViewQuoteDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  quote: QuoteForComparison | null
}

interface ItemComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  quotes: QuoteForComparison[]
}

interface ExportComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  quotes: QuoteForComparison[]
  onExport: (format: 'pdf' | 'excel' | 'csv') => void
}

export function AddQuoteModal({ isOpen, onClose, availableQuotes, selectedQuotes, onAdd }: AddQuoteModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const filteredQuotes = availableQuotes.filter(q =>
    !selectedQuotes.includes(q.id) &&
    (q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
     q.version.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Add Quote to Comparison</h2>
            <p className="text-sm opacity-90">Select a quote to add to your comparison</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by quote number or version..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quote List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No available quotes to add</p>
              </div>
            ) : (
              filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => {
                    onAdd(quote.id)
                    onClose()
                  }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{quote.quoteNumber}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {quote.version}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>₹{(quote.value / 100000).toFixed(2)}L</span>
                        <span>•</span>
                        <span>{quote.discount}% discount</span>
                        <span>•</span>
                        <span>{quote.items} items</span>
                        <span>•</span>
                        <span>{new Date(quote.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export function ViewQuoteDetailsModal({ isOpen, onClose, quote }: ViewQuoteDetailsModalProps) {
  if (!isOpen || !quote) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Quote Details</h2>
            <p className="text-sm opacity-90">{quote.quoteNumber} {quote.version}</p>
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
                <DollarSign className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Quote Value</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">₹{(quote.value / 100000).toFixed(2)}L</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <p className="text-xs font-semibold text-orange-900">Discount</p>
              </div>
              <p className="text-2xl font-bold text-orange-900">{quote.discount}%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-purple-600" />
                <p className="text-xs font-semibold text-purple-900">Items</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{quote.items}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Delivery Timeline</span>
                <span className="text-sm font-bold text-gray-900">{quote.deliveryDays} days</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Payment Terms</span>
                <span className="text-sm font-bold text-gray-900">{quote.paymentTerms}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Warranty Period</span>
                <span className="text-sm font-bold text-gray-900">{quote.warranty}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quote Validity</span>
                <span className="text-sm font-bold text-gray-900">{quote.validityDays} days</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Created Date</span>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(quote.createdDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function ItemComparisonModal({ isOpen, onClose, quotes }: ItemComparisonModalProps) {
  if (!isOpen) return null

  // Mock item-level comparison data
  const items = [
    { name: 'Premium Kitchen Cabinet Set', q1: 'Included', q2: 'Included', q3: 'Standard Version' },
    { name: 'Smart Appliance Package', q1: 'Full Package', q2: 'Not Included', q3: 'Not Included' },
    { name: 'Granite Countertop', q1: 'Premium Grade', q2: 'Standard Grade', q3: 'Standard Grade' },
    { name: 'Installation Service', q1: 'Included', q2: 'Included', q3: 'Not Included' },
    { name: 'Extended Warranty', q1: '3 Years', q2: '2 Years', q3: '2 Years' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Item-Level Comparison</h2>
            <p className="text-sm opacity-90">Detailed comparison of items across quotes</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  {quotes.slice(0, 3).map((quote, idx) => (
                    <th key={quote.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-semibold ${
                          idx === 0 ? 'text-blue-600' : idx === 1 ? 'text-orange-600' : 'text-purple-600'
                        }`}>
                          {quote.version}
                        </span>
                        <span className="text-xs text-gray-500">{quote.quoteNumber}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-center text-sm text-blue-700 font-medium">{item.q1}</td>
                    <td className="px-4 py-3 text-center text-sm text-orange-700 font-medium">{item.q2}</td>
                    <td className="px-4 py-3 text-center text-sm text-purple-700 font-medium">{item.q3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> This shows a detailed comparison of included items, specifications, and variations across the selected quotes.
              Items marked as "Not Included" indicate they were removed or not part of that version.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function ExportComparisonModal({ isOpen, onClose, quotes, onExport }: ExportComparisonModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')

  if (!isOpen) return null

  const handleExport = () => {
    onExport(selectedFormat)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Export Comparison</h2>
            <p className="text-sm opacity-90">Choose export format</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Export Format</label>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">PDF Document</p>
                    <p className="text-xs text-gray-600 mt-0.5">Professional formatted comparison report</p>
                  </div>
                  {selectedFormat === 'pdf' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </div>
              </button>

              <button
                onClick={() => setSelectedFormat('excel')}
                className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all ${
                  selectedFormat === 'excel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Excel Spreadsheet</p>
                    <p className="text-xs text-gray-600 mt-0.5">Editable data with formulas and charts</p>
                  </div>
                  {selectedFormat === 'excel' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </div>
              </button>

              <button
                onClick={() => setSelectedFormat('csv')}
                className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all ${
                  selectedFormat === 'csv'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">CSV File</p>
                    <p className="text-xs text-gray-600 mt-0.5">Raw data for custom analysis</p>
                  </div>
                  {selectedFormat === 'csv' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </div>
              </button>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-700">
              <strong>Quotes to export:</strong> {quotes.length}
            </p>
            <p className="text-xs text-gray-700 mt-1">
              {quotes.map(q => `${q.quoteNumber} ${q.version}`).join(', ')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Comparison
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
