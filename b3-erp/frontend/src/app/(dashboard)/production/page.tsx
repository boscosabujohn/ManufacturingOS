'use client';

import Link from 'next/link';
import { ArrowLeft, Factory } from 'lucide-react';

export default function ProductionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
            <Factory className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Production Module</h1>
            <p className="text-gray-600">Production Planning & Control</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">Production module content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
