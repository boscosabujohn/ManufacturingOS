'use client';

import React, { useState } from 'react';
import { X, Clock, Calendar, AlertCircle, CheckCircle, User, RefreshCw } from 'lucide-react';

interface Shift {
  id: string;
  name: string;
  code: string;
  type: 'day' | 'night' | 'morning' | 'evening' | 'flexible';
  startTime: string;
  endTime: string;
  workingHours: number;
}

interface Employee {
  code: string;
  name: string;
  department: string;
  designation: string;
  currentShift: string;
  currentShiftType: string;
}

interface ChangeShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  employee: Employee;
  availableShifts: Shift[];
}

export function ChangeShiftModal({ isOpen, onClose, onSubmit, employee, availableShifts }: ChangeShiftModalProps) {
  const [selectedShift, setSelectedShift] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedShiftDetails = availableShifts.find(s => s.id === selectedShift);
    onSubmit({
      employeeCode: employee.code,
      employeeName: employee.name,
      currentShift: employee.currentShift,
      newShift: selectedShiftDetails,
      effectiveDate,
      reason,
      sendNotification,
      requiresApproval
    });
    // Reset form
    setSelectedShift('');
    setEffectiveDate('');
    setReason('');
    setSendNotification(true);
    setRequiresApproval(true);
  };

  const getShiftTypeColor = (type: string) => {
    const colors = {
      day: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      night: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      morning: 'bg-orange-100 text-orange-700 border-orange-300',
      evening: 'bg-purple-100 text-purple-700 border-purple-300',
      flexible: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-7 h-7 text-blue-600" />
                Change Shift Assignment
              </h2>
              <p className="text-gray-600 mt-1">Update shift for individual employee</p>
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
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Employee Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{employee.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Employee Code</p>
                <p className="font-semibold text-gray-900">{employee.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{employee.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Designation</p>
                <p className="font-semibold text-gray-900">{employee.designation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-600 mb-1">Current Shift</p>
                <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold border ${getShiftTypeColor(employee.currentShiftType)}`}>
                  {employee.currentShift}
                </span>
              </div>
            </div>
          </div>

          {/* Select New Shift */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Clock className="w-4 h-4 inline mr-1" />
              Select New Shift *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableShifts.map(shift => (
                <label
                  key={shift.id}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedShift === shift.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shift"
                    value={shift.id}
                    checked={selectedShift === shift.id}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="sr-only"
                    required
                  />
                  {selectedShift === shift.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="mb-2">
                    <div className="font-semibold text-gray-900 mb-1">{shift.name}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      {shift.startTime} - {shift.endTime} ({shift.workingHours}h)
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getShiftTypeColor(shift.type)}`}>
                      {shift.type.toUpperCase()}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Effective Date and Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Effective From Date *
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">The new shift will be effective from this date</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Change *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select reason...</option>
                <option value="employee_request">Employee Request</option>
                <option value="operational_requirement">Operational Requirement</option>
                <option value="health_reasons">Health Reasons</option>
                <option value="performance_based">Performance Based</option>
                <option value="department_restructure">Department Restructure</option>
                <option value="skill_utilization">Skill Utilization</option>
                <option value="workload_balancing">Workload Balancing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Send Email Notification</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Employee will receive an email about their shift change
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Requires Manager Approval</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Department manager must approve this shift change before it becomes effective
                </div>
              </div>
            </label>
          </div>

          {/* Summary */}
          {selectedShift && effectiveDate && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Change Summary</h4>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">{employee.name}</span>'s shift will be changed from{' '}
                    <span className="font-semibold">{employee.currentShift}</span> to{' '}
                    <span className="font-semibold">{availableShifts.find(s => s.id === selectedShift)?.name}</span>
                    {' '}starting{' '}
                    <span className="font-semibold">
                      {new Date(effectiveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>.
                    {requiresApproval && ' This change requires manager approval.'}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={!selectedShift || !effectiveDate || !reason}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {requiresApproval ? 'Submit for Approval' : 'Change Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
