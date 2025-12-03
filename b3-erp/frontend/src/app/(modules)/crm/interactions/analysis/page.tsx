'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Phone, Mail, Users, MessageSquare, Calendar, Clock, Target, Award, AlertCircle, PieChart } from 'lucide-react';

interface AnalyticsData {
  period: string;
  calls: number;
  emails: number;
  meetings: number;
  notes: number;
  totalInteractions: number;
  responseRate: number;
  avgResponseTime: number;
}

interface TopPerformer {
  name: string;
  interactions: number;
  conversions: number;
  avgResponseTime: number;
  satisfactionScore: number;
}

interface InteractionMetrics {
  type: string;
  count: number;
  trend: number;
  avgDuration?: number;
  successRate: number;
}

const mockAnalyticsData: AnalyticsData[] = [
  { period: 'Jan', calls: 42, emails: 156, meetings: 18, notes: 34, totalInteractions: 250, responseRate: 82, avgResponseTime: 4.2 },
  { period: 'Feb', calls: 48, emails: 178, meetings: 22, notes: 41, totalInteractions: 289, responseRate: 85, avgResponseTime: 3.8 },
  { period: 'Mar', calls: 55, emails: 192, meetings: 26, notes: 48, totalInteractions: 321, responseRate: 87, avgResponseTime: 3.5 },
  { period: 'Apr', calls: 52, emails: 201, meetings: 24, notes: 52, totalInteractions: 329, responseRate: 89, avgResponseTime: 3.2 },
  { period: 'May', calls: 61, emails: 215, meetings: 28, notes: 58, totalInteractions: 362, responseRate: 91, avgResponseTime: 2.9 },
  { period: 'Jun', calls: 58, emails: 228, meetings: 31, notes: 62, totalInteractions: 379, responseRate: 88, avgResponseTime: 3.1 },
  { period: 'Jul', calls: 64, emails: 242, meetings: 29, notes: 67, totalInteractions: 402, responseRate: 90, avgResponseTime: 2.8 },
  { period: 'Aug', calls: 68, emails: 256, meetings: 33, notes: 71, totalInteractions: 428, responseRate: 92, avgResponseTime: 2.6 },
  { period: 'Sep', calls: 72, emails: 268, meetings: 35, notes: 78, totalInteractions: 453, responseRate: 93, avgResponseTime: 2.4 },
  { period: 'Oct', calls: 76, emails: 284, meetings: 38, notes: 82, totalInteractions: 480, responseRate: 94, avgResponseTime: 2.2 },
];

const mockTopPerformers: TopPerformer[] = [
  { name: 'Sarah Johnson', interactions: 342, conversions: 48, avgResponseTime: 1.8, satisfactionScore: 9.2 },
  { name: 'Michael Chen', interactions: 298, conversions: 42, avgResponseTime: 2.1, satisfactionScore: 8.9 },
  { name: 'Emily Rodriguez', interactions: 276, conversions: 38, avgResponseTime: 2.3, satisfactionScore: 8.7 },
  { name: 'David Martinez', interactions: 254, conversions: 34, avgResponseTime: 2.6, satisfactionScore: 8.5 },
];

const mockInteractionMetrics: InteractionMetrics[] = [
  { type: 'Calls', count: 456, trend: 12.5, avgDuration: 28, successRate: 78.4 },
  { type: 'Emails', count: 1284, trend: 8.3, successRate: 64.2 },
  { type: 'Meetings', count: 127, trend: 15.2, avgDuration: 52, successRate: 89.6 },
  { type: 'Notes', count: 342, trend: 5.7, successRate: 100 },
];

export default function InteractionsAnalysisPage() {
  const [analyticsData] = useState<AnalyticsData[]>(mockAnalyticsData);
  const [topPerformers] = useState<TopPerformer[]>(mockTopPerformers);
  const [interactionMetrics] = useState<InteractionMetrics[]>(mockInteractionMetrics);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const currentPeriod = analyticsData[analyticsData.length - 1];
  const previousPeriod = analyticsData[analyticsData.length - 2];

  const calculateTrend = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const totalInteractionsTrend = calculateTrend(currentPeriod.totalInteractions, previousPeriod.totalInteractions);
  const responseRateTrend = calculateTrend(currentPeriod.responseRate, previousPeriod.responseRate);
  const avgResponseTimeTrend = calculateTrend(currentPeriod.avgResponseTime, previousPeriod.avgResponseTime);

  const interactionsByType = {
    calls: analyticsData.reduce((sum, d) => sum + d.calls, 0),
    emails: analyticsData.reduce((sum, d) => sum + d.emails, 0),
    meetings: analyticsData.reduce((sum, d) => sum + d.meetings, 0),
    notes: analyticsData.reduce((sum, d) => sum + d.notes, 0),
  };

  const totalInteractions = Object.values(interactionsByType).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count: number) => ((count / totalInteractions) * 100).toFixed(1);

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="mb-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${totalInteractionsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalInteractionsTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(totalInteractionsTrend).toFixed(1)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{currentPeriod.totalInteractions}</div>
            <div className="text-sm text-gray-600">Total Interactions</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${responseRateTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {responseRateTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(responseRateTrend).toFixed(1)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{currentPeriod.responseRate}%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${avgResponseTimeTrend <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {avgResponseTimeTrend <= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(avgResponseTimeTrend).toFixed(1)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{currentPeriod.avgResponseTime}h</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {((interactionMetrics.reduce((sum, m) => sum + m.successRate, 0) / interactionMetrics.length)).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Success Rate</div>
          </div>
        </div>

        {/* Interaction Trends Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Interaction Trends</h2>
            <div className="space-y-4">
              {/* Simplified bar chart visualization */}
              {analyticsData.slice(-6).map((data, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{data.period}</span>
                    <span className="text-sm font-bold text-gray-900">{data.totalInteractions} interactions</span>
                  </div>
                  <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="absolute inset-y-0 left-0 flex">
                      <div
                        className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.calls / data.totalInteractions) * 100}%` }}
                      >
                        {data.calls > 0 && data.calls}
                      </div>
                      <div
                        className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.emails / data.totalInteractions) * 100}%` }}
                      >
                        {data.emails > 0 && data.emails}
                      </div>
                      <div
                        className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.meetings / data.totalInteractions) * 100}%` }}
                      >
                        {data.meetings > 0 && data.meetings}
                      </div>
                      <div
                        className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.notes / data.totalInteractions) * 100}%` }}
                      >
                        {data.notes > 0 && data.notes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">Emails</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-600">Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Notes</span>
              </div>
            </div>
          </div>

          {/* Interaction Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribution by Type</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Calls</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{getPercentage(interactionsByType.calls)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(interactionsByType.calls)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{interactionsByType.calls.toLocaleString()} total</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Emails</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{getPercentage(interactionsByType.emails)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(interactionsByType.emails)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{interactionsByType.emails.toLocaleString()} total</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Meetings</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{getPercentage(interactionsByType.meetings)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(interactionsByType.meetings)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{interactionsByType.meetings.toLocaleString()} total</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Notes</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{getPercentage(interactionsByType.notes)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(interactionsByType.notes)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{interactionsByType.notes.toLocaleString()} total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {interactionMetrics.map((metric) => (
            <div key={metric.type} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{metric.type}</h3>
                <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(metric.trend).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Count</div>
                  <div className="text-2xl font-bold text-gray-900">{metric.count.toLocaleString()}</div>
                </div>

                {metric.avgDuration && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Avg Duration</div>
                    <div className="text-xl font-bold text-gray-900">{metric.avgDuration} min</div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-green-600">{metric.successRate.toFixed(1)}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${metric.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h2>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                  #{index + 1}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{performer.name}</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Interactions: </span>
                      <span className="font-bold text-gray-900">{performer.interactions}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Conversions: </span>
                      <span className="font-bold text-green-600">{performer.conversions}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Response: </span>
                      <span className="font-bold text-blue-600">{performer.avgResponseTime}h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Satisfaction: </span>
                      <span className="font-bold text-purple-600">{performer.satisfactionScore}/10</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">Conversion Rate</div>
                  <div className="text-lg font-bold text-green-600">
                    {((performer.conversions / performer.interactions) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
