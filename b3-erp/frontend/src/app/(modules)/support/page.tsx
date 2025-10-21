'use client'

import { useState } from 'react'
import {
  Ticket, AlertCircle, CheckCircle, Clock, TrendingUp, Users,
  FileText, Settings, Target, BarChart3, Activity, MessageSquare,
  Zap, Shield, Archive
} from 'lucide-react'

interface Metric {
  id: string
  name: string
  value: number
  change: number
  icon: any
  color: string
}

interface RecentTicket {
  id: string
  ticketId: string
  subject: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: string
  assignee: string
  createdAt: string
  category: string
}

export default function SupportDashboard() {
  const [metrics] = useState<Metric[]>([
    { id: '1', name: 'Open Tickets', value: 87, change: -12.5, icon: Ticket, color: 'from-blue-600 to-cyan-600' },
    { id: '2', name: 'Critical Issues', value: 12, change: -25.0, icon: AlertCircle, color: 'from-red-600 to-pink-600' },
    { id: '3', name: 'Resolved Today', value: 45, change: 18.4, icon: CheckCircle, color: 'from-green-600 to-emerald-600' },
    { id: '4', name: 'Avg Response Time', value: 23, change: -15.2, icon: Clock, color: 'from-purple-600 to-indigo-600' },
    { id: '5', name: 'Active Incidents', value: 8, change: -33.3, icon: AlertCircle, color: 'from-orange-600 to-red-600' },
    { id: '6', name: 'Team Members', value: 24, change: 4.3, icon: Users, color: 'from-indigo-600 to-purple-600' },
    { id: '7', name: 'SLA Compliance', value: 94, change: 2.1, icon: Target, color: 'from-green-500 to-green-600' },
    { id: '8', name: 'Knowledge Articles', value: 156, change: 12.0, icon: FileText, color: 'from-yellow-600 to-orange-600' }
  ])

  const [recentTickets] = useState<RecentTicket[]>([
    {
      id: '1',
      ticketId: 'TKT-2024-1047',
      subject: 'Production system slow response time',
      priority: 'critical',
      status: 'Open',
      assignee: 'Rajesh Kumar',
      createdAt: '15 mins ago',
      category: 'Performance'
    },
    {
      id: '2',
      ticketId: 'TKT-2024-1046',
      subject: 'Unable to access CRM module',
      priority: 'high',
      status: 'Assigned',
      assignee: 'Priya Sharma',
      createdAt: '32 mins ago',
      category: 'Access Issue'
    },
    {
      id: '3',
      ticketId: 'TKT-2024-1045',
      subject: 'Report generation failing',
      priority: 'medium',
      status: 'In Progress',
      assignee: 'Amit Patel',
      createdAt: '1 hour ago',
      category: 'Bug'
    },
    {
      id: '4',
      ticketId: 'TKT-2024-1044',
      subject: 'How to export inventory data?',
      priority: 'low',
      status: 'Open',
      assignee: 'Sneha Reddy',
      createdAt: '2 hours ago',
      category: 'How-To'
    },
    {
      id: '5',
      ticketId: 'TKT-2024-1043',
      subject: 'Database backup not running',
      priority: 'high',
      status: 'Resolved',
      assignee: 'Vikram Singh',
      createdAt: '3 hours ago',
      category: 'System'
    }
  ])

  const [categoryStats] = useState([
    { category: 'Bug', count: 34, percentage: 39 },
    { category: 'Feature Request', count: 23, percentage: 26 },
    { category: 'How-To', count: 18, percentage: 21 },
    { category: 'Performance', count: 8, percentage: 9 },
    { category: 'Access Issue', count: 4, percentage: 5 }
  ])

  const [slaMetrics] = useState([
    { metric: 'First Response SLA', value: 96, target: 95, status: 'met' },
    { metric: 'Resolution SLA', value: 89, target: 90, status: 'near' },
    { metric: 'Escalation SLA', value: 97, target: 95, status: 'met' },
    { metric: 'Customer Satisfaction', value: 4.6, target: 4.5, status: 'met' }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'text-green-600 bg-green-50'
      case 'near':
        return 'text-yellow-600 bg-yellow-50'
      case 'breach':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Dashboard</h1>
          <p className="text-gray-600 mt-1">ITSM and customer support overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4 inline mr-2" />
            Settings
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700">
            <Ticket className="h-4 w-4 inline mr-2" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.id} className={`bg-gradient-to-r ${metric.color} text-white rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="h-8 w-8 opacity-80" />
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {metric.name === 'SLA Compliance' || metric.name === 'Avg Response Time'
                      ? `${metric.value}${metric.name === 'SLA Compliance' ? '%' : 'm'}`
                      : metric.value}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-90">{metric.name}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-4 w-4 ${metric.change >= 0 ? '' : 'rotate-180'}`} />
                  <span className="text-xs font-medium">
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
              </div>
              <a href="/support/tickets/open" className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </a>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <code className="text-xs font-mono text-gray-500">{ticket.ticketId}</code>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {ticket.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ticket.createdAt}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    ticket.status === 'Assigned' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">SLA Performance</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {slaMetrics.map((sla, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{sla.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {typeof sla.value === 'number' && sla.value < 10 ? sla.value.toFixed(1) : sla.value}{typeof sla.value === 'number' && sla.value >= 10 ? '%' : ''}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSLAStatusColor(sla.status)}`}>
                      {sla.status === 'met' ? '✓' : '!'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      sla.status === 'met' ? 'bg-green-600' :
                      sla.status === 'near' ? 'bg-yellow-500' :
                      'bg-red-600'
                    }`}
                    style={{ width: typeof sla.value === 'number' && sla.value >= 10 ? `${sla.value}%` : `${(sla.value / 5) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">Target: {sla.target}{typeof sla.target === 'number' && sla.target >= 10 ? '%' : ''}</span>
                  <span className={`text-xs font-medium ${
                    sla.status === 'met' ? 'text-green-600' :
                    sla.status === 'near' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {typeof sla.value === 'number' && typeof sla.target === 'number'
                      ? `${sla.value >= 10
                          ? (sla.value >= sla.target ? '+' : '') + (sla.value - sla.target).toFixed(0) + '%'
                          : (sla.value >= sla.target ? '+' : '') + (sla.value - sla.target).toFixed(1)
                        }`
                      : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Categories and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Tickets by Category</h2>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {categoryStats.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                  <span className="text-sm text-gray-600">{cat.count} tickets</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{cat.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-4 hover:from-blue-700 hover:to-cyan-700 text-left">
              <Ticket className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm">Create Ticket</h3>
              <p className="text-xs opacity-90 mt-1">New support ticket</p>
            </button>

            <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg p-4 hover:from-red-700 hover:to-pink-700 text-left">
              <AlertCircle className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm">Report Incident</h3>
              <p className="text-xs opacity-90 mt-1">Critical issue</p>
            </button>

            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4 hover:from-purple-700 hover:to-indigo-700 text-left">
              <MessageSquare className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm">Knowledge Base</h3>
              <p className="text-xs opacity-90 mt-1">Browse articles</p>
            </button>

            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-4 hover:from-green-700 hover:to-emerald-700 text-left">
              <Activity className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm">System Status</h3>
              <p className="text-xs opacity-90 mt-1">Check health</p>
            </button>

            <button className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg p-4 hover:from-orange-700 hover:to-yellow-700 text-left">
              <Settings className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm">Request Change</h3>
              <p className="text-xs opacity-90 mt-1">System change</p>
            </button>

            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4 hover:from-indigo-700 hover:to-purple-700 text-left">
              <Shield className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm">Asset Request</h3>
              <p className="text-xs opacity-90 mt-1">Hardware/Software</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
