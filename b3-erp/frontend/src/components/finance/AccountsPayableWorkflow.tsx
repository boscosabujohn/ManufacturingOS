'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard, DollarSign, Calendar, Clock, CheckCircle, AlertTriangle,
  Users, FileText, Upload, Download, Search, Filter, RefreshCw, Plus,
  Eye, Edit, Trash2, MoreHorizontal, ArrowRight, ArrowUpRight, ArrowDownRight,
  Building, Package, Target, Activity, Bell, Settings, Star, Send,
  ThumbsUp, ThumbsDown, MessageSquare, Paperclip, Mail, Phone,
  ChevronDown, ChevronUp, Play, Pause, RotateCcw, X, Check
} from 'lucide-react';
import {
  LineChart, AreaChart, BarChart, PieChart as RechartsPieChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, Bar, Line, Cell
} from 'recharts';

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  paymentTerms: string;
  defaultAccount: string;
  taxId: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface PayableInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  purchaseOrder?: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  status: 'pending_approval' | 'approved' | 'rejected' | 'paid' | 'partially_paid' | 'disputed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  glAccount: string;
  costCenter: string;
  department: string;
  attachments: string[];
  approvalHistory: ApprovalStep[];
  currentApprover?: string;
}

interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverName: string;
  approverRole: string;
  approverEmail: string;
  action: 'pending' | 'approved' | 'rejected' | 'delegated';
  comments?: string;
  timestamp?: string;
  delegatedTo?: string;
  threshold?: number;
}

interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    vendor?: string[];
    department?: string[];
    glAccount?: string[];
    costCenter?: string[];
  };
  approvers: ApprovalStep[];
  isActive: boolean;
  priority: number;
}

interface PaymentBatch {
  id: string;
  batchNumber: string;
  paymentDate: string;
  paymentMethod: 'ach' | 'wire' | 'check' | 'card';
  totalAmount: number;
  invoiceCount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'processed' | 'failed';
  approvedBy?: string;
  processedBy?: string;
  bankAccount: string;
  invoices: string[];
}

export default function AccountsPayableWorkflow() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PayableInvoice | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Mock data for AP workflow
  const apSummary = {
    totalPayables: 5600000,
    pendingApprovals: 1200000,
    overdue: 450000,
    overduePercentage: 8.0,
    averageDaysPayable: 28,
    discountsAvailable: 125000,
    discountsTaken: 89000,
    paymentsThisMonth: 3200000,
    invoicesCount: {
      pending: 45,
      approved: 89,
      paid: 234,
      overdue: 12
    },
    approvalBottlenecks: 3,
    processingTime: 4.2
  };

  const apAgingBuckets = [
    { period: 'Current (0-30)', amount: 4100000, percentage: 73.2, count: 89, color: '#10B981' },
    { period: '31-60 days', amount: 900000, percentage: 16.1, count: 34, color: '#F59E0B' },
    { period: '61-90 days', amount: 400000, percentage: 7.1, count: 18, color: '#EF4444' },
    { period: '91+ days', amount: 200000, percentage: 3.6, count: 8, color: '#7C2D12' }
  ];

  const pendingInvoices: PayableInvoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-SUP-2024-001',
      vendorId: 'v1',
      vendorName: 'Manufacturing Supplies Co.',
      purchaseOrder: 'PO-2024-0445',
      invoiceDate: '2024-10-15',
      dueDate: '2024-11-14',
      amount: 125000,
      taxAmount: 12500,
      discountAmount: 2500,
      netAmount: 135000,
      status: 'pending_approval',
      priority: 'high',
      description: 'Raw materials for production line',
      glAccount: '5000-001',
      costCenter: 'CC-PROD-01',
      department: 'Production',
      attachments: ['invoice.pdf', 'delivery_receipt.pdf'],
      approvalHistory: [
        {
          id: 'a1',
          stepNumber: 1,
          approverName: 'Sarah Johnson',
          approverRole: 'Department Manager',
          approverEmail: 'sarah.johnson@company.com',
          action: 'approved',
          comments: 'Invoice matches PO and delivery receipt',
          timestamp: '2024-10-16T10:30:00Z'
        },
        {
          id: 'a2',
          stepNumber: 2,
          approverName: 'Michael Chen',
          approverRole: 'Finance Manager',
          approverEmail: 'michael.chen@company.com',
          action: 'pending',
          threshold: 100000
        }
      ],
      currentApprover: 'Michael Chen'
    },
    {
      id: '2',
      invoiceNumber: 'INV-SUP-2024-002',
      vendorId: 'v2',
      vendorName: 'Office Equipment Plus',
      invoiceDate: '2024-10-17',
      dueDate: '2024-11-16',
      amount: 45000,
      taxAmount: 4500,
      discountAmount: 900,
      netAmount: 48600,
      status: 'pending_approval',
      priority: 'medium',
      description: 'Office furniture and equipment',
      glAccount: '1400-002',
      costCenter: 'CC-ADMIN-01',
      department: 'Administration',
      attachments: ['invoice.pdf'],
      approvalHistory: [
        {
          id: 'a3',
          stepNumber: 1,
          approverName: 'Jennifer Liu',
          approverRole: 'Department Manager',
          approverEmail: 'jennifer.liu@company.com',
          action: 'pending',
          threshold: 50000
        }
      ],
      currentApprover: 'Jennifer Liu'
    }
  ];

  const approvalRules: ApprovalRule[] = [
    {
      id: 'r1',
      name: 'Standard Approval - Under $50K',
      description: 'Single approval required for invoices under $50,000',
      conditions: {
        maxAmount: 50000
      },
      approvers: [
        {
          id: 'a1',
          stepNumber: 1,
          approverName: 'Department Manager',
          approverRole: 'Department Manager',
          approverEmail: '',
          action: 'pending',
          threshold: 50000
        }
      ],
      isActive: true,
      priority: 1
    },
    {
      id: 'r2',
      name: 'Enhanced Approval - $50K to $100K',
      description: 'Two-level approval for invoices between $50K and $100K',
      conditions: {
        minAmount: 50000,
        maxAmount: 100000
      },
      approvers: [
        {
          id: 'a1',
          stepNumber: 1,
          approverName: 'Department Manager',
          approverRole: 'Department Manager',
          approverEmail: '',
          action: 'pending',
          threshold: 50000
        },
        {
          id: 'a2',
          stepNumber: 2,
          approverName: 'Finance Manager',
          approverRole: 'Finance Manager',
          approverEmail: '',
          action: 'pending',
          threshold: 100000
        }
      ],
      isActive: true,
      priority: 2
    },
    {
      id: 'r3',
      name: 'Executive Approval - Over $100K',
      description: 'Three-level approval for invoices over $100K',
      conditions: {
        minAmount: 100000
      },
      approvers: [
        {
          id: 'a1',
          stepNumber: 1,
          approverName: 'Department Manager',
          approverRole: 'Department Manager',
          approverEmail: '',
          action: 'pending'
        },
        {
          id: 'a2',
          stepNumber: 2,
          approverName: 'Finance Manager',
          approverRole: 'Finance Manager',
          approverEmail: '',
          action: 'pending'
        },
        {
          id: 'a3',
          stepNumber: 3,
          approverName: 'CFO',
          approverRole: 'Chief Financial Officer',
          approverEmail: '',
          action: 'pending',
          threshold: 100000
        }
      ],
      isActive: true,
      priority: 3
    }
  ];

  const paymentBatches: PaymentBatch[] = [
    {
      id: 'b1',
      batchNumber: 'BATCH-2024-001',
      paymentDate: '2024-10-25',
      paymentMethod: 'ach',
      totalAmount: 1250000,
      invoiceCount: 15,
      status: 'pending_approval',
      bankAccount: 'Primary Checking - ****1234',
      invoices: ['1', '2', '3']
    },
    {
      id: 'b2',
      batchNumber: 'BATCH-2024-002',
      paymentDate: '2024-10-22',
      paymentMethod: 'wire',
      totalAmount: 850000,
      invoiceCount: 8,
      status: 'processed',
      approvedBy: 'Michael Chen',
      processedBy: 'System Auto',
      bankAccount: 'Wire Transfer Account - ****5678',
      invoices: ['4', '5', '6']
    }
  ];

  const apTrends = [
    { month: 'Jan', total: 4800000, paid: 4600000, overdue: 200000, avgDays: 26 },
    { month: 'Feb', total: 5100000, paid: 4950000, overdue: 150000, avgDays: 25 },
    { month: 'Mar', total: 5200000, paid: 5000000, overdue: 200000, avgDays: 27 },
    { month: 'Apr', total: 5350000, paid: 5150000, overdue: 200000, avgDays: 28 },
    { month: 'May', total: 5400000, paid: 5200000, overdue: 200000, avgDays: 29 },
    { month: 'Jun', total: 5500000, paid: 5300000, overdue: 200000, avgDays: 28 },
    { month: 'Jul', total: 5450000, paid: 5250000, overdue: 200000, avgDays: 27 },
    { month: 'Aug', total: 5600000, paid: 5350000, overdue: 250000, avgDays: 29 },
    { month: 'Sep', total: 5750000, paid: 5500000, overdue: 250000, avgDays: 30 },
    { month: 'Oct', total: 5600000, paid: 5150000, overdue: 450000, avgDays: 28 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partially_paid': return 'bg-orange-100 text-orange-800';
      case 'disputed': return 'bg-purple-100 text-purple-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusIcon = (action: string) => {
    switch (action) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <X className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'delegated': return <ArrowRight className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleApproveInvoice = (invoice: PayableInvoice, comments: string) => {
    // Handle approval logic
    console.log('Approving invoice:', invoice.id, 'Comments:', comments);
    setShowApprovalModal(false);
  };

  const handleRejectInvoice = (invoice: PayableInvoice, comments: string) => {
    // Handle rejection logic
    console.log('Rejecting invoice:', invoice.id, 'Comments:', comments);
    setShowApprovalModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Payable Workflow</h1>
            <p className="text-gray-600">
              Advanced AP processing with intelligent approval routing
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Upload className="h-4 w-4 mr-2" />
              Upload Invoice
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'approvals', label: 'Pending Approvals', icon: Clock, badge: apSummary.invoicesCount.pending },
              { id: 'invoices', label: 'All Invoices', icon: FileText },
              { id: 'batches', label: 'Payment Batches', icon: CreditCard },
              { id: 'rules', label: 'Approval Rules', icon: Settings },
              { id: 'reports', label: 'Reports', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-8 w-8 text-blue-200" />
            <ArrowDownRight className="h-6 w-6 text-blue-200" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Payables</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(apSummary.totalPayables)}</p>
          <p className="text-blue-200 text-sm">
            {formatPercentage(apSummary.overduePercentage)} overdue
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-yellow-200" />
            <Bell className="h-6 w-6 text-yellow-200" />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Pending Approvals</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(apSummary.pendingApprovals)}</p>
          <p className="text-yellow-200 text-sm">
            {apSummary.invoicesCount.pending} invoices waiting
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-green-200" />
            <Star className="h-6 w-6 text-green-200" />
          </div>
          <p className="text-green-100 text-sm mb-1">Discounts Available</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(apSummary.discountsAvailable)}</p>
          <p className="text-green-200 text-sm">
            {formatPercentage((apSummary.discountsTaken / apSummary.discountsAvailable) * 100)} captured
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-purple-200" />
            <ArrowUpRight className="h-6 w-6 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Avg Processing Time</p>
          <p className="text-3xl font-bold mb-2">{apSummary.processingTime} days</p>
          <p className="text-purple-200 text-sm">
            {apSummary.approvalBottlenecks} bottlenecks identified
          </p>
        </div>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === 'dashboard' && (
        <div className="space-y-6">
          {/* AP Trends Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Accounts Payable Trends</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="current-month">Current Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="current-year">Current Year</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={apTrends}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), name]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Total Payables"
                  />
                  <Area
                    type="monotone"
                    dataKey="paid"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorPaid)"
                    name="Payments Made"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDays"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="Avg Days Payable"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aging Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Payables Aging</h4>
              <div className="space-y-3">
                {apAgingBuckets.map((bucket, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: bucket.color }}></div>
                      <span className="text-sm text-gray-600">{bucket.period}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(bucket.amount)}</p>
                      <p className="text-xs text-gray-500">{bucket.count} invoices</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-200 pl-3">
                  <p className="text-sm font-medium text-gray-900">Invoice Approved</p>
                  <p className="text-xs text-gray-600">INV-SUP-2024-003 - $45,000</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="border-l-4 border-yellow-200 pl-3">
                  <p className="text-sm font-medium text-gray-900">Pending Approval</p>
                  <p className="text-xs text-gray-600">INV-SUP-2024-001 - $135,000</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
                <div className="border-l-4 border-blue-200 pl-3">
                  <p className="text-sm font-medium text-gray-900">Payment Processed</p>
                  <p className="text-xs text-gray-600">Batch-2024-002 - $850,000</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>

            {/* Approval Bottlenecks */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Approval Bottlenecks</h4>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-red-900">Michael Chen</p>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">8 pending</span>
                  </div>
                  <p className="text-xs text-red-700">Finance Manager - $1.2M total</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-yellow-900">Jennifer Liu</p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">5 pending</span>
                  </div>
                  <p className="text-xs text-yellow-700">Department Manager - $485K total</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-orange-900">David Wilson</p>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">3 pending</span>
                  </div>
                  <p className="text-xs text-orange-700">CFO - $750K total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'approvals' && (
        <div className="space-y-6">
          {/* Pending Approvals List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Approver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{invoice.vendorName}</p>
                          {invoice.purchaseOrder && (
                            <p className="text-xs text-gray-500">PO: {invoice.purchaseOrder}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.netAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(invoice.priority)}`}>
                          {invoice.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {invoice.currentApprover}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {invoice.approvalHistory.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                              {getApprovalStatusIcon(step.action)}
                              {index < invoice.approvalHistory.length - 1 && (
                                <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowApprovalModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowApprovalModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Comment">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Workflow Visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Approval Workflow Status</h3>
            <div className="space-y-6">
              {pendingInvoices.slice(0, 2).map((invoice) => (
                <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-gray-600">{invoice.vendorName} - {formatCurrency(invoice.netAmount)}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {invoice.approvalHistory.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.action === 'approved' ? 'bg-green-100' :
                            step.action === 'rejected' ? 'bg-red-100' :
                            step.action === 'pending' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            {getApprovalStatusIcon(step.action)}
                          </div>
                          <p className="text-xs text-gray-600 mt-2 text-center">{step.approverRole}</p>
                          <p className="text-xs font-medium text-gray-900">{step.approverName}</p>
                          {step.timestamp && (
                            <p className="text-xs text-gray-500">{new Date(step.timestamp).toLocaleDateString()}</p>
                          )}
                        </div>
                        {index < invoice.approvalHistory.length - 1 && (
                          <div className="flex-1 h-0.5 bg-gray-300"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowApprovalModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Invoice Approval</h2>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Invoice Number</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedInvoice.netAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Vendor</p>
                      <p className="text-gray-900">{selectedInvoice.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                    <p className="text-gray-900">{selectedInvoice.description}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Comments</p>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add your approval comments..."
                    />
                  </div>

                  {selectedInvoice.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                      <div className="flex space-x-2">
                        {selectedInvoice.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <Paperclip className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectInvoice(selectedInvoice, '')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveInvoice(selectedInvoice, '')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}