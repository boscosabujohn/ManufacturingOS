'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  Calendar
} from 'lucide-react';

interface SLATicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  issueTitle: string;
  assignedTo: string;
  responseDeadline: string;
  resolutionDeadline: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved';
  responseStatus: 'Met' | 'At Risk' | 'Breached';
  resolutionStatus: 'On Track' | 'At Risk' | 'Breached';
}

export default function SLADashboardPage() {
  const router = useRouter();
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Mock SLA Tickets Data
  const allTickets: SLATicket[] = [
    {
      id: 'T1',
      ticketNumber: 'SR-2025-0045',
      customerName: 'Sharma Kitchens Pvt Ltd',
      priority: 'P1',
      issueTitle: 'Complete kitchen operations down - gas line failure',
      assignedTo: 'Rajesh Kumar',
      responseDeadline: '2025-02-17T12:30:00',
      resolutionDeadline: '2025-02-17T16:30:00',
      status: 'In Progress',
      responseStatus: 'Met',
      resolutionStatus: 'At Risk'
    },
    {
      id: 'T2',
      ticketNumber: 'SR-2025-0044',
      customerName: 'Prestige Developers',
      priority: 'P2',
      issueTitle: 'Refrigerator cooling issue affecting food storage',
      assignedTo: 'Amit Patel',
      responseDeadline: '2025-02-17T14:00:00',
      resolutionDeadline: '2025-02-18T10:00:00',
      status: 'In Progress',
      responseStatus: 'Met',
      resolutionStatus: 'On Track'
    },
    {
      id: 'T3',
      ticketNumber: 'SR-2025-0043',
      customerName: 'Royal Restaurant Chain',
      priority: 'P3',
      issueTitle: 'Deep fryer temperature inconsistency',
      assignedTo: 'Priya Singh',
      responseDeadline: '2025-02-17T18:00:00',
      resolutionDeadline: '2025-02-19T10:00:00',
      status: 'Open',
      responseStatus: 'At Risk',
      resolutionStatus: 'On Track'
    },
    {
      id: 'T4',
      ticketNumber: 'SR-2025-0042',
      customerName: 'Hotel Grand Plaza',
      priority: 'P2',
      issueTitle: 'Walk-in freezer door seal replacement needed',
      assignedTo: 'Suresh Reddy',
      responseDeadline: '2025-02-17T13:00:00',
      resolutionDeadline: '2025-02-18T09:00:00',
      status: 'In Progress',
      responseStatus: 'Breached',
      resolutionStatus: 'At Risk'
    },
    {
      id: 'T5',
      ticketNumber: 'SR-2025-0041',
      customerName: 'Green Valley Resorts',
      priority: 'P4',
      issueTitle: 'Routine maintenance scheduling request',
      assignedTo: 'Neha Sharma',
      responseDeadline: '2025-02-18T10:00:00',
      resolutionDeadline: '2025-02-20T10:00:00',
      status: 'Open',
      responseStatus: 'On Track',
      resolutionStatus: 'On Track'
    },
    {
      id: 'T6',
      ticketNumber: 'SR-2025-0040',
      customerName: 'City Cafe Express',
      priority: 'P1',
      issueTitle: 'Espresso machine complete failure - no power',
      assignedTo: 'Rajesh Kumar',
      responseDeadline: '2025-02-17T11:00:00',
      resolutionDeadline: '2025-02-17T15:00:00',
      status: 'In Progress',
      responseStatus: 'Met',
      resolutionStatus: 'Breached'
    },
    {
      id: 'T7',
      ticketNumber: 'SR-2025-0039',
      customerName: 'Paradise Banquet Hall',
      priority: 'P3',
      issueTitle: 'Oven temperature sensor replacement',
      assignedTo: 'Amit Patel',
      responseDeadline: '2025-02-17T16:00:00',
      resolutionDeadline: '2025-02-19T08:00:00',
      status: 'In Progress',
      responseStatus: 'Met',
      resolutionStatus: 'On Track'
    },
    {
      id: 'T8',
      ticketNumber: 'SR-2025-0038',
      customerName: 'Spice Garden Restaurant',
      priority: 'P2',
      issueTitle: 'Dishwasher water pump motor failure',
      assignedTo: 'Priya Singh',
      responseDeadline: '2025-02-17T12:00:00',
      resolutionDeadline: '2025-02-18T08:00:00',
      status: 'Pending',
      responseStatus: 'Met',
      resolutionStatus: 'At Risk'
    }
  ];

  // Filter tickets
  const filteredTickets = allTickets.filter(ticket => {
    const matchesPriority = selectedPriority === 'All' || ticket.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || ticket.status === selectedStatus;
    return matchesPriority && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalActive: allTickets.filter(t => t.status !== 'Resolved').length,
    responseMet: allTickets.filter(t => t.responseStatus === 'Met').length,
    responseBreached: allTickets.filter(t => t.responseStatus === 'Breached').length,
    responseAtRisk: allTickets.filter(t => t.responseStatus === 'At Risk').length,
    resolutionOnTrack: allTickets.filter(t => t.resolutionStatus === 'On Track').length,
    resolutionAtRisk: allTickets.filter(t => t.resolutionStatus === 'At Risk').length,
    resolutionBreached: allTickets.filter(t => t.resolutionStatus === 'Breached').length,
    p1Tickets: allTickets.filter(t => t.priority === 'P1' && t.status !== 'Resolved').length,
    p2Tickets: allTickets.filter(t => t.priority === 'P2' && t.status !== 'Resolved').length,
  };

  const responseComplianceRate = ((stats.responseMet / allTickets.length) * 100).toFixed(1);
  const resolutionComplianceRate = (((allTickets.length - stats.resolutionBreached) / allTickets.length) * 100).toFixed(1);

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const diff = deadlineTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (hours < 2) return { text: `${hours}h ${minutes}m`, color: 'text-red-600', bgColor: 'bg-red-50' };
    if (hours < 4) return { text: `${hours}h ${minutes}m`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { text: `${hours}h ${minutes}m`, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-700';
      case 'P2': return 'bg-orange-100 text-orange-700';
      case 'P3': return 'bg-yellow-100 text-yellow-700';
      case 'P4': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: 'Met' | 'At Risk' | 'Breached' | 'On Track') => {
    switch (status) {
      case 'Met':
      case 'On Track':
        return { icon: <CheckCircle2 className="w-3 h-3" />, color: 'bg-green-100 text-green-700' };
      case 'At Risk':
        return { icon: <AlertCircle className="w-3 h-3" />, color: 'bg-yellow-100 text-yellow-700' };
      case 'Breached':
        return { icon: <AlertCircle className="w-3 h-3" />, color: 'bg-red-100 text-red-700' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SLA Performance Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time monitoring of service level agreements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Last 24 Hours
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Tickets</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalActive}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.p1Tickets} P1 • {stats.p2Tickets} P2
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Response Compliance</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{responseComplianceRate}%</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-green-600">{stats.responseMet} met</span>
            <span className="text-xs text-red-600">{stats.responseBreached} breached</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Resolution Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{resolutionComplianceRate}%</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-green-600">{stats.resolutionOnTrack} on track</span>
            <span className="text-xs text-red-600">{stats.resolutionBreached} breached</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">At Risk</span>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {stats.responseAtRisk + stats.resolutionAtRisk}
          </div>
          <div className="text-xs text-gray-500 mt-1">Require attention</div>
        </div>
      </div>

      {/* SLA Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Response SLA Status</h2>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Met ({stats.responseMet})</span>
                <span className="font-medium text-gray-900">
                  {((stats.responseMet / allTickets.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.responseMet / allTickets.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">At Risk ({stats.responseAtRisk})</span>
                <span className="font-medium text-gray-900">
                  {((stats.responseAtRisk / allTickets.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.responseAtRisk / allTickets.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Breached ({stats.responseBreached})</span>
                <span className="font-medium text-gray-900">
                  {((stats.responseBreached / allTickets.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(stats.responseBreached / allTickets.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resolution SLA Status</h2>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">On Track ({stats.resolutionOnTrack})</span>
                <span className="font-medium text-gray-900">
                  {((stats.resolutionOnTrack / allTickets.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.resolutionOnTrack / allTickets.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">At Risk ({stats.resolutionAtRisk})</span>
                <span className="font-medium text-gray-900">
                  {((stats.resolutionAtRisk / allTickets.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.resolutionAtRisk / allTickets.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Breached ({stats.resolutionBreached})</span>
                <span className="font-medium text-gray-900">
                  {((stats.resolutionBreached / allTickets.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(stats.resolutionBreached / allTickets.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Tickets SLA Monitor</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time SLA status for all active tickets</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response SLA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolution SLA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const responseTime = getTimeRemaining(ticket.responseDeadline);
                const resolutionTime = getTimeRemaining(ticket.resolutionDeadline);
                const responseBadge = getStatusBadge(ticket.responseStatus);
                const resolutionBadge = getStatusBadge(ticket.resolutionStatus);

                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{ticket.issueTitle}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${responseBadge.color}`}>
                        {responseBadge.icon}
                        {ticket.responseStatus}
                      </div>
                      <div className={`text-xs mt-1 ${responseTime.color}`}>{responseTime.text}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${resolutionBadge.color}`}>
                        {resolutionBadge.icon}
                        {ticket.resolutionStatus}
                      </div>
                      <div className={`text-xs mt-1 ${resolutionTime.color}`}>{resolutionTime.text}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.assignedTo}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push(`/after-sales-service/service-requests/view/${ticket.id}`)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
