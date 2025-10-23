'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, Clock, BarChart3, Filter, Plus, Play, Settings, Eye, TrendingUp } from 'lucide-react'

interface Report {
  id: string
  name: string
  category: 'Operations' | 'Performance' | 'Compliance' | 'Customer' | 'Executive'
  description: string
  lastGenerated: string
  frequency: 'On-Demand' | 'Daily' | 'Weekly' | 'Monthly'
  format: string[]
  recipients: number
  scheduled: boolean
  popularity: number
}

interface ScheduledReport {
  id: string
  reportName: string
  schedule: string
  nextRun: string
  recipients: string[]
  format: string
  active: boolean
}

export default function SupportReports() {
  const [activeTab, setActiveTab] = useState<'templates' | 'scheduled' | 'custom'>('templates')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const reports: Report[] = [
    {
      id: '1',
      name: 'Ticket Volume Analysis',
      category: 'Operations',
      description: 'Comprehensive analysis of ticket volume trends, peak hours, and distribution by priority, category, and status',
      lastGenerated: '2024-10-21 09:30',
      frequency: 'Daily',
      format: ['PDF', 'Excel', 'CSV'],
      recipients: 12,
      scheduled: true,
      popularity: 95
    },
    {
      id: '2',
      name: 'SLA Compliance Dashboard',
      category: 'Compliance',
      description: 'Detailed SLA performance metrics including compliance rates, breaches, response times, and resolution times by priority',
      lastGenerated: '2024-10-21 08:00',
      frequency: 'Daily',
      format: ['PDF', 'Excel'],
      recipients: 8,
      scheduled: true,
      popularity: 92
    },
    {
      id: '3',
      name: 'Team Performance Report',
      category: 'Performance',
      description: 'Individual and team productivity metrics including tickets handled, resolution rates, customer satisfaction, and efficiency scores',
      lastGenerated: '2024-10-20 18:00',
      frequency: 'Weekly',
      format: ['PDF', 'Excel'],
      recipients: 15,
      scheduled: true,
      popularity: 88
    },
    {
      id: '4',
      name: 'Customer Satisfaction Analysis',
      category: 'Customer',
      description: 'CSAT scores, NPS trends, customer feedback analysis, sentiment analysis, and satisfaction drivers',
      lastGenerated: '2024-10-21 07:00',
      frequency: 'Weekly',
      format: ['PDF', 'PowerPoint'],
      recipients: 6,
      scheduled: true,
      popularity: 85
    },
    {
      id: '5',
      name: 'First Response Time Report',
      category: 'Performance',
      description: 'FRT metrics by priority, team comparison, SLA compliance, and response time distribution analysis',
      lastGenerated: '2024-10-21 09:00',
      frequency: 'Daily',
      format: ['PDF', 'Excel'],
      recipients: 10,
      scheduled: true,
      popularity: 82
    },
    {
      id: '6',
      name: 'Resolution Time Analysis',
      category: 'Performance',
      description: 'Average resolution times by category and priority, bottleneck identification, and efficiency trends',
      lastGenerated: '2024-10-21 09:15',
      frequency: 'Daily',
      format: ['PDF', 'Excel'],
      recipients: 10,
      scheduled: true,
      popularity: 80
    },
    {
      id: '7',
      name: 'Incident Management Summary',
      category: 'Operations',
      description: 'Critical and major incident analysis, response effectiveness, root cause trends, and prevention metrics',
      lastGenerated: '2024-10-20 17:30',
      frequency: 'Weekly',
      format: ['PDF'],
      recipients: 18,
      scheduled: true,
      popularity: 78
    },
    {
      id: '8',
      name: 'Change Management Report',
      category: 'Operations',
      description: 'Change request analysis, success rates, failed changes, emergency changes, and CAB approval metrics',
      lastGenerated: '2024-10-20 16:00',
      frequency: 'Weekly',
      format: ['PDF', 'Excel'],
      recipients: 12,
      scheduled: true,
      popularity: 75
    },
    {
      id: '9',
      name: 'Knowledge Base Effectiveness',
      category: 'Operations',
      description: 'KB article usage, search effectiveness, self-service resolution rates, and article update tracking',
      lastGenerated: '2024-10-19 15:00',
      frequency: 'Monthly',
      format: ['PDF', 'Excel'],
      recipients: 8,
      scheduled: true,
      popularity: 68
    },
    {
      id: '10',
      name: 'Automation ROI Report',
      category: 'Performance',
      description: 'Automation rule effectiveness, time saved, cost reduction, and efficiency improvements',
      lastGenerated: '2024-10-18 14:00',
      frequency: 'Monthly',
      format: ['PDF', 'PowerPoint'],
      recipients: 5,
      scheduled: true,
      popularity: 65
    },
    {
      id: '11',
      name: 'Executive Summary Dashboard',
      category: 'Executive',
      description: 'High-level KPIs, trends, financial impact, strategic metrics, and board-ready visualizations',
      lastGenerated: '2024-10-21 06:00',
      frequency: 'Weekly',
      format: ['PDF', 'PowerPoint'],
      recipients: 4,
      scheduled: true,
      popularity: 90
    },
    {
      id: '12',
      name: 'Asset Management Report',
      category: 'Operations',
      description: 'IT asset tracking, software licenses, hardware inventory, depreciation, and compliance status',
      lastGenerated: '2024-10-15 10:00',
      frequency: 'Monthly',
      format: ['PDF', 'Excel'],
      recipients: 7,
      scheduled: true,
      popularity: 62
    }
  ]

  const scheduledReports: ScheduledReport[] = [
    {
      id: '1',
      reportName: 'Ticket Volume Analysis',
      schedule: 'Daily at 9:00 AM',
      nextRun: '2024-10-22 09:00',
      recipients: ['support-leads@company.com', 'managers@company.com'],
      format: 'PDF',
      active: true
    },
    {
      id: '2',
      reportName: 'SLA Compliance Dashboard',
      schedule: 'Daily at 8:00 AM',
      nextRun: '2024-10-22 08:00',
      recipients: ['qa-team@company.com', 'management@company.com'],
      format: 'Excel',
      active: true
    },
    {
      id: '3',
      reportName: 'Team Performance Report',
      schedule: 'Every Monday at 6:00 PM',
      nextRun: '2024-10-28 18:00',
      recipients: ['team-leads@company.com', 'hr@company.com'],
      format: 'PDF',
      active: true
    },
    {
      id: '4',
      reportName: 'Executive Summary Dashboard',
      schedule: 'Every Monday at 6:00 AM',
      nextRun: '2024-10-28 06:00',
      recipients: ['executives@company.com', 'cio@company.com'],
      format: 'PowerPoint',
      active: true
    },
    {
      id: '5',
      reportName: 'Customer Satisfaction Analysis',
      schedule: 'Every Friday at 7:00 AM',
      nextRun: '2024-10-25 07:00',
      recipients: ['customer-success@company.com', 'support-leads@company.com'],
      format: 'PDF',
      active: true
    }
  ]

  const categories = ['All', 'Operations', 'Performance', 'Compliance', 'Customer', 'Executive']

  const filteredReports = reports.filter(report => 
    selectedCategory === 'All' || report.category === selectedCategory
  )

  const stats = [
    {
      label: 'Total Templates',
      value: reports.length,
      change: `${reports.filter(r => r.scheduled).length} scheduled`,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Generated Today',
      value: reports.filter(r => r.lastGenerated.includes('2024-10-21')).length,
      change: 'Since midnight',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Scheduled Reports',
      value: scheduledReports.filter(r => r.active).length,
      change: `${scheduledReports.length} total`,
      icon: Calendar,
      color: 'purple'
    },
    {
      label: 'Total Recipients',
      value: reports.reduce((sum, r) => sum + r.recipients, 0),
      change: 'Across all reports',
      icon: Download,
      color: 'orange'
    },
    {
      label: 'Avg Generation Time',
      value: '2.3 min',
      change: 'Last 30 days',
      icon: Clock,
      color: 'blue'
    },
    {
      label: 'Categories',
      value: categories.length - 1,
      change: 'Report types',
      icon: BarChart3,
      color: 'gray'
    }
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Operations': 'bg-blue-100 text-blue-700',
      'Performance': 'bg-green-100 text-green-700',
      'Compliance': 'bg-purple-100 text-purple-700',
      'Customer': 'bg-pink-100 text-pink-700',
      'Executive': 'bg-orange-100 text-orange-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getFrequencyColor = (frequency: string) => {
    const colors: Record<string, string> = {
      'On-Demand': 'bg-gray-100 text-gray-700',
      'Daily': 'bg-green-100 text-green-700',
      'Weekly': 'bg-blue-100 text-blue-700',
      'Monthly': 'bg-purple-100 text-purple-700'
    }
    return colors[frequency] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Reports</h1>
          <p className="text-gray-600 mt-1">Generate, schedule, and manage support analytics reports</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
            gray: 'bg-gray-500'
          }
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">{stat.label}</span>
                <div className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Report Templates
              </div>
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'scheduled'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'custom'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Custom Report Builder
              </div>
            </button>
          </nav>
        </div>

        {/* Report Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6 space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getCategoryColor(report.category)}`}>
                          {report.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(report.frequency)}`}>
                          {report.frequency}
                        </span>
                        {report.scheduled && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Scheduled
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-300">
                    <div>
                      <div className="text-xs text-gray-500">Last Generated</div>
                      <div className="text-sm font-medium text-gray-900">{report.lastGenerated}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Recipients</div>
                      <div className="text-sm font-medium text-gray-900">{report.recipients} users</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Available Formats</div>
                      <div className="flex gap-1">
                        {report.format.map((fmt, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-white border border-gray-300 rounded">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Popularity</div>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${report.popularity}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-900">{report.popularity}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                      <Play className="h-4 w-4" />
                      Generate Now
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Settings</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Reports Tab */}
        {activeTab === 'scheduled' && (
          <div className="p-6 space-y-4">
            {scheduledReports.map((scheduled) => (
              <div key={scheduled.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{scheduled.reportName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        scheduled.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {scheduled.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{scheduled.schedule}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Settings</span>
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Run Now
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Next Run</div>
                    <div className="text-sm font-medium text-blue-600">{scheduled.nextRun}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Format</div>
                    <div className="text-sm font-medium text-gray-900">{scheduled.format}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Recipients ({scheduled.recipients.length})</div>
                    <div className="text-xs text-gray-700">
                      {scheduled.recipients[0]}{scheduled.recipients.length > 1 && `, +${scheduled.recipients.length - 1} more`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Report Builder Tab */}
        {activeTab === 'custom' && (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
                <p className="text-gray-600 mb-6">Create custom reports with your own metrics, filters, and visualizations</p>
                
                <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
                  <h4 className="font-semibold text-gray-900">Build Your Report:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                      Select data sources (Tickets, SLA, Analytics, etc.)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                      Choose metrics and KPIs to include
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                      Apply filters (date range, priority, category, team)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
                      Select visualizations (charts, tables, graphs)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">5</div>
                      Configure output format and schedule
                    </li>
                  </ul>
                </div>

                <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                  <Plus className="h-5 w-5" />
                  Start Building
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Quick Report Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-white border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-50 transition-colors">
            <Download className="h-5 w-5 text-blue-600 mb-2" />
            <div className="font-semibold text-blue-900">Export All Data</div>
            <div className="text-xs text-blue-700">Download complete dataset</div>
          </button>
          <button className="bg-white border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-50 transition-colors">
            <Calendar className="h-5 w-5 text-blue-600 mb-2" />
            <div className="font-semibold text-blue-900">Schedule Report</div>
            <div className="text-xs text-blue-700">Set up automated delivery</div>
          </button>
          <button className="bg-white border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-50 transition-colors">
            <FileText className="h-5 w-5 text-blue-600 mb-2" />
            <div className="font-semibold text-blue-900">Save Template</div>
            <div className="text-xs text-blue-700">Create reusable report</div>
          </button>
        </div>
      </div>
    </div>
  )
}
