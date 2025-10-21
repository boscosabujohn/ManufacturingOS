'use client'

import { useState } from 'react'
import { CheckCircle, User, Clock, Star } from 'lucide-react'

export default function ResolvedTickets() {
  const [tickets] = useState([
    { id: '1', ticketId: 'TKT-2024-1040', subject: 'Database backup not running', requester: 'David Brown', category: 'System', priority: 'high', resolvedBy: 'Vikram Singh', resolvedAt: '2024-10-21 11:30', resolutionTime: '4h 15m', satisfaction: 5 },
    { id: '2', ticketId: 'TKT-2024-1039', subject: 'Password reset not working', requester: 'Lisa Anderson', category: 'Access', priority: 'medium', resolvedBy: 'Rajesh Kumar', resolvedAt: '2024-10-21 10:45', resolutionTime: '2h 30m', satisfaction: 4 },
    { id: '3', ticketId: 'TKT-2024-1038', subject: 'Slow report generation', requester: 'Tom Martinez', category: 'Performance', priority: 'medium', resolvedBy: 'Amit Patel', resolvedAt: '2024-10-21 09:20', resolutionTime: '6h 45m', satisfaction: 5 }
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resolved Tickets</h1>
          <p className="text-gray-600 mt-1">Successfully resolved support tickets</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">{tickets.length}</div>
          <div className="text-sm text-gray-600">Resolved Today</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolution Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><code className="text-sm">{ticket.ticketId}</code></td>
                  <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm">{ticket.resolvedBy}</td>
                  <td className="px-6 py-4 text-sm">{ticket.resolutionTime}</td>
                  <td className="px-6 py-4"><div className="flex">{Array.from({length: ticket.satisfaction}).map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
