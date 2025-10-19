'use client';

import { Building } from 'lucide-react';

export default function Page() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Building className="h-8 w-8 text-purple-600" />
          Department Expenses
        </h1>
        <p className="text-gray-600 mt-2">Department-wise expenses</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">This page is under construction. Full functionality coming soon.</p>
      </div>
    </div>
  );
}
