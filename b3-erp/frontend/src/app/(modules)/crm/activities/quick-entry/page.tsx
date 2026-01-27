'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ActivityQuickEntry } from '@/components/crm/ActivityQuickEntry';

export default function ActivityQuickEntryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Quick Entry</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">One-click logging for calls, emails, meetings, and tasks</p>
          </div>
        </div>
      </div>

      {/* Activity Quick Entry Component */}
      <div className="p-6">
        <ActivityQuickEntry
          onSubmit={(activity: { type: string; contact: { id: string; name: string; company: string; email: string; phone: string }; subject: string; notes: string; outcome?: string; duration?: number; scheduledDate?: Date }) => {
            console.log('Activity saved:', activity);
            // In a real app, this would refresh the activities list or show a success message
          }}
        />
      </div>
    </div>
  );
}
