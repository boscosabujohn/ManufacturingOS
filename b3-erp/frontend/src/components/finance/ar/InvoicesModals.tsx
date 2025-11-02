'use client';

import React, { useState } from 'react';
import { X, Plus, FileText, Send, Printer, Mail, Download, Copy, CreditCard, DollarSign, Trash2 } from 'lucide-react';

// ============================================================================
// 1. CREATE INVOICE MODAL (Blue Gradient)
// ============================================================================
interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  amount: number;
}

export function CreateInvoiceModal({ isOpen, onClose, onCreate }: CreateInvoiceModalProps) {
  console.log('CreateInvoiceModal rendered, isOpen:', isOpen);

  const [customerId, setCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('net30');
  const [reference, setReference] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [taxType, setTaxType] = useState('GST');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: '', quantity: '', unitPrice: '', taxRate: '18', amount: 0 }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: Date.now().toString(),
      description: '',
      quantity: '',
      unitPrice: '',
      taxRate: '18',
      amount: 0
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Calculate amount
        const qty = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.unitPrice) || 0;
        const tax = parseFloat(updated.taxRate) || 0;
        updated.amount = qty * price * (1 + tax / 100);
        return updated;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + (qty * price);
    }, 0);

    const tax = lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const taxRate = parseFloat(item.taxRate) || 0;
      return sum + (qty * price * taxRate / 100);
    }, 0);

    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleCreate = () => {
    const invoice = {
      customerId,
      invoiceDate,
      dueDate,
      paymentTerms,
      reference,
      currency,
      taxType,
      notes,
      lineItems,
      subtotal,
      tax,
      total
    };
    console.log('Creating invoice:', invoice);
    onCreate?.(invoice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Create Invoice</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Customer & Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Customer</option>
                <option value="C001">ABC Corporation Ltd.</option>
                <option value="C002">XYZ Industries Pvt. Ltd.</option>
                <option value="C003">Tech Solutions Inc.</option>
                <option value="C004">Global Traders Co.</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms *</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="immediate">Immediate</option>
                <option value="net15">Net 15 Days</option>
                <option value="net30">Net 30 Days</option>
                <option value="net45">Net 45 Days</option>
                <option value="net60">Net 60 Days</option>
              </select>
            </div>
          </div>

          {/* Dates & Reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference/PO Number</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="PO-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Currency & Tax */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Type</label>
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="GST">GST (India)</option>
                <option value="VAT">VAT</option>
                <option value="Sales Tax">Sales Tax</option>
                <option value="None">No Tax</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Line
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description *</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Quantity</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Unit Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Tax %</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Amount</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Product/Service description"
                            className="w-full min-w-[200px] px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                            placeholder="0.00"
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.taxRate}
                            onChange={(e) => updateLineItem(item.id, 'taxRate', e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length <= 1}
                            className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-right font-semibold text-gray-900">Subtotal:</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{subtotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-right font-semibold text-gray-900">Tax:</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{tax.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td colSpan={4} className="px-3 py-2 text-right font-bold text-gray-900 text-lg">Total:</td>
                      <td className="px-3 py-2 text-right font-bold text-gray-900 text-lg">₹{total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional notes, terms, or instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={handleCreate}
            disabled={!customerId || !dueDate || lineItems.some(item => !item.description)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. VIEW INVOICE MODAL (Purple Gradient)
// ============================================================================
interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: string;
}

export function ViewInvoiceModal({ isOpen, onClose, invoiceId }: ViewInvoiceModalProps) {
  if (!isOpen) return null;

  const invoiceData = {
    invoiceNumber: 'INV-2025-00123',
    status: 'Sent',
    customer: {
      name: 'ABC Corporation Ltd.',
      email: 'accounts@abccorp.com',
      address: '123 Business Park, Mumbai 400001',
      gstin: '27AABCU9603R1ZM'
    },
    invoiceDate: '2025-01-15',
    dueDate: '2025-02-14',
    paymentTerms: 'Net 30 Days',
    currency: 'INR',
    reference: 'PO-2025-001',
    lineItems: [
      { id: 1, description: 'Professional Services - Web Development', quantity: 40, unitPrice: 2500, taxRate: 18, amount: 118000 },
      { id: 2, description: 'Cloud Hosting - Annual Subscription', quantity: 1, unitPrice: 25000, taxRate: 18, amount: 29500 }
    ],
    subtotal: 125000,
    tax: 22500,
    total: 147500,
    amountPaid: 0,
    amountDue: 147500,
    notes: 'Thank you for your business. Payment is due within 30 days.',
    createdBy: 'John Doe',
    createdDate: '2025-01-15 09:30 AM',
    lastSent: '2025-01-15 10:00 AM'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Invoice Details</h2>
              <p className="text-white/80 text-sm">{invoiceData.invoiceNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Status & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                invoiceData.status === 'Paid' ? 'bg-green-100 text-green-800' :
                invoiceData.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                invoiceData.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {invoiceData.status}
              </span>
              <span className="text-sm text-gray-600">
                Due: {invoiceData.dueDate}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Invoice Total</div>
              <div className="text-2xl font-bold text-blue-900">₹{invoiceData.total.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Amount Paid</div>
              <div className="text-2xl font-bold text-green-900">₹{invoiceData.amountPaid.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 mb-1">Amount Due</div>
              <div className="text-2xl font-bold text-red-900">₹{invoiceData.amountDue.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Payment Terms</div>
              <div className="text-lg font-bold text-gray-900">{invoiceData.paymentTerms}</div>
            </div>
          </div>

          {/* Customer & Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill To</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">{invoiceData.customer.name}</p>
                <p className="text-gray-600">{invoiceData.customer.address}</p>
                <p className="text-gray-600">Email: {invoiceData.customer.email}</p>
                <p className="text-gray-600">GSTIN: {invoiceData.customer.gstin}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Invoice Information</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-600">Invoice Date:</div>
                <div className="text-gray-900 font-medium">{invoiceData.invoiceDate}</div>
                <div className="text-gray-600">Due Date:</div>
                <div className="text-gray-900 font-medium">{invoiceData.dueDate}</div>
                <div className="text-gray-600">Reference:</div>
                <div className="text-gray-900 font-medium">{invoiceData.reference}</div>
                <div className="text-gray-600">Currency:</div>
                <div className="text-gray-900 font-medium">{invoiceData.currency}</div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Tax %</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceData.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-900">₹{item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{item.taxRate}%</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-right font-semibold text-gray-900">Subtotal:</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">₹{invoiceData.subtotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-right font-semibold text-gray-900">Tax (GST):</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">₹{invoiceData.tax.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td colSpan={4} className="px-4 py-2 text-right font-bold text-gray-900 text-lg">Total:</td>
                    <td className="px-4 py-2 text-right font-bold text-gray-900 text-lg">₹{invoiceData.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700">{invoiceData.notes}</p>
            </div>
          )}

          {/* Audit Info */}
          <div className="text-xs text-gray-500">
            Created by {invoiceData.createdBy} on {invoiceData.createdDate}
            {invoiceData.lastSent && ` • Last sent: ${invoiceData.lastSent}`}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Record Payment
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Send to Customer
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. SEND INVOICE MODAL (Green Gradient)
// ============================================================================
interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber?: string;
  onSend?: (data: any) => void;
}

export function SendInvoiceModal({ isOpen, onClose, invoiceNumber, onSend }: SendInvoiceModalProps) {
  const [recipients, setRecipients] = useState<string[]>(['accounts@abccorp.com']);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState(`Invoice ${invoiceNumber || 'INV-2025-00123'} from Your Company`);
  const [message, setMessage] = useState('Dear Customer,\n\nPlease find attached invoice for your recent purchase. Payment is due within 30 days.\n\nThank you for your business.\n\nBest regards,\nYour Company');
  const [attachPDF, setAttachPDF] = useState(true);
  const [sendCopy, setSendCopy] = useState(false);

  const handleSend = () => {
    console.log('Sending invoice:', { recipients, ccRecipients, subject, message, attachPDF, sendCopy });
    onSend?.({ recipients, ccRecipients, subject, message, attachPDF, sendCopy });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Send Invoice</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* To Recipients */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recipients.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="email"
              placeholder="Add recipient email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setRecipients([...recipients, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* CC Recipients */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">CC (Optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ccRecipients.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => setCcRecipients(ccRecipients.filter((_, i) => i !== index))}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="email"
              placeholder="Add CC recipient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setCcRecipients([...ccRecipients, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={attachPDF}
                onChange={(e) => setAttachPDF(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Attach PDF invoice</span>
                <p className="text-xs text-gray-500">Include invoice as PDF attachment</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={sendCopy}
                onChange={(e) => setSendCopy(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Send me a copy</span>
                <p className="text-xs text-gray-500">Receive a copy of this email</p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-800 font-medium mb-2">📧 Email Preview</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• To: {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}</p>
              <p>• CC: {ccRecipients.length} recipient{ccRecipients.length !== 1 ? 's' : ''}</p>
              <p>• Attachment: {attachPDF ? `Invoice_${invoiceNumber}.pdf` : 'None'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={recipients.length === 0 || !subject}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
