'use client';

import { useState } from 'react';
import { X, Plus, Edit, Eye, Users, Clock, TrendingUp, DollarSign, CheckCircle, XCircle, Download, Upload, Calendar, FileText, AlertTriangle } from 'lucide-react';

// ==================== 1. Add Labor Entry Modal ====================
interface AddLaborEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export function AddLaborEntryModal({ isOpen, onClose, onAdd }: AddLaborEntryModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    projectId: '',
    workPackage: '',
    laborCategory: 'Skilled',
    workersDeployed: '',
    hoursWorked: '',
    overtimeHours: '',
    hourlyRate: '',
    overtimeRate: '',
    workDescription: '',
    shift: 'Day',
    supervisor: '',
    remarks: '',
  });

  if (!isOpen) return null;

  const isValid = formData.date && formData.projectId && formData.workPackage && formData.workersDeployed && formData.hoursWorked;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Labor Entry</h2>
              <p className="text-blue-100 text-sm">Record workforce deployment and hours</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="e.g., PRJ-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Package *</label>
              <input
                type="text"
                value={formData.workPackage}
                onChange={(e) => setFormData({ ...formData, workPackage: e.target.value })}
                placeholder="e.g., WP-001 - Equipment Installation"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Labor Category *</label>
              <select
                value={formData.laborCategory}
                onChange={(e) => setFormData({ ...formData, laborCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Skilled</option>
                <option>Semi-Skilled</option>
                <option>Unskilled</option>
                <option>Supervisor</option>
                <option>Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Day</option>
                <option>Night</option>
                <option>General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workers Deployed *</label>
              <input
                type="number"
                value={formData.workersDeployed}
                onChange={(e) => setFormData({ ...formData, workersDeployed: e.target.value })}
                placeholder="e.g., 8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours Worked *</label>
              <input
                type="number"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                placeholder="e.g., 64"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Hours</label>
              <input
                type="number"
                value={formData.overtimeHours}
                onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
                placeholder="e.g., 8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="e.g., 450"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate (₹)</label>
              <input
                type="number"
                value={formData.overtimeRate}
                onChange={(e) => setFormData({ ...formData, overtimeRate: e.target.value })}
                placeholder="e.g., 675"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                placeholder="Supervisor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
              <textarea
                rows={2}
                value={formData.workDescription}
                onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                placeholder="Describe the work performed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea
                rows={2}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Any additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onAdd(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Save Labor Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 2. Edit Labor Entry Modal ====================
interface EditLaborEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  entry: any;
}

export function EditLaborEntryModal({ isOpen, onClose, onSave, entry }: EditLaborEntryModalProps) {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Labor Entry</h2>
              <p className="text-green-100 text-sm">{entry.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">Edit labor entry details, hours, and costs.</p>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({})}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 3. View Labor Details Modal ====================
interface ViewLaborDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: any;
}

export function ViewLaborDetailsModal({ isOpen, onClose, entry }: ViewLaborDetailsModalProps) {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Labor Entry Details</h2>
              <p className="text-purple-100 text-sm">{entry.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Project</p>
                <p className="text-sm font-medium text-gray-900">{entry.projectName}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Work Package</p>
                <p className="text-sm font-medium text-gray-900">{entry.workPackage}</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{entry.workersDeployed}</p>
                <p className="text-xs text-gray-600">Workers</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{entry.hoursWorked}h</p>
                <p className="text-xs text-gray-600">Regular</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{entry.overtimeHours}h</p>
                <p className="text-xs text-gray-600">Overtime</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600">{entry.totalManhours}h</p>
                <p className="text-xs text-gray-600">Total Hours</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-purple-600">₹{entry.totalCost.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-600">Total Cost</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Category</p>
                <p className="text-sm font-medium text-gray-900">{entry.laborCategory}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Shift</p>
                <p className="text-sm font-medium text-gray-900">{entry.shift}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Efficiency</p>
                <p className="text-sm font-medium text-gray-900">{entry.efficiency}%</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Work Description</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{entry.workDescription}</p>
              </div>
            </div>

            {entry.remarks && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Remarks</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{entry.remarks}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 4. Approve Hours Modal ====================
interface ApproveHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: any) => void;
  entry: any;
}

export function ApproveHoursModal({ isOpen, onClose, onApprove, entry }: ApproveHoursModalProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Hours</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2">Approve {entry.totalManhours} manhours for {entry.projectName}</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-2">
            <p className="text-sm text-gray-600">Regular: {entry.hoursWorked}h | OT: {entry.overtimeHours}h</p>
            <p className="text-sm font-medium text-gray-900 mt-1">Cost: ₹{entry.totalCost.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add approval notes (optional)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onApprove({ notes })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Approve Hours
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 5. Reject Hours Modal ====================
interface RejectHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (data: any) => void;
  entry: any;
}

export function RejectHoursModal({ isOpen, onClose, onReject, entry }: RejectHoursModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reject Hours</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2">Reject hours entry for {entry.projectName}</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection *</label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for rejection..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onReject({ reason })}
            disabled={!reason}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 6. Calculate Efficiency Modal ====================
interface CalculateEfficiencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (data: any) => void;
  entry: any;
}

export function CalculateEfficiencyModal({ isOpen, onClose, onCalculate, entry }: CalculateEfficiencyModalProps) {
  const [plannedHours, setPlannedHours] = useState('');
  const [actualOutput, setActualOutput] = useState('');
  const [plannedOutput, setPlannedOutput] = useState('');

  if (!isOpen || !entry) return null;

  const efficiency = plannedHours && actualOutput && plannedOutput
    ? ((parseFloat(actualOutput) / parseFloat(plannedOutput)) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Calculate Efficiency</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planned Manhours</label>
            <input
              type="number"
              value={plannedHours}
              onChange={(e) => setPlannedHours(e.target.value)}
              placeholder="e.g., 64"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Output</label>
            <input
              type="number"
              value={actualOutput}
              onChange={(e) => setActualOutput(e.target.value)}
              placeholder="e.g., 95"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planned Output</label>
            <input
              type="number"
              value={plannedOutput}
              onChange={(e) => setPlannedOutput(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Calculated Efficiency</p>
            <p className="text-3xl font-bold text-orange-600">{efficiency}%</p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onCalculate({ plannedHours, actualOutput, plannedOutput, efficiency })}
            disabled={!plannedHours || !actualOutput || !plannedOutput}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300"
          >
            Save Efficiency
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 7. Bulk Upload Modal ====================
interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export function BulkUploadModal({ isOpen, onClose, onUpload }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bulk Upload</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2">Upload multiple labor entries from file</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Drop your file here or click to browse</p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onUpload({ file })}
            disabled={!file}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 8. Export Report Modal ====================
interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export function ExportReportModal({ isOpen, onClose, onExport }: ExportReportModalProps) {
  const [format, setFormat] = useState('Excel');
  const [reportType, setReportType] = useState('All Entries');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Export Report</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option>All Entries</option>
              <option>By Project</option>
              <option>By Labor Category</option>
              <option>Overtime Summary</option>
              <option>Cost Analysis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option>Excel</option>
              <option>PDF</option>
              <option>CSV</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onExport({ format, reportType })}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 9. Assign Workers Modal ====================
interface AssignWorkersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: any) => void;
}

export function AssignWorkersModal({ isOpen, onClose, onAssign }: AssignWorkersModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    workPackage: '',
    laborCategory: 'Skilled',
    numberOfWorkers: '',
    startDate: '',
    estimatedDuration: '',
  });

  if (!isOpen) return null;

  const isValid = formData.projectId && formData.workPackage && formData.numberOfWorkers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Workers</h2>
              <p className="text-cyan-100 text-sm">Assign workforce to project tasks</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="e.g., PRJ-2025-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Package</label>
              <input
                type="text"
                value={formData.workPackage}
                onChange={(e) => setFormData({ ...formData, workPackage: e.target.value })}
                placeholder="e.g., WP-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Labor Category</label>
              <select
                value={formData.laborCategory}
                onChange={(e) => setFormData({ ...formData, laborCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option>Skilled</option>
                <option>Semi-Skilled</option>
                <option>Unskilled</option>
                <option>Supervisor</option>
                <option>Engineer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Workers</label>
              <input
                type="number"
                value={formData.numberOfWorkers}
                onChange={(e) => setFormData({ ...formData, numberOfWorkers: e.target.value })}
                placeholder="e.g., 8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
              <input
                type="text"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                placeholder="e.g., 2 weeks"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onAssign(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300"
          >
            Assign Workers
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 10. Calculate Cost Modal ====================
interface CalculateCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (data: any) => void;
  entry: any;
}

export function CalculateCostModal({ isOpen, onClose, onCalculate, entry }: CalculateCostModalProps) {
  if (!isOpen || !entry) return null;

  const regularCost = entry.hoursWorked * entry.hourlyRate;
  const overtimeCost = entry.overtimeHours * entry.overtimeRate;
  const totalCost = regularCost + overtimeCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cost Breakdown</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Regular Hours:</span>
              <span className="font-medium">{entry.hoursWorked}h @ ₹{entry.hourlyRate}/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regular Cost:</span>
              <span className="font-medium text-blue-600">₹{regularCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-gray-200 pt-2"></div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overtime Hours:</span>
              <span className="font-medium">{entry.overtimeHours}h @ ₹{entry.overtimeRate}/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overtime Cost:</span>
              <span className="font-medium text-orange-600">₹{overtimeCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-gray-200 pt-2"></div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-semibold">Total Cost:</span>
              <span className="font-bold text-purple-600 text-xl">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
          <button
            onClick={() => onCalculate({ regularCost, overtimeCost, totalCost })}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Confirm Cost
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 11. Shift Schedule Modal ====================
interface ShiftScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
}

export function ShiftScheduleModal({ isOpen, onClose, onSchedule }: ShiftScheduleModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    projectId: '',
    shift: 'Day',
    workers: '',
    startTime: '',
    endTime: '',
  });

  if (!isOpen) return null;

  const isValid = formData.date && formData.projectId && formData.workers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Shift Schedule</h2>
              <p className="text-pink-100 text-sm">Schedule worker shifts</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="e.g., PRJ-2025-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option>Day</option>
                <option>Night</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workers</label>
              <input
                type="number"
                value={formData.workers}
                onChange={(e) => setFormData({ ...formData, workers: e.target.value })}
                placeholder="Number of workers"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onSchedule(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
          >
            Schedule Shift
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 12. Overtime Analysis Modal ====================
// ==================== 12. Overtime Analysis Modal ====================
interface OvertimeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: any[];
}

export function OvertimeAnalysisModal({ isOpen, onClose, entries }: OvertimeAnalysisModalProps) {
  if (!isOpen) return null;

  const totalRegularHours = entries.reduce((sum, e) => sum + e.hoursWorked, 0);
  const totalOvertimeHours = entries.reduce((sum, e) => sum + e.overtimeHours, 0);
  const totalManhours = totalRegularHours + totalOvertimeHours;
  const overtimePercentage = totalManhours > 0 ? ((totalOvertimeHours / totalManhours) * 100).toFixed(1) : '0';
  const totalOvertimeCost = entries.reduce((sum, e) => sum + (e.overtimeHours * e.overtimeRate), 0);

  const entriesWithHighOvertime = entries.filter(e => e.overtimeHours > 4); // Threshold for alert

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Overtime Analysis</h2>
              <p className="text-violet-100 text-sm">Aggregate View</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{totalRegularHours}h</p>
              <p className="text-xs text-gray-600">Total Regular Hours</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{totalOvertimeHours}h</p>
              <p className="text-xs text-gray-600">Total Overtime Hours</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{overtimePercentage}%</p>
              <p className="text-xs text-gray-600">OT Percentage</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Total Overtime Cost Impact</h4>
            <p className="text-sm text-yellow-700">
              Additional Cost: ₹{totalOvertimeCost.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Analysis based on {entries.length} entries.
            </p>
          </div>

          {entriesWithHighOvertime.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">High Overtime Alerts ({entriesWithHighOvertime.length})</p>
                  <p className="text-sm text-red-700 mt-1">
                    {entriesWithHighOvertime.length} entries have significant overtime ({'>'} 4h).
                  </p>
                  <ul className="list-disc list-inside mt-2 text-xs text-red-600">
                    {entriesWithHighOvertime.slice(0, 3).map(e => (
                      <li key={e.id}>{e.projectName} ({e.overtimeHours}h)</li>
                    ))}
                    {entriesWithHighOvertime.length > 3 && <li>...and {entriesWithHighOvertime.length - 3} more</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 13. Generate Timesheet Modal ====================
interface GenerateTimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export function GenerateTimesheetModal({ isOpen, onClose, onGenerate }: GenerateTimesheetModalProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    projectId: 'all',
    workerCategory: 'all',
  });

  if (!isOpen) return null;

  const isValid = formData.startDate && formData.endDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generate Timesheet</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Projects</option>
              <option>PRJ-2025-001</option>
              <option>PRJ-2025-002</option>
              <option>PRJ-2025-003</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Worker Category</label>
            <select
              value={formData.workerCategory}
              onChange={(e) => setFormData({ ...formData, workerCategory: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              <option>Skilled</option>
              <option>Semi-Skilled</option>
              <option>Unskilled</option>
              <option>Supervisor</option>
              <option>Engineer</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onGenerate(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300"
          >
            Generate Timesheet
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 14. Labor Productivity Report Modal ====================
interface LaborProductivityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export function LaborProductivityReportModal({ isOpen, onClose, onGenerate }: LaborProductivityReportModalProps) {
  const [dateRange, setDateRange] = useState('This Month');
  const [groupBy, setGroupBy] = useState('Project');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Productivity Report</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option>Project</option>
              <option>Labor Category</option>
              <option>Supervisor</option>
              <option>Work Package</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onGenerate({ dateRange, groupBy })}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 15. Mark Attendance Modal ====================
interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMark: (data: any) => void;
}

export function MarkAttendanceModal({ isOpen, onClose, onMark }: MarkAttendanceModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    projectId: '',
    category: 'Skilled',
    present: '',
    absent: '',
    halfDay: '',
    remarks: '',
  });

  if (!isOpen) return null;

  const isValid = formData.date && formData.projectId && formData.present;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mark Attendance</h2>
              <p className="text-rose-100 text-sm">Record daily worker attendance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="e.g., PRJ-2025-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              >
                <option>Skilled</option>
                <option>Semi-Skilled</option>
                <option>Unskilled</option>
                <option>Supervisor</option>
                <option>Engineer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Present</label>
              <input
                type="number"
                value={formData.present}
                onChange={(e) => setFormData({ ...formData, present: e.target.value })}
                placeholder="Number present"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Absent</label>
              <input
                type="number"
                value={formData.absent}
                onChange={(e) => setFormData({ ...formData, absent: e.target.value })}
                placeholder="Number absent"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Half Day</label>
              <input
                type="number"
                value={formData.halfDay}
                onChange={(e) => setFormData({ ...formData, halfDay: e.target.value })}
                placeholder="Number half day"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea
                rows={2}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Any additional notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onMark(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-gray-300"
          >
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
