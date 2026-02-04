'use client';

import { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';

export default function Page() {
  const findings = [
    { id: '1', audit: 'Factory Safety', finding: 'Fire extinguishers expired', severity: 'critical', status: 'open' },
    { id: '2', audit: 'POSH Compliance', finding: 'Training records incomplete', severity: 'moderate', status: 'resolved' }
  ];

  const stats = { total: findings.length, critical: findings.filter(f => f.severity === 'critical').length };

  return (
    <div className="w-full h-full px-3 py-2">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3">
        <FileText className="h-6 w-6 text-orange-600" />
        Audit Findings
      </h1>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 uppercase">Total Findings</p>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
          <p className="text-xs font-semibold text-red-600 uppercase">Critical</p>
          <p className="text-3xl font-bold text-red-900">{stats.critical}</p>
        </div>
      </div>
      <div className="space-y-2">
        {findings.map(f => (
          <div key={f.id} className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-gray-900">{f.audit}</h3>
              <span className={`px-2 py-1 text-xs rounded ${f.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{f.severity.toUpperCase()}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{f.finding}</p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
