'use client'

import { useState } from 'react'
import {
  Search, Plus, FileText, TrendingUp, CheckCircle, AlertTriangle,
  Calendar, User, GitBranch, Target, Lightbulb, Shield, ArrowRight,
  Clock, Award, BookOpen, ChevronDown, ChevronRight
} from 'lucide-react'

interface RCARecord {
  id: string
  rcaId: string
  problemId: string
  problemTitle: string
  status: 'In Progress' | 'Completed' | 'Under Review'
  method: '5 Whys' | 'Fishbone Diagram' | 'Fault Tree Analysis' | 'Pareto Analysis'
  analyst: string
  startDate: string
  completionDate: string | null
  rootCause: string
  contributingFactors: string[]
  preventiveActions: string[]
  correctiveActions: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export default function RootCauseAnalysis() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [expandedRCA, setExpandedRCA] = useState<string | null>(null)

  const [stats] = useState({
    totalRCAs: 28,
    completed: 18,
    inProgress: 8,
    underReview: 2,
    avgDuration: '9 days',
    successRate: '94%'
  })

  const [rcaRecords] = useState<RCARecord[]>([
    {
      id: '1',
      rcaId: 'RCA-2024-015',
      problemId: 'PRB-2024-012',
      problemTitle: 'Database Connection Pool Exhaustion',
      status: 'Completed',
      method: '5 Whys',
      analyst: 'Rajesh Kumar',
      startDate: '2024-10-15',
      completionDate: '2024-10-20',
      rootCause: 'Connection pool size was insufficient for peak load traffic, and connections were not being properly released after transaction completion due to missing finally blocks in legacy code.',
      contributingFactors: [
        'Connection pool max size set to default (20) despite high concurrent user count',
        'Legacy code missing proper connection cleanup in exception handlers',
        'No connection pool monitoring or alerting configured',
        'Gradual increase in user base without infrastructure scaling review'
      ],
      preventiveActions: [
        'Implement connection pool monitoring with alerts at 80% utilization',
        'Establish quarterly capacity planning review process',
        'Create automated code scanning rules for connection leak patterns',
        'Document connection pool best practices in developer guidelines'
      ],
      correctiveActions: [
        'Increased connection pool size to 100 based on load testing',
        'Refactored all database access code to use try-with-resources pattern',
        'Implemented connection leak detection and automatic cleanup',
        'Added comprehensive logging for connection pool metrics'
      ],
      priority: 'critical'
    },
    {
      id: '2',
      rcaId: 'RCA-2024-014',
      problemId: 'PRB-2024-009',
      problemTitle: 'Email Service SMTP Authentication Failures',
      status: 'In Progress',
      method: 'Fishbone Diagram',
      analyst: 'Priya Sharma',
      startDate: '2024-10-18',
      completionDate: null,
      rootCause: 'Investigation ongoing - preliminary findings suggest network routing issues combined with SMTP server load balancing configuration mismatch.',
      contributingFactors: [
        'SMTP server pool has uneven load distribution',
        'Network path to certain SMTP servers intermittently high latency',
        'Authentication token expiry not properly handled in retry logic'
      ],
      preventiveActions: [
        'Implement health checks for all SMTP servers in pool',
        'Add circuit breaker pattern for failed SMTP connections'
      ],
      correctiveActions: [
        'Working with network team to identify routing issues',
        'Implementing retry logic with exponential backoff'
      ],
      priority: 'high'
    },
    {
      id: '3',
      rcaId: 'RCA-2024-013',
      problemId: 'PRB-2024-007',
      problemTitle: 'API Rate Limiting During Batch Operations',
      status: 'Completed',
      method: 'Pareto Analysis',
      analyst: 'Amit Patel',
      startDate: '2024-10-10',
      completionDate: '2024-10-16',
      rootCause: 'Batch import process was not respecting third-party API rate limits (100 requests/minute). The implementation used parallel processing without rate limiting controls.',
      contributingFactors: [
        'No rate limiting implementation in batch processing module',
        'API documentation not reviewed during initial integration',
        'Lack of testing with production-scale data volumes',
        'Missing error handling for 429 (Too Many Requests) responses'
      ],
      preventiveActions: [
        'Establish API integration checklist including rate limit review',
        'Implement centralized rate limiting library for all API integrations',
        'Add load testing to CI/CD pipeline for batch operations',
        'Create API integration best practices documentation'
      ],
      correctiveActions: [
        'Implemented token bucket rate limiting algorithm',
        'Added configurable batch size and delay parameters',
        'Implemented proper 429 error handling with retry-after header support',
        'Added monitoring dashboard for API consumption metrics'
      ],
      priority: 'medium'
    },
    {
      id: '4',
      rcaId: 'RCA-2024-012',
      problemId: 'PRB-2024-005',
      problemTitle: 'Mobile App Session Timeout Not Respected',
      status: 'Under Review',
      method: 'Fault Tree Analysis',
      analyst: 'Sneha Reddy',
      startDate: '2024-10-12',
      completionDate: null,
      rootCause: 'Mobile app caches authentication token in secure storage but does not validate server-side session expiry. Background app refresh extends local token without server validation.',
      contributingFactors: [
        'Client-side session management independent of server-side',
        'Background sync process refreshes local token timestamp',
        'No real-time session validation mechanism'
      ],
      preventiveActions: [
        'Implement session validation on app foreground event',
        'Add server-side session status endpoint for validation'
      ],
      correctiveActions: [
        'Under security review for appropriate solution',
        'Evaluating token refresh mechanism redesign'
      ],
      priority: 'high'
    }
  ])

  const filteredRCAs = rcaRecords.filter(rca => {
    const matchesSearch = rca.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rca.rcaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rca.problemId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rca.status === statusFilter
    const matchesMethod = methodFilter === 'all' || rca.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Under Review': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case '5 Whys': return <Target className="h-4 w-4" />
      case 'Fishbone Diagram': return <GitBranch className="h-4 w-4" />
      case 'Fault Tree Analysis': return <AlertTriangle className="h-4 w-4" />
      case 'Pareto Analysis': return <TrendingUp className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedRCA(expandedRCA === id ? null : id)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Root Cause Analysis</h1>
          <p className="text-gray-600 mt-1">Systematic investigation of problem root causes and preventive actions</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700">
          <Plus className="h-4 w-4 inline mr-2" />
          Start New RCA
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total RCAs</p>
              <p className="text-2xl font-bold mt-1">{stats.totalRCAs}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">In Progress</p>
              <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Under Review</p>
              <p className="text-2xl font-bold mt-1">{stats.underReview}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Avg Duration</p>
              <p className="text-2xl font-bold mt-1">{stats.avgDuration}</p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Success Rate</p>
              <p className="text-2xl font-bold mt-1">{stats.successRate}</p>
            </div>
            <Award className="h-8 w-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* RCA Methods Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 mb-3">RCA Methodologies Available</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-sm text-gray-900">5 Whys</h4>
                </div>
                <p className="text-xs text-gray-600">Iteratively ask "why" to drill down to root cause</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-sm text-gray-900">Fishbone Diagram</h4>
                </div>
                <p className="text-xs text-gray-600">Categorize causes: People, Process, Technology, Environment</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-sm text-gray-900">Fault Tree</h4>
                </div>
                <p className="text-xs text-gray-600">Top-down deductive analysis of failure modes</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-sm text-gray-900">Pareto Analysis</h4>
                </div>
                <p className="text-xs text-gray-600">80/20 rule - identify most impactful causes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search RCAs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="5 Whys">5 Whys</option>
            <option value="Fishbone Diagram">Fishbone Diagram</option>
            <option value="Fault Tree Analysis">Fault Tree Analysis</option>
            <option value="Pareto Analysis">Pareto Analysis</option>
          </select>
        </div>
      </div>

      {/* RCA Records */}
      <div className="space-y-4">
        {filteredRCAs.map((rca) => (
          <div key={rca.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {getMethodIcon(rca.method)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {rca.rcaId}
                      </code>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {rca.problemId}
                      </code>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(rca.status)}`}>
                        {rca.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rca.priority)}`}>
                        {rca.priority.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{rca.problemTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {rca.analyst}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {rca.method}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Started: {rca.startDate}
                      </span>
                      {rca.completionDate && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Completed: {rca.completionDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(rca.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedRCA === rca.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Root Cause Summary (always visible) */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">Root Cause Identified:</p>
                    <p className="text-sm text-red-800">{rca.rootCause}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRCA === rca.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                {/* Contributing Factors */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Contributing Factors</h4>
                  </div>
                  <div className="space-y-2">
                    {rca.contributingFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-orange-200">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corrective Actions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Corrective Actions (Immediate)</h4>
                  </div>
                  <div className="space-y-2">
                    {rca.correctiveActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-blue-200">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventive Actions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Preventive Actions (Long-term)</h4>
                  </div>
                  <div className="space-y-2">
                    {rca.preventiveActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-green-200">
                        <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guidelines */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-purple-900 mb-2">RCA Best Practices</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Focus on systemic issues rather than blaming individuals</li>
              <li>• Dig deep enough to find true root cause, not just symptoms</li>
              <li>• Document all contributing factors for comprehensive understanding</li>
              <li>• Define both corrective (immediate) and preventive (long-term) actions</li>
              <li>• Review RCA findings with stakeholders before closing</li>
              <li>• Update knowledge base with lessons learned</li>
            </ul>
          </div>
        </div>
      </div>

      {filteredRCAs.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No RCA records found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
