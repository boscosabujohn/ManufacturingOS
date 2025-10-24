'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, Calendar, Target, AlertCircle } from 'lucide-react'

export interface Forecast {
  month: string;
  predicted: number;
  confidence: number;
  actual?: number;
  variance?: number;
}

export default function PredictiveForecasting() {
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRealTimeUpdate(prev => prev + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  const [forecasts] = useState<Forecast[]>([
    { month: 'Oct 2025', predicted: 125000000, confidence: 92, actual: 123500000, variance: -1.2 },
    { month: 'Nov 2025', predicted: 132000000 + (realTimeUpdate % 5) * 1000000, confidence: 88, actual: undefined },
    { month: 'Dec 2025', predicted: 145000000 + (realTimeUpdate % 3) * 2000000, confidence: 85, actual: undefined },
    { month: 'Jan 2026', predicted: 138000000, confidence: 78, actual: undefined }
  ]);

  const formatCurrency = (amount: number) => `₹${(amount / 10000000).toFixed(2)}Cr`;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              Predictive Sales Forecasting
            </h2>
            <p className="text-gray-600 mt-1">AI-powered revenue predictions with confidence intervals</p>
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            Last updated: {new Date().toLocaleTimeString()}
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Forecast</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {forecasts.map((forecast, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <h4 className="font-bold text-gray-900">{forecast.month}</h4>
                  </div>
                  {forecast.actual ? (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${forecast.variance && forecast.variance < 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {forecast.variance}% variance
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Predicted
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Predicted Revenue</p>
                    <p className="text-xl font-bold text-purple-900">{formatCurrency(forecast.predicted)}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Confidence</p>
                    <p className="text-xl font-bold text-blue-900">{forecast.confidence}%</p>
                  </div>
                  {forecast.actual && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">Actual Revenue</p>
                      <p className="text-xl font-bold text-green-900">{formatCurrency(forecast.actual)}</p>
                    </div>
                  )}
                </div>

                {!forecast.actual && forecast.confidence < 85 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-700">Lower confidence - more data needed for accurate prediction</p>
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
