'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Target, Activity, BarChart3, LineChart, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export type ForecastMethod = 'moving-average' | 'exponential-smoothing' | 'linear-regression' | 'seasonal' | 'ml-based';
export type DemandPattern = 'stable' | 'trending' | 'seasonal' | 'erratic' | 'lumpy';

export interface DemandForecast {
  itemId: string;
  itemName: string;
  sku: string;
  forecastMethod: ForecastMethod;
  demandPattern: DemandPattern;
  historicalData: { period: string; actual: number }[];
  forecastData: { period: string; forecast: number; confidence: number }[];
  accuracy: number;
  mape: number; // Mean Absolute Percentage Error
  bias: number;
}

export interface SafetyStockCalculation {
  itemId: string;
  itemName: string;
  averageDemand: number;
  demandVariability: number;
  leadTime: number;
  leadTimeVariability: number;
  serviceLevel: number; // 90%, 95%, 99%
  safetyStock: number;
  reorderPoint: number;
}

export interface SeasonalityAnalysis {
  itemId: string;
  itemName: string;
  seasonalityDetected: boolean;
  seasonalityIndex: { month: string; index: number }[];
  peakSeason: string;
  lowSeason: string;
}

export default function DemandPlanning() {
  const [activeTab, setActiveTab] = useState<'forecast' | 'safety-stock' | 'seasonality' | 'analysis'>('forecast');

  const forecasts: DemandForecast[] = [
    {
      itemId: 'ITM-001',
      itemName: 'Steel Sheet 304 - 2mm',
      sku: 'SS-304-2MM',
      forecastMethod: 'seasonal',
      demandPattern: 'seasonal',
      historicalData: [
        { period: 'Oct 2024', actual: 450 },
        { period: 'Nov 2024', actual: 520 },
        { period: 'Dec 2024', actual: 610 },
        { period: 'Jan 2025', actual: 580 },
      ],
      forecastData: [
        { period: 'Feb 2025', forecast: 595, confidence: 85 },
        { period: 'Mar 2025', forecast: 640, confidence: 82 },
        { period: 'Apr 2025', forecast: 675, confidence: 78 },
        { period: 'May 2025', forecast: 710, confidence: 75 },
      ],
      accuracy: 92.5,
      mape: 7.5,
      bias: 2.3,
    },
    {
      itemId: 'ITM-002',
      itemName: 'Hydraulic Pump HP-500',
      sku: 'HP-500',
      forecastMethod: 'exponential-smoothing',
      demandPattern: 'stable',
      historicalData: [
        { period: 'Oct 2024', actual: 85 },
        { period: 'Nov 2024', actual: 90 },
        { period: 'Dec 2024', actual: 88 },
        { period: 'Jan 2025', actual: 92 },
      ],
      forecastData: [
        { period: 'Feb 2025', forecast: 91, confidence: 90 },
        { period: 'Mar 2025', forecast: 93, confidence: 88 },
        { period: 'Apr 2025', forecast: 94, confidence: 86 },
        { period: 'May 2025', forecast: 95, confidence: 84 },
      ],
      accuracy: 94.8,
      mape: 5.2,
      bias: 1.1,
    },
  ];

  const safetyStockData: SafetyStockCalculation[] = [
    {
      itemId: 'ITM-001',
      itemName: 'Steel Sheet 304 - 2mm',
      averageDemand: 150,
      demandVariability: 25,
      leadTime: 7,
      leadTimeVariability: 1.5,
      serviceLevel: 95,
      safetyStock: 78,
      reorderPoint: 1128,
    },
    {
      itemId: 'ITM-002',
      itemName: 'Hydraulic Pump HP-500',
      averageDemand: 30,
      demandVariability: 5,
      leadTime: 14,
      leadTimeVariability: 2,
      serviceLevel: 99,
      safetyStock: 24,
      reorderPoint: 444,
    },
  ];

  const seasonalityData: SeasonalityAnalysis[] = [
    {
      itemId: 'ITM-001',
      itemName: 'Steel Sheet 304 - 2mm',
      seasonalityDetected: true,
      seasonalityIndex: [
        { month: 'Jan', index: 0.95 },
        { month: 'Feb', index: 0.98 },
        { month: 'Mar', index: 1.05 },
        { month: 'Apr', index: 1.12 },
        { month: 'May', index: 1.15 },
        { month: 'Jun', index: 1.08 },
        { month: 'Jul', index: 0.92 },
        { month: 'Aug', index: 0.88 },
        { month: 'Sep', index: 0.90 },
        { month: 'Oct', index: 0.95 },
        { month: 'Nov', index: 1.02 },
        { month: 'Dec', index: 1.10 },
      ],
      peakSeason: 'May (115% of average)',
      lowSeason: 'August (88% of average)',
    },
  ];

  const getPatternColor = (pattern: DemandPattern) => {
    switch (pattern) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'trending': return 'bg-blue-100 text-blue-800';
      case 'seasonal': return 'bg-purple-100 text-purple-800';
      case 'erratic': return 'bg-orange-100 text-orange-800';
      case 'lumpy': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demand Planning & Forecasting</h1>
          <p className="text-gray-600">AI-powered demand forecasting and inventory optimization</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            {['forecast', 'safety-stock', 'seasonality', 'analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Demand Forecasts</h2>

              {forecasts.map((forecast) => (
                <div key={forecast.itemId} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{forecast.itemName}</h3>
                      <p className="text-sm text-gray-600">SKU: {forecast.sku}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPatternColor(forecast.demandPattern)}`}>
                        {forecast.demandPattern.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {forecast.forecastMethod.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Forecast Accuracy</p>
                      <p className="text-2xl font-bold text-green-600">{forecast.accuracy}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">MAPE</p>
                      <p className="text-2xl font-bold text-blue-600">{forecast.mape}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Forecast Bias</p>
                      <p className="text-2xl font-bold text-purple-600">{forecast.bias}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Historical Demand</h4>
                      <div className="space-y-2">
                        {forecast.historicalData.map((data, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{data.period}</span>
                            <span className="font-semibold text-gray-900">{data.actual} units</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Forecast (Next 4 Months)</h4>
                      <div className="space-y-2">
                        {forecast.forecastData.map((data, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{data.period}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-600">{data.forecast} units</span>
                              <span className="text-xs text-gray-500">({data.confidence}% confidence)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'safety-stock' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Safety Stock Calculations</h2>

              {safetyStockData.map((item) => (
                <div key={item.itemId} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.itemName}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Avg Demand/Day</p>
                      <p className="text-xl font-bold text-gray-900">{item.averageDemand}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Lead Time (days)</p>
                      <p className="text-xl font-bold text-blue-600">{item.leadTime}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Service Level</p>
                      <p className="text-xl font-bold text-purple-600">{item.serviceLevel}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Demand Variability</p>
                      <p className="text-xl font-bold text-orange-600">±{item.demandVariability}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
                      <p className="text-sm opacity-90 mb-2">Safety Stock Required</p>
                      <p className="text-4xl font-bold">{item.safetyStock} units</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
                      <p className="text-sm opacity-90 mb-2">Reorder Point</p>
                      <p className="text-4xl font-bold">{item.reorderPoint} units</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'seasonality' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Seasonality Analysis</h2>

              {seasonalityData.map((item) => (
                <div key={item.itemId} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{item.itemName}</h3>
                    {item.seasonalityDetected ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Seasonality Detected
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        No Seasonality
                      </span>
                    )}
                  </div>

                  {item.seasonalityDetected && (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Peak Season</p>
                          <p className="text-lg font-bold text-green-600">{item.peakSeason}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Low Season</p>
                          <p className="text-lg font-bold text-red-600">{item.lowSeason}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Monthly Seasonality Index</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {item.seasonalityIndex.map((month) => (
                            <div key={month.month} className="text-center">
                              <div className="text-xs text-gray-600 mb-1">{month.month}</div>
                              <div className={`text-lg font-bold ${
                                month.index > 1.05 ? 'text-green-600' :
                                month.index < 0.95 ? 'text-red-600' :
                                'text-gray-900'
                              }`}>
                                {(month.index * 100).toFixed(0)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Forecast Performance Analysis</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-900">High Accuracy</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">18 items</p>
                  <p className="text-sm text-gray-600 mt-1">&gt;90% accuracy</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Needs Review</h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">5 items</p>
                  <p className="text-sm text-gray-600 mt-1">75-90% accuracy</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Low Accuracy</h3>
                  </div>
                  <p className="text-3xl font-bold text-red-600">2 items</p>
                  <p className="text-sm text-gray-600 mt-1">&lt;75% accuracy</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
