'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Activity,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sliders
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type ForecastMethod = 'moving-average' | 'exponential-smoothing' | 'linear-regression' | 'seasonal' | 'ml-based';
export type DemandPattern = 'stable' | 'trending' | 'seasonal' | 'erratic' | 'lumpy';

export interface DemandForecast {
  itemId: string;
  itemName: string;
  sku: string;
  category: string;
  forecastMethod: ForecastMethod;
  demandPattern: DemandPattern;
  historyAndForecast: { period: string; type: 'Actual' | 'Forecast'; value: number; confidenceLow?: number; confidenceHigh?: number }[];
  accuracy: number;
  mape: number; // Mean Absolute Percentage Error
  bias: number;
  trend: number; // percentage growth
}

export interface SeasonalityAnalysis {
  itemId: string;
  itemName: string;
  seasonalityDetected: boolean;
  seasonalityIndex: { month: string; index: number }[];
  peakSeason: string;
  lowSeason: string;
}

export interface SafetyStockCalculation {
  itemId: string;
  itemName: string;
  sku: string;
  safetyStock: number;
  reorderPoint: number;
  economicOrderQuantity: number;
  method: 'normal-distribution' | 'service-level' | 'fixed-percentage';
  serviceLevel: number;
  leadTime: number;
  demandVariability: number;
}

export default function DemandPlanning() {
  const [activeTab, setActiveTab] = useState<'forecast' | 'safety-stock' | 'seasonality' | 'analysis'>('forecast');

  // Mock Data
  const forecasts: DemandForecast[] = [
    {
      itemId: 'ITM-001',
      itemName: 'Steel Sheet 304 - 2mm',
      sku: 'SS-304-2MM',
      category: 'Raw Materials',
      forecastMethod: 'seasonal',
      demandPattern: 'seasonal',
      historyAndForecast: [
        { period: 'Sep', type: 'Actual', value: 420 },
        { period: 'Oct', type: 'Actual', value: 450 },
        { period: 'Nov', type: 'Actual', value: 520 },
        { period: 'Dec', type: 'Actual', value: 610 },
        { period: 'Jan', type: 'Actual', value: 580 },
        { period: 'Feb', type: 'Forecast', value: 595, confidenceLow: 570, confidenceHigh: 620 },
        { period: 'Mar', type: 'Forecast', value: 640, confidenceLow: 610, confidenceHigh: 670 },
        { period: 'Apr', type: 'Forecast', value: 675, confidenceLow: 640, confidenceHigh: 710 },
        { period: 'May', type: 'Forecast', value: 710, confidenceLow: 670, confidenceHigh: 750 },
      ],
      accuracy: 92.5,
      mape: 7.5,
      bias: 2.3,
      trend: 12.5,
    },
    {
      itemId: 'ITM-002',
      itemName: 'Hydraulic Pump HP-500',
      sku: 'HP-500',
      category: 'Components',
      forecastMethod: 'exponential-smoothing',
      demandPattern: 'stable',
      historyAndForecast: [
        { period: 'Sep', type: 'Actual', value: 88 },
        { period: 'Oct', type: 'Actual', value: 85 },
        { period: 'Nov', type: 'Actual', value: 90 },
        { period: 'Dec', type: 'Actual', value: 88 },
        { period: 'Jan', type: 'Actual', value: 92 },
        { period: 'Feb', type: 'Forecast', value: 91, confidenceLow: 88, confidenceHigh: 94 },
        { period: 'Mar', type: 'Forecast', value: 93, confidenceLow: 89, confidenceHigh: 97 },
        { period: 'Apr', type: 'Forecast', value: 94, confidenceLow: 90, confidenceHigh: 98 },
        { period: 'May', type: 'Forecast', value: 95, confidenceLow: 91, confidenceHigh: 99 },
      ],
      accuracy: 94.8,
      mape: 5.2,
      bias: 1.1,
      trend: 2.1,
    },
    {
      itemId: 'ITM-003',
      itemName: 'Industrial Sensor Module',
      sku: 'ISM-PRO-X',
      category: 'Electronics',
      forecastMethod: 'ml-based',
      demandPattern: 'trending',
      historyAndForecast: [
        { period: 'Sep', type: 'Actual', value: 1200 },
        { period: 'Oct', type: 'Actual', value: 1250 },
        { period: 'Nov', type: 'Actual', value: 1350 },
        { period: 'Dec', type: 'Actual', value: 1400 },
        { period: 'Jan', type: 'Actual', value: 1550 },
        { period: 'Feb', type: 'Forecast', value: 1650, confidenceLow: 1580, confidenceHigh: 1720 },
        { period: 'Mar', type: 'Forecast', value: 1800, confidenceLow: 1700, confidenceHigh: 1900 },
        { period: 'Apr', type: 'Forecast', value: 1950, confidenceLow: 1820, confidenceHigh: 2080 },
        { period: 'May', type: 'Forecast', value: 2100, confidenceLow: 1950, confidenceHigh: 2250 },
      ],
      accuracy: 88.5,
      mape: 11.5,
      bias: -1.5,
      trend: 25.0,
    },
    {
      itemId: 'ITM-004',
      itemName: 'Packaging Box Type A',
      sku: 'PKG-BX-A',
      category: 'Consumables',
      forecastMethod: 'moving-average',
      demandPattern: 'stable',
      historyAndForecast: [
        { period: 'Sep', type: 'Actual', value: 5000 },
        { period: 'Oct', type: 'Actual', value: 4800 },
        { period: 'Nov', type: 'Actual', value: 5100 },
        { period: 'Dec', type: 'Actual', value: 4950 },
        { period: 'Jan', type: 'Actual', value: 5050 },
        { period: 'Feb', type: 'Forecast', value: 4980, confidenceLow: 4800, confidenceHigh: 5160 },
        { period: 'Mar', type: 'Forecast', value: 5020, confidenceLow: 4840, confidenceHigh: 5200 },
        { period: 'Apr', type: 'Forecast', value: 5000, confidenceLow: 4820, confidenceHigh: 5180 },
        { period: 'May', type: 'Forecast', value: 5010, confidenceLow: 4830, confidenceHigh: 5190 },
      ],
      accuracy: 96.2,
      mape: 3.8,
      bias: 0.5,
      trend: 0.2,
    },
  ];

  const seasonalityData: SeasonalityAnalysis[] = [
    {
      itemId: 'ITM-001',
      itemName: 'Steel Sheet 304 - 2mm',
      seasonalityDetected: true,
      seasonalityIndex: [
        { month: 'Jan', index: 0.95 }, { month: 'Feb', index: 0.98 }, { month: 'Mar', index: 1.05 },
        { month: 'Apr', index: 1.12 }, { month: 'May', index: 1.15 }, { month: 'Jun', index: 1.08 },
        { month: 'Jul', index: 0.92 }, { month: 'Aug', index: 0.88 }, { month: 'Sep', index: 0.90 },
        { month: 'Oct', index: 0.95 }, { month: 'Nov', index: 1.02 }, { month: 'Dec', index: 1.10 },
      ],
      peakSeason: 'May',
      lowSeason: 'Aug',
    },
    {
      itemId: 'ITM-003',
      itemName: 'Industrial Sensor Module',
      seasonalityDetected: true,
      seasonalityIndex: [
        { month: 'Jan', index: 1.10 }, { month: 'Feb', index: 1.05 }, { month: 'Mar', index: 1.02 },
        { month: 'Apr', index: 1.00 }, { month: 'May', index: 0.98 }, { month: 'Jun', index: 0.95 },
        { month: 'Jul', index: 0.90 }, { month: 'Aug', index: 0.92 }, { month: 'Sep', index: 1.05 },
        { month: 'Oct', index: 1.15 }, { month: 'Nov', index: 1.25 }, { month: 'Dec', index: 1.20 },
      ],
      peakSeason: 'Nov',
      lowSeason: 'Jul',
    },
  ];

  const getPatternColor = (pattern: DemandPattern) => {
    switch (pattern) {
      case 'stable': return 'text-green-700 bg-green-100 border-green-200';
      case 'trending': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'seasonal': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'erratic': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'lumpy': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Demand Planning</h1>
          <p className="text-gray-500">AI-driven forecasting and accuracy analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Sliders className="w-4 h-4" /> Parameters
          </Button>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Target className="w-4 h-4" /> Run Forecast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Accuracy</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">94.2%</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +1.2% vs last month
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Forecast Bias</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">+2.4%</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" /> Within tolerance
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">High Confidence</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">85 Items</h3>
              <p className="text-xs text-gray-600 mt-1">
                Out of 124 total SKUs
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Exceptions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">3 Items</h3>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <ArrowDownRight className="w-3 h-3 mr-1" /> Action required
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecast" className="w-full" onValueChange={(val) => setActiveTab(val as any)}>
        <TabsList className="bg-white border text-gray-600">
          <TabsTrigger value="forecast" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Forecast Dashboard</TabsTrigger>
          <TabsTrigger value="seasonality" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">seasonality Analysis</TabsTrigger>
          <TabsTrigger value="parameters" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecasts.map((item) => (
              <Card key={item.itemId} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-white">{item.category}</Badge>
                        <Badge variant="outline" className={getPatternColor(item.demandPattern)}>{item.demandPattern}</Badge>
                      </div>
                      <CardTitle className="text-lg text-gray-900">{item.itemName}</CardTitle>
                      <CardDescription>SKU: {item.sku}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{item.accuracy}%</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={item.historyAndForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`colorForecast-${item.itemId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                        {/* Actual Data Area/Line */}
                        <Area
                          type="monotone"
                          dataKey="value"
                          data={item.historyAndForecast.filter(d => d.type === 'Actual')}
                          stroke="#64748b"
                          fill="#f1f5f9"
                          name="Historical"
                          strokeWidth={2}
                        />

                        {/* Forecast Line */}
                        <Line
                          type="monotone"
                          dataKey="value"
                          data={item.historyAndForecast.filter(d => d.type === 'Forecast')}
                          stroke="#3b82f6"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Forecast"
                          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }}
                        />

                        {/* Confidence Interval (Simulated with Area) */}
                        <Area
                          type="monotone"
                          dataKey="confidenceHigh"
                          data={item.historyAndForecast.filter(d => d.type === 'Forecast')}
                          stroke="none"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          name="Confidence interval"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm border-t pt-4 border-slate-100">
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Method</span>
                      <span className="font-medium text-gray-700 capitalize">{item.forecastMethod.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">MAPE</span>
                      <span className="font-medium text-gray-700">{item.mape}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Trend</span>
                      <span className={`font-medium ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.trend > 0 ? '+' : ''}{item.trend}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonality" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seasonalityData.map((item) => (
              <Card key={item.itemId} className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{item.itemName}</CardTitle>
                      <CardDescription>Seasonality Index Analysis</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Peak: {item.peakSeason}</Badge>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Low: {item.lowSeason}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={item.seasonalityIndex} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis domain={[0.5, 1.5]} hide />
                        <Tooltip cursor={{ fill: '#f8fafc' }} />
                        <ReferenceLine y={1} stroke="#94a3b8" strokeDasharray="3 3" />
                        <Bar dataKey="index" name="Seasonality Index" radius={[4, 4, 0, 0]}>
                          {item.seasonalityIndex.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.index > 1.05 ? '#22c55e' : entry.index < 0.95 ? '#ef4444' : '#94a3b8'} />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">Baseline (1.0) represents average monthly demand</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
