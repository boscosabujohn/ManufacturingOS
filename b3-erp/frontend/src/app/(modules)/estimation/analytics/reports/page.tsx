'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface Report {
  id: string
  name: string
  category: string
  description: string
  frequency: string
  lastGenerated: string
  format: string
  status: 'available' | 'generating' | 'scheduled'
  size: string
}

export default function EstimationAnalyticsReportsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [reports] = useState<Report[]>([
    {
      id: 'RPT-001',
      name: 'Monthly Estimation Summary',
      category: 'Summary Reports',
      description: 'Comprehensive monthly summary of all estimation activities',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01',
      format: 'PDF, Excel',
      status: 'available',
      size: '2.4 MB'
    },
    {
      id: 'RPT-002',
      name: 'Win Rate Analysis',
      category: 'Performance Reports',
      description: 'Detailed analysis of estimation win rates by category and value',
      frequency: 'Weekly',
      lastGenerated: '2025-10-18',
      format: 'PDF, Excel',
      status: 'available',
      size: '1.8 MB'
    },
    {
      id: 'RPT-003',
      name: 'Estimation Accuracy Report',
      category: 'Quality Reports',
      description: 'Comparison of estimated vs actual costs for completed projects',
      frequency: 'Quarterly',
      lastGenerated: '2025-10-01',
      format: 'PDF, Excel, PowerPoint',
      status: 'available',
      size: '3.2 MB'
    },
    {
      id: 'RPT-004',
      name: 'Estimator Performance',
      category: 'Team Reports',
      description: 'Individual estimator performance metrics and productivity analysis',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01',
      format: 'PDF, Excel',
      status: 'available',
      size: '1.5 MB'
    },
    {
      id: 'RPT-005',
      name: 'Category-wise Estimation Trends',
      category: 'Trend Analysis',
      description: 'Kitchen category trends, pricing patterns, and market insights',
      frequency: 'Monthly',
      lastGenerated: '2025-10-15',
      format: 'PDF, Excel',
      status: 'available',
      size: '2.1 MB'
    },
    {
      id: 'RPT-006',
      name: 'Conversion Funnel Report',
      category: 'Sales Reports',
      description: 'Estimation to order conversion analysis with bottleneck identification',
      frequency: 'Weekly',
      lastGenerated: '2025-10-18',
      format: 'PDF, Excel',
      status: 'available',
      size: '1.9 MB'
    },
    {
      id: 'RPT-007',
      name: 'Pricing Variance Report',
      category: 'Financial Reports',
      description: 'Analysis of pricing variations and margin trends',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01',
      format: 'Excel',
      status: 'available',
      size: '2.7 MB'
    },
    {
      id: 'RPT-008',
      name: 'Customer Segment Analysis',
      category: 'Customer Reports',
      description: 'Estimation patterns by customer segments and demographics',
      frequency: 'Quarterly',
      lastGenerated: '2025-10-01',
      format: 'PDF, PowerPoint',
      status: 'available',
      size: '3.5 MB'
    },
    {
      id: 'RPT-009',
      name: 'Rejection Reason Analysis',
      category: 'Quality Reports',
      description: 'Analysis of estimation rejections with root cause identification',
      frequency: 'Monthly',
      lastGenerated: '2025-10-01',
      format: 'PDF, Excel',
      status: 'available',
      size: '1.6 MB'
    },
    {
      id: 'RPT-010',
      name: 'Turnaround Time Report',
      category: 'Performance Reports',
      description: 'Estimation cycle time analysis from draft to approval',
      frequency: 'Weekly',
      lastGenerated: '2025-10-18',
      format: 'Excel',
      status: 'generating',
      size: '-'
    }
  ])

  const handleDownloadReport = (reportId: string, reportName: string) => {
    console.log('Downloading report:', reportId, reportName)
    alert(`Downloading report: ${reportName}`)
  }

  const handleScheduleReport = (reportId: string, reportName: string) => {
    router.push(`/estimation/analytics/reports/schedule/${reportId}`)
  }

  const handleGenerateCustomReport = () => {
    router.push('/estimation/analytics/reports/custom')
  }

  const handleScheduleRecurring = () => {
    router.push('/estimation/analytics/reports/schedule')
  }

  const handleBulkDownload = () => {
    const availableReports = reports.filter(r => r.status === 'available')
    if (availableReports.length === 0) {
      alert('No reports available for download')
      return
    }
    const reportNames = availableReports.map(r => r.name).join(', ')
    if (confirm(`Download ${availableReports.length} reports?\n\n${reportNames}`)) {
      console.log('Bulk downloading reports:', availableReports.map(r => r.id))
      alert(`Preparing ${availableReports.length} reports for download...`)
    }
  }

  const handleViewSchedule = (reportId: string) => {
    router.push(`/estimation/analytics/reports/schedule/${reportId}`)
  }

  const filteredReports = selectedCategory === 'all'
    ? reports
    : reports.filter(r => r.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'generating':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Summary Reports':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'Performance Reports':
        return <Activity className="h-5 w-5 text-purple-600" />
      case 'Quality Reports':
        return <Target className="h-5 w-5 text-green-600" />
      case 'Team Reports':
        return <Users className="h-5 w-5 text-orange-600" />
      case 'Trend Analysis':
        return <TrendingUp className="h-5 w-5 text-indigo-600" />
      case 'Sales Reports':
        return <BarChart3 className="h-5 w-5 text-red-600" />
      case 'Financial Reports':
        return <DollarSign className="h-5 w-5 text-emerald-600" />
      case 'Customer Reports':
        return <PieChart className="h-5 w-5 text-pink-600" />
      default:
        return <LineChart className="h-5 w-5 text-gray-600" />
    }
  }

  const categories = [
    'Summary Reports',
    'Performance Reports',
    'Quality Reports',
    'Team Reports',
    'Trend Analysis',
    'Sales Reports',
    'Financial Reports',
    'Customer Reports'
  ]

  return (
    <div className="w-full h-full px-4 py-2">
      {/* Action Buttons */}
      <div className="mb-3 flex justify-end">
        <div className="flex items-center gap-3">
          <button
            onClick={handleScheduleRecurring}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </button>
          <button
            onClick={handleGenerateCustomReport}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Custom Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Available Reports</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{reports.filter(r => r.status === 'available').length}</p>
              <p className="text-xs text-blue-700 mt-1">Ready to download</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Report Categories</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{categories.length}</p>
              <p className="text-xs text-purple-700 mt-1">Different types</p>
            </div>
            <BarChart3 className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Generated This Month</p>
              <p className="text-2xl font-bold text-green-900 mt-1">24</p>
              <p className="text-xs text-green-700 mt-1">Automated reports</p>
            </div>
            <Activity className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Downloads</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">156</p>
              <p className="text-xs text-orange-700 mt-1">This month</p>
            </div>
            <Download className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}>
            All Reports
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getCategoryIcon(report.category)}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-xs text-gray-500">{report.category}</p>
                </div>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(report.status)}`}>
                {report.status === 'available' && 'Available'}
                {report.status === 'generating' && 'Generating'}
                {report.status === 'scheduled' && 'Scheduled'}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{report.description}</p>

            <div className="space-y-2 mb-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Frequency:</span>
                <span className="font-medium text-gray-700">{report.frequency}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Last Generated:</span>
                <span className="font-medium text-gray-700">{report.lastGenerated}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Format:</span>
                <span className="font-medium text-gray-700">{report.format}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Size:</span>
                <span className="font-medium text-gray-700">{report.size}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {report.status === 'available' && (
                <>
                  <button
                    onClick={() => handleDownloadReport(report.id, report.name)}
                    className="flex-1 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleScheduleReport(report.id, report.name)}
                    className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Schedule
                  </button>
                </>
              )}
              {report.status === 'generating' && (
                <button className="w-full px-3 py-2 text-gray-600 bg-gray-100 rounded-lg cursor-not-allowed text-sm" disabled>
                  Generating...
                </button>
              )}
              {report.status === 'scheduled' && (
                <button
                  onClick={() => handleViewSchedule(report.id)}
                  className="w-full px-3 py-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  View Schedule
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={handleScheduleRecurring}
            className="px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Schedule Recurring Report</p>
                <p className="text-xs text-gray-500">Set up automated reports</p>
              </div>
            </div>
          </button>
          <button
            onClick={handleGenerateCustomReport}
            className="px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Create Custom Report</p>
                <p className="text-xs text-gray-500">Build your own report</p>
              </div>
            </div>
          </button>
          <button
            onClick={handleBulkDownload}
            className="px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Bulk Download</p>
                <p className="text-xs text-gray-500">Download multiple reports</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
