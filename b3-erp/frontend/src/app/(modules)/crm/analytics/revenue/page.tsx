'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, Target, Repeat, BarChart3, Activity, PieChart } from 'lucide-react';

interface RevenueMetric {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface MonthlyRevenue {
  month: string;
  newBusiness: number;
  expansion: number;
  renewal: number;
  churn: number;
  total: number;
}

interface RevenueSource {
  source: string;
  revenue: number;
  percentage: number;
  growth: number;
  color: string;
}

export default function RevenueAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedView, setSelectedView] = useState<'stacked' | 'trend'>('stacked');

  // Key Revenue Metrics
  const metrics: { [key: string]: RevenueMetric } = {
    totalRevenue: { value: 2450000, change: 15.3, trend: 'up' },
    recurringRevenue: { value: 1850000, change: 18.5, trend: 'up' },
    newBusiness: { value: 420000, change: 12.8, trend: 'up' },
    expansion: { value: 180000, change: 24.5, trend: 'up' },
    churnRevenue: { value: 95000, change: -8.2, trend: 'up' },
    avgContractValue: { value: 27500, change: 14.2, trend: 'up' },
  };

  // Monthly Revenue Breakdown
  const monthlyRevenue: MonthlyRevenue[] = [
    { month: 'Jan', newBusiness: 320000, expansion: 145000, renewal: 1200000, churn: 75000, total: 1590000 },
    { month: 'Feb', newBusiness: 380000, expansion: 152000, renewal: 1280000, churn: 82000, total: 1730000 },
    { month: 'Mar', newBusiness: 420000, expansion: 168000, renewal: 1350000, churn: 88000, total: 1850000 },
    { month: 'Apr', newBusiness: 390000, expansion: 155000, renewal: 1320000, churn: 95000, total: 1770000 },
    { month: 'May', newBusiness: 450000, expansion: 175000, renewal: 1420000, churn: 78000, total: 1967000 },
    { month: 'Jun', newBusiness: 480000, expansion: 182000, renewal: 1480000, churn: 92000, total: 2050000 },
    { month: 'Jul', newBusiness: 410000, expansion: 165000, renewal: 1380000, churn: 105000, total: 1850000 },
    { month: 'Aug', newBusiness: 520000, expansion: 195000, renewal: 1520000, churn: 85000, total: 2150000 },
    { month: 'Sep', newBusiness: 480000, expansion: 188000, renewal: 1500000, churn: 98000, total: 2070000 },
    { month: 'Oct', newBusiness: 550000, expansion: 205000, renewal: 1620000, churn: 75000, total: 2300000 },
  ];

  // Revenue by Source
  const revenueSources: RevenueSource[] = [
    { source: 'Enterprise Licenses', revenue: 980000, percentage: 40.0, growth: 18.5, color: 'from-blue-500 to-blue-600' },
    { source: 'Professional Services', revenue: 590000, percentage: 24.1, growth: 15.2, color: 'from-purple-500 to-purple-600' },
    { source: 'Support Contracts', revenue: 480000, percentage: 19.6, growth: 12.8, color: 'from-green-500 to-green-600' },
    { source: 'Training & Consulting', revenue: 245000, percentage: 10.0, growth: 22.4, color: 'from-yellow-500 to-yellow-600' },
    { source: 'Add-ons & Upgrades', revenue: 155000, percentage: 6.3, growth: 28.6, color: 'from-orange-500 to-orange-600' },
  ];

  // Revenue by Region
  const revenueByRegion = [
    { region: 'North America', revenue: 1225000, percentage: 50.0, customers: 542, color: 'bg-blue-500' },
    { region: 'Europe', revenue: 735000, percentage: 30.0, customers: 389, color: 'bg-purple-500' },
    { region: 'Asia Pacific', revenue: 367500, percentage: 15.0, customers: 245, color: 'bg-green-500' },
    { region: 'Latin America', revenue: 122500, percentage: 5.0, customers: 71, color: 'bg-yellow-500' },
  ];

  // Revenue by Customer Segment
  const revenueBySegment = [
    { segment: 'Enterprise', revenue: 1470000, percentage: 60.0, customers: 156, avgRevenue: 9423 },
    { segment: 'Mid-Market', revenue: 735000, percentage: 30.0, customers: 342, avgRevenue: 2149 },
    { segment: 'Small Business', revenue: 245000, percentage: 10.0, customers: 749, avgRevenue: 327 },
  ];

  // MRR/ARR Growth
  const recurringGrowth = [
    { month: 'Jan', mrr: 154167, arr: 1850000 },
    { month: 'Feb', mrr: 160833, arr: 1930000 },
    { month: 'Mar', mrr: 168333, arr: 2020000 },
    { month: 'Apr', mrr: 172500, arr: 2070000 },
    { month: 'May', mrr: 181667, arr: 2180000 },
    { month: 'Jun', mrr: 187500, arr: 2250000 },
    { month: 'Jul', mrr: 183333, arr: 2200000 },
    { month: 'Aug', mrr: 193333, arr: 2320000 },
    { month: 'Sep', mrr: 195833, arr: 2350000 },
    { month: 'Oct', mrr: 204167, arr: 2450000 },
  ];

  // Revenue Forecast
  const forecast = [
    { month: 'Nov', projected: 2420000, confidence: 'high' },
    { month: 'Dec', projected: 2650000, confidence: 'high' },
    { month: 'Jan', projected: 2580000, confidence: 'medium' },
    { month: 'Feb', projected: 2720000, confidence: 'medium' },
    { month: 'Mar', projected: 2850000, confidence: 'low' },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.total));
  const maxMRR = Math.max(...recurringGrowth.map(r => r.mrr));

  return (
    <div className="w-full h-full px-3 py-2 ">
      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.totalRevenue.value / 1000000).toFixed(2)}M
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.totalRevenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.totalRevenue.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.totalRevenue.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Recurring Revenue</span>
              <Repeat className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.recurringRevenue.value / 1000000).toFixed(2)}M
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.recurringRevenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.recurringRevenue.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.recurringRevenue.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">New Business</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.newBusiness.value / 1000).toFixed(0)}K
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.newBusiness.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.newBusiness.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.newBusiness.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Expansion</span>
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.expansion.value / 1000).toFixed(0)}K
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.expansion.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.expansion.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.expansion.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Churn Revenue</span>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.churnRevenue.value / 1000).toFixed(0)}K
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.churnRevenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.churnRevenue.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.churnRevenue.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Contract</span>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.avgContractValue.value / 1000).toFixed(0)}K
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.avgContractValue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.avgContractValue.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.avgContractValue.change)}%</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Revenue Breakdown
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('stacked')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  selectedView === 'stacked' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Stacked
              </button>
              <button
                onClick={() => setSelectedView('trend')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  selectedView === 'trend' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Trend
              </button>
            </div>
          </div>

          {selectedView === 'stacked' ? (
            <div className="space-y-3">
              {monthlyRevenue.map((data, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{data.month}</span>
                    <span className="font-semibold text-gray-900">${(data.total / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex w-full bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(data.newBusiness / data.total) * 100}%` }}
                      title={`New: $${(data.newBusiness / 1000).toFixed(0)}K`}
                    >
                      {((data.newBusiness / data.total) * 100).toFixed(0)}%
                    </div>
                    <div
                      className="bg-purple-500 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(data.expansion / data.total) * 100}%` }}
                      title={`Expansion: $${(data.expansion / 1000).toFixed(0)}K`}
                    >
                      {((data.expansion / data.total) * 100).toFixed(0)}%
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(data.renewal / data.total) * 100}%` }}
                      title={`Renewal: $${(data.renewal / 1000).toFixed(0)}K`}
                    >
                      {((data.renewal / data.total) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 justify-center pt-4 border-t border-gray-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>New Business</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Expansion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Renewal</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(data.total / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        ${(data.total / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Sources & MRR Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
          {/* Revenue by Source */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Revenue by Source
            </h2>
            <div className="space-y-2">
              {revenueSources.map((source, index) => (
                <div key={index} className={`bg-gradient-to-br ${source.color} rounded-lg p-3 text-white`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{source.source}</h3>
                      <div className="text-xs opacity-90">{source.percentage}% of total</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${(source.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-xs opacity-90">+{source.growth}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                    <div
                      className="bg-white h-1.5 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MRR/ARR Growth */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              MRR/ARR Growth
            </h2>
            <div className="space-y-2">
              {recurringGrowth.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{data.month}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">MRR: ${(data.mrr / 1000).toFixed(0)}K</span>
                      <span className="font-semibold text-gray-900">ARR: ${(data.arr / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full"
                        style={{ width: `${(data.mrr / maxMRR) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Region & Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
          {/* Revenue by Region */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Revenue by Region
            </h2>
            <div className="space-y-2">
              {revenueByRegion.map((region, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{region.region}</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${(region.revenue / 1000).toFixed(0)}K</span>
                      <span className="text-gray-600 ml-2">({region.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${region.color} h-full rounded-full`}
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{region.customers} customers</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Customer Segment */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Revenue by Customer Segment
            </h2>
            <div className="space-y-2">
              {revenueBySegment.map((segment, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                      <p className="text-xs text-gray-600">{segment.customers} customers</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${(segment.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-600">{segment.percentage}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                    <span className="text-xs text-gray-600">Avg Revenue per Customer</span>
                    <span className="font-semibold text-gray-900">${segment.avgRevenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Revenue Forecast (Next 5 Months)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {forecast.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                item.confidence === 'high' ? 'bg-green-50 border-green-200' :
                item.confidence === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-orange-50 border-orange-200'
              }`}>
                <div className="text-sm font-medium text-gray-900 mb-1">{item.month}</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${(item.projected / 1000000).toFixed(2)}M
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                  item.confidence === 'high' ? 'bg-green-200 text-green-800' :
                  item.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-orange-200 text-orange-800'
                }`}>
                  {item.confidence} confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
