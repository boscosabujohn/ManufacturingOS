'use client';

import { Wrench, CheckCircle, Clock } from 'lucide-react';

export default function Page() {
  const plans = [
    { id: '1', finding: 'Fire extinguishers expired', action: 'Replace all extinguishers', owner: 'Safety Team', due: '2025-02-01', status: 'in_progress' },
    { id: '2', finding: 'Training records incomplete', action: 'Complete documentation', owner: 'HR Team', due: '2025-01-30', status: 'completed' }
  ];

  const stats = { total: plans.length, completed: plans.filter(p => p.status === 'completed').length };

  return (
    <div className="w-full h-full px-3 py-2">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3">
        <Wrench className="h-6 w-6 text-green-600" />
        Remediation Plans
      </h1>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 uppercase">Total Plans</p>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
          <p className="text-xs font-semibold text-green-600 uppercase">Completed</p>
          <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
        </div>
      </div>
      <div className="space-y-2">
        {plans.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-bold text-gray-900">{p.finding}</h3>
              <span className={`px-2 py-1 text-xs rounded ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div><span className="text-gray-600">Action:</span> <span className="font-medium">{p.action}</span></div>
              <div><span className="text-gray-600">Owner:</span> <span className="font-medium">{p.owner}</span></div>
              <div><span className="text-gray-600">Due:</span> <span className="font-medium">{new Date(p.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
