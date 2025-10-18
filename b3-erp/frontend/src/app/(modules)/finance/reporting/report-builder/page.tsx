'use client'

import { useState } from 'react'
import { FileText, Plus, Download, Eye, Edit, Trash2, Copy, Layout, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'financial_statements' | 'analytics' | 'compliance' | 'custom'
  reportType: 'table' | 'chart' | 'dashboard'
  dataSources: string[]
  columns: string[]
  filters: string[]
  groupBy: string[]
  createdBy: string
  createdDate: string
  lastModified: string
  executionCount: number
  status: 'draft' | 'published'
  scheduled: boolean
}

interface DataSource {
  id: string
  name: string
  type: 'table' | 'view' | 'query'
  category: string
  fields: number
  icon: any
}

export default function ReportBuilderPage() {
  const [reports] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Monthly P&L Statement',
      description: 'Comprehensive profit and loss statement with department breakdown',
      category: 'financial_statements',
      reportType: 'table',
      dataSources: ['General Ledger', 'Cost Centers'],
      columns: ['Account', 'Current Month', 'YTD', 'Budget', 'Variance'],
      filters: ['Date Range', 'Department', 'Cost Center'],
      groupBy: ['Account Category', 'Department'],
      createdBy: 'John Doe',
      createdDate: '2025-09-15',
      lastModified: '2025-10-10',
      executionCount: 48,
      status: 'published',
      scheduled: true
    },
    {
      id: '2',
      name: 'Cash Flow Analysis',
      description: 'Weekly cash flow projection with variance analysis',
      category: 'analytics',
      reportType: 'chart',
      dataSources: ['Bank Transactions', 'AR/AP', 'Budget'],
      columns: ['Week', 'Opening Balance', 'Receipts', 'Payments', 'Closing Balance'],
      filters: ['Date Range', 'Bank Account', 'Transaction Type'],
      groupBy: ['Week', 'Account'],
      createdBy: 'Jane Smith',
      createdDate: '2025-08-20',
      lastModified: '2025-10-15',
      executionCount: 156,
      status: 'published',
      scheduled: true
    },
    {
      id: '3',
      name: 'GST Reconciliation Report',
      description: 'GST transaction reconciliation with GSTR-2A matching',
      category: 'compliance',
      reportType: 'table',
      dataSources: ['Tax Transactions', 'GSTR-2A Data'],
      columns: ['Invoice No', 'Vendor', 'Amount', 'GST Amount', 'Match Status'],
      filters: ['Tax Period', 'Vendor', 'Match Status'],
      groupBy: ['Tax Type', 'Match Status'],
      createdBy: 'Robert Brown',
      createdDate: '2025-07-10',
      lastModified: '2025-10-01',
      executionCount: 24,
      status: 'published',
      scheduled: true
    },
    {
      id: '4',
      name: 'Customer Profitability Dashboard',
      description: 'Customer-wise revenue, cost, and profit margin analysis',
      category: 'analytics',
      reportType: 'dashboard',
      dataSources: ['Sales', 'Cost of Goods Sold', 'Operating Expenses'],
      columns: ['Customer', 'Revenue', 'Direct Cost', 'Allocated Cost', 'Profit', 'Margin %'],
      filters: ['Date Range', 'Customer', 'Product Line'],
      groupBy: ['Customer', 'Product Category'],
      createdBy: 'Sarah Wilson',
      createdDate: '2025-06-05',
      lastModified: '2025-10-12',
      executionCount: 92,
      status: 'published',
      scheduled: false
    },
    {
      id: '5',
      name: 'Fixed Assets Register',
      description: 'Complete fixed assets listing with depreciation details',
      category: 'financial_statements',
      reportType: 'table',
      dataSources: ['Fixed Assets', 'Depreciation Schedule'],
      columns: ['Asset Code', 'Description', 'Cost', 'Accumulated Dep', 'Book Value', 'Location'],
      filters: ['Asset Category', 'Location', 'Status'],
      groupBy: ['Asset Category', 'Department'],
      createdBy: 'Michael Chen',
      createdDate: '2025-05-18',
      lastModified: '2025-09-25',
      executionCount: 36,
      status: 'published',
      scheduled: false
    },
    {
      id: '6',
      name: 'Budget vs Actual Analysis (Draft)',
      description: 'Department-wise budget variance with drill-down capability',
      category: 'custom',
      reportType: 'dashboard',
      dataSources: ['Budget', 'Actuals', 'Forecast'],
      columns: ['Department', 'Budget', 'Actual', 'Variance', 'Forecast'],
      filters: ['Period', 'Department', 'Account Category'],
      groupBy: ['Department', 'Month'],
      createdBy: 'Emily Davis',
      createdDate: '2025-10-16',
      lastModified: '2025-10-17',
      executionCount: 3,
      status: 'draft',
      scheduled: false
    }
  ])

  const [dataSources] = useState<DataSource[]>([
    { id: '1', name: 'General Ledger', type: 'table', category: 'Accounting', fields: 15, icon: FileText },
    { id: '2', name: 'Accounts Receivable', type: 'view', category: 'AR/AP', fields: 12, icon: TrendingUp },
    { id: '3', name: 'Accounts Payable', type: 'view', category: 'AR/AP', fields: 12, icon: TrendingUp },
    { id: '4', name: 'Bank Transactions', type: 'table', category: 'Cash', fields: 10, icon: BarChart3 },
    { id: '5', name: 'Fixed Assets', type: 'table', category: 'Assets', fields: 18, icon: Layout },
    { id: '6', name: 'Budget', type: 'table', category: 'Budgeting', fields: 8, icon: PieChart },
    { id: '7', name: 'Tax Transactions', type: 'view', category: 'Tax', fields: 14, icon: FileText },
    { id: '8', name: 'Cost Centers', type: 'table', category: 'Costing', fields: 9, icon: BarChart3 }
  ])

  const [stats] = useState({
    totalReports: 24,
    publishedReports: 20,
    draftReports: 4,
    scheduledReports: 12,
    executionsThisMonth: 487
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial_statements': return 'bg-blue-100 text-blue-700'
      case 'analytics': return 'bg-purple-100 text-purple-700'
      case 'compliance': return 'bg-orange-100 text-orange-700'
      case 'custom': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'table': return <FileText className="h-5 w-5" />
      case 'chart': return <BarChart3 className="h-5 w-5" />
      case 'dashboard': return <Layout className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Custom Report Builder</h1>
            <p className="text-gray-600 mt-1">Drag-and-drop report designer with advanced analytics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700">
            <Plus className="h-5 w-5" />
            Create Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-sky-600" />
              <span className="text-sm text-gray-600">Total Reports</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Published</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.publishedReports}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Edit className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-gray-600">Draft</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.draftReports}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-600">Scheduled</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.scheduledReports}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Executions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.executionsThisMonth}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">My Reports</h2>
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getReportTypeIcon(report.reportType)}
                      <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                        {report.category.replace('_', ' ').toUpperCase()}
                      </span>
                      {report.scheduled && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          SCHEDULED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Data Sources:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.dataSources.map((ds, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs">
                          {ds}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Filters:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.filters.map((filter, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Created By</p>
                    <p className="text-sm font-medium text-gray-900">{report.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Last Modified</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(report.lastModified).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Executions</p>
                    <p className="text-sm font-medium text-gray-900">{report.executionCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Type</p>
                    <p className="text-sm font-medium text-gray-900">{report.reportType.toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Run Report
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Data Sources</h3>
              <div className="space-y-2">
                {dataSources.map((ds) => {
                  const IconComponent = ds.icon
                  return (
                    <div key={ds.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-sky-600" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{ds.name}</p>
                          <p className="text-xs text-gray-600">{ds.category} • {ds.fields} fields</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {ds.type.toUpperCase()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Report Builder Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Drag-and-drop interface for column selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Advanced filtering and grouping options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Multiple output formats (PDF, Excel, CSV)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Scheduled report generation and email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Chart types: Bar, Line, Pie, Scatter, Heatmap</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Formula builder for calculated fields</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Cross-module data integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">•</span>
                  <span>Role-based access control for reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
