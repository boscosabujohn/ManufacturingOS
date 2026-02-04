'use client'
import { TrendingUp } from 'lucide-react'
export default function BacklogForecasting() {
  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          Backlog Forecasting
        </h2>
        <p className="text-gray-600 mt-1">AI-powered ticket volume prediction and capacity planning</p>
      </div>
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
        <div className="text-center py-12">
          <p className="text-gray-600">Backlog forecasting with ML-based predictions</p>
        </div>
      </div>
    </div>
  );
}
