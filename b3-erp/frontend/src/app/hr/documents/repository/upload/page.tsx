'use client';

import { Upload, Folder, AlertCircle } from 'lucide-react';

export default function UploadRepositoryPage() {
  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Upload to Repository</h1>
        <p className="text-sm text-gray-600 mt-1">Upload documents to the company repository</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Destination Folder</h2>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>HR Policies</option>
          <option>Employee Handbooks</option>
          <option>Templates</option>
          <option>Circulars & Notices</option>
          <option>Compliance Documents</option>
          <option>Training Materials</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-700 font-medium mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Select Files
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Upload Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Only authorized personnel can upload to the repository</li>
          <li>• All documents must be properly categorized</li>
          <li>• Ensure documents are virus-free before uploading</li>
          <li>• Use clear, descriptive file names</li>
          <li>• Add relevant tags and metadata for easy searching</li>
        </ul>
      </div>
    </div>
  );
}
