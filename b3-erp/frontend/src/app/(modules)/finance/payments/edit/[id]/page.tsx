'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  X,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Building,
  User,
  Hash,
  AlertCircle,
  Info,
  Upload,
  Trash2,
  CheckCircle,
  Smartphone,
  Banknote,
  Landmark,
  Receipt,
} from 'lucide-react';

interface PaymentFormData {
  paymentNumber: string;
  paymentType: 'received' | 'made';
  invoiceNumber: string;
  invoiceId: string;
  partyType: 'customer' | 'vendor';
  partyName: string;
  partyId: string;
  paymentDate: string;
  transactionDate: string;
  paymentAmount: number;
  transactionFee: number;
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
  notes: string;
  internalNotes: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}

const mockInvoice: Invoice = {
  id: 'INV-001',
  invoiceNumber: 'INV-2025-001',
  amount: 172500,
  paidAmount: 172500,
  balanceAmount: 0,
};

const bankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    branch: 'MG Road, Bangalore',
  },
  {
    id: '2',
    bankName: 'ICICI Bank',
    accountNumber: '000405001234',
    ifscCode: 'ICIC0000004',
    branch: 'Indiranagar, Bangalore',
  },
  {
    id: '3',
    bankName: 'State Bank of India',
    accountNumber: '30123456789',
    ifscCode: 'SBIN0001234',
    branch: 'Koramangala, Bangalore',
  },
  {
    id: '4',
    bankName: 'Axis Bank',
    accountNumber: '912010012345678',
    ifscCode: 'UTIB0001234',
    branch: 'Whitefield, Bangalore',
  },
];

const paymentMethods = [
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'neft', label: 'NEFT', icon: Landmark },
  { value: 'rtgs', label: 'RTGS', icon: Landmark },
  { value: 'imps', label: 'IMPS', icon: Smartphone },
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
  { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
  { value: 'check', label: 'Check', icon: Receipt },
  { value: 'cash', label: 'Cash', icon: Banknote },
];

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-700' },
  { value: 'processing', label: 'Processing', color: 'text-blue-700' },
  { value: 'completed', label: 'Completed', color: 'text-green-700' },
  { value: 'failed', label: 'Failed', color: 'text-red-700' },
  { value: 'refunded', label: 'Refunded', color: 'text-orange-700' },
];

const reconciliationOptions = [
  { value: 'not_reconciled', label: 'Not Reconciled' },
  { value: 'reconciled', label: 'Reconciled' },
  { value: 'partially_reconciled', label: 'Partially Reconciled' },
];

export default function PaymentEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PaymentFormData>({
    paymentNumber: 'PAY-2025-001',
    paymentType: 'received',
    invoiceNumber: 'INV-2025-001',
    invoiceId: 'INV-001',
    partyType: 'customer',
    partyName: 'Hotel Paradise Ltd',
    partyId: 'CUST-001',
    paymentDate: '2025-10-15',
    transactionDate: '2025-10-15',
    paymentAmount: 172500,
    transactionFee: 172.5,
    paymentMethod: 'neft',
    status: 'completed',
    referenceNumber: 'NEFT-20251015-HP001',
    transactionId: 'HDFC2025101512345678',
    bankName: 'HDFC Bank',
    bankAccountNumber: '50200012345678',
    bankIFSC: 'HDFC0001234',
    bankBranch: 'MG Road, Bangalore',
    reconciliationStatus: 'reconciled',
    notes: 'Full payment received against INV-2025-001',
    internalNotes: 'Payment cleared on same day. Customer is regular and reliable.',
  });

  const [invoice] = useState<Invoice>(mockInvoice);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (field: keyof PaymentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBankAccountSelect = (accountId: string) => {
    const account = bankAccounts.find((acc) => acc.id === accountId);
    if (account) {
      setFormData((prev) => ({
        ...prev,
        bankName: account.bankName,
        bankAccountNumber: account.accountNumber,
        bankIFSC: account.ifscCode,
        bankBranch: account.branch,
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      newErrors.paymentAmount = 'Payment amount is required and must be greater than 0';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Transaction date is required';
    }

    if (!formData.referenceNumber.trim()) {
      newErrors.referenceNumber = 'Reference number is required';
    }

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }

    if (
      (formData.paymentMethod === 'bank_transfer' ||
        formData.paymentMethod === 'neft' ||
        formData.paymentMethod === 'rtgs' ||
        formData.paymentMethod === 'imps') &&
      (!formData.bankAccountNumber || !formData.bankIFSC)
    ) {
      newErrors.bankDetails = 'Bank account details are required for this payment method';
    }

    if (formData.paymentMethod === 'upi' && !formData.upiId) {
      newErrors.upiId = 'UPI ID is required for UPI payments';
    }

    if (
      (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') &&
      !formData.cardLastFourDigits
    ) {
      newErrors.cardLastFourDigits = 'Card details are required';
    }

    if (formData.paymentMethod === 'check' && (!formData.checkNumber || !formData.checkDate)) {
      newErrors.checkDetails = 'Check number and date are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Payment updated:', formData);
      console.log('Attachments:', attachments);

      router.push(`/finance/payments/view/${params.id}`);
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/finance/payments/view/${params.id}`);
  };

  const netAmount = formData.paymentAmount - formData.transactionFee;
  const selectedMethod = paymentMethods.find((m) => m.value === formData.paymentMethod);
  const MethodIcon = selectedMethod?.icon || CreditCard;

  const requiresBankDetails =
    formData.paymentMethod === 'bank_transfer' ||
    formData.paymentMethod === 'neft' ||
    formData.paymentMethod === 'rtgs' ||
    formData.paymentMethod === 'imps';

  const requiresUPI = formData.paymentMethod === 'upi';
  const requiresCardDetails =
    formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card';
  const requiresCheckDetails = formData.paymentMethod === 'check';

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button onClick={handleCancel} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment Details
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Payment</h1>
              <p className="text-gray-600 mt-1">{formData.paymentNumber}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Invoice: {formData.invoiceNumber}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {formData.partyName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Invoice Number</p>
                <p className="font-semibold text-blue-900">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-blue-700">Invoice Amount</p>
                <p className="font-semibold text-blue-900">INR {invoice.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-blue-700">Already Paid</p>
                <p className="font-semibold text-green-700">INR {invoice.paidAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-blue-700">Balance</p>
                <p className="font-semibold text-orange-700">INR {invoice.balanceAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">INR</span>
                  <input
                    type="number"
                    value={formData.paymentAmount}
                    onChange={(e) => handleInputChange('paymentAmount', parseFloat(e.target.value))}
                    className={`w-full pl-12 pr-4 py-2 border ${
                      errors.paymentAmount ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.paymentAmount && <p className="text-red-500 text-xs mt-1">{errors.paymentAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Fee</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">INR</span>
                  <input
                    type="number"
                    value={formData.transactionFee}
                    onChange={(e) => handleInputChange('transactionFee', parseFloat(e.target.value))}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.paymentDate ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.paymentDate && <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.transactionDate ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.transactionDate && <p className="text-red-500 text-xs mt-1">{errors.transactionDate}</p>}
              </div>

              <div className="md:col-span-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Net Amount (After Fees)</span>
                    <span className="text-2xl font-bold text-green-700">INR {netAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MethodIcon className="h-5 w-5 mr-2 text-purple-600" />
              Payment Method
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => handleInputChange('paymentMethod', method.value)}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium text-center">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bank Details */}
            {requiresBankDetails && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank Account <span className="text-red-500">*</span>
                  </label>
                  <select
                    onChange={(e) => handleBankAccountSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a bank account</option>
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bankName} - {account.accountNumber} ({account.branch})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.bankIFSC}
                      onChange={(e) => handleInputChange('bankIFSC', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                    <input
                      type="text"
                      value={formData.bankBranch}
                      onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter branch name"
                    />
                  </div>
                </div>
                {errors.bankDetails && <p className="text-red-500 text-sm">{errors.bankDetails}</p>}
              </div>
            )}

            {/* UPI Details */}
            {requiresUPI && (
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.upiId || ''}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.upiId ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="user@upi"
                />
                {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
              </div>
            )}

            {/* Card Details */}
            {requiresCardDetails && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.cardType || ''}
                      onChange={(e) => handleInputChange('cardType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select card type</option>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="RuPay">RuPay</option>
                      <option value="American Express">American Express</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last 4 Digits <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cardLastFourDigits || ''}
                      onChange={(e) => handleInputChange('cardLastFourDigits', e.target.value)}
                      className={`w-full px-4 py-2 border ${
                        errors.cardLastFourDigits ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                </div>
                {errors.cardLastFourDigits && <p className="text-red-500 text-sm">{errors.cardLastFourDigits}</p>}
              </div>
            )}

            {/* Check Details */}
            {requiresCheckDetails && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.checkNumber || ''}
                      onChange={(e) => handleInputChange('checkNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter check number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.checkDate || ''}
                      onChange={(e) => handleInputChange('checkDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {errors.checkDetails && <p className="text-red-500 text-sm">{errors.checkDetails}</p>}
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Hash className="h-5 w-5 mr-2 text-blue-600" />
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.referenceNumber ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter reference number"
                />
                {errors.referenceNumber && <p className="text-red-500 text-xs mt-1">{errors.referenceNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.transactionId ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId}</p>}
              </div>
            </div>
          </div>

          {/* Status & Reconciliation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-indigo-600" />
              Status & Reconciliation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reconciliation Status</label>
                <select
                  value={formData.reconciliationStatus}
                  onChange={(e) => handleInputChange('reconciliationStatus', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reconciliationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter payment notes (visible to customer)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter internal notes (not visible to customer)"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">Upload files</span>
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.png" />
                </label>
                <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG up to 10MB</p>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-900">{file.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Please fix the following errors:</h4>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Payment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
