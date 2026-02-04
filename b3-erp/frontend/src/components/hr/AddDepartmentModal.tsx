'use client';

import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, DollarSign, Calendar, Briefcase, Shield } from 'lucide-react';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddDepartmentModal({ isOpen, onClose, onSubmit }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    headOfDepartment: '',
    headEmail: '',
    headPhone: '',
    location: '',
    costCenter: '',
    establishedDate: '',
    budgetAllocation: '',
    description: '',
    status: 'active'
  });

  if (!isOpen) return null;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add New Department
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Department Information
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., PROD, QC, IT"
                  required
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">Unique department identifier (max 10 chars)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Production, Quality Control"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Brief description of department responsibilities and functions..."
              />
            </div>
          </div>

          {/* Department Head Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-700" />
              Department Head Details
            </h3>

            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Head of Department *
                </label>
                <input
                  type="text"
                  value={formData.headOfDepartment}
                  onChange={(e) => updateField('headOfDepartment', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name of department head"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.headEmail}
                    onChange={(e) => updateField('headEmail', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="head@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.headPhone}
                    onChange={(e) => updateField('headPhone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & Cost Center */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Location & Financial Details
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Physical Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Plant 1 - Ground Floor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Cost Center Code *
                </label>
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => updateField('costCenter', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., CC-PROD-001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Established Date *
                </label>
                <input
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) => updateField('establishedDate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Annual Budget Allocation
                </label>
                <input
                  type="number"
                  value={formData.budgetAllocation}
                  onChange={(e) => updateField('budgetAllocation', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="₹ Amount"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Status *
            </label>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <h3 className="font-semibold text-indigo-900 mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-indigo-700">Department:</span>
                <span className="ml-2 font-medium text-indigo-900">
                  {formData.name || 'Not specified'} ({formData.code || 'N/A'})
                </span>
              </div>
              <div>
                <span className="text-indigo-700">Head:</span>
                <span className="ml-2 font-medium text-indigo-900">
                  {formData.headOfDepartment || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-indigo-700">Location:</span>
                <span className="ml-2 font-medium text-indigo-900">
                  {formData.location || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-indigo-700">Cost Center:</span>
                <span className="ml-2 font-medium text-indigo-900">
                  {formData.costCenter || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  <li>Department code must be unique across the organization</li>
                  <li>Cost center code should follow company's accounting structure</li>
                  <li>All employees will be automatically notified of new department</li>
                  <li>Budget allocation is optional and can be updated later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
