'use client'

import { useState } from 'react'
import { Shield, User, Clock, FileText, Search, Filter, Download } from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  module: string
  record: string
  oldValue: string
  newValue: string
  ipAddress: string
}

export default function AuditTrailPage() {
  const [logs] = useState<AuditLog[]>([
    { id: 'AUD-001', timestamp: '2025-10-18 14:30:25', user: 'john.doe@company.com', action: 'UPDATE', module: 'Journal Entry', record: 'JE-2025-123', oldValue: 'Amount: 50000', newValue: 'Amount: 55000', ipAddress: '192.168.1.10' },
    { id: 'AUD-002', timestamp: '2025-10-18 14:15:10', user: 'jane.smith@company.com', action: 'CREATE', module: 'Invoice', record: 'INV-2025-456', oldValue: '-', newValue: 'Status: Draft', ipAddress: '192.168.1.11' },
    { id: 'AUD-003', timestamp: '2025-10-18 13:45:30', user: 'robert.brown@company.com', action: 'DELETE', module: 'Payment', record: 'PAY-2025-789', oldValue: 'Status: Draft', newValue: '-', ipAddress: '192.168.1.12' },
    { id: 'AUD-004', timestamp: '2025-10-18 13:30:15', user: 'sarah.wilson@company.com', action: 'APPROVE', module: 'Journal Entry', record: 'JE-2025-120', oldValue: 'Status: Pending', newValue: 'Status: Approved', ipAddress: '192.168.1.13' }
  ])

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-700'
      case 'UPDATE': return 'bg-blue-100 text-blue-700'
      case 'DELETE': return 'bg-red-100 text-red-700'
      case 'APPROVE': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
            <p className="text-gray-600 mt-1">Complete transaction and change history</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export Logs
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Actions</option>
              <option>CREATE</option>
              <option>UPDATE</option>
              <option>DELETE</option>
              <option>APPROVE</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Modules</option>
              <option>Journal Entry</option>
              <option>Invoice</option>
              <option>Payment</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Module</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Record</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.module}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{log.record}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      {log.oldValue !== '-' && (
                        <div className="text-red-600">Old: {log.oldValue}</div>
                      )}
                      {log.newValue !== '-' && (
                        <div className="text-green-600">New: {log.newValue}</div>
                      )}
                    </div>
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
