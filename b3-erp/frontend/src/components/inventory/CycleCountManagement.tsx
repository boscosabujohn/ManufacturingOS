'use client';

import React, { useState } from 'react';
import { Clipboard, CheckCircle, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

export type CountStatus = 'scheduled' | 'in-progress' | 'completed' | 'variance-review';

export interface CycleCount {
  id: string;
  zone: string;
  itemsToCount: number;
  itemsCounted: number;
  status: CountStatus;
  assignedTo: string;
  scheduledDate: string;
  completedDate?: string;
  accuracy: number;
  variances: number;
}

export default function CycleCountManagement() {
  const counts: CycleCount[] = [
    {
      id: 'CC-001',
      zone: 'Zone A (High Value)',
      itemsToCount: 50,
      itemsCounted: 50,
      status: 'completed',
      assignedTo: 'John Doe',
      scheduledDate: '2025-01-24',
      completedDate: '2025-01-24',
      accuracy: 98,
      variances: 1,
    },
    {
      id: 'CC-002',
      zone: 'Zone B (Fast Moving)',
      itemsToCount: 120,
      itemsCounted: 85,
      status: 'in-progress',
      assignedTo: 'Jane Smith',
      scheduledDate: '2025-01-24',
      accuracy: 0,
      variances: 0,
    },
    {
      id: 'CC-003',
      zone: 'Zone C (Slow Moving)',
      itemsToCount: 200,
      itemsCounted: 0,
      status: 'scheduled',
      assignedTo: 'Bob Wilson',
      scheduledDate: '2025-01-25',
      accuracy: 0,
      variances: 0,
    },
  ];

  const getStatusColor = (status: CountStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'variance-review': return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-3">
      <div className="">
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cycle Count Management</h1>
          <p className="text-gray-600">Perpetual inventory accuracy through systematic counting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Scheduled</p>
            <p className="text-3xl font-bold text-gray-600">{counts.filter(c => c.status === 'scheduled').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{counts.filter(c => c.status === 'in-progress').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{counts.filter(c => c.status === 'completed').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Avg Accuracy</p>
            <p className="text-3xl font-bold text-purple-600">98.5%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cycle Counts</h2>

          <div className="space-y-2">
            {counts.map((count) => (
              <div key={count.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clipboard className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{count.zone}</h3>
                      <p className="text-sm text-gray-600">Assigned to: {count.assignedTo}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(count.status)}`}>
                    {count.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Progress</p>
                    <p className="font-semibold text-gray-900">{count.itemsCounted}/{count.itemsToCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Scheduled Date</p>
                    <p className="font-semibold text-gray-900">{count.scheduledDate}</p>
                  </div>
                  {count.accuracy > 0 && (
                    <>
                      <div>
                        <p className="text-gray-600">Accuracy</p>
                        <p className="font-semibold text-green-600">{count.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Variances</p>
                        <p className="font-semibold text-orange-600">{count.variances}</p>
                      </div>
                    </>
                  )}
                </div>

                {count.status === 'in-progress' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(count.itemsCounted / count.itemsToCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
