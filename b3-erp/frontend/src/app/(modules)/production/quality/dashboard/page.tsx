'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { QualityControlDashboard } from '@/components/production/QualityControlDashboard';

export default function QualityDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header - Dashboard has its own header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Quality</span>
          </button>
        </div>
      </div>

      {/* Quality Control Dashboard Component */}
      <QualityControlDashboard
        productLine="All Production Lines"
        refreshInterval={30000}
        onRefresh={() => {
          console.log('Dashboard refreshed');
        }}
        onExport={(type) => {
          console.log('Exporting:', type);
        }}
      />
    </div>
  );
}
