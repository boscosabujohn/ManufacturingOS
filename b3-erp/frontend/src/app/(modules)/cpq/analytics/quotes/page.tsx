'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function CPQAnalyticsQuotesPage() {
  const [timeRange, setTimeRange] = useState('last-30-days')

  // Quote volume trend data
  const volumeTrend = [
    { month: 'Apr', quotes: 145, converted: 58, value: 4.2 },
    { month: 'May', quotes: 168, converted: 72, value: 5.8 },
    { month: 'Jun', quotes: 192, converted: 81, value: 6.5 },
    { month: 'Jul', quotes: 178, converted: 76, value: 6.1 },
    { month: 'Aug', quotes: 205, converted: 95, value: 8.2 },
    { month: 'Sep', quotes: 234, converted: 112, value: 9.8 }
  ]

  // Quote status distribution
  const statusDistribution = [
    { name: 'Converted', value: 42, count: 112, color: '#10b981' },
    { name: 'Pending', value: 28, count: 75, color: '#f59e0b' },
    { name: 'Rejected', value: 18, count: 48, color: '#ef4444' },
    { name: 'Expired', value: 12, count: 32, color: '#6b7280' }
  ]

  // Average quote value by month
  const avgQuoteValue = [
    { month: 'Apr', avgValue: 2.9, medianValue: 2.5 },
    { month: 'May', avgValue: 3.5, medianValue: 3.1 },
    { month: 'Jun', avgValue: 3.4, medianValue: 3.0 },
    { month: 'Jul', avgValue: 3.4, medianValue: 3.2 },
    { month: 'Aug', avgValue: 4.0, medianValue: 3.6 },
    { month: 'Sep', avgValue: 4.2, medianValue: 3.8 }
  ]

  // Top performing sales reps
  const topPerformers = [
    { name: 'Vikram Desai', quotes: 48, converted: 28, conversionRate: 58.3, value: 12.5 },
    { name: 'Priya Sharma', quotes: 52, converted: 26, conversionRate: 50.0, value: 11.8 },
    { name: 'Suresh Rao', quotes: 45, converted: 22, conversionRate: 48.9, value: 9.6 },
    { name: 'Neha Singh', quotes: 38, converted: 19, conversionRate: 50.0, value: 8.2 },
    { name: 'Amit Verma', quotes: 35, converted: 15, conversionRate: 42.9, value: 6.4 }
  ]

  // Quote turnaround time
  const turnaroundTime = [
    { range: '< 2 hours', count: 85, percentage: 32 },
    { range: '2-4 hours', count: 112, percentage: 42 },
    { range: '4-8 hours', count: 48, percentage: 18 },
    { range: '> 8 hours', count: 22, percentage: 8 }
  ]

  // Conversion rate by product category
  const categoryConversion = [
    { category: 'Modular Kitchens', quotes: 125, converted: 65, rate: 52 },
    { category: 'Wardrobes', quotes: 78, converted: 32, rate: 41 },
    { category: 'Living Room', quotes: 42, converted: 18, rate: 43 },
    { category: 'Office Furniture', quotes: 22, converted: 7, rate: 32 }
  ]

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quote Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">Comprehensive insights into quote performance and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="last-year">Last Year</option>
          </select>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-blue-600">Total Quotes</p>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">267</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-semibold">14.5%</span>
            <span className="text-blue-700">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-green-600">Converted</p>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">112</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span className="text-green-700 font-semibold">42% conversion rate</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-purple-600">Total Value</p>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-900">₹9.8Cr</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-semibold">19.2%</span>
            <span className="text-purple-700">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-orange-600">Avg Quote Value</p>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900">₹4.2L</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-semibold">5.0%</span>
            <span className="text-orange-700">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quote Volume Trend */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quote Volume Trend</h3>
              <p className="text-sm text-gray-600">Monthly quote creation and conversion</p>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quotes" stroke="#3b82f6" strokeWidth={2} name="Total Quotes" />
              <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} name="Converted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quote Status Distribution */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quote Status Distribution</h3>
              <p className="text-sm text-gray-600">Current status breakdown</p>
            </div>
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {statusDistribution.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{status.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{status.count}</p>
                    <p className="text-xs text-gray-500">{status.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Average Quote Value */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Average Quote Value Trend</h3>
              <p className="text-sm text-gray-600">Average and median quote values (₹L)</p>
            </div>
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgQuoteValue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgValue" fill="#10b981" name="Average Value" />
              <Bar dataKey="medianValue" fill="#6366f1" name="Median Value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate by Category */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Conversion by Product Category</h3>
              <p className="text-sm text-gray-600">Quote conversion rates by category</p>
            </div>
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryConversion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rate" fill="#f59e0b" name="Conversion Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Top Performing Sales Representatives</h3>
            <p className="text-sm text-gray-600">Ranked by total quote value generated</p>
          </div>
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sales Rep</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Quotes</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Converted</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Conversion Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((rep, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{rep.name}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-gray-900 font-medium">{rep.quotes}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-green-600 font-medium">{rep.converted}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      rep.conversionRate >= 50 ? 'bg-green-100 text-green-700' :
                      rep.conversionRate >= 45 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {rep.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-purple-600 font-bold">₹{rep.value}Cr</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Turnaround Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quote Turnaround Time</h3>
              <p className="text-sm text-gray-600">Time from request to quote delivery</p>
            </div>
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {turnaroundTime.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.range}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count} quotes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-600 w-12 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong className="text-green-600">74% of quotes</strong> are delivered within 4 hours
            </p>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-purple-900">Key Insights</h3>
              <p className="text-sm text-purple-700">Actionable recommendations</p>
            </div>
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Strong Growth Trajectory</p>
                  <p className="text-xs text-gray-600">Quote volume up 14.5% with improving conversion rates. Modular Kitchens showing 52% conversion.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Improve Turnaround Time</p>
                  <p className="text-xs text-gray-600">8% of quotes take over 8 hours. Focus on faster response for Office Furniture segment.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Top Performer Analysis</p>
                  <p className="text-xs text-gray-600">Vikram Desai leads with 58.3% conversion. Share best practices across team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
