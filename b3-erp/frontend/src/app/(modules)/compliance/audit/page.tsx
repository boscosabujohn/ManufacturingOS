'use client';

import React, { useState } from 'react';
import { Clock, Search, Filter, Download, User, Shield, AlertCircle, FileText } from 'lucide-react';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([
        { id: 'LOG-8921', action: 'User Login', user: 'alice.smith@example.com', ip: '192.168.1.45', time: '2024-03-21 10:45:22', status: 'success', details: 'Successful login via SSO' },
        { id: 'LOG-8920', action: 'File Access', user: 'bob.jones@example.com', ip: '192.168.1.12', time: '2024-03-21 10:42:15', status: 'success', details: 'Accessed "Q4 Financials.pdf"' },
        { id: 'LOG-8919', action: 'Failed Login', user: 'unknown', ip: '45.23.12.99', time: '2024-03-21 10:40:01', status: 'failure', details: 'Invalid password attempt' },
        { id: 'LOG-8918', action: 'Permission Change', user: 'admin', ip: '10.0.0.5', time: '2024-03-21 10:35:00', status: 'success', details: 'Updated role "Editor" permissions' },
        { id: 'LOG-8917', action: 'Data Export', user: 'charlie.brown@example.com', ip: '192.168.1.88', time: '2024-03-21 10:30:45', status: 'warning', details: 'Large dataset export (5000+ records)' },
    ]);

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                        <p className="text-sm text-gray-500 mt-1">Detailed record of system events and user activities</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search logs by user, action, or IP..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">IP Address</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{log.time}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.ip}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-green-100 text-green-800' :
                                                log.status === 'failure' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {log.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
