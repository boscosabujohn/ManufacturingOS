'use client';

import React, { useState } from 'react';
import {
    BarChart3,
    Download,
    Filter,
    Calendar,
    Clock,
    Users,
    Briefcase,
    FileText,
    Printer,
    TrendingUp
} from 'lucide-react';

interface TimesheetReport {
    employeeId: string;
    employeeName: string;
    department: string;
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    overtime: number;
    projects: number;
    utilizationRate: number;
}

export default function TimesheetReportsPage() {
    const [selectedMonth, setSelectedMonth] = useState('2025-01');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [reportType, setReportType] = useState('summary');

    const reports: TimesheetReport[] = [
        { employeeId: 'EMP001', employeeName: 'Sarah Johnson', department: 'Human Resources', totalHours: 168, billableHours: 120, nonBillableHours: 48, overtime: 8, projects: 3, utilizationRate: 71 },
        { employeeId: 'EMP002', employeeName: 'Michael Chen', department: 'Production', totalHours: 180, billableHours: 160, nonBillableHours: 20, overtime: 20, projects: 2, utilizationRate: 89 },
        { employeeId: 'EMP003', employeeName: 'Emily Davis', department: 'Quality Assurance', totalHours: 160, billableHours: 140, nonBillableHours: 20, overtime: 0, projects: 4, utilizationRate: 88 },
        { employeeId: 'EMP004', employeeName: 'David Wilson', department: 'Production', totalHours: 176, billableHours: 150, nonBillableHours: 26, overtime: 16, projects: 2, utilizationRate: 85 },
        { employeeId: 'EMP005', employeeName: 'Jennifer Brown', department: 'Finance', totalHours: 160, billableHours: 100, nonBillableHours: 60, overtime: 0, projects: 2, utilizationRate: 63 },
        { employeeId: 'EMP006', employeeName: 'Robert Martinez', department: 'IT', totalHours: 184, billableHours: 170, nonBillableHours: 14, overtime: 24, projects: 5, utilizationRate: 92 }
    ];

    const departments = Array.from(new Set(reports.map(r => r.department)));

    const filteredReports = reports.filter(report =>
        departmentFilter === 'all' || report.department === departmentFilter
    );

    const totalStats = {
        totalHours: filteredReports.reduce((sum, r) => sum + r.totalHours, 0),
        billableHours: filteredReports.reduce((sum, r) => sum + r.billableHours, 0),
        nonBillableHours: filteredReports.reduce((sum, r) => sum + r.nonBillableHours, 0),
        overtime: filteredReports.reduce((sum, r) => sum + r.overtime, 0),
        avgUtilization: Math.round(filteredReports.reduce((sum, r) => sum + r.utilizationRate, 0) / filteredReports.length)
    };

    const departmentStats = departments.map(dept => {
        const deptReports = reports.filter(r => r.department === dept);
        return {
            department: dept,
            employees: deptReports.length,
            totalHours: deptReports.reduce((sum, r) => sum + r.totalHours, 0),
            billableHours: deptReports.reduce((sum, r) => sum + r.billableHours, 0),
            avgUtilization: Math.round(deptReports.reduce((sum, r) => sum + r.utilizationRate, 0) / deptReports.length)
        };
    });

    const getUtilizationColor = (rate: number) => {
        if (rate >= 85) return 'text-green-400';
        if (rate >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                            Timesheet Reports
                        </h1>
                        <p className="text-gray-400 mt-1">Analyze timesheet data and utilization</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Hours</p>
                        <p className="text-3xl font-bold text-white">{totalStats.totalHours}h</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Billable Hours</p>
                        <p className="text-3xl font-bold text-white">{totalStats.billableHours}h</p>
                    </div>
                    <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Non-Billable</p>
                        <p className="text-3xl font-bold text-white">{totalStats.nonBillableHours}h</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Overtime</p>
                        <p className="text-3xl font-bold text-white">{totalStats.overtime}h</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-purple-400 text-sm">Avg. Utilization</p>
                            <p className="text-2xl font-bold text-white">{totalStats.avgUtilization}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
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
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => setReportType('summary')}
                            className={`px-4 py-2 rounded-lg text-sm ${reportType === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            Summary
                        </button>
                        <button
                            onClick={() => setReportType('department')}
                            className={`px-4 py-2 rounded-lg text-sm ${reportType === 'department' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            By Department
                        </button>
                        <button
                            onClick={() => setReportType('employee')}
                            className={`px-4 py-2 rounded-lg text-sm ${reportType === 'employee' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            By Employee
                        </button>
                    </div>
                </div>

                {reportType === 'employee' && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Department</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Total Hours</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Billable</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Non-Billable</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Overtime</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Projects</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Utilization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((report) => (
                                    <tr key={report.employeeId} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {report.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{report.employeeName}</p>
                                                    <p className="text-xs text-gray-400">{report.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{report.department}</td>
                                        <td className="p-4 text-center text-white font-medium">{report.totalHours}h</td>
                                        <td className="p-4 text-center text-green-400 font-medium">{report.billableHours}h</td>
                                        <td className="p-4 text-center text-gray-400">{report.nonBillableHours}h</td>
                                        <td className="p-4 text-center">
                                            {report.overtime > 0 ? (
                                                <span className="text-orange-400 font-medium">{report.overtime}h</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center text-blue-400">{report.projects}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${report.utilizationRate >= 85 ? 'bg-green-500' : report.utilizationRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${report.utilizationRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`font-medium ${getUtilizationColor(report.utilizationRate)}`}>
                                                    {report.utilizationRate}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {reportType === 'department' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {departmentStats.map((dept) => (
                            <div key={dept.department} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{dept.department}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                                            <Users className="w-4 h-4" />
                                            {dept.employees} employees
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{dept.totalHours}h</p>
                                        <p className="text-sm text-gray-400">Total Hours</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="p-3 bg-gray-700/30 rounded-lg">
                                        <p className="text-xs text-gray-500">Billable Hours</p>
                                        <p className="text-xl font-bold text-green-400">{dept.billableHours}h</p>
                                    </div>
                                    <div className="p-3 bg-gray-700/30 rounded-lg">
                                        <p className="text-xs text-gray-500">Avg. Utilization</p>
                                        <p className={`text-xl font-bold ${getUtilizationColor(dept.avgUtilization)}`}>{dept.avgUtilization}%</p>
                                    </div>
                                </div>

                                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${dept.avgUtilization >= 85 ? 'bg-green-500' : dept.avgUtilization >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${dept.avgUtilization}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {reportType === 'summary' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                Hours Distribution
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Billable Hours</span>
                                        <span className="text-green-400 font-medium">{totalStats.billableHours}h ({Math.round((totalStats.billableHours / totalStats.totalHours) * 100)}%)</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${(totalStats.billableHours / totalStats.totalHours) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Non-Billable Hours</span>
                                        <span className="text-gray-300 font-medium">{totalStats.nonBillableHours}h ({Math.round((totalStats.nonBillableHours / totalStats.totalHours) * 100)}%)</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gray-500" style={{ width: `${(totalStats.nonBillableHours / totalStats.totalHours) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Overtime Hours</span>
                                        <span className="text-orange-400 font-medium">{totalStats.overtime}h</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500" style={{ width: `${(totalStats.overtime / totalStats.totalHours) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-purple-400" />
                                Department Comparison
                            </h3>
                            <div className="space-y-3">
                                {departmentStats.map(dept => (
                                    <div key={dept.department} className="flex items-center gap-3">
                                        <div className="w-32 text-sm text-gray-300 truncate">{dept.department}</div>
                                        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${dept.avgUtilization >= 85 ? 'bg-green-500' : dept.avgUtilization >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${dept.avgUtilization}%` }}
                                            ></div>
                                        </div>
                                        <div className={`w-12 text-right text-sm font-medium ${getUtilizationColor(dept.avgUtilization)}`}>
                                            {dept.avgUtilization}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
