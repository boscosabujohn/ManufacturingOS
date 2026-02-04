'use client';

import React, { useState } from 'react';
import { Lock, User, Download, Trash2, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react';

export default function GDPRPage() {
    const [requests, setRequests] = useState([
        { id: 'DSR-2024-001', user: 'Alice Smith', type: 'Data Export', status: 'completed', date: '2024-03-15', deadline: '2024-04-14' },
        { id: 'DSR-2024-002', user: 'Bob Jones', type: 'Right to be Forgotten', status: 'processing', date: '2024-03-18', deadline: '2024-04-17' },
        { id: 'DSR-2024-003', user: 'Charlie Brown', type: 'Data Correction', status: 'pending', date: '2024-03-20', deadline: '2024-04-19' },
    ]);

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">GDPR Controls</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage Data Subject Requests (DSRs) and privacy settings</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Log
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Privacy Settings
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Requests</p>
                        <p className="text-3xl font-bold text-gray-900">142</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600">135</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Avg. Response Time</p>
                        <p className="text-3xl font-bold text-blue-600">4 Days</p>
                    </div>
                </div>

                {/* Requests List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Data Subject Requests</h2>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Request ID</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date Received</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{req.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                            {req.user[0]}
                                        </div>
                                        {req.user}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{req.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                req.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{req.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{req.deadline}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
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
