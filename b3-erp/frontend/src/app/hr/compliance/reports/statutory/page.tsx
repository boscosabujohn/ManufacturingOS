'use client';

import { FileText, Download } from 'lucide-react';

export default function Page() {
  const reports = [
    { id: '1', title: 'PF ECR - January 2025', type: 'Monthly', dueDate: '2025-02-15', status: 'pending' },
    { id: '2', title: 'ESI Return - January 2025', type: 'Monthly', dueDate: '2025-02-21', status: 'pending' },
    { id: '3', title: 'POSH Annual Report 2024', type: 'Annual', dueDate: '2025-01-31', status: 'submitted' }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        Statutory Reports
      </h1>
      <div className="space-y-4">
        {reports.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600">Type: {r.type}</span>
                  <span className="text-gray-600">Due: {new Date(r.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className={`px-2 py-1 text-xs rounded ${r.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
