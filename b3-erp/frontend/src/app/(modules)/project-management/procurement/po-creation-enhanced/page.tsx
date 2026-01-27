'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Building2,
  Package,
  Truck,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  X,
  Plus,
  Trash2,
  Search,
  Download,
  Printer,
} from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import {
  useAutoSaveDraft,
  AutoSaveIndicator,
  DraftRecoveryBanner,
  useUnsavedChangesWarning,
  HelpIcon,
  FormProgressIndicator,
} from '@/components/ui/FormUX';

// Field help content
const FIELD_HELP = {
  vendor: {
    title: 'Vendor Selection',
    content: 'Select from approved vendors. Vendor rating and past performance will be displayed.',
  },
  paymentTerms: {
    title: 'Payment Terms',
    content: 'Net 30 = Payment due 30 days after invoice. Advance = Full payment before delivery.',
  },
  deliveryTerms: {
    title: 'Delivery Terms',
    content: 'Ex-Works: Buyer arranges transport. Delivered: Vendor delivers to site.',
  },
  gst: {
    title: 'GST Treatment',
    content: 'CGST+SGST for same-state. IGST for inter-state. Reverse charge for unregistered vendors.',
  },
};

// Types
interface POItem {
  id: string;
  itemCode: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
}

interface FormData {
  // Vendor Details
  vendor: string;
  vendorName: string;
  vendorGstin: string;
  vendorAddress: string;
  vendorContact: string;
  // PO Details
  poDate: string;
  prReference: string;
  projectId: string;
  projectName: string;
  quotationRef: string;
  // Items
  items: POItem[];
  // Delivery
  deliveryAddress: string;
  expectedDelivery: string;
  deliveryTerms: string;
  // Terms
  paymentTerms: string;
  taxType: string;
  notes: string;
  termsAndConditions: string;
}

const STEPS = [
  { id: 'vendor', label: 'Vendor', description: 'Select vendor', icon: Building2 },
  { id: 'items', label: 'Line Items', description: 'Add items', icon: Package },
  { id: 'delivery', label: 'Delivery', description: 'Shipping details', icon: Truck },
  { id: 'terms', label: 'Terms', description: 'Payment & conditions', icon: FileText },
  { id: 'review', label: 'Review', description: 'Confirm and issue', icon: CheckCircle },
];

const initialItems: POItem[] = [
  {
    id: '1',
    itemCode: 'LAM-001',
    description: 'Laminate - White Gloss (Merino)',
    hsnCode: '4411',
    quantity: 25,
    unit: 'sheets',
    unitPrice: 1200,
    discount: 0,
    taxRate: 18,
    amount: 30000,
  },
  {
    id: '2',
    itemCode: 'HNG-001',
    description: 'Hettich Soft Close Hinge 110°',
    hsnCode: '8302',
    quantity: 60,
    unit: 'pcs',
    unitPrice: 250,
    discount: 5,
    taxRate: 18,
    amount: 14250,
  },
];

const initialFormData: FormData = {
  vendor: '',
  vendorName: '',
  vendorGstin: '',
  vendorAddress: '',
  vendorContact: '',
  poDate: new Date().toISOString().split('T')[0],
  prReference: 'PR-2025-001',
  projectId: '',
  projectName: '',
  quotationRef: '',
  items: initialItems,
  deliveryAddress: '',
  expectedDelivery: '',
  deliveryTerms: 'Delivered',
  paymentTerms: 'Net 30',
  taxType: 'CGST+SGST',
  notes: '',
  termsAndConditions: '1. Delivery within specified date is mandatory.\n2. Quality as per approved samples.\n3. Packing must be adequate for safe transport.',
};

export default function POCreationEnhancedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-save draft
  const { lastSaved, isSaving, hasDraft, clearDraft, restoreDraft } = useAutoSaveDraft(
    formData as unknown as Record<string, unknown>,
    { key: 'po-creation-form', debounceMs: 3000 }
  );

  // Unsaved changes warning
  const hasUnsavedChanges = formData.vendor !== '' || formData.items.length > 0;
  useUnsavedChangesWarning(hasUnsavedChanges && !isSubmitting);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    const draft = restoreDraft();
    if (draft) setFormData(draft as unknown as FormData);
  };

  // Form fields for progress
  const formFields = useMemo(() => [
    { name: 'vendor', required: true },
    { name: 'items', required: true, validate: () => formData.items.length > 0 },
    { name: 'deliveryAddress', required: true },
    { name: 'expectedDelivery', required: true },
  ], [formData.items.length]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const totalDiscount = formData.items.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity * item.discount / 100);
    }, 0);
    const taxableAmount = subtotal - totalDiscount;
    const tax = formData.items.reduce((sum, item) => {
      const itemAmount = item.unitPrice * item.quantity * (1 - item.discount / 100);
      return sum + (itemAmount * item.taxRate / 100);
    }, 0);
    return {
      subtotal,
      discount: totalDiscount,
      taxableAmount,
      tax,
      grandTotal: taxableAmount + tax,
      itemCount: formData.items.length,
    };
  }, [formData.items]);

  // Currency formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Update form data
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Item functions
  const addItem = () => {
    const newItem: POItem = {
      id: Date.now().toString(),
      itemCode: '',
      description: '',
      hsnCode: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      amount: 0,
    };
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof POItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount
          const baseAmount = updated.quantity * updated.unitPrice;
          const discountAmount = baseAmount * (updated.discount / 100);
          updated.amount = baseAmount - discountAmount;
          return updated;
        }
        return item;
      }),
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  // Vendor selection
  const selectVendor = (vendorId: string) => {
    const vendors: Record<string, { name: string; gstin: string; address: string; contact: string }> = {
      'VND-001': {
        name: 'Merino Industries Ltd.',
        gstin: '29AAACM1234A1Z5',
        address: 'Industrial Area, Sector 6, Bangalore - 560058',
        contact: 'Rajesh Kumar - +91 98765 43210',
      },
      'VND-002': {
        name: 'Hettich India Pvt Ltd',
        gstin: '27AAACH5678B2Z3',
        address: 'Faridabad Industrial Estate, Haryana - 121001',
        contact: 'Amit Sharma - +91 98123 45678',
      },
      'VND-003': {
        name: 'Hafele India Pvt Ltd',
        gstin: '27AAACH9012C3Z1',
        address: 'Thane Industrial Park, Mumbai - 400601',
        contact: 'Priya Patel - +91 99887 66543',
      },
    };
    const vendor = vendors[vendorId];
    if (vendor) {
      updateFormData('vendor', vendorId);
      updateFormData('vendorName', vendor.name);
      updateFormData('vendorGstin', vendor.gstin);
      updateFormData('vendorAddress', vendor.address);
      updateFormData('vendorContact', vendor.contact);
    }
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 0:
        if (!formData.vendor) newErrors.vendor = 'Please select a vendor';
        break;
      case 1:
        if (formData.items.length === 0) newErrors.items = 'At least one item is required';
        if (formData.items.some(i => !i.description || i.quantity <= 0)) {
          newErrors.items = 'All items must have description and quantity';
        }
        break;
      case 2:
        if (!formData.deliveryAddress) newErrors.deliveryAddress = 'Delivery address is required';
        if (!formData.expectedDelivery) newErrors.expectedDelivery = 'Expected delivery date is required';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const goToPrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('PO Created:', formData);
      clearDraft();
      router.push('/project-management/procurement/vendor-tracking');
    } catch (error) {
      console.error('Error creating PO:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Select Vendor</h2>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'VND-001', name: 'Merino Industries Ltd.', rating: 4.5, category: 'Laminates' },
                { id: 'VND-002', name: 'Hettich India Pvt Ltd', rating: 4.8, category: 'Hardware' },
                { id: 'VND-003', name: 'Hafele India Pvt Ltd', rating: 4.6, category: 'Hardware' },
              ].map((vendor) => (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => selectVendor(vendor.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${formData.vendor === vendor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{vendor.name}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                      {vendor.rating} ★
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{vendor.category}</p>
                  <p className="text-xs text-gray-400 mt-1">{vendor.id}</p>
                </button>
              ))}
            </div>
            {errors.vendor && <p className="text-sm text-red-500">{errors.vendor}</p>}

            {formData.vendor && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-4">
                <h3 className="font-semibold text-green-800 mb-2">Selected Vendor</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium text-gray-900">{formData.vendorName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">GSTIN:</span>
                    <p className="font-medium text-gray-900">{formData.vendorGstin}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Address:</span>
                    <p className="font-medium text-gray-900">{formData.vendorAddress}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Line Items</h2>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Item</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">HSN</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Qty</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Unit</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Rate</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Disc %</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Tax %</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Amount</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={(e) => updateItem(item.id, 'hsnCode', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          min="1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pcs">pcs</option>
                          <option value="sets">sets</option>
                          <option value="sheets">sheets</option>
                          <option value="kg">kg</option>
                          <option value="m">m</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          min="0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-14 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          min="0"
                          max="100"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}
                          className="w-14 px-1 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

            {/* Totals */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="text-gray-900">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-red-600">-{formatCurrency(totals.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST:</span>
                    <span className="text-gray-900">{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-lg">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Factory/Site address for delivery"
                />
                {errors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => updateFormData('expectedDelivery', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.expectedDelivery ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.expectedDelivery && <p className="mt-1 text-sm text-red-500">{errors.expectedDelivery}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Delivery Terms
                  <HelpIcon content={FIELD_HELP.deliveryTerms.content} title={FIELD_HELP.deliveryTerms.title} />
                </label>
                <select
                  value={formData.deliveryTerms}
                  onChange={(e) => updateFormData('deliveryTerms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Delivered">Delivered to Site</option>
                  <option value="Ex-Works">Ex-Works (Pickup)</option>
                  <option value="FOB">FOB (Free on Board)</option>
                  <option value="CIF">CIF (Cost Insurance Freight)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Terms & Conditions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                  <HelpIcon content={FIELD_HELP.paymentTerms.content} title={FIELD_HELP.paymentTerms.title} />
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => updateFormData('paymentTerms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Advance">100% Advance</option>
                  <option value="50-50">50% Advance, 50% on Delivery</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Tax Type
                  <HelpIcon content={FIELD_HELP.gst.content} title={FIELD_HELP.gst.title} />
                </label>
                <select
                  value={formData.taxType}
                  onChange={(e) => updateFormData('taxType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="CGST+SGST">CGST + SGST (Same State)</option>
                  <option value="IGST">IGST (Inter State)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes to Vendor</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Special instructions for the vendor..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => updateFormData('termsAndConditions', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Review Purchase Order</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Vendor Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Vendor Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Vendor:</span>
                    <p className="font-medium text-gray-900">{formData.vendorName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">GSTIN:</span>
                    <p className="font-medium text-gray-900">{formData.vendorGstin}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-2xl font-bold text-gray-900">{totals.itemCount}</p>
                    <p className="text-sm text-gray-500">Items</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(totals.subtotal)}</p>
                    <p className="text-sm text-gray-500">Subtotal</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(totals.tax)}</p>
                    <p className="text-sm text-gray-500">Tax</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(totals.grandTotal)}</p>
                    <p className="text-sm text-blue-700">Grand Total</p>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Delivery Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Expected Date:</span>
                    <p className="font-medium text-gray-900">{formData.expectedDelivery}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Terms:</span>
                    <p className="font-medium text-gray-900">{formData.deliveryTerms}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Address:</span>
                    <p className="font-medium text-gray-900">{formData.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Payment</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Payment Terms:</span>
                    <p className="font-medium text-gray-900">{formData.paymentTerms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tax Type:</span>
                    <p className="font-medium text-gray-900">{formData.taxType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Download Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-4 h-4" />
                Print Preview
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 4: Procurement - Step 4.5</p>
            </div>
            <div className="flex items-center gap-4">
              <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
              <FormProgressIndicator fields={formFields} values={formData as unknown as Record<string, unknown>} variant="circular" size="md" />
            </div>
          </div>

          {hasDraft && currentStep === 0 && (
            <DraftRecoveryBanner hasDraft={hasDraft} onRestore={handleRestoreDraft} onDiscard={clearDraft} />
          )}
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} variant="default" />
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/project-management/procurement')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Issuing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Issue PO
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
