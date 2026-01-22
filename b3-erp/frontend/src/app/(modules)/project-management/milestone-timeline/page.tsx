'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { MilestoneTimeline } from '@/components/project-management/MilestoneTimeline';

export default function MilestoneTimelinePage() {
 const router = useRouter();
 const [variant, setVariant] = useState<'horizontal' | 'vertical'>('horizontal');

 return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
   {/* Header */}
   <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
    <div className="flex items-center justify-between flex-wrap gap-4">
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
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Milestone Timeline</h1>
       <p className="text-sm text-gray-600 dark:text-gray-400">Visual milestone tracking and progress</p>
      </div>
     </div>

     {/* View Toggle */}
     <div className="flex items-center gap-2">
      <button
       onClick={() => setVariant('horizontal')}
       className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        variant === 'horizontal'
         ? 'bg-blue-600 text-white'
         : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
       }`}
      >
       Horizontal
      </button>
      <button
       onClick={() => setVariant('vertical')}
       className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        variant === 'vertical'
         ? 'bg-blue-600 text-white'
         : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
       }`}
      >
       Vertical
      </button>
     </div>
    </div>
   </div>

   {/* Milestone Timeline Component */}
   <div className="p-6">
    <MilestoneTimeline
     variant={variant}
     showPhases={true}
     highlightUpcoming={true}
     onMilestoneClick={(milestoneId) => console.log('Milestone clicked:', milestoneId)}
    />
   </div>
  </div>
 );
}
