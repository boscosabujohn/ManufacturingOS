'use client';

import React, { useState } from 'react';
import { X, Download, FileText, Users, Filter, Calendar, Briefcase, Award } from 'lucide-react';

// Export Employees Modal
export function ExportEmployeesModal({ isOpen, onClose, onExport }: any) {
  const [formData, setFormData] = useState({
    format: 'excel',
    scope: 'filtered',
    includeFields: {
      basicInfo: true,
      contactDetails: true,
      employment: true,
      compensation: false,
      performance: true,
      leave: true
    },
    departmentFilter: 'all',
    statusFilter: 'all',
    employmentTypeFilter: 'all'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Employee Data
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onExport(formData); }} className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'excel', label: 'Excel (.xlsx)', icon: FileText, color: 'green' },
                { value: 'csv', label: 'CSV (.csv)', icon: FileText, color: 'blue' },
                { value: 'pdf', label: 'PDF Document', icon: FileText, color: 'red' }
              ].map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, format: format.value })}
                    className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.format === format.value
                        ? `border-${format.color}-500 bg-${format.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${formData.format === format.value ? `text-${format.color}-600` : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${formData.format === format.value ? `text-${format.color}-700` : 'text-gray-600'}`}>
                      {format.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Scope</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={formData.scope === 'filtered'}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-4 h-4 text-emerald-600"
                />
                <div>
                  <span className="font-medium text-gray-900">Current Filtered View</span>
                  <p className="text-xs text-gray-500">Export employees matching current filters and search</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={formData.scope === 'all'}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-4 h-4 text-emerald-600"
                />
                <div>
                  <span className="font-medium text-gray-900">All Employees</span>
                  <p className="text-xs text-gray-500">Export entire employee database</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="scope"
                  value="custom"
                  checked={formData.scope === 'custom'}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-4 h-4 text-emerald-600"
                />
                <div>
                  <span className="font-medium text-gray-900">Custom Filters</span>
                  <p className="text-xs text-gray-500">Define custom criteria for export</p>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Filters (shown when custom is selected) */}
          {formData.scope === 'custom' && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Custom Filters
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.departmentFilter}
                    onChange={(e) => setFormData({ ...formData, departmentFilter: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="Production">Production</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Quality Control">Quality Control</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.statusFilter}
                    onChange={(e) => setFormData({ ...formData, statusFilter: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    value={formData.employmentTypeFilter}
                    onChange={(e) => setFormData({ ...formData, employmentTypeFilter: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Fields to Include */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Fields to Include</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'basicInfo', label: 'Basic Information', desc: 'Name, ID, Photo', icon: Users },
                { key: 'contactDetails', label: 'Contact Details', desc: 'Email, Phone, Address', icon: Briefcase },
                { key: 'employment', label: 'Employment Details', desc: 'Position, Department, Manager', icon: Briefcase },
                { key: 'compensation', label: 'Compensation', desc: 'Salary, Bonuses', icon: Award },
                { key: 'performance', label: 'Performance Metrics', desc: 'Ratings, Reviews', icon: Award },
                { key: 'leave', label: 'Leave Balance', desc: 'Available, Used', icon: Calendar }
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <label
                    key={field.key}
                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.includeFields[field.key as keyof typeof formData.includeFields]}
                      onChange={(e) => setFormData({
                        ...formData,
                        includeFields: { ...formData.includeFields, [field.key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900 text-sm">{field.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{field.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-medium text-emerald-900 mb-2">Export Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-emerald-700">Format:</span>
                <span className="ml-2 font-medium text-emerald-900">
                  {formData.format.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-emerald-700">Scope:</span>
                <span className="ml-2 font-medium text-emerald-900">
                  {formData.scope === 'all' ? 'All Employees' : formData.scope === 'filtered' ? 'Filtered View' : 'Custom Filter'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-emerald-700">Fields:</span>
                <span className="ml-2 font-medium text-emerald-900">
                  {Object.values(formData.includeFields).filter(Boolean).length} of 6 selected
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Bulk Actions Modal
export function BulkActionsModal({ isOpen, onClose, selectedEmployees, onAction }: any) {
  const [actionType, setActionType] = useState('');
  const [actionData, setActionData] = useState<any>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAction({ type: actionType, data: actionData, employees: selectedEmployees });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Actions ({selectedEmployees?.length || 0} selected)
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Action</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an action...</option>
              <option value="updateDepartment">Update Department</option>
              <option value="updateStatus">Update Status</option>
              <option value="assignManager">Assign Manager</option>
              <option value="grantLeave">Grant Leave Days</option>
              <option value="sendNotification">Send Notification</option>
              <option value="export">Export Selected</option>
            </select>
          </div>

          {actionType === 'updateDepartment' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Department</label>
              <select
                onChange={(e) => setActionData({ ...actionData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select department...</option>
                <option value="Production">Production</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
              </select>
            </div>
          )}

          {actionType === 'updateStatus' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
              <select
                onChange={(e) => setActionData({ ...actionData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select status...</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          {actionType === 'grantLeave' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Leave Days</label>
              <input
                type="number"
                min="1"
                max="30"
                onChange={(e) => setActionData({ ...actionData, days: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of days"
                required
              />
            </div>
          )}

          {actionType === 'sendNotification' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                onChange={(e) => setActionData({ ...actionData, message: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notification message..."
                required
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This action will be applied to {selectedEmployees?.length || 0} selected employee(s).
              Please review before confirming.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!actionType}
            >
              Apply Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
