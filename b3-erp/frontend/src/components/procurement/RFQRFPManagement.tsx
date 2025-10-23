'use client'

import React, { useState } from 'react'
import {
  FileText,
  Send,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Package,
  Building2,
  TrendingUp,
  BarChart3,
  Star,
  Award,
  Filter,
  Search,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Copy,
  MessageSquare,
  Paperclip,
  ChevronRight,
  ArrowUpRight,
  Target,
  Zap,
  Shield,
  Timer,
  Tag,
  GitCompare,
  ThumbsUp,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Settings,
  MoreVertical
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
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
  Radar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'

interface RFQ {
  id: string
  title: string
  type: 'RFQ' | 'RFP' | 'RFI'
  status: 'draft' | 'published' | 'bidding' | 'evaluation' | 'awarded' | 'cancelled'
  category: string
  estimatedValue: number
  responseDeadline: string
  publishDate: string
  bidders: number
  responsesReceived: number
  owner: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  items: number
}

interface BidResponse {
  id: string
  rfqId: string
  supplier: string
  submittedDate: string
  totalAmount: number
  leadTime: string
  score: number
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'awarded'
  compliance: number
  technicalScore: number
  commercialScore: number
}

export default function RFQRFPManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [showComparison, setShowComparison] = useState(false)

  // Mock data
  const rfqList: RFQ[] = [
    {
      id: 'RFQ-2024-001',
      title: 'Annual IT Infrastructure Upgrade',
      type: 'RFP',
      status: 'evaluation',
      category: 'IT Services',
      estimatedValue: 500000,
      responseDeadline: '2024-03-15',
      publishDate: '2024-02-01',
      bidders: 12,
      responsesReceived: 8,
      owner: 'John Matthews',
      priority: 'high',
      items: 25
    },
    {
      id: 'RFQ-2024-002',
      title: 'Raw Materials Supply Q2-Q3',
      type: 'RFQ',
      status: 'bidding',
      category: 'Raw Materials',
      estimatedValue: 1200000,
      responseDeadline: '2024-03-01',
      publishDate: '2024-02-10',
      bidders: 15,
      responsesReceived: 3,
      owner: 'Sarah Chen',
      priority: 'urgent',
      items: 45
    },
    {
      id: 'RFQ-2024-003',
      title: 'Logistics Services Contract',
      type: 'RFP',
      status: 'published',
      category: 'Logistics',
      estimatedValue: 800000,
      responseDeadline: '2024-03-20',
      publishDate: '2024-02-12',
      bidders: 8,
      responsesReceived: 0,
      owner: 'Mike Johnson',
      priority: 'medium',
      items: 18
    },
    {
      id: 'RFQ-2024-004',
      title: 'Office Supplies Annual Contract',
      type: 'RFQ',
      status: 'awarded',
      category: 'Office Supplies',
      estimatedValue: 75000,
      responseDeadline: '2024-02-15',
      publishDate: '2024-01-20',
      bidders: 6,
      responsesReceived: 6,
      owner: 'Lisa Wong',
      priority: 'low',
      items: 150
    }
  ]

  const bidResponses: BidResponse[] = [
    {
      id: 'BID-001',
      rfqId: 'RFQ-2024-001',
      supplier: 'TechPro Solutions',
      submittedDate: '2024-02-25',
      totalAmount: 485000,
      leadTime: '45 days',
      score: 92,
      status: 'shortlisted',
      compliance: 95,
      technicalScore: 90,
      commercialScore: 88
    },
    {
      id: 'BID-002',
      rfqId: 'RFQ-2024-001',
      supplier: 'Global Tech Services',
      submittedDate: '2024-02-24',
      totalAmount: 478000,
      leadTime: '60 days',
      score: 88,
      status: 'shortlisted',
      compliance: 92,
      technicalScore: 85,
      commercialScore: 90
    },
    {
      id: 'BID-003',
      rfqId: 'RFQ-2024-001',
      supplier: 'Innovation Systems',
      submittedDate: '2024-02-26',
      totalAmount: 510000,
      leadTime: '30 days',
      score: 85,
      status: 'under_review',
      compliance: 88,
      technicalScore: 92,
      commercialScore: 75
    }
  ]

  const rfqMetrics = {
    totalRFQs: 45,
    activeRFQs: 12,
    totalValue: 8500000,
    avgResponseRate: 72,
    avgCycletime: 18,
    savingsAchieved: 1250000
  }

  const rfqTrend = [
    { month: 'Jan', created: 8, awarded: 6, cancelled: 1 },
    { month: 'Feb', created: 10, awarded: 7, cancelled: 2 },
    { month: 'Mar', created: 9, awarded: 8, cancelled: 1 },
    { month: 'Apr', created: 12, awarded: 9, cancelled: 1 },
    { month: 'May', created: 11, awarded: 10, cancelled: 2 },
    { month: 'Jun', created: 14, awarded: 11, cancelled: 1 }
  ]

  const categoryDistribution = [
    { category: 'IT Services', count: 12, value: 2500000 },
    { category: 'Raw Materials', count: 18, value: 3200000 },
    { category: 'Logistics', count: 8, value: 1800000 },
    { category: 'Professional Services', count: 5, value: 800000 },
    { category: 'Office Supplies', count: 2, value: 200000 }
  ]

  const supplierParticipation = [
    { supplier: 'TechPro Solutions', participated: 15, won: 8, winRate: 53 },
    { supplier: 'Global Supplies Inc', participated: 12, won: 5, winRate: 42 },
    { supplier: 'Premier Manufacturing', participated: 10, won: 6, winRate: 60 },
    { supplier: 'Express Logistics', participated: 8, won: 3, winRate: 38 },
    { supplier: 'Innovation Systems', participated: 18, won: 7, winRate: 39 }
  ]

  const evaluationCriteria = [
    { criteria: 'Price', weight: 30 },
    { criteria: 'Quality', weight: 25 },
    { criteria: 'Delivery', weight: 20 },
    { criteria: 'Technical', weight: 15 },
    { criteria: 'Service', weight: 10 }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              RFQ/RFP Management
            </h1>
            <p className="text-gray-600 mt-2">Manage requests for quotations and proposals efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New RFQ/RFP
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total RFQs</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{rfqMetrics.totalRFQs}</div>
            <div className="text-sm text-gray-600">This quarter</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Active RFQs</span>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{rfqMetrics.activeRFQs}</div>
            <div className="text-sm text-orange-600">3 closing soon</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Total Value</span>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${(rfqMetrics.totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Under bidding</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-600 text-sm font-medium">Response Rate</span>
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{rfqMetrics.avgResponseRate}%</div>
            <div className="text-sm text-green-600">↑ 5% vs last</div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-600 text-sm font-medium">Cycle Time</span>
              <Timer className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{rfqMetrics.avgCycletime}d</div>
            <div className="text-sm text-green-600">↓ 3 days</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-600 text-sm font-medium">Savings</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${(rfqMetrics.savingsAchieved / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-gray-600">YTD achieved</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'rfqs', 'responses', 'evaluation', 'analytics', 'templates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* RFQ Activity Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">RFQ Activity Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={rfqTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Area type="monotone" dataKey="created" stackId="1" stroke="#3B82F6" fill="#DBEAFE" name="Created" />
                      <Area type="monotone" dataKey="awarded" stackId="2" stroke="#10B981" fill="#D1FAE5" name="Awarded" />
                      <Area type="monotone" dataKey="cancelled" stackId="3" stroke="#EF4444" fill="#FEE2E2" name="Cancelled" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active RFQs Dashboard */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Active RFQs Requiring Attention</h3>
                </div>
                <div className="p-4 space-y-3">
                  {rfqList.filter(rfq => rfq.status !== 'awarded' && rfq.status !== 'cancelled').map((rfq) => (
                    <div key={rfq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-gray-900">{rfq.id}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            rfq.type === 'RFP' ? 'bg-purple-100 text-purple-700' :
                            rfq.type === 'RFQ' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rfq.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            rfq.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            rfq.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            rfq.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rfq.priority === 'urgent' && <Zap className="w-3 h-3 mr-1" />}
                            {rfq.priority}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900">{rfq.title}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Closes: {rfq.responseDeadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {rfq.responsesReceived}/{rfq.bidders} responses
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${(rfq.estimatedValue / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {Math.ceil((new Date(rfq.responseDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                          <div className={`text-xs ${
                            rfq.status === 'evaluation' ? 'text-amber-600' :
                            rfq.status === 'bidding' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                            {rfq.status}
                          </div>
                        </div>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rfqs' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search RFQs/RFPs..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="rfq">RFQ</option>
                  <option value="rfp">RFP</option>
                  <option value="rfi">RFI</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>

              {/* RFQ Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">RFQ ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Deadline</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Responses</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rfqList.map((rfq) => (
                      <tr key={rfq.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-blue-600">{rfq.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{rfq.title}</div>
                            <div className="text-sm text-gray-500">{rfq.items} items</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            rfq.type === 'RFP' ? 'bg-purple-100 text-purple-700' :
                            rfq.type === 'RFQ' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rfq.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{rfq.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">${(rfq.estimatedValue / 1000).toFixed(0)}K</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-gray-900">{rfq.responseDeadline}</div>
                            <div className="text-xs text-gray-500">
                              {Math.ceil((new Date(rfq.responseDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[...Array(Math.min(3, rfq.responsesReceived))].map((_, i) => (
                                <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                              ))}
                              {rfq.responsesReceived > 3 && (
                                <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                                  <span className="text-xs">+{rfq.responsesReceived - 3}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">{rfq.responsesReceived}/{rfq.bidders}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            rfq.status === 'published' ? 'bg-blue-100 text-blue-700' :
                            rfq.status === 'bidding' ? 'bg-yellow-100 text-yellow-700' :
                            rfq.status === 'evaluation' ? 'bg-purple-100 text-purple-700' :
                            rfq.status === 'awarded' ? 'bg-green-100 text-green-700' :
                            rfq.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rfq.status === 'published' && <Send className="w-3 h-3" />}
                            {rfq.status === 'bidding' && <Clock className="w-3 h-3" />}
                            {rfq.status === 'evaluation' && <GitCompare className="w-3 h-3" />}
                            {rfq.status === 'awarded' && <CheckCircle className="w-3 h-3" />}
                            {rfq.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              <Eye className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">View</span>
                            </button>
                            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              <Edit className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">Edit</span>
                            </button>
                            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">More</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="space-y-6">
              {/* Response Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-blue-600 text-sm font-medium mb-1">Total Responses</div>
                  <div className="text-2xl font-bold text-gray-900">48</div>
                  <div className="text-sm text-gray-600">Across all RFQs</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-yellow-600 text-sm font-medium mb-1">Under Review</div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Pending evaluation</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-green-600 text-sm font-medium mb-1">Shortlisted</div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-gray-600">For final selection</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-purple-600 text-sm font-medium mb-1">Avg Score</div>
                  <div className="text-2xl font-bold text-gray-900">82.5</div>
                  <div className="text-sm text-gray-600">Quality rating</div>
                </div>
              </div>

              {/* Bid Responses Table */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Bid Responses</h3>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <GitCompare className="w-4 h-4" />
                    Compare Selected
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">RFQ</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Lead Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bidResponses.map((bid) => (
                        <tr key={bid.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900">{bid.supplier}</div>
                              <div className="text-sm text-gray-500">Submitted: {bid.submittedDate}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-blue-600">{bid.rfqId}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">${(bid.totalAmount / 1000).toFixed(0)}K</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{bid.leadTime}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      bid.score >= 85 ? 'bg-green-500' :
                                      bid.score >= 70 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${bid.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{bid.score}</span>
                              </div>
                              <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                <span>T: {bid.technicalScore}</span>
                                <span>C: {bid.commercialScore}</span>
                                <span>Comp: {bid.compliance}%</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              bid.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                              bid.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                              bid.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              bid.status === 'awarded' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {bid.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                <Eye className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-700">View</span>
                              </button>
                              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                                <ThumbsUp className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">Approve</span>
                              </button>
                              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-red-600">Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              {/* Evaluation Criteria */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Criteria Weights</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {evaluationCriteria.map((criteria) => (
                    <div key={criteria.criteria} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">{criteria.criteria}</div>
                      <div className="text-2xl font-bold text-gray-900">{criteria.weight}%</div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${criteria.weight}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bid Comparison Matrix */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Bid Comparison Matrix</h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={[
                      { criteria: 'Price', supplierA: 85, supplierB: 90, supplierC: 75 },
                      { criteria: 'Quality', supplierA: 90, supplierB: 85, supplierC: 92 },
                      { criteria: 'Delivery', supplierA: 80, supplierB: 88, supplierC: 85 },
                      { criteria: 'Technical', supplierA: 92, supplierB: 78, supplierC: 88 },
                      { criteria: 'Service', supplierA: 88, supplierB: 82, supplierC: 90 }
                    ]}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="criteria" stroke="#6B7280" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6B7280" />
                      <Radar name="TechPro Solutions" dataKey="supplierA" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Radar name="Global Tech Services" dataKey="supplierB" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Radar name="Innovation Systems" dataKey="supplierC" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Scoring Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Technical Evaluation</h4>
                  <div className="space-y-3">
                    {['Solution Architecture', 'Implementation Plan', 'Team Expertise', 'Innovation', 'Risk Management'].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium">4.0</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Commercial Evaluation</h4>
                  <div className="space-y-3">
                    {['Price Competitiveness', 'Payment Terms', 'Warranty', 'Value for Money', 'Cost Breakdown'].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium">4.2</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Supplier Win Rate Analysis */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Performance Analytics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={supplierParticipation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="supplier" angle={-45} textAnchor="end" height={80} stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Bar dataKey="participated" fill="#3B82F6" name="Participated" />
                    <Bar dataKey="won" fill="#10B981" name="Won" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Response Time Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Days to Respond</span>
                      <span className="font-medium">5.2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fastest Response</span>
                      <span className="font-medium">1 day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Slowest Response</span>
                      <span className="font-medium">14 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">On-Time Response Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Cost Savings Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Savings YTD</span>
                      <span className="font-medium text-green-600">$1.25M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Savings %</span>
                      <span className="font-medium">12.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Best Negotiation</span>
                      <span className="font-medium">28% saved</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target Achievement</span>
                      <span className="font-medium">115%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Process Efficiency</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Cycle Time</span>
                      <span className="font-medium">18 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">First-Time Award Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cancellation Rate</span>
                      <span className="font-medium text-red-600">5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Re-bid Rate</span>
                      <span className="font-medium">8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RFQ/RFP Templates</h3>

              {/* Template Library */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Standard RFQ Template', category: 'General', uses: 124, lastUpdated: '2024-01-15' },
                  { name: 'IT Services RFP', category: 'Technology', uses: 45, lastUpdated: '2024-02-01' },
                  { name: 'Construction RFQ', category: 'Facilities', uses: 28, lastUpdated: '2024-01-20' },
                  { name: 'Professional Services RFP', category: 'Services', uses: 62, lastUpdated: '2024-02-10' },
                  { name: 'Raw Materials RFQ', category: 'Supply Chain', uses: 89, lastUpdated: '2024-02-05' },
                  { name: 'Logistics RFP Template', category: 'Transportation', uses: 34, lastUpdated: '2024-01-25' }
                ].map((template) => (
                  <div key={template.name} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">More</span>
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                    <div className="text-sm text-gray-600 mb-3">{template.category}</div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Used {template.uses} times</span>
                      <span>Updated {template.lastUpdated}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                        Use Template
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Template Actions */}
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import Template
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}