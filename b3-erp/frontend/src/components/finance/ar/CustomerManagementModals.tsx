'use client';

import React, { useState } from 'react';
import { X, UserPlus, Eye, Edit2, Trash2, CreditCard, Mail } from 'lucide-react';

// Customer interface for modal props
interface Customer {
  id: string;
  code: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  gstNumber?: string;
  panNumber?: string;
  creditLimit: number;
  creditUsed: number;
  paymentTerms: string;
  status: string;
  createdDate: string;
  lastInvoiceDate?: string;
  totalInvoices: number;
  totalRevenue: number;
  averagePaymentDays: number;
}

// ==================== CREATE CUSTOMER MODAL ====================
interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ isOpen, onClose }) => {
  const [customerCode, setCustomerCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('net_30');
  const [customerType, setCustomerType] = useState('regular');
  const [taxExempt, setTaxExempt] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating customer:', {
      customerCode,
      customerName,
      contactPerson,
      email,
      phone,
      billingAddress,
      shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
      gstNumber,
      panNumber,
      creditLimit,
      paymentTerms,
      customerType,
      taxExempt
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create New Customer</h2>
              <p className="text-blue-100 text-sm">Add a new customer to your accounts receivable</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Code
                </label>
                <input
                  type="text"
                  value={customerCode}
                  onChange={(e) => setCustomerCode(e.target.value)}
                  placeholder="Auto-generated if left empty"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="regular">Regular Customer</option>
                  <option value="vip">VIP Customer</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="retail">Retail</option>
                  <option value="distributor">Distributor</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Company or individual name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Primary contact name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Address Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  rows={3}
                  placeholder="Street, City, State, PIN Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Shipping address same as billing address</span>
                </label>
              </div>

              {!sameAsBilling && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    placeholder="Street, City, State, PIN Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!sameAsBilling}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tax & Compliance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Tax & Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  placeholder="ABCDE1234F"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={taxExempt}
                    onChange={(e) => setTaxExempt(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tax Exempt (Requires documentation)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Payment Terms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit (₹)
                </label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_7">Net 7 Days</option>
                  <option value="net_15">Net 15 Days</option>
                  <option value="net_30">Net 30 Days</option>
                  <option value="net_45">Net 45 Days</option>
                  <option value="net_60">Net 60 Days</option>
                  <option value="net_90">Net 90 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== VIEW CUSTOMER MODAL ====================
interface ViewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export const ViewCustomerModal: React.FC<ViewCustomerModalProps> = ({ isOpen, onClose, customer: _customer }) => {
  if (!isOpen) return null;

  const customerData = {
    code: 'CUST-001',
    name: 'ABC Corporation',
    type: 'Regular Customer',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@abccorp.com',
    phone: '+91 98765 43210',
    billingAddress: '123 MG Road, Bangalore, Karnataka - 560001',
    shippingAddress: '123 MG Road, Bangalore, Karnataka - 560001',
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    creditLimit: 500000,
    creditUsed: 125000,
    paymentTerms: 'Net 30 Days',
    status: 'Active',
    createdDate: '2024-01-15',
    lastInvoiceDate: '2025-01-15',
    totalInvoices: 45,
    totalRevenue: 5250000,
    averagePaymentDays: 28
  };

  const creditAvailable = customerData.creditLimit - customerData.creditUsed;
  const creditUtilization = (customerData.creditUsed / customerData.creditLimit) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Customer Details</h2>
              <p className="text-purple-100 text-sm">{customerData.code} • {customerData.status}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="text-blue-700 text-sm font-medium mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-blue-900">₹{(customerData.totalRevenue / 100000).toFixed(1)}L</div>
              <div className="text-xs text-blue-600 mt-1">{customerData.totalInvoices} invoices</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-green-700 text-sm font-medium mb-1">Credit Available</div>
              <div className="text-2xl font-bold text-green-900">₹{(creditAvailable / 1000).toFixed(0)}K</div>
              <div className="text-xs text-green-600 mt-1">of ₹{(customerData.creditLimit / 1000).toFixed(0)}K limit</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
              <div className="text-orange-700 text-sm font-medium mb-1">Credit Used</div>
              <div className="text-2xl font-bold text-orange-900">{creditUtilization.toFixed(0)}%</div>
              <div className="text-xs text-orange-600 mt-1">₹{(customerData.creditUsed / 1000).toFixed(0)}K utilized</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="text-purple-700 text-sm font-medium mb-1">Avg Payment Days</div>
              <div className="text-2xl font-bold text-purple-900">{customerData.averagePaymentDays}</div>
              <div className="text-xs text-purple-600 mt-1">Good payment record</div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Customer Code:</span>
                <p className="font-medium text-gray-900">{customerData.code}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Customer Type:</span>
                <p className="font-medium text-gray-900">{customerData.type}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">Customer Name:</span>
                <p className="font-medium text-gray-900">{customerData.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Contact Person:</span>
                <p className="font-medium text-gray-900">{customerData.contactPerson}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium text-gray-900">{customerData.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="font-medium text-gray-900">{customerData.phone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {customerData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Address Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Billing Address:</span>
                <p className="font-medium text-gray-900">{customerData.billingAddress}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Shipping Address:</span>
                <p className="font-medium text-gray-900">{customerData.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Tax & Compliance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Tax & Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">GST Number:</span>
                <p className="font-medium text-gray-900">{customerData.gstNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">PAN Number:</span>
                <p className="font-medium text-gray-900">{customerData.panNumber}</p>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Payment Terms & Credit</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Payment Terms:</span>
                <p className="font-medium text-gray-900">{customerData.paymentTerms}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Credit Limit:</span>
                <p className="font-medium text-gray-900">₹{customerData.creditLimit.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Credit Used:</span>
                <p className="font-medium text-gray-900">₹{customerData.creditUsed.toLocaleString()}</p>
              </div>
            </div>

            {/* Credit Utilization Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Credit Utilization</span>
                <span className="font-medium text-gray-900">{creditUtilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    creditUtilization > 90 ? 'bg-red-500' : creditUtilization > 70 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${creditUtilization}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Account History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Account History</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Customer Since:</span>
                <p className="font-medium text-gray-900">{customerData.createdDate}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Invoice:</span>
                <p className="font-medium text-gray-900">{customerData.lastInvoiceDate}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Average Payment:</span>
                <p className="font-medium text-gray-900">{customerData.averagePaymentDays} days</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== EDIT CUSTOMER MODAL ====================
interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ isOpen, onClose, customer: _customer }) => {
  const [customerName, setCustomerName] = useState('ABC Corporation');
  const [contactPerson, setContactPerson] = useState('Rajesh Kumar');
  const [email, setEmail] = useState('rajesh@abccorp.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [billingAddress, setBillingAddress] = useState('123 MG Road, Bangalore, Karnataka - 560001');
  const [shippingAddress, setShippingAddress] = useState('123 MG Road, Bangalore, Karnataka - 560001');
  const [gstNumber, setGstNumber] = useState('29ABCDE1234F1Z5');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [customerType, setCustomerType] = useState('regular');
  const [paymentTerms, setPaymentTerms] = useState('net_30');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating customer:', {
      customerName,
      contactPerson,
      email,
      phone,
      billingAddress,
      shippingAddress,
      gstNumber,
      panNumber,
      customerType,
      paymentTerms
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Customer</h2>
              <p className="text-green-100 text-sm">CUST-001 • ABC Corporation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Type
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="regular">Regular Customer</option>
                <option value="vip">VIP Customer</option>
                <option value="wholesale">Wholesale</option>
                <option value="retail">Retail</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net_7">Net 7 Days</option>
                <option value="net_15">Net 15 Days</option>
                <option value="net_30">Net 30 Days</option>
                <option value="net_45">Net 45 Days</option>
                <option value="net_60">Net 60 Days</option>
                <option value="net_90">Net 90 Days</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== DELETE CUSTOMER MODAL ====================
interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({ isOpen, onClose, customer: _customer }) => {
  const [confirmText, setConfirmText] = useState('');
  const [archiveInstead, setArchiveInstead] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === 'DELETE') {
      console.log('Deleting customer:', { archiveInstead });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Delete Customer</h2>
              <p className="text-red-100 text-sm">CUST-001 • ABC Corporation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Warning: This action cannot be undone</h3>
                <p className="text-sm text-red-700 mb-3">
                  Deleting this customer will remove all associated data including invoices, payments, and transaction history. This action is irreversible.
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 45 invoices will be affected</li>
                  <li>• ₹52.5L in transaction history</li>
                  <li>• All payment records</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                checked={archiveInstead}
                onChange={(e) => setArchiveInstead(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-blue-900">Archive instead of delete</span>
                <p className="text-xs text-blue-700">Recommended: Hide customer but preserve all data for reporting</p>
              </div>
            </label>
          </div>

          {!archiveInstead && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type "DELETE" to confirm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!archiveInstead && confirmText !== 'DELETE'}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {archiveInstead ? 'Archive Customer' : 'Delete Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== CREDIT LIMIT CHANGE MODAL ====================
interface CreditLimitChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export const CreditLimitChangeModal: React.FC<CreditLimitChangeModalProps> = ({ isOpen, onClose, customer: _customer }) => {
  const [currentLimit, setCurrentLimit] = useState(500000);
  const [newLimit, setNewLimit] = useState('500000');
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [requireApproval, setRequireApproval] = useState(true);
  const [notifyCustomer, setNotifyCustomer] = useState(false);

  const limitChange = parseFloat(newLimit) - currentLimit;
  const limitChangePercent = ((limitChange / currentLimit) * 100).toFixed(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Changing credit limit:', {
      currentLimit,
      newLimit,
      reason,
      effectiveDate,
      requireApproval,
      notifyCustomer
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Change Credit Limit</h2>
              <p className="text-teal-100 text-sm">CUST-001 • ABC Corporation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Current vs New Comparison */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 mb-4 border border-teal-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-teal-700 font-medium mb-1">Current Limit</div>
                <div className="text-lg font-bold text-teal-900">₹{(currentLimit / 1000).toFixed(0)}K</div>
              </div>
              <div>
                <div className="text-teal-700 font-medium mb-1">New Limit</div>
                <div className="text-lg font-bold text-teal-900">₹{(parseFloat(newLimit) / 1000).toFixed(0)}K</div>
              </div>
              <div>
                <div className="text-teal-700 font-medium mb-1">Change</div>
                <div className={`text-lg font-bold ${limitChange > 0 ? 'text-green-600' : limitChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {limitChange > 0 ? '+' : ''}₹{(limitChange / 1000).toFixed(0)}K
                  <div className="text-xs">({limitChangePercent}%)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Credit Limit (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              step="1000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Change <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Explain why the credit limit is being changed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Options */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Require manager approval before applying</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Notify customer about credit limit change</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-colors font-medium"
            >
              {requireApproval ? 'Submit for Approval' : 'Apply Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== SEND CUSTOMER STATEMENT MODAL ====================
interface SendCustomerStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export const SendCustomerStatementModal: React.FC<SendCustomerStatementModalProps> = ({ isOpen, onClose, customer: _customer }) => {
  const [statementPeriod, setStatementPeriod] = useState('current_month');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [recipient, setRecipient] = useState('rajesh@abccorp.com');
  const [ccEmails, setCcEmails] = useState('');
  const [subject, setSubject] = useState('Account Statement - ABC Corporation');
  const [message, setMessage] = useState('Dear Customer,\n\nPlease find attached your account statement for the period mentioned.\n\nThank you for your business.\n\nBest regards,\nAccounts Team');
  const [includeOpeningBalance, setIncludeOpeningBalance] = useState(true);
  const [includeInvoices, setIncludeInvoices] = useState(true);
  const [includePayments, setIncludePayments] = useState(true);
  const [includeCreditNotes, setIncludeCreditNotes] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending statement:', {
      statementPeriod,
      startDate,
      endDate,
      recipient,
      ccEmails,
      subject,
      message,
      includeOpeningBalance,
      includeInvoices,
      includePayments,
      includeCreditNotes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Send Customer Statement</h2>
              <p className="text-violet-100 text-sm">CUST-001 • ABC Corporation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statement Period
            </label>
            <select
              value={statementPeriod}
              onChange={(e) => setStatementPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="current_quarter">Current Quarter</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="current_year">Current Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {statementPeriod === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CC (comma separated)
            </label>
            <input
              type="text"
              value={ccEmails}
              onChange={(e) => setCcEmails(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Include Options */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Include in Statement</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeOpeningBalance}
                  onChange={(e) => setIncludeOpeningBalance(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Opening balance</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeInvoices}
                  onChange={(e) => setIncludeInvoices(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Invoices and charges</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includePayments}
                  onChange={(e) => setIncludePayments(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Payments received</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeCreditNotes}
                  onChange={(e) => setIncludeCreditNotes(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Credit notes and adjustments</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-colors font-medium"
            >
              Send Statement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
