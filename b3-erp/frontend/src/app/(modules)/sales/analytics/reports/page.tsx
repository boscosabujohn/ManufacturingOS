'use client'

import { useState } from 'react'
import { ArrowLeft, FileText, Download, Calendar, Filter, TrendingUp, DollarSign, Package, Users, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Report {
  id: string
  name: string
  type: 'sales' | 'product' | 'customer' | 'inventory' | 'financial'
  description: string
  period: string
  generatedDate: string
  generatedBy: string
  fileSize: string
  format: 'PDF' | 'Excel' | 'CSV'
  keyMetrics: {
    label: string
    value: string
  }[]
  status: 'ready' | 'generating' | 'scheduled'
}

export default function ReportsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  const [reports] = useState<Report[]>([
    {
      id: 'REP-001',
      name: 'Monthly Kitchen Products Sales Report',
      type: 'sales',
      description: 'Comprehensive sales analysis for all kitchen products including revenue, orders, and trends',
      period: 'October 2025',
      generatedDate: '2025-10-20',
      generatedBy: 'Sales Manager',
      fileSize: '2.4 MB',
      format: 'PDF',
      keyMetrics: [
        { label: 'Total Revenue', value: '₹5.12Cr' },
        { label: 'Total Orders', value: '325' },
        { label: 'Growth', value: '+18.5%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-002',
      name: 'Kitchen Sinks Product Performance',
      type: 'product',
      description: 'Detailed analysis of kitchen sink sales, inventory levels, and customer preferences',
      period: 'Q3 2025',
      generatedDate: '2025-10-15',
      generatedBy: 'Product Manager',
      fileSize: '1.8 MB',
      format: 'Excel',
      keyMetrics: [
        { label: 'Units Sold', value: '1,245' },
        { label: 'Revenue', value: '₹1.56Cr' },
        { label: 'Market Share', value: '23%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-003',
      name: 'Top 50 Kitchen Products Customers Report',
      type: 'customer',
      description: 'Customer segmentation and purchasing patterns for kitchen products',
      period: 'October 2025',
      generatedDate: '2025-10-18',
      generatedBy: 'CRM Manager',
      fileSize: '3.1 MB',
      format: 'PDF',
      keyMetrics: [
        { label: 'Active Customers', value: '234' },
        { label: 'Avg Order Value', value: '₹1.58L' },
        { label: 'Repeat Rate', value: '67%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-004',
      name: 'Kitchen Appliances Inventory Analysis',
      type: 'inventory',
      description: 'Stock levels, turnover rates, and reorder recommendations for kitchen appliances',
      period: 'October 2025',
      generatedDate: '2025-10-19',
      generatedBy: 'Inventory Manager',
      fileSize: '1.5 MB',
      format: 'Excel',
      keyMetrics: [
        { label: 'In Stock', value: '2,456 units' },
        { label: 'Low Stock', value: '23 items' },
        { label: 'Turnover', value: '8.5x' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-005',
      name: 'Quarterly Kitchen Products Financial Summary',
      type: 'financial',
      description: 'Revenue, costs, margins, and profitability analysis for kitchen product line',
      period: 'Q3 2025',
      generatedDate: '2025-10-10',
      generatedBy: 'Finance Manager',
      fileSize: '4.2 MB',
      format: 'PDF',
      keyMetrics: [
        { label: 'Total Revenue', value: '₹14.5Cr' },
        { label: 'Gross Margin', value: '42%' },
        { label: 'Net Profit', value: '₹3.8Cr' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-006',
      name: 'Cookware Sales Performance Report',
      type: 'product',
      description: 'Sales trends, customer feedback, and market analysis for cookware products',
      period: 'September 2025',
      generatedDate: '2025-10-05',
      generatedBy: 'Product Manager',
      fileSize: '2.1 MB',
      format: 'Excel',
      keyMetrics: [
        { label: 'Units Sold', value: '3,456' },
        { label: 'Revenue', value: '₹0.99Cr' },
        { label: 'Growth', value: '-5.2%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-007',
      name: 'Regional Kitchen Products Sales Comparison',
      type: 'sales',
      description: 'Comparative analysis of kitchen product sales across North, South, East, and West regions',
      period: 'Q3 2025',
      generatedDate: '2025-10-12',
      generatedBy: 'Regional Manager',
      fileSize: '3.5 MB',
      format: 'PDF',
      keyMetrics: [
        { label: 'Best Region', value: 'South India' },
        { label: 'Total Revenue', value: '₹13.9Cr' },
        { label: 'Avg Growth', value: '+13.3%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-008',
      name: 'Kitchen Faucets Customer Satisfaction Survey',
      type: 'customer',
      description: 'Customer feedback, ratings, and satisfaction scores for kitchen faucet products',
      period: 'October 2025',
      generatedDate: '2025-10-17',
      generatedBy: 'Quality Manager',
      fileSize: '1.2 MB',
      format: 'CSV',
      keyMetrics: [
        { label: 'Responses', value: '456' },
        { label: 'Avg Rating', value: '4.3/5' },
        { label: 'NPS Score', value: '67' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-009',
      name: 'Weekly Kitchen Products Sales Dashboard',
      type: 'sales',
      description: 'Real-time sales metrics, order tracking, and performance indicators',
      period: 'Week of Oct 14-20, 2025',
      generatedDate: '2025-10-20',
      generatedBy: 'Auto-Generated',
      fileSize: '0.8 MB',
      format: 'PDF',
      keyMetrics: [
        { label: 'Weekly Revenue', value: '₹1.28Cr' },
        { label: 'Orders', value: '78' },
        { label: 'Growth', value: '+12%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-010',
      name: 'Modular Kitchen Cabinet Sales Forecast',
      type: 'product',
      description: 'Sales projections and demand forecasting for modular kitchen cabinets',
      period: 'Q4 2025 Forecast',
      generatedDate: '2025-10-16',
      generatedBy: 'Analytics Team',
      fileSize: '2.7 MB',
      format: 'Excel',
      keyMetrics: [
        { label: 'Projected Units', value: '1,890' },
        { label: 'Projected Revenue', value: '₹4.7Cr' },
        { label: 'Confidence', value: '87%' }
      ],
      status: 'ready'
    },
    {
      id: 'REP-011',
      name: 'Annual Kitchen Products Summary 2025',
      type: 'sales',
      description: 'Year-end comprehensive report covering all aspects of kitchen products business',
      period: 'Jan-Dec 2025',
      generatedDate: 'Scheduled',
      generatedBy: 'Auto-Scheduled',
      fileSize: '-',
      format: 'PDF',
      keyMetrics: [
        { label: 'Status', value: 'Scheduled' },
        { label: 'Generation Date', value: 'Jan 1, 2026' },
        { label: 'Type', value: 'Annual' }
      ],
      status: 'scheduled'
    },
    {
      id: 'REP-012',
      name: 'Customer Retention Analysis - Kitchen Products',
      type: 'customer',
      description: 'Analysis of customer loyalty, churn rates, and retention strategies',
      period: 'October 2025',
      generatedDate: 'In Progress',
      generatedBy: 'CRM Manager',
      fileSize: '-',
      format: 'Excel',
      keyMetrics: [
        { label: 'Status', value: 'Generating' },
        { label: 'Progress', value: '68%' },
        { label: 'ETA', value: '2 hours' }
      ],
      status: 'generating'
    }
  ])

  const reportTypes = ['all', 'sales', 'product', 'customer', 'inventory', 'financial']
  const periods = ['all', 'weekly', 'monthly', 'quarterly', 'annual']

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'product':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'customer':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inventory':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'financial':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'generating':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getFormatIcon = (format: string) => {
    return format
  }

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesPeriod = selectedPeriod === 'all' || report.period.toLowerCase().includes(selectedPeriod)
    return matchesType && matchesPeriod
  })

  const stats = {
    totalReports: reports.filter(r => r.status === 'ready').length,
    generatingReports: reports.filter(r => r.status === 'generating').length,
    scheduledReports: reports.filter(r => r.status === 'scheduled').length,
    thisMonth: reports.filter(r => r.period.includes('October 2025')).length
  }

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
            <p className="text-sm text-gray-600 mt-1">Generate and download sales analytics reports</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Ready Reports</p>
              <p className="text-3xl font-bold mt-1">{stats.totalReports}</p>
              <p className="text-xs text-blue-100 mt-1">Available to download</p>
            </div>
            <FileText className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-100">Generating</p>
              <p className="text-3xl font-bold mt-1">{stats.generatingReports}</p>
              <p className="text-xs text-yellow-100 mt-1">In progress</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Scheduled</p>
              <p className="text-3xl font-bold mt-1">{stats.scheduledReports}</p>
              <p className="text-xs text-purple-100 mt-1">Auto-generate</p>
            </div>
            <Calendar className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">This Month</p>
              <p className="text-3xl font-bold mt-1">{stats.thisMonth}</p>
              <p className="text-xs text-green-100 mt-1">October reports</p>
            </div>
            <FileText className="h-10 w-10 text-green-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Report Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {periods.map(period => (
                <option key={period} value={period}>
                  {period === 'all' ? 'All Periods' : period.charAt(0).toUpperCase() + period.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>

              {/* Type and Status Badges */}
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(report.type)}`}>
                  {report.type.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                  {report.status.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
                  {getFormatIcon(report.format)}
                </span>
              </div>

              {/* Period */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-700">Period</p>
                    <p className="font-semibold text-blue-900">{report.period}</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-3 font-medium">Key Metrics</p>
                <div className="grid grid-cols-3 gap-2">
                  {report.keyMetrics.map((metric, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
                      <p className="font-semibold text-gray-900 text-sm">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="mb-4 text-sm space-y-1">
                <p className="text-gray-600">Generated: <span className="font-medium text-gray-900">{report.generatedDate}</span></p>
                <p className="text-gray-600">Generated by: <span className="font-medium text-gray-900">{report.generatedBy}</span></p>
                {report.fileSize !== '-' && (
                  <p className="text-gray-600">File size: <span className="font-medium text-gray-900">{report.fileSize}</span></p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {report.status === 'ready' && (
                  <>
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </>
                )}
                {report.status === 'generating' && (
                  <button className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg cursor-not-allowed" disabled>
                    Generating... {report.keyMetrics[1]?.value}
                  </button>
                )}
                {report.status === 'scheduled' && (
                  <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                    View Schedule
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reports found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
