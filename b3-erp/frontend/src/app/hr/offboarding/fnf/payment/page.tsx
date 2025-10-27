'use client';

import { useState, useMemo } from 'react';
import { Send, CheckCircle, Clock, IndianRupee, Download, AlertCircle } from 'lucide-react';

interface FNFPayment {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  lastWorkingDay: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  fnfComponents: {
    salary: number;
    leaveEncashment: number;
    gratuity: number;
    bonus?: number;
    reimbursements?: number;
  };
  deductions: {
    noticePeriodBuyout?: number;
    loanRecovery?: number;
    advanceRecovery?: number;
    otherDeductions?: number;
  };
  totalGross: number;
  totalDeductions: number;
  netPayable: number;
  status: 'pending' | 'approved' | 'processing' | 'paid';
  approvedBy?: string;
  approvedOn?: string;
  paidOn?: string;
  paymentMode: 'bank_transfer' | 'cheque';
  transactionRef?: string;
}

export default function FNFPaymentPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'processing' | 'paid'>('pending');

  const mockPayments: FNFPayment[] = [
    {
      id: 'FNF-PAY-001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      lastWorkingDay: '2025-12-14',
      bankDetails: {
        accountName: 'Rahul Sharma',
        accountNumber: '123456789012',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001234'
      },
      fnfComponents: {
        salary: -176539,
        leaveEncashment: 79603,
        gratuity: 173076,
        reimbursements: 5000
      },
      deductions: {
        noticePeriodBuyout: 180000,
        loanRecovery: 50000
      },
      totalGross: 257679,
      totalDeductions: 230000,
      netPayable: 27679,
      status: 'approved',
      approvedBy: 'Rajesh Patel - CFO',
      approvedOn: '2025-12-12',
      paymentMode: 'bank_transfer'
    },
    {
      id: 'FNF-PAY-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      lastWorkingDay: '2025-11-30',
      bankDetails: {
        accountName: 'Priya Singh',
        accountNumber: '987654321098',
        bankName: 'ICICI Bank',
        ifscCode: 'ICIC0009876'
      },
      fnfComponents: {
        salary: 123000,
        leaveEncashment: 126900,
        gratuity: 333461,
        bonus: 20000,
        reimbursements: 8000
      },
      deductions: {
        advanceRecovery: 15000
      },
      totalGross: 611361,
      totalDeductions: 15000,
      netPayable: 596361,
      status: 'paid',
      approvedBy: 'Rajesh Patel - CFO',
      approvedOn: '2025-11-28',
      paidOn: '2025-12-01',
      paymentMode: 'bank_transfer',
      transactionRef: 'TXN20251201123456'
    },
    {
      id: 'FNF-PAY-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      designation: 'Product Manager',
      department: 'Product',
      lastWorkingDay: '2025-10-31',
      bankDetails: {
        accountName: 'Amit Kumar',
        accountNumber: '456789012345',
        bankName: 'SBI',
        ifscCode: 'SBIN0004567'
      },
      fnfComponents: {
        salary: 192000,
        leaveEncashment: 150000,
        gratuity: 648461,
        bonus: 50000,
        reimbursements: 12000
      },
      deductions: {},
      totalGross: 1052461,
      totalDeductions: 0,
      netPayable: 1052461,
      status: 'paid',
      approvedBy: 'Rajesh Patel - CFO',
      approvedOn: '2025-10-28',
      paidOn: '2025-11-05',
      paymentMode: 'bank_transfer',
      transactionRef: 'TXN20251105987654'
    }
  ];

  const filteredPayments = useMemo(() => {
    return mockPayments.filter(payment => payment.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    pending: mockPayments.filter(p => p.status === 'pending').length,
    approved: mockPayments.filter(p => p.status === 'approved').length,
    processing: mockPayments.filter(p => p.status === 'processing').length,
    paid: mockPayments.filter(p => p.status === 'paid').length,
    totalPending: mockPayments
      .filter(p => p.status === 'pending' || p.status === 'approved')
      .reduce((sum, p) => sum + p.netPayable, 0),
    totalPaid: mockPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.netPayable, 0)
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    paid: 'bg-green-100 text-green-700'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    approved: <CheckCircle className="h-4 w-4" />,
    processing: <Send className="h-4 w-4" />,
    paid: <CheckCircle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FNF - Final Payment & Settlement</h1>
        <p className="text-sm text-gray-600 mt-1">Process and track full & final settlement payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Approved</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.approved}</p>
              <p className="text-xs text-blue-600 mt-1">{formatCurrency(stats.totalPending)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Processing</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.processing}</p>
            </div>
            <Send className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Paid</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.paid}</p>
              <p className="text-xs text-green-600 mt-1">{formatCurrency(stats.totalPaid)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setSelectedTab('approved')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'approved'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setSelectedTab('processing')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'processing'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Processing ({stats.processing})
        </button>
        <button
          onClick={() => setSelectedTab('paid')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'paid'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Paid ({stats.paid})
        </button>
      </div>

      <div className="space-y-4">
        {filteredPayments.map(payment => {
          return (
            <div key={payment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{payment.employeeName}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[payment.status]}`}>
                      <span className="inline-flex items-center gap-1">
                        {statusIcons[payment.status]}
                        {payment.status.toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{payment.designation} • {payment.department}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last Working Day: {new Date(payment.lastWorkingDay).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Bank Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Account Name</span>
                      <span className="font-medium text-gray-900">{payment.bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Account Number</span>
                      <span className="font-medium text-gray-900">{payment.bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bank Name</span>
                      <span className="font-medium text-gray-900">{payment.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IFSC Code</span>
                      <span className="font-medium text-gray-900">{payment.bankDetails.ifscCode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Mode</span>
                      <span className="font-medium text-blue-600">
                        {payment.paymentMode === 'bank_transfer' ? 'Bank Transfer' : 'Cheque'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">FNF Components (Credits)</h4>
                  <div className="space-y-2">
                    {payment.fnfComponents.salary > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Salary Component</span>
                        <span className="font-medium text-green-900">+{formatCurrency(payment.fnfComponents.salary)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Leave Encashment</span>
                      <span className="font-medium text-green-900">+{formatCurrency(payment.fnfComponents.leaveEncashment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Gratuity</span>
                      <span className="font-medium text-green-900">+{formatCurrency(payment.fnfComponents.gratuity)}</span>
                    </div>
                    {payment.fnfComponents.bonus && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Bonus</span>
                        <span className="font-medium text-green-900">+{formatCurrency(payment.fnfComponents.bonus)}</span>
                      </div>
                    )}
                    {payment.fnfComponents.reimbursements && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Reimbursements</span>
                        <span className="font-medium text-green-900">+{formatCurrency(payment.fnfComponents.reimbursements)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t border-green-300">
                      <span className="font-semibold text-green-900">Total Gross</span>
                      <span className="font-bold text-green-900">{formatCurrency(payment.totalGross)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {Object.keys(payment.deductions).length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-4">
                  <h4 className="font-semibold text-red-900 mb-3">Deductions</h4>
                  <div className="space-y-2">
                    {payment.deductions.noticePeriodBuyout && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Notice Period Buyout</span>
                        <span className="font-medium text-red-900">-{formatCurrency(payment.deductions.noticePeriodBuyout)}</span>
                      </div>
                    )}
                    {payment.deductions.loanRecovery && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Loan Recovery</span>
                        <span className="font-medium text-red-900">-{formatCurrency(payment.deductions.loanRecovery)}</span>
                      </div>
                    )}
                    {payment.deductions.advanceRecovery && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Advance Recovery</span>
                        <span className="font-medium text-red-900">-{formatCurrency(payment.deductions.advanceRecovery)}</span>
                      </div>
                    )}
                    {payment.deductions.otherDeductions && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Other Deductions</span>
                        <span className="font-medium text-red-900">-{formatCurrency(payment.deductions.otherDeductions)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t border-red-300">
                      <span className="font-semibold text-red-900">Total Deductions</span>
                      <span className="font-bold text-red-900">-{formatCurrency(payment.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              )}

              {payment.fnfComponents.salary < 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">Note on Salary Component</p>
                      <p className="text-xs text-yellow-800 mt-1">
                        Salary component shows as negative ({formatCurrency(payment.fnfComponents.salary)}) because notice period buyout
                        and other salary-related deductions exceeded the final month salary. Other FNF components (leave encashment, gratuity)
                        compensate for this.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`rounded-lg p-4 border-2 ${
                payment.netPayable >= 0
                  ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
                  : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Net Payable Amount (FNF)</p>
                    <p className={`text-3xl font-bold ${
                      payment.netPayable >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {payment.netPayable >= 0 ? '' : '-'}{formatCurrency(payment.netPayable)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {payment.netPayable >= 0
                        ? 'Amount to be credited to employee account'
                        : 'Amount recoverable from employee'}
                    </p>
                  </div>
                  <IndianRupee className={`h-12 w-12 ${
                    payment.netPayable >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>

              {payment.transactionRef && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-700">Transaction Reference</p>
                      <p className="text-sm font-semibold text-blue-900 mt-1">{payment.transactionRef}</p>
                    </div>
                    <span className="text-xs text-blue-700">
                      Paid on: {payment.paidOn && new Date(payment.paidOn).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {payment.approvedBy && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <p>Approved by: {payment.approvedBy} on {payment.approvedOn && new Date(payment.approvedOn).toLocaleDateString('en-IN')}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {payment.status === 'pending' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    <CheckCircle className="inline h-4 w-4 mr-2" />
                    Approve for Payment
                  </button>
                )}
                {payment.status === 'approved' && (
                  <>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
                      <Send className="inline h-4 w-4 mr-2" />
                      Initiate Payment
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                      <Download className="inline h-4 w-4 mr-2" />
                      Download FNF Statement
                    </button>
                  </>
                )}
                {payment.status === 'processing' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    <CheckCircle className="inline h-4 w-4 mr-2" />
                    Confirm Payment
                  </button>
                )}
                {payment.status === 'paid' && (
                  <>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                      <Download className="inline h-4 w-4 mr-2" />
                      Download Receipt
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                      <Download className="inline h-4 w-4 mr-2" />
                      Download FNF Statement
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
