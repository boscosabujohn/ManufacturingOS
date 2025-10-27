'use client';

import { useState, useMemo } from 'react';
import { Send, CheckCircle, Clock, Download, FileText, Building2, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface EmployeeDisbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  netSalary: number;
  disbursementStatus: 'pending' | 'processing' | 'completed' | 'failed';
  disbursedOn?: string;
  transactionId?: string;
  failureReason?: string;
}

interface DisbursementBatch {
  id: string;
  monthYear: string;
  payPeriod: string;
  disbursementDate: string;
  employeeCount: number;
  totalAmount: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  status: 'draft' | 'approved' | 'processing' | 'completed';
  approvedBy?: string;
  approvedOn?: string;
  processedBy?: string;
  processedOn?: string;
  records: EmployeeDisbursement[];
}

export default function PayrollDisbursementPage() {
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockBatch: DisbursementBatch = {
    id: 'DISB-2025-11',
    monthYear: 'November 2025',
    payPeriod: '01-Nov-2025 to 30-Nov-2025',
    disbursementDate: '2025-11-30',
    employeeCount: 7,
    totalAmount: 2015790,
    pendingCount: 0,
    processingCount: 1,
    completedCount: 5,
    failedCount: 1,
    status: 'processing',
    approvedBy: 'Finance Head',
    approvedOn: '2025-11-29',
    processedBy: 'Finance Manager',
    processedOn: '2025-11-30',
    records: [
      {
        id: 'DISB-001',
        employeeId: 'EMP001',
        employeeName: 'Rajesh Kumar',
        designation: 'Senior Production Manager',
        department: 'Production',
        bankName: 'HDFC Bank',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        netSalary: 43902,
        disbursementStatus: 'completed',
        disbursedOn: '2025-11-30',
        transactionId: 'TXN202511300001'
      },
      {
        id: 'DISB-002',
        employeeId: 'EMP002',
        employeeName: 'Priya Sharma',
        designation: 'Quality Control Supervisor',
        department: 'Quality',
        bankName: 'ICICI Bank',
        accountNumber: '2345678901',
        ifscCode: 'ICIC0002345',
        netSalary: 31956,
        disbursementStatus: 'completed',
        disbursedOn: '2025-11-30',
        transactionId: 'TXN202511300002'
      },
      {
        id: 'DISB-003',
        employeeId: 'EMP003',
        employeeName: 'Amit Patel',
        designation: 'Production Operator',
        department: 'Production',
        bankName: 'SBI',
        accountNumber: '3456789012',
        ifscCode: 'SBIN0003456',
        netSalary: 19760,
        disbursementStatus: 'completed',
        disbursedOn: '2025-11-30',
        transactionId: 'TXN202511300003'
      },
      {
        id: 'DISB-004',
        employeeId: 'EMP004',
        employeeName: 'Neha Singh',
        designation: 'Maintenance Engineer',
        department: 'Maintenance',
        bankName: 'Axis Bank',
        accountNumber: '4567890123',
        ifscCode: 'UTIB0004567',
        netSalary: 30345,
        disbursementStatus: 'completed',
        disbursedOn: '2025-11-30',
        transactionId: 'TXN202511300004'
      },
      {
        id: 'DISB-005',
        employeeId: 'EMP005',
        employeeName: 'Vikram Desai',
        designation: 'Logistics Coordinator',
        department: 'Logistics',
        bankName: 'HDFC Bank',
        accountNumber: '5678901234',
        ifscCode: 'HDFC0005678',
        netSalary: 28163,
        disbursementStatus: 'processing',
        transactionId: 'TXN202511300005'
      },
      {
        id: 'DISB-006',
        employeeId: 'EMP006',
        employeeName: 'Kavita Mehta',
        designation: 'HR Executive',
        department: 'HR',
        bankName: 'ICICI Bank',
        accountNumber: '6789012345',
        ifscCode: 'ICIC0006789',
        netSalary: 27753,
        disbursementStatus: 'completed',
        disbursedOn: '2025-11-30',
        transactionId: 'TXN202511300006'
      },
      {
        id: 'DISB-007',
        employeeId: 'EMP007',
        employeeName: 'Sanjay Reddy',
        designation: 'Production Manager',
        department: 'Production',
        bankName: 'Kotak Mahindra Bank',
        accountNumber: '7890123456',
        ifscCode: 'KKBK0007890',
        netSalary: 45911,
        disbursementStatus: 'failed',
        failureReason: 'Invalid bank account - verification failed'
      }
    ]
  };

  const filteredRecords = useMemo(() => {
    return mockBatch.records.filter(record => {
      const matchesBank = selectedBank === 'all' || record.bankName === selectedBank;
      const matchesStatus = selectedStatus === 'all' || record.disbursementStatus === selectedStatus;
      return matchesBank && matchesStatus;
    });
  }, [selectedBank, selectedStatus]);

  const banks = ['all', 'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank'];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    processing: <Send className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
    failed: <AlertCircle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatCurrencyLakhs = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return 'XXXX' + accountNumber.slice(-4);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salary Disbursement</h1>
        <p className="text-sm text-gray-600 mt-1">Process and track salary payments to employee bank accounts</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{mockBatch.monthYear}</h2>
            <p className="text-sm text-gray-600 mt-1">Pay Period: {mockBatch.payPeriod}</p>
            <p className="text-xs text-gray-500 mt-1">Batch ID: {mockBatch.id}</p>
          </div>
          <div className="text-right">
            <span className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 block mb-2">
              {mockBatch.status.toUpperCase()}
            </span>
            <p className="text-xs text-gray-600">
              Disbursement Date: {new Date(mockBatch.disbursementDate).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockBatch.employeeCount}</p>
              </div>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-green-900 mt-1">{formatCurrencyLakhs(mockBatch.totalAmount)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Approved By</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{mockBatch.approvedBy || 'Pending'}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Processed On</p>
                <p className="text-xs font-bold text-gray-900 mt-1">
                  {mockBatch.processedOn && new Date(mockBatch.processedOn).toLocaleDateString('en-IN')}
                </p>
              </div>
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {mockBatch.approvedBy && mockBatch.approvedOn && (
          <div className="mt-4 pt-4 border-t border-purple-200 text-xs text-gray-600">
            <p>Approved by: {mockBatch.approvedBy} on {new Date(mockBatch.approvedOn).toLocaleDateString('en-IN')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{mockBatch.pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Processing</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{mockBatch.processingCount}</p>
            </div>
            <Send className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{mockBatch.completedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{mockBatch.failedCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Bank</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {banks.map(bank => (
                <option key={bank} value={bank}>
                  {bank === 'all' ? 'All Banks' : bank}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Download Bank File
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FileText className="h-4 w-4" />
            Payment Report
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{record.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {record.employeeId}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[record.disbursementStatus]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[record.disbursementStatus]}
                      {record.disbursementStatus.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {record.designation} • {record.department}
                </p>
                {record.failureReason && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-700 font-medium">⚠️ {record.failureReason}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(record.netSalary)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 text-sm">Bank Details</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-700">Bank Name</p>
                    <p className="text-sm font-medium text-blue-900">{record.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">Account Number</p>
                    <p className="text-sm font-medium text-blue-900">{maskAccountNumber(record.accountNumber)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">IFSC Code</p>
                    <p className="text-sm font-medium text-blue-900">{record.ifscCode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Send className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900 text-sm">Transaction Details</h4>
                </div>
                <div className="space-y-2">
                  {record.transactionId && (
                    <div>
                      <p className="text-xs text-purple-700">Transaction ID</p>
                      <p className="text-sm font-medium text-purple-900">{record.transactionId}</p>
                    </div>
                  )}
                  {record.disbursedOn && (
                    <div>
                      <p className="text-xs text-purple-700">Disbursed On</p>
                      <p className="text-sm font-medium text-purple-900">
                        {new Date(record.disbursedOn).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {!record.transactionId && record.disbursementStatus === 'pending' && (
                    <div className="text-center py-2">
                      <p className="text-xs text-purple-700">Awaiting processing</p>
                    </div>
                  )}
                  {!record.transactionId && record.disbursementStatus === 'processing' && (
                    <div className="text-center py-2">
                      <p className="text-xs text-purple-700">Transaction in progress...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900 text-sm">Payment Summary</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-green-700">Net Payable</span>
                    <span className="text-sm font-bold text-green-900">{formatCurrency(record.netSalary)}</span>
                  </div>
                  <div className="pt-2 border-t border-green-300">
                    <p className="text-xs text-green-700 mb-1">Payment Mode</p>
                    <p className="text-sm font-medium text-green-900">Bank Transfer (NEFT)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {record.disbursementStatus === 'pending' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <Send className="inline h-4 w-4 mr-2" />
                  Process Payment
                </button>
              )}
              {record.disbursementStatus === 'failed' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Retry Payment
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Update Bank Details
                  </button>
                </>
              )}
              {record.disbursementStatus === 'completed' && (
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                  <Download className="inline h-4 w-4 mr-2" />
                  Download Receipt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {mockBatch.completedCount === mockBatch.employeeCount && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">All disbursements completed!</h3>
              <p className="text-sm text-green-700 mt-1">
                {mockBatch.employeeCount} payments successfully processed for {mockBatch.monthYear}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
      )}

      {mockBatch.failedCount > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900">Action Required</h3>
              <p className="text-sm text-red-700 mt-1">
                {mockBatch.failedCount} payment{mockBatch.failedCount > 1 ? 's' : ''} failed. Please review and retry.
              </p>
            </div>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Review Failed Payments
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Disbursement Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Verify all bank account details before processing payments</li>
          <li>• Download bank file in the format required by your bank (NEFT/RTGS)</li>
          <li>• Ensure sufficient balance in company account before initiating transfer</li>
          <li>• Failed payments should be retried after correcting bank details</li>
          <li>• Payment receipts are generated automatically for completed transactions</li>
          <li>• Maintain transaction IDs for audit and reconciliation purposes</li>
        </ul>
      </div>
    </div>
  );
}
