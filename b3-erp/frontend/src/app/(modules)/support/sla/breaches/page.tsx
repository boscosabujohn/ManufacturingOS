'use client'

import { useState } from 'react'
import { AlertTriangle, Clock, TrendingDown, Filter, Search, Calendar, User, FileText } from 'lucide-react'

interface SLABreach {
  id: string
  breachId: string
  ticketId: string
  title: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  slaType: 'Response Time' | 'Resolution Time'
  target: string
  actual: string
  breachTime: string
  breachDuration: string
  assignedTo: string
  category: string
  status: 'Active' | 'Resolved' | 'Acknowledged'
  rootCause?: string
  preventiveAction?: string
  impactLevel: 'Critical' | 'High' | 'Medium' | 'Low'
}

export default function SLABreaches() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedBreach, setSelectedBreach] = useState<SLABreach | null>(null)

  const breaches: SLABreach[] = [
    {
      id: '1',
      breachId: 'BRH-2024-156',
      ticketId: 'TKT-2024-1245',
      title: 'Production database connection timeout',
      priority: 'P0',
      slaType: 'Response Time',
      target: '15 minutes',
      actual: '28 minutes',
      breachTime: '2024-10-21 14:28',
      breachDuration: '13 minutes',
      assignedTo: 'Amit Patel',
      category: 'Infrastructure',
      status: 'Active',
      rootCause: 'All available database administrators were in a meeting',
      preventiveAction: 'Implement on-call rotation with minimum 2 DBAs available',
      impactLevel: 'Critical'
    },
    {
      id: '2',
      breachId: 'BRH-2024-155',
      ticketId: 'TKT-2024-1238',
      title: 'Email server not responding',
      priority: 'P1',
      slaType: 'Resolution Time',
      target: '8 hours',
      actual: '10.5 hours',
      breachTime: '2024-10-21 08:30',
      breachDuration: '2.5 hours',
      assignedTo: 'Priya Sharma',
      category: 'Email System',
      status: 'Resolved',
      rootCause: 'Required escalation to vendor support, delayed response',
      preventiveAction: 'Establish direct escalation path with vendor',
      impactLevel: 'High'
    },
    {
      id: '3',
      breachId: 'BRH-2024-154',
      ticketId: 'TKT-2024-1232',
      title: 'VPN connectivity issues for remote users',
      priority: 'P1',
      slaType: 'Response Time',
      target: '1 hour',
      actual: '1 hour 35 minutes',
      breachTime: '2024-10-20 16:35',
      breachDuration: '35 minutes',
      assignedTo: 'Rahul Verma',
      category: 'Network',
      status: 'Resolved',
      rootCause: 'Ticket was misclassified initially as P2',
      preventiveAction: 'Improve ticket classification training for L1 support',
      impactLevel: 'High'
    },
    {
      id: '4',
      breachId: 'BRH-2024-153',
      ticketId: 'TKT-2024-1225',
      title: 'Application performance degradation',
      priority: 'P2',
      slaType: 'Response Time',
      target: '4 hours',
      actual: '5 hours 15 minutes',
      breachTime: '2024-10-20 11:15',
      breachDuration: '1 hour 15 minutes',
      assignedTo: 'Sneha Reddy',
      category: 'Application',
      status: 'Acknowledged',
      rootCause: 'Resource shortage during peak business hours',
      preventiveAction: 'Add buffer capacity during peak hours',
      impactLevel: 'Medium'
    },
    {
      id: '5',
      breachId: 'BRH-2024-152',
      ticketId: 'TKT-2024-1218',
      title: 'Printer driver installation failure',
      priority: 'P3',
      slaType: 'Resolution Time',
      target: '5 days',
      actual: '5 days 8 hours',
      breachTime: '2024-10-19 17:00',
      breachDuration: '8 hours',
      assignedTo: 'Vikram Singh',
      category: 'Desktop Support',
      status: 'Resolved',
      rootCause: 'Awaiting approved software from procurement',
      preventiveAction: 'Pre-approve common drivers and software',
      impactLevel: 'Low'
    },
    {
      id: '6',
      breachId: 'BRH-2024-151',
      ticketId: 'TKT-2024-1212',
      title: 'File server access denied error',
      priority: 'P1',
      slaType: 'Response Time',
      target: '1 hour',
      actual: '1 hour 22 minutes',
      breachTime: '2024-10-19 09:22',
      breachDuration: '22 minutes',
      assignedTo: 'Amit Patel',
      category: 'Storage',
      status: 'Resolved',
      rootCause: 'Authentication service intermittent issue',
      preventiveAction: 'Implement redundant authentication servers',
      impactLevel: 'High'
    },
    {
      id: '7',
      breachId: 'BRH-2024-150',
      ticketId: 'TKT-2024-1205',
      title: 'Critical security patch deployment failed',
      priority: 'P0',
      slaType: 'Resolution Time',
      target: '4 hours',
      actual: '4 hours 45 minutes',
      breachTime: '2024-10-18 20:45',
      breachDuration: '45 minutes',
      assignedTo: 'Rajesh Kumar',
      category: 'Security',
      status: 'Resolved',
      rootCause: 'Unforeseen compatibility issue with legacy systems',
      preventiveAction: 'Establish pre-production testing environment',
      impactLevel: 'Critical'
    },
    {
      id: '8',
      breachId: 'BRH-2024-149',
      ticketId: 'TKT-2024-1198',
      title: 'Backup job failure notification',
      priority: 'P2',
      slaType: 'Resolution Time',
      target: '24 hours',
      actual: '26 hours 30 minutes',
      breachTime: '2024-10-18 14:30',
      breachDuration: '2 hours 30 minutes',
      assignedTo: 'Priya Sharma',
      category: 'Backup',
      status: 'Resolved',
      rootCause: 'Storage capacity reached unexpectedly',
      preventiveAction: 'Implement proactive storage monitoring',
      impactLevel: 'Medium'
    }
  ]

  const stats = [
    {
      label: 'Active Breaches',
      value: breaches.filter(b => b.status === 'Active').length,
      change: 'Needs immediate action',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Last 24 Hours',
      value: breaches.filter(b => {
        const breachDate = new Date(b.breachTime)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return breachDate >= dayAgo
      }).length,
      change: '-2 vs previous 24h',
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'This Week',
      value: breaches.length,
      change: '+12% vs last week',
      icon: TrendingDown,
      color: 'yellow'
    },
    {
      label: 'Critical Priority',
      value: breaches.filter(b => b.priority === 'P0').length,
      change: '2 resolved today',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Acknowledged',
      value: breaches.filter(b => b.status === 'Acknowledged').length,
      change: 'Pending resolution',
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Resolved',
      value: breaches.filter(b => b.status === 'Resolved').length,
      change: `${((breaches.filter(b => b.status === 'Resolved').length / breaches.length) * 100).toFixed(0)}% of total`,
      icon: Calendar,
      color: 'green'
    }
  ]

  const filteredBreaches = breaches.filter(breach => {
    const matchesSearch = breach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         breach.breachId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         breach.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || breach.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || breach.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-700 border-red-200'
      case 'Acknowledged': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-500 text-white'
      case 'P1': return 'bg-orange-500 text-white'
      case 'P2': return 'bg-yellow-500 text-white'
      case 'P3': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'text-red-600'
      case 'High': return 'text-orange-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SLA Breaches</h1>
        <p className="text-gray-600 mt-1">Track, analyze, and resolve SLA violations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            red: 'bg-red-500',
            orange: 'bg-orange-500',
            yellow: 'bg-yellow-500',
            blue: 'bg-blue-500',
            green: 'bg-green-500'
          }
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-3">
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search breaches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="P0">P0 - Critical</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium</option>
              <option value="P3">P3 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Breaches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredBreaches.map((breach) => (
          <div key={breach.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(breach.priority)}`}>
                      {breach.priority}
                    </span>
                    <span className="text-gray-500 text-sm">{breach.breachId}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{breach.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Ticket: {breach.ticketId}</span>
                    <span>•</span>
                    <span>{breach.category}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(breach.status)}`}>
                  {breach.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-2 pb-4 border-b">
                <div>
                  <div className="text-xs text-gray-500 mb-1">SLA Type</div>
                  <div className="text-sm font-semibold text-gray-900">{breach.slaType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Impact Level</div>
                  <div className={`text-sm font-semibold ${getImpactColor(breach.impactLevel)}`}>
                    {breach.impactLevel}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Target</div>
                  <div className="text-sm font-semibold text-gray-900">{breach.target}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Actual</div>
                  <div className="text-sm font-semibold text-red-600">{breach.actual}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Breach Duration</div>
                  <div className="text-sm font-semibold text-red-600">{breach.breachDuration}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Breach Time</div>
                  <div className="text-sm font-semibold text-gray-900">{breach.breachTime}</div>
                </div>
              </div>

              {/* Details */}
              {breach.rootCause && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Root Cause:</div>
                  <div className="text-sm text-gray-600">{breach.rootCause}</div>
                </div>
              )}

              {breach.preventiveAction && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">Preventive Action:</div>
                  <div className="text-sm text-gray-600">{breach.preventiveAction}</div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  {breach.assignedTo}
                </div>
                <button
                  onClick={() => setSelectedBreach(breach)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBreaches.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Filter className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Breaches Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  )
}
