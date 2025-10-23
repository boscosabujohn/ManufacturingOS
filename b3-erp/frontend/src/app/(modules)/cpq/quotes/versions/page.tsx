'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GitBranch,
  Search,
  Filter,
  Download,
  Eye,
  Copy,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface QuoteVersion {
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

export default function CPQQuotesVersionsPage() {
  const router = useRouter()

  const [versions] = useState<QuoteVersion[]>([
    {
      id: 'QV-001',
      quoteNumber: 'QT-2024-1234',
      version: 'v3.0',
      customerName: 'Prestige Properties Ltd',
      value: 2850000,
      changes: ['Increased cabinet pricing by 5%', 'Added premium hardware option', 'Updated delivery terms'],
      changeType: 'price-increase',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-10-18',
      status: 'current'
    },
    {
      id: 'QV-002',
      quoteNumber: 'QT-2024-1234',
      version: 'v2.0',
      customerName: 'Prestige Properties Ltd',
      value: 2720000,
      changes: ['Removed custom lighting package', 'Applied 10% volume discount'],
      changeType: 'price-decrease',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-10-15',
      status: 'superseded'
    },
    {
      id: 'QV-003',
      quoteNumber: 'QT-2024-1234',
      version: 'v1.0',
      customerName: 'Prestige Properties Ltd',
      value: 2650000,
      changes: ['Initial quote created'],
      changeType: 'items-added',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-10-12',
      status: 'superseded'
    },
    {
      id: 'QV-004',
      quoteNumber: 'QT-2024-1235',
      version: 'v2.0',
      customerName: 'Urban Homes Pvt Ltd',
      value: 1750000,
      changes: ['Updated payment terms to Net 45', 'Changed warranty period to 3 years'],
      changeType: 'terms-updated',
      createdBy: 'Priya Sharma',
      createdDate: '2024-10-17',
      status: 'current'
    },
    {
      id: 'QV-005',
      quoteNumber: 'QT-2024-1235',
      version: 'v1.0',
      customerName: 'Urban Homes Pvt Ltd',
      value: 1750000,
      changes: ['Initial quote created'],
      changeType: 'items-added',
      createdBy: 'Priya Sharma',
      createdDate: '2024-10-14',
      status: 'superseded'
    },
    {
      id: 'QV-006',
      quoteNumber: 'QT-2024-1236',
      version: 'v4.0',
      customerName: 'Elite Builders & Developers',
      value: 4200000,
      changes: ['Added smart appliance package', 'Increased countertop quality', 'Added installation service'],
      changeType: 'items-added',
      createdBy: 'Amit Patel',
      createdDate: '2024-10-16',
      status: 'current'
    },
    {
      id: 'QV-007',
      quoteNumber: 'QT-2024-1236',
      version: 'v3.0',
      customerName: 'Elite Builders & Developers',
      value: 3950000,
      changes: ['Removed basic hardware', 'Applied customer-specific discount'],
      changeType: 'price-decrease',
      createdBy: 'Amit Patel',
      createdDate: '2024-10-13',
      status: 'superseded'
    }
  ])

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
    if (type === 'price-increase') return <TrendingUp className="h-4 w-4" />
    if (type === 'price-decrease') return <TrendingDown className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      sent: 'bg-blue-100 text-blue-700 border-blue-200',
      current: 'bg-green-100 text-green-700 border-green-200',
      superseded: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[status] || colors.draft
  }

  const totalVersions = versions.length
  const currentVersions = versions.filter(v => v.status === 'current').length
  const avgVersionsPerQuote = totalVersions / new Set(versions.map(v => v.quoteNumber)).size

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
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
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Versions</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalVersions}</p>
              <p className="text-xs text-blue-700 mt-1">All quote revisions</p>
            </div>
            <GitBranch className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Current Versions</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{currentVersions}</p>
              <p className="text-xs text-green-700 mt-1">Active quotes</p>
            </div>
            <FileText className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Revisions</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgVersionsPerQuote.toFixed(1)}</p>
              <p className="text-xs text-purple-700 mt-1">Per quote</p>
            </div>
            <GitBranch className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Unique Quotes</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {new Set(versions.map(v => v.quoteNumber)).size}
              </p>
              <p className="text-xs text-orange-700 mt-1">With versions</p>
            </div>
            <FileText className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium">
          All Versions ({totalVersions})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Current ({currentVersions})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Superseded ({versions.filter(v => v.status === 'superseded').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by quote number or customer..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Versions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote & Version</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Change Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changes Made</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {versions.map((version) => (
                <tr key={version.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{version.quoteNumber}</div>
                    <div className="text-xs text-gray-500">{version.version}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{version.customerName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full border ${getChangeTypeColor(version.changeType)}`}>
                      {getChangeTypeIcon(version.changeType)}
                      {version.changeType.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <ul className="text-xs text-gray-700 space-y-1">
                      {version.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{(version.value / 100000).toFixed(2)}L
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{version.createdBy}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {new Date(version.createdDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(version.status)}`}>
                      {version.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        aria-label="Copy"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Version Control Info */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Version Control Benefits:
        </h3>
        <ul className="text-xs text-purple-700 space-y-1">
          <li><strong>Change Tracking:</strong> Complete audit trail of all quote modifications</li>
          <li><strong>Version Comparison:</strong> Compare different versions to see what changed</li>
          <li><strong>Rollback Capability:</strong> Revert to previous versions if needed</li>
          <li><strong>Approval Workflow:</strong> Track which versions were sent and approved by customers</li>
        </ul>
      </div>
    </div>
  )
}
