'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Target,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Users,
  Package,
  MapPin,
  Download,
  Filter
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { useRouter } from 'next/navigation'
import { ClickableTableRow } from '@/components/reports/ClickableTableRow'

export default function CPQAnalyticsWinRatePage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('last-6-months')

  // Win/Loss trend
  const winLossTrend = [
    { month: 'Apr', won: 58, lost: 87, winRate: 40 },
    { month: 'May', won: 72, lost: 96, winRate: 43 },
    { month: 'Jun', won: 81, lost: 111, winRate: 42 },
    { month: 'Jul', won: 76, lost: 102, winRate: 43 },
    { month: 'Aug', won: 95, lost: 110, winRate: 46 },
    { month: 'Sep', won: 112, lost: 122, winRate: 48 }
  ]

  // Loss reasons distribution
  const lossReasons = [
    { reason: 'Price Too High', count: 285, percentage: 42, color: '#ef4444' },
    { reason: 'Competitor Won', count: 189, percentage: 28, color: '#f59e0b' },
    { reason: 'Lost to No Decision', count: 108, percentage: 16, color: '#6b7280' },
    { reason: 'Product Fit Issues', count: 68, percentage: 10, color: '#8b5cf6' },
    { reason: 'Timing/Budget', count: 27, percentage: 4, color: '#3b82f6' }
  ]

  // Competitor win/loss record
  const competitorAnalysis = [
    { competitor: 'Kitchen Concepts Ltd', won: 45, lost: 78, winRate: 36.6, avgDealSize: 3.8 },
    { competitor: 'Premium Interiors', won: 32, lost: 52, winRate: 38.1, avgDealSize: 4.2 },
    { competitor: 'Modular Solutions', won: 28, lost: 41, winRate: 40.6, avgDealSize: 3.5 },
    { competitor: 'Design Studio', won: 18, lost: 25, winRate: 41.9, avgDealSize: 3.9 },
    { competitor: 'Others', won: 66, lost: 93, winRate: 41.5, avgDealSize: 3.2 }
  ]

  // Win rate by product category
  const productWinRate = [
    { category: 'Modular Kitchens', won: 198, lost: 185, winRate: 51.7, avgValue: 4.5 },
    { category: 'Wardrobes', won: 95, lost: 142, winRate: 40.1, avgValue: 3.2 },
    { category: 'Living Room', won: 68, lost: 98, winRate: 41.0, avgValue: 3.8 },
    { category: 'Office Furniture', won: 45, lost: 95, winRate: 32.1, avgValue: 5.2 },
    { category: 'Bathroom Vanities', won: 88, lost: 108, winRate: 44.9, avgValue: 2.8 }
  ]

  // Win rate by customer segment
  const segmentWinRate = [
    { segment: 'New Customers', won: 125, lost: 245, winRate: 33.8, color: '#3b82f6' },
    { segment: 'Repeat Customers', won: 185, lost: 158, winRate: 53.9, color: '#10b981' },
    { segment: 'VIP Customers', won: 92, lost: 78, winRate: 54.1, color: '#8b5cf6' },
    { segment: 'Strategic Partners', won: 92, lost: 147, winRate: 38.5, color: '#f59e0b' }
  ]

  // Win rate by deal size
  const dealSizeWinRate = [
    { range: '< ₹2L', won: 145, lost: 95, winRate: 60.4 },
    { range: '₹2L - ₹5L', won: 188, lost: 225, winRate: 45.5 },
    { range: '₹5L - ₹10L', won: 95, lost: 185, winRate: 33.9 },
    { range: '> ₹10L', won: 66, lost: 123, winRate: 34.9 }
  ]

  // Win rate by region
  const regionWinRate = [
    { region: 'Mumbai', won: 145, lost: 168, winRate: 46.3, deals: 313 },
    { region: 'Delhi NCR', won: 125, lost: 152, winRate: 45.1, deals: 277 },
    { region: 'Bangalore', won: 98, lost: 112, winRate: 46.7, deals: 210 },
    { region: 'Pune', won: 78, lost: 95, winRate: 45.1, deals: 173 },
    { region: 'Others', won: 48, lost: 101, winRate: 32.2, deals: 149 }
  ]

  // Competitive positioning radar
  const competitiveRadar = [
    { factor: 'Price', us: 65, competitor: 85 },
    { factor: 'Quality', us: 90, competitor: 70 },
    { factor: 'Delivery Speed', us: 85, competitor: 60 },
    { factor: 'Customization', us: 88, competitor: 65 },
    { factor: 'Service', us: 82, competitor: 70 },
    { factor: 'Brand', us: 70, competitor: 80 }
  ]

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Win Rate Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">Comprehensive win/loss analysis and competitive insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
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
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-green-600">Overall Win Rate</p>
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">48%</p>
          <p className="text-xs text-green-700 mt-2">112 won / 234 total deals</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-blue-600">Deals Won</p>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">494</p>
          <p className="text-xs text-blue-700 mt-2">Last 6 months</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-red-600">Deals Lost</p>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-900">628</p>
          <p className="text-xs text-red-700 mt-2">Last 6 months</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-purple-600">Avg Won Deal Size</p>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-900">₹4.8L</p>
          <p className="text-xs text-purple-700 mt-2">vs ₹3.2L for lost deals</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Win/Loss Trend */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Win/Loss Trend</h3>
              <p className="text-sm text-gray-600">Monthly win rate progression</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winLossTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="won" stroke="#10b981" strokeWidth={2} name="Won" />
              <Line yAxisId="left" type="monotone" dataKey="lost" stroke="#ef4444" strokeWidth={2} name="Lost" />
              <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#8b5cf6" strokeWidth={2} name="Win Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loss Reasons */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Loss Reasons</h3>
              <p className="text-sm text-gray-600">Why deals were lost</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-3">
            {lossReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{reason.reason}</span>
                    <span className="text-sm font-bold text-gray-900">{reason.count} deals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${reason.percentage}%`, backgroundColor: reason.color }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold w-12 text-right" style={{ color: reason.color }}>
                  {reason.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Competitor Analysis</h3>
            <p className="text-sm text-gray-600">Win/loss record against key competitors</p>
          </div>
          <Users className="h-6 w-6 text-orange-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Competitor</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Deals Won</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Deals Lost</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Deals</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Win Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Deal Size</th>
              </tr>
            </thead>
            <tbody>
              {competitorAnalysis.map((comp, idx) => (
                <ClickableTableRow
                  key={idx}
                  onClick={() => router.push(`/cpq/quotes?competitor=${encodeURIComponent(comp.competitor)}`)}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{comp.competitor}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-green-600 font-medium">{comp.won}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-red-600 font-medium">{comp.lost}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-gray-900 font-medium">{comp.won + comp.lost}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${comp.winRate >= 40 ? 'bg-green-100 text-green-700' :
                      comp.winRate >= 35 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {comp.winRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-purple-600 font-bold">₹{comp.avgDealSize}L</span>
                  </td>
                </ClickableTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Win Rate by Product Category */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Win Rate by Product Category</h3>
              <p className="text-sm text-gray-600">Category performance comparison</p>
            </div>
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productWinRate} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="winRate" fill="#3b82f6" name="Win Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win Rate by Customer Segment */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Win Rate by Customer Segment</h3>
              <p className="text-sm text-gray-600">Segment performance analysis</p>
            </div>
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={segmentWinRate}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, winRate }) => `${winRate}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="winRate"
                >
                  {segmentWinRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {segmentWinRate.map((segment, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{segment.winRate}%</p>
                    <p className="text-xs text-gray-500">{segment.won}/{segment.won + segment.lost}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitive Positioning Radar */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Competitive Positioning</h3>
              <p className="text-sm text-gray-600">Us vs average competitor</p>
            </div>
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={competitiveRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="factor" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Us" dataKey="us" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Radar name="Competitor Avg" dataKey="competitor" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-blue-900">Strategic Insights</h3>
              <p className="text-sm text-blue-700">Actionable recommendations</p>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Strong in Modular Kitchens</p>
                  <p className="text-xs text-gray-600">51.7% win rate in core category. Continue to leverage quality and customization advantages.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Price Sensitivity Challenge</p>
                  <p className="text-xs text-gray-600">42% of losses due to pricing. Consider value-based selling and flexible pricing tiers.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Focus on Repeat Customers</p>
                  <p className="text-xs text-gray-600">54% win rate with repeat customers vs 34% with new. Invest in customer retention programs.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Office Furniture Opportunity</p>
                  <p className="text-xs text-gray-600">32% win rate but highest deal size (₹5.2L). Improve product-market fit in this segment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
