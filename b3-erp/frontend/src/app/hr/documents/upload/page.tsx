'use client';

import { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const documentCategories = [
    { value: 'personal', label: 'Personal Documents', sublabel: 'Aadhaar, PAN, Passport, etc.' },
    { value: 'education', label: 'Education Documents', sublabel: 'Degrees, Certificates, Marksheets' },
    { value: 'employment', label: 'Employment Documents', sublabel: 'Experience Letters, Relieving Letters' },
    { value: 'statutory', label: 'Statutory Documents', sublabel: 'PF, ESI, Bank Details' },
    { value: 'insurance', label: 'Insurance Documents', sublabel: 'Health, Life Insurance Policies' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedCategory || selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      // Simulate file upload - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically:
      // const formData = new FormData();
      // formData.append('category', selectedCategory);
      // selectedFiles.forEach(file => formData.append('files', file));
      // await fetch('/api/documents/upload', { method: 'POST', body: formData });

      setUploadSuccess(true);
      setSelectedFiles([]);
      setSelectedCategory('');

      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="text-sm text-gray-600 mt-1">Upload new documents to your employee profile</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Document Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedCategory === category.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{category.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.sublabel}</p>
                </div>
                {selectedCategory === category.value && (
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Click to upload
            </label>
            <span className="text-gray-600"> or drag and drop</span>
            <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG up to 2MB</p>
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Files ({selectedFiles.length})
          </h2>
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any additional notes about these documents..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                <>Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}</>
              )}
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>

          {uploadSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Upload successful! Documents submitted for verification.</span>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Upload Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Supported formats: PDF, JPG, PNG</li>
          <li>• Maximum file size: 2MB per file</li>
          <li>• Documents must be clear and legible</li>
          <li>• All pages of multi-page documents should be included</li>
          <li>• Ensure document is not expired (where applicable)</li>
          <li>• Personal information must be visible (not blurred or redacted)</li>
          <li>• Uploaded documents will be verified by HR team within 2-3 business days</li>
        </ul>
      </div>
    </div>
  );
}
