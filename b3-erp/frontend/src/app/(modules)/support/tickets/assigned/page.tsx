'use client'

import { useState } from 'react'
import { Ticket, User, Clock, Search, CheckCircle, AlertCircle } from 'lucide-react'

export default function AssignedTickets() {
  const [tickets] = useState([
    { id: '1', ticketId: 'TKT-2024-1046', subject: 'Unable to access CRM module', requester: 'Sarah Johnson', category: 'Access Issue', priority: 'high', assignee: 'Priya Sharma', status: 'In Progress', createdAt: '2024-10-21 08:30', slaRemaining: '5h 12m' },
    { id: '2', ticketId: 'TKT-2024-1045', subject: 'Report generation failing', requester: 'Mike Wilson', category: 'Bug', priority: 'medium', assignee: 'Amit Patel', status: 'Assigned', createdAt: '2024-10-21 07:45', slaRemaining: '18h 30m' },
    { id: '3', ticketId: 'TKT-2024-1044', subject: 'How to export inventory data?', requester: 'Emily Davis', category: 'How-To', priority: 'low', assignee: 'Sneha Reddy', status: 'Assigned', createdAt: '2024-10-21 06:20', slaRemaining: '46h 15m' },
    { id: '4', ticketId: 'TKT-2024-1043', subject: 'Email notifications not being sent', requester: 'David Brown', category: 'System Error', priority: 'high', assignee: 'Vikram Singh', status: 'In Progress', createdAt: '2024-10-20 16:30', slaRemaining: '1h 05m' }
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assigned Tickets</h1>
          <p className="text-gray-600 mt-1">Tickets assigned to team members</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-purple-600">{tickets.length}</div>
          <div className="text-sm text-gray-600">Assigned</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><code className="text-sm">{ticket.ticketId}</code></td>
                  <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm">{ticket.assignee}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{ticket.status}</span></td>
                  <td className="px-6 py-4 text-sm">{ticket.slaRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
