'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<{ success: boolean; message?: string; errors?: string[] }>;
  title: string;
  acceptedFormats?: string;
  maxSize?: number; // in MB
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
  title,
  acceptedFormats = '.xlsx,.xls,.csv',
  maxSize = 5
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message?: string;
    errors?: string[];
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadResult({
        success: false,
        errors: [`File size exceeds ${maxSize}MB limit`]
      });
      return;
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = acceptedFormats.split(',').map(f => f.replace('.', '').trim());

    if (!fileExtension || !acceptedExtensions.includes(fileExtension)) {
      setUploadResult({
        success: false,
        errors: [`Invalid file type. Accepted formats: ${acceptedFormats}`]
      });
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await onUpload(selectedFile);
      setUploadResult(result);

      if (result.success) {
        setTimeout(() => {
          onClose();
          resetState();
        }, 2000);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        errors: ['An unexpected error occurred. Please try again.']
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      resetState();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!selectedFile ? (
              <>
                <Upload className="h-12 w-12 mb-2 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500 mb-2">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Accepted formats: {acceptedFormats} (Max size: {maxSize}MB)
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!isUploading && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadResult(null);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                uploadResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                {uploadResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {uploadResult.message && (
                    <p
                      className={`font-medium ${
                        uploadResult.success ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {uploadResult.message}
                    </p>
                  )}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-800">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Upload Instructions:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure the file follows the template format</li>
              <li>• Do not modify column headers</li>
              <li>• All required fields must be filled</li>
              <li>• Employee IDs and ESI numbers must be valid</li>
              <li>• Contribution amounts will be auto-calculated</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || uploadResult?.success === true}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
