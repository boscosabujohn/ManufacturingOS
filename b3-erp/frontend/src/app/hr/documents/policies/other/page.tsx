'use client';

import { Files, Download, Eye } from 'lucide-react';

export default function OtherPoliciesPage() {
  const policies = [
    { id: 1, title: 'Remote Work Policy', version: 'v2.0', lastUpdated: '2024-12-01', fileSize: '450 KB' },
    { id: 2, title: 'BYOD Policy', version: 'v1.5', lastUpdated: '2024-11-15', fileSize: '380 KB' },
    { id: 3, title: 'Training & Development Policy', version: 'v3.1', lastUpdated: '2024-10-20', fileSize: '620 KB' },
    { id: 4, title: 'Performance Management Policy', version: 'v4.0', lastUpdated: '2025-01-05', fileSize: '890 KB' },
    { id: 5, title: 'Referral Policy', version: 'v2.2', lastUpdated: '2024-09-10', fileSize: '320 KB' },
    { id: 6, title: 'Exit Policy', version: 'v3.5', lastUpdated: '2024-11-30', fileSize: '550 KB' },
    { id: 7, title: 'Background Verification Policy', version: 'v1.8', lastUpdated: '2024-08-15', fileSize: '420 KB' },
    { id: 8, title: 'Asset Management Policy', version: 'v2.6', lastUpdated: '2024-10-05', fileSize: '680 KB' }
  ];

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Other Policies</h1>
        <p className="text-sm text-gray-600 mt-1">Additional company policies and guidelines</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Policies</h2>
        <div className="space-y-3">
          {policies.map((policy) => (
            <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Version {policy.version} • Last updated: {new Date(policy.lastUpdated).toLocaleDateString('en-IN')} • {policy.fileSize}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
