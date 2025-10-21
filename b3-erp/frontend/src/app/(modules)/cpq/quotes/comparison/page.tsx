'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GitCompare,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

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

export default function CPQQuotesComparisonPage() {
  const router = useRouter()

  const [selectedQuotes, setSelectedQuotes] = useState<string[]>(['QT-2024-1234-v3', 'QT-2024-1234-v2'])

  const quotes: QuoteForComparison[] = [
    {
      id: 'QT-2024-1234-v3',
      quoteNumber: 'QT-2024-1234',
      version: 'v3.0',
      value: 2850000,
      discount: 18,
      items: 12,
      deliveryDays: 45,
      paymentTerms: 'Net 30',
      warranty: '3 years',
      validityDays: 30,
      createdDate: '2024-10-18'
    },
    {
      id: 'QT-2024-1234-v2',
      quoteNumber: 'QT-2024-1234',
      version: 'v2.0',
      value: 2720000,
      discount: 15,
      items: 11,
      deliveryDays: 60,
      paymentTerms: 'Net 45',
      warranty: '2 years',
      validityDays: 30,
      createdDate: '2024-10-15'
    },
    {
      id: 'QT-2024-1234-v1',
      quoteNumber: 'QT-2024-1234',
      version: 'v1.0',
      value: 2650000,
      discount: 12,
      items: 10,
      deliveryDays: 60,
      paymentTerms: 'Net 45',
      warranty: '2 years',
      validityDays: 30,
      createdDate: '2024-10-12'
    }
  ]

  const compareValues = (val1: any, val2: any, type: 'number' | 'string' = 'number') => {
    if (type === 'number') {
      if (val1 > val2) return { icon: <TrendingUp className="h-4 w-4 text-green-600" />, color: 'text-green-600' }
      if (val1 < val2) return { icon: <TrendingDown className="h-4 w-4 text-red-600" />, color: 'text-red-600' }
      return { icon: <Minus className="h-4 w-4 text-gray-400" />, color: 'text-gray-600' }
    }
    if (val1 !== val2) return { icon: <AlertCircle className="h-4 w-4 text-blue-600" />, color: 'text-blue-600' }
    return { icon: <Minus className="h-4 w-4 text-gray-400" />, color: 'text-gray-600' }
  }

  const quote1 = quotes.find(q => q.id === selectedQuotes[0])
  const quote2 = quotes.find(q => q.id === selectedQuotes[1])

  if (!quote1 || !quote2) return null

  const valueDiff = quote1.value - quote2.value
  const discountDiff = quote1.discount - quote2.discount
  const itemsDiff = quote1.items - quote2.items
  const deliveryDiff = quote1.deliveryDays - quote2.deliveryDays

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <GitCompare className="h-6 w-6 text-blue-600" />
          Quote Comparison
        </h2>
        <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Select Winner
        </button>
      </div>

      {/* Quote Selectors */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Quote 1</label>
          <select
            value={selectedQuotes[0]}
            onChange={(e) => setSelectedQuotes([e.target.value, selectedQuotes[1]])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {quotes.map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.quoteNumber} {quote.version} - ₹{(quote.value / 100000).toFixed(2)}L
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <div className="p-3 bg-blue-50 rounded-full">
            <ArrowRight className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Quote 2</label>
          <select
            value={selectedQuotes[1]}
            onChange={(e) => setSelectedQuotes([selectedQuotes[0], e.target.value])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {quotes.map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.quoteNumber} {quote.version} - ₹{(quote.value / 100000).toFixed(2)}L
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs font-medium text-blue-600 mb-1">Value Difference</p>
          <p className={`text-xl font-bold ${valueDiff > 0 ? 'text-green-600' : valueDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {valueDiff > 0 ? '+' : ''}₹{Math.abs(valueDiff / 100000).toFixed(2)}L
          </p>
          <p className="text-xs text-blue-700 mt-1">{((valueDiff / quote2.value) * 100).toFixed(1)}% change</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-xs font-medium text-orange-600 mb-1">Discount Difference</p>
          <p className={`text-xl font-bold ${discountDiff > 0 ? 'text-red-600' : discountDiff < 0 ? 'text-green-600' : 'text-gray-600'}`}>
            {discountDiff > 0 ? '+' : ''}{discountDiff}%
          </p>
          <p className="text-xs text-orange-700 mt-1">{discountDiff > 0 ? 'Higher' : discountDiff < 0 ? 'Lower' : 'Same'} discount</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-xs font-medium text-purple-600 mb-1">Items Difference</p>
          <p className={`text-xl font-bold ${itemsDiff > 0 ? 'text-blue-600' : itemsDiff < 0 ? 'text-orange-600' : 'text-gray-600'}`}>
            {itemsDiff > 0 ? '+' : ''}{itemsDiff} items
          </p>
          <p className="text-xs text-purple-700 mt-1">{itemsDiff > 0 ? 'More' : itemsDiff < 0 ? 'Fewer' : 'Same'} items</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs font-medium text-green-600 mb-1">Delivery Difference</p>
          <p className={`text-xl font-bold ${deliveryDiff < 0 ? 'text-green-600' : deliveryDiff > 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {deliveryDiff > 0 ? '+' : ''}{deliveryDiff} days
          </p>
          <p className="text-xs text-green-700 mt-1">{deliveryDiff < 0 ? 'Faster' : deliveryDiff > 0 ? 'Slower' : 'Same'} delivery</p>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Attribute</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-5/24">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-blue-600">{quote1.version}</span>
                    <span className="text-xs text-gray-500">{new Date(quote1.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-1/12">Change</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-5/24">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-orange-600">{quote2.version}</span>
                    <span className="text-xs text-gray-500">{new Date(quote2.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Quote Value */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Quote Value</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-blue-600">₹{(quote1.value / 100000).toFixed(2)}L</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote1.value, quote2.value).icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-orange-600">₹{(quote2.value / 100000).toFixed(2)}L</span>
                </td>
              </tr>

              {/* Discount % */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Discount %</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-base font-semibold text-blue-600">{quote1.discount}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote1.discount, quote2.discount).icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-base font-semibold text-orange-600">{quote2.discount}%</span>
                </td>
              </tr>

              {/* Number of Items */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Number of Items</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-base font-semibold text-blue-600">{quote1.items}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote1.items, quote2.items).icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-base font-semibold text-orange-600">{quote2.items}</span>
                </td>
              </tr>

              {/* Delivery Timeline */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Delivery Timeline</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-base font-semibold text-blue-600">{quote1.deliveryDays} days</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote2.deliveryDays, quote1.deliveryDays).icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-base font-semibold text-orange-600">{quote2.deliveryDays} days</span>
                </td>
              </tr>

              {/* Payment Terms */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Payment Terms</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-blue-600">{quote1.paymentTerms}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote1.paymentTerms, quote2.paymentTerms, 'string').icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-orange-600">{quote2.paymentTerms}</span>
                </td>
              </tr>

              {/* Warranty Period */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Warranty Period</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-blue-600">{quote1.warranty}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote1.warranty, quote2.warranty, 'string').icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-orange-600">{quote2.warranty}</span>
                </td>
              </tr>

              {/* Quote Validity */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Quote Validity</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-blue-600">{quote1.validityDays} days</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {compareValues(quote1.validityDays, quote2.validityDays).icon}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-orange-600">{quote2.validityDays} days</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Recommendation:
        </h3>
        <p className="text-sm text-green-700">
          Based on the comparison, <strong>{quote1.version}</strong> offers better value with {quote1.discount}% discount, 
          {quote1.items} items, and {quote1.deliveryDays}-day delivery timeline at ₹{(quote1.value / 100000).toFixed(2)}L. 
          This represents a {((valueDiff / quote2.value) * 100).toFixed(1)}% increase in value with improved terms.
        </p>
      </div>

      {/* Comparison Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quote Comparison Benefits:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Side-by-Side Analysis:</strong> Compare all key attributes of different quote versions</li>
          <li><strong>Visual Indicators:</strong> Quickly identify increases, decreases, and unchanged values</li>
          <li><strong>Financial Impact:</strong> Understand the financial implications of each version</li>
          <li><strong>Version Tracking:</strong> See how quotes evolved through the negotiation process</li>
        </ul>
      </div>
    </div>
  )
}
