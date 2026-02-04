'use client';

import React, { useState } from 'react';
import { X, DollarSign, Ban, Copy, FileEdit, Printer, Bell, History } from 'lucide-react';

// ==================== RECORD PAYMENT MODAL ====================
interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, invoice }) => {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState(invoice?.amountDue || '125000');
  const [bankAccount, setBankAccount] = useState('');
  const [notes, setNotes] = useState('');
  const [applyToInvoice, setApplyToInvoice] = useState(true);
  const [sendReceipt, setSendReceipt] = useState(true);

  const invoiceAmount = 125000;
  const amountPaid = 0;
  const amountDue = invoiceAmount - amountPaid;
  const paymentAmount = parseFloat(amount) || 0;
  const remainingBalance = amountDue - paymentAmount;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recording payment:', {
      paymentDate,
      paymentMethod,
      referenceNumber,
      amount,
      bankAccount,
      notes,
      applyToInvoice,
      sendReceipt
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Record Payment</h2>
              <p className="text-emerald-100 text-sm">Invoice: INV-2025-001</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Invoice Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 mb-3 border border-emerald-200">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-emerald-700 font-medium mb-1">Invoice Amount</div>
                <div className="text-lg font-bold text-emerald-900">₹{invoiceAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-emerald-700 font-medium mb-1">Amount Due</div>
                <div className="text-lg font-bold text-emerald-900">₹{amountDue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-emerald-700 font-medium mb-1">After Payment</div>
                <div className={`text-lg font-bold ${remainingBalance === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  ₹{remainingBalance.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="upi">UPI</option>
                <option value="neft">NEFT/RTGS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Transaction ID / Cheque No"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deposit To Account <span className="text-red-500">*</span>
              </label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select Bank Account</option>
                <option value="HDFC_CURRENT">HDFC Bank - Current Account (****4521)</option>
                <option value="ICICI_SAVINGS">ICICI Bank - Savings Account (****7893)</option>
                <option value="SBI_CURRENT">SBI - Current Account (****1234)</option>
                <option value="CASH">Cash Account</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Additional notes about this payment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={applyToInvoice}
                onChange={(e) => setApplyToInvoice(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Apply payment to this invoice</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendReceipt}
                onChange={(e) => setSendReceipt(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Send payment receipt to customer via email</span>
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
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-medium"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== VOID INVOICE MODAL ====================
interface VoidInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const VoidInvoiceModal: React.FC<VoidInvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  const [reason, setReason] = useState('');
  const [voidDate, setVoidDate] = useState(new Date().toISOString().split('T')[0]);
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [createCreditNote, setCreateCreditNote] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Voiding invoice:', { reason, voidDate, notifyCustomer, createCreditNote });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Void Invoice</h2>
              <p className="text-red-100 text-sm">INV-2025-001</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
            <div className="flex gap-3">
              <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Warning: This action cannot be undone</h3>
                <p className="text-sm text-red-700">
                  Voiding this invoice will mark it as cancelled. The invoice number will be preserved for audit purposes but cannot be reused or modified.
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2 font-medium">ABC Corporation</span>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <span className="ml-2 font-medium">₹125,000</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-blue-600">Sent</span>
              </div>
              <div>
                <span className="text-gray-600">Invoice Date:</span>
                <span className="ml-2 font-medium">2025-01-15</span>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Void Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={voidDate}
              onChange={(e) => setVoidDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Voiding <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Please explain why this invoice is being voided..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Options */}
          <div className="space-y-3 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Notify customer about invoice cancellation</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={createCreditNote}
                onChange={(e) => setCreateCreditNote(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Create credit note for voided amount</span>
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
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-colors font-medium"
            >
              Void Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== DUPLICATE INVOICE MODAL ====================
interface DuplicateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const DuplicateInvoiceModal: React.FC<DuplicateInvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  const [newInvoiceNumber, setNewInvoiceNumber] = useState('INV-2025-015');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [copyLineItems, setCopyLineItems] = useState(true);
  const [copyNotes, setCopyNotes] = useState(true);
  const [copyAttachments, setCopyAttachments] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Duplicating invoice:', {
      newInvoiceNumber,
      invoiceDate,
      dueDate,
      copyLineItems,
      copyNotes,
      copyAttachments,
      saveAsDraft
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Duplicate Invoice</h2>
              <p className="text-cyan-100 text-sm">Create a copy of INV-2025-001</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Source Invoice Info */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 mb-2 border border-cyan-200">
            <h3 className="font-semibold text-cyan-900 mb-2">Source Invoice</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-cyan-700">Customer:</span>
                <span className="ml-2 font-medium text-cyan-900">ABC Corporation</span>
              </div>
              <div>
                <span className="text-cyan-700">Amount:</span>
                <span className="ml-2 font-medium text-cyan-900">₹125,000</span>
              </div>
              <div>
                <span className="text-cyan-700">Items:</span>
                <span className="ml-2 font-medium text-cyan-900">3 line items</span>
              </div>
              <div>
                <span className="text-cyan-700">Date:</span>
                <span className="ml-2 font-medium text-cyan-900">2025-01-15</span>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Invoice Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newInvoiceNumber}
              onChange={(e) => setNewInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Will be auto-generated if left empty</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Copy Options */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">What to copy?</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={copyLineItems}
                  onChange={(e) => setCopyLineItems(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">Copy all line items</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={copyNotes}
                  onChange={(e) => setCopyNotes(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">Copy notes and terms</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={copyAttachments}
                  onChange={(e) => setCopyAttachments(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">Copy attachments</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={saveAsDraft}
                  onChange={(e) => setSaveAsDraft(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">Save as draft (don't send)</span>
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
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors font-medium"
            >
              Create Duplicate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== INVOICE ADJUSTMENT MODAL ====================
interface InvoiceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const InvoiceAdjustmentModal: React.FC<InvoiceAdjustmentModalProps> = ({ isOpen, onClose, invoice }) => {
  const [adjustmentType, setAdjustmentType] = useState('discount');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentDate, setAdjustmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notifyCustomer, setNotifyCustomer] = useState(false);

  const originalAmount = 125000;
  const adjustment = parseFloat(adjustmentAmount) || 0;
  const newAmount = adjustmentType === 'discount' ? originalAmount - adjustment : originalAmount + adjustment;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adjusting invoice:', {
      adjustmentType,
      adjustmentAmount,
      adjustmentReason,
      adjustmentDate,
      notifyCustomer
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Invoice Adjustment</h2>
              <p className="text-amber-100 text-sm">INV-2025-001</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Amount Summary */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 mb-2 border border-amber-200">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-amber-700 font-medium mb-1">Original Amount</div>
                <div className="text-lg font-bold text-amber-900">₹{originalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-amber-700 font-medium mb-1">Adjustment</div>
                <div className={`text-lg font-bold ${adjustmentType === 'discount' ? 'text-red-600' : 'text-green-600'}`}>
                  {adjustmentType === 'discount' ? '-' : '+'}₹{adjustment.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-amber-700 font-medium mb-1">New Amount</div>
                <div className="text-lg font-bold text-amber-900">₹{newAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="discount">Discount / Reduction</option>
              <option value="additional">Additional Charge</option>
              <option value="correction">Amount Correction</option>
              <option value="writeoff">Write-off</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={adjustmentAmount}
              onChange={(e) => setAdjustmentAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              step="0.01"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={adjustmentDate}
              onChange={(e) => setAdjustmentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Adjustment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              rows={4}
              placeholder="Explain why this adjustment is being made..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Options */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">Notify customer about this adjustment</span>
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
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== PRINT INVOICE OPTIONS MODAL ====================
interface PrintInvoiceOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const PrintInvoiceOptionsModal: React.FC<PrintInvoiceOptionsModalProps> = ({ isOpen, onClose, invoice }) => {
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includePaymentDetails, setIncludePaymentDetails] = useState(true);
  const [showLineItemDetails, setShowLineItemDetails] = useState(true);
  const [orientation, setOrientation] = useState('portrait');
  const [copies, setCopies] = useState('1');
  const [format, setFormat] = useState('pdf');

  if (!isOpen) return null;

  const handlePrint = () => {
    console.log('Printing invoice:', {
      includeLetterhead,
      includeTerms,
      includeNotes,
      includePaymentDetails,
      showLineItemDetails,
      orientation,
      copies,
      format
    });
    onClose();
  };

  const handleDownload = () => {
    console.log('Downloading invoice:', { format });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Print / Download Invoice</h2>
              <p className="text-indigo-100 text-sm">INV-2025-001</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="pdf">PDF Document</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="html">HTML Page</option>
              <option value="print">Direct Print</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Copies
              </label>
              <input
                type="number"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Print Options */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Include in Print</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeLetterhead}
                  onChange={(e) => setIncludeLetterhead(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Company letterhead and logo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLineItemDetails}
                  onChange={(e) => setShowLineItemDetails(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Detailed line item descriptions</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeTerms}
                  onChange={(e) => setIncludeTerms(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Payment terms and conditions</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Additional notes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includePaymentDetails}
                  onChange={(e) => setIncludePaymentDetails(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Bank account details for payment</span>
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
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Download
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PAYMENT REMINDER MODAL ====================
interface PaymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({ isOpen, onClose, invoice }) => {
  const [recipients, setRecipients] = useState<string[]>(['accounts@abccorp.com']);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState('Payment Reminder: Invoice INV-2025-001');
  const [message, setMessage] = useState(
    `Dear Customer,\n\nThis is a friendly reminder that invoice INV-2025-001 for ₹125,000 is currently overdue.\n\nOriginal Due Date: 2025-01-30\nDays Overdue: 5 days\n\nPlease arrange payment at your earliest convenience. If you have already made the payment, please disregard this reminder.\n\nThank you for your business.\n\nBest regards,\nAccounts Team`
  );
  const [reminderType, setReminderType] = useState('friendly');
  const [attachInvoice, setAttachInvoice] = useState(true);
  const [attachStatement, setAttachStatement] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending payment reminder:', {
      recipients,
      ccRecipients,
      subject,
      message,
      reminderType,
      attachInvoice,
      attachStatement
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Send Payment Reminder</h2>
              <p className="text-orange-100 text-sm">INV-2025-001 • ₹125,000 • 5 days overdue</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Type
            </label>
            <select
              value={reminderType}
              onChange={(e) => setReminderType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="friendly">Friendly Reminder (1st Notice)</option>
              <option value="second">Second Notice</option>
              <option value="final">Final Notice</option>
              <option value="urgent">Urgent - Legal Action Warning</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To (Recipients)
            </label>
            <input
              type="email"
              value={recipients[0]}
              onChange={(e) => setRecipients([e.target.value])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Attachments */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Attachments</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={attachInvoice}
                  onChange={(e) => setAttachInvoice(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Attach invoice PDF (INV-2025-001.pdf)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={attachStatement}
                  onChange={(e) => setAttachStatement(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Attach customer account statement</span>
              </label>
            </div>
          </div>

          {/* Warning for Urgent */}
          {reminderType === 'urgent' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
              <div className="flex gap-3">
                <Bell className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Urgent Notice</h3>
                  <p className="text-sm text-red-700">
                    This reminder includes legal action warnings. Please ensure you have authorization and proper documentation before sending.
                  </p>
                </div>
              </div>
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
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-medium"
            >
              Send Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== INVOICE HISTORY MODAL ====================
interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({ isOpen, onClose, invoice }) => {
  const historyEvents = [
    {
      id: 1,
      timestamp: '2025-02-04 03:45 PM',
      user: 'Jane Smith',
      action: 'Payment Reminder Sent',
      details: 'Second notice sent to accounts@abccorp.com',
      icon: '📧',
      color: 'text-orange-600'
    },
    {
      id: 2,
      timestamp: '2025-02-01 10:30 AM',
      user: 'System',
      action: 'Invoice Overdue',
      details: 'Invoice became overdue (Due: 2025-01-30)',
      icon: '⚠️',
      color: 'text-red-600'
    },
    {
      id: 3,
      timestamp: '2025-01-25 02:15 PM',
      user: 'Jane Smith',
      action: 'Payment Reminder Sent',
      details: 'First reminder sent to accounts@abccorp.com',
      icon: '📧',
      color: 'text-blue-600'
    },
    {
      id: 4,
      timestamp: '2025-01-15 04:20 PM',
      user: 'John Doe',
      action: 'Invoice Sent',
      details: 'Invoice emailed to customer',
      icon: '✉️',
      color: 'text-green-600'
    },
    {
      id: 5,
      timestamp: '2025-01-15 04:15 PM',
      user: 'John Doe',
      action: 'Invoice Approved',
      details: 'Invoice approved and ready to send',
      icon: '✅',
      color: 'text-green-600'
    },
    {
      id: 6,
      timestamp: '2025-01-15 11:30 AM',
      user: 'Sarah Wilson',
      action: 'Line Items Updated',
      details: 'Modified 2 line items, adjusted tax calculations',
      icon: '✏️',
      color: 'text-blue-600'
    },
    {
      id: 7,
      timestamp: '2025-01-15 09:00 AM',
      user: 'John Doe',
      action: 'Invoice Created',
      details: 'Draft invoice created for ABC Corporation',
      icon: '📄',
      color: 'text-gray-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-gray-700 text-white px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Invoice History</h2>
              <p className="text-slate-100 text-sm">INV-2025-001 • Complete audit trail</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Events */}
            <div className="space-y-3">
              {historyEvents.map((event, index) => (
                <div key={event.id} className="relative flex gap-2">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-2xl">
                      {event.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold ${event.color}`}>{event.action}</h3>
                      <span className="text-xs text-gray-500">{event.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{event.details}</p>
                    <div className="text-xs text-gray-500">
                      By: <span className="font-medium">{event.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-3 py-2 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total Events: <span className="font-semibold">{historyEvents.length}</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-lg hover:from-slate-700 hover:to-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
