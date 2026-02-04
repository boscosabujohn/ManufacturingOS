'use client'

import { useState } from 'react'
import { FileText, Upload, Download, Eye, Trash2, Folder, Search } from 'lucide-react'

export default function DocumentManagementPage() {
  const [documents] = useState([
    { id: '1', name: 'Annual Report 2024.pdf', category: 'Financial Statements', uploadedBy: 'John Doe', uploadDate: '2025-01-15', size: '2.4 MB' },
    { id: '2', name: 'Tax Return FY2024.pdf', category: 'Tax Documents', uploadedBy: 'Jane Smith', uploadDate: '2025-02-10', size: '1.8 MB' },
    { id: '3', name: 'Audit Report Q3.pdf', category: 'Audit', uploadedBy: 'Robert Brown', uploadDate: '2025-10-05', size: '3.1 MB' },
    { id: '4', name: 'Board Resolution.pdf', category: 'Legal', uploadedBy: 'Sarah Wilson', uploadDate: '2025-09-20', size: '0.5 MB' }
  ])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 px-3 py-2">
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Centralized financial document repository</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700">
            <Upload className="h-5 w-5" />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {['Financial Statements', 'Tax Documents', 'Audit', 'Legal'].map((cat, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <Folder className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-900">{cat}</h3>
              <p className="text-sm text-gray-600 mt-1">{documents.filter(d => d.category === cat).length} files</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Document Name</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Uploaded By</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Upload Date</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Size</th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">{doc.category}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{doc.uploadedBy}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{new Date(doc.uploadDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{doc.size}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Download className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">Download</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
