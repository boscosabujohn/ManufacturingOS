'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Check,
  X
} from 'lucide-react';

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  matched: boolean;
  erp TransactionId?: string;
}

interface ERPTransaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  matched: boolean;
  bankTransactionId?: string;
}

export default function BankReconciliationPage() {
  const [selectedAccount, setSelectedAccount] = useState('BA001');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnmatchedOnly, setShowUnmatchedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'bank' | 'erp' | 'matched'>('bank');

  // Sample bank statement data
  const bankTransactions: BankTransaction[] = [
    {
      id: 'BT001',
      date: '2025-01-15',
      description: 'Customer Payment - ABC Corp',
      reference: 'NEFT/123456',
      debit: 0,
      credit: 500000,
      balance: 15750000,
      matched: true,
      erpTransactionId: 'ERP001'
    },
    {
      id: 'BT002',
      date: '2025-01-14',
      description: 'Vendor Payment - XYZ Suppliers',
      reference: 'RTGS/789012',
      debit: 250000,
      credit: 0,
      balance: 15250000,
      matched: true,
      erpTransactionId: 'ERP002'
    },
    {
      id: 'BT003',
      date: '2025-01-13',
      description: 'Bank Charges',
      reference: 'CHG/2025/01',
      debit: 1500,
      credit: 0,
      balance: 15500000,
      matched: false
    },
    {
      id: 'BT004',
      date: '2025-01-12',
      description: 'Interest Credit',
      reference: 'INT/2025/01',
      debit: 0,
      credit: 25000,
      balance: 15501500,
      matched: false
    },
    {
      id: 'BT005',
      date: '2025-01-11',
      description: 'Customer Payment - DEF Ltd',
      reference: 'IMPS/456789',
      debit: 0,
      credit: 750000,
      balance: 15476500,
      matched: false
    }
  ];

  // Sample ERP transactions
  const erpTransactions: ERPTransaction[] = [
    {
      id: 'ERP001',
      date: '2025-01-15',
      description: 'Payment Received - Invoice INV-2025-001',
      reference: 'PMT-001',
      debit: 0,
      credit: 500000,
      matched: true,
      bankTransactionId: 'BT001'
    },
    {
      id: 'ERP002',
      date: '2025-01-14',
      description: 'Payment Made - Bill BILL-2025-001',
      reference: 'PMT-002',
      debit: 250000,
      credit: 0,
      matched: true,
      bankTransactionId: 'BT002'
    },
    {
      id: 'ERP003',
      date: '2025-01-10',
      description: 'Payment Received - Invoice INV-2025-002',
      reference: 'PMT-003',
      debit: 0,
      credit: 300000,
      matched: false
    },
    {
      id: 'ERP004',
      date: '2025-01-09',
      description: 'Payment Made - Bill BILL-2025-002',
      reference: 'PMT-004',
      debit: 150000,
      credit: 0,
      matched: false
    }
  ];

  const matchedTransactions = bankTransactions.filter(t => t.matched);
  const unmatchedBankTxns = bankTransactions.filter(t => !t.matched);
  const unmatchedERPTxns = erpTransactions.filter(t => !t.matched);

  // Calculate statistics
  const bankBalance = 15750000;
  const erpBalance = 15476500;
  const difference = bankBalance - erpBalance;
  const matchedCount = matchedTransactions.length;
  const unmatchedCount = unmatchedBankTxns.length + unmatchedERPTxns.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const filteredBankTransactions = bankTransactions.filter(txn => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = !showUnmatchedOnly || !txn.matched;

    return matchesSearch && matchesFilter;
  });

  const filteredERPTransactions = erpTransactions.filter(txn => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = !showUnmatchedOnly || !txn.matched;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Bank Reconciliation</h1>
            <p className="text-gray-400">Reconcile bank statements with ERP transactions</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              Import Statement
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              Auto Match
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(bankBalance)}</div>
            <div className="text-blue-100 text-sm">Bank Statement Balance</div>
            <div className="mt-2 text-xs text-blue-100">As per bank records</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(erpBalance)}</div>
            <div className="text-green-100 text-sm">ERP Book Balance</div>
            <div className="mt-2 text-xs text-green-100">As per accounting records</div>
          </div>

          <div className={`bg-gradient-to-br ${
            Math.abs(difference) < 1000 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'
          } rounded-xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(difference)}</div>
            <div className={`${
              Math.abs(difference) < 1000 ? 'text-green-100' : 'text-orange-100'
            } text-sm`}>
              Difference
            </div>
            <div className={`mt-2 text-xs ${
              Math.abs(difference) < 1000 ? 'text-green-100' : 'text-orange-100'
            }`}>
              {Math.abs(difference) < 1000 ? 'Negligible' : 'Needs attention'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {matchedCount}/{matchedCount + unmatchedCount}
            </div>
            <div className="text-purple-100 text-sm">Matched Transactions</div>
            <div className="mt-2 text-xs text-purple-100">
              {((matchedCount / (matchedCount + unmatchedCount)) * 100).toFixed(0)}% complete
            </div>
          </div>
        </div>

        {/* Account & Period Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="BA001">HDFC Bank - 50200012345678</option>
                <option value="BA002">ICICI Bank - 012345678901</option>
                <option value="BA003">SBI - 30123456789</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="2025-01">January 2025</option>
                <option value="2024-12">December 2024</option>
                <option value="2024-11">November 2024</option>
              </select>
            </div>

            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnmatchedOnly}
                onChange={(e) => setShowUnmatchedOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              Show Unmatched Only
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'bank'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                Bank Statement ({unmatchedBankTxns.length} unmatched)
              </div>
            </button>
            <button
              onClick={() => setActiveTab('erp')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'erp'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                ERP Transactions ({unmatchedERPTxns.length} unmatched)
              </div>
            </button>
            <button
              onClick={() => setActiveTab('matched')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'matched'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Matched ({matchedCount})
              </div>
            </button>
          </div>

          {/* Bank Statement Tab */}
          {activeTab === 'bank' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded" />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reference</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Debit</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Credit</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Balance</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBankTransactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded" />
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{txn.description}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm font-mono">{txn.reference}</td>
                      <td className="px-6 py-4 text-right text-red-400 font-medium">
                        {txn.debit > 0 ? formatCurrency(txn.debit) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-medium">
                        {txn.credit > 0 ? formatCurrency(txn.credit) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {formatCurrency(txn.balance)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {txn.matched ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            Unmatched
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {!txn.matched && (
                            <>
                              <button className="p-2 hover:bg-green-600/20 rounded-lg transition-colors" title="Match">
                                <Check className="w-4 h-4 text-green-400" />
                              </button>
                              <button className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors" title="Create Entry">
                                <Plus className="w-4 h-4 text-blue-400" />
                              </button>
                            </>
                          )}
                          {txn.matched && (
                            <button className="p-2 hover:bg-red-600/20 rounded-lg transition-colors" title="Unmatch">
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ERP Transactions Tab */}
          {activeTab === 'erp' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded" />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reference</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Debit</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Credit</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredERPTransactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded" />
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{txn.description}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm font-mono">{txn.reference}</td>
                      <td className="px-6 py-4 text-right text-red-400 font-medium">
                        {txn.debit > 0 ? formatCurrency(txn.debit) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-medium">
                        {txn.credit > 0 ? formatCurrency(txn.credit) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {txn.matched ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            Unmatched
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {!txn.matched && (
                            <button className="p-2 hover:bg-green-600/20 rounded-lg transition-colors" title="Match">
                              <Check className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                          {txn.matched && (
                            <button className="p-2 hover:bg-red-600/20 rounded-lg transition-colors" title="Unmatch">
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Matched Transactions Tab */}
          {activeTab === 'matched' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Bank Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ERP Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Type</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedTransactions.map((txn) => {
                    const erpTxn = erpTransactions.find(e => e.id === txn.erpTransactionId);
                    return (
                      <tr key={txn.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-white text-sm">
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">{txn.reference}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">{erpTxn?.reference}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{txn.description}</td>
                        <td className={`px-6 py-4 text-right font-medium ${
                          txn.debit > 0 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {formatCurrency(txn.debit > 0 ? txn.debit : txn.credit)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            txn.debit > 0
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {txn.debit > 0 ? 'Payment' : 'Receipt'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-red-600/20 rounded-lg transition-colors" title="Unmatch">
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reconciliation Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Reconciliation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bank Statement Balance:</span>
                <span className="text-white font-medium">{formatCurrency(bankBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Less: Unmatched Credits</span>
                <span className="text-red-400 font-medium">({formatCurrency(776500)})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Add: Unmatched Debits</span>
                <span className="text-green-400 font-medium">{formatCurrency(1500)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                <span className="text-white font-semibold">Adjusted Bank Balance:</span>
                <span className="text-white font-bold">{formatCurrency(14975000)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ERP Book Balance:</span>
                <span className="text-white font-medium">{formatCurrency(erpBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Add: Unmatched Receipts</span>
                <span className="text-green-400 font-medium">{formatCurrency(300000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Less: Unmatched Payments</span>
                <span className="text-red-400 font-medium">({formatCurrency(150000)})</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                <span className="text-white font-semibold">Adjusted ERP Balance:</span>
                <span className="text-white font-bold">{formatCurrency(15626500)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
