'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  X,
  Building2,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Upload,
  IndianRupee,
  Package,
  Calculator,
} from 'lucide-react';

// TypeScript Interfaces
interface BillLineItem {
  id: string;
  productService: string;
  description: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxableAmount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

interface PayableFormData {
  vendorId: string;
  vendorName: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  poReference: string;
  creditPeriod: number;

  // Line Items
  lineItems: BillLineItem[];

  // Totals
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalGST: number;
  grandTotal: number;

  // Additional Info
  paymentTerms: string;
  notes: string;
  attachments: string[];
}

// Mock data for editing
const mockPayable: PayableFormData = {
  vendorId: 'VEN-2023-0142',
  vendorName: 'JSW Steel Limited',
  billNumber: 'JSW/2025/INV-5678',
  billDate: '2025-09-15',
  dueDate: '2025-10-30',
  poReference: 'PO-2025-1234',
  creditPeriod: 45,

  lineItems: [
    {
      id: '1',
      productService: 'Steel Plates - IS 2062 E250',
      description: 'Hot Rolled Steel Plates, Grade E250, Thickness 12mm',
      hsnSac: '72085100',
      quantity: 50,
      unit: 'MT',
      unitPrice: 48000,
      discount: 2,
      taxableAmount: 2352000,
      gstRate: 18,
      cgst: 211680,
      sgst: 211680,
      igst: 0,
      totalAmount: 2775360,
    },
    {
      id: '2',
      productService: 'Steel Channels - ISMC 100',
      description: 'Indian Standard Medium Channel, Size 100mm',
      hsnSac: '72162100',
      quantity: 20,
      unit: 'MT',
      unitPrice: 52000,
      discount: 0,
      taxableAmount: 1040000,
      gstRate: 18,
      cgst: 93600,
      sgst: 93600,
      igst: 0,
      totalAmount: 1227200,
    },
  ],

  subtotal: 3440000,
  totalDiscount: 48000,
  taxableAmount: 3392000,
  totalCGST: 305280,
  totalSGST: 305280,
  totalIGST: 0,
  totalGST: 610560,
  grandTotal: 4002560,

  paymentTerms: 'Net 45 days from invoice date. Payment via NEFT/RTGS.',
  notes: 'Material to be delivered to Bhiwandi warehouse. Quality certificates required.',
  attachments: ['invoice.pdf', 'po_copy.pdf'],
};

const indianVendors = [
  { id: 'VEN-001', name: 'JSW Steel Limited', category: 'Raw Material' },
  { id: 'VEN-002', name: 'Tata Steel Limited', category: 'Raw Material' },
  { id: 'VEN-003', name: 'Hindalco Industries Ltd', category: 'Raw Material' },
  { id: 'VEN-004', name: 'ACC Cement', category: 'Raw Material' },
  { id: 'VEN-005', name: 'Ultratech Cement Ltd', category: 'Raw Material' },
  { id: 'VEN-006', name: 'Asian Paints Ltd', category: 'Raw Material' },
  { id: 'VEN-007', name: 'Berger Paints India', category: 'Raw Material' },
  { id: 'VEN-008', name: 'VRL Logistics Ltd', category: 'Services' },
  { id: 'VEN-009', name: 'Blue Dart Express', category: 'Services' },
  { id: 'VEN-010', name: 'Mahindra Logistics', category: 'Services' },
];

const gstRates = [0, 5, 12, 18, 28];

const units = ['MT', 'KG', 'PC', 'BOX', 'SET', 'LTR', 'SQM', 'RM', 'NOS'];

export default function EditPayablePage() {
  const router = useRouter();
  const params = useParams();
  const payableId = params.id as string;

  const [formData, setFormData] = useState<PayableFormData>(mockPayable);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateLineItemTotals = (item: Partial<BillLineItem>): BillLineItem => {
    const quantity = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    const discount = item.discount || 0;
    const gstRate = item.gstRate || 0;

    const grossAmount = quantity * unitPrice;
    const discountAmount = (grossAmount * discount) / 100;
    const taxableAmount = grossAmount - discountAmount;

    const gstAmount = (taxableAmount * gstRate) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const igst = 0; // For simplicity, assuming intra-state

    const totalAmount = taxableAmount + gstAmount;

    return {
      id: item.id || Date.now().toString(),
      productService: item.productService || '',
      description: item.description || '',
      hsnSac: item.hsnSac || '',
      quantity,
      unit: item.unit || 'PC',
      unitPrice,
      discount,
      taxableAmount,
      gstRate,
      cgst,
      sgst,
      igst,
      totalAmount,
    };
  };

  const calculateTotals = (items: BillLineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.discount) / 100), 0);
    const taxableAmount = items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalCGST = items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSGST = items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIGST = items.reduce((sum, item) => sum + item.igst, 0);
    const totalGST = totalCGST + totalSGST + totalIGST;
    const grandTotal = taxableAmount + totalGST;

    return {
      subtotal,
      totalDiscount,
      taxableAmount,
      totalCGST,
      totalSGST,
      totalIGST,
      totalGST,
      grandTotal,
    };
  };

  const handleLineItemChange = (index: number, field: keyof BillLineItem, value: any) => {
    const updatedItems = [...formData.lineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Recalculate line item totals
    updatedItems[index] = calculateLineItemTotals(updatedItems[index]);

    // Recalculate overall totals
    const totals = calculateTotals(updatedItems);

    setFormData({
      ...formData,
      lineItems: updatedItems,
      ...totals,
    });
  };

  const addLineItem = () => {
    const newItem: BillLineItem = {
      id: Date.now().toString(),
      productService: '',
      description: '',
      hsnSac: '',
      quantity: 1,
      unit: 'PC',
      unitPrice: 0,
      discount: 0,
      taxableAmount: 0,
      gstRate: 18,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalAmount: 0,
    };

    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, newItem],
    });
  };

  const removeLineItem = (index: number) => {
    const updatedItems = formData.lineItems.filter((_, i) => i !== index);
    const totals = calculateTotals(updatedItems);

    setFormData({
      ...formData,
      lineItems: updatedItems,
      ...totals,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Updated Payable:', formData);
    alert('Payable updated successfully!');
    router.push(`/finance/payables/view/${payableId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDueDateCalculation = (billDate: string, creditDays: number) => {
    const date = new Date(billDate);
    date.setDate(date.getDate() + creditDays);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/finance/payables/view/${payableId}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Payable Details</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Payable</h1>
            <p className="text-sm text-gray-600 mt-1">Update bill and payment details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor & Bill Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-orange-600" />
            Vendor & Bill Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Vendor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.vendorId}
                onChange={(e) => {
                  const vendor = indianVendors.find(v => v.id === e.target.value);
                  setFormData({
                    ...formData,
                    vendorId: e.target.value,
                    vendorName: vendor?.name || '',
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Vendor</option>
                {indianVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Bill Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.billNumber}
                onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter bill number"
                required
              />
            </div>

            {/* Bill Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => {
                  const newDueDate = handleDueDateCalculation(e.target.value, formData.creditPeriod);
                  setFormData({
                    ...formData,
                    billDate: e.target.value,
                    dueDate: newDueDate,
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Credit Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Period (Days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.creditPeriod}
                onChange={(e) => {
                  const creditDays = parseInt(e.target.value) || 0;
                  const newDueDate = handleDueDateCalculation(formData.billDate, creditDays);
                  setFormData({
                    ...formData,
                    creditPeriod: creditDays,
                    dueDate: newDueDate,
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="30"
                min="0"
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* PO Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Reference
              </label>
              <input
                type="text"
                value={formData.poReference}
                onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="PO-2025-XXXX"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-orange-600" />
              Line Items
            </h2>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.lineItems.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Item {index + 1}</h3>
                  {formData.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Product/Service */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product/Service <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.productService}
                      onChange={(e) => handleLineItemChange(index, 'productService', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter product/service name"
                      required
                    />
                  </div>

                  {/* HSN/SAC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HSN/SAC Code
                    </label>
                    <input
                      type="text"
                      value={item.hsnSac}
                      onChange={(e) => handleLineItemChange(index, 'hsnSac', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="HSN/SAC"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleLineItemChange(index, 'unit', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Discount % */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleLineItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  {/* GST Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Rate (%) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.gstRate}
                      onChange={(e) => handleLineItemChange(index, 'gstRate', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      {gstRates.map((rate) => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter item description"
                      rows={2}
                    />
                  </div>

                  {/* Item Summary */}
                  <div className="lg:col-span-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Taxable Amount:</p>
                        <p className="font-bold text-gray-900">{formatCurrency(item.taxableAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CGST ({item.gstRate / 2}%):</p>
                        <p className="font-bold text-gray-900">{formatCurrency(item.cgst)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">SGST ({item.gstRate / 2}%):</p>
                        <p className="font-bold text-gray-900">{formatCurrency(item.sgst)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Amount:</p>
                        <p className="font-bold text-green-600 text-lg">{formatCurrency(item.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-orange-600" />
            Bill Summary
          </h2>

          <div className="max-w-md ml-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(formData.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-semibold text-red-600">- {formatCurrency(formData.totalDiscount)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
              <span className="text-gray-600">Taxable Amount:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(formData.taxableAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CGST:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(formData.totalCGST)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">SGST:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(formData.totalSGST)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total GST:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(formData.totalGST)}</span>
            </div>
            <div className="flex justify-between text-lg border-t-2 border-gray-300 pt-3">
              <span className="font-bold text-gray-900">Grand Total:</span>
              <span className="font-bold text-green-600">{formatCurrency(formData.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-600" />
            Additional Information
          </h2>

          <div className="space-y-4">
            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <textarea
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter payment terms"
                rows={2}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/finance/payables/view/${payableId}`)}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>{isSubmitting ? 'Updating...' : 'Update Payable'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
