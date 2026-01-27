'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { useState } from 'react';
import { MachineTimeline, Machine, MachineEvent } from '@/components/production/MachineTimeline';

// Mock machines data
const mockMachines: Machine[] = [
  { id: 'machine-1', name: 'CNC Machine 01', code: 'CNC-001', type: 'CNC', status: 'running', currentShift: 'Day', utilization: 85 },
  { id: 'machine-2', name: 'CNC Machine 02', code: 'CNC-002', type: 'CNC', status: 'idle', currentShift: 'Day', utilization: 60 },
  { id: 'machine-3', name: 'Assembly Line A', code: 'ASSY-001', type: 'Assembly', status: 'running', currentShift: 'Day', utilization: 92 },
  { id: 'machine-4', name: 'Welding Station', code: 'WELD-001', type: 'Welding', status: 'maintenance', currentShift: 'Day', utilization: 0 },
];

// Generate mock events for today
function generateMockEvents(date: Date): MachineEvent[] {
  const events: MachineEvent[] = [];
  const dayStart = new Date(date);
  dayStart.setHours(6, 0, 0, 0);

  mockMachines.forEach(machine => {
    // Add production event
    const prodStart = new Date(dayStart);
    prodStart.setHours(8, 0, 0, 0);
    const prodEnd = new Date(dayStart);
    prodEnd.setHours(12, 0, 0, 0);
    events.push({
      id: `${machine.id}-prod-1`,
      machineId: machine.id,
      type: 'production',
      startTime: prodStart,
      endTime: prodEnd,
      workOrderNumber: 'WO-2024-001',
      product: 'Motor Assembly',
      output: 45,
      plannedOutput: 50,
    });

    // Add break
    const breakStart = new Date(dayStart);
    breakStart.setHours(12, 0, 0, 0);
    const breakEnd = new Date(dayStart);
    breakEnd.setHours(13, 0, 0, 0);
    events.push({
      id: `${machine.id}-break`,
      machineId: machine.id,
      type: 'break',
      startTime: breakStart,
      endTime: breakEnd,
    });

    // Add afternoon production
    const prodStart2 = new Date(dayStart);
    prodStart2.setHours(13, 0, 0, 0);
    const prodEnd2 = new Date(dayStart);
    prodEnd2.setHours(17, 0, 0, 0);
    events.push({
      id: `${machine.id}-prod-2`,
      machineId: machine.id,
      type: 'production',
      startTime: prodStart2,
      endTime: prodEnd2,
      workOrderNumber: 'WO-2024-002',
      product: 'Pump Assembly',
      output: 38,
      plannedOutput: 40,
    });
  });

  return events;
}

export default function MachineTimelinePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const events = generateMockEvents(new Date(selectedDate));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
              <h1 className="text-2xl font-bold text-gray-900">Machine Timeline</h1>
              <p className="text-sm text-gray-600">Visual machine utilization and event tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Picker */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Machine Timeline Component */}
      <div className="p-6">
        <MachineTimeline
          machines={mockMachines}
          events={events}
          date={new Date(selectedDate)}
          onEventClick={(event: MachineEvent) => {
            console.log('Event clicked:', event.machineId, event);
          }}
          onMachineClick={(machine: Machine) => {
            console.log('Machine clicked:', machine.id);
          }}
        />
      </div>
    </div>
  );
}
