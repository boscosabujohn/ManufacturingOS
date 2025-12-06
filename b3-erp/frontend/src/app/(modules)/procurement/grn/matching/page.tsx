'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GoodsReceiptMatching } from '@/components/procurement/GoodsReceiptMatching';

export default function ThreeWayMatchPage() {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">3-Way Matching</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visual PO-GRN-Invoice matching with variance detection and exception handling</p>
          </div>
        </div>
      </div>

      {/* Goods Receipt Matching Component */}
      <div className="p-6">
        <GoodsReceiptMatching
          onApprove={(matchId) => {
            console.log('Match approved:', matchId);
            // In a real app, this would call an API to approve the match
          }}
          onReject={(matchId, reason) => {
            console.log('Match rejected:', matchId, reason);
            // In a real app, this would call an API to reject the match
          }}
          onCreateException={(matchId, lineNumbers) => {
            console.log('Exception created:', matchId, lineNumbers);
            // In a real app, this would create an exception record
          }}
          onAdjust={(matchId, adjustments) => {
            console.log('Adjustments made:', matchId, adjustments);
            // In a real app, this would apply adjustments
          }}
        />
      </div>
    </div>
  );
}
