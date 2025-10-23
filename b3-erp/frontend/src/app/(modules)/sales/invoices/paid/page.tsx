'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Calendar,
  IndianRupee,
  Eye,
  Download,
  Filter,
  TrendingUp
} from 'lucide-react';

interface PaidInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  paidDate: string;
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  daysEarly: number;
  itemsCount: number;
}

export default function PaidInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const paidInvoices: PaidInvoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-1234',
      customerName: 'Tata Motors Limited',
      invoiceDate: '2025-10-18',
      dueDate: '2025-11-18',
      paidDate: '2025-11-15',
      amount: 1245000,
      paymentMethod: 'Bank Transfer',
      transactionRef: 'TXN-2025-8901',
      daysEarly: 3,
      itemsCount: 15
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-1238',
      customerName: 'Adani Ports',
      invoiceDate: '2025-10-17',
      dueDate: '2025-11-17',
      paidDate: '2025-11-16',
      amount: 675000,
      paymentMethod: 'Bank Transfer',
      transactionRef: 'TXN-2025-8902',
      daysEarly: 1,
      itemsCount: 10
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-1225',
      customerName: 'Reliance Industries',
      invoiceDate: '2025-10-10',
      dueDate: '2025-11-10',
      paidDate: '2025-11-08',
      amount: 3450000,
      paymentMethod: 'RTGS',
      transactionRef: 'TXN-2025-8850',
      daysEarly: 2,
      itemsCount: 25
    },
    {
      id: '4',
      invoiceNumber: 'INV-2025-1220',
      customerName: 'JSW Steel',
      invoiceDate: '2025-10-08',
      dueDate: '2025-11-08',
      paidDate: '2025-11-07',
      amount: 2340000,
      paymentMethod: 'Check',
      transactionRef: 'CHQ-456789',
      daysEarly: 1,
      itemsCount: 18
    },
    {
      id: '5',
      invoiceNumber: 'INV-2025-1215',
      customerName: 'Mahindra & Mahindra',
      invoiceDate: '2025-10-05',
      dueDate: '2025-11-05',
      paidDate: '2025-11-05',
      amount: 890000,
      paymentMethod: 'Bank Transfer',
      transactionRef: 'TXN-2025-8820',
      daysEarly: 0,
      itemsCount: 12
    },
    {
      id: '6',
      invoiceNumber: 'INV-2025-1210',
      customerName: 'Bharat Heavy Electricals',
      invoiceDate: '2025-10-03',
      dueDate: '2025-11-03',
      paidDate: '2025-10-30',
      amount: 1560000,
      paymentMethod: 'NEFT',
      transactionRef: 'TXN-2025-8800',
      daysEarly: 4,
      itemsCount: 20
    },
    {
      id: '7',
      invoiceNumber: 'INV-2025-1205',
      customerName: 'Hindalco Industries',
      invoiceDate: '2025-10-01',
      dueDate: '2025-11-01',
      paidDate: '2025-10-28',
      amount: 725000,
      paymentMethod: 'Bank Transfer',
      transactionRef: 'TXN-2025-8780',
      daysEarly: 4,
      itemsCount: 8
    },
    {
      id: '8',
      invoiceNumber: 'INV-2025-1200',
      customerName: 'L&T Heavy Engineering',
      invoiceDate: '2025-09-28',
      dueDate: '2025-10-28',
      paidDate: '2025-10-25',
      amount: 1980000,
      paymentMethod: 'RTGS',
      transactionRef: 'TXN-2025-8750',
      daysEarly: 3,
      itemsCount: 16
    }
  ];

  const filteredInvoices = paidInvoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const avgPaymentTime = Math.round(
    paidInvoices.reduce((sum, inv) => {
      const daysToPayment = Math.floor(
        (new Date(inv.paidDate).getTime() - new Date(inv.invoiceDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + daysToPayment;
    }, 0) / paidInvoices.length
  );
  const paidEarly = paidInvoices.filter(inv => inv.daysEarly > 0).length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Inline Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors">
              Download Receipts
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Paid</p>
                <p className="text-3xl font-bold mt-2">₹{(totalAmount / 10000000).toFixed(2)}Cr</p>
                <p className="text-green-100 text-xs mt-1">{paidInvoices.length} invoices</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Payment Time</p>
                <p className="text-3xl font-bold mt-2">{avgPaymentTime}</p>
                <p className="text-blue-100 text-xs mt-1">days</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Paid Early</p>
                <p className="text-3xl font-bold mt-2">{paidEarly}</p>
                <p className="text-purple-100 text-xs mt-1">Before due date</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by invoice number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              <option value="2025-11">November 2025</option>
              <option value="2025-10">October 2025</option>
              <option value="2025-09">September 2025</option>
            </select>
          </div>
        </div>

        {/* Invoices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-gray-600 mt-1">{invoice.customerName}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                  <p className="text-green-100 text-sm font-medium">Paid Amount</p>
                  <p className="text-3xl font-bold mt-1">₹{invoice.amount.toLocaleString('en-IN')}</p>
                  <p className="text-green-100 text-xs mt-1">{invoice.itemsCount} items</p>
                </div>

                {/* Payment Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-green-700 font-medium">Payment Date</p>
                      <p className="text-green-900">{new Date(invoice.paidDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-medium">Method</p>
                      <p className="text-green-900">{invoice.paymentMethod}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-green-700 font-medium">Transaction Ref</p>
                      <p className="text-green-900 font-mono text-xs">{invoice.transactionRef}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                {invoice.daysEarly > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      ✓ Paid <strong>{invoice.daysEarly}</strong> {invoice.daysEarly === 1 ? 'day' : 'days'} early
                    </p>
                  </div>
                )}
                {invoice.daysEarly === 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">✓ Paid on due date</p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Invoice Date</p>
                    <p className="font-medium text-gray-900">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Receipt
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Paid Invoices</h3>
            <p className="text-gray-600">No invoices match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
