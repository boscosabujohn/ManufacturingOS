'use client';

import React, { useState } from 'react';
import { X, Clock, Calendar, AlertCircle, CheckCircle, Calculator, User } from 'lucide-react';

interface NewOvertimeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function NewOvertimeRequestModal({ isOpen, onClose, onSubmit }: NewOvertimeRequestModalProps) {
  const [formData, setFormData] = useState({
    employeeCode: '',
    employeeName: '',
    department: '',
    designation: '',
    otDate: '',
    shiftType: '',
    shiftStartTime: '',
    shiftEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
    breakDuration: '60',
    reason: '',
    workDescription: '',
    managerApproval: true
  });

  const [calculatedHours, setCalculatedHours] = useState({
    regularHours: 0,
    overtimeHours: 0,
    estimatedAmount: 0
  });

  const calculateOvertimeHours = () => {
    if (formData.shiftEndTime && formData.actualEndTime) {
      const shiftEnd = new Date(`2024-01-01T${formData.shiftEndTime}`);
      const actualEnd = new Date(`2024-01-01T${formData.actualEndTime}`);

      let otMinutes = (actualEnd.getTime() - shiftEnd.getTime()) / (1000 * 60);

      // Handle overnight work
      if (otMinutes < 0) {
        otMinutes += 24 * 60;
      }

      // Subtract break if applicable
      const breakMin = parseInt(formData.breakDuration);
      otMinutes -= breakMin;

      const otHours = Math.max(0, otMinutes / 60);
      const regularHours = 8; // Standard shift hours

      // Assuming ₹250 per OT hour (can be dynamic based on employee grade)
      const estimatedAmount = Math.round(otHours * 250);

      setCalculatedHours({
        regularHours,
        overtimeHours: parseFloat(otHours.toFixed(2)),
        estimatedAmount
      });
    }
  };

  React.useEffect(() => {
    calculateOvertimeHours();
  }, [formData.shiftEndTime, formData.actualEndTime, formData.breakDuration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      regularHours: calculatedHours.regularHours,
      overtimeHours: calculatedHours.overtimeHours,
      calculatedAmount: calculatedHours.estimatedAmount,
      requestDate: new Date().toISOString().split('T')[0]
    });
    // Reset form
    setFormData({
      employeeCode: '',
      employeeName: '',
      department: '',
      designation: '',
      otDate: '',
      shiftType: '',
      shiftStartTime: '',
      shiftEndTime: '',
      actualStartTime: '',
      actualEndTime: '',
      breakDuration: '60',
      reason: '',
      workDescription: '',
      managerApproval: true
    });
    setCalculatedHours({ regularHours: 0, overtimeHours: 0, estimatedAmount: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-7 h-7 text-blue-600" />
                New Overtime Request
              </h2>
              <p className="text-gray-600 mt-1">Submit overtime work request for approval</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Employee Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Code *
                </label>
                <input
                  type="text"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  placeholder="e.g., KMF2020001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  placeholder="Full name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  <option value="Production">Production</option>
                  <option value="Quality">Quality</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g., Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Overtime Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              Overtime Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  OT Date *
                </label>
                <input
                  type="date"
                  value={formData.otDate}
                  onChange={(e) => setFormData({ ...formData, otDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Type *
                </label>
                <select
                  value={formData.shiftType}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select shift type</option>
                  <option value="General Day Shift">General Day Shift (9 AM - 6 PM)</option>
                  <option value="Morning Shift">Morning Shift (6 AM - 3 PM)</option>
                  <option value="Evening Shift">Evening Shift (3 PM - 12 AM)</option>
                  <option value="Night Shift">Night Shift (10 PM - 7 AM)</option>
                  <option value="Flexible Shift">Flexible Shift</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
              Time Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Start Time *
                </label>
                <input
                  type="time"
                  value={formData.shiftStartTime}
                  onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift End Time *
                </label>
                <input
                  type="time"
                  value={formData.shiftEndTime}
                  onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.breakDuration}
                  onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
                  min="0"
                  step="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Start Time *
                </label>
                <input
                  type="time"
                  value={formData.actualStartTime}
                  onChange={(e) => setFormData({ ...formData, actualStartTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">When you actually started work</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual End Time *
                </label>
                <input
                  type="time"
                  value={formData.actualEndTime}
                  onChange={(e) => setFormData({ ...formData, actualEndTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">When you finished overtime work</p>
              </div>
            </div>
          </div>

          {/* Calculated Hours */}
          {calculatedHours.overtimeHours > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Calculated Hours & Amount</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Regular Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{calculatedHours.regularHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overtime Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{calculatedHours.overtimeHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{calculatedHours.estimatedAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">*Based on standard OT rate of ₹250/hour</p>
            </div>
          )}

          {/* Reason & Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">4</span>
              Reason & Work Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Overtime *
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select reason</option>
                  <option value="Urgent production target completion">Urgent production target completion</option>
                  <option value="Equipment maintenance">Equipment maintenance</option>
                  <option value="Quality inspection">Quality inspection</option>
                  <option value="Server/IT maintenance">Server/IT maintenance</option>
                  <option value="Client delivery deadline">Client delivery deadline</option>
                  <option value="Month-end closing">Month-end closing</option>
                  <option value="Special project">Special project</option>
                  <option value="Emergency work">Emergency work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Description *
                </label>
                <textarea
                  value={formData.workDescription}
                  onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                  placeholder="Describe the work performed during overtime..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Manager Approval */}
          <div className="mb-6">
            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.managerApproval}
                onChange={(e) => setFormData({ ...formData, managerApproval: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Send to Manager for Approval</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Your department manager will receive this request for approval
                </div>
              </div>
            </label>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <h4 className="font-semibold text-blue-900 mb-1">Important Information</h4>
                <ul className="text-blue-800 space-y-1 list-disc list-inside">
                  <li>Overtime must be pre-approved by your manager</li>
                  <li>Submit requests within 48 hours of completing the overtime work</li>
                  <li>Attach supporting documents if required</li>
                  <li>Overtime payment will be processed in the next payroll cycle</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.employeeCode || !formData.employeeName || !formData.department || !formData.otDate || !formData.shiftType || !formData.reason || !formData.workDescription || calculatedHours.overtimeHours <= 0}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Submit OT Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
