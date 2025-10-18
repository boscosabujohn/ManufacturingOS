'use client'

import { useState } from 'react'
import {
  Wrench,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Star
} from 'lucide-react'

interface ServiceStats {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  avgResolutionTime: number
  customerSatisfaction: number
  activeServiceCalls: number
  warrantyClaimsThisMonth: number
  technicianUtilization: number
  pendingParts: number
  scheduledVisits: number
}

interface ServiceTicket {
  id: string
  customer: string
  product: string
  issue: string
  status: 'open' | 'in_progress' | 'awaiting_parts' | 'resolved' | 'closed'
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignedTo: string
  createdDate: string
  estimatedResolution: string
  satisfaction: number | null
}

export default function AfterSalesServiceDashboard() {
  const [stats] = useState<ServiceStats>({
    totalTickets: 234,
    openTickets: 45,
    resolvedTickets: 178,
    avgResolutionTime: 4.5,
    customerSatisfaction: 4.6,
    activeServiceCalls: 23,
    warrantyClaimsThisMonth: 12,
    technicianUtilization: 78.5,
    pendingParts: 8,
    scheduledVisits: 15
  })

  const [recentTickets] = useState<ServiceTicket[]>([
    {
      id: 'SRV-2025-456',
      customer: 'ABC Manufacturing Ltd',
      product: 'Hydraulic Press HP-500 (SN: HP5001234)',
      issue: 'Pressure inconsistency in hydraulic system',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'Service Engineer A',
      createdDate: '2025-10-16',
      estimatedResolution: '2025-10-19',
      satisfaction: null
    },
    {
      id: 'SRV-2025-457',
      customer: 'XYZ Industries Inc',
      product: 'CNC Machine CM-350 (SN: CM3502345)',
      issue: 'Spindle motor overheating',
      status: 'awaiting_parts',
      priority: 'critical',
      assignedTo: 'Service Engineer B',
      createdDate: '2025-10-15',
      estimatedResolution: '2025-10-22',
      satisfaction: null
    },
    {
      id: 'SRV-2025-458',
      customer: 'Tech Solutions Pvt Ltd',
      product: 'Control Panel CP-1000 (SN: CP1003456)',
      issue: 'Display flickering',
      status: 'resolved',
      priority: 'medium',
      assignedTo: 'Service Engineer C',
      createdDate: '2025-10-14',
      estimatedResolution: '2025-10-17',
      satisfaction: 5
    },
    {
      id: 'SRV-2025-459',
      customer: 'Global Exports Corp',
      product: 'Conveyor System CS-200 (SN: CS2004567)',
      issue: 'Belt alignment issue',
      status: 'open',
      priority: 'low',
      assignedTo: 'Not Assigned',
      createdDate: '2025-10-18',
      estimatedResolution: '2025-10-25',
      satisfaction: null
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'in_progress':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'awaiting_parts':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200'
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">After-Sales Service</h1>
            <p className="text-gray-600 mt-1">Service tickets, warranty management, and customer support</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all shadow-md">
            <Wrench className="h-5 w-5" />
            New Service Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Open Tickets</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.openTickets}</p>
                <p className="text-xs text-blue-700 mt-1">{stats.totalTickets} total</p>
              </div>
              <AlertCircle className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.customerSatisfaction}/5</p>
                <p className="text-xs text-green-700 mt-1">{stats.resolvedTickets} resolved</p>
              </div>
              <Star className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Service Calls</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.activeServiceCalls}</p>
                <p className="text-xs text-purple-700 mt-1">{stats.scheduledVisits} scheduled</p>
              </div>
              <Phone className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.avgResolutionTime}h</p>
                <p className="text-xs text-orange-700 mt-1">{stats.technicianUtilization}% utilization</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Service Tickets</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{ticket.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{ticket.customer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">{ticket.product}</p>
                    <p className="text-sm text-gray-600 mt-1">{ticket.issue}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600 text-xs">Assigned: {ticket.assignedTo}</span>
                      {ticket.satisfaction && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-gray-900">{ticket.satisfaction}/5</span>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-600 text-xs">ETA: {ticket.estimatedResolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Warranty Claims</h3>
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.warrantyClaimsThisMonth}</p>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Parts</h3>
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingParts}</p>
            <p className="text-sm text-gray-600 mt-1">Awaiting delivery</p>
          </div>
        </div>
      </div>
    </div>
  )
}
