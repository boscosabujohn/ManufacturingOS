'use client'

import React, { useState } from 'react'
import {
  Users,
  Building2,
  Award,
  TrendingUp,
  Shield,
  Star,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  DollarSign,
  Percent,
  Target,
  Zap,
  Heart,
  ThumbsUp,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Settings,
  XCircle
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'

interface Supplier {
  id: string
  name: string
  category: string
  status: 'active' | 'inactive' | 'suspended' | 'onboarding'
  tier: 'strategic' | 'preferred' | 'approved' | 'probation'
  performanceScore: number
  riskScore: number
  spend: number
  contracts: number
  location: string
  contact: {
    name: string
    email: string
    phone: string
  }
  certifications: string[]
  lastReview: string
  nextReview: string
}

export default function SupplierRelationshipManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [filterTier, setFilterTier] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const suppliers: Supplier[] = [
    {
      id: 'SUP001',
      name: 'Global Tech Solutions',
      category: 'IT Services',
      status: 'active',
      tier: 'strategic',
      performanceScore: 92,
      riskScore: 15,
      spend: 3500000,
      contracts: 8,
      location: 'San Francisco, USA',
      contact: {
        name: 'John Smith',
        email: 'john.smith@globaltech.com',
        phone: '+1-415-555-0123'
      },
      certifications: ['ISO 9001', 'ISO 27001', 'SOC 2'],
      lastReview: '2024-01-15',
      nextReview: '2024-04-15'
    },
    {
      id: 'SUP002',
      name: 'Premier Manufacturing Co',
      category: 'Raw Materials',
      status: 'active',
      tier: 'strategic',
      performanceScore: 88,
      riskScore: 25,
      spend: 5200000,
      contracts: 12,
      location: 'Detroit, USA',
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah@premiermfg.com',
        phone: '+1-313-555-0456'
      },
      certifications: ['ISO 9001', 'ISO 14001'],
      lastReview: '2024-01-20',
      nextReview: '2024-04-20'
    },
    {
      id: 'SUP003',
      name: 'Express Logistics Ltd',
      category: 'Logistics',
      status: 'active',
      tier: 'preferred',
      performanceScore: 85,
      riskScore: 30,
      spend: 2800000,
      contracts: 6,
      location: 'Chicago, USA',
      contact: {
        name: 'Mike Chen',
        email: 'mchen@expresslog.com',
        phone: '+1-312-555-0789'
      },
      certifications: ['ISO 9001', 'C-TPAT'],
      lastReview: '2024-02-01',
      nextReview: '2024-05-01'
    },
    {
      id: 'SUP004',
      name: 'Quality Components Inc',
      category: 'Components',
      status: 'active',
      tier: 'approved',
      performanceScore: 78,
      riskScore: 40,
      spend: 1500000,
      contracts: 4,
      location: 'Austin, USA',
      contact: {
        name: 'Lisa Wong',
        email: 'lwong@qualitycomp.com',
        phone: '+1-512-555-0234'
      },
      certifications: ['ISO 9001'],
      lastReview: '2024-01-10',
      nextReview: '2024-04-10'
    }
  ]

  const performanceTrend = [
    { month: 'Jan', strategic: 88, preferred: 82, approved: 75 },
    { month: 'Feb', strategic: 89, preferred: 83, approved: 76 },
    { month: 'Mar', strategic: 91, preferred: 84, approved: 77 },
    { month: 'Apr', strategic: 90, preferred: 85, approved: 78 },
    { month: 'May', strategic: 92, preferred: 85, approved: 79 },
    { month: 'Jun', strategic: 93, preferred: 86, approved: 80 }
  ]

  const categoryDistribution = [
    { name: 'IT Services', value: 3500000, suppliers: 8 },
    { name: 'Raw Materials', value: 5200000, suppliers: 12 },
    { name: 'Logistics', value: 2800000, suppliers: 6 },
    { name: 'Components', value: 1500000, suppliers: 15 },
    { name: 'Professional Services', value: 980000, suppliers: 5 },
    { name: 'Facilities', value: 620000, suppliers: 3 }
  ]

  const riskMatrix = [
    { supplier: 'Global Tech Solutions', impact: 85, probability: 15, spend: 3500000 },
    { supplier: 'Premier Manufacturing', impact: 90, probability: 25, spend: 5200000 },
    { supplier: 'Express Logistics', impact: 75, probability: 30, spend: 2800000 },
    { supplier: 'Quality Components', impact: 60, probability: 40, spend: 1500000 },
    { supplier: 'Pro Services Group', impact: 50, probability: 20, spend: 980000 }
  ]

  const relationshipHealth = [
    { aspect: 'Communication', score: 85 },
    { aspect: 'Quality', score: 88 },
    { aspect: 'Delivery', score: 82 },
    { aspect: 'Innovation', score: 75 },
    { aspect: 'Cost Competitiveness', score: 80 },
    { aspect: 'Responsiveness', score: 90 }
  ]

  const engagementActivities = [
    { date: '2024-02-15', type: 'meeting', supplier: 'Global Tech Solutions', subject: 'Quarterly Business Review', status: 'completed' },
    { date: '2024-02-18', type: 'audit', supplier: 'Premier Manufacturing Co', subject: 'Quality Audit', status: 'scheduled' },
    { date: '2024-02-20', type: 'training', supplier: 'Express Logistics Ltd', subject: 'System Integration Training', status: 'scheduled' },
    { date: '2024-02-22', type: 'review', supplier: 'Quality Components Inc', subject: 'Performance Review', status: 'pending' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Supplier Relationship Management
            </h1>
            <p className="text-gray-600 mt-2">Build and maintain strong partnerships with your supply chain</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total Suppliers</span>
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">147</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+12 this quarter</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Strategic Partners</span>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <div className="text-sm text-gray-600">12% of total</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Avg Performance</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">87.5</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+2.3 points</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-600 text-sm font-medium">Risk Level</span>
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">Low</div>
            <div className="text-sm text-gray-600">28% avg risk score</div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-600 text-sm font-medium">Engagement Score</span>
              <Heart className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">92%</div>
            <div className="text-sm text-gray-600">Very High</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'suppliers', 'performance', 'engagement', 'risk', 'collaboration'].map((tab) => (
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
              {/* Performance Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Tier</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" domain={[70, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Line type="monotone" dataKey="strategic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="Strategic" />
                      <Line type="monotone" dataKey="preferred" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Preferred" />
                      <Line type="monotone" dataKey="approved" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} name="Approved" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

              {/* Relationship Health Radar */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Health Metrics</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={relationshipHealth}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="aspect" stroke="#6B7280" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6B7280" />
                    <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Upcoming Activities */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Engagement Activities</h3>
                </div>
                <div className="p-4 space-y-3">
                  {engagementActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'audit' ? 'bg-amber-100 text-amber-600' :
                          activity.type === 'training' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'meeting' && <MessageSquare className="w-5 h-5" />}
                          {activity.type === 'audit' && <Shield className="w-5 h-5" />}
                          {activity.type === 'training' && <Award className="w-5 h-5" />}
                          {activity.type === 'review' && <Star className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.subject}</div>
                          <div className="text-sm text-gray-600">{activity.supplier}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{activity.date}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                          activity.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="strategic">Strategic</option>
                  <option value="preferred">Preferred</option>
                  <option value="approved">Approved</option>
                  <option value="probation">Probation</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>

              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            supplier.tier === 'strategic' ? 'bg-purple-100 text-purple-700' :
                            supplier.tier === 'preferred' ? 'bg-blue-100 text-blue-700' :
                            supplier.tier === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {supplier.tier}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{supplier.category}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.status === 'active' ? 'bg-green-100 text-green-700' :
                        supplier.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                        supplier.status === 'suspended' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {supplier.status === 'active' && <CheckCircle className="w-3 h-3" />}
                        {supplier.status === 'inactive' && <XCircle className="w-3 h-3" />}
                        {supplier.status === 'suspended' && <AlertTriangle className="w-3 h-3" />}
                        {supplier.status === 'onboarding' && <Clock className="w-3 h-3" />}
                        {supplier.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500">Performance</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                supplier.performanceScore >= 85 ? 'bg-green-500' :
                                supplier.performanceScore >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${supplier.performanceScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{supplier.performanceScore}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Risk Score</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                supplier.riskScore <= 30 ? 'bg-green-500' :
                                supplier.riskScore <= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${supplier.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{supplier.riskScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${(supplier.spend / 1000000).toFixed(1)}M
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {supplier.contracts} contracts
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {supplier.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <button className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Engage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-green-600 text-sm font-medium mb-1">High Performers</div>
                  <div className="text-2xl font-bold text-gray-900">32</div>
                  <div className="text-sm text-gray-600">Score ≥ 85</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-yellow-600 text-sm font-medium mb-1">Moderate Performers</div>
                  <div className="text-2xl font-bold text-gray-900">68</div>
                  <div className="text-sm text-gray-600">Score 70-84</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-red-600 text-sm font-medium mb-1">Low Performers</div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Score < 70</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-blue-600 text-sm font-medium mb-1">Under Review</div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-gray-600">Pending evaluation</div>
                </div>
              </div>

              {/* Performance Matrix */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Spend Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="spend" stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <YAxis dataKey="performanceScore" stroke="#6B7280" domain={[60, 100]} />
                    <ZAxis dataKey="contracts" range={[50, 400]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-sm">Performance: {data.performanceScore}%</p>
                              <p className="text-sm">Spend: ${(data.spend / 1000000).toFixed(2)}M</p>
                              <p className="text-sm">Contracts: {data.contracts}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter
                      name="Suppliers"
                      data={suppliers}
                      fill="#3B82F6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* KPI Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Quality Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Defect Rate</span>
                      <span className="font-medium">0.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Return Rate</span>
                      <span className="font-medium">1.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance Rate</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">On-Time Delivery</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Lead Time</span>
                      <span className="font-medium">12.5 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fill Rate</span>
                      <span className="font-medium">96.8%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Financial Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cost Savings</span>
                      <span className="font-medium">8.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment Terms</span>
                      <span className="font-medium">Net 45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Invoice Accuracy</span>
                      <span className="font-medium">99.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="space-y-6">
              {/* Engagement Calendar */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Calendar</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const hasActivity = [5, 8, 12, 15, 18, 22, 25, 28].includes(i)
                    const isToday = i === 15
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-lg border ${
                          isToday ? 'bg-blue-100 border-blue-300' :
                          hasActivity ? 'bg-green-50 border-green-200' :
                          'bg-white border-gray-200'
                        }`}
                      >
                        <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                          {i < 31 ? i + 1 : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Communication Channels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Recent Communications</h4>
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Global Tech Solutions</div>
                        <div className="text-xs text-gray-600">Contract renewal discussion</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Premier Manufacturing</div>
                        <div className="text-xs text-gray-600">Quality improvement plan</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Express Logistics</div>
                        <div className="text-xs text-gray-600">Delivery schedule update</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Collaboration Tools</h4>
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                      <span className="text-sm">Supplier Portal</span>
                      <Globe className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                      <span className="text-sm">Document Sharing</span>
                      <FileText className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                      <span className="text-sm">Video Conference</span>
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Feedback Score</h4>
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Satisfaction</span>
                        <span className="font-medium">4.5/5.0</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium">2.5 hrs</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Resolution Rate</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              {/* Risk Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-600 text-sm font-medium">Critical Risks</span>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-600">Immediate action</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-600 text-sm font-medium">High Risks</span>
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Monitor closely</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-600 text-sm font-medium">Medium Risks</span>
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Regular review</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 text-sm font-medium">Low Risks</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">28</div>
                  <div className="text-sm text-gray-600">Under control</div>
                </div>
              </div>

              {/* Risk Matrix Scatter Plot */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Risk Matrix</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="probability" stroke="#6B7280" domain={[0, 100]} label={{ value: 'Probability (%)', position: 'insideBottom', offset: -5 }} />
                    <YAxis dataKey="impact" stroke="#6B7280" domain={[0, 100]} label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }} />
                    <ZAxis dataKey="spend" range={[100, 500]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold">{data.supplier}</p>
                              <p className="text-sm">Impact: {data.impact}%</p>
                              <p className="text-sm">Probability: {data.probability}%</p>
                              <p className="text-sm">Spend: ${(data.spend / 1000000).toFixed(2)}M</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter
                      name="Suppliers"
                      data={riskMatrix}
                      fill={(entry: any) => {
                        const risk = entry.impact * entry.probability / 100
                        if (risk > 60) return '#EF4444'
                        if (risk > 30) return '#F59E0B'
                        return '#10B981'
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Mitigation Actions */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Risk Mitigation Actions</h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { supplier: 'Premier Manufacturing', risk: 'Supply disruption', action: 'Implement dual sourcing strategy', status: 'in-progress', due: '2024-03-15' },
                    { supplier: 'Express Logistics', risk: 'Financial instability', action: 'Quarterly financial health review', status: 'planned', due: '2024-03-01' },
                    { supplier: 'Quality Components', risk: 'Quality issues', action: 'Enhanced QA audit process', status: 'completed', due: '2024-02-15' },
                    { supplier: 'Global Tech Solutions', risk: 'Data security', action: 'SOC 2 certification requirement', status: 'in-progress', due: '2024-04-30' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-gray-900">{item.supplier}</span>
                          <span className="text-sm text-red-600">{item.risk}</span>
                        </div>
                        <div className="text-sm text-gray-600">{item.action}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Due: {item.due}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaboration' && (
            <div className="space-y-6">
              {/* Collaboration Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Active Projects</h4>
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Innovation</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cost Reduction</span>
                      <span className="font-medium">10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Quality Improvement</span>
                      <span className="font-medium">6</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Joint Initiatives</h4>
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sustainability</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Technology</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Process Optimization</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Value Created</h4>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">$2.8M</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cost Savings</span>
                      <span className="font-medium">$1.5M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Revenue Growth</span>
                      <span className="font-medium">$0.8M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Efficiency Gains</span>
                      <span className="font-medium">$0.5M</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Innovation Pipeline */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Innovation Pipeline</h3>
                <div className="space-y-4">
                  {[
                    { idea: 'AI-Powered Demand Forecasting', supplier: 'Global Tech Solutions', stage: 'pilot', value: 450000, completion: 65 },
                    { idea: 'Sustainable Packaging Solution', supplier: 'Premier Manufacturing', stage: 'development', value: 320000, completion: 35 },
                    { idea: 'Real-time Tracking System', supplier: 'Express Logistics', stage: 'implementation', value: 280000, completion: 80 },
                    { idea: 'Automated Quality Testing', supplier: 'Quality Components', stage: 'concept', value: 180000, completion: 15 }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.idea}</h4>
                          <div className="text-sm text-gray-600 mt-1">Partner: {item.supplier}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${(item.value / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-500">Potential Value</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.stage === 'implementation' ? 'bg-green-100 text-green-700' :
                          item.stage === 'pilot' ? 'bg-blue-100 text-blue-700' :
                          item.stage === 'development' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.stage}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{item.completion}%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${item.completion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}