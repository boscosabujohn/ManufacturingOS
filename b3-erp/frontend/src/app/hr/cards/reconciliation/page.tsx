'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar, CreditCard, TrendingUp, FileText, Check, X } from 'lucide-react';

interface ReconciliationItem {
  id: string;
  month: string;
  year: number;
  cardNumber: string;
  cardHolder: string;
  employeeCode: string;
  department: string;
  statementAmount: number;
  recordedAmount: number;
  difference: number;
  transactions: number;
  reconciled: number;
  pending: number;
  discrepancies: number;
  status: 'completed' | 'in_progress' | 'pending' | 'issues';
  lastReconciledDate?: string;
  reconciledBy?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const mockReconciliation: ReconciliationItem[] = [
    {
      id: '1',
      month: 'October',
      year: 2025,
      cardNumber: '**** **** **** 4521',
      cardHolder: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      statementAmount: 45800,
      recordedAmount: 45800,
      difference: 0,
      transactions: 12,
      reconciled: 12,
      pending: 0,
      discrepancies: 0,
      status: 'completed',
      lastReconciledDate: '2025-10-25',
      reconciledBy: 'Kavita Sharma'
    },
    {
      id: '2',
      month: 'October',
      year: 2025,
      cardNumber: '**** **** **** 7823',
      cardHolder: 'Priya Sharma',
      employeeCode: 'EMP412',
      department: 'Marketing',
      statementAmount: 38500,
      recordedAmount: 36500,
      difference: 2000,
      transactions: 15,
      reconciled: 13,
      pending: 2,
      discrepancies: 1,
      status: 'issues',
      lastReconciledDate: '2025-10-24',
      reconciledBy: 'Kavita Sharma'
    },
    {
      id: '3',
      month: 'October',
      year: 2025,
      cardNumber: '**** **** **** 9234',
      cardHolder: 'Amit Patel',
      employeeCode: 'EMP287',
      department: 'Logistics',
      statementAmount: 52300,
      recordedAmount: 48100,
      difference: 4200,
      transactions: 18,
      reconciled: 14,
      pending: 4,
      discrepancies: 2,
      status: 'in_progress',
      lastReconciledDate: '2025-10-23'
    },
    {
      id: '4',
      month: 'October',
      year: 2025,
      cardNumber: '**** **** **** 6712',
      cardHolder: 'Sneha Reddy',
      employeeCode: 'EMP523',
      department: 'HR',
      statementAmount: 28900,
      recordedAmount: 0,
      difference: 28900,
      transactions: 8,
      reconciled: 0,
      pending: 8,
      discrepancies: 0,
      status: 'pending'
    },
    {
      id: '5',
      month: 'September',
      year: 2025,
      cardNumber: '**** **** **** 4521',
      cardHolder: 'Rajesh Kumar',
      employeeCode: 'EMP345',
      department: 'Sales',
      statementAmount: 62400,
      recordedAmount: 62400,
      difference: 0,
      transactions: 16,
      reconciled: 16,
      pending: 0,
      discrepancies: 0,
      status: 'completed',
      lastReconciledDate: '2025-09-28',
      reconciledBy: 'Kavita Sharma'
    },
    {
      id: '6',
      month: 'September',
      year: 2025,
      cardNumber: '**** **** **** 5634',
      cardHolder: 'Vikram Singh',
      employeeCode: 'EMP198',
      department: 'IT',
      statementAmount: 125600,
      recordedAmount: 125600,
      difference: 0,
      transactions: 9,
      reconciled: 9,
      pending: 0,
      discrepancies: 0,
      status: 'completed',
      lastReconciledDate: '2025-09-30',
      reconciledBy: 'Amit Shah'
    }
  ];

  const filteredReconciliation = mockReconciliation.filter(r => {
    const statusMatch = selectedStatus === 'all' || r.status === selectedStatus;
    const monthMatch = selectedMonth === 'all' || r.month === selectedMonth;
    return statusMatch && monthMatch;
  });

  const stats = useMemo(() => ({
    totalStatement: filteredReconciliation.reduce((sum, r) => sum + r.statementAmount, 0),
    totalRecorded: filteredReconciliation.reduce((sum, r) => sum + r.recordedAmount, 0),
    totalDifference: filteredReconciliation.reduce((sum, r) => sum + Math.abs(r.difference), 0),
    completed: mockReconciliation.filter(r => r.status === 'completed').length,
    pending: mockReconciliation.filter(r => r.status === 'pending').length,
    issues: mockReconciliation.filter(r => r.status === 'issues').length
  }), [filteredReconciliation]);

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    issues: 'bg-red-100 text-red-700'
  };

  const getReconciliationProgress = (reconciled: number, total: number) => {
    return Math.round((reconciled / total) * 100);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Card Reconciliation</h1>
        <p className="text-sm text-gray-600 mt-1">Reconcile card statements with recorded transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Statement Total</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{stats.totalStatement.toLocaleString('en-IN')}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Recorded Total</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">₹{stats.totalRecorded.toLocaleString('en-IN')}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Discrepancies</p>
              <p className="text-2xl font-bold text-red-900 mt-1">₹{stats.totalDifference.toLocaleString('en-IN')}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="issues">Issues</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Months</option>
              <option value="October">October 2025</option>
              <option value="September">September 2025</option>
              <option value="August">August 2025</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Reconciliation Items */}
      <div className="space-y-4">
        {filteredReconciliation.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.cardHolder}</h3>
                    <p className="text-sm text-gray-600">{item.cardNumber} • {item.employeeCode} • {item.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {item.month} {item.year}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                    {item.status === 'in_progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {item.difference === 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-sm font-semibold">Balanced</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-red-600 font-semibold mb-1">Difference</p>
                    <p className="text-2xl font-bold text-red-600">₹{Math.abs(item.difference).toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Statement Amount</p>
                <p className="text-lg font-bold text-gray-900">₹{item.statementAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Recorded Amount</p>
                <p className="text-lg font-bold text-gray-900">₹{item.recordedAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Transactions</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900">{item.transactions}</p>
                  <span className="text-xs text-gray-500">
                    ({item.reconciled} reconciled)
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        getReconciliationProgress(item.reconciled, item.transactions) === 100
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${getReconciliationProgress(item.reconciled, item.transactions)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {getReconciliationProgress(item.reconciled, item.transactions)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-600 uppercase font-medium">Reconciled</p>
                </div>
                <p className="text-2xl font-bold text-green-900">{item.reconciled}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-xs text-yellow-600 uppercase font-medium">Pending</p>
                </div>
                <p className="text-2xl font-bold text-yellow-900">{item.pending}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <X className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-red-600 uppercase font-medium">Discrepancies</p>
                </div>
                <p className="text-2xl font-bold text-red-900">{item.discrepancies}</p>
              </div>
            </div>

            {item.lastReconciledDate && (
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Last reconciled: {new Date(item.lastReconciledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {item.reconciledBy && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>By: {item.reconciledBy}</span>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {item.status === 'completed' ? (
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Report
                </button>
              ) : (
                <>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Start Reconciliation
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    View Transactions
                  </button>
                  {item.discrepancies > 0 && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                      Resolve Issues
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
