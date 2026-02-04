'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PhaseProgressVisualization } from '@/components/project-management/PhaseProgressVisualization';

export default function PhaseProgressPage() {
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Phase Progress</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Visual progress through 8 manufacturing phases</p>
     </div>
    </div>
   </div>

   {/* Phase Progress Component */}
   <div className="p-6 space-y-3">
    {/* Horizontal View */}
    <PhaseProgressVisualization
     variant="horizontal"
     showDetails={true}
     onPhaseClick={(phaseId) => console.log('Phase clicked:', phaseId)}
     onTaskClick={(phaseId, taskId) => console.log('Task clicked:', phaseId, taskId)}
    />

    {/* Compact View for Quick Reference */}
    <div className="mt-6">
     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick View</h3>
     <PhaseProgressVisualization
      variant="compact"
      onPhaseClick={(phaseId) => console.log('Phase clicked:', phaseId)}
     />
    </div>
   </div>
  </div>
 );
}
