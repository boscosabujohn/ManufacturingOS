'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PipelineKanban } from '@/components/crm/PipelineKanban';

export default function PipelineKanbanPage() {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline Kanban</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Drag-drop opportunity management with visual pipeline stages</p>
          </div>
        </div>
      </div>

      {/* Pipeline Kanban Component */}
      <div className="p-6">
        <PipelineKanban
          onOpportunityClick={(id: string) => console.log('Opportunity clicked:', id)}
          onOpportunityMove={(opportunityId: string, fromStage: string, toStage: string) => console.log('Stage changed:', opportunityId, fromStage, toStage)}
          onOpportunityEdit={(id: string) => console.log('Quick action:', id)}
        />
      </div>
    </div>
  );
}
