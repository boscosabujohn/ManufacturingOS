'use client';

import React, { useState } from 'react';
import { X, Users, Clock, Calendar, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface Employee {
  code: string;
  name: string;
  department: string;
  currentShift: string;
}

interface Shift {
  id: string;
  name: string;
  code: string;
  type: 'day' | 'night' | 'morning' | 'evening' | 'flexible';
  startTime: string;
  endTime: string;
}

interface BulkAssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  availableEmployees: Employee[];
  availableShifts: Shift[];
}

export function BulkAssignShiftModal({ isOpen, onClose, onSubmit, availableEmployees, availableShifts }: BulkAssignShiftModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredEmployees = availableEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...Array.from(new Set(availableEmployees.map(e => e.department)))];

  const toggleEmployee = (code: string) => {
    setSelectedEmployees(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const selectAllFiltered = () => {
    const filteredCodes = filteredEmployees.map(e => e.code);
    setSelectedEmployees(prev => {
      const allSelected = filteredCodes.every(code => prev.includes(code));
      if (allSelected) {
        return prev.filter(code => !filteredCodes.includes(code));
      } else {
        return Array.from(new Set([...prev, ...filteredCodes]));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedShiftDetails = availableShifts.find(s => s.id === selectedShift);
    onSubmit({
      employeeCodes: selectedEmployees,
      shift: selectedShiftDetails,
      effectiveDate,
      reason
    });
    // Reset form
    setSelectedEmployees([]);
    setSelectedShift('');
    setEffectiveDate('');
    setReason('');
    setSearchTerm('');
    setDepartmentFilter('all');
  };

  const getShiftTypeColor = (type: string) => {
    const colors = {
      day: 'bg-yellow-100 text-yellow-700',
      night: 'bg-indigo-100 text-indigo-700',
      morning: 'bg-orange-100 text-orange-700',
      evening: 'bg-purple-100 text-purple-700',
      flexible: 'bg-blue-100 text-blue-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-600" />
                Bulk Assign Shift
              </h2>
              <p className="text-gray-600 mt-1">Assign shift to multiple employees at once</p>
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
          {/* Step 1: Select Employees */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
                Select Employees
              </h3>
              <div className="text-sm font-medium text-blue-600">
                {selectedEmployees.length} selected
              </div>
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

            {/* Select All */}
            <div className="mb-3">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {filteredEmployees.every(e => selectedEmployees.includes(e.code))
                  ? 'Deselect All Filtered'
                  : 'Select All Filtered'}
              </button>
            </div>

            {/* Employee List */}
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No employees found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredEmployees.map(emp => (
                    <label
                      key={emp.code}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.code)}
                        onChange={() => toggleEmployee(emp.code)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500">
                          {emp.code} • {emp.department} • Current: {emp.currentShift}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Select Shift */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              Select Shift Template
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{shift.name}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getShiftTypeColor(shift.type)}`}>
                        {shift.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
              Assignment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Change
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Department restructuring"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedEmployees.length > 0 && selectedShift && effectiveDate && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Assignment Summary</h4>
                  <p className="text-sm text-blue-800">
                    You are about to assign{' '}
                    <span className="font-semibold">{selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''}</span>
                    {' '}to{' '}
                    <span className="font-semibold">
                      {availableShifts.find(s => s.id === selectedShift)?.name}
                    </span>
                    {' '}effective from{' '}
                    <span className="font-semibold">
                      {new Date(effectiveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>.
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
              disabled={selectedEmployees.length === 0 || !selectedShift || !effectiveDate}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Assign Shift to {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
