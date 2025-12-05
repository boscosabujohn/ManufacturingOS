'use client';

import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Plus, MoreVertical } from 'lucide-react';

export default function RegulatoryReportingPage() {
    const [reports, setReports] = useState([
        { id: 1, name: 'Annual GDPR Audit', type: 'GDPR', date: '2024-03-01', status: 'Generated', size: '2.4 MB' },
        { id: 2, name: 'Q1 SOC 2 Compliance', type: 'SOC 2', date: '2024-04-01', status: 'Scheduled', size: '-' },
        { id: 3, name: 'Monthly Access Log Review', type: 'Internal', date: '2024-03-31', status: 'Generated', size: '15.2 MB' },
        { id: 4, name: 'HIPAA Security Assessment', type: 'HIPAA', date: '2024-02-15', status: 'Generated', size: '5.8 MB' },
    ]);

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full max-w-full mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Regulatory Reporting</h1>
                        <p className="text-sm text-gray-500 mt-1">Generate and manage compliance reports</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Generate New Report
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap flex items-center gap-2">
                        <Filter className="w-4 h-4" /> All Reports
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                        GDPR
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                        SOC 2
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                        HIPAA
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                        Internal
                    </button>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <FileText className="w-8 h-8 text-purple-600" />
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded-full">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{report.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{report.type}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {report.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${report.status === 'Generated' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}></span>
                                    {report.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">{report.size}</span>
                                {report.status === 'Generated' ? (
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Processing...</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
