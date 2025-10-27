'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Database, CheckCircle, XCircle, AlertTriangle, Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface ImportJob {
  id: string;
  filename: string;
  format: 'csv' | 'excel' | 'json' | 'sql' | 'xml';
  status: 'pending' | 'validating' | 'importing' | 'completed' | 'failed' | 'paused';
  progress: number;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  startTime?: string;
  endTime?: string;
  duration?: string;
  errorLog?: string[];
  warnings?: string[];
}

interface ImportMapping {
  sourceColumn: string;
  targetColumn: string;
  dataType: string;
  required: boolean;
  mapped: boolean;
}

export default function DatabaseImportPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTable, setSelectedTable] = useState('');
  const [importMode, setImportMode] = useState<'insert' | 'update' | 'upsert'>('insert');
  const [validateOnly, setValidateOnly] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);

  const [importJobs, setImportJobs] = useState<ImportJob[]>([
    {
      id: '1',
      filename: 'customers_20240120.csv',
      format: 'csv',
      status: 'completed',
      progress: 100,
      totalRecords: 1856,
      importedRecords: 1856,
      failedRecords: 0,
      startTime: '2024-01-20 14:30:00',
      endTime: '2024-01-20 14:32:15',
      duration: '2m 15s',
      warnings: ['2 duplicate entries skipped']
    },
    {
      id: '2',
      filename: 'products_update.xlsx',
      format: 'excel',
      status: 'importing',
      progress: 67,
      totalRecords: 8934,
      importedRecords: 5986,
      failedRecords: 12,
      startTime: '2024-01-20 15:00:00',
      errorLog: ['Row 234: Invalid price format', 'Row 567: Missing required field SKU']
    },
    {
      id: '3',
      filename: 'inventory_snapshot.json',
      format: 'json',
      status: 'validating',
      progress: 25,
      totalRecords: 15678,
      importedRecords: 0,
      failedRecords: 0,
      startTime: '2024-01-20 15:15:00'
    },
    {
      id: '4',
      filename: 'sales_orders_Q4.csv',
      format: 'csv',
      status: 'failed',
      progress: 23,
      totalRecords: 5847,
      importedRecords: 1345,
      failedRecords: 234,
      startTime: '2024-01-19 16:00:00',
      endTime: '2024-01-19 16:08:30',
      duration: '8m 30s',
      errorLog: [
        'Critical error: Foreign key constraint violation',
        'Table lock timeout',
        'Import aborted due to critical errors'
      ]
    },
    {
      id: '5',
      filename: 'suppliers_master.csv',
      format: 'csv',
      status: 'paused',
      progress: 45,
      totalRecords: 456,
      importedRecords: 205,
      failedRecords: 3,
      startTime: '2024-01-20 14:45:00',
      warnings: ['Import paused by user']
    },
    {
      id: '6',
      filename: 'bom_export_backup.sql',
      format: 'sql',
      status: 'pending',
      progress: 0,
      totalRecords: 1234,
      importedRecords: 0,
      failedRecords: 0
    }
  ]);

  const tables = [
    'users', 'roles', 'permissions', 'sales_orders', 'quotations', 'invoices',
    'customers', 'work_orders', 'bom', 'quality_checks', 'inventory',
    'stock_movements', 'warehouses', 'products', 'suppliers', 'transactions', 'payments'
  ];

  const [columnMappings] = useState<ImportMapping[]>([
    { sourceColumn: 'customer_name', targetColumn: 'name', dataType: 'string', required: true, mapped: true },
    { sourceColumn: 'email_address', targetColumn: 'email', dataType: 'string', required: true, mapped: true },
    { sourceColumn: 'phone', targetColumn: 'phone', dataType: 'string', required: false, mapped: true },
    { sourceColumn: 'company', targetColumn: 'company_name', dataType: 'string', required: false, mapped: true },
    { sourceColumn: 'address', targetColumn: 'address', dataType: 'text', required: false, mapped: true },
    { sourceColumn: 'tax_id', targetColumn: 'tax_number', dataType: 'string', required: false, mapped: false }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartImport = () => {
    console.log('Starting import:', {
      file: selectedFile?.name,
      table: selectedTable,
      mode: importMode,
      validateOnly,
      skipErrors
    });
  };

  const handlePauseImport = (jobId: string) => {
    setImportJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, status: 'paused' as const } : job
      )
    );
  };

  const handleResumeImport = (jobId: string) => {
    setImportJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, status: 'importing' as const } : job
      )
    );
  };

  const handleRetryImport = (jobId: string) => {
    setImportJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? { ...job, status: 'pending' as const, progress: 0, importedRecords: 0, failedRecords: 0 }
          : job
      )
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700 border-gray-300',
      validating: 'bg-blue-100 text-blue-700 border-blue-300',
      importing: 'bg-blue-100 text-blue-700 border-blue-300',
      completed: 'bg-green-100 text-green-700 border-green-300',
      failed: 'bg-red-100 text-red-700 border-red-300',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'importing':
      case 'validating':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    totalImports: importJobs.length,
    completed: importJobs.filter(j => j.status === 'completed').length,
    inProgress: importJobs.filter(j => j.status === 'importing' || j.status === 'validating').length,
    failed: importJobs.filter(j => j.status === 'failed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Database Import</h1>
          <p className="text-sm text-gray-500 mt-1">Import data from CSV, Excel, JSON, SQL, or XML files</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Imports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalImports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">New Import</h2>

          {/* File Upload */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">
              Drop your file here or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-4">
              CSV, Excel, JSON, SQL, XML (Max 100MB)
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls,.json,.sql,.xml"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block text-sm font-medium"
            >
              Select File
            </label>
            {selectedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-900">{selectedFile.name}</p>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Import Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Table</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select table...</option>
                {tables.map(table => (
                  <option key={table} value={table}>{table}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Import Mode</label>
              <div className="space-y-2">
                {[
                  { value: 'insert', label: 'Insert Only', desc: 'Add new records only' },
                  { value: 'update', label: 'Update Only', desc: 'Update existing records' },
                  { value: 'upsert', label: 'Insert or Update', desc: 'Add new or update existing' }
                ].map((mode) => (
                  <label key={mode.value} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300">
                    <input
                      type="radio"
                      name="importMode"
                      value={mode.value}
                      checked={importMode === mode.value}
                      onChange={(e) => setImportMode(e.target.value as any)}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{mode.label}</p>
                      <p className="text-xs text-gray-600">{mode.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={validateOnly}
                  onChange={(e) => setValidateOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Validate only (don't import)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipErrors}
                  onChange={(e) => setSkipErrors(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Skip rows with errors</span>
              </label>
            </div>

            <button
              onClick={handleStartImport}
              disabled={!selectedFile || !selectedTable}
              className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Start Import
            </button>
          </div>

          {/* Column Mapping Preview */}
          {selectedFile && selectedTable && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Column Mapping</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {columnMappings.slice(0, 4).map((mapping, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <span className="text-gray-700">{mapping.sourceColumn}</span>
                    <span className="text-gray-400">→</span>
                    <span className={`font-medium ${mapping.mapped ? 'text-green-700' : 'text-red-700'}`}>
                      {mapping.targetColumn}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium">
                Configure Mappings
              </button>
            </div>
          )}
        </div>

        {/* Import Jobs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Import Jobs</h2>

          <div className="space-y-4">
            {importJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{job.filename}</h3>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                        {job.format.toUpperCase()}
                      </span>
                    </div>

                    {(job.status === 'importing' || job.status === 'validating') && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{job.status === 'validating' ? 'Validating...' : 'Importing...'}</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Total Records</p>
                        <p className="font-semibold text-gray-900">{job.totalRecords.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Imported</p>
                        <p className="font-semibold text-green-600">{job.importedRecords.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Failed</p>
                        <p className="font-semibold text-red-600">{job.failedRecords}</p>
                      </div>
                    </div>

                    {job.duration && (
                      <p className="text-xs text-gray-600">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {job.startTime} - {job.endTime} ({job.duration})
                      </p>
                    )}

                    {job.warnings && job.warnings.length > 0 && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-yellow-900">Warnings:</p>
                            {job.warnings.map((warning, i) => (
                              <p key={i} className="text-xs text-yellow-700">{warning}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {job.errorLog && job.errorLog.length > 0 && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-red-900">Errors:</p>
                            {job.errorLog.slice(0, 3).map((error, i) => (
                              <p key={i} className="text-xs text-red-700">{error}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {job.status === 'importing' && (
                      <button
                        onClick={() => handlePauseImport(job.id)}
                        className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600"
                       
                      >
                        <Pause className="w-5 h-5" />
                      </button>
                    )}
                    {job.status === 'paused' && (
                      <button
                        onClick={() => handleResumeImport(job.id)}
                        className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                       
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                    {job.status === 'failed' && (
                      <button
                        onClick={() => handleRetryImport(job.id)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                       
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Import Best Practices:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Always validate data before importing to production</li>
              <li>• Create a database backup before large imports</li>
              <li>• Use "Skip errors" mode for partial imports of large datasets</li>
              <li>• Review error logs to fix data quality issues</li>
              <li>• Test imports on staging environment first</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
