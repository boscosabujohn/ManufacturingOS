'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Database,
  Link as LinkIcon,
  Table,
  Zap,
} from 'lucide-react';

export type ImportSource = 'excel' | 'csv' | 'erp' | 'cad' | 'plm';
export type ImportStatus = 'ready' | 'processing' | 'completed' | 'failed';

export interface BOMLineItem {
  itemNumber: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalCost?: number;
  vendor?: string;
  leadTime?: number;
  status: 'valid' | 'warning' | 'error';
  issues?: string[];
}

export interface BOMImportSession {
  id: string;
  source: ImportSource;
  fileName: string;
  fileSize: number;
  status: ImportStatus;
  uploadedAt: string;
  processedAt?: string;
  totalItems: number;
  validItems: number;
  itemsWithWarnings: number;
  itemsWithErrors: number;
  items: BOMLineItem[];
}

export interface BOMImportProps {
  sessions: BOMImportSession[];
  onUploadFile?: (file: File, source: ImportSource) => void;
  onConnectERP?: () => void;
  onConnectCAD?: () => void;
  onValidateItems?: (sessionId: string) => void;
  onImportToEstimate?: (sessionId: string, estimateId: string) => void;
  onDownloadTemplate?: (source: ImportSource) => void;
  onViewSession?: (sessionId: string) => void;
  className?: string;
}

export const BOMImport: React.FC<BOMImportProps> = ({
  sessions,
  onUploadFile,
  onConnectERP,
  onConnectCAD,
  onValidateItems,
  onImportToEstimate,
  onDownloadTemplate,
  onViewSession,
  className = '',
}) => {
  const [selectedSource, setSelectedSource] = useState<ImportSource>('excel');
  const [dragActive, setDragActive] = useState(false);

  const getSourceConfig = (source: ImportSource) => {
    switch (source) {
      case 'excel':
        return { icon: FileText, color: 'text-green-600', bg: 'bg-green-50', label: 'Excel' };
      case 'csv':
        return { icon: Table, color: 'text-blue-600', bg: 'bg-blue-50', label: 'CSV' };
      case 'erp':
        return { icon: Database, color: 'text-purple-600', bg: 'bg-purple-50', label: 'ERP System' };
      case 'cad':
        return { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', label: 'CAD Software' };
      case 'plm':
        return { icon: LinkIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'PLM System' };
    }
  };

  const getStatusConfig = (status: ImportStatus) => {
    switch (status) {
      case 'ready':
        return { icon: Upload, color: 'text-blue-600', label: 'Ready' };
      case 'processing':
        return { icon: RefreshCw, color: 'text-yellow-600', label: 'Processing' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', label: 'Completed' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', label: 'Failed' };
    }
  };

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
      onUploadFile?.(e.dataTransfer.files[0], selectedSource);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Import Bill of Materials</h3>

        {/* Source Selection */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          {(['excel', 'csv', 'erp', 'cad', 'plm'] as ImportSource[]).map((source) => {
            const config = getSourceConfig(source);
            const SourceIcon = config.icon;
            return (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSource === source
                    ? `${config.bg} border-current ${config.color}`
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <SourceIcon className={`h-8 w-8 mb-2 ${selectedSource === source ? config.color : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold text-center ${selectedSource === source ? config.color : 'text-gray-700'}`}>
                  {config.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Upload Methods */}
        {(selectedSource === 'excel' || selectedSource === 'csv') && (
          <div>
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-semibold text-gray-900 mb-1">Drop your file here</p>
              <p className="text-sm text-gray-600 mb-2">or click to browse</p>
              <input
                type="file"
                accept={selectedSource === 'excel' ? '.xlsx,.xls' : '.csv'}
                onChange={(e) => e.target.files && onUploadFile?.(e.target.files[0], selectedSource)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
              >
                Select File
              </label>
            </div>

            {/* Download Template */}
            {onDownloadTemplate && (
              <button
                onClick={() => onDownloadTemplate(selectedSource)}
                className="mt-4 text-sm text-blue-600 hover:underline flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download template for {getSourceConfig(selectedSource).label}</span>
              </button>
            )}
          </div>
        )}

        {/* ERP/CAD/PLM Connection */}
        {selectedSource !== 'excel' && selectedSource !== 'csv' && (
          <div className="text-center py-8">
            <Database className="h-16 w-16 text-gray-400 mb-2" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Connect to {getSourceConfig(selectedSource).label}</h4>
            <p className="text-gray-600 mb-3">Integrate with your existing system to import BOMs automatically</p>
            <button
              onClick={selectedSource === 'erp' ? onConnectERP : onConnectCAD}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
            >
              <LinkIcon className="h-5 w-5" />
              <span>Configure Connection</span>
            </button>
          </div>
        )}
      </div>

      {/* Import History */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Import History</h3>

        <div className="space-y-3">
          {sessions.map((session) => {
            const sourceConfig = getSourceConfig(session.source);
            const statusConfig = getStatusConfig(session.status);
            const SourceIcon = sourceConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <div key={session.id} className="border-2 border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${sourceConfig.bg}`}>
                      <SourceIcon className={`h-6 w-6 ${sourceConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{session.fileName}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div>
                          <p className="text-xs text-gray-500">Total Items</p>
                          <p className="text-sm font-bold text-gray-900">{session.totalItems}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valid</p>
                          <p className="text-sm font-bold text-green-600">{session.validItems}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Warnings</p>
                          <p className="text-sm font-bold text-yellow-600">{session.itemsWithWarnings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Errors</p>
                          <p className="text-sm font-bold text-red-600">{session.itemsWithErrors}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600">
                        Uploaded: {new Date(session.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {onValidateItems && session.status === 'ready' && (
                      <button
                        onClick={() => onValidateItems(session.id)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Validate
                      </button>
                    )}
                    {onImportToEstimate && session.status === 'completed' && (
                      <button
                        onClick={() => onImportToEstimate(session.id, 'EST-001')}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Import
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600">No import history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
