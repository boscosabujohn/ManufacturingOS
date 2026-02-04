'use client';

import { useState } from 'react';
import { X, DollarSign, Save, AlertCircle } from 'lucide-react';

interface AddOTRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rateData: {
    grade: string;
    designation: string;
    hourlyRate: number;
    multiplier: number;
    effectiveFrom: string;
    status: 'active' | 'inactive';
  }) => void;
}

export function AddOTRateModal({ isOpen, onClose, onSubmit }: AddOTRateModalProps) {
  const [formData, setFormData] = useState({
    grade: '',
    designation: '',
    hourlyRate: '',
    multiplier: '1.5',
    effectiveFrom: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'inactive'
  });

  if (!isOpen) return null;

  const isFormValid =
    formData.grade.trim() !== '' &&
    formData.designation.trim() !== '' &&
    formData.hourlyRate !== '' &&
    parseFloat(formData.hourlyRate) > 0 &&
    formData.multiplier !== '' &&
    parseFloat(formData.multiplier) > 0 &&
    formData.effectiveFrom !== '';

  const calculateOTRate = () => {
    const rate = parseFloat(formData.hourlyRate) || 0;
    const multiplier = parseFloat(formData.multiplier) || 0;
    return rate * multiplier;
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmit({
      grade: formData.grade,
      designation: formData.designation,
      hourlyRate: parseFloat(formData.hourlyRate),
      multiplier: parseFloat(formData.multiplier),
      effectiveFrom: formData.effectiveFrom,
      status: formData.status
    });

    // Reset form
    setFormData({
      grade: '',
      designation: '',
      hourlyRate: '',
      multiplier: '1.5',
      effectiveFrom: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            <h2 className="text-xl font-bold">Add New OT Rate</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Grade & Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g., E1, M1, S1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter grade code (e.g., E1, E2, M1)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g., Senior Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Job title for this grade</p>
            </div>
          </div>

          {/* Hourly Rate & Multiplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Hourly Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="150"
                step="10"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Regular hourly rate in rupees</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OT Multiplier <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.multiplier}
                onChange={(e) => setFormData({ ...formData, multiplier: e.target.value })}
                placeholder="1.5"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Overtime multiplier (e.g., 1.5x, 2.0x)</p>
            </div>
          </div>

          {/* Calculated OT Rate Display */}
          {formData.hourlyRate && formData.multiplier && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Calculated OT Rate</p>
                  <p className="text-3xl font-bold text-blue-700">
                    ₹{calculateOTRate().toLocaleString('en-IN')}/hr
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{parseFloat(formData.hourlyRate).toLocaleString('en-IN')} × {formData.multiplier}x
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-400" />
              </div>
            </div>
          )}

          {/* Effective Date & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Date from which this rate is applicable</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Current status of this rate</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Information</p>
                <ul className="list-disc ml-4 space-y-1 text-xs">
                  <li>The OT rate is automatically calculated based on base hourly rate × multiplier</li>
                  <li>Special multipliers (weekend, holiday, night shift) will be applied on top of this base OT rate</li>
                  <li>Make sure the grade code is unique and follows your organization's naming convention</li>
                  <li>Active rates will be immediately available for OT calculations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Add OT Rate
          </button>
        </div>
      </div>
    </div>
  );
}
