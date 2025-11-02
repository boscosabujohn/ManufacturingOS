'use client';

import { useState } from 'react';
import { X, TrendingUp, User, Building2, MapPin, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';

interface NewTransferPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function NewTransferPromotionModal({ isOpen, onClose, onSubmit }: NewTransferPromotionModalProps) {
  const [formData, setFormData] = useState({
    employeeCode: '',
    employeeName: '',
    type: 'promotion',
    fromDesignation: '',
    toDesignation: '',
    fromDepartment: '',
    toDepartment: '',
    fromLocation: '',
    toLocation: '',
    effectiveDate: '',
    requestedBy: '',
    reason: '',
    salaryIncrement: '',
    currentSalary: '',
    proposedSalary: '',
    justification: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-calculate proposed salary when increment percentage changes
  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const increment = parseFloat(e.target.value) || 0;
    const current = parseFloat(formData.currentSalary) || 0;
    const proposed = current + (current * increment / 100);
    setFormData(prev => ({
      ...prev,
      salaryIncrement: e.target.value,
      proposedSalary: proposed > 0 ? proposed.toFixed(2) : ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              New Transfer/Promotion Request
            </h2>
            <p className="text-green-100 text-sm mt-1">Submit a request for employee career movement</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Request Type */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Request Type
            </h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="promotion"
                  checked={formData.type === 'promotion'}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Promotion</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="transfer"
                  checked={formData.type === 'transfer'}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Transfer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="both"
                  checked={formData.type === 'both'}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Both (Transfer + Promotion)</span>
              </label>
            </div>
          </div>

          {/* Employee Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  placeholder="e.g., KMF2018001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="e.g., Rajesh Kumar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Designation Changes */}
          {(formData.type === 'promotion' || formData.type === 'both') && (
            <div className="mb-6 bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Designation Change
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fromDesignation"
                    value={formData.fromDesignation}
                    onChange={handleChange}
                    placeholder="e.g., Senior Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="toDesignation"
                    value={formData.toDesignation}
                    onChange={handleChange}
                    placeholder="e.g., Team Lead"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Department/Location Changes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Department & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fromDepartment"
                  value={formData.fromDepartment}
                  onChange={handleChange}
                  placeholder="e.g., Production"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="toDepartment"
                  value={formData.toDepartment}
                  onChange={handleChange}
                  placeholder="e.g., Production"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  placeholder="e.g., Plant A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={handleChange}
                  placeholder="e.g., Plant A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Salary Information (for promotions) */}
          {(formData.type === 'promotion' || formData.type === 'both') && (
            <div className="mb-6 bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                Salary Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Salary (Annual) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g., 600000"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Increment (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="salaryIncrement"
                      value={formData.salaryIncrement}
                      onChange={handleIncrementChange}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="e.g., 15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Salary (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="text"
                      value={formData.proposedSalary}
                      readOnly
                      placeholder="Auto-calculated"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              {formData.proposedSalary && (
                <div className="mt-3 text-sm">
                  <p className="text-green-700 font-semibold">
                    Salary Increase: ₹{(parseFloat(formData.proposedSalary) - parseFloat(formData.currentSalary)).toFixed(2)}
                    ({formData.salaryIncrement}%)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Request Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Request Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requested By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  placeholder="e.g., Production Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Request <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                placeholder="Brief reason for this transfer/promotion..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Justification
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                rows={4}
                placeholder="Provide detailed justification including performance, skills, business needs, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-3">Request Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Employee</p>
                <p className="font-semibold text-gray-900">{formData.employeeName || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Type</p>
                <p className="font-semibold text-gray-900">{formData.type.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Effective Date</p>
                <p className="font-semibold text-gray-900">{formData.effectiveDate || '-'}</p>
              </div>
              {(formData.type === 'promotion' || formData.type === 'both') && (
                <>
                  <div>
                    <p className="text-gray-600 text-xs">Designation Change</p>
                    <p className="font-semibold text-gray-900">{formData.fromDesignation || '-'} → {formData.toDesignation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Salary Increment</p>
                    <p className="font-semibold text-green-700">{formData.salaryIncrement ? `+${formData.salaryIncrement}%` : '-'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This request will be sent to the appropriate approvers for review</li>
                  <li>Salary increments require additional management approval</li>
                  <li>Effective date should align with company policy and payroll cycles</li>
                  <li>All supporting documents should be attached separately</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 font-medium transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
