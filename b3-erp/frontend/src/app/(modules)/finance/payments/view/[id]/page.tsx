'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Download,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Building,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  TrendingUp,
  RefreshCw,
  Ban,
  Receipt,
  Activity,
  Bell,
  Check,
  X,
  Loader,
  ArrowRight,
  Info,
  Banknote,
  Smartphone,
  Landmark,
} from 'lucide-react';

interface Payment {
  id: string;
  paymentNumber: string;
  paymentType: 'received' | 'made';
  invoiceNumber: string;
  invoiceId: string;
  partyType: 'customer' | 'vendor';
  partyName: string;
  partyId: string;
  partyEmail: string;
  partyPhone: string;
  partyAddress: string;
  partyGSTIN: string;
  paymentDate: string;
  transactionDate: string;
  dueDate: string;
  invoiceAmount: number;
  invoicePaidAmount: number;
  invoiceBalanceAmount: number;
  paymentAmount: number;
  transactionFee: number;
  netAmount: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'upi' | 'credit_card' | 'debit_card' | 'check' | 'cash' | 'neft' | 'rtgs' | 'imps';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  referenceNumber: string;
  transactionId: string;
  bankName: string;
  bankAccountNumber: string;
  bankIFSC: string;
  bankBranch: string;
  upiId?: string;
  cardLastFourDigits?: string;
  cardType?: string;
  checkNumber?: string;
  checkDate?: string;
  reconciliationStatus: 'not_reconciled' | 'reconciled' | 'partially_reconciled';
  reconciledBy?: string;
  reconciledDate?: string;
  processedBy: string;
  approvedBy?: string;
  notes: string;
  internalNotes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  performedBy: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

const mockPayment: Payment = {
  id: 'PAY-001',
  paymentNumber: 'PAY-2025-001',
  paymentType: 'received',
  invoiceNumber: 'INV-2025-001',
  invoiceId: 'INV-001',
  partyType: 'customer',
  partyName: 'Hotel Paradise Ltd',
  partyId: 'CUST-001',
  partyEmail: 'accounts@hotelparadise.com',
  partyPhone: '+91 98765 43210',
  partyAddress: '123, MG Road, Bangalore, Karnataka - 560001',
  partyGSTIN: '29AABCT1332L1Z5',
  paymentDate: '2025-10-15',
  transactionDate: '2025-10-15',
  dueDate: '2025-10-31',
  invoiceAmount: 172500,
  invoicePaidAmount: 172500,
  invoiceBalanceAmount: 0,
  paymentAmount: 172500,
  transactionFee: 172.5,
  netAmount: 172327.5,
  currency: 'INR',
  paymentMethod: 'neft',
  status: 'completed',
  referenceNumber: 'NEFT-20251015-HP001',
  transactionId: 'HDFC2025101512345678',
  bankName: 'HDFC Bank',
  bankAccountNumber: '50200012345678',
  bankIFSC: 'HDFC0001234',
  bankBranch: 'MG Road, Bangalore',
  reconciliationStatus: 'reconciled',
  reconciledBy: 'Sarah Finance',
  reconciledDate: '2025-10-16',
  processedBy: 'Finance Team',
  approvedBy: 'John Manager',
  notes: 'Full payment received against INV-2025-001',
  internalNotes: 'Payment cleared on same day. Customer is regular and reliable.',
  attachments: ['receipt_001.pdf', 'bank_statement_oct15.pdf'],
  createdAt: '2025-10-15T10:30:00',
  updatedAt: '2025-10-16T14:20:00',
};

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2025-10-16T14:20:00',
    action: 'Payment Reconciled',
    description: 'Payment reconciled with bank statement',
    performedBy: 'Sarah Finance',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2025-10-15T16:45:00',
    action: 'Status Updated',
    description: 'Payment status changed from Processing to Completed',
    performedBy: 'System',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2025-10-15T16:30:00',
    action: 'Payment Confirmation',
    description: 'Bank confirmation received for NEFT transaction',
    performedBy: 'Banking System',
    status: 'info',
  },
  {
    id: '4',
    timestamp: '2025-10-15T12:00:00',
    action: 'Notification Sent',
    description: 'Payment acknowledgment email sent to customer',
    performedBy: 'Email System',
    status: 'info',
  },
  {
    id: '5',
    timestamp: '2025-10-15T11:30:00',
    action: 'Payment Approved',
    description: 'Payment approved by manager',
    performedBy: 'John Manager',
    status: 'success',
  },
  {
    id: '6',
    timestamp: '2025-10-15T10:45:00',
    action: 'Status Updated',
    description: 'Payment status changed from Pending to Processing',
    performedBy: 'System',
    status: 'info',
  },
  {
    id: '7',
    timestamp: '2025-10-15T10:30:00',
    action: 'Payment Initiated',
    description: 'Payment record created for INV-2025-001',
    performedBy: 'Finance Team',
    status: 'success',
  },
];

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: Clock,
    label: 'Pending',
  },
  processing: {
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Loader,
    label: 'Processing',
  },
  completed: {
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: CheckCircle,
    label: 'Completed',
  },
  failed: {
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: XCircle,
    label: 'Failed',
  },
  refunded: {
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: RefreshCw,
    label: 'Refunded',
  },
};

const methodConfig = {
  bank_transfer: { label: 'Bank Transfer', icon: Building },
  upi: { label: 'UPI', icon: Smartphone },
  credit_card: { label: 'Credit Card', icon: CreditCard },
  debit_card: { label: 'Debit Card', icon: CreditCard },
  check: { label: 'Check', icon: Receipt },
  cash: { label: 'Cash', icon: Banknote },
  neft: { label: 'NEFT', icon: Landmark },
  rtgs: { label: 'RTGS', icon: Landmark },
  imps: { label: 'IMPS', icon: Smartphone },
};

const reconStatusConfig = {
  not_reconciled: {
    color: 'bg-yellow-100 text-yellow-700',
    label: 'Not Reconciled',
  },
  reconciled: {
    color: 'bg-green-100 text-green-700',
    label: 'Reconciled',
  },
  partially_reconciled: {
    color: 'bg-blue-100 text-blue-700',
    label: 'Partially Reconciled',
  },
};

export default function PaymentViewPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'activity'>('overview');
  const [payment] = useState<Payment>(mockPayment);
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);

  const StatusIcon = statusConfig[payment.status].icon;
  const MethodIcon = methodConfig[payment.paymentMethod].icon;

  const getProgressSteps = () => {
    const steps = [
      { label: 'Initiated', status: 'completed' },
      { label: 'Processing', status: payment.status === 'pending' ? 'pending' : 'completed' },
      {
        label: payment.status === 'failed' ? 'Failed' : payment.status === 'refunded' ? 'Refunded' : 'Completed',
        status:
          payment.status === 'completed'
            ? 'completed'
            : payment.status === 'refunded'
            ? 'completed'
            : payment.status === 'failed'
            ? 'failed'
            : 'pending',
      },
    ];
    return steps;
  };

  const progressSteps = getProgressSteps();

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/finance/payments')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payments
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{payment.paymentNumber}</h1>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusConfig[payment.status].color}`}
                >
                  <StatusIcon className="h-4 w-4 inline mr-1" />
                  {statusConfig[payment.status].label}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    payment.paymentType === 'received' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {payment.paymentType === 'received' ? 'Payment Received' : 'Payment Made'}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                {payment.partyType === 'customer' ? 'Customer' : 'Vendor'}: {payment.partyName}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Payment Date: {payment.paymentDate}
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Invoice: {payment.invoiceNumber}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push(`/finance/payments/edit/${payment.id}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Payment Amount</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {payment.currency} {payment.paymentAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Transaction Fee</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {payment.currency} {payment.transactionFee.toLocaleString('en-IN')}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Net Amount</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {payment.currency} {payment.netAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <Banknote className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Payment Date</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{payment.paymentDate}</p>
              <p className="text-xs text-purple-600 mt-1">Transaction: {payment.transactionDate}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
        <div className="flex items-center justify-between">
          {progressSteps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-100 border-2 border-green-500'
                      : step.status === 'failed'
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : step.status === 'failed' ? (
                    <X className="h-6 w-6 text-red-600" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  )}
                </div>
                <p
                  className={`text-sm font-medium mt-2 ${
                    step.status === 'completed'
                      ? 'text-green-600'
                      : step.status === 'failed'
                      ? 'text-red-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < progressSteps.length - 1 && (
                <ArrowRight
                  className={`h-6 w-6 mx-4 ${
                    progressSteps[index + 1].status === 'completed' ? 'text-green-500' : 'text-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'details', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Party Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              {payment.partyType === 'customer' ? 'Customer' : 'Vendor'} Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{payment.partyName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium text-gray-900">{payment.partyId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GSTIN</p>
                  <p className="font-medium text-gray-900">{payment.partyGSTIN}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </p>
                <p className="font-medium text-blue-600">{payment.partyEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </p>
                <p className="font-medium text-gray-900">{payment.partyPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Address
                </p>
                <p className="font-medium text-gray-900">{payment.partyAddress}</p>
              </div>
            </div>
          </div>

          {/* Invoice Reference */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Invoice Reference
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <button
                  onClick={() => router.push(`/finance/invoices/view/${payment.invoiceId}`)}
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center mt-1"
                >
                  {payment.invoiceNumber}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Invoice Amount</p>
                  <p className="font-bold text-gray-900">
                    {payment.currency} {payment.invoiceAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{payment.dueDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="font-bold text-green-700">
                    {payment.currency} {payment.invoicePaidAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance Amount</p>
                  <p className={`font-bold ${payment.invoiceBalanceAmount > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                    {payment.currency} {payment.invoiceBalanceAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Payment Status</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {payment.invoiceBalanceAmount === 0
                        ? 'Invoice fully paid'
                        : `Remaining balance: ${payment.currency} ${payment.invoiceBalanceAmount.toLocaleString('en-IN')}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MethodIcon className="h-5 w-5 mr-2 text-green-600" />
              Payment Method Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold text-gray-900">{methodConfig[payment.paymentMethod].label}</p>
              </div>
              {(payment.paymentMethod === 'bank_transfer' ||
                payment.paymentMethod === 'neft' ||
                payment.paymentMethod === 'rtgs' ||
                payment.paymentMethod === 'imps') && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="font-medium text-gray-900">{payment.bankName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-mono text-gray-900">{payment.bankAccountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IFSC Code</p>
                      <p className="font-mono text-gray-900">{payment.bankIFSC}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium text-gray-900">{payment.bankBranch}</p>
                  </div>
                </>
              )}
              {payment.upiId && (
                <div>
                  <p className="text-sm text-gray-500">UPI ID</p>
                  <p className="font-mono text-gray-900">{payment.upiId}</p>
                </div>
              )}
              {payment.cardLastFourDigits && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Card Type</p>
                    <p className="font-medium text-gray-900">{payment.cardType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Card Number</p>
                    <p className="font-mono text-gray-900">**** **** **** {payment.cardLastFourDigits}</p>
                  </div>
                </div>
              )}
              {payment.checkNumber && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check Number</p>
                    <p className="font-mono text-gray-900">{payment.checkNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check Date</p>
                    <p className="font-medium text-gray-900">{payment.checkDate}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-mono text-gray-900">{payment.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono text-gray-900">{payment.transactionId}</p>
              </div>
            </div>
          </div>

          {/* Reconciliation Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-indigo-600" />
              Reconciliation Status
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                    reconStatusConfig[payment.reconciliationStatus].color
                  }`}
                >
                  {reconStatusConfig[payment.reconciliationStatus].label}
                </span>
              </div>
              {payment.reconciledBy && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Reconciled By</p>
                    <p className="font-medium text-gray-900">{payment.reconciledBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reconciled Date</p>
                    <p className="font-medium text-gray-900">{payment.reconciledDate}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-500">Processed By</p>
                <p className="font-medium text-gray-900">{payment.processedBy}</p>
              </div>
              {payment.approvedBy && (
                <div>
                  <p className="text-sm text-gray-500">Approved By</p>
                  <p className="font-medium text-gray-900">{payment.approvedBy}</p>
                </div>
              )}
              {payment.reconciliationStatus === 'not_reconciled' && (
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Reconcile Payment</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Transaction Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Hash className="h-5 w-5 mr-2 text-blue-600" />
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Payment Number</p>
                <p className="font-mono text-gray-900 font-semibold">{payment.paymentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono text-gray-900">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-mono text-gray-900">{payment.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium text-gray-900">{payment.paymentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction Date</p>
                <p className="font-medium text-gray-900">{payment.transactionDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="font-medium text-gray-900">{payment.currency}</p>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Amount Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Payment Amount</span>
                <span className="font-semibold text-gray-900">
                  {payment.currency} {payment.paymentAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Transaction Fee</span>
                <span className="font-semibold text-orange-600">
                  - {payment.currency} {payment.transactionFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4">
                <span className="font-semibold text-gray-900">Net Amount</span>
                <span className="font-bold text-green-700 text-lg">
                  {payment.currency} {payment.netAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Bank & Transaction Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-indigo-600" />
              Bank & Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-semibold text-gray-900">{payment.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-mono text-gray-900">{payment.bankAccountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IFSC Code</p>
                <p className="font-mono text-gray-900">{payment.bankIFSC}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium text-gray-900">{payment.bankBranch}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Payment Notes</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{payment.notes}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Internal Notes</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-900">{payment.internalNotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            <div className="space-y-2">
              {payment.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-900">{attachment}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Activity Timeline
          </h3>
          <div className="space-y-4">
            {activityLogs.map((log, index) => (
              <div key={log.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.status === 'success'
                        ? 'bg-green-100'
                        : log.status === 'error'
                        ? 'bg-red-100'
                        : log.status === 'warning'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {log.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : log.status === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : log.status === 'warning' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <Bell className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  {index < activityLogs.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>}
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{log.action}</h4>
                      <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      {log.performedBy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        {payment.status === 'completed' && payment.reconciliationStatus === 'not_reconciled' && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <CheckCircle className="h-4 w-4" />
            <span>Reconcile Payment</span>
          </button>
        )}
        {payment.status === 'completed' && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <RefreshCw className="h-4 w-4" />
            <span>Refund Payment</span>
          </button>
        )}
        {payment.status === 'failed' && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Ban className="h-4 w-4" />
            <span>Mark as Failed</span>
          </button>
        )}
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Receipt className="h-4 w-4" />
          <span>Download Receipt</span>
        </button>
      </div>
    </div>
  );
}
