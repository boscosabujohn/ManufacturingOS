'use client';

import React, { useState } from 'react';
import {
    BarChart3,
    Download,
    Filter,
    Calendar,
    Users,
    TrendingUp,
    TrendingDown,
    Clock,
    FileText,
    Printer
} from 'lucide-react';

interface AttendanceReport {
    id: string;
    reportName: string;
    reportType: 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
    department: string;
    generatedDate: string;
    period: string;
    totalEmployees: number;
    avgAttendance: number;
    status: 'Ready' | 'Generating' | 'Failed';
}

export default function AttendanceReportsPage() {
    const [reportType, setReportType] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-01-31' });

    const reports: AttendanceReport[] = [
        {
            id: '1',
            reportName: 'January 2025 Monthly Report',
            reportType: 'Monthly',
            department: 'All Departments',
            generatedDate: '2025-02-01',
            period: 'Jan 1 - Jan 31, 2025',
            totalEmployees: 156,
            avgAttendance: 94.5,
            status: 'Ready'
        },
        {
            id: '2',
            reportName: 'Production Team Weekly Report',
            reportType: 'Weekly',
            department: 'Production',
            generatedDate: '2025-01-27',
            period: 'Jan 20 - Jan 26, 2025',
            totalEmployees: 45,
            avgAttendance: 92.3,
            status: 'Ready'
        },
        {
            id: '3',
            reportName: 'HR Department Monthly Report',
            reportType: 'Monthly',
            department: 'Human Resources',
            generatedDate: '2025-02-01',
            period: 'Jan 1 - Jan 31, 2025',
            totalEmployees: 15,
            avgAttendance: 98.2,
            status: 'Ready'
        },
        {
            id: '4',
            reportName: 'Daily Attendance Summary',
            reportType: 'Daily',
            department: 'All Departments',
            generatedDate: '2025-01-31',
            period: 'Jan 31, 2025',
            totalEmployees: 156,
            avgAttendance: 95.8,
            status: 'Ready'
        },
        {
            id: '5',
            reportName: 'Q4 2024 Custom Report',
            reportType: 'Custom',
            department: 'All Departments',
            generatedDate: '2025-01-05',
            period: 'Oct 1 - Dec 31, 2024',
            totalEmployees: 152,
            avgAttendance: 93.1,
            status: 'Ready'
        }
    ];

    const departments = ['Human Resources', 'Production', 'Quality Assurance', 'Finance', 'IT', 'Sales'];

    const filteredReports = reports.filter(report => {
        const matchesType = reportType === 'all' || report.reportType === reportType;
        const matchesDept = departmentFilter === 'all' || report.department === departmentFilter || report.department === 'All Departments';
        return matchesType && matchesDept;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ready': return 'bg-green-500/20 text-green-400';
            case 'Generating': return 'bg-yellow-500/20 text-yellow-400';
            case 'Failed': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Daily': return 'bg-blue-500/20 text-blue-400';
            case 'Weekly': return 'bg-purple-500/20 text-purple-400';
            case 'Monthly': return 'bg-green-500/20 text-green-400';
            case 'Custom': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                            Attendance Reports
                        </h1>
                        <p className="text-gray-400 mt-1">Generate and view attendance reports</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
                        Generate New Report
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Reports</p>
                        <p className="text-3xl font-bold text-white">{reports.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Avg. Attendance</p>
                        <p className="text-3xl font-bold text-white">
                            {(reports.reduce((sum, r) => sum + r.avgAttendance, 0) / reports.length).toFixed(1)}%
                        </p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-purple-400 text-sm">Trend</p>
                            <p className="text-xl font-bold text-white">+2.3%</p>
                        </div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Reports This Month</p>
                        <p className="text-3xl font-bold text-white">{reports.filter(r => r.generatedDate.startsWith('2025-01')).length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <h3 className="text-white font-medium mb-3">Generate Custom Report</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Department</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <BarChart3 className="w-4 h-4" />
                                Generate
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Custom">Custom</option>
                    </select>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3">
                    {filteredReports.map((report) => (
                        <div key={report.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{report.reportName}</h3>
                                        <p className="text-gray-400 text-sm">{report.department}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.reportType)}`}>
                                                {report.reportType}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-2">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-gray-500">Period</p>
                                            <p className="text-sm text-white">{report.period}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Employees</p>
                                            <p className="text-sm text-white">{report.totalEmployees}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Avg. Attendance</p>
                                            <p className="text-sm text-green-400 font-medium">{report.avgAttendance}%</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                            <Printer className="w-4 h-4" /> Print
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
