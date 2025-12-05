'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { EnhancedGanttChart } from '@/components/production/EnhancedGanttChart';

export default function EnhancedGanttPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enhanced Gantt Chart</h1>
            <p className="text-sm text-gray-600">Drag-and-drop scheduling with dependency visualization</p>
          </div>
        </div>
      </div>

      {/* Gantt Chart Component */}
      <div className="p-6">
        <EnhancedGanttChart
          onTaskUpdate={(taskId, updates) => {
            console.log('Task updated:', taskId, updates);
          }}
          onDependencyAdd={(fromId, toId) => {
            console.log('Dependency added:', fromId, '->', toId);
          }}
        />
      </div>
    </div>
  );
}
