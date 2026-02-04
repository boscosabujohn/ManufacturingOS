'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  AlertTriangle,
  FileText,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
} from 'lucide-react';

// Types
export interface ImportColumn {
  key: string;
  label: string;
  required?: boolean;
  type?: 'string' | 'number' | 'date' | 'email' | 'boolean';
  validate?: (value: any) => boolean | string;
}

export interface ImportMapping {
  sourceColumn: string;
  targetColumn: string;
}

export interface ValidationError {
  row: number;
  column: string;
  value: any;
  message: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: ValidationError[];
}

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ImportColumn[];
  onImport: (data: Record<string, any>[]) => Promise<ImportResult>;
  title?: string;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

type WizardStep = 'upload' | 'mapping' | 'validation' | 'importing' | 'complete';

// Parse CSV content
function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return { headers, rows };
}

// Type validation helpers
function validateType(value: any, type: string): boolean | string {
  if (value === '' || value === null || value === undefined) return true; // Empty is OK unless required

  switch (type) {
    case 'number':
      return !isNaN(Number(value)) || 'Must be a number';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email format';
    case 'date':
      return !isNaN(Date.parse(value)) || 'Invalid date format';
    case 'boolean':
      return ['true', 'false', '1', '0', 'yes', 'no'].includes(String(value).toLowerCase()) || 'Must be true/false';
    default:
      return true;
  }
}

export function ImportWizard({
  isOpen,
  onClose,
  columns,
  onImport,
  title = 'Import Data',
  maxFileSize = 10,
  acceptedFormats = ['.csv', '.xlsx', '.xls'],
}: ImportWizardProps) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ headers: string[]; rows: string[][] }>({ headers: [], rows: [] });
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Reset wizard
  const reset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setFileData({ headers: [], rows: [] });
    setMappings([]);
    setValidationErrors([]);
    setImportResult(null);
    setParseError(null);
  }, []);

  // Handle file selection
  const handleFile = useCallback(async (selectedFile: File) => {
    setParseError(null);

    // Validate file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      setParseError(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }

    // Validate file type
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(ext)) {
      setParseError(`Invalid file format. Accepted: ${acceptedFormats.join(', ')}`);
      return;
    }

    setFile(selectedFile);

    // Parse file
    try {
      const content = await selectedFile.text();
      const parsed = parseCSV(content);

      if (parsed.headers.length === 0) {
        setParseError('File appears to be empty');
        return;
      }

      setFileData(parsed);

      // Auto-map columns by matching names
      const autoMappings: ImportMapping[] = [];
      columns.forEach(col => {
        const match = parsed.headers.find(
          h => h.toLowerCase() === col.key.toLowerCase() ||
               h.toLowerCase() === col.label.toLowerCase()
        );
        if (match) {
          autoMappings.push({ sourceColumn: match, targetColumn: col.key });
        }
      });
      setMappings(autoMappings);

      setStep('mapping');
    } catch (error) {
      setParseError('Failed to parse file. Please ensure it is a valid CSV.');
    }
  }, [maxFileSize, acceptedFormats, columns]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  // Update mapping
  const updateMapping = useCallback((targetKey: string, sourceColumn: string) => {
    setMappings(prev => {
      const existing = prev.find(m => m.targetColumn === targetKey);
      if (sourceColumn === '') {
        return prev.filter(m => m.targetColumn !== targetKey);
      }
      if (existing) {
        return prev.map(m => m.targetColumn === targetKey ? { ...m, sourceColumn } : m);
      }
      return [...prev, { sourceColumn, targetColumn: targetKey }];
    });
  }, []);

  // Validate data
  const validateData = useCallback(() => {
    const errors: ValidationError[] = [];

    fileData.rows.forEach((row, rowIndex) => {
      columns.forEach(col => {
        const mapping = mappings.find(m => m.targetColumn === col.key);
        if (!mapping) {
          if (col.required) {
            errors.push({
              row: rowIndex + 2, // +2 for header row and 0-index
              column: col.label,
              value: '',
              message: 'Required field not mapped',
            });
          }
          return;
        }

        const sourceIndex = fileData.headers.indexOf(mapping.sourceColumn);
        const value = row[sourceIndex];

        // Check required
        if (col.required && (value === '' || value === undefined)) {
          errors.push({
            row: rowIndex + 2,
            column: col.label,
            value,
            message: 'Required field is empty',
          });
          return;
        }

        // Check type
        if (col.type && value) {
          const typeResult = validateType(value, col.type);
          if (typeResult !== true) {
            errors.push({
              row: rowIndex + 2,
              column: col.label,
              value,
              message: typeResult as string,
            });
          }
        }

        // Custom validation
        if (col.validate && value) {
          const customResult = col.validate(value);
          if (customResult !== true) {
            errors.push({
              row: rowIndex + 2,
              column: col.label,
              value,
              message: typeof customResult === 'string' ? customResult : 'Validation failed',
            });
          }
        }
      });
    });

    setValidationErrors(errors);
    return errors;
  }, [fileData, columns, mappings]);

  // Proceed to validation step
  const goToValidation = useCallback(() => {
    validateData();
    setStep('validation');
  }, [validateData]);

  // Transform and import data
  const handleImport = useCallback(async () => {
    setStep('importing');

    // Transform rows to objects based on mapping
    const transformedData = fileData.rows.map(row => {
      const obj: Record<string, any> = {};
      mappings.forEach(mapping => {
        const sourceIndex = fileData.headers.indexOf(mapping.sourceColumn);
        obj[mapping.targetColumn] = row[sourceIndex];
      });
      return obj;
    });

    try {
      const result = await onImport(transformedData);
      setImportResult(result);
      setStep('complete');
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        skipped: fileData.rows.length,
        errors: [{ row: 0, column: '', value: '', message: 'Import failed unexpectedly' }],
      });
      setStep('complete');
    }
  }, [fileData, mappings, onImport]);

  // Preview data
  const previewData = useMemo(() => {
    return fileData.rows.slice(0, 5).map(row => {
      const obj: Record<string, any> = {};
      mappings.forEach(mapping => {
        const sourceIndex = fileData.headers.indexOf(mapping.sourceColumn);
        obj[mapping.targetColumn] = row[sourceIndex];
      });
      return obj;
    });
  }, [fileData, mappings]);

  // Check if required mappings are complete
  const requiredMappingsComplete = useMemo(() => {
    return columns
      .filter(c => c.required)
      .every(c => mappings.some(m => m.targetColumn === c.key));
  }, [columns, mappings]);

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
          className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step === 'upload' && 'Upload your file'}
                  {step === 'mapping' && 'Map columns to fields'}
                  {step === 'validation' && 'Review validation results'}
                  {step === 'importing' && 'Importing data...'}
                  {step === 'complete' && 'Import complete'}
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

          {/* Progress Steps */}
          <div className="flex items-center justify-center px-3 py-2 bg-gray-50 dark:bg-gray-800/50">
            {['upload', 'mapping', 'validation', 'complete'].map((s, index, arr) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${
                  step === s || arr.indexOf(step) > index
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    arr.indexOf(step) > index
                      ? 'bg-blue-600 text-white'
                      : step === s
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {arr.indexOf(step) > index ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="hidden sm:block text-sm font-medium capitalize">{s}</span>
                </div>
                {index < arr.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                    arr.indexOf(step) > index ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-2">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept={acceptedFormats.join(',')}
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="w-16 h-16 text-gray-400 mb-2" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Accepted formats: {acceptedFormats.join(', ')} (max {maxFileSize}MB)
                  </p>
                </div>

                {parseError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{parseError}</span>
                  </div>
                )}

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expected Columns</h4>
                  <div className="flex flex-wrap gap-2">
                    {columns.map(col => (
                      <span
                        key={col.key}
                        className={`px-2 py-1 text-xs rounded ${
                          col.required
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {col.label} {col.required && '*'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Mapping */}
            {step === 'mapping' && (
              <div className="space-y-2">
                {file && (
                  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500">{fileData.rows.length} rows found</p>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="p-2 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Map Columns
                  </h4>

                  {columns.map(col => {
                    const currentMapping = mappings.find(m => m.targetColumn === col.key);
                    return (
                      <div
                        key={col.key}
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className={`text-sm ${col.required ? 'font-medium' : ''} text-gray-700 dark:text-gray-300`}>
                            {col.label}
                            {col.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                          {col.type && (
                            <span className="ml-2 text-xs text-gray-400">({col.type})</span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <select
                          value={currentMapping?.sourceColumn || ''}
                          onChange={(e) => updateMapping(col.key, e.target.value)}
                          className={`flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            col.required && !currentMapping
                              ? 'border-red-300 dark:border-red-700'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <option value="">— Select column —</option>
                          {fileData.headers.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>

                {previewData.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Preview (First 5 rows)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            {columns.filter(c => mappings.some(m => m.targetColumn === c.key)).map(col => (
                              <th key={col.key} className="px-3 py-2 text-left text-gray-600 dark:text-gray-400">
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, i) => (
                            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                              {columns.filter(c => mappings.some(m => m.targetColumn === c.key)).map(col => (
                                <td key={col.key} className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                  {row[col.key] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Validation */}
            {step === 'validation' && (
              <div className="space-y-2">
                <div className={`p-4 rounded-lg ${
                  validationErrors.length === 0
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}>
                  <div className="flex items-center gap-3">
                    {validationErrors.length === 0 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        validationErrors.length === 0
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {validationErrors.length === 0
                          ? 'All data validated successfully!'
                          : `${validationErrors.length} validation warnings found`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {fileData.rows.length} rows ready to import
                      </p>
                    </div>
                  </div>
                </div>

                {validationErrors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Validation Errors</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {validationErrors.slice(0, 50).map((error, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm"
                        >
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-red-700 dark:text-red-300">
                            Row {error.row}, {error.column}: {error.message}
                            {error.value && <span className="text-red-500"> (value: "{error.value}")</span>}
                          </span>
                        </div>
                      ))}
                      {validationErrors.length > 50 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          ...and {validationErrors.length - 50} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  <RefreshCw className="w-4 h-4" />
                  <span>Rows with errors will be skipped during import</span>
                </div>
              </div>
            )}

            {/* Step 4: Importing */}
            {step === 'importing' && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-2" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Importing your data...
                </p>
                <p className="text-sm text-gray-500">
                  This may take a moment
                </p>
              </div>
            )}

            {/* Step 5: Complete */}
            {step === 'complete' && importResult && (
              <div className="space-y-2">
                <div className={`p-6 rounded-xl text-center ${
                  importResult.success
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="w-16 h-16 text-green-600 mb-2" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600 mb-2" />
                  )}
                  <h3 className={`text-xl font-semibold mb-2 ${
                    importResult.success
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {importResult.success ? 'Import Successful!' : 'Import Failed'}
                  </h3>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-green-600">{importResult.imported}</span>
                      <span className="text-gray-500 ml-1">imported</span>
                    </div>
                    {importResult.skipped > 0 && (
                      <div>
                        <span className="font-semibold text-yellow-600">{importResult.skipped}</span>
                        <span className="text-gray-500 ml-1">skipped</span>
                      </div>
                    )}
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Errors</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {importResult.errors.map((error, i) => (
                        <div
                          key={i}
                          className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300"
                        >
                          {error.row > 0 && `Row ${error.row}: `}{error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div>
              {step !== 'upload' && step !== 'importing' && step !== 'complete' && (
                <button
                  onClick={() => setStep(step === 'validation' ? 'mapping' : 'upload')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step === 'complete' ? (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Done
                </button>
              ) : step === 'importing' ? null : (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  {step === 'mapping' && (
                    <button
                      onClick={goToValidation}
                      disabled={!requiredMappingsComplete}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {step === 'validation' && (
                    <button
                      onClick={handleImport}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Import {fileData.rows.length - validationErrors.filter(e => e.row > 0).length} Rows
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for import wizard management
export function useImportWizard() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}

export type { ImportWizardProps };
