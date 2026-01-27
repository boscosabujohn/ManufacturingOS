'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AndonBoard, ProductionLine } from '@/components/production/AndonBoard';

// Mock production lines data for the Andon board
const mockProductionLines: ProductionLine[] = [
  {
    id: 'line-1',
    name: 'Assembly Line A',
    status: 'running',
    currentProduct: 'Motor Assembly M-100',
    workOrderNumber: 'WO-2024-0001',
    target: 100,
    actual: 85,
    oee: 88.5,
    cycleTime: 45,
    operator: 'John Smith',
    shift: 'Day Shift',
    lastUpdate: new Date(),
  },
  {
    id: 'line-2',
    name: 'Assembly Line B',
    status: 'stopped',
    currentProduct: 'Pump Assembly P-200',
    workOrderNumber: 'WO-2024-0002',
    target: 80,
    actual: 45,
    oee: 72.3,
    cycleTime: 60,
    operator: 'Jane Doe',
    shift: 'Day Shift',
    alerts: [
      {
        id: 'alert-1',
        type: 'maintenance',
        severity: 'critical',
        message: 'Conveyor motor failure - maintenance required',
        timestamp: new Date(),
      }
    ],
    lastUpdate: new Date(),
  },
  {
    id: 'line-3',
    name: 'Winding Station',
    status: 'running',
    currentProduct: 'Stator Winding SW-50',
    workOrderNumber: 'WO-2024-0003',
    target: 60,
    actual: 58,
    oee: 95.2,
    cycleTime: 90,
    operator: 'Mike Wilson',
    shift: 'Day Shift',
    lastUpdate: new Date(),
  },
];

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
        lines={mockProductionLines}
        refreshInterval={10000}
        onAlertAcknowledge={(alertId: string, lineId: string) => {
          console.log('Alert acknowledged:', alertId, lineId);
        }}
        onLineClick={(line: ProductionLine) => {
          console.log('Line clicked:', line.id);
        }}
      />
    </div>
  );
}
