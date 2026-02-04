'use client';

import { Bell, AlertCircle, Clock } from 'lucide-react';

export default function Page() {
  const alerts = [
    { id: '1', title: 'Factory License Renewal Due', description: 'Factory License expires on 28 Feb 2025', priority: 'high', date: '2025-01-26' },
    { id: '2', title: 'PF ECR Filing Deadline Approaching', description: 'ECR filing due by 15 Feb 2025', priority: 'medium', date: '2025-01-25' },
    { id: '3', title: 'Safety Audit Scheduled', description: 'Factory safety audit scheduled for 10 Feb 2025', priority: 'low', date: '2025-01-24' }
  ];

  return (
    <div className="w-full h-full px-3 py-2">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3">
        <Bell className="h-6 w-6 text-red-600" />
        Compliance Alerts
      </h1>
      <div className="space-y-2">
        {alerts.map(a => (
          <div key={a.id} className={`p-6 rounded-lg border-l-4 ${a.priority === 'high' ? 'bg-red-50 border-red-500' : a.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className={`h-5 w-5 ${a.priority === 'high' ? 'text-red-600' : a.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'}`} />
                  <h3 className="font-bold text-gray-900">{a.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${a.priority === 'high' ? 'bg-red-100 text-red-700' : a.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                    {a.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{a.description}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
