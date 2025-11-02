'use client';

import { useState } from 'react';
import { X, Save, Calendar, AlertCircle } from 'lucide-react';

interface LeaveTypeFormData {
  code: string;
  name: string;
  icon: string;
  description: string;
  maxDaysPerYear: number;
  maxConsecutiveDays: number;
  paidLeave: boolean;
  carryForward: boolean;
  carryForwardLimit: number;
  encashable: boolean;
  encashmentLimit: number;
  accrualType: 'none' | 'monthly' | 'yearly';
  accrualRate: number;
  applicableFor: 'all' | 'permanent' | 'contract' | 'probation';
  requiresApproval: boolean;
  requiresDocumentation: boolean;
  isActive: boolean;
}

interface AddLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveTypeFormData) => void;
  editData?: LeaveTypeFormData | null;
}

export function AddLeaveTypeModal({ isOpen, onClose, onSubmit, editData }: AddLeaveTypeModalProps) {
  const [formData, setFormData] = useState<LeaveTypeFormData>(
    editData || {
      code: '',
      name: '',
      icon: '🏖️',
      description: '',
      maxDaysPerYear: 0,
      maxConsecutiveDays: 0,
      paidLeave: true,
      carryForward: false,
      carryForwardLimit: 0,
      encashable: false,
      encashmentLimit: 0,
      accrualType: 'none',
      accrualRate: 0,
      applicableFor: 'all',
      requiresApproval: true,
      requiresDocumentation: false,
      isActive: true
    }
  );

  if (!isOpen) return null;

  const isFormValid =
    formData.code.trim() !== '' &&
    formData.name.trim() !== '' &&
    formData.description.trim() !== '' &&
    formData.maxDaysPerYear > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit(formData);
    onClose();
  };

  const leaveIcons = ['🏖️', '🏥', '👶', '🎉', '⚰️', '📚', '🏠', '💼', '🔄', '🌴'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-bold">{editData ? 'Edit' : 'Add New'} Leave Type</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., EL, SL, CL"
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">Short code for this leave type (max 5 chars)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Earned Leave"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Brief description of this leave type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {leaveIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Entitlement */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entitlement & Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Days Per Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxDaysPerYear}
                  onChange={(e) => setFormData({ ...formData, maxDaysPerYear: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Consecutive Days
                </label>
                <input
                  type="number"
                  value={formData.maxConsecutiveDays}
                  onChange={(e) => setFormData({ ...formData, maxConsecutiveDays: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">0 = No limit</p>
              </div>
            </div>
          </div>

          {/* Accrual */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accrual Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accrual Type
                </label>
                <select
                  value={formData.accrualType}
                  onChange={(e) => setFormData({ ...formData, accrualType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="none">No Accrual (Fixed Allocation)</option>
                  <option value="monthly">Monthly Accrual</option>
                  <option value="yearly">Yearly Allocation</option>
                </select>
              </div>

              {formData.accrualType === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accrual Rate (days/month)
                  </label>
                  <input
                    type="number"
                    value={formData.accrualRate}
                    onChange={(e) => setFormData({ ...formData, accrualRate: parseFloat(e.target.value) || 0 })}
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="paidLeave"
                  checked={formData.paidLeave}
                  onChange={(e) => setFormData({ ...formData, paidLeave: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <label htmlFor="paidLeave" className="font-medium text-gray-900 cursor-pointer">
                    Paid Leave
                  </label>
                  <p className="text-xs text-gray-500">Employee receives full salary during this leave</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="carryForward"
                  checked={formData.carryForward}
                  onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <label htmlFor="carryForward" className="font-medium text-gray-900 cursor-pointer">
                    Carry Forward
                  </label>
                  <p className="text-xs text-gray-500">Unused balance carries to next year</p>
                </div>
              </div>

              {formData.carryForward && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carry Forward Limit (days)
                  </label>
                  <input
                    type="number"
                    value={formData.carryForwardLimit}
                    onChange={(e) => setFormData({ ...formData, carryForwardLimit: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="encashable"
                  checked={formData.encashable}
                  onChange={(e) => setFormData({ ...formData, encashable: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <label htmlFor="encashable" className="font-medium text-gray-900 cursor-pointer">
                    Encashable
                  </label>
                  <p className="text-xs text-gray-500">Can be converted to cash</p>
                </div>
              </div>

              {formData.encashable && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Encashment Limit (days)
                  </label>
                  <input
                    type="number"
                    value={formData.encashmentLimit}
                    onChange={(e) => setFormData({ ...formData, encashmentLimit: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <label htmlFor="requiresApproval" className="font-medium text-gray-900 cursor-pointer">
                    Requires Approval
                  </label>
                  <p className="text-xs text-gray-500">Manager approval needed</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="requiresDocumentation"
                  checked={formData.requiresDocumentation}
                  onChange={(e) => setFormData({ ...formData, requiresDocumentation: e.target.checked })}
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <label htmlFor="requiresDocumentation" className="font-medium text-gray-900 cursor-pointer">
                    Requires Documentation
                  </label>
                  <p className="text-xs text-gray-500">Supporting documents mandatory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applicability */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable For
                </label>
                <select
                  value={formData.applicableFor}
                  onChange={(e) => setFormData({ ...formData, applicableFor: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Employees</option>
                  <option value="permanent">Permanent Only</option>
                  <option value="contract">Contract Only</option>
                  <option value="probation">Probation Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important Notes</p>
                <ul className="list-disc ml-4 space-y-1 text-xs">
                  <li>Leave codes should be unique and easily identifiable</li>
                  <li>Carry forward and encashment limits should comply with company policy</li>
                  <li>Monthly accrual is calculated pro-rata based on working days</li>
                  <li>Changes to active leave types may affect existing balances</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 rounded-b-lg">
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
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {editData ? 'Update' : 'Add'} Leave Type
          </button>
        </div>
      </div>
    </div>
  );
}
