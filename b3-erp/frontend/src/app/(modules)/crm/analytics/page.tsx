'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Activity, Calendar, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface ChartDataPoint {
  month: string;
  value: number;
}

export default function CRMAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Key Metrics
  const metrics: {
    revenue: { current: number; previous: number; change: number; trend: 'up' | 'down' };
    customers: { current: number; previous: number; change: number; trend: 'up' | 'down' };
    deals: { current: number; previous: number; change: number; trend: 'up' | 'down' };
    conversion: { current: number; previous: number; change: number; trend: 'up' | 'down' };
  } = {
    revenue: {
      current: 2450000,
      previous: 2180000,
      change: 12.4,
      trend: 'up',
    },
    customers: {
      current: 1247,
      previous: 1189,
      change: 4.9,
      trend: 'up',
    },
    deals: {
      current: 89,
      previous: 102,
      change: -12.7,
      trend: 'down',
    },
    conversion: {
      current: 24.5,
      previous: 22.8,
      change: 7.5,
      trend: 'up',
    },
  };

  // Sales Pipeline Data
  const pipelineStages = [
    { stage: 'Prospecting', count: 145, value: 1250000, color: 'from-blue-500 to-blue-600' },
    { stage: 'Qualification', count: 89, value: 890000, color: 'from-purple-500 to-purple-600' },
    { stage: 'Proposal', count: 45, value: 650000, color: 'from-yellow-500 to-yellow-600' },
    { stage: 'Negotiation', count: 28, value: 480000, color: 'from-orange-500 to-orange-600' },
    { stage: 'Closed Won', count: 67, value: 1200000, color: 'from-green-500 to-green-600' },
  ];

  // Revenue Trend Data
  const revenueData: ChartDataPoint[] = [
    { month: 'Jan', value: 1850000 },
    { month: 'Feb', value: 1920000 },
    { month: 'Mar', value: 2100000 },
    { month: 'Apr', value: 2050000 },
    { month: 'May', value: 2280000 },
    { month: 'Jun', value: 2350000 },
    { month: 'Jul', value: 2180000 },
    { month: 'Aug', value: 2420000 },
    { month: 'Sep', value: 2450000 },
    { month: 'Oct', value: 2650000 },
  ];

  // Customer Acquisition
  const customerAcquisition = [
    { source: 'Website', count: 345, percentage: 38.2, color: 'bg-blue-500' },
    { source: 'Referrals', count: 287, percentage: 31.8, color: 'bg-green-500' },
    { source: 'Social Media', count: 156, percentage: 17.3, color: 'bg-purple-500' },
    { source: 'Email Campaign', count: 89, percentage: 9.9, color: 'bg-yellow-500' },
    { source: 'Other', count: 26, percentage: 2.8, color: 'bg-gray-500' },
  ];

  // Top Performers
  const topPerformers = [
    { name: 'Sarah Johnson', deals: 34, revenue: 850000, winRate: 72 },
    { name: 'Michael Chen', deals: 28, revenue: 720000, winRate: 68 },
    { name: 'David Park', deals: 25, revenue: 650000, winRate: 64 },
    { name: 'Emily Davis', deals: 22, revenue: 580000, winRate: 61 },
  ];

  // Activity Metrics
  const activityMetrics = [
    { type: 'Calls', count: 1247, target: 1200, percentage: 103.9 },
    { type: 'Meetings', count: 234, target: 250, percentage: 93.6 },
    { type: 'Emails', count: 3456, target: 3000, percentage: 115.2 },
    { type: 'Tasks', count: 567, target: 600, percentage: 94.5 },
  ];

  // Customer Segments
  const customerSegments = [
    { segment: 'Enterprise', count: 156, revenue: 1250000, avgDeal: 8013 },
    { segment: 'Mid-Market', count: 342, revenue: 890000, avgDeal: 2602 },
    { segment: 'Small Business', count: 749, revenue: 310000, avgDeal: 414 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex gap-2 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${(metrics.revenue.current / 1000000).toFixed(2)}M
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.revenue.trend === 'down' ? 'text-red-600' : 'text-green-600'
            }`}>
              {metrics.revenue.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
              <span>{Math.abs(metrics.revenue.change)}% vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Customers</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.customers.current.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.customers.trend === 'down' ? 'text-red-600' : 'text-green-600'
            }`}>
              {metrics.customers.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
              <span>{Math.abs(metrics.customers.change)}% vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Closed Deals</span>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.deals.current}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.deals.trend === 'down' ? 'text-red-600' : 'text-green-600'
            }`}>
              {metrics.deals.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
              <span>{Math.abs(metrics.deals.change)}% vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.conversion.current}%
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.conversion.trend === 'down' ? 'text-red-600' : 'text-green-600'
            }`}>
              {metrics.conversion.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
              <span>{Math.abs(metrics.conversion.change)}% vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Revenue Trend
              </h2>
            </div>
            <div className="space-y-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                      style={{ width: `${(data.value / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        ${(data.value / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Pipeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Sales Pipeline
            </h2>
            <div className="space-y-4">
              {pipelineStages.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{stage.stage}</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">${(stage.value / 1000).toFixed(0)}K</span>
                      <span className="text-gray-600 ml-2">({stage.count} deals)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${stage.color} h-full rounded-full`}
                      style={{ width: `${(stage.value / 1250000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Acquisition & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer Acquisition Sources */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Customer Acquisition Sources
            </h2>
            <div className="space-y-4">
              {customerAcquisition.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{source.source}</span>
                    <span className="text-gray-600">{source.count} ({source.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${source.color} h-full rounded-full`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity Metrics
            </h2>
            <div className="space-y-4">
              {activityMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{metric.type}</span>
                    <span className={`font-semibold ${
                      metric.percentage >= 100 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {metric.count} / {metric.target} ({metric.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.percentage >= 100 ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers & Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performers
            </h2>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{performer.name}</div>
                      <div className="text-sm text-gray-600">{performer.deals} deals closed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${(performer.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-green-600">{performer.winRate}% win rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Segments
            </h2>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                      <p className="text-sm text-gray-600">{segment.count} customers</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${(segment.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-600">total revenue</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-blue-100">
                    <span className="text-sm text-gray-600">Avg Deal Size</span>
                    <span className="font-semibold text-gray-900">${segment.avgDeal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
