'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, TrendingUp, Calendar, Download, RefreshCw, BarChart3, AlertCircle, LineChart } from 'lucide-react';

interface ForecastData {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  actualDemand: number[];
  forecastDemand: number[];
  forecastMethod: 'moving-avg' | 'exponential' | 'linear-regression' | 'seasonal';
  accuracy: number;
  mae: number;
  mape: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalityIndex: number;
  uom: string;
}

export default function ForecastOptimizationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastPeriod, setForecastPeriod] = useState(3);
  const [filterMethod, setFilterMethod] = useState('all');

  const forecastData: ForecastData[] = [
    {
      id: '1',
      itemCode: 'RM-001',
      itemName: 'Steel Sheet 1mm',
      category: 'Raw Material',
      actualDemand: [420, 445, 462, 450, 468, 475],
      forecastDemand: [425, 448, 465, 455, 470, 478],
      forecastMethod: 'exponential',
      accuracy: 96.8,
      mae: 6.2,
      mape: 3.2,
      trend: 'increasing',
      seasonalityIndex: 1.12,
      uom: 'Sheets'
    },
    {
      id: '2',
      itemCode: 'CP-078',
      itemName: 'Ball Bearing 6208',
      category: 'Component',
      actualDemand: [210, 218, 205, 215, 212, 220],
      forecastDemand: [212, 215, 208, 213, 215, 218],
      forecastMethod: 'moving-avg',
      accuracy: 98.2,
      mae: 3.8,
      mape: 1.8,
      trend: 'stable',
      seasonalityIndex: 1.05,
      uom: 'Nos'
    },
    {
      id: '3',
      itemCode: 'RM-089',
      itemName: 'Aluminum Rod 20mm',
      category: 'Raw Material',
      actualDemand: [380, 365, 355, 340, 330, 325],
      forecastDemand: [375, 360, 348, 338, 328, 320],
      forecastMethod: 'linear-regression',
      accuracy: 97.5,
      mae: 4.5,
      mape: 2.5,
      trend: 'decreasing',
      seasonalityIndex: 0.92,
      uom: 'Pcs'
    },
    {
      id: '4',
      itemCode: 'CS-023',
      itemName: 'Cutting Oil Premium',
      category: 'Consumable',
      actualDemand: [145, 180, 155, 148, 175, 160],
      forecastDemand: [148, 175, 158, 150, 172, 162],
      forecastMethod: 'seasonal',
      accuracy: 95.3,
      mae: 7.8,
      mape: 4.7,
      trend: 'stable',
      seasonalityIndex: 1.18,
      uom: 'Liters'
    },
    {
      id: '5',
      itemCode: 'CP-045',
      itemName: 'Hydraulic Cylinder',
      category: 'Component',
      actualDemand: [28, 32, 30, 35, 33, 31],
      forecastDemand: [29, 31, 32, 34, 32, 32],
      forecastMethod: 'exponential',
      accuracy: 94.8,
      mae: 1.8,
      mape: 5.2,
      trend: 'stable',
      seasonalityIndex: 1.02,
      uom: 'Nos'
    },
    {
      id: '6',
      itemCode: 'RM-034',
      itemName: 'Copper Wire 4mm',
      category: 'Raw Material',
      actualDemand: [58, 62, 65, 70, 72, 75],
      forecastDemand: [60, 64, 67, 71, 74, 77],
      forecastMethod: 'linear-regression',
      accuracy: 98.5,
      mae: 1.2,
      mape: 1.5,
      trend: 'increasing',
      seasonalityIndex: 1.08,
      uom: 'Kg'
    },
    {
      id: '7',
      itemCode: 'CS-056',
      itemName: 'Grinding Wheel 180mm',
      category: 'Consumable',
      actualDemand: [118, 125, 122, 120, 128, 124],
      forecastDemand: [120, 123, 123, 122, 126, 125],
      forecastMethod: 'moving-avg',
      accuracy: 97.8,
      mae: 2.3,
      mape: 2.2,
      trend: 'stable',
      seasonalityIndex: 1.04,
      uom: 'Nos'
    },
    {
      id: '8',
      itemCode: 'RM-112',
      itemName: 'Brass Sheet 2mm',
      category: 'Raw Material',
      actualDemand: [88, 95, 105, 98, 110, 102],
      forecastDemand: [90, 98, 102, 100, 108, 105],
      forecastMethod: 'seasonal',
      accuracy: 96.2,
      mae: 3.5,
      mape: 3.8,
      trend: 'increasing',
      seasonalityIndex: 1.15,
      uom: 'Sheets'
    }
  ];

  const filteredData = forecastData.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = filterMethod === 'all' || item.forecastMethod === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 97) return 'text-green-600';
    if (accuracy >= 93) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'decreasing': return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />;
      case 'stable': return <span className="w-3 h-0.5 bg-blue-600 block" />;
      default: return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'moving-avg': return 'Moving Average';
      case 'exponential': return 'Exponential Smoothing';
      case 'linear-regression': return 'Linear Regression';
      case 'seasonal': return 'Seasonal Decomposition';
      default: return method;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'moving-avg': return 'bg-blue-100 text-blue-700';
      case 'exponential': return 'bg-purple-100 text-purple-700';
      case 'linear-regression': return 'bg-green-100 text-green-700';
      case 'seasonal': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvgAccuracy = () => {
    return (forecastData.reduce((sum, item) => sum + item.accuracy, 0) / forecastData.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demand Forecast Optimization</h1>
            <p className="text-sm text-gray-500 mt-1">Predict future demand using statistical forecasting methods</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Recalculate</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Forecast</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Accuracy</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{getAvgAccuracy()}%</p>
              <p className="text-xs text-green-600 mt-1">Across all items</p>
            </div>
            <BarChart3 className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Items Forecasted</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{forecastData.length}</p>
              <p className="text-xs text-blue-600 mt-1">Total inventory items</p>
            </div>
            <LineChart className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Forecast Period</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{forecastPeriod}</p>
              <p className="text-xs text-purple-600 mt-1">Months ahead</p>
            </div>
            <Calendar className="w-6 h-6 text-purple-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg MAPE</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {(forecastData.reduce((sum, item) => sum + item.mape, 0) / forecastData.length).toFixed(1)}%
              </p>
              <p className="text-xs text-orange-600 mt-1">Mean Abs % Error</p>
            </div>
            <AlertCircle className="w-6 h-6 text-orange-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="moving-avg">Moving Average</option>
            <option value="exponential">Exponential Smoothing</option>
            <option value="linear-regression">Linear Regression</option>
            <option value="seasonal">Seasonal Decomposition</option>
          </select>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Forecast Months:</label>
            <input
              type="range"
              min="1"
              max="12"
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-bold text-blue-600 w-8">{forecastPeriod}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Last 6 Months</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Forecast</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">MAE</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">MAPE</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Seasonality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{item.itemCode}</div>
                    <div className="text-xs text-gray-500">{item.itemName}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMethodColor(item.forecastMethod)}`}>
                      {getMethodLabel(item.forecastMethod)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-xs text-gray-700 space-y-0.5">
                      {item.actualDemand.map((value, idx) => (
                        <div key={idx} className="font-mono">{value} {item.uom}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-xs text-blue-700 space-y-0.5">
                      {item.forecastDemand.map((value, idx) => (
                        <div key={idx} className="font-mono font-semibold">{value} {item.uom}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`text-sm font-bold ${getAccuracyColor(item.accuracy)}`}>
                      {item.accuracy.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-gray-900">{item.mae.toFixed(1)}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-orange-600">{item.mape.toFixed(1)}%</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(item.trend)}
                      <span className="text-xs font-medium capitalize text-gray-700">{item.trend}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-purple-600">{item.seasonalityIndex.toFixed(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Forecasting Methods & Accuracy Metrics:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="bg-white p-3 rounded border border-blue-200">
            <h4 className="font-bold mb-2">Forecasting Methods:</h4>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li><strong>Moving Average:</strong> Simple average of last N periods</li>
              <li><strong>Exponential Smoothing:</strong> Weighted average with decay</li>
              <li><strong>Linear Regression:</strong> Trend-based projection</li>
              <li><strong>Seasonal Decomposition:</strong> Accounts for seasonal patterns</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border border-blue-200">
            <h4 className="font-bold mb-2">Accuracy Metrics:</h4>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li><strong>Accuracy %:</strong> 100% - MAPE (higher is better)</li>
              <li><strong>MAE:</strong> Mean Absolute Error (lower is better)</li>
              <li><strong>MAPE:</strong> Mean Absolute Percentage Error</li>
              <li><strong>Seasonality Index:</strong> &gt;1 = peak, &lt;1 = off-peak</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
