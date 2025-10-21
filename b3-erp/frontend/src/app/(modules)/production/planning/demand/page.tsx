'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Plus, TrendingUp, TrendingDown, Calendar, Package, Filter, BarChart3 } from 'lucide-react';

interface DemandForecast {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  currentMonth: string;
  historicalDemand: number[];
  forecastedDemand: number[];
  actualDemand: number[];
  forecastAccuracy: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonalityFactor: number;
  safetyStock: number;
  reorderPoint: number;
  averageLeadTime: number;
  uom: string;
}

interface MonthlyDemand {
  month: string;
  historical: number;
  forecasted: number;
  actual: number;
}

export default function DemandPlanningPage() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTrend, setFilterTrend] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Mock data for demand forecasts
  const demandForecasts: DemandForecast[] = [
    {
      id: '1',
      productCode: 'KIT-SINK-001',
      productName: 'Premium Stainless Steel Kitchen Sink - Double Bowl',
      category: 'Kitchen Sinks',
      currentMonth: '2025-10',
      historicalDemand: [145, 152, 138, 165, 158, 172],
      forecastedDemand: [180, 185, 190, 195, 200, 205],
      actualDemand: [178, 0, 0, 0, 0, 0],
      forecastAccuracy: 94.8,
      trend: 'increasing',
      seasonalityFactor: 1.15,
      safetyStock: 45,
      reorderPoint: 120,
      averageLeadTime: 14,
      uom: 'units'
    },
    {
      id: '2',
      productCode: 'KIT-FAUCET-002',
      productName: 'Chrome Kitchen Faucet with Pull-Down Sprayer',
      category: 'Kitchen Faucets',
      currentMonth: '2025-10',
      historicalDemand: [285, 298, 275, 310, 295, 305],
      forecastedDemand: [320, 325, 330, 335, 340, 345],
      actualDemand: [315, 0, 0, 0, 0, 0],
      forecastAccuracy: 96.2,
      trend: 'increasing',
      seasonalityFactor: 1.08,
      safetyStock: 80,
      reorderPoint: 220,
      averageLeadTime: 10,
      uom: 'units'
    },
    {
      id: '3',
      productCode: 'KIT-COOKWARE-003',
      productName: 'Non-Stick Cookware Set (7 Pieces)',
      category: 'Cookware',
      currentMonth: '2025-10',
      historicalDemand: [420, 435, 398, 425, 410, 405],
      forecastedDemand: [400, 395, 390, 385, 380, 375],
      actualDemand: [402, 0, 0, 0, 0, 0],
      forecastAccuracy: 97.5,
      trend: 'decreasing',
      seasonalityFactor: 0.95,
      safetyStock: 120,
      reorderPoint: 280,
      averageLeadTime: 18,
      uom: 'sets'
    },
    {
      id: '4',
      productCode: 'KIT-CABINET-004',
      productName: 'Modular Kitchen Cabinet - Base Unit (36")',
      category: 'Kitchen Cabinets',
      currentMonth: '2025-10',
      historicalDemand: [185, 192, 188, 195, 190, 193],
      forecastedDemand: [195, 195, 195, 195, 195, 195],
      actualDemand: [194, 0, 0, 0, 0, 0],
      forecastAccuracy: 98.9,
      trend: 'stable',
      seasonalityFactor: 1.0,
      safetyStock: 50,
      reorderPoint: 135,
      averageLeadTime: 21,
      uom: 'units'
    },
    {
      id: '5',
      productCode: 'KIT-COUNTERTOP-005',
      productName: 'Granite Countertop - Black Galaxy (Linear Ft)',
      category: 'Countertops',
      currentMonth: '2025-10',
      historicalDemand: [520, 548, 512, 565, 538, 555],
      forecastedDemand: [580, 590, 600, 610, 620, 630],
      actualDemand: [575, 0, 0, 0, 0, 0],
      forecastAccuracy: 95.6,
      trend: 'increasing',
      seasonalityFactor: 1.12,
      safetyStock: 150,
      reorderPoint: 400,
      averageLeadTime: 12,
      uom: 'linear ft'
    },
    {
      id: '6',
      productCode: 'KIT-APPLIANCE-006',
      productName: 'Built-in Kitchen Chimney (60cm)',
      category: 'Kitchen Appliances',
      currentMonth: '2025-10',
      historicalDemand: [125, 132, 118, 128, 135, 140],
      forecastedDemand: [145, 150, 155, 160, 165, 170],
      actualDemand: [142, 0, 0, 0, 0, 0],
      forecastAccuracy: 93.1,
      trend: 'increasing',
      seasonalityFactor: 1.18,
      safetyStock: 35,
      reorderPoint: 95,
      averageLeadTime: 16,
      uom: 'units'
    },
    {
      id: '7',
      productCode: 'KIT-MIXER-007',
      productName: 'Electric Mixer Grinder - 750W',
      category: 'Kitchen Appliances',
      currentMonth: '2025-10',
      historicalDemand: [680, 695, 665, 705, 690, 685],
      forecastedDemand: [690, 690, 690, 690, 690, 690],
      actualDemand: [688, 0, 0, 0, 0, 0],
      forecastAccuracy: 98.2,
      trend: 'stable',
      seasonalityFactor: 1.02,
      safetyStock: 180,
      reorderPoint: 475,
      averageLeadTime: 8,
      uom: 'units'
    },
    {
      id: '8',
      productCode: 'KIT-STORAGE-008',
      productName: 'Kitchen Storage Container Set (15 Pieces)',
      category: 'Kitchen Accessories',
      currentMonth: '2025-10',
      historicalDemand: [850, 820, 795, 775, 750, 725],
      forecastedDemand: [700, 675, 650, 625, 600, 575],
      actualDemand: [705, 0, 0, 0, 0, 0],
      forecastAccuracy: 96.8,
      trend: 'decreasing',
      seasonalityFactor: 0.88,
      safetyStock: 200,
      reorderPoint: 480,
      averageLeadTime: 7,
      uom: 'sets'
    },
    {
      id: '9',
      productCode: 'KIT-HOOD-009',
      productName: 'Range Hood with LED Lighting',
      category: 'Kitchen Appliances',
      currentMonth: '2025-10',
      historicalDemand: [95, 102, 88, 98, 105, 110],
      forecastedDemand: [115, 120, 125, 130, 135, 140],
      actualDemand: [118, 0, 0, 0, 0, 0],
      forecastAccuracy: 91.5,
      trend: 'increasing',
      seasonalityFactor: 1.22,
      safetyStock: 28,
      reorderPoint: 78,
      averageLeadTime: 15,
      uom: 'units'
    },
    {
      id: '10',
      productCode: 'KIT-SINK-010',
      productName: 'Undermount Kitchen Sink - Single Bowl',
      category: 'Kitchen Sinks',
      currentMonth: '2025-10',
      historicalDemand: [215, 225, 210, 220, 218, 222],
      forecastedDemand: [220, 220, 220, 220, 220, 220],
      actualDemand: [221, 0, 0, 0, 0, 0],
      forecastAccuracy: 99.1,
      trend: 'stable',
      seasonalityFactor: 1.0,
      safetyStock: 60,
      reorderPoint: 155,
      averageLeadTime: 13,
      uom: 'units'
    }
  ];

  const filteredForecasts = demandForecasts.filter(forecast => {
    const categoryMatch = filterCategory === 'all' || forecast.category === filterCategory;
    const trendMatch = filterTrend === 'all' || forecast.trend === filterTrend;
    return categoryMatch && trendMatch;
  });

  const totalProducts = demandForecasts.length;
  const avgForecastAccuracy = demandForecasts.reduce((sum, f) => sum + f.forecastAccuracy, 0) / demandForecasts.length;
  const increasingTrends = demandForecasts.filter(f => f.trend === 'increasing').length;
  const decreasingTrends = demandForecasts.filter(f => f.trend === 'decreasing').length;

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-700 bg-green-100';
      case 'decreasing': return 'text-red-700 bg-red-100';
      case 'stable': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-700';
    if (accuracy >= 90) return 'text-yellow-700';
    return 'text-red-700';
  };

  const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demand Planning</h1>
            <p className="text-sm text-gray-500 mt-1">Forecast and analyze product demand trends</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Forecast</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Package className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Forecast Accuracy</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{avgForecastAccuracy.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Increasing Trends</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{increasingTrends}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Decreasing Trends</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{decreasingTrends}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Kitchen Sinks">Kitchen Sinks</option>
            <option value="Kitchen Faucets">Kitchen Faucets</option>
            <option value="Cookware">Cookware</option>
            <option value="Kitchen Cabinets">Kitchen Cabinets</option>
            <option value="Countertops">Countertops</option>
            <option value="Kitchen Appliances">Kitchen Appliances</option>
            <option value="Kitchen Accessories">Kitchen Accessories</option>
          </select>
          <select
            value={filterTrend}
            onChange={(e) => setFilterTrend(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Trends</option>
            <option value="increasing">Increasing</option>
            <option value="stable">Stable</option>
            <option value="decreasing">Decreasing</option>
          </select>
        </div>
      </div>

      {/* Demand Forecasts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Current Month</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Forecasted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Seasonality</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Point</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForecasts.map((forecast) => (
                <tr key={forecast.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProduct(forecast.id)}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{forecast.productCode}</div>
                      <div className="text-sm text-gray-500">{forecast.productName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{forecast.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {forecast.currentMonth}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-blue-600">{forecast.forecastedDemand[0].toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{forecast.uom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">{forecast.actualDemand[0].toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{forecast.uom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${getAccuracyColor(forecast.forecastAccuracy)}`}>
                      {forecast.forecastAccuracy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTrendColor(forecast.trend)}`}>
                      {getTrendIcon(forecast.trend)}
                      {forecast.trend}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">{forecast.seasonalityFactor.toFixed(2)}x</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-700">{forecast.safetyStock.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{forecast.uom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-700">{forecast.reorderPoint.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">{forecast.uom}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal (if product selected) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const product = demandForecasts.find(f => f.id === selectedProduct);
              if (!product) return null;

              return (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{product.productCode}</h3>
                      <p className="text-gray-600">{product.productName}</p>
                    </div>
                    <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Forecast Accuracy</p>
                      <p className="text-2xl font-bold text-blue-900">{product.forecastAccuracy.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Trend</p>
                      <p className="text-lg font-bold text-green-900 capitalize">{product.trend}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Lead Time</p>
                      <p className="text-2xl font-bold text-purple-900">{product.averageLeadTime} days</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Seasonality</p>
                      <p className="text-2xl font-bold text-orange-900">{product.seasonalityFactor.toFixed(2)}x</p>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-4">6-Month Forecast</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Historical</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Forecasted</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {months.map((month, idx) => {
                          const variance = product.actualDemand[idx] > 0
                            ? ((product.actualDemand[idx] - product.forecastedDemand[idx]) / product.forecastedDemand[idx] * 100).toFixed(1)
                            : '-';
                          return (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{month}</td>
                              <td className="px-4 py-2 text-sm text-gray-700 text-right">{product.historicalDemand[idx].toLocaleString()}</td>
                              <td className="px-4 py-2 text-sm font-medium text-blue-600 text-right">{product.forecastedDemand[idx].toLocaleString()}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                {product.actualDemand[idx] > 0 ? product.actualDemand[idx].toLocaleString() : '-'}
                              </td>
                              <td className="px-4 py-2 text-sm text-right">
                                {variance !== '-' && (
                                  <span className={Number(variance) > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {Number(variance) > 0 ? '+' : ''}{variance}%
                                  </span>
                                )}
                                {variance === '-' && <span className="text-gray-400">-</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
