'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  FileText,
  Calendar,
  IndianRupee,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';

interface CreditNote {
  id: string;
  creditNoteNumber: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'applied' | 'refunded';
  type: 'full_refund' | 'partial_refund' | 'discount_adjustment' | 'return' | 'defect';
  itemsCount: number;
  appliedDate?: string;
  refundMethod?: string;
  notes?: string;
}

export default function CreditNotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const creditNotes: CreditNote[] = [
    {
      id: '1',
      creditNoteNumber: 'CN-2025-001',
      invoiceNumber: 'INV-2025-1189',
      customerName: 'Tata Motors Limited',
      issueDate: '2025-10-15',
      amount: 125000,
      reason: 'Defective items returned',
      status: 'applied',
      type: 'return',
      itemsCount: 5,
      appliedDate: '2025-10-18',
      notes: '5 units returned due to quality issues'
    },
    {
      id: '2',
      creditNoteNumber: 'CN-2025-002',
      invoiceNumber: 'INV-2025-1195',
      customerName: 'Reliance Industries',
      issueDate: '2025-10-16',
      amount: 234000,
      reason: 'Billing error - Overcharged',
      status: 'approved',
      type: 'discount_adjustment',
      itemsCount: 1,
      notes: 'Quantity mismatch in original invoice'
    },
    {
      id: '3',
      creditNoteNumber: 'CN-2025-003',
      invoiceNumber: 'INV-2025-1201',
      customerName: 'Mahindra & Mahindra',
      issueDate: '2025-10-17',
      amount: 45000,
      reason: 'Promotional discount applied',
      status: 'pending',
      type: 'discount_adjustment',
      itemsCount: 3,
      notes: 'Volume discount as per agreement'
    },
    {
      id: '4',
      creditNoteNumber: 'CN-2025-004',
      invoiceNumber: 'INV-2025-1183',
      customerName: 'L&T Heavy Engineering',
      issueDate: '2025-10-12',
      amount: 567000,
      reason: 'Complete order cancellation',
      status: 'refunded',
      type: 'full_refund',
      itemsCount: 12,
      appliedDate: '2025-10-14',
      refundMethod: 'Bank Transfer',
      notes: 'Project cancelled by customer'
    },
    {
      id: '5',
      creditNoteNumber: 'CN-2025-005',
      invoiceNumber: 'INV-2025-1207',
      customerName: 'Bharat Heavy Electricals',
      issueDate: '2025-10-18',
      amount: 89000,
      reason: 'Damaged goods received',
      status: 'approved',
      type: 'defect',
      itemsCount: 2,
      notes: 'Damaged during transit - replacement sent'
    },
    {
      id: '6',
      creditNoteNumber: 'CN-2025-006',
      invoiceNumber: 'INV-2025-1190',
      customerName: 'Hindalco Industries',
      issueDate: '2025-10-14',
      amount: 156000,
      reason: 'Partial order return',
      status: 'applied',
      type: 'partial_refund',
      itemsCount: 4,
      appliedDate: '2025-10-16',
      notes: '4 items returned - specifications did not match'
    },
    {
      id: '7',
      creditNoteNumber: 'CN-2025-007',
      invoiceNumber: 'INV-2025-1212',
      customerName: 'JSW Steel',
      issueDate: '2025-10-19',
      amount: 78000,
      reason: 'Early payment discount',
      status: 'pending',
      type: 'discount_adjustment',
      itemsCount: 1,
      notes: '2% early payment discount as per terms'
    },
    {
      id: '8',
      creditNoteNumber: 'CN-2025-008',
      invoiceNumber: 'INV-2025-1204',
      customerName: 'Godrej Industries',
      issueDate: '2025-10-13',
      amount: 325000,
      reason: 'Quality issues - Full return',
      status: 'refunded',
      type: 'full_refund',
      itemsCount: 8,
      appliedDate: '2025-10-15',
      refundMethod: 'Check',
      notes: 'All items failed quality inspection'
    }
  ];

  const filteredCreditNotes = creditNotes.filter(note => {
    const matchesSearch =
      note.creditNoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || note.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = creditNotes.reduce((sum, note) => sum + note.amount, 0);
  const pendingAmount = creditNotes.filter(n => n.status === 'pending' || n.status === 'approved').reduce((sum, note) => sum + note.amount, 0);
  const approvedCount = creditNotes.filter(n => n.status === 'approved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'applied': return 'bg-green-100 text-green-700';
      case 'refunded': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'applied': return <CheckCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full_refund': return 'Full Refund';
      case 'partial_refund': return 'Partial Refund';
      case 'discount_adjustment': return 'Discount Adjustment';
      case 'return': return 'Return';
      case 'defect': return 'Defect/Damage';
      default: return type;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6">
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
              Export List
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Credit Note
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Credit Notes</p>
                <p className="text-3xl font-bold mt-2">₹{(totalAmount / 100000).toFixed(1)}L</p>
                <p className="text-purple-100 text-xs mt-1">{creditNotes.length} notes</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Processing</p>
                <p className="text-3xl font-bold mt-2">₹{(pendingAmount / 100000).toFixed(1)}L</p>
                <p className="text-yellow-100 text-xs mt-1">Awaiting action</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold mt-2">{approvedCount}</p>
                <p className="text-blue-100 text-xs mt-1">Ready to process</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8" />
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
                placeholder="Search by credit note, invoice, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="applied">Applied</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Credit Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCreditNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{note.creditNoteNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(note.status)}`}>
                        {getStatusIcon(note.status)}
                        {note.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Invoice: {note.invoiceNumber}</p>
                    <p className="text-gray-600 mt-1">{note.customerName}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 text-white">
                  <p className="text-purple-100 text-sm font-medium">Credit Amount</p>
                  <p className="text-3xl font-bold mt-1">₹{note.amount.toLocaleString('en-IN')}</p>
                  <p className="text-purple-100 text-xs mt-1">{note.itemsCount} items</p>
                </div>

                {/* Type and Reason */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Type</p>
                      <p className="text-sm text-blue-700">{getTypeLabel(note.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Reason</p>
                      <p className="text-sm text-blue-700">{note.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Issue Date</p>
                    <p className="font-medium text-gray-900">{new Date(note.issueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  {note.appliedDate && (
                    <div>
                      <p className="text-gray-600">Applied Date</p>
                      <p className="font-medium text-green-600">{new Date(note.appliedDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  )}
                </div>

                {/* Refund Method */}
                {note.refundMethod && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Refund Method:</strong> {note.refundMethod}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {note.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {note.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  {note.status === 'pending' && (
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                  )}
                  {note.status === 'approved' && (
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Process Refund
                    </button>
                  )}
                  {(note.status === 'applied' || note.status === 'refunded') && (
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  )}
                  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCreditNotes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credit Notes</h3>
            <p className="text-gray-600">No credit notes match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
