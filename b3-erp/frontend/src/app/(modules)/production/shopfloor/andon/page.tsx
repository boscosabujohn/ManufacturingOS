'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AndonBoard } from '@/components/production/AndonBoard';

export default function AndonBoardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Minimal Header - Andon typically runs fullscreen */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 print:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Exit Andon</span>
          </button>
          <p className="text-sm text-gray-400">Press F11 for fullscreen mode</p>
        </div>
      </div>

      {/* Andon Board Component */}
      <AndonBoard
        refreshInterval={10000}
        onAlertAcknowledge={(lineId, alertId) => {
          console.log('Alert acknowledged:', lineId, alertId);
        }}
        onLineClick={(lineId) => {
          console.log('Line clicked:', lineId);
        }}
      />
    </div>
  );
}
