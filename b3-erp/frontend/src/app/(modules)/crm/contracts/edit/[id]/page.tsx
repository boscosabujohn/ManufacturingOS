'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, X, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

export default function EditContractPage() {
  const router = useRouter();
  const params = useParams();

  // Mock data - in real app, fetch based on params.id
  const [formData, setFormData] = useState({
    title: 'Enterprise Software License Agreement',
    contractNumber: 'CNT-2024-001',
    customerCompany: 'Acme Corporation',
    customer: 'John Smith',
    customerEmail: 'john.smith@acme.com',
    customerPhone: '+1 (555) 123-4567',
    customerAddress: '123 Business St, San Francisco, CA 94105',
    type: 'license' as 'service' | 'subscription' | 'license' | 'support' | 'maintenance' | 'custom',
    status: 'active' as 'draft' | 'active' | 'pending_renewal' | 'expired' | 'terminated' | 'suspended',
    value: '450000',
    recurringValue: '90000',
    billingCycle: 'annually' as 'monthly' | 'quarterly' | 'annually' | 'one-time',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    signedDate: '2023-12-15',
    autoRenew: true,
    renewalNoticeDays: '90',
    paymentTerms: 'Net 30',
    assignedTo: 'Sarah Johnson',
    notes: 'Premium enterprise customer with 24/7 support included. Auto-renewal confirmed by client on 2023-12-10.',
    termsAndConditions: 'Standard enterprise license terms apply. Includes unlimited user licenses for the duration of the contract. Support response time: 4 hours for critical issues, 24 hours for standard issues. Annual price increases capped at 5%.',
  });

  const [tags, setTags] = useState<string[]>(['Enterprise', 'Software', 'Multi-Year']);
  const [deliverables, setDeliverables] = useState<string[]>([
    'Enterprise software license for unlimited users',
    '24/7 premium support',
    'Quarterly business reviews',
    'Priority feature requests',
    'Dedicated account manager',
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock stats
  const stats = {
    totalInvoiced: 90000,
    outstandingAmount: 0,
    createdDate: '2023-11-20',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.contractNumber.trim()) newErrors.contractNumber = 'Contract number is required';
    if (!formData.customerCompany.trim()) newErrors.customerCompany = 'Customer company is required';
    if (!formData.customer.trim()) newErrors.customer = 'Customer name is required';
    if (!formData.value) newErrors.value = 'Contract value is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.paymentTerms.trim()) newErrors.paymentTerms = 'Payment terms are required';
    if (!formData.assignedTo.trim()) newErrors.assignedTo = 'Assignment is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    router.push('/crm/contracts');
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, i) => i !== index));
    }
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contract
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Contract</h1>
          <p className="text-gray-600 mt-2">Update contract information and terms</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contract Number *
                      </label>
                      <input
                        type="text"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.contractNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="CNT-2024-001"
                      />
                      {errors.contractNumber && <p className="text-red-600 text-sm mt-1">{errors.contractNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="pending_renewal">Pending Renewal</option>
                        <option value="expired">Expired</option>
                        <option value="terminated">Terminated</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Enterprise Software License Agreement"
                    />
                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="service">Service</option>
                      <option value="subscription">Subscription</option>
                      <option value="license">License</option>
                      <option value="support">Support</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.customerCompany}
                        onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.customerCompany ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Acme Corporation"
                      />
                      {errors.customerCompany && <p className="text-red-600 text-sm mt-1">{errors.customerCompany}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        value={formData.customer}
                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.customer ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Smith"
                      />
                      {errors.customer && <p className="text-red-600 text-sm mt-1">{errors.customer}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Business St, San Francisco, CA 94105"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Contract Value * ($)
                      </label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        min="0"
                        step="100"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.value ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="450000"
                      />
                      {errors.value && <p className="text-red-600 text-sm mt-1">{errors.value}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recurring Value ($)
                      </label>
                      <input
                        type="number"
                        value={formData.recurringValue}
                        onChange={(e) => setFormData({ ...formData, recurringValue: e.target.value })}
                        min="0"
                        step="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="90000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Cycle
                      </label>
                      <select
                        value={formData.billingCycle}
                        onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                        <option value="one-time">One-Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Terms *
                      </label>
                      <input
                        type="text"
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.paymentTerms ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Net 30"
                      />
                      {errors.paymentTerms && <p className="text-red-600 text-sm mt-1">{errors.paymentTerms}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Period */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Period</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Signed Date
                      </label>
                      <input
                        type="date"
                        value={formData.signedDate}
                        onChange={(e) => setFormData({ ...formData, signedDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Renewal Notice (days)
                      </label>
                      <input
                        type="number"
                        value={formData.renewalNoticeDays}
                        onChange={(e) => setFormData({ ...formData, renewalNoticeDays: e.target.value })}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="90"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.autoRenew}
                          onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Auto-renew contract</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To *
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Sarah Johnson"
                  />
                  {errors.assignedTo && <p className="text-red-600 text-sm mt-1">{errors.assignedTo}</p>}
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Deliverables & Services</h2>
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Deliverable
                  </button>
                </div>
                <div className="space-y-3">
                  {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={deliverable}
                        onChange={(e) => updateDeliverable(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 24/7 premium support"
                      />
                      {deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the terms and conditions of the contract..."
                />
              </div>

              {/* Internal Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h2>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal notes about the contract..."
                />
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tag
                  </button>
                </div>
                <div className="space-y-3">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Enterprise"
                      />
                      {tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-700 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Invoiced</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      ${(stats.totalInvoiced / 1000).toFixed(0)}K
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br rounded-lg p-4 ${
                    stats.outstandingAmount > 0 ? 'from-red-50 to-red-100' : 'from-gray-50 to-gray-100'
                  }`}>
                    <div className={`flex items-center gap-2 mb-1 ${
                      stats.outstandingAmount > 0 ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Outstanding</span>
                    </div>
                    <div className={`text-2xl font-bold ${
                      stats.outstandingAmount > 0 ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      ${(stats.outstandingAmount / 1000).toFixed(1)}K
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Created</div>
                    <div className="text-gray-900">
                      {new Date(stats.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Value</div>
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {formData.value ? `$${(parseInt(formData.value) / 1000).toFixed(0)}K` : '-'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Recurring Value</div>
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        {formData.recurringValue ? `$${(parseInt(formData.recurringValue) / 1000).toFixed(0)}K` : '-'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Contract Type</div>
                    <div className="text-gray-900 capitalize">
                      {formData.type}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div className="text-gray-900 capitalize">
                      {formData.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
