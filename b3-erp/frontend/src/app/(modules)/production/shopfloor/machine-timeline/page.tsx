'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { MachineTimeline } from '@/components/production/MachineTimeline';

export default function MachineTimelinePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
          date={new Date(selectedDate)}
          onEventClick={(machineId, event) => {
            console.log('Event clicked:', machineId, event);
          }}
          onMachineClick={(machineId) => {
            console.log('Machine clicked:', machineId);
          }}
        />
      </div>
    </div>
  );
}
