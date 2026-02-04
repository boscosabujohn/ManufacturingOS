'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Building2,
  Receipt,
  Target,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  Shield,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

// TypeScript Interfaces
interface UnpaidInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balanceAmount: number;
  agingDays: number;
  status: 'outstanding' | 'overdue';
}

interface CustomerCreditInfo {
  creditLimit: number;
  creditUsed: number;
  availableCredit: number;
  creditStatus: 'approved' | 'on_hold' | 'suspended';
  paymentTerms: string;
  riskRating: 'low' | 'medium' | 'high';
}

interface ReceivableFormData {
  customerId: string;
  customerName: string;
  selectedInvoice: string;
  amount: number;
  dueDate: string;

  // Collection Details
  collectionAgent: string;
  collectionPriority: 'low' | 'medium' | 'high';

  // Credit Check
  creditCheckPerformed: boolean;
  creditInfo?: CustomerCreditInfo;

  // Notes
  notes: string;
  internalRemarks: string;
}

// Mock Indian Customers with Credit Info
const indianCustomers = [
  {
    id: 'CUST-001',
    name: 'Sharma Modular Kitchens Pvt Ltd',
    city: 'Mumbai',
    category: 'Wholesale',
    creditInfo: {
      creditLimit: 15000000,
      creditUsed: 5750000,
      availableCredit: 9250000,
      creditStatus: 'approved' as const,
      paymentTerms: 'Net 30 days',
      riskRating: 'medium' as const,
    },
    unpaidInvoices: [
      {
        id: '1',
        invoiceNumber: 'INV-2025-5678',
        invoiceDate: '2025-10-01',
        dueDate: '2025-10-31',
        amount: 1250000,
        balanceAmount: 1250000,
        agingDays: 16,
        status: 'outstanding' as const,
      },
      {
        id: '2',
        invoiceNumber: 'INV-2025-5456',
        invoiceDate: '2025-09-15',
        dueDate: '2025-10-15',
        amount: 2000000,
        balanceAmount: 1200000,
        agingDays: 32,
        status: 'overdue' as const,
      },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Royal Interiors Bangalore',
    city: 'Bangalore',
    category: 'Distributor',
    creditInfo: {
      creditLimit: 10000000,
      creditUsed: 3500000,
      availableCredit: 6500000,
      creditStatus: 'approved' as const,
      paymentTerms: 'Net 45 days',
      riskRating: 'low' as const,
    },
    unpaidInvoices: [
      {
        id: '3',
        invoiceNumber: 'INV-2025-5234',
        invoiceDate: '2025-09-20',
        dueDate: '2025-11-04',
        amount: 1850000,
        balanceAmount: 1850000,
        agingDays: 27,
        status: 'outstanding' as const,
      },
    ],
  },
  {
    id: 'CUST-003',
    name: 'Lifestyle Furniture Delhi',
    city: 'New Delhi',
    category: 'Retail',
    creditInfo: {
      creditLimit: 5000000,
      creditUsed: 4200000,
      availableCredit: 800000,
      creditStatus: 'on_hold' as const,
      paymentTerms: 'Net 30 days',
      riskRating: 'high' as const,
    },
    unpaidInvoices: [
      {
        id: '4',
        invoiceNumber: 'INV-2025-5012',
        invoiceDate: '2025-08-25',
        dueDate: '2025-09-24',
        amount: 2100000,
        balanceAmount: 2100000,
        agingDays: 53,
        status: 'overdue' as const,
      },
      {
        id: '5',
        invoiceNumber: 'INV-2025-4890',
        invoiceDate: '2025-08-10',
        dueDate: '2025-09-09',
        amount: 2100000,
        balanceAmount: 2100000,
        agingDays: 68,
        status: 'overdue' as const,
      },
    ],
  },
  {
    id: 'CUST-004',
    name: 'Metro Home Solutions',
    city: 'Chennai',
    category: 'Wholesale',
    creditInfo: {
      creditLimit: 12000000,
      creditUsed: 4500000,
      availableCredit: 7500000,
      creditStatus: 'approved' as const,
      paymentTerms: 'Net 30 days',
      riskRating: 'low' as const,
    },
    unpaidInvoices: [
      {
        id: '6',
        invoiceNumber: 'INV-2025-5345',
        invoiceDate: '2025-10-05',
        dueDate: '2025-11-04',
        amount: 1650000,
        balanceAmount: 1650000,
        agingDays: 12,
        status: 'outstanding' as const,
      },
    ],
  },
];

const collectionAgents = [
  'Priya Desai',
  'Amit Kumar',
  'Sneha Patel',
  'Rahul Sharma',
  'Kavita Singh',
];

export default function AddReceivablePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ReceivableFormData>({
    customerId: '',
    customerName: '',
    selectedInvoice: '',
    amount: 0,
    dueDate: '',

    collectionAgent: '',
    collectionPriority: 'medium',

    creditCheckPerformed: false,
    creditInfo: undefined,

    notes: '',
    internalRemarks: '',
  });

  const [selectedCustomerData, setSelectedCustomerData] = useState<typeof indianCustomers[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveToQueue, setSaveToQueue] = useState(false);

  const handleCustomerChange = (customerId: string) => {
    const customer = indianCustomers.find(c => c.id === customerId);

    if (customer) {
      setSelectedCustomerData(customer);
      setFormData({
        ...formData,
        customerId,
        customerName: customer.name,
        selectedInvoice: '',
        amount: 0,
        dueDate: '',
        creditCheckPerformed: true,
        creditInfo: customer.creditInfo,
      });
    } else {
      setSelectedCustomerData(null);
      setFormData({
        ...formData,
        customerId: '',
        customerName: '',
        selectedInvoice: '',
        amount: 0,
        dueDate: '',
        creditCheckPerformed: false,
        creditInfo: undefined,
      });
    }
  };

  const handleInvoiceChange = (invoiceId: string) => {
    if (!selectedCustomerData) return;

    const invoice = selectedCustomerData.unpaidInvoices.find(inv => inv.id === invoiceId);

    if (invoice) {
      setFormData({
        ...formData,
        selectedInvoice: invoiceId,
        amount: invoice.balanceAmount,
        dueDate: invoice.dueDate,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, addToQueue: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveToQueue(addToQueue);

    // Credit check validation
    if (formData.creditInfo?.creditStatus !== 'approved') {
      alert('Warning: Customer credit is not approved. Please review before proceeding.');
    }

    if (formData.amount > (formData.creditInfo?.availableCredit || 0)) {
      const proceed = confirm(
        `Warning: Invoice amount (${formatCurrency(formData.amount)}) exceeds available credit (${formatCurrency(formData.creditInfo?.availableCredit || 0)}). Do you want to proceed?`
      );
      if (!proceed) {
        setIsSubmitting(false);
        return;
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('New Receivable:', { ...formData, addedToQueue: addToQueue });
    alert(addToQueue ? 'Receivable added to collection queue!' : 'Receivable created successfully!');
    router.push('/finance/receivables');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCreditUtilizationPercentage = () => {
    if (!formData.creditInfo) return 0;
    return (formData.creditInfo.creditUsed / formData.creditInfo.creditLimit) * 100;
  };

  const getAgingStatus = (days: number) => {
    if (days <= 30) return { label: 'Current', color: 'text-green-700', bgColor: 'bg-green-100' };
    if (days <= 60) return { label: '31-60 Days', color: 'text-blue-700', bgColor: 'bg-blue-100' };
    if (days <= 90) return { label: '61-90 Days', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    return { label: '90+ Days', color: 'text-red-700', bgColor: 'bg-red-100' };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-3 py-2">
      {/* Header */}
      <div className="mb-3">
        <button
          onClick={() => router.push('/finance/receivables')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Receivables</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Receivable</h1>
            <p className="text-sm text-gray-600 mt-1">Create new receivable and add to collection queue</p>
          </div>
        </div>
      </div>

      <form className="space-y-3">
        {/* Customer Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            Select Customer
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Customer</option>
              {indianCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.city} ({customer.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Credit Check Results */}
        {formData.creditCheckPerformed && formData.creditInfo && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Credit Check
              </h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                formData.creditInfo.creditStatus === 'approved' ? 'bg-green-100 text-green-700' :
                formData.creditInfo.creditStatus === 'on_hold' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {formData.creditInfo.creditStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <p className="text-xs font-medium text-blue-600 uppercase">Credit Limit</p>
                </div>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(formData.creditInfo.creditLimit)}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <p className="text-xs font-medium text-orange-600 uppercase">Credit Used</p>
                </div>
                <p className="text-xl font-bold text-orange-900">{formatCurrency(formData.creditInfo.creditUsed)}</p>
                <p className="text-xs text-orange-600 mt-1">{getCreditUtilizationPercentage().toFixed(1)}% utilized</p>
              </div>

              <div className={`rounded-lg p-3 border ${
                formData.creditInfo.availableCredit > 1000000 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className={`h-5 w-5 ${formData.creditInfo.availableCredit > 1000000 ? 'text-green-600' : 'text-red-600'}`} />
                  <p className={`text-xs font-medium uppercase ${formData.creditInfo.availableCredit > 1000000 ? 'text-green-600' : 'text-red-600'}`}>Available Credit</p>
                </div>
                <p className={`text-xl font-bold ${formData.creditInfo.availableCredit > 1000000 ? 'text-green-900' : 'text-red-900'}`}>
                  {formatCurrency(formData.creditInfo.availableCredit)}
                </p>
              </div>
            </div>

            {/* Credit Utilization Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Credit Utilization</span>
                <span className="font-semibold text-gray-900">{getCreditUtilizationPercentage().toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    getCreditUtilizationPercentage() > 80 ? 'bg-red-600' :
                    getCreditUtilizationPercentage() > 60 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${getCreditUtilizationPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Risk Rating & Payment Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Risk Rating</p>
                <span className={`px-3 py-1 text-sm font-semibold rounded ${
                  formData.creditInfo.riskRating === 'low' ? 'bg-green-100 text-green-700' :
                  formData.creditInfo.riskRating === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {formData.creditInfo.riskRating.charAt(0).toUpperCase() + formData.creditInfo.riskRating.slice(1)} Risk
                </span>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Payment Terms</p>
                <p className="text-sm font-semibold text-gray-900">{formData.creditInfo.paymentTerms}</p>
              </div>
            </div>

            {/* Credit Warnings */}
            {formData.creditInfo.creditStatus !== 'approved' && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">Credit Status Warning</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Customer credit is {formData.creditInfo.creditStatus.replace('_', ' ')}. Please review before proceeding with collection.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invoice Selection */}
        {selectedCustomerData && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-blue-600" />
              Select Invoice
            </h2>

            {selectedCustomerData.unpaidInvoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mb-3 text-gray-400" />
                <p>No unpaid invoices for this customer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCustomerData.unpaidInvoices.map((invoice) => {
                  const agingStatus = getAgingStatus(invoice.agingDays);
                  const isSelected = formData.selectedInvoice === invoice.id;

                  return (
                    <div
                      key={invoice.id}
                      onClick={() => handleInvoiceChange(invoice.id)}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                          <span className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${agingStatus.bgColor} ${agingStatus.color}`}>
                          {invoice.agingDays} days old
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-8">
                        <div>
                          <p className="text-xs text-gray-500">Invoice Date</p>
                          <p className="text-sm font-semibold text-gray-900">{invoice.invoiceDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Due Date</p>
                          <p className="text-sm font-semibold text-gray-900">{invoice.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Balance Due</p>
                          <p className="text-sm font-bold text-red-600">{formatCurrency(invoice.balanceAmount)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Amount & Due Date (Auto-filled) */}
        {formData.selectedInvoice && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Amount Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                {formData.amount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.amount)}</p>
                )}
                {formData.amount > (formData.creditInfo?.availableCredit || 0) && (
                  <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Exceeds available credit</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Collection Details */}
        {formData.selectedInvoice && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Collection Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Collection Agent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Collection Agent <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.collectionAgent}
                  onChange={(e) => setFormData({ ...formData, collectionAgent: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Agent</option>
                  {collectionAgents.map((agent) => (
                    <option key={agent} value={agent}>
                      {agent}
                    </option>
                  ))}
                </select>
              </div>

              {/* Collection Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.collectionPriority}
                  onChange={(e) => setFormData({ ...formData, collectionPriority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any collection notes or special instructions"
                  rows={3}
                />
              </div>

              {/* Internal Remarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Remarks (Not visible to customer)
                </label>
                <textarea
                  value={formData.internalRemarks}
                  onChange={(e) => setFormData({ ...formData, internalRemarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-yellow-50 border-yellow-200"
                  placeholder="Enter internal remarks for team use only"
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {formData.selectedInvoice && (
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/finance/receivables')}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting && !saveToQueue ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCheck className="h-5 w-5" />
              <span>{isSubmitting && saveToQueue ? 'Adding...' : 'Save & Add to Collection Queue'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
