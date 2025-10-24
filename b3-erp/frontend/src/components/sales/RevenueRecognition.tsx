'use client'

import { useState } from 'react'
import { DollarSign, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react'

export interface RevenueSchedule {
  orderId: string;
  customer: string;
  totalRevenue: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  recognitionMethod: 'point-in-time' | 'over-time' | 'percentage-completion';
  startDate: string;
  completionDate: string;
  percentComplete: number;
}

export default function RevenueRecognition() {
  const [schedules] = useState<RevenueSchedule[]>([
    { orderId: 'SO-2025-234', customer: 'ABC Manufacturing', totalRevenue: 28025000, recognizedRevenue: 18216250, deferredRevenue: 9808750, recognitionMethod: 'percentage-completion', startDate: '2025-10-12', completionDate: '2025-11-15', percentComplete: 65 },
    { orderId: 'SO-2025-235', customer: 'XYZ Industries', totalRevenue: 19912500, recognizedRevenue: 8956125, deferredRevenue: 10956375, recognitionMethod: 'over-time', startDate: '2025-10-15', completionDate: '2025-11-20', percentComplete: 45 },
    { orderId: 'SO-2025-237', customer: 'Global Exports', totalRevenue: 11328000, recognizedRevenue: 11328000, deferredRevenue: 0, recognitionMethod: 'point-in-time', startDate: '2025-10-08', completionDate: '2025-10-20', percentComplete: 100 }
  ]);

  const formatCurrency = (amount: number) => `₹${(amount / 10000000).toFixed(2)}Cr`;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-emerald-600" />
          Revenue Recognition
        </h2>
        <p className="text-gray-600 mt-1">Track revenue recognition schedules and compliance</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Schedules ({schedules.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.orderId} className="p-5 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{schedule.orderId}</h4>
                    <p className="text-sm text-gray-600 mt-1">{schedule.customer}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {schedule.recognitionMethod.replace('-', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Total Revenue</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(schedule.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Recognized</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(schedule.recognizedRevenue)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Deferred</p>
                    <p className="text-lg font-bold text-yellow-900">{formatCurrency(schedule.deferredRevenue)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completion Progress</span>
                    <span className="text-sm font-bold text-gray-900">{schedule.percentComplete}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${schedule.percentComplete === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${schedule.percentComplete}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{schedule.startDate} to {schedule.completionDate}</span>
                  </div>
                  {schedule.percentComplete === 100 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
