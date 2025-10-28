'use client'

import React, { useState } from 'react'
import {
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Building2,
  Shield,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  ChevronRight,
  Download,
  Eye,
  Edit,
  Send,
  XCircle,
  RefreshCw,
  Search,
  Plus,
  AlertTriangle,
  Filter,
  Star,
  ThumbsUp,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Square,
  Info,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Activity,
  Lock,
  Unlock,
  Key,
  CreditCard,
  FileCheck,
  GitBranch
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
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts'

interface OnboardingApplication {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  category: string
  status: 'new' | 'screening' | 'documentation' | 'verification' | 'approval' | 'completed' | 'rejected'
  progress: number
  submittedDate: string
  lastUpdate: string
  assignedTo: string
  riskScore?: number
  priority: 'high' | 'medium' | 'low'
}

interface OnboardingStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'current' | 'pending'
  required: boolean
  documents?: string[]
  completedDate?: string
}

interface Document {
  id: string
  name: string
  type: string
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  uploadedDate?: string
  expiryDate?: string
  required: boolean
}

export default function SupplierOnboarding() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedApplication, setSelectedApplication] = useState<OnboardingApplication | null>(null)
  const [showNewApplication, setShowNewApplication] = useState(false)

  // Mock data
  const applications: OnboardingApplication[] = [
    {
      id: 'APP001',
      companyName: 'TechVision Solutions',
      contactName: 'Robert Chen',
      email: 'rchen@techvision.com',
      phone: '+1-555-0123',
      category: 'IT Services',
      status: 'verification',
      progress: 75,
      submittedDate: '2024-02-10',
      lastUpdate: '2024-02-14',
      assignedTo: 'Sarah Johnson',
      riskScore: 25,
      priority: 'high'
    },
    {
      id: 'APP002',
      companyName: 'Global Logistics Partners',
      contactName: 'Maria Garcia',
      email: 'mgarcia@glp.com',
      phone: '+1-555-0456',
      category: 'Logistics',
      status: 'documentation',
      progress: 45,
      submittedDate: '2024-02-12',
      lastUpdate: '2024-02-13',
      assignedTo: 'Mike Johnson',
      riskScore: 40,
      priority: 'medium'
    },
    {
      id: 'APP003',
      companyName: 'Premium Materials Inc',
      contactName: 'James Wilson',
      email: 'jwilson@premiummaterials.com',
      phone: '+1-555-0789',
      category: 'Raw Materials',
      status: 'screening',
      progress: 20,
      submittedDate: '2024-02-14',
      lastUpdate: '2024-02-15',
      assignedTo: 'Lisa Wong',
      riskScore: 15,
      priority: 'high'
    },
    {
      id: 'APP004',
      companyName: 'Quality Components Ltd',
      contactName: 'Emily Brown',
      email: 'ebrown@qualitycomp.com',
      phone: '+1-555-0234',
      category: 'Components',
      status: 'approval',
      progress: 90,
      submittedDate: '2024-02-08',
      lastUpdate: '2024-02-14',
      assignedTo: 'David Lee',
      priority: 'low'
    }
  ]

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Initial Application',
      description: 'Basic company information and contact details',
      status: 'completed',
      required: true,
      completedDate: '2024-02-10'
    },
    {
      id: 2,
      title: 'Screening & Background Check',
      description: 'Financial stability and compliance verification',
      status: 'completed',
      required: true,
      completedDate: '2024-02-11'
    },
    {
      id: 3,
      title: 'Documentation Upload',
      description: 'Required certificates and legal documents',
      status: 'completed',
      required: true,
      documents: ['Business License', 'Tax Certificate', 'Insurance', 'Bank Details'],
      completedDate: '2024-02-12'
    },
    {
      id: 4,
      title: 'Verification & Validation',
      description: 'Document verification and reference checks',
      status: 'current',
      required: true
    },
    {
      id: 5,
      title: 'Risk Assessment',
      description: 'Financial and operational risk evaluation',
      status: 'pending',
      required: true
    },
    {
      id: 6,
      title: 'Approval & Contract',
      description: 'Final approval and contract signing',
      status: 'pending',
      required: true
    },
    {
      id: 7,
      title: 'System Access Setup',
      description: 'Portal access and integration setup',
      status: 'pending',
      required: false
    }
  ]

  const requiredDocuments: Document[] = [
    { id: 'DOC001', name: 'Business Registration Certificate', type: 'Legal', status: 'verified', uploadedDate: '2024-02-10', required: true },
    { id: 'DOC002', name: 'Tax Registration Certificate', type: 'Tax', status: 'verified', uploadedDate: '2024-02-10', required: true },
    { id: 'DOC003', name: 'Insurance Certificate', type: 'Insurance', status: 'uploaded', uploadedDate: '2024-02-12', expiryDate: '2024-12-31', required: true },
    { id: 'DOC004', name: 'Bank Account Details', type: 'Financial', status: 'verified', uploadedDate: '2024-02-11', required: true },
    { id: 'DOC005', name: 'ISO Certifications', type: 'Quality', status: 'uploaded', uploadedDate: '2024-02-12', required: false },
    { id: 'DOC006', name: 'Financial Statements', type: 'Financial', status: 'pending', required: true },
    { id: 'DOC007', name: 'Reference Letters', type: 'Reference', status: 'pending', required: false },
    { id: 'DOC008', name: 'NDA Agreement', type: 'Legal', status: 'uploaded', uploadedDate: '2024-02-13', required: true }
  ]

  const onboardingMetrics = {
    totalApplications: 45,
    inProgress: 18,
    completed: 22,
    rejected: 5,
    avgTime: 8.5,
    successRate: 81
  }

  const onboardingTrend = [
    { month: 'Jan', applications: 12, approved: 8, rejected: 2, pending: 2 },
    { month: 'Feb', applications: 15, approved: 10, rejected: 3, pending: 2 },
    { month: 'Mar', applications: 18, approved: 14, rejected: 2, pending: 2 },
    { month: 'Apr', applications: 14, approved: 11, rejected: 1, pending: 2 },
    { month: 'May', applications: 16, approved: 13, rejected: 2, pending: 1 },
    { month: 'Jun', applications: 20, approved: 16, rejected: 2, pending: 2 }
  ]

  const categoryDistribution = [
    { category: 'IT Services', count: 12, percentage: 27 },
    { category: 'Raw Materials', count: 8, percentage: 18 },
    { category: 'Logistics', count: 10, percentage: 22 },
    { category: 'Professional Services', count: 6, percentage: 13 },
    { category: 'Components', count: 5, percentage: 11 },
    { category: 'Others', count: 4, percentage: 9 }
  ]

  const onboardingFunnel = [
    { stage: 'Applications', value: 100, fill: '#3B82F6' },
    { stage: 'Screening', value: 85, fill: '#10B981' },
    { stage: 'Documentation', value: 70, fill: '#F59E0B' },
    { stage: 'Verification', value: 60, fill: '#8B5CF6' },
    { stage: 'Approval', value: 50, fill: '#EC4899' },
    { stage: 'Completed', value: 45, fill: '#14B8A6' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'approval': return 'bg-blue-100 text-blue-700'
      case 'verification': return 'bg-purple-100 text-purple-700'
      case 'documentation': return 'bg-amber-100 text-amber-700'
      case 'screening': return 'bg-yellow-100 text-yellow-700'
      case 'new': return 'bg-gray-100 text-gray-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-blue-600" />
              Supplier Onboarding Portal
            </h1>
            <p className="text-gray-600 mt-2">Streamlined supplier registration and verification process</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowNewApplication(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total Applications</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onboardingMetrics.totalApplications}</div>
            <div className="text-sm text-gray-600">This quarter</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-600 text-sm font-medium">In Progress</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onboardingMetrics.inProgress}</div>
            <div className="text-sm text-orange-600">5 urgent</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onboardingMetrics.completed}</div>
            <div className="text-sm text-gray-600">This month</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-600 text-sm font-medium">Rejected</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onboardingMetrics.rejected}</div>
            <div className="text-sm text-gray-600">11% rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Avg Time</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onboardingMetrics.avgTime}d</div>
            <div className="text-sm text-green-600">↓ 2 days</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-600 text-sm font-medium">Success Rate</span>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onboardingMetrics.successRate}%</div>
            <div className="text-sm text-green-600">↑ 5%</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'applications', 'process', 'documents', 'verification', 'analytics'].map((tab) => (
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
              {/* Onboarding Funnel */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Funnel</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={onboardingFunnel}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>

              {/* Trend Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={onboardingTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Area type="monotone" dataKey="applications" stackId="1" stroke="#3B82F6" fill="#DBEAFE" name="Applications" />
                      <Area type="monotone" dataKey="approved" stackId="2" stroke="#10B981" fill="#D1FAE5" name="Approved" />
                      <Area type="monotone" dataKey="rejected" stackId="3" stroke="#EF4444" fill="#FEE2E2" name="Rejected" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                </div>
                <div className="p-4 space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{app.companyName}</div>
                          <div className="text-sm text-gray-600">{app.category} • {app.contactName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Progress</div>
                          <div className="font-medium">{app.progress}%</div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>New</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Rejected</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Application ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Progress</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-blue-600">{app.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{app.companyName}</div>
                            <div className="text-sm text-gray-500">Applied: {app.submittedDate}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-gray-900">{app.contactName}</div>
                            <div className="text-sm text-gray-500">{app.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{app.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${app.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{app.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            app.priority === 'high' ? 'bg-red-100 text-red-700' :
                            app.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {app.priority}
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
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">Comment</span>
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

          {activeTab === 'process' && (
            <div className="space-y-6">
              {/* Onboarding Process Steps */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Process</h3>
                <div className="relative">
                  {onboardingSteps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                      {index !== onboardingSteps.length - 1 && (
                        <div className="absolute top-10 left-6 bottom-0 w-0.5 bg-gray-300"></div>
                      )}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500 text-white' :
                        step.status === 'current' ? 'bg-blue-500 text-white animate-pulse' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : step.status === 'current' ? (
                          <Clock className="w-6 h-6" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {step.title}
                              {step.required && <span className="ml-2 text-red-500">*</span>}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            {step.documents && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {step.documents.map((doc) => (
                                  <span key={doc} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                                    <FileText className="w-3 h-3" />
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {step.completedDate && (
                            <span className="text-sm text-gray-500">Completed: {step.completedDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Configuration */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto-approval Threshold</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Low Risk (Score {'>='} 80)</option>
                      <option>Medium Risk (Score {'>='} 60)</option>
                      <option>High Risk (Manual Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Expiry Alert (days)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-700">Send automated status updates to applicants</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm text-gray-700">Require manager approval for high-risk suppliers</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm text-gray-700">Enable fast-track for preferred categories</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Requirements */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-3">
                  {requiredDocuments.map((doc) => (
                    <div key={doc.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            doc.status === 'verified' ? 'bg-green-100 text-green-600' :
                            doc.status === 'uploaded' ? 'bg-blue-100 text-blue-600' :
                            doc.status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {doc.name}
                              {doc.required && <span className="ml-1 text-red-500">*</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              Type: {doc.type}
                              {doc.uploadedDate && ` • Uploaded: ${doc.uploadedDate}`}
                              {doc.expiryDate && ` • Expires: ${doc.expiryDate}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                            doc.status === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                            doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {doc.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {doc.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {doc.status}
                          </span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            {doc.status === 'pending' ? (
                              <Upload className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Upload Area */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Select Files
                </button>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              {/* Verification Checklist */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Checklist</h3>
                <div className="space-y-3">
                  {[
                    { item: 'Business Registration Verified', status: 'completed', verifiedBy: 'John Smith', date: '2024-02-12' },
                    { item: 'Financial Stability Check', status: 'completed', verifiedBy: 'Sarah Johnson', date: '2024-02-13' },
                    { item: 'Reference Check (3 references)', status: 'in_progress', assignedTo: 'Mike Johnson' },
                    { item: 'Site Visit / Virtual Inspection', status: 'pending' },
                    { item: 'Compliance & Certification Review', status: 'completed', verifiedBy: 'Lisa Wong', date: '2024-02-14' },
                    { item: 'Risk Assessment Complete', status: 'pending' },
                    { item: 'Management Approval', status: 'pending' }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          check.status === 'completed' ? 'bg-green-500 text-white' :
                          check.status === 'in_progress' ? 'bg-blue-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {check.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : check.status === 'in_progress' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{check.item}</div>
                          {check.verifiedBy && (
                            <div className="text-sm text-gray-600">Verified by: {check.verifiedBy} • {check.date}</div>
                          )}
                          {check.assignedTo && (
                            <div className="text-sm text-gray-600">Assigned to: {check.assignedTo}</div>
                          )}
                        </div>
                      </div>
                      {check.status !== 'completed' && (
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                          {check.status === 'in_progress' ? 'Complete' : 'Start'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">72</div>
                    <div className="text-sm text-gray-600 mt-1">Overall Score</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">Medium</div>
                    <div className="text-sm text-gray-600 mt-1">Risk Level</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">B+</div>
                    <div className="text-sm text-gray-600 mt-1">Credit Rating</div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Financial Stability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operational Capability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }} />
                      </div>
                      <span className="text-sm font-medium">70%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance History</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
                      </div>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time by Stage</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { stage: 'Application', days: 0.5 },
                      { stage: 'Screening', days: 1.5 },
                      { stage: 'Documentation', days: 2.5 },
                      { stage: 'Verification', days: 3 },
                      { stage: 'Approval', days: 1 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="stage" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Bar dataKey="days" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate by Category</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" data={[
                      { name: 'IT Services', value: 92, fill: '#3B82F6' },
                      { name: 'Raw Materials', value: 85, fill: '#10B981' },
                      { name: 'Logistics', value: 78, fill: '#F59E0B' },
                      { name: 'Components', value: 88, fill: '#8B5CF6' }
                    ]}>
                      <RadialBar background dataKey="value" />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { metric: 'Average processing time reduced by 25%', impact: 'positive' },
                    { metric: '15% increase in first-time approval rate', impact: 'positive' },
                    { metric: 'Documentation bottleneck at verification stage', impact: 'negative' },
                    { metric: '92% supplier satisfaction with onboarding process', impact: 'positive' }
                  ].map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {insight.impact === 'positive' ? (
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      )}
                      <span className="text-sm text-gray-700">{insight.metric}</span>
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