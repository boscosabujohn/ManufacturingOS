'use client'

import { useState } from 'react'
import { Ticket, Clock, User, Search, Filter, Eye, MessageSquare } from 'lucide-react'

interface TicketItem {
  id: string
  ticketId: string
  subject: string
  requester: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: string
  createdAt: string
  slaRemaining: string
  assignee: string
  comments: number
}

export default function OpenTickets() {
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [tickets] = useState<TicketItem[]>([
    {
      id: '1',
      ticketId: 'TKT-2024-1047',
      subject: 'Production system slow response time',
      requester: 'John Smith',
      category: 'Performance',
      priority: 'critical',
      status: 'Open',
      createdAt: '2024-10-21 09:15',
      slaRemaining: '2h 45m',
      assignee: 'Rajesh Kumar',
      comments: 3
    },
    {
      id: '2',
      ticketId: 'TKT-2024-1046',
      subject: 'Unable to access CRM module',
      requester: 'Sarah Johnson',
      category: 'Access Issue',
      priority: 'high',
      status: 'Open',
      createdAt: '2024-10-21 08:30',
      slaRemaining: '5h 12m',
      assignee: 'Priya Sharma',
      comments: 2
    },
    {
      id: '3',
      ticketId: 'TKT-2024-1045',
      subject: 'Report generation failing for sales data',
      requester: 'Mike Wilson',
      category: 'Bug',
      priority: 'medium',
      status: 'Open',
      createdAt: '2024-10-21 07:45',
      slaRemaining: '18h 30m',
      assignee: 'Amit Patel',
      comments: 5
    },
    {
      id: '4',
      ticketId: 'TKT-2024-1044',
      subject: 'How to export inventory data to Excel?',
      requester: 'Emily Davis',
      category: 'How-To',
      priority: 'low',
      status: 'Open',
      createdAt: '2024-10-21 06:20',
      slaRemaining: '46h 15m',
      assignee: 'Sneha Reddy',
      comments: 1
    },
    {
      id: '5',
      ticketId: 'TKT-2024-1043',
      subject: 'Email notifications not being sent',
      requester: 'David Brown',
      category: 'System Error',
      priority: 'high',
      status: 'Open',
      createdAt: '2024-10-20 16:30',
      slaRemaining: '1h 05m',
      assignee: 'Vikram Singh',
      comments: 4
    },
    {
      id: '6',
      ticketId: 'TKT-2024-1042',
      subject: 'Request for API documentation',
      requester: 'Lisa Anderson',
      category: 'Feature Request',
      priority: 'low',
      status: 'Open',
      createdAt: '2024-10-20 15:00',
      slaRemaining: '38h 45m',
      assignee: 'Unassigned',
      comments: 0
    },
    {
      id: '7',
      ticketId: 'TKT-2024-1041',
      subject: 'Database connection timeout errors',
      requester: 'Tom Martinez',
      category: 'System Error',
      priority: 'critical',
      status: 'Open',
      createdAt: '2024-10-20 14:15',
      slaRemaining: 'Overdue',
      assignee: 'Rajesh Kumar',
      comments: 8
    },
    {
      id: '8',
      ticketId: 'TKT-2024-1040',
      subject: 'Mobile app login issues on iOS',
      requester: 'Jennifer Lee',
      category: 'Bug',
      priority: 'medium',
      status: 'Open',
      createdAt: '2024-10-20 13:30',
      slaRemaining: '12h 20m',
      assignee: 'Priya Sharma',
      comments: 3
    }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSLAColor = (sla: string) => {
    if (sla === 'Overdue') return 'text-red-600'
    const hours = parseInt(sla.split('h')[0])
    if (hours < 4) return 'text-red-600'
    if (hours < 12) return 'text-yellow-600'
    return 'text-green-600'
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    return matchesSearch && matchesPriority && matchesCategory
  })

  const categories = Array.from(new Set(tickets.map(t => t.category)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Open Tickets</h1>
          <p className="text-gray-600 mt-1">Active support tickets requiring attention</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{tickets.length}</div>
          <div className="text-sm text-gray-600">Total Open</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-blue-600" />
                      <code className="text-sm font-mono text-gray-900">{ticket.ticketId}</code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                    {ticket.comments > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket.comments} comments
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{ticket.requester}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium border rounded ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className={`h-4 w-4 ${getSLAColor(ticket.slaRemaining)}`} />
                      <span className={`text-sm font-medium ${getSLAColor(ticket.slaRemaining)}`}>
                        {ticket.slaRemaining}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
