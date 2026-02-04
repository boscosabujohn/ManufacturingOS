'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileType,
  Check,
  Loader2,
  Settings,
  Filter,
} from 'lucide-react';
import { ExportFormat, ExportColumn, exportToCSV, exportToExcel, exportToPDF } from './ExportService';

interface ExportDialogProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: ExportColumn[];
  title?: string;
  subtitle?: string;
  filename?: string;
  onExportComplete?: (format: ExportFormat) => void;
}

interface FormatOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const formatOptions: FormatOption[] = [
  {
    format: 'csv',
    label: 'CSV',
    description: 'Comma-separated values, compatible with any spreadsheet application',
    icon: <FileText className="w-8 h-8" />,
  },
  {
    format: 'xlsx',
    label: 'Excel',
    description: 'Microsoft Excel format with formatting and headers',
    icon: <FileSpreadsheet className="w-8 h-8" />,
  },
  {
    format: 'pdf',
    label: 'PDF',
    description: 'Print-ready document with professional formatting',
    icon: <FileType className="w-8 h-8" />,
  },
];

export function ExportDialog<T extends Record<string, any>>({
  isOpen,
  onClose,
  data,
  columns,
  title,
  subtitle,
  filename = 'export',
  onExportComplete,
}: ExportDialogProps<T>) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Export options
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(c => c.key));
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    // Filter columns based on selection
    const exportColumns = columns.filter(c => selectedColumns.includes(c.key));

    const options = {
      filename,
      title,
      subtitle,
      columns: exportColumns,
      includeHeaders,
      orientation,
      pageSize,
      sheetName: title || 'Data',
    };

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      switch (selectedFormat) {
        case 'csv':
          exportToCSV(data, options);
          break;
        case 'xlsx':
          exportToExcel(data, options);
          break;
        case 'pdf':
          exportToPDF(data, options);
          break;
      }

      setExportSuccess(true);
      onExportComplete?.(selectedFormat);

      // Auto close after success
      setTimeout(() => {
        onClose();
        setExportSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleColumn = (key: string) => {
    setSelectedColumns(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const selectAllColumns = () => setSelectedColumns(columns.map(c => c.key));
  const deselectAllColumns = () => setSelectedColumns([]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
        <div
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.length.toLocaleString()} records selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {formatOptions.map(option => (
                  <button
                    key={option.format}
                    onClick={() => setSelectedFormat(option.format)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      selectedFormat === option.format
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {selectedFormat === option.format && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <span className={selectedFormat === option.format ? 'text-blue-600' : 'text-gray-400'}>
                      {option.icon}
                    </span>
                    <span className={`font-medium ${
                      selectedFormat === option.format
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {formatOptions.find(o => o.format === selectedFormat)?.description}
              </p>
            </div>

            {/* Options Toggle */}
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="w-4 h-4" />
              {showOptions ? 'Hide Options' : 'Show Options'}
            </button>

            {/* Advanced Options */}
            {showOptions && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {/* Include Headers */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include column headers
                  </span>
                </label>

                {/* PDF Options */}
                {selectedFormat === 'pdf' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Orientation
                      </label>
                      <select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Page Size
                      </label>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter' | 'Legal')}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Column Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Columns to Export
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={selectAllColumns}
                        className="text-blue-600 hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={deselectAllColumns}
                        className="text-gray-500 hover:underline"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {columns.map(column => (
                      <label
                        key={column.key}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {column.header}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preview Info */}
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span>
                Exporting {data.length.toLocaleString()} records with {selectedColumns.length} columns
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedColumns.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for easy dialog management
export function useExportDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}

export type { ExportDialogProps };
