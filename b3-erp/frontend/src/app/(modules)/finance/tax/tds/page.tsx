'use client';

import React, { useState } from 'react';
import {
  FileText,
  Users,
  TrendingDown,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Eye,
  Send
} from 'lucide-react';

interface TDSTransaction {
  id: string;
  date: string;
  paymentRef: string;
  deductee: string;
  pan: string;
  section: string;
  grossAmount: number;
  tdsRate: number;
  tdsAmount: number;
  netPayment: number;
  quarter: string;
  challanNumber?: string;
  challanDate?: string;
  deposited: boolean;
}

interface TDSReturn {
  id: string;
  quarter: string;
  formType: '24Q' | '26Q' | '27Q' | '27EQ';
  dueDate: string;
  status: 'Draft' | 'Ready to File' | 'Filed' | 'Overdue';
  filedDate?: string;
  acknowledgementNumber?: string;
  totalDeductions: number;
  totalDeposited: number;
  deducteeCount: number;
}

export default function TDSManagementPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'returns' | 'challans'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [quarterFilter, setQuarterFilter] = useState('Q4-2024-25');

  // Sample TDS transactions
  const tdsTransactions: TDSTransaction[] = [
    {
      id: 'TDS001',
      date: '2025-01-15',
      paymentRef: 'PAY-2025-001',
      deductee: 'ABC Contractors Pvt Ltd',
      pan: 'AAACC1234F',
      section: '194C - Contractors',
      grossAmount: 500000,
      tdsRate: 2.0,
      tdsAmount: 10000,
      netPayment: 490000,
      quarter: 'Q4-2024-25',
      challanNumber: 'CH2025010112345',
      challanDate: '2025-01-16',
      deposited: true
    },
    {
      id: 'TDS002',
      date: '2025-01-14',
      paymentRef: 'PAY-2025-002',
      deductee: 'XYZ Consultancy Services',
      pan: 'BBBDD5678G',
      section: '194J - Professional Services',
      grossAmount: 300000,
      tdsRate: 10.0,
      tdsAmount: 30000,
      netPayment: 270000,
      quarter: 'Q4-2024-25',
      deposited: false
    },
    {
      id: 'TDS003',
      date: '2025-01-13',
      paymentRef: 'PAY-2025-003',
      deductee: 'John Doe (Rent)',
      pan: 'CCCEE9012H',
      section: '194I - Rent',
      grossAmount: 100000,
      tdsRate: 10.0,
      tdsAmount: 10000,
      netPayment: 90000,
      quarter: 'Q4-2024-25',
      deposited: false
    },
    {
      id: 'TDS004',
      date: '2025-01-12',
      paymentRef: 'PAY-2025-004',
      deductee: 'DEF Transport Services',
      pan: 'DDDFF3456I',
      section: '194C - Contractors',
      grossAmount: 750000,
      tdsRate: 1.0,
      tdsAmount: 7500,
      netPayment: 742500,
      quarter: 'Q4-2024-25',
      challanNumber: 'CH2025011398765',
      challanDate: '2025-01-13',
      deposited: true
    },
    {
      id: 'TDS005',
      date: '2025-01-11',
      paymentRef: 'SAL-2025-001',
      deductee: 'Employee Salary (January)',
      pan: 'MULTIPLE',
      section: '192 - Salaries',
      grossAmount: 5000000,
      tdsRate: 10.0,
      tdsAmount: 500000,
      netPayment: 4500000,
      quarter: 'Q4-2024-25',
      deposited: false
    }
  ];

  // Sample TDS returns
  const tdsReturns: TDSReturn[] = [
    {
      id: 'TR001',
      quarter: 'Q4 FY 2024-25',
      formType: '24Q',
      dueDate: '2025-05-31',
      status: 'Draft',
      totalDeductions: 500000,
      totalDeposited: 500000,
      deducteeCount: 45
    },
    {
      id: 'TR002',
      quarter: 'Q4 FY 2024-25',
      formType: '26Q',
      dueDate: '2025-04-30',
      status: 'Ready to File',
      totalDeductions: 57500,
      totalDeposited: 17500,
      deducteeCount: 4
    },
    {
      id: 'TR003',
      quarter: 'Q3 FY 2024-25',
      formType: '24Q',
      dueDate: '2025-02-15',
      status: 'Filed',
      filedDate: '2025-02-10',
      acknowledgementNumber: 'ACK202402ABCD1234',
      totalDeductions: 480000,
      totalDeposited: 480000,
      deducteeCount: 42
    },
    {
      id: 'TR004',
      quarter: 'Q3 FY 2024-25',
      formType: '26Q',
      dueDate: '2025-01-31',
      status: 'Filed',
      filedDate: '2025-01-28',
      acknowledgementNumber: 'ACK202401EFGH5678',
      totalDeductions: 52000,
      totalDeposited: 52000,
      deducteeCount: 5
    }
  ];

  // Sample challans
  const challans = [
    {
      id: 'CH001',
      challanNumber: 'CH2025010112345',
      date: '2025-01-16',
      amount: 10000,
      section: '194C',
      bankName: 'HDFC Bank',
      status: 'Paid'
    },
    {
      id: 'CH002',
      challanNumber: 'CH2025011398765',
      date: '2025-01-13',
      amount: 7500,
      section: '194C',
      bankName: 'ICICI Bank',
      status: 'Paid'
    }
  ];

  const filteredTransactions = tdsTransactions.filter(txn => {
    const matchesSearch =
      txn.paymentRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.deductee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.pan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection = sectionFilter === 'all' || txn.section.includes(sectionFilter);
    const matchesQuarter = txn.quarter === quarterFilter;

    return matchesSearch && matchesSection && matchesQuarter;
  });

  // Calculate statistics
  const totalTDSDeducted = tdsTransactions.reduce((sum, t) => sum + t.tdsAmount, 0);
  const totalDeposited = tdsTransactions.filter(t => t.deposited).reduce((sum, t) => sum + t.tdsAmount, 0);
  const pendingDeposit = totalTDSDeducted - totalDeposited;
  const deducteeCount = new Set(tdsTransactions.map(t => t.pan)).size;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSectionBadge = (section: string) => {
    const sectionCode = section.split(' ')[0];
    const colors: { [key: string]: string } = {
      '192': 'bg-purple-500/20 text-purple-400',
      '194C': 'bg-blue-500/20 text-blue-400',
      '194J': 'bg-green-500/20 text-green-400',
      '194I': 'bg-orange-500/20 text-orange-400',
      '194H': 'bg-cyan-500/20 text-cyan-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[sectionCode] || 'bg-gray-500/20 text-gray-400'}`}>
        {section}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: 'bg-gray-500/20 text-gray-400',
      'Ready to File': 'bg-yellow-500/20 text-yellow-400',
      Filed: 'bg-green-500/20 text-green-400',
      Overdue: 'bg-red-500/20 text-red-400',
      Paid: 'bg-green-500/20 text-green-400'
    };
    const icons = {
      Draft: Clock,
      'Ready to File': AlertCircle,
      Filed: CheckCircle,
      Overdue: AlertCircle,
      Paid: CheckCircle
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">TDS Management</h1>
            <p className="text-gray-400">Manage TDS deductions and returns</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              New TDS Entry
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download Form 16A
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalTDSDeducted)}</div>
            <div className="text-purple-100 text-sm">Total TDS Deducted</div>
            <div className="mt-2 text-xs text-purple-100">For {quarterFilter}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalDeposited)}</div>
            <div className="text-green-100 text-sm">TDS Deposited</div>
            <div className="mt-2 text-xs text-green-100">
              {((totalDeposited / totalTDSDeducted) * 100).toFixed(0)}% of total
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 opacity-80" />
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(pendingDeposit)}</div>
            <div className="text-orange-100 text-sm">Pending Deposit</div>
            <div className="mt-2 text-xs text-orange-100">To be paid</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{deducteeCount}</div>
            <div className="text-blue-100 text-sm">Deductees</div>
            <div className="mt-2 text-xs text-blue-100">Unique PANs</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                TDS Transactions ({filteredTransactions.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'returns'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                TDS Returns ({tdsReturns.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('challans')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'challans'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Challans ({challans.length})
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
                        placeholder="Search by payment ref, deductee, or PAN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={sectionFilter}
                      onChange={(e) => setSectionFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Sections</option>
                      <option value="192">192 - Salaries</option>
                      <option value="194C">194C - Contractors</option>
                      <option value="194J">194J - Professional Services</option>
                      <option value="194I">194I - Rent</option>
                      <option value="194H">194H - Commission</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <select
                      value={quarterFilter}
                      onChange={(e) => setQuarterFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Q4-2024-25">Q4 FY 2024-25</option>
                      <option value="Q3-2024-25">Q3 FY 2024-25</option>
                      <option value="Q2-2024-25">Q2 FY 2024-25</option>
                      <option value="Q1-2024-25">Q1 FY 2024-25</option>
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment Ref</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Deductee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Section</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Gross Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">TDS Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Net Payment</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Challan</th>
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
                          <div className="font-medium text-white text-sm">{txn.paymentRef}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm">{txn.deductee}</div>
                          <div className="text-xs text-gray-400 font-mono">{txn.pan}</div>
                        </td>
                        <td className="px-6 py-4">
                          {getSectionBadge(txn.section)}
                          <div className="text-xs text-gray-400 mt-1">{txn.tdsRate}%</div>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-medium">
                          {formatCurrency(txn.grossAmount)}
                        </td>
                        <td className="px-6 py-4 text-right text-purple-400 font-medium">
                          {formatCurrency(txn.tdsAmount)}
                        </td>
                        <td className="px-6 py-4 text-right text-white font-medium">
                          {formatCurrency(txn.netPayment)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {txn.challanNumber ? (
                            <div>
                              <div className="text-white text-xs font-mono">{txn.challanNumber}</div>
                              <div className="text-xs text-gray-400">{txn.challanDate}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">Not deposited</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {txn.deposited ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Deposited
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
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
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Download Form 16A">
                              <Download className="w-4 h-4 text-green-400" />
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Form Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Quarter</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total Deductions</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total Deposited</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Deductees</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tdsReturns.map((ret) => (
                    <tr key={ret.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{ret.formType}</div>
                        {ret.acknowledgementNumber && (
                          <div className="text-xs text-gray-400 font-mono mt-1">ACK: {ret.acknowledgementNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">{ret.quarter}</td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{new Date(ret.dueDate).toLocaleDateString()}</div>
                        {ret.filedDate && (
                          <div className="text-xs text-green-400 mt-1">
                            Filed: {new Date(ret.filedDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-purple-400 font-medium">
                        {formatCurrency(ret.totalDeductions)}
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-medium">
                        {formatCurrency(ret.totalDeposited)}
                      </td>
                      <td className="px-6 py-4 text-center text-white font-medium">
                        {ret.deducteeCount}
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

          {/* Challans Tab */}
          {activeTab === 'challans' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Challan Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Section</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Bank</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challans.map((challan) => (
                    <tr key={challan.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-white font-mono text-sm">{challan.challanNumber}</td>
                      <td className="px-6 py-4 text-white text-sm">
                        {new Date(challan.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">{challan.section}</td>
                      <td className="px-6 py-4 text-right text-purple-400 font-medium">
                        {formatCurrency(challan.amount)}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">{challan.bankName}</td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(challan.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-blue-400" />
                          </button>
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
