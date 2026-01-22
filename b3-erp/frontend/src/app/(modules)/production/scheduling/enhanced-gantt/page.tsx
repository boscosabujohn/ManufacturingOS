'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { EnhancedGanttChart } from '@/components/production/EnhancedGanttChart';

export default function EnhancedGanttPage() {
  const router = useRouter();

  const mockTasks = [
    {
      id: '1',
      name: 'Production Planning',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 5),
      progress: 100,
      status: 'completed',
      priority: 'high',
      assignee: 'Alice Smith',
      group: 'planning'
    },
    {
      id: '2',
      name: 'Material Procurement',
      startDate: new Date(2025, 0, 6),
      endDate: new Date(2025, 0, 10),
      progress: 60,
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Bob Jones',
      group: 'procurement',
      dependencies: ['1']
    },
    {
      id: '3',
      name: 'Assembly Phase 1',
      startDate: new Date(2025, 0, 11),
      endDate: new Date(2025, 0, 20),
      progress: 0,
      status: 'not-started',
      priority: 'urgent',
      assignee: 'Charlie Brown',
      group: 'assembly',
      dependencies: ['2']
    },
    {
      id: '4',
      name: 'Quality Check',
      startDate: new Date(2025, 0, 21),
      endDate: new Date(2025, 0, 23),
      progress: 0,
      status: 'not-started',
      priority: 'high',
      assignee: 'Diana Prince',
      group: 'quality',
      dependencies: ['3']
    }
  ];

  const mockGroups = [
    { id: 'planning', name: 'Planning' },
    { id: 'procurement', name: 'Procurement' },
    { id: 'assembly', name: 'Assembly' },
    { id: 'quality', name: 'Quality Control' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
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
      <div className="flex-1 p-6 overflow-hidden">
        <EnhancedGanttChart
          tasks={mockTasks as any}
          groups={mockGroups}
          className="h-full"
          onTaskUpdate={(task) => {
            console.log('Task updated:', task);
          }}
          onDependencyCreate={(fromId, toId) => {
            console.log('Dependency added:', fromId, '->', toId);
          }}
        />
      </div>
    </div>
  );
}
