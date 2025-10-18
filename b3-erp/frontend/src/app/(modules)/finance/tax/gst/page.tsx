'use client';

import React, { useState } from 'react';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Eye,
  Send
} from 'lucide-react';

interface GSTTransaction {
  id: string;
  date: string;
  invoiceNumber: string;
  partyName: string;
  gstin: string;
  transactionType: 'Sale' | 'Purchase' | 'Sales Return' | 'Purchase Return';
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  totalTax: number;
  totalAmount: number;
  gstRate: number;
  placeOfSupply: string;
  hsn?: string;
  returnPeriod: string;
  filed: boolean;
}

interface GSTReturn {
  id: string;
  returnType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-2A' | 'GSTR-9';
  period: string;
  dueDate: string;
  status: 'Draft' | 'Ready to File' | 'Filed' | 'Overdue';
  filedDate?: string;
  arn?: string;
  totalSales: number;
  totalPurchases: number;
  outputTax: number;
  inputTax: number;
  netTax: number;
}

export default function GSTManagementPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'returns'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('2025-01');

  // Sample GST transactions
  const gstTransactions: GSTTransaction[] = [
    {
      id: 'GT001',
      date: '2025-01-15',
      invoiceNumber: 'INV-2025-001',
      partyName: 'ABC Corp Private Limited',
      gstin: '29AAACC1234F1Z5',
      transactionType: 'Sale',
      taxableAmount: 1000000,
      cgst: 90000,
      sgst: 90000,
      igst: 0,
      cess: 0,
      totalTax: 180000,
      totalAmount: 1180000,
      gstRate: 18,
      placeOfSupply: 'Karnataka',
      hsn: '84212100',
      returnPeriod: '2025-01',
      filed: true
    },
    {
      id: 'GT002',
      date: '2025-01-14',
      invoiceNumber: 'PINV-2025-005',
      partyName: 'XYZ Suppliers Ltd',
      gstin: '27BBBDD5678G2Z6',
      transactionType: 'Purchase',
      taxableAmount: 500000,
      cgst: 45000,
      sgst: 45000,
      igst: 0,
      cess: 0,
      totalTax: 90000,
      totalAmount: 590000,
      gstRate: 18,
      placeOfSupply: 'Karnataka',
      hsn: '72071100',
      returnPeriod: '2025-01',
      filed: true
    },
    {
      id: 'GT003',
      date: '2025-01-13',
      invoiceNumber: 'INV-2025-002',
      partyName: 'DEF Industries',
      gstin: '06CCCEE9012H3Z7',
      transactionType: 'Sale',
      taxableAmount: 750000,
      cgst: 0,
      sgst: 0,
      igst: 135000,
      cess: 0,
      totalTax: 135000,
      totalAmount: 885000,
      gstRate: 18,
      placeOfSupply: 'Haryana',
      hsn: '84213100',
      returnPeriod: '2025-01',
      filed: false
    },
    {
      id: 'GT004',
      date: '2025-01-12',
      invoiceNumber: 'CN-2025-001',
      partyName: 'ABC Corp Private Limited',
      gstin: '29AAACC1234F1Z5',
      transactionType: 'Sales Return',
      taxableAmount: -50000,
      cgst: -4500,
      sgst: -4500,
      igst: 0,
      cess: 0,
      totalTax: -9000,
      totalAmount: -59000,
      gstRate: 18,
      placeOfSupply: 'Karnataka',
      hsn: '84212100',
      returnPeriod: '2025-01',
      filed: false
    },
    {
      id: 'GT005',
      date: '2025-01-11',
      invoiceNumber: 'INV-2025-003',
      partyName: 'GHI Enterprises',
      gstin: '33DDDFF3456I4Z8',
      transactionType: 'Sale',
      taxableAmount: 300000,
      cgst: 0,
      sgst: 0,
      igst: 54000,
      cess: 0,
      totalTax: 54000,
      totalAmount: 354000,
      gstRate: 18,
      placeOfSupply: 'Tamil Nadu',
      hsn: '84801000',
      returnPeriod: '2025-01',
      filed: false
    }
  ];

  // Sample GST returns
  const gstReturns: GSTReturn[] = [
    {
      id: 'GR001',
      returnType: 'GSTR-1',
      period: 'January 2025',
      dueDate: '2025-02-11',
      status: 'Ready to File',
      totalSales: 2000000,
      totalPurchases: 0,
      outputTax: 360000,
      inputTax: 0,
      netTax: 360000
    },
    {
      id: 'GR002',
      returnType: 'GSTR-3B',
      period: 'January 2025',
      dueDate: '2025-02-20',
      status: 'Draft',
      totalSales: 2000000,
      totalPurchases: 500000,
      outputTax: 360000,
      inputTax: 90000,
      netTax: 270000
    },
    {
      id: 'GR003',
      returnType: 'GSTR-1',
      period: 'December 2024',
      dueDate: '2025-01-11',
      status: 'Filed',
      filedDate: '2025-01-10',
      arn: 'AA290125123456A',
      totalSales: 1800000,
      totalPurchases: 0,
      outputTax: 324000,
      inputTax: 0,
      netTax: 324000
    },
    {
      id: 'GR004',
      returnType: 'GSTR-3B',
      period: 'December 2024',
      dueDate: '2025-01-20',
      status: 'Filed',
      filedDate: '2025-01-18',
      arn: 'AA290125654321B',
      totalSales: 1800000,
      totalPurchases: 450000,
      outputTax: 324000,
      inputTax: 81000,
      netTax: 243000
    }
  ];

  const filteredTransactions = gstTransactions.filter(txn => {
    const matchesSearch =
      txn.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.gstin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || txn.transactionType === typeFilter;
    const matchesPeriod = txn.returnPeriod === periodFilter;

    return matchesSearch && matchesType && matchesPeriod;
  });

  // Calculate statistics
  const totalOutputTax = gstTransactions
    .filter(t => ['Sale', 'Purchase Return'].includes(t.transactionType))
    .reduce((sum, t) => sum + t.totalTax, 0);

  const totalInputTax = gstTransactions
    .filter(t => ['Purchase', 'Sales Return'].includes(t.transactionType))
    .reduce((sum, t) => sum + Math.abs(t.totalTax), 0);

  const netGST = totalOutputTax - totalInputTax;
  const pendingReturns = gstReturns.filter(r => r.status === 'Ready to File' || r.status === 'Draft').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      Sale: 'bg-green-500/20 text-green-400',
      Purchase: 'bg-blue-500/20 text-blue-400',
      'Sales Return': 'bg-red-500/20 text-red-400',
      'Purchase Return': 'bg-orange-500/20 text-orange-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: 'bg-gray-500/20 text-gray-400',
      'Ready to File': 'bg-yellow-500/20 text-yellow-400',
      Filed: 'bg-green-500/20 text-green-400',
      Overdue: 'bg-red-500/20 text-red-400'
    };
    const icons = {
      Draft: Clock,
      'Ready to File': AlertCircle,
      Filed: CheckCircle,
      Overdue: AlertCircle
    };
    const Icon = icons[status as keyof typeof icons];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">GST Management</h1>
            <p className="text-gray-400">Manage GST transactions and returns</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              Import GSTR-2A
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              New Transaction
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalOutputTax)}</div>
            <div className="text-green-100 text-sm">Output Tax (Sales)</div>
            <div className="mt-2 text-xs text-green-100">GST collected</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalInputTax)}</div>
            <div className="text-blue-100 text-sm">Input Tax (Purchases)</div>
            <div className="mt-2 text-xs text-blue-100">GST paid</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 opacity-80" />
              {netGST >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(netGST)}</div>
            <div className="text-purple-100 text-sm">Net GST {netGST >= 0 ? 'Payable' : 'Refund'}</div>
            <div className="mt-2 text-xs text-purple-100">For current period</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 opacity-80" />
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{pendingReturns}</div>
            <div className="text-orange-100 text-sm">Pending Returns</div>
            <div className="mt-2 text-xs text-orange-100">To be filed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                GST Transactions ({filteredTransactions.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'returns'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                GST Returns ({gstReturns.length})
              </div>
            </button>
          </div>

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <>
              {/* Filters */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by invoice, party name, or GSTIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Types</option>
                      <option value="Sale">Sale</option>
                      <option value="Purchase">Purchase</option>
                      <option value="Sales Return">Sales Return</option>
                      <option value="Purchase Return">Purchase Return</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <select
                      value={periodFilter}
                      onChange={(e) => setPeriodFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="2025-01">January 2025</option>
                      <option value="2024-12">December 2024</option>
                      <option value="2024-11">November 2024</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Invoice</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Party Details</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Taxable Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">GST Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total Amount</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-white text-sm">
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white text-sm">{txn.invoiceNumber}</div>
                          <div className="text-xs text-gray-400">HSN: {txn.hsn || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm">{txn.partyName}</div>
                          <div className="text-xs text-gray-400 font-mono">{txn.gstin}</div>
                          <div className="text-xs text-gray-500">{txn.placeOfSupply}</div>
                        </td>
                        <td className="px-6 py-4">
                          {getTypeBadge(txn.transactionType)}
                        </td>
                        <td className="px-6 py-4 text-right text-white font-medium">
                          {txn.taxableAmount < 0 && '('}{formatCurrency(txn.taxableAmount)}{txn.taxableAmount < 0 && ')'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-green-400 font-medium">
                            {txn.totalTax < 0 && '('}{formatCurrency(txn.totalTax)}{txn.totalTax < 0 && ')'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {txn.gstRate}% ({txn.igst > 0 ? 'IGST' : 'CGST+SGST'})
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-medium">
                          {txn.totalAmount < 0 && '('}{formatCurrency(txn.totalAmount)}{txn.totalAmount < 0 && ')'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {txn.filed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Filed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Returns Tab */}
          {activeTab === 'returns' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Return Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Period</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total Sales</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Output Tax</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Input Tax</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Net Tax</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gstReturns.map((ret) => (
                    <tr key={ret.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{ret.returnType}</div>
                        {ret.arn && (
                          <div className="text-xs text-gray-400 font-mono mt-1">ARN: {ret.arn}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">{ret.period}</td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{new Date(ret.dueDate).toLocaleDateString()}</div>
                        {ret.filedDate && (
                          <div className="text-xs text-green-400 mt-1">
                            Filed: {new Date(ret.filedDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {formatCurrency(ret.totalSales)}
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-medium">
                        {formatCurrency(ret.outputTax)}
                      </td>
                      <td className="px-6 py-4 text-right text-blue-400 font-medium">
                        {formatCurrency(ret.inputTax)}
                      </td>
                      <td className="px-6 py-4 text-right text-purple-400 font-medium">
                        {formatCurrency(ret.netTax)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(ret.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-blue-400" />
                          </button>
                          {ret.status !== 'Filed' && (
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="File Return">
                              <Send className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-purple-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
