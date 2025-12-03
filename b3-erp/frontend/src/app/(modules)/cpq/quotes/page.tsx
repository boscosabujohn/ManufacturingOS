'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Copy,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Quote {
  id: string
  quoteNumber: string
  customerName: string
  projectName: string
  value: number
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  createdDate: string
  expiryDate: string
  validDays: number
}

export default function CPQQuotesPage() {
  const router = useRouter()

  const [quotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      quoteNumber: 'QT-2024-1234',
      customerName: 'Prestige Properties Ltd',
      projectName: 'Premium Modular Kitchen - Tower A',
      value: 2850000,
      status: 'sent',
      createdDate: '2024-10-15',
      expiryDate: '2024-11-15',
      validDays: 31
    },
    {
      id: 'Q-002',
      quoteNumber: 'QT-2024-1235',
      customerName: 'Urban Homes Pvt Ltd',
      projectName: 'L-Shaped Kitchen - Villa Project',
      value: 1750000,
      status: 'viewed',
      createdDate: '2024-10-18',
      expiryDate: '2024-11-18',
      validDays: 31
    },
    {
      id: 'Q-003',
      quoteNumber: 'QT-2024-1236',
      customerName: 'Elite Builders & Developers',
      projectName: 'Island Kitchen Package - Penthouse',
      value: 4200000,
      status: 'accepted',
      createdDate: '2024-10-10',
      expiryDate: '2024-11-10',
      validDays: 31
    },
    {
      id: 'Q-004',
      quoteNumber: 'QT-2024-1237',
      customerName: 'Skyline Constructions',
      projectName: 'Standard Modular - Apartment Block',
      value: 980000,
      status: 'draft',
      createdDate: '2024-10-19',
      expiryDate: '2024-11-19',
      validDays: 31
    },
    {
      id: 'Q-005',
      quoteNumber: 'QT-2024-1238',
      customerName: 'Modern Living Interiors',
      projectName: 'Straight Kitchen - Studio Units',
      value: 650000,
      status: 'rejected',
      createdDate: '2024-10-05',
      expiryDate: '2024-11-05',
      validDays: 31
    },
    {
      id: 'Q-006',
      quoteNumber: 'QT-2024-1239',
      customerName: 'Habitat Homes',
      projectName: 'Basic Kitchen Package',
      value: 485000,
      status: 'expired',
      createdDate: '2024-09-15',
      expiryDate: '2024-10-15',
      validDays: 30
    },
    {
      id: 'Q-007',
      quoteNumber: 'QT-2024-1240',
      customerName: 'Green Valley Builders',
      projectName: 'Compact Modular Kitchen',
      value: 425000,
      status: 'sent',
      createdDate: '2024-10-17',
      expiryDate: '2024-11-17',
      validDays: 31
    },
    {
      id: 'Q-008',
      quoteNumber: 'QT-2024-1241',
      customerName: 'Prestige Properties Ltd',
      projectName: 'Premium Island Kitchen - Tower B',
      value: 3650000,
      status: 'viewed',
      createdDate: '2024-10-16',
      expiryDate: '2024-11-16',
      validDays: 31
    }
  ])

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      sent: 'bg-blue-100 text-blue-700 border-blue-200',
      viewed: 'bg-purple-100 text-purple-700 border-purple-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      expired: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[status] || colors.draft
  }

  const getStatusIcon = (status: string) => {
    if (status === 'accepted') return <CheckCircle className="h-4 w-4" />
    if (status === 'rejected') return <XCircle className="h-4 w-4" />
    if (status === 'expired') return <AlertCircle className="h-4 w-4" />
    if (status === 'viewed') return <Eye className="h-4 w-4" />
    if (status === 'sent') return <Send className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  const totalValue = quotes.reduce((sum, q) => sum + q.value, 0)
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted')
  const acceptedValue = acceptedQuotes.reduce((sum, q) => sum + q.value, 0)
  const winRate = Math.round((acceptedQuotes.length / quotes.length) * 100)

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => router.push('/cpq/quotes/create')}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Quote
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Quotes</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{quotes.length}</p>
              <p className="text-xs text-blue-700 mt-1">All time quotes</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Accepted</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{acceptedQuotes.length}</p>
              <p className="text-xs text-green-700 mt-1">₹{(acceptedValue / 10000000).toFixed(2)}Cr value</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Win Rate</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{winRate}%</p>
              <p className="text-xs text-purple-700 mt-1">Conversion rate</p>
            </div>
            <CheckCircle className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Value</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                ₹{(totalValue / 10000000).toFixed(2)}Cr
              </p>
              <p className="text-xs text-orange-700 mt-1">Pipeline value</p>
            </div>
            <FileText className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium">
          All Quotes ({quotes.length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Draft ({quotes.filter(q => q.status === 'draft').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Sent ({quotes.filter(q => q.status === 'sent').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Accepted ({acceptedQuotes.length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Rejected ({quotes.filter(q => q.status === 'rejected').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search quotes by number, customer, or project..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Expires</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{quote.quoteNumber}</div>
                    <div className="text-xs text-gray-500">{quote.id}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{quote.customerName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{quote.projectName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{(quote.value / 100000).toFixed(2)}L
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {new Date(quote.createdDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {new Date(quote.expiryDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">({quote.validDays} days)</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View"
                       
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        aria-label="Edit"
                       
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        aria-label="Copy"
                       
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        aria-label="Send"
                       
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{quotes.length}</span> of{' '}
          <span className="font-medium">{quotes.length}</span> quotes
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
