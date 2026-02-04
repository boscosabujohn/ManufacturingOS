'use client';

import { useRouter } from 'next/navigation';

import { SalesAutomation } from '@/components/crm';
import { ArrowLeft } from 'lucide-react';

export default function SalesAutomationPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      <div className="flex-1 px-3 py-2 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sales Automation</h2>
          <p className="text-gray-600 mb-2">
            Automate repetitive sales tasks, follow-ups, and workflows to increase efficiency and ensure consistency.
          </p>
          <SalesAutomation />
        </div>
      </div>
    </div>
  );
}
