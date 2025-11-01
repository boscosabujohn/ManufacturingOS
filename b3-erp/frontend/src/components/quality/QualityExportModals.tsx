'use client';

import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, File, Calendar, Filter, CheckSquare, Camera, AlertTriangle, FileCheck, TrendingUp, BarChart3, PieChart } from 'lucide-react';

// Export Inspection Report Modal
interface ExportInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export const ExportInspectionReportModal: React.FC<ExportInspectionReportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [formData, setFormData] = useState({
    format: 'excel',
    dateFrom: '',
    dateTo: '',
    status: [] as string[],
    inspectionTypes: [] as string[],
    includePhotos: true,
    includeRemarks: true,
    includeDefects: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dateFrom || !formData.dateTo) {
      alert('Please select both date range fields');
      return;
    }
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  const statusOptions = ['pending', 'passed', 'failed', 'conditional'];
  const inspectionTypes = [
    'Incoming Inspection',
    'In-Process Inspection',
    'Final Inspection',
    'Pre-Shipment Inspection',
    'Quality Audit',
    'Material Testing'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export Inspection Report</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format *</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'excel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'csv' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'csv'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'pdf'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <File className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium">PDF</span>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range *</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={formData.dateTo}
                  onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status Filter</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, status: [...formData.status, status] });
                      } else {
                        setFormData({ ...formData, status: formData.status.filter(s => s !== status) });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Inspection Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Inspection Type</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {inspectionTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inspectionTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, inspectionTypes: [...formData.inspectionTypes, type] });
                      } else {
                        setFormData({ ...formData, inspectionTypes: formData.inspectionTypes.filter(t => t !== type) });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includePhotos}
                  onChange={(e) => setFormData({ ...formData, includePhotos: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Camera className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Photos</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeRemarks}
                  onChange={(e) => setFormData({ ...formData, includeRemarks: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Remarks</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeDefects}
                  onChange={(e) => setFormData({ ...formData, includeDefects: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Defect Details</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export NCR Modal
interface ExportNCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export const ExportNCRModal: React.FC<ExportNCRModalProps> = ({ isOpen, onClose, onExport }) => {
  const [formData, setFormData] = useState({
    format: 'excel',
    dateFrom: '',
    dateTo: '',
    severity: [] as string[],
    status: [] as string[],
    type: [] as string[],
    includeClosedNCRs: true,
    includeAttachments: true,
    includeRootCause: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dateFrom || !formData.dateTo) {
      alert('Please select both date range fields');
      return;
    }
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  const severityOptions = ['critical', 'major', 'minor'];
  const statusOptions = ['open', 'under-investigation', 'corrective-action', 'closed', 'rejected'];
  const typeOptions = [
    'Dimensional',
    'Material',
    'Visual',
    'Functional',
    'Documentation',
    'Process',
    'Packaging',
    'Performance'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export NCR Data</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format *</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'excel'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'csv' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'csv'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'pdf'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <File className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium">PDF</span>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range *</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={formData.dateTo}
                  onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Severity Filter</label>
            <div className="grid grid-cols-3 gap-2">
              {severityOptions.map((severity) => (
                <label key={severity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.severity.includes(severity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, severity: [...formData.severity, severity] });
                      } else {
                        setFormData({ ...formData, severity: formData.severity.filter(s => s !== severity) });
                      }
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{severity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status Filter</label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, status: [...formData.status, status] });
                      } else {
                        setFormData({ ...formData, status: formData.status.filter(s => s !== status) });
                      }
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">NCR Type</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {typeOptions.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.type.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, type: [...formData.type, type] });
                      } else {
                        setFormData({ ...formData, type: formData.type.filter(t => t !== type) });
                      }
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeClosedNCRs}
                  onChange={(e) => setFormData({ ...formData, includeClosedNCRs: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <CheckSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Closed NCRs</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeAttachments}
                  onChange={(e) => setFormData({ ...formData, includeAttachments: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Attachments</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeRootCause}
                  onChange={(e) => setFormData({ ...formData, includeRootCause: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Root Cause Analysis</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export NCR Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export Quality Plans Modal
interface ExportQualityPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export const ExportQualityPlansModal: React.FC<ExportQualityPlansModalProps> = ({ isOpen, onClose, onExport }) => {
  const [formData, setFormData] = useState({
    format: 'excel',
    categories: [] as string[],
    status: [] as string[],
    includeInspectionPoints: true,
    includeAcceptanceCriteria: true,
    includeVersionHistory: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  const categoryOptions = [
    'Raw Material',
    'Work-in-Progress',
    'Finished Goods',
    'Packaging',
    'Supplier Quality',
    'Process Control',
    'Equipment Calibration',
    'Safety & Compliance'
  ];

  const statusOptions = ['active', 'draft', 'archived', 'under-review'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export Quality Plans</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'excel'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'pdf'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <File className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium">PDF</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Category Filter</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {categoryOptions.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, categories: [...formData.categories, category] });
                      } else {
                        setFormData({ ...formData, categories: formData.categories.filter(c => c !== category) });
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status Filter</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, status: [...formData.status, status] });
                      } else {
                        setFormData({ ...formData, status: formData.status.filter(s => s !== status) });
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeInspectionPoints}
                  onChange={(e) => setFormData({ ...formData, includeInspectionPoints: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <CheckSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Inspection Points Details</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeAcceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, includeAcceptanceCriteria: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <FileCheck className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Acceptance Criteria</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeVersionHistory}
                  onChange={(e) => setFormData({ ...formData, includeVersionHistory: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Version History</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Quality Plans</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export Quality Report Modal
interface ExportQualityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export const ExportQualityReportModal: React.FC<ExportQualityReportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [formData, setFormData] = useState({
    format: 'excel',
    reportType: 'summary-dashboard',
    dateRange: 'last-30-days',
    customDateFrom: '',
    customDateTo: '',
    categories: [] as string[],
    includeCharts: true,
    includeRecommendations: true,
    includeExecutiveSummary: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dateRange === 'custom' && (!formData.customDateFrom || !formData.customDateTo)) {
      alert('Please select both custom date range fields');
      return;
    }
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  const reportTypes = [
    { value: 'summary-dashboard', label: 'Summary Dashboard' },
    { value: 'detailed-metrics', label: 'Detailed Quality Metrics' },
    { value: 'product-wise', label: 'Product-wise Analysis' },
    { value: 'defect-pareto', label: 'Defect Analysis (Pareto)' },
    { value: 'trend-analysis', label: 'Trend Analysis' },
    { value: 'custom-report', label: 'Custom Report' }
  ];

  const dateRangePresets = [
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const categoryOptions = [
    'Incoming Quality',
    'Process Quality',
    'Final Inspection',
    'Supplier Quality',
    'Customer Complaints',
    'NCR Analysis',
    'Calibration Status',
    'Audit Results'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export Quality Analytics</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format *</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'excel'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'pdf'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <File className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium">PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'powerpoint' })}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  formData.format === 'powerpoint'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <PieChart className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium">PowerPoint</span>
              </button>
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type *</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range *</label>
            <select
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              required
            >
              {dateRangePresets.map((preset) => (
                <option key={preset.value} value={preset.value}>{preset.label}</option>
              ))}
            </select>

            {/* Custom Date Range */}
            {formData.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={formData.customDateFrom}
                    onChange={(e) => setFormData({ ...formData, customDateFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={formData.customDateTo}
                    onChange={(e) => setFormData({ ...formData, customDateTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Category Filter</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {categoryOptions.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, categories: [...formData.categories, category] });
                      } else {
                        setFormData({ ...formData, categories: formData.categories.filter(c => c !== category) });
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeCharts}
                  onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Charts & Graphs</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeRecommendations}
                  onChange={(e) => setFormData({ ...formData, includeRecommendations: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Recommendations</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeExecutiveSummary}
                  onChange={(e) => setFormData({ ...formData, includeExecutiveSummary: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Include Executive Summary</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
