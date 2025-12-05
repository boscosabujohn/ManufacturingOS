'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Customer360Unified } from '@/components/crm/Customer360Unified';

export default function Customer360Page() {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer 360° View</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unified customer profile with timeline and insights</p>
          </div>
        </div>
      </div>

      {/* Customer 360 Component */}
      <div className="p-6">
        <Customer360Unified
          onContactClick={(contactId) => console.log('Contact clicked:', contactId)}
          onOpportunityClick={(oppId) => console.log('Opportunity clicked:', oppId)}
          onOrderClick={(orderId) => console.log('Order clicked:', orderId)}
          onTicketClick={(ticketId) => console.log('Ticket clicked:', ticketId)}
          onActivityClick={(activityId) => console.log('Activity clicked:', activityId)}
        />
      </div>
    </div>
  );
}
