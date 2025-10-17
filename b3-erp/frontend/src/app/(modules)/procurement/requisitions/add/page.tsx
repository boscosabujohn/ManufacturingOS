'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Send,
  User,
  Building2,
  Calendar,
  FileText,
  AlertCircle,
  Package,
  DollarSign,
  Search,
  Upload,
  MessageSquare,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Info,
  FileSignature,
} from 'lucide-react';

// TypeScript Interfaces
interface RequisitionItem {
  id: string;
  itemCode: string;
  description: string;
  specifications: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  preferredVendor: string;
  category: 'raw_materials' | 'spare_parts' | 'consumables' | 'capital_goods' | 'services' | '';
}

interface RequisitionFormData {
  prNumber: string;
  requestedBy: string;
  requesterEmail: string;
  requesterDepartment: string;
  requestDate: string;
  requiredByDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | '';
  purpose: string;
  justification: string;
  budgetCode: string;
  costCenter: string;
  items: RequisitionItem[];
  notes: string;
  attachments: File[];
}

const departments = [
  'Production',
  'Maintenance',
  'Quality Control',
  'R&D',
  'Administration',
  'IT',
  'Sales & Marketing',
  'Finance',
  'HR',
  'Logistics',
  'Warehouse',
];

const priorities = [
  {
    value: 'low',
    label: 'Low',
    description: 'Can wait, no urgent need. Normal procurement cycle.',
    color: 'green',
    icon: '🟢'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Required for regular operations. Standard processing.',
    color: 'yellow',
    icon: '🟡'
  },
  {
    value: 'high',
    label: 'High',
    description: 'Important for production continuity. Expedited approval needed.',
    color: 'orange',
    icon: '🟠'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Critical - Immediate action required. Production stoppage risk.',
    color: 'red',
    icon: '🔴'
  },
];

const categories = [
  { value: 'raw_materials', label: 'Raw Materials', description: 'Materials used in production' },
  { value: 'spare_parts', label: 'Spare Parts', description: 'Machinery and equipment parts' },
  { value: 'consumables', label: 'Consumables', description: 'Items consumed in operations' },
  { value: 'capital_goods', label: 'Capital Goods', description: 'Long-term assets and equipment' },
  { value: 'services', label: 'Services', description: 'Professional and maintenance services' },
];

const units = [
  'Nos',
  'Pcs',
  'Sets',
  'Kg',
  'Liters',
  'Meters',
  'Sheets',
  'Drums',
  'Boxes',
  'Rolls',
  'Hours',
  'Days',
];

// Mock catalog items for search
const catalogItems = [
  { code: 'SP-CNC-2045', description: 'CNC Router Spindle Bearing Assembly', category: 'spare_parts', unit: 'Nos', estimatedPrice: 12500 },
  { code: 'RM-PLY-001', description: 'Commercial Grade Plywood 19mm', category: 'raw_materials', unit: 'Sheets', estimatedPrice: 1850 },
  { code: 'RM-HW-2567', description: 'Stainless Steel Cabinet Hinges', category: 'raw_materials', unit: 'Nos', estimatedPrice: 180 },
  { code: 'CONS-ADH-789', description: 'Industrial Wood Adhesive', category: 'consumables', unit: 'Drums', estimatedPrice: 2500 },
  { code: 'SP-HYD-1234', description: 'Hydraulic Cylinder Seal Kit', category: 'spare_parts', unit: 'Sets', estimatedPrice: 3500 },
];

export default function AddRequisitionPage() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<RequisitionFormData>({
    prNumber: `PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    requestedBy: 'Anil Kumar Sharma',
    requesterEmail: 'anil.sharma@b3macbis.com',
    requesterDepartment: '',
    requestDate: today,
    requiredByDate: '',
    priority: '',
    purpose: '',
    justification: '',
    budgetCode: '',
    costCenter: '',
    items: [],
    notes: '',
    attachments: [],
  });

  const [newItem, setNewItem] = useState<Partial<RequisitionItem>>({
    itemCode: '',
    description: '',
    specifications: '',
    quantity: 0,
    unit: 'Nos',
    estimatedUnitPrice: 0,
    estimatedTotal: 0,
    preferredVendor: '',
    category: '',
  });

  const [showItemSearch, setShowItemSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showApprovalRoute, setShowApprovalRoute] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof RequisitionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.requesterDepartment) newErrors.requesterDepartment = 'Department is required';
    if (!formData.requiredByDate) newErrors.requiredByDate = 'Required by date is required';
    if (formData.requiredByDate <= formData.requestDate) newErrors.requiredByDate = 'Must be a future date';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (formData.purpose.length < 20) newErrors.purpose = 'Purpose must be at least 20 characters';
    if (formData.justification.length < 50) newErrors.justification = 'Justification must be at least 50 characters for approval';
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectItemFromCatalog = (item: typeof catalogItems[0]) => {
    setNewItem({
      itemCode: item.code,
      description: item.description,
      specifications: '',
      quantity: 1,
      unit: item.unit,
      estimatedUnitPrice: item.estimatedPrice,
      estimatedTotal: item.estimatedPrice,
      preferredVendor: '',
      category: item.category as any,
    });
    setShowItemSearch(false);
    setSearchQuery('');
  };

  const addItem = () => {
    if (newItem.itemCode && newItem.description && newItem.quantity && newItem.quantity > 0 && newItem.category) {
      const item: RequisitionItem = {
        id: Date.now().toString(),
        itemCode: newItem.itemCode || '',
        description: newItem.description || '',
        specifications: newItem.specifications || '',
        quantity: newItem.quantity || 0,
        unit: newItem.unit || 'Nos',
        estimatedUnitPrice: newItem.estimatedUnitPrice || 0,
        estimatedTotal: (newItem.quantity || 0) * (newItem.estimatedUnitPrice || 0),
        preferredVendor: newItem.preferredVendor || '',
        category: newItem.category || 'raw_materials',
      };
      updateFormData('items', [...formData.items, item]);
      setNewItem({
        itemCode: '',
        description: '',
        specifications: '',
        quantity: 0,
        unit: 'Nos',
        estimatedUnitPrice: 0,
        estimatedTotal: 0,
        preferredVendor: '',
        category: '',
      });
      if (errors.items) {
        setErrors(prev => ({ ...prev, items: '' }));
      }
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    updateFormData('items', updatedItems);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.estimatedTotal, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveDraft = () => {
    console.log('Saving as draft:', formData);
    router.push('/procurement/requisitions');
  };

  const handleSubmitForApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Submitting for approval:', formData);
      router.push('/procurement/requisitions');
    } else {
      alert('Please fix all errors before submitting');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/procurement/requisitions');
    }
  };

  const filteredCatalogItems = catalogItems.filter(item =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getApprovalRoute = () => {
    const totalValue = calculateTotal();
    if (totalValue < 100000) {
      return [
        { level: 'L1', role: 'Department Manager', name: 'Rajesh Patel' },
        { level: 'L2', role: 'Finance Manager', name: 'Priya Sharma' },
      ];
    } else if (totalValue < 500000) {
      return [
        { level: 'L1', role: 'Department Manager', name: 'Rajesh Patel' },
        { level: 'L2', role: 'Finance Manager', name: 'Priya Sharma' },
        { level: 'L3', role: 'Director - Operations', name: 'Vijay Deshmukh' },
      ];
    } else {
      return [
        { level: 'L1', role: 'Department Manager', name: 'Rajesh Patel' },
        { level: 'L2', role: 'Finance Manager', name: 'Priya Sharma' },
        { level: 'L3', role: 'Director - Operations', name: 'Vijay Deshmukh' },
        { level: 'L4', role: 'Managing Director', name: 'Sandeep Verma' },
      ];
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Requisitions</span>
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">New Purchase Requisition</h1>
              <p className="text-sm text-gray-600">Auto-generated PR Number: <span className="font-semibold text-blue-600">{formData.prNumber}</span></p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save as Draft</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitForApproval}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Submit for Approval</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitForApproval} className="space-y-6">
        {/* Requester Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="h-6 w-6 mr-2 text-blue-600" />
            Requester Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested By
              </label>
              <input
                type="text"
                value={formData.requestedBy}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Auto-filled with logged-in user</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.requesterEmail}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.requesterDepartment}
                onChange={(e) => updateFormData('requesterDepartment', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.requesterDepartment ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.requesterDepartment && (
                <p className="text-xs text-red-500 mt-1">{errors.requesterDepartment}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Date
              </label>
              <input
                type="date"
                value={formData.requestDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Defaults to today</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required By Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.requiredByDate}
                onChange={(e) => updateFormData('requiredByDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.requiredByDate ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                min={today}
              />
              {errors.requiredByDate && (
                <p className="text-xs text-red-500 mt-1">{errors.requiredByDate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Must be a future date</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Code / Cost Center
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.budgetCode}
                  onChange={(e) => updateFormData('budgetCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Budget Code"
                />
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => updateFormData('costCenter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cost Center"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Optional - If applicable</p>
            </div>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
            Priority Level <span className="text-red-500 ml-1">*</span>
          </h2>
          {errors.priority && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.priority}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {priorities.map((priority) => (
              <div
                key={priority.value}
                onClick={() => updateFormData('priority', priority.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.priority === priority.value
                    ? `border-${priority.color}-500 bg-${priority.color}-50 shadow-md`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{priority.icon}</span>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.priority === priority.value}
                      onChange={() => updateFormData('priority', priority.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="ml-2 font-bold text-gray-900">{priority.label}</label>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{priority.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose & Justification */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Purpose & Justification
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => updateFormData('purpose', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.purpose ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the purpose of this requisition (minimum 20 characters)..."
                required
                minLength={20}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.purpose ? (
                  <p className="text-xs text-red-500">{errors.purpose}</p>
                ) : (
                  <p className="text-xs text-gray-500">Minimum 20 characters</p>
                )}
                <p className="text-xs text-gray-500">{formData.purpose.length} characters</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.justification}
                onChange={(e) => updateFormData('justification', e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.justification ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed justification for approval. Explain why these items are needed, the business impact, and urgency (minimum 50 characters)..."
                required
                minLength={50}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.justification ? (
                  <p className="text-xs text-red-500">{errors.justification}</p>
                ) : (
                  <p className="text-xs text-gray-500">Minimum 50 characters required for approval</p>
                )}
                <p className={`text-xs ${formData.justification.length >= 50 ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                  {formData.justification.length} / 50 characters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-600" />
            Line Items <span className="text-red-500 ml-1">*</span>
            <span className="ml-3 text-sm font-normal text-gray-600">({formData.items.length} items)</span>
          </h2>

          {errors.items && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.items}
            </div>
          )}

          {/* Existing Items */}
          {formData.items.length > 0 && (
            <div className="space-y-4 mb-6">
              {formData.items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Item {index + 1}</h4>
                      <p className="text-xs text-gray-600 mt-1">{item.itemCode} - {item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Category</p>
                      <p className="font-semibold text-gray-900">{item.category.replace(/_/g, ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Quantity</p>
                      <p className="font-semibold text-gray-900">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Unit Price</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(item.estimatedUnitPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Total</p>
                      <p className="font-bold text-green-600">{formatCurrency(item.estimatedTotal)}</p>
                    </div>
                  </div>

                  {item.specifications && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500">Specifications</p>
                      <p className="text-xs text-gray-700">{item.specifications}</p>
                    </div>
                  )}

                  {item.preferredVendor && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500">Preferred Vendor</p>
                      <p className="text-xs text-gray-700">{item.preferredVendor}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add New Item */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-blue-600" />
              Add New Item
            </h4>

            <div className="space-y-4">
              {/* Item Search/Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Search Item from Catalog or Enter Manually
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newItem.itemCode || searchQuery}
                    onChange={(e) => {
                      setNewItem({ ...newItem, itemCode: e.target.value });
                      setSearchQuery(e.target.value);
                      setShowItemSearch(e.target.value.length > 0);
                    }}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by item code or description..."
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {/* Search Results Dropdown */}
                {showItemSearch && searchQuery && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCatalogItems.length > 0 ? (
                      filteredCatalogItems.map((item) => (
                        <div
                          key={item.code}
                          onClick={() => selectItemFromCatalog(item)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.code}</p>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                            <p className="text-sm font-bold text-green-600">{formatCurrency(item.estimatedPrice)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-600">
                        No items found. You can enter details manually.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Item description"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => {
                        const qty = parseFloat(e.target.value) || 0;
                        setNewItem({
                          ...newItem,
                          quantity: qty,
                          estimatedTotal: qty * (newItem.estimatedUnitPrice || 0)
                        });
                      }}
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-1/3 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {units.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Est. Unit Price</label>
                  <input
                    type="number"
                    value={newItem.estimatedUnitPrice}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      setNewItem({
                        ...newItem,
                        estimatedUnitPrice: price,
                        estimatedTotal: (newItem.quantity || 0) * price
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Specifications</label>
                  <input
                    type="text"
                    value={newItem.specifications}
                    onChange={(e) => setNewItem({ ...newItem, specifications: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Technical specifications (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Vendor</label>
                  <input
                    type="text"
                    value={newItem.preferredVendor}
                    onChange={(e) => setNewItem({ ...newItem, preferredVendor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Suggest a vendor (optional)"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-gray-600">
                  {newItem.quantity && newItem.estimatedUnitPrice ? (
                    <span className="font-semibold">
                      Item Total: <span className="text-green-600">{formatCurrency((newItem.quantity || 0) * (newItem.estimatedUnitPrice || 0))}</span>
                    </span>
                  ) : (
                    <span>Enter quantity and price to calculate total</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!newItem.itemCode || !newItem.description || !newItem.quantity || !newItem.category}
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Total */}
          {formData.items.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">Estimated Total Value:</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
            Additional Notes
          </h2>
          <textarea
            value={formData.notes}
            onChange={(e) => updateFormData('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes, special instructions, or urgency details..."
          />
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Upload className="h-6 w-6 mr-2 text-blue-600" />
            Attachments
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">Upload specifications, technical drawings, vendor quotes, or supporting documents</p>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG, DOC, XLS (Max 10MB each)</p>
          </div>
        </div>

        {/* Approval Route Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileSignature className="h-6 w-6 mr-2 text-blue-600" />
              Approval Route
            </h2>
            <button
              type="button"
              onClick={() => setShowApprovalRoute(!showApprovalRoute)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showApprovalRoute ? 'Hide' : 'Show'} Approval Chain
            </button>
          </div>

          {showApprovalRoute && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-4">
                <Info className="inline h-4 w-4 mr-1 text-blue-600" />
                This requisition will go through the following approval levels based on total value:
              </p>
              <div className="flex items-center space-x-2">
                {getApprovalRoute().map((approver, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-white border border-blue-300 rounded-lg p-3 min-w-[150px]">
                      <p className="text-xs font-bold text-blue-600">{approver.level}</p>
                      <p className="text-sm font-semibold text-gray-900">{approver.name}</p>
                      <p className="text-xs text-gray-600">{approver.role}</p>
                    </div>
                    {index < getApprovalRoute().length - 1 && (
                      <div className="h-0.5 w-8 bg-blue-400"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              All fields marked with <span className="text-red-500">*</span> are required for submission
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                <Save className="h-5 w-5" />
                <span>Save as Draft</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Send className="h-5 w-5" />
                <span>Submit for Approval</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
