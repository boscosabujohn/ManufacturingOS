'use client'

import { useState } from 'react'
import { ShoppingCart, FileText, CreditCard, CheckCircle, Clock, XCircle, TrendingUp, DollarSign } from 'lucide-react'

interface ProcurementSync {
  id: string
  poNumber: string
  supplier: string
  orderDate: string
  items: number
  poAmount: number
  receivedAmount: number
  invoicedAmount: number
  paidAmount: number
  grStatus: 'pending' | 'partial' | 'completed'
  invoiceStatus: 'pending' | 'received' | 'matched' | 'disputed'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  syncStatus: 'synced' | 'pending' | 'failed'
  journalEntries: string[]
}

export default function ProcurementIntegrationPage() {
  const [syncData] = useState<ProcurementSync[]>([
    { id: '1', poNumber: 'PO-2025-1001', supplier: 'ABC Suppliers Ltd', orderDate: '2025-10-10', items: 5, poAmount: 500000, receivedAmount: 500000, invoicedAmount: 500000, paidAmount: 500000, grStatus: 'completed', invoiceStatus: 'matched', paymentStatus: 'paid', syncStatus: 'synced', journalEntries: ['JE-2025-501', 'JE-2025-502', 'JE-2025-503'] },
    { id: '2', poNumber: 'PO-2025-1002', supplier: 'XYZ Industries', orderDate: '2025-10-12', items: 3, poAmount: 750000, receivedAmount: 750000, invoicedAmount: 750000, paidAmount: 375000, grStatus: 'completed', invoiceStatus: 'matched', paymentStatus: 'partial', syncStatus: 'synced', journalEntries: ['JE-2025-504', 'JE-2025-505'] },
    { id: '3', poNumber: 'PO-2025-1003', supplier: 'Global Parts Inc', orderDate: '2025-10-15', items: 8, poAmount: 1200000, receivedAmount: 800000, invoicedAmount: 800000, paidAmount: 0, grStatus: 'partial', invoiceStatus: 'received', paymentStatus: 'unpaid', syncStatus: 'synced', journalEntries: ['JE-2025-506'] },
    { id: '4', poNumber: 'PO-2025-1004', supplier: 'Tech Solutions', orderDate: '2025-10-17', items: 2, poAmount: 300000, receivedAmount: 300000, invoicedAmount: 0, paidAmount: 0, grStatus: 'completed', invoiceStatus: 'pending', paymentStatus: 'unpaid', syncStatus: 'pending', journalEntries: [] },
    { id: '5', poNumber: 'PO-2025-1005', supplier: 'Premium Materials', orderDate: '2025-10-18', items: 6, poAmount: 950000, receivedAmount: 0, invoicedAmount: 0, paidAmount: 0, grStatus: 'pending', invoiceStatus: 'pending', paymentStatus: 'unpaid', syncStatus: 'synced', journalEntries: [] }
  ])

  const [integrationStats] = useState({
    totalPOs: 45,
    syncedPOs: 42,
    pendingPOs: 2,
    failedPOs: 1,
    totalPOValue: 12500000,
    totalReceived: 8750000,
    totalInvoiced: 7500000,
    totalPaid: 5250000,
    lastSyncTime: '2025-10-18 14:45:00'
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getGRStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'bg-green-100 text-green-700'
      case 'received': return 'bg-blue-100 text-blue-700'
      case 'disputed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procurement Integration</h1>
            <p className="text-gray-600 mt-1">Finance-Procurement module synchronization</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700">
            <CheckCircle className="h-5 w-5" />
            Sync All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="h-6 w-6 text-cyan-600" />
              <span className="text-sm text-gray-600">PO Value</span>
            </div>
            <p className="text-2xl font-bold text-cyan-600">{formatCurrency(integrationStats.totalPOValue)}</p>
            <p className="text-xs text-gray-500 mt-1">{integrationStats.totalPOs} purchase orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Received</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(integrationStats.totalReceived)}</p>
            <p className="text-xs text-gray-500 mt-1">{((integrationStats.totalReceived / integrationStats.totalPOValue) * 100).toFixed(0)}% of PO value</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Invoiced</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(integrationStats.totalInvoiced)}</p>
            <p className="text-xs text-gray-500 mt-1">{((integrationStats.totalInvoiced / integrationStats.totalPOValue) * 100).toFixed(0)}% of PO value</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-600">Paid</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(integrationStats.totalPaid)}</p>
            <p className="text-xs text-gray-500 mt-1">{((integrationStats.totalPaid / integrationStats.totalPOValue) * 100).toFixed(0)}% of PO value</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Purchase Order Integration Status</h2>
            <p className="text-sm text-gray-600 mt-1">Last sync: {integrationStats.lastSyncTime}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">PO Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">PO Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Received</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoiced</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paid</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">GR Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Invoice Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Payment Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syncData.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900">{po.poNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{po.supplier}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(po.poAmount)}</td>
                    <td className="px-6 py-4 text-sm text-green-600">{formatCurrency(po.receivedAmount)}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{formatCurrency(po.invoicedAmount)}</td>
                    <td className="px-6 py-4 text-sm text-purple-600">{formatCurrency(po.paidAmount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGRStatusColor(po.grStatus)}`}>
                          {po.grStatus.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(po.invoiceStatus)}`}>
                          {po.invoiceStatus.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(po.paymentStatus)}`}>
                          {po.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {po.syncStatus === 'synced' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : po.syncStatus === 'pending' ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Three-Way Matching Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Order
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• PO created in Procurement</li>
                <li>• Commitment entry in Finance</li>
                <li>• Budget check and reservation</li>
                <li>• Approval workflow tracking</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Goods Receipt
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• GRN recorded in Procurement</li>
                <li>• Dr. Inventory | Cr. GR/IR Clearing</li>
                <li>• Quality inspection status</li>
                <li>• Automatic PO matching</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Invoice & Payment
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Invoice matched to PO & GRN</li>
                <li>• Dr. GR/IR Clearing | Cr. Accounts Payable</li>
                <li>• Payment processing</li>
                <li>• Dr. Accounts Payable | Cr. Bank</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
