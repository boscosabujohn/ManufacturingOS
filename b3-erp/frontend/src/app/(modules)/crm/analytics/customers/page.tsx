'use client';

import { useState } from 'react';
import { Users, TrendingUp, TrendingDown, DollarSign, Target, ArrowUpRight, ArrowDownRight, Calendar, Repeat, Award, Activity, PieChart } from 'lucide-react';

interface CustomerMetric {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  revenue: number;
  avgLifetimeValue: number;
  churnRate: number;
  color: string;
}

interface MonthlyCustomerData {
  month: string;
  newCustomers: number;
  churnedCustomers: number;
  netGrowth: number;
}

export default function CustomerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Key Customer Metrics
  const metrics: { [key: string]: CustomerMetric } = {
    totalCustomers: { value: 1247, change: 8.3, trend: 'up' },
    newCustomers: { value: 68, change: 12.5, trend: 'up' },
    churnRate: { value: 3.2, change: -0.8, trend: 'up' },
    avgLifetimeValue: { value: 42500, change: 15.2, trend: 'up' },
    customerRetention: { value: 96.8, change: 0.8, trend: 'up' },
    avgRevPerCustomer: { value: 1965, change: 6.4, trend: 'up' },
  };

  // Monthly Customer Growth
  const monthlyData: MonthlyCustomerData[] = [
    { month: 'Jan', newCustomers: 45, churnedCustomers: 8, netGrowth: 37 },
    { month: 'Feb', newCustomers: 52, churnedCustomers: 9, netGrowth: 43 },
    { month: 'Mar', newCustomers: 58, churnedCustomers: 7, netGrowth: 51 },
    { month: 'Apr', newCustomers: 51, churnedCustomers: 10, netGrowth: 41 },
    { month: 'May', newCustomers: 64, churnedCustomers: 8, netGrowth: 56 },
    { month: 'Jun', newCustomers: 67, churnedCustomers: 11, netGrowth: 56 },
    { month: 'Jul', newCustomers: 55, churnedCustomers: 9, netGrowth: 46 },
    { month: 'Aug', newCustomers: 71, churnedCustomers: 7, netGrowth: 64 },
    { month: 'Sep', newCustomers: 68, churnedCustomers: 12, netGrowth: 56 },
    { month: 'Oct', newCustomers: 78, churnedCustomers: 10, netGrowth: 68 },
  ];

  // Customer Segments
  const customerSegments: CustomerSegment[] = [
    {
      segment: 'Enterprise',
      count: 156,
      percentage: 12.5,
      revenue: 1850000,
      avgLifetimeValue: 118590,
      churnRate: 1.2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      segment: 'Mid-Market',
      count: 342,
      percentage: 27.4,
      revenue: 1240000,
      avgLifetimeValue: 36257,
      churnRate: 2.8,
      color: 'from-purple-500 to-purple-600',
    },
    {
      segment: 'Small Business',
      count: 749,
      percentage: 60.1,
      revenue: 980000,
      avgLifetimeValue: 13084,
      churnRate: 4.5,
      color: 'from-green-500 to-green-600',
    },
  ];

  // Customer Acquisition Channels
  const acquisitionChannels = [
    { channel: 'Website/Organic', customers: 345, percentage: 50.7, cost: 280, color: 'bg-blue-500' },
    { channel: 'Referrals', customers: 187, percentage: 27.5, cost: 120, color: 'bg-green-500' },
    { channel: 'Social Media', customers: 98, percentage: 14.4, cost: 450, color: 'bg-purple-500' },
    { channel: 'Paid Advertising', customers: 42, percentage: 6.2, cost: 820, color: 'bg-orange-500' },
    { channel: 'Events/Trade Shows', customers: 8, percentage: 1.2, cost: 1500, color: 'bg-red-500' },
  ];

  // Top Customers by Revenue
  const topCustomers = [
    { name: 'Acme Corporation', revenue: 285000, contractValue: 450000, healthScore: 92, engagement: 'high' },
    { name: 'TechStart Inc', revenue: 198000, contractValue: 320000, healthScore: 88, engagement: 'high' },
    { name: 'Global Industries Ltd', revenue: 175000, contractValue: 280000, healthScore: 85, engagement: 'medium' },
    { name: 'Manufacturing Solutions', revenue: 162000, contractValue: 260000, healthScore: 79, engagement: 'medium' },
    { name: 'Financial Services Group', revenue: 148000, contractValue: 240000, healthScore: 95, engagement: 'high' },
  ];

  // Customer Health Distribution
  const healthDistribution = [
    { status: 'Healthy', count: 892, percentage: 71.5, color: 'bg-green-500' },
    { status: 'At Risk', count: 267, percentage: 21.4, color: 'bg-yellow-500' },
    { status: 'Critical', count: 88, percentage: 7.1, color: 'bg-red-500' },
  ];

  // Customer Lifecycle Stages
  const lifecycleStages = [
    { stage: 'Onboarding', count: 45, avgDays: 14, color: 'from-blue-500 to-blue-600' },
    { stage: 'Active', count: 892, avgDays: 365, color: 'from-green-500 to-green-600' },
    { stage: 'Renewal Due', count: 156, avgDays: 30, color: 'from-yellow-500 to-yellow-600' },
    { stage: 'At Risk', count: 88, avgDays: 45, color: 'from-orange-500 to-orange-600' },
    { stage: 'Churned', count: 66, avgDays: 0, color: 'from-red-500 to-red-600' },
  ];

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const maxGrowth = Math.max(...monthlyData.map(d => d.netGrowth));

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
              <span className="text-sm font-medium text-gray-600">Total Customers</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {metrics.totalCustomers.value.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.totalCustomers.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.totalCustomers.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.totalCustomers.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">New Customers</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metrics.newCustomers.value}</div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.newCustomers.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.newCustomers.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.newCustomers.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Churn Rate</span>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metrics.churnRate.value}%</div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.churnRate.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.churnRate.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.churnRate.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg LTV</span>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.avgLifetimeValue.value / 1000).toFixed(0)}K
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.avgLifetimeValue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.avgLifetimeValue.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.avgLifetimeValue.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Retention</span>
              <Repeat className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metrics.customerRetention.value}%</div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.customerRetention.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.customerRetention.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.customerRetention.change)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Revenue</span>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${(metrics.avgRevPerCustomer.value / 1000).toFixed(1)}K
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrics.avgRevPerCustomer.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.avgRevPerCustomer.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.avgRevPerCustomer.change)}%</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
          {/* Customer Growth Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Customer Growth Trend
            </h2>
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{data.month}</span>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600">+{data.newCustomers} new</span>
                      <span className="text-red-600">-{data.churnedCustomers} churned</span>
                      <span className="font-semibold text-gray-900">Net: +{data.netGrowth}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(data.netGrowth / maxGrowth) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">+{data.netGrowth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acquisition Channels */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Acquisition Channels
            </h2>
            <div className="space-y-2">
              {acquisitionChannels.map((channel, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{channel.channel}</span>
                    <div className="text-right">
                      <span className="text-gray-900">{channel.customers} customers</span>
                      <span className="text-gray-600 ml-2">({channel.percentage}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${channel.color} h-full rounded-full`}
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-16 text-right">CAC: ${channel.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Customer Segments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {customerSegments.map((segment, index) => (
              <div key={index} className={`bg-gradient-to-br ${segment.color} rounded-lg p-3 text-white`}>
                <h3 className="text-xl font-bold mb-2">{segment.segment}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm opacity-90">Customers</div>
                    <div className="text-2xl font-bold">{segment.count} ({segment.percentage}%)</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Revenue</div>
                    <div className="text-xl font-bold">${(segment.revenue / 1000000).toFixed(2)}M</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Avg LTV</div>
                    <div className="text-xl font-bold">${(segment.avgLifetimeValue / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Churn Rate</div>
                    <div className="text-xl font-bold">{segment.churnRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers & Health Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
          {/* Top Customers */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Customers by Revenue
            </h2>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-600">Contract: ${(customer.contractValue / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${(customer.revenue / 1000).toFixed(0)}K</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${getEngagementColor(customer.engagement)}`}>
                        {customer.engagement}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Health Score:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          customer.healthScore >= 85 ? 'bg-green-500' :
                          customer.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${customer.healthScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{customer.healthScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Health & Lifecycle */}
          <div className="space-y-3">
            {/* Health Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Customer Health Distribution
              </h2>
              <div className="space-y-2">
                {healthDistribution.map((health, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-900">{health.status}</span>
                      <span className="text-gray-600">{health.count} ({health.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${health.color} h-full rounded-full`}
                        style={{ width: `${health.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifecycle Stages */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lifecycle Stages
              </h2>
              <div className="space-y-3">
                {lifecycleStages.map((stage, index) => (
                  <div key={index} className={`bg-gradient-to-r ${stage.color} rounded-lg p-3 text-white`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{stage.stage}</div>
                        <div className="text-xs opacity-90">
                          {stage.avgDays > 0 ? `Avg: ${stage.avgDays} days` : 'Final stage'}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{stage.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
