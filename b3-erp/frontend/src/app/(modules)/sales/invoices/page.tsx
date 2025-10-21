'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Plus,
  Search,
  Download,
  Send,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface InvoiceSummary {
  total: number;
  count: number;
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const summaryData = {
    pending: { total: 4567000, count: 12 },
    paid: { total: 18450000, count: 45 },
    overdue: { total: 2340000, count: 8 },
    creditNotes: { total: 456000, count: 3 }
  };

  const recentInvoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-1234',
      customerName: 'Tata Motors Limited',
      date: '2025-10-18',
      dueDate: '2025-11-18',
      amount: 1245000,
      status: 'paid',
      paymentDate: '2025-11-15'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-1235',
      customerName: 'Reliance Industries',
      date: '2025-10-19',
      dueDate: '2025-11-19',
      amount: 2340000,
      status: 'pending'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-1236',
      customerName: 'L&T Heavy Engineering',
      date: '2025-10-15',
      dueDate: '2025-11-15',
      amount: 856000,
      status: 'overdue'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2025-1237',
      customerName: 'Mahindra & Mahindra',
      date: '2025-10-20',
      dueDate: '2025-11-20',
      amount: 445000,
      status: 'pending'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2025-1238',
      customerName: 'Adani Ports',
      date: '2025-10-17',
      dueDate: '2025-11-17',
      amount: 675000,
      status: 'paid',
      paymentDate: '2025-11-16'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6">
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
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <Link
              href="/sales/invoices/create"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Invoice
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/sales/invoices/pending">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Invoices</p>
                  <p className="text-3xl font-bold mt-2">₹{(summaryData.pending.total / 100000).toFixed(1)}L</p>
                  <p className="text-yellow-100 text-xs mt-1">{summaryData.pending.count} invoices</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/sales/invoices/paid">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Paid Invoices</p>
                  <p className="text-3xl font-bold mt-2">₹{(summaryData.paid.total / 10000000).toFixed(2)}Cr</p>
                  <p className="text-green-100 text-xs mt-1">{summaryData.paid.count} invoices</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/sales/invoices/overdue">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Overdue Invoices</p>
                  <p className="text-3xl font-bold mt-2">₹{(summaryData.overdue.total / 100000).toFixed(1)}L</p>
                  <p className="text-red-100 text-xs mt-1">{summaryData.overdue.count} invoices</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <AlertCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/sales/invoices/credit-notes">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Credit Notes</p>
                  <p className="text-3xl font-bold mt-2">₹{(summaryData.creditNotes.total / 100000).toFixed(1)}L</p>
                  <p className="text-purple-100 text-xs mt-1">{summaryData.creditNotes.count} notes</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/sales/invoices/create"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create New Invoice</p>
                  <p className="text-sm text-gray-600">Generate a new invoice</p>
                </div>
              </Link>
              <Link
                href="/sales/invoices/pending"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Send className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Send Reminders</p>
                  <p className="text-sm text-gray-600">Send payment reminders</p>
                </div>
              </Link>
              <Link
                href="/sales/invoices/overdue"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review Overdue</p>
                  <p className="text-sm text-gray-600">Check overdue payments</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{invoice.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Monthly Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Total Invoiced</p>
              <p className="text-2xl font-bold text-gray-900">₹{((summaryData.pending.total + summaryData.paid.total + summaryData.overdue.total) / 10000000).toFixed(2)}Cr</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Collection Rate</p>
              <p className="text-2xl font-bold text-green-600">73%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Avg Payment Time</p>
              <p className="text-2xl font-bold text-gray-900">28 days</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600">₹{((summaryData.pending.total + summaryData.overdue.total) / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
