'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  FileCheck,
  Shield,
  ArrowUpRight,
  BarChart3,
  TrendingUp
} from 'lucide-react'

interface TaxReturn {
  id: string
  returnType: 'GSTR-1' | 'GSTR-3B' | '24Q' | '26Q' | '27Q' | '27EQ' | 'Income Tax'
  period: string
  dueDate: string
  filingDate: string | null
  status: 'not_started' | 'in_progress' | 'filed' | 'acknowledged' | 'overdue'
  taxAmount: number
  interestPaid: number
  lateFee: number
  arn: string | null
  filedBy: string | null
}

interface TaxSummary {
  period: string
  gstCollected: number
  gstPaid: number
  tdsDeducted: number
  tdsDeposited: number
  incomeTaxPaid: number
  totalTaxLiability: number
}

export default function TaxReportsPage() {
  const [taxReturns] = useState<TaxReturn[]>([
    {
      id: 'RET-001',
      returnType: 'GSTR-1',
      period: 'September 2025',
      dueDate: '2025-10-11',
      filingDate: '2025-10-10',
      status: 'acknowledged',
      taxAmount: 1850000,
      interestPaid: 0,
      lateFee: 0,
      arn: 'AA2510100012345',
      filedBy: 'Tax Manager'
    },
    {
      id: 'RET-002',
      returnType: 'GSTR-3B',
      period: 'September 2025',
      dueDate: '2025-10-20',
      filingDate: '2025-10-18',
      status: 'acknowledged',
      taxAmount: 1750000,
      interestPaid: 0,
      lateFee: 0,
      arn: 'AB2510180023456',
      filedBy: 'Tax Manager'
    },
    {
      id: 'RET-003',
      returnType: '24Q',
      period: 'Q2 FY 2025-26',
      dueDate: '2025-10-31',
      filingDate: null,
      status: 'in_progress',
      taxAmount: 850000,
      interestPaid: 0,
      lateFee: 0,
      arn: null,
      filedBy: null
    },
    {
      id: 'RET-004',
      returnType: 'GSTR-1',
      period: 'October 2025',
      dueDate: '2025-11-11',
      filingDate: null,
      status: 'not_started',
      taxAmount: 1950000,
      interestPaid: 0,
      lateFee: 0,
      arn: null,
      filedBy: null
    },
    {
      id: 'RET-005',
      returnType: '26Q',
      period: 'Q2 FY 2025-26',
      dueDate: '2025-10-31',
      filingDate: null,
      status: 'not_started',
      taxAmount: 320000,
      interestPaid: 0,
      lateFee: 0,
      arn: null,
      filedBy: null
    }
  ])

  const [taxSummary] = useState<TaxSummary>({
    period: 'FY 2025-26 (Apr-Sep)',
    gstCollected: 11250000,
    gstPaid: 6850000,
    tdsDeducted: 2150000,
    tdsDeposited: 2150000,
    incomeTaxPaid: 4500000,
    totalTaxLiability: 15750000
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
      case 'not_started':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'filed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'acknowledged':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <FileText className="h-4 w-4" />
      case 'filed':
        return <Send className="h-4 w-4" />
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getReturnTypeColor = (type: string) => {
    if (type.startsWith('GSTR')) {
      return 'bg-blue-100 text-blue-700 border-blue-200'
    }
    if (type.includes('Q')) {
      return 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const filedReturns = taxReturns.filter(r => r.status === 'filed' || r.status === 'acknowledged').length
  const pendingReturns = taxReturns.filter(r => r.status === 'not_started' || r.status === 'in_progress').length
  const totalTaxFiled = taxReturns.filter(r => r.status === 'filed' || r.status === 'acknowledged')
    .reduce((sum, r) => sum + r.taxAmount, 0)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-3 py-2">
      <div className="w-full space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tax Reports & Filing</h1>
            <p className="text-gray-600 mt-1">Manage tax returns, compliance, and filing status</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md">
            <Download className="h-5 w-5" />
            Download Reports
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Returns</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{taxReturns.length}</p>
                <p className="text-xs text-blue-700 mt-1">This period</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Filed Returns</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{filedReturns}</p>
                <p className="text-xs text-green-700 mt-1">Acknowledged</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending Returns</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{pendingReturns}</p>
                <p className="text-xs text-orange-700 mt-1">Action required</p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Tax Filed</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(totalTaxFiled)}</p>
                <p className="text-xs text-purple-700 mt-1">This period</p>
              </div>
              <BarChart3 className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tax Summary */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold">Tax Summary</h2>
              <p className="text-green-100 mt-1">{taxSummary.period}</p>
            </div>
            <Shield className="h-12 w-12 text-green-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <p className="text-green-200 text-sm">GST Collected</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(taxSummary.gstCollected)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">GST Paid (ITC)</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(taxSummary.gstPaid)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Net GST</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(taxSummary.gstCollected - taxSummary.gstPaid)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">TDS Deducted</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(taxSummary.tdsDeducted)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Income Tax</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(taxSummary.incomeTaxPaid)}</p>
            </div>
            <div className="md:col-span-1">
              <p className="text-green-200 text-sm">Total Tax Liability</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(taxSummary.totalTaxLiability)}</p>
            </div>
          </div>
        </div>

        {/* Tax Returns List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tax Returns Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {taxReturns.map((taxReturn) => (
                <div key={taxReturn.id} className="p-5 rounded-lg border-2 border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{taxReturn.returnType}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getReturnTypeColor(taxReturn.returnType)}`}>
                            {taxReturn.returnType.startsWith('GSTR') ? 'GST' : taxReturn.returnType.includes('Q') ? 'TDS' : 'Income Tax'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{taxReturn.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(taxReturn.status)}`}>
                        {getStatusIcon(taxReturn.status)}
                        {taxReturn.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tax Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(taxReturn.taxAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Due Date</p>
                      <p className="font-semibold text-gray-900">{taxReturn.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Filing Date</p>
                      <p className="font-semibold text-gray-900">{taxReturn.filingDate || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ARN</p>
                      <p className="font-semibold text-gray-900 font-mono text-xs">{taxReturn.arn || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Filed By</p>
                      <p className="font-semibold text-gray-900">{taxReturn.filedBy || '-'}</p>
                    </div>
                  </div>

                  {taxReturn.status !== 'filed' && taxReturn.status !== 'acknowledged' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-medium flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        File Return
                      </button>
                    </div>
                  )}

                  {(taxReturn.status === 'filed' || taxReturn.status === 'acknowledged') && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Successfully filed and acknowledged</span>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Receipt
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">GST Compliance</h3>
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GSTR-1:</span>
                <span className="font-medium text-green-600">Filed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GSTR-3B:</span>
                <span className="font-medium text-green-600">Filed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next Due:</span>
                <span className="font-medium text-orange-600">11-Nov-2025</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">TDS Compliance</h3>
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">24Q (Salary):</span>
                <span className="font-medium text-yellow-600">In Progress</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">26Q (Others):</span>
                <span className="font-medium text-gray-600">Not Started</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next Due:</span>
                <span className="font-medium text-orange-600">31-Oct-2025</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Filing Stats</h3>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">On-time Filing:</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Late Fees Paid:</span>
                <span className="font-medium text-green-600">₹0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Returns:</span>
                <span className="font-medium text-orange-600">{pendingReturns}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
