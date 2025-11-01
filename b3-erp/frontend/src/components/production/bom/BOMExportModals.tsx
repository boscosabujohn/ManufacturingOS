'use client';

import React, { useState } from 'react';
import { X, Download, FileText, Table, FileSpreadsheet, Printer, Settings, ChevronDown } from 'lucide-react';

// Export Comparison Modal
interface ExportComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
  dateRange?: { from: string; to: string };
}

export const ExportComparisonModal: React.FC<ExportComparisonModalProps> = ({
  isOpen,
  onClose,
  onExport,
  dateRange
}) => {
  const [formData, setFormData] = useState({
    format: 'pdf',
    includeUnchanged: false,
    includeCostDetails: true,
    includeChangeSummary: true,
    includeCharts: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Export BOM Comparison</h2>
            <p className="text-sm text-blue-100 mt-1">Export comparison report in your preferred format</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Range Display */}
          {dateRange && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Comparison Period</h3>
              <p className="text-sm text-blue-700">
                From: <span className="font-medium">{dateRange.from}</span> to{' '}
                <span className="font-medium">{dateRange.to}</span>
              </p>
            </div>
          )}

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format *</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'pdf'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'pdf' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'pdf' ? 'text-blue-900' : 'text-gray-700'
                }`}>PDF</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'excel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'excel' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'excel' ? 'text-blue-900' : 'text-gray-700'
                }`}>Excel</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'csv' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'csv'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Table className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'csv' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'csv' ? 'text-blue-900' : 'text-gray-700'
                }`}>CSV</p>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Export Options</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeUnchanged}
                  onChange={(e) => setFormData({ ...formData, includeUnchanged: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include unchanged items</p>
                  <p className="text-xs text-gray-600">Show items with no changes in the comparison</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeCostDetails}
                  onChange={(e) => setFormData({ ...formData, includeCostDetails: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include cost details</p>
                  <p className="text-xs text-gray-600">Add detailed cost breakdown for each component</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeChangeSummary}
                  onChange={(e) => setFormData({ ...formData, includeChangeSummary: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include change summary</p>
                  <p className="text-xs text-gray-600">Add executive summary of all changes</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeCharts}
                  onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  disabled={formData.format === 'csv'}
                />
                <div>
                  <p className={`text-sm font-medium ${formData.format === 'csv' ? 'text-gray-400' : 'text-gray-900'}`}>
                    Include charts
                  </p>
                  <p className="text-xs text-gray-600">
                    {formData.format === 'csv' ? 'Not available for CSV format' : 'Add visual comparison charts'}
                  </p>
                </div>
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
              <span>Export Comparison</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export Costing Modal
interface ExportCostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export const ExportCostingModal: React.FC<ExportCostingModalProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [formData, setFormData] = useState({
    format: 'pdf',
    detailLevel: 'by-category',
    includeCharts: true,
    includeSupplierDetails: false,
    includeHistoricalCosts: false,
    template: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  const templates = [
    'Standard Costing Report',
    'Executive Summary',
    'Detailed Analysis',
    'Supplier Comparison'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Export Costing Report</h2>
            <p className="text-sm text-green-100 mt-1">Generate detailed cost analysis report</p>
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
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'pdf'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'pdf' ? 'text-green-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'pdf' ? 'text-green-900' : 'text-gray-700'
                }`}>PDF</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'excel'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'excel' ? 'text-green-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'excel' ? 'text-green-900' : 'text-gray-700'
                }`}>Excel</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'csv' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'csv'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Table className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'csv' ? 'text-green-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'csv' ? 'text-green-900' : 'text-gray-700'
                }`}>CSV</p>
              </button>
            </div>
          </div>

          {/* Detail Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Detail Level *</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="detailLevel"
                  value="summary"
                  checked={formData.detailLevel === 'summary'}
                  onChange={(e) => setFormData({ ...formData, detailLevel: e.target.value })}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Summary only</p>
                  <p className="text-xs text-gray-600">High-level cost overview</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="detailLevel"
                  value="by-category"
                  checked={formData.detailLevel === 'by-category'}
                  onChange={(e) => setFormData({ ...formData, detailLevel: e.target.value })}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">By category</p>
                  <p className="text-xs text-gray-600">Costs grouped by component categories</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="detailLevel"
                  value="by-component"
                  checked={formData.detailLevel === 'by-component'}
                  onChange={(e) => setFormData({ ...formData, detailLevel: e.target.value })}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">By component</p>
                  <p className="text-xs text-gray-600">Detailed breakdown for each component</p>
                </div>
              </label>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Options</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeCharts}
                  onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                  disabled={formData.format === 'csv'}
                />
                <div>
                  <p className={`text-sm font-medium ${formData.format === 'csv' ? 'text-gray-400' : 'text-gray-900'}`}>
                    Include charts
                  </p>
                  <p className="text-xs text-gray-600">
                    {formData.format === 'csv' ? 'Not available for CSV format' : 'Add cost breakdown charts and graphs'}
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeSupplierDetails}
                  onChange={(e) => setFormData({ ...formData, includeSupplierDetails: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include supplier details</p>
                  <p className="text-xs text-gray-600">Add supplier information and pricing</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeHistoricalCosts}
                  onChange={(e) => setFormData({ ...formData, includeHistoricalCosts: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include historical costs</p>
                  <p className="text-xs text-gray-600">Show cost trends and historical data</p>
                </div>
              </label>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Template <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <select
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Use default template</option>
              {templates.map((template) => (
                <option key={template} value={template}>{template}</option>
              ))}
            </select>
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
              <span>Export Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export Multi-Level Modal
interface ExportMultiLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export const ExportMultiLevelModal: React.FC<ExportMultiLevelModalProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [formData, setFormData] = useState({
    format: 'pdf',
    structure: 'indented',
    levelDepth: 'all',
    customDepth: 5,
    includeCosts: true,
    includeLeadTimes: true,
    includeSuppliers: false,
    includeScrapPercentage: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Export Multi-Level BOM</h2>
            <p className="text-sm text-purple-100 mt-1">Export complete BOM structure with all levels</p>
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
                onClick={() => setFormData({ ...formData, format: 'pdf' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'pdf'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'pdf' ? 'text-purple-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'pdf' ? 'text-purple-900' : 'text-gray-700'
                }`}>PDF</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'excel' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'excel'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'excel' ? 'text-purple-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'excel' ? 'text-purple-900' : 'text-gray-700'
                }`}>Excel</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, format: 'csv' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.format === 'csv'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Table className={`h-6 w-6 mx-auto mb-2 ${
                  formData.format === 'csv' ? 'text-purple-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.format === 'csv' ? 'text-purple-900' : 'text-gray-700'
                }`}>CSV</p>
              </button>
            </div>
          </div>

          {/* Structure Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Structure Format *</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="structure"
                  value="indented"
                  checked={formData.structure === 'indented'}
                  onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Indented format</p>
                  <p className="text-xs text-gray-600">Hierarchical display with indentation</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="structure"
                  value="flat"
                  checked={formData.structure === 'flat'}
                  onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Flat list with level indicator</p>
                  <p className="text-xs text-gray-600">Simple list showing level numbers</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="structure"
                  value="tree"
                  checked={formData.structure === 'tree'}
                  onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                  className="text-purple-600 focus:ring-purple-500"
                  disabled={formData.format !== 'pdf'}
                />
                <div>
                  <p className={`text-sm font-medium ${formData.format !== 'pdf' ? 'text-gray-400' : 'text-gray-900'}`}>
                    Tree view (PDF only)
                  </p>
                  <p className="text-xs text-gray-600">
                    {formData.format !== 'pdf' ? 'Only available for PDF format' : 'Visual tree structure with connectors'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Level Depth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Level Depth *</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="levelDepth"
                  value="all"
                  checked={formData.levelDepth === 'all'}
                  onChange={(e) => setFormData({ ...formData, levelDepth: e.target.value })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <p className="text-sm font-medium text-gray-900">All levels</p>
              </label>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="levelDepth"
                  value="custom"
                  checked={formData.levelDepth === 'custom'}
                  onChange={(e) => setFormData({ ...formData, levelDepth: e.target.value })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-900">Custom depth:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.customDepth}
                  onChange={(e) => setFormData({ ...formData, customDepth: parseInt(e.target.value), levelDepth: 'custom' })}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">levels (1-10)</span>
              </div>
            </div>
          </div>

          {/* Include Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Include in Export</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeCosts}
                  onChange={(e) => setFormData({ ...formData, includeCosts: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <p className="text-sm font-medium text-gray-900">Costs</p>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeLeadTimes}
                  onChange={(e) => setFormData({ ...formData, includeLeadTimes: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <p className="text-sm font-medium text-gray-900">Lead times</p>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeSuppliers}
                  onChange={(e) => setFormData({ ...formData, includeSuppliers: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <p className="text-sm font-medium text-gray-900">Suppliers</p>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeScrapPercentage}
                  onChange={(e) => setFormData({ ...formData, includeScrapPercentage: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <p className="text-sm font-medium text-gray-900">Scrap %</p>
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
              <span>Export BOM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Print Preview Modal
interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (data: any) => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  onPrint
}) => {
  const [formData, setFormData] = useState({
    orientation: 'portrait',
    includeHeader: true,
    includeFooter: true,
    includePageNumbers: true,
    includeDate: true,
    levelDepth: 'all',
    customDepth: 5,
    marginTop: 20,
    marginRight: 15,
    marginBottom: 20,
    marginLeft: 15
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPrint(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Print Multi-Level BOM</h2>
            <p className="text-sm text-indigo-100 mt-1">Configure print settings and preview</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings Panel */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-6 space-y-6">
            {/* Page Orientation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Page Orientation *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orientation: 'portrait' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.orientation === 'portrait'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`h-16 w-12 mx-auto mb-2 border-2 rounded ${
                    formData.orientation === 'portrait' ? 'border-indigo-600' : 'border-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    formData.orientation === 'portrait' ? 'text-indigo-900' : 'text-gray-700'
                  }`}>Portrait</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orientation: 'landscape' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.orientation === 'landscape'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`h-12 w-16 mx-auto mb-2 border-2 rounded ${
                    formData.orientation === 'landscape' ? 'border-indigo-600' : 'border-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    formData.orientation === 'landscape' ? 'text-indigo-900' : 'text-gray-700'
                  }`}>Landscape</p>
                </button>
              </div>
            </div>

            {/* Include Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Include in Print</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeHeader}
                    onChange={(e) => setFormData({ ...formData, includeHeader: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <p className="text-sm font-medium text-gray-900">Header</p>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeFooter}
                    onChange={(e) => setFormData({ ...formData, includeFooter: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <p className="text-sm font-medium text-gray-900">Footer</p>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includePageNumbers}
                    onChange={(e) => setFormData({ ...formData, includePageNumbers: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <p className="text-sm font-medium text-gray-900">Page numbers</p>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeDate}
                    onChange={(e) => setFormData({ ...formData, includeDate: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <p className="text-sm font-medium text-gray-900">Date</p>
                </label>
              </div>
            </div>

            {/* Level Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Level Depth *</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="levelDepth"
                    value="all"
                    checked={formData.levelDepth === 'all'}
                    onChange={(e) => setFormData({ ...formData, levelDepth: e.target.value })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <p className="text-sm font-medium text-gray-900">All levels</p>
                </label>

                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="levelDepth"
                    value="custom"
                    checked={formData.levelDepth === 'custom'}
                    onChange={(e) => setFormData({ ...formData, levelDepth: e.target.value })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-900">Custom:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.customDepth}
                    onChange={(e) => setFormData({ ...formData, customDepth: parseInt(e.target.value), levelDepth: 'custom' })}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">levels</span>
                </div>
              </div>
            </div>

            {/* Margin Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Margins (mm)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Top</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.marginTop}
                    onChange={(e) => setFormData({ ...formData, marginTop: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Right</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.marginRight}
                    onChange={(e) => setFormData({ ...formData, marginRight: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Bottom</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.marginBottom}
                    onChange={(e) => setFormData({ ...formData, marginBottom: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Left</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.marginLeft}
                    onChange={(e) => setFormData({ ...formData, marginLeft: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-gray-100 overflow-y-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 min-h-full">
              {/* Preview Placeholder */}
              <div className="text-center text-gray-500">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold text-gray-700">Print Preview</p>
                <p className="text-sm mt-2">Preview will be displayed here</p>

                <div className="mt-8 text-left space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-xs text-gray-600">Orientation: <span className="font-medium text-gray-900">{formData.orientation}</span></p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-xs text-gray-600">
                      Depth: <span className="font-medium text-gray-900">
                        {formData.levelDepth === 'all' ? 'All levels' : `${formData.customDepth} levels`}
                      </span>
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-xs text-gray-600">
                      Margins: <span className="font-medium text-gray-900">
                        T:{formData.marginTop} R:{formData.marginRight} B:{formData.marginBottom} L:{formData.marginLeft}mm
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
