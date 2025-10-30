'use client';

import { useRouter } from 'next/navigation';

import { ActivityManagementTracking } from '@/components/crm';
import { ArrowLeft } from 'lucide-react';

export default function ActivityManagementTrackingPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Activity Management & Tracking</h2>
          <p className="text-gray-600 mb-4">
            Track all customer interactions including calls, emails, meetings, and tasks with comprehensive activity logging.
          </p>
          <ActivityManagementTracking />
        </div>
      </div>
    </div>
  );
}
