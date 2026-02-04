'use client';

import { Archive, File, Download, RotateCcw } from 'lucide-react';

export default function ArchiveRepositoryPage() {
  const archivedDocs = [
    { id: 1, name: 'Leave_Policy_v2.0.pdf', archivedOn: '2024-12-20', archivedBy: 'HR Admin', size: '780 KB' },
    { id: 2, name: 'Employee_Handbook_2024.pdf', archivedOn: '2025-01-15', archivedBy: 'HR Admin', size: '4.2 MB' },
    { id: 3, name: 'Code_of_Conduct_v5.0.pdf', archivedOn: '2025-01-10', archivedBy: 'HR Admin', size: '1.9 MB' }
  ];

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Archived Documents</h1>
        <p className="text-sm text-gray-600 mt-1">View and restore archived documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Archived</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{archivedDocs.length}</p>
            </div>
            <Archive className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Archived Documents</h2>
        <div className="space-y-3">
          {archivedDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                <File className="h-6 w-6 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                  <p className="text-sm text-gray-600">
                    Archived on {new Date(doc.archivedOn).toLocaleDateString('en-IN')} by {doc.archivedBy} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
