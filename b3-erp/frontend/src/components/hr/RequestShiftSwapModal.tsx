'use client';

import React, { useState } from 'react';
import { X, RefreshCw, Calendar, User, Clock, AlertCircle, Search, CheckCircle } from 'lucide-react';

interface Employee {
  code: string;
  name: string;
  department: string;
  designation: string;
  currentShift: string;
  shiftType: 'day' | 'night' | 'morning' | 'evening' | 'flexible';
}

interface RequestShiftSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currentEmployee: Employee;
  availableEmployees: Employee[];
}

export function RequestShiftSwapModal({ isOpen, onClose, onSubmit, currentEmployee, availableEmployees }: RequestShiftSwapModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [swapDate, setSwapDate] = useState('');
  const [reason, setReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredEmployees = availableEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...Array.from(new Set(availableEmployees.map(e => e.department)))];
  const selectedEmp = availableEmployees.find(e => e.code === selectedEmployee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fromEmployee: {
        code: currentEmployee.code,
        name: currentEmployee.name,
        shift: currentEmployee.currentShift
      },
      toEmployee: {
        code: selectedEmp?.code,
        name: selectedEmp?.name,
        shift: selectedEmp?.currentShift
      },
      swapDate,
      reason,
      additionalNotes
    });
    // Reset form
    setSelectedEmployee('');
    setSwapDate('');
    setReason('');
    setAdditionalNotes('');
    setSearchTerm('');
    setDepartmentFilter('all');
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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-7 h-7 text-blue-600" />
                Request Shift Swap
              </h2>
              <p className="text-gray-600 mt-1">Exchange shift with another employee</p>
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
          {/* Your Current Shift */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Current Shift
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{currentEmployee.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Employee Code</p>
                <p className="font-semibold text-gray-900">{currentEmployee.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{currentEmployee.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Designation</p>
                <p className="font-semibold text-gray-900">{currentEmployee.designation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-600 mb-1">Current Shift</p>
                <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold border ${getShiftTypeColor(currentEmployee.shiftType)}`}>
                  {currentEmployee.currentShift}
                </span>
              </div>
            </div>
          </div>

          {/* Select Employee to Swap With */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
                Select Employee to Swap With
              </h3>
            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or employee code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Selection */}
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No employees found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredEmployees.map(emp => (
                    <label
                      key={emp.code}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                        selectedEmployee === emp.code ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="employee"
                        value={emp.code}
                        checked={selectedEmployee === emp.code}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        required
                      />
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold text-sm">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{emp.name}</span>
                          {selectedEmployee === emp.code && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{emp.code} • {emp.department}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getShiftTypeColor(emp.shiftType)}`}>
                          {emp.currentShift}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              Swap Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Swap Date *
                </label>
                <input
                  type="date"
                  value={swapDate}
                  onChange={(e) => setSwapDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Date when the shift swap will occur</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Swap *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select reason...</option>
                  <option value="personal_commitment">Personal Commitment</option>
                  <option value="medical_appointment">Medical Appointment</option>
                  <option value="family_function">Family Function</option>
                  <option value="emergency">Emergency</option>
                  <option value="training">Training/Workshop</option>
                  <option value="travel">Travel Plan</option>
                  <option value="childcare">Childcare</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Provide additional details about why you need this swap..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Swap Preview */}
          {selectedEmployee && swapDate && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap Preview</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">You</div>
                    <div className="font-semibold text-gray-900 mb-2">{currentEmployee.name}</div>
                    <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold border ${getShiftTypeColor(currentEmployee.shiftType)}`}>
                      {currentEmployee.currentShift}
                    </span>
                  </div>
                  <div className="px-4">
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-sm text-gray-600 mb-1">Swap With</div>
                    <div className="font-semibold text-gray-900 mb-2">{selectedEmp?.name}</div>
                    <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold border ${getShiftTypeColor(selectedEmp?.shiftType || 'day')}`}>
                      {selectedEmp?.currentShift}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Swap Date:</span>
                    <span>{new Date(swapDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Information Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <h4 className="font-semibold text-yellow-900 mb-1">Important Information</h4>
                <ul className="text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Both employees must agree to the swap</li>
                  <li>Manager approval is required before the swap is confirmed</li>
                  <li>The other employee will receive a notification about this request</li>
                  <li>Swap can be cancelled if not yet approved</li>
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
              disabled={!selectedEmployee || !swapDate || !reason}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Submit Swap Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
