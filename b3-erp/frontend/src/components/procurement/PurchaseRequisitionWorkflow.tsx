'use client'

import React, { useState } from 'react'
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  Package,
  Building2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Send,
  RefreshCw,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Briefcase,
  Tag,
  MapPin,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  CheckSquare,
  Settings,
  Copy,
  MoreVertical,
  Activity,
  Zap
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
  AreaChart,
  Area
} from 'recharts'

interface Requisition {
  id: string
  title: string
  requestor: string
  department: string
  date: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'ordered' | 'received'
  totalAmount: number
  items: number
  approvalLevel: number
  currentApprover: string
  category: string
  supplier?: string
}

interface RequisitionItem {
  id: string
  description: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  supplier?: string
  notes?: string
}

export default function PurchaseRequisitionWorkflow() {
  const [activeTab, setActiveTab] = useState('requisitions')
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewRequisition, setShowNewRequisition] = useState(false)

  // Mock data
  const requisitions: Requisition[] = [
    {
      id: 'PR-2024-001',
      title: 'IT Equipment for New Office',
      requestor: 'John Smith',
      department: 'IT',
      date: '2024-02-15',
      dueDate: '2024-03-01',
      priority: 'high',
      status: 'pending',
      totalAmount: 25000,
      items: 8,
      approvalLevel: 2,
      currentApprover: 'Sarah Johnson',
      category: 'IT Equipment'
    },
    {
      id: 'PR-2024-002',
      title: 'Raw Materials - Q2 Production',
      requestor: 'Mike Chen',
      department: 'Production',
      date: '2024-02-14',
      dueDate: '2024-03-15',
      priority: 'urgent',
      status: 'approved',
      totalAmount: 85000,
      items: 15,
      approvalLevel: 3,
      currentApprover: 'David Lee',
      category: 'Raw Materials',
      supplier: 'Global Suppliers Inc'
    },
    {
      id: 'PR-2024-003',
      title: 'Office Supplies Monthly Order',
      requestor: 'Lisa Wong',
      department: 'Admin',
      date: '2024-02-13',
      dueDate: '2024-02-28',
      priority: 'medium',
      status: 'ordered',
      totalAmount: 3500,
      items: 12,
      approvalLevel: 1,
      currentApprover: 'Tom Wilson',
      category: 'Office Supplies',
      supplier: 'Office Depot'
    },
    {
      id: 'PR-2024-004',
      title: 'Safety Equipment Renewal',
      requestor: 'Robert Taylor',
      department: 'Operations',
      date: '2024-02-12',
      dueDate: '2024-03-10',
      priority: 'high',
      status: 'pending',
      totalAmount: 15000,
      items: 20,
      approvalLevel: 2,
      currentApprover: 'Sarah Johnson',
      category: 'Safety Equipment'
    }
  ]

  const requisitionItems: RequisitionItem[] = [
    {
      id: 'ITEM-001',
      description: 'Laptop - Dell Latitude 5520',
      category: 'IT Equipment',
      quantity: 5,
      unit: 'units',
      unitPrice: 1200,
      totalPrice: 6000,
      supplier: 'Dell Direct',
      notes: '16GB RAM, 512GB SSD'
    },
    {
      id: 'ITEM-002',
      description: 'Monitor - 27" 4K Display',
      category: 'IT Equipment',
      quantity: 5,
      unit: 'units',
      unitPrice: 450,
      totalPrice: 2250,
      supplier: 'Tech Supplies Co',
      notes: 'USB-C connectivity required'
    },
    {
      id: 'ITEM-003',
      description: 'Office Chair - Ergonomic',
      category: 'Furniture',
      quantity: 10,
      unit: 'units',
      unitPrice: 350,
      totalPrice: 3500,
      supplier: 'Office Furniture Plus',
      notes: 'Lumbar support, adjustable height'
    }
  ]

  const approvalWorkflow = [
    { level: 1, role: 'Department Manager', threshold: 5000, approver: 'Tom Wilson', status: 'approved' },
    { level: 2, role: 'Finance Manager', threshold: 25000, approver: 'Sarah Johnson', status: 'pending' },
    { level: 3, role: 'CFO', threshold: 50000, approver: 'David Lee', status: 'waiting' },
    { level: 4, role: 'CEO', threshold: 100000, approver: 'Emily Chen', status: 'waiting' }
  ]

  const spendByCategory = [
    { category: 'IT Equipment', amount: 125000, requisitions: 24 },
    { category: 'Raw Materials', amount: 450000, requisitions: 18 },
    { category: 'Office Supplies', amount: 35000, requisitions: 52 },
    { category: 'Safety Equipment', amount: 65000, requisitions: 15 },
    { category: 'Professional Services', amount: 180000, requisitions: 8 },
    { category: 'Facilities', amount: 95000, requisitions: 12 }
  ]

  const requisitionTrend = [
    { month: 'Jan', submitted: 45, approved: 42, rejected: 3 },
    { month: 'Feb', submitted: 52, approved: 48, rejected: 4 },
    { month: 'Mar', submitted: 48, approved: 45, rejected: 3 },
    { month: 'Apr', submitted: 55, approved: 51, rejected: 4 },
    { month: 'May', submitted: 58, approved: 54, rejected: 4 },
    { month: 'Jun', submitted: 62, approved: 58, rejected: 4 }
  ]

  const cycleTimeData = [
    { stage: 'Submission', time: 0.5, color: '#3B82F6' },
    { stage: 'Manager Approval', time: 1.2, color: '#10B981' },
    { stage: 'Finance Review', time: 2.3, color: '#F59E0B' },
    { stage: 'Final Approval', time: 1.5, color: '#8B5CF6' },
    { stage: 'PO Creation', time: 0.8, color: '#EC4899' }
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
              Purchase Requisition Workflow
            </h1>
            <p className="text-gray-600 mt-2">Streamlined approval process for procurement requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowNewRequisition(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Requisition
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total Requisitions</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">234</div>
            <div className="text-sm text-gray-600">This month</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-600 text-sm font-medium">Pending Approval</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <div className="text-sm text-red-600">3 urgent</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Approved</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">196</div>
            <div className="text-sm text-green-600">95% approval rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Avg Cycle Time</span>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3.2d</div>
            <div className="text-sm text-green-600">↓ 18% vs last month</div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-600 text-sm font-medium">Total Value</span>
              <DollarSign className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">$1.8M</div>
            <div className="text-sm text-gray-600">Approved this month</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['requisitions', 'workflow', 'analytics', 'approvals', 'settings'].map((tab) => (
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
          {activeTab === 'requisitions' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requisitions..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="ordered">Ordered</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>

              {/* Requisitions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Requisition ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Requestor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requisitions.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-blue-600">{req.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{req.title}</div>
                            <div className="text-sm text-gray-500">{req.category} • {req.items} items</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{req.requestor}</div>
                            <div className="text-sm text-gray-500">{req.department}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">${req.totalAmount.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            req.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {req.priority === 'urgent' && <Zap className="w-3 h-3 mr-1" />}
                            {req.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === 'approved' ? 'bg-green-100 text-green-700' :
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            req.status === 'ordered' ? 'bg-blue-100 text-blue-700' :
                            req.status === 'received' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                            {req.status === 'pending' && <Clock className="w-3 h-3" />}
                            {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {req.status === 'ordered' && <ShoppingCart className="w-3 h-3" />}
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{req.dueDate}</span>
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

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              {/* Approval Workflow Visualization */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow Process</h3>
                <div className="relative">
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300"></div>
                  <div className="flex justify-between relative">
                    {approvalWorkflow.map((step, index) => (
                      <div key={step.level} className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                          step.status === 'approved' ? 'bg-green-500 text-white' :
                          step.status === 'pending' ? 'bg-yellow-500 text-white animate-pulse' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {step.status === 'approved' ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : step.status === 'pending' ? (
                            <Clock className="w-8 h-8" />
                          ) : (
                            <span className="text-lg font-bold">{step.level}</span>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <div className="font-medium text-gray-900">{step.role}</div>
                          <div className="text-sm text-gray-600">{step.approver}</div>
                          <div className="text-xs text-gray-500 mt-1">≤ ${(step.threshold / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cycle Time Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Cycle Time by Stage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cycleTimeData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="stage" type="category" stroke="#6B7280" />
                      <Tooltip
                        formatter={(value: number) => `${value} days`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                      />
                      <Bar dataKey="time" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisition Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={[
                          { name: 'Approved', value: 196, color: '#10B981' },
                          { name: 'Pending', value: 18, color: '#F59E0B' },
                          { name: 'Rejected', value: 8, color: '#EF4444' },
                          { name: 'Draft', value: 12, color: '#6B7280' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Approved', value: 196, color: '#10B981' },
                          { name: 'Pending', value: 18, color: '#F59E0B' },
                          { name: 'Rejected', value: 8, color: '#EF4444' },
                          { name: 'Draft', value: 12, color: '#6B7280' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Approval Rules */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Approval Rules & Thresholds</h3>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Threshold</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Approval Levels</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Auto-Approve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2">Office Supplies</td>
                        <td className="px-4 py-2">$1,000</td>
                        <td className="px-4 py-2">1 Level</td>
                        <td className="px-4 py-2">
                          <span className="text-green-600">✓ Under $500</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">IT Equipment</td>
                        <td className="px-4 py-2">$25,000</td>
                        <td className="px-4 py-2">2 Levels</td>
                        <td className="px-4 py-2">
                          <span className="text-gray-400">✗ Disabled</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Raw Materials</td>
                        <td className="px-4 py-2">$50,000</td>
                        <td className="px-4 py-2">3 Levels</td>
                        <td className="px-4 py-2">
                          <span className="text-gray-400">✗ Disabled</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Professional Services</td>
                        <td className="px-4 py-2">$100,000</td>
                        <td className="px-4 py-2">4 Levels</td>
                        <td className="px-4 py-2">
                          <span className="text-gray-400">✗ Disabled</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Requisition Trends */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisition Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={requisitionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Area type="monotone" dataKey="submitted" stackId="1" stroke="#3B82F6" fill="#DBEAFE" />
                    <Area type="monotone" dataKey="approved" stackId="2" stroke="#10B981" fill="#D1FAE5" />
                    <Area type="monotone" dataKey="rejected" stackId="3" stroke="#EF4444" fill="#FEE2E2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category Spend Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={spendByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip
                        formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                      />
                      <Bar dataKey="amount" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Approval Rate</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">On-Time Processing</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Budget Compliance</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">First-Time Approval</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Requestors */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Requestors</h3>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Requestor</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Department</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Requisitions</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Total Value</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Avg Cycle Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'John Smith', dept: 'IT', count: 24, value: 125000, cycle: 2.8 },
                        { name: 'Mike Chen', dept: 'Production', count: 18, value: 450000, cycle: 3.5 },
                        { name: 'Lisa Wong', dept: 'Admin', count: 52, value: 35000, cycle: 1.2 },
                        { name: 'Robert Taylor', dept: 'Operations', count: 15, value: 65000, cycle: 2.4 }
                      ].map((requestor) => (
                        <tr key={requestor.name}>
                          <td className="px-4 py-2 font-medium">{requestor.name}</td>
                          <td className="px-4 py-2">{requestor.dept}</td>
                          <td className="px-4 py-2">{requestor.count}</td>
                          <td className="px-4 py-2">${(requestor.value / 1000).toFixed(0)}K</td>
                          <td className="px-4 py-2">{requestor.cycle} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>

              {/* Approval Queue */}
              <div className="space-y-3">
                {requisitions.filter(req => req.status === 'pending').map((req) => (
                  <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-500">{req.id}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            req.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {req.priority === 'urgent' && <Zap className="w-3 h-3 mr-1" />}
                            {req.priority} priority
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{req.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {req.requestor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {req.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {req.dueDate}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Items ({req.items})</span>
                            <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Laptop - Dell Latitude 5520 x5</span>
                              <span className="font-medium">$6,000</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Monitor - 27" 4K Display x5</span>
                              <span className="font-medium">$2,250</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6">
                        <div className="text-right mb-3">
                          <div className="text-2xl font-bold text-gray-900">${req.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Total Amount</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Request Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Settings</h3>

              {/* Approval Matrix */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Approval Matrix Configuration</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Approval Threshold</label>
                      <input
                        type="number"
                        placeholder="500"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Escalation Time (hours)</label>
                      <input
                        type="number"
                        placeholder="48"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget Period</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Annually</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Priority</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Notification Settings</h4>
                </div>
                <div className="p-4 space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email notifications for new requisitions</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">SMS alerts for urgent approvals</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Daily summary reports</span>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Escalation alerts</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}