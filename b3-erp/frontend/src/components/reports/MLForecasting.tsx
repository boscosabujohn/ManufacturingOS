'use client'
import { TrendingUp, Sparkles, BarChart3 } from 'lucide-react'
export default function MLForecasting() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-yellow-600" />
          ML Forecasting
        </h2>
        <p className="text-gray-600 mt-1">AI-powered predictive analytics and forecasting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">95%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
          <div className="text-sm text-gray-600">Models</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">1,234</div>
          <div className="text-sm text-gray-600">Predictions</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">90d</div>
          <div className="text-sm text-gray-600">Forecast Horizon</div>
        </div>
      </div>
    </div>
  );
}
