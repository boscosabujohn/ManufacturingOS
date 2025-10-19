'use client';

import { BarChart3 } from 'lucide-react';

export default function Page() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-indigo-600" />
          Allocation Report
        </h1>
        <p className="text-gray-600 mt-2">Asset allocation status</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">This page is under construction. Full functionality coming soon.</p>
      </div>
    </div>
  );
}
