'use client'

import { useState } from 'react'
import {
  Building2,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus
} from 'lucide-react'

interface IntercompanyTransaction {
  id: string
  transactionNumber: string
  transactionDate: string
  fromCompany: string
  toCompany: string
  transactionType: 'sale' | 'purchase' | 'transfer' | 'loan' | 'service'
  amount: number
  currency: string
  status: 'pending' | 'approved' | 'posted' | 'reconciled' | 'eliminated'
  description: string
  eliminationStatus: 'not_required' | 'pending' | 'completed'
}

export default function IntercompanyTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const [transactions] = useState<IntercompanyTransaction[]>([
    {
      id: 'IC-001',
      transactionNumber: 'IC-2025-001',
      transactionDate: '2025-10-15',
      fromCompany: 'Manufacturing Unit A',
      toCompany: 'Sales Division B',
      transactionType: 'transfer',
      amount: 5000000,
      currency: 'INR',
      status: 'reconciled',
      description: 'Finished goods transfer',
      eliminationStatus: 'completed'
    },
    {
      id: 'IC-002',
      transactionNumber: 'IC-2025-002',
      transactionDate: '2025-10-16',
      fromCompany: 'Head Office',
      toCompany: 'Regional Office - North',
      transactionType: 'loan',
      amount: 10000000,
      currency: 'INR',
      status: 'posted',
      description: 'Working capital loan',
      eliminationStatus: 'pending'
    },
    {
      id: 'IC-003',
      transactionNumber: 'IC-2025-003',
      transactionDate: '2025-10-17',
      fromCompany: 'IT Services Division',
      toCompany: 'Manufacturing Unit A',
      transactionType: 'service',
      amount: 1500000,
      currency: 'INR',
      status: 'approved',
      description: 'IT support services',
      eliminationStatus: 'pending'
    },
    {
      id: 'IC-004',
      transactionNumber: 'IC-2025-004',
      transactionDate: '2025-10-18',
      fromCompany: 'Sales Division B',
      toCompany: 'Manufacturing Unit A',
      transactionType: 'purchase',
      amount: 3500000,
      currency: 'INR',
      status: 'pending',
      description: 'Raw material purchase',
      eliminationStatus: 'not_required'
    }
  ])

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      txn.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.fromCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.toCompany.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    const matchesType = typeFilter === 'all' || txn.transactionType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'posted': return 'bg-green-100 text-green-700 border-green-200'
      case 'reconciled': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'eliminated': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      sale: 'bg-green-100 text-green-700',
      purchase: 'bg-blue-100 text-blue-700',
      transfer: 'bg-purple-100 text-purple-700',
      loan: 'bg-orange-100 text-orange-700',
      service: 'bg-cyan-100 text-cyan-700'
    }
    return colors[type as keyof typeof colors]
  }

  const totalTransactions = transactions.length
  const pendingElimination = transactions.filter(t => t.eliminationStatus === 'pending').length
  const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inter-company Transactions</h1>
            <p className="text-gray-600 mt-1">Manage transactions between group companies</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md">
            <Plus className="h-5 w-5" />
            New Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{totalTransactions}</p>
                <p className="text-xs text-blue-700 mt-1">This period</p>
              </div>
              <ArrowLeftRight className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalValue)}</p>
                <p className="text-xs text-green-700 mt-1">Aggregate amount</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending Elimination</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{pendingElimination}</p>
                <p className="text-xs text-orange-700 mt-1">Requires action</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Companies</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">6</p>
                <p className="text-xs text-purple-700 mt-1">Active entities</p>
              </div>
              <Building2 className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Types</option>
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
              <option value="transfer">Transfer</option>
              <option value="loan">Loan</option>
              <option value="service">Service</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="posted">Posted</option>
              <option value="reconciled">Reconciled</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((txn) => (
            <div key={txn.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <ArrowLeftRight className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{txn.transactionNumber}</h3>
                    <p className="text-sm text-gray-600">{txn.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(txn.status)}`}>
                        {txn.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(txn.transactionType)}`}>
                        {txn.transactionType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(txn.amount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-600 mb-1">From Company</p>
                  <p className="font-semibold text-blue-900">{txn.fromCompany}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-center">
                  <ArrowLeftRight className="h-6 w-6 text-purple-600" />
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-600 mb-1">To Company</p>
                  <p className="font-semibold text-green-900">{txn.toCompany}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(txn.transactionDate).toLocaleDateString('en-IN')}
                  </span>
                  <span>Elimination: {txn.eliminationStatus.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
