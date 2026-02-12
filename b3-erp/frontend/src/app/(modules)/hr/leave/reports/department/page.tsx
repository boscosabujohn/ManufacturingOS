'use client';

import React, { useState } from 'react';
import {
    Building2,
    Download,
    Filter,
    Users,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';

interface DepartmentReport {
    department: string;
    totalEmployees: number;
    totalLeaveDays: number;
    usedDays: number;
    availableDays: number;
    utilizationRate: number;
    avgLeavesPerEmployee: number;
    absenteeismRate: number;
    topLeaveType: string;
}

export default function DepartmentReportPage() {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedMonth, setSelectedMonth] = useState('all');

    const departmentReports: DepartmentReport[] = [
        {
            department: 'Production',
            totalEmployees: 45,
            totalLeaveDays: 1260,
            usedDays: 520,
            availableDays: 740,
            utilizationRate: 41,
            avgLeavesPerEmployee: 11.6,
            absenteeismRate: 4.2,
            topLeaveType: 'Sick Leave'
        },
        {
            department: 'Quality Assurance',
            totalEmployees: 12,
            totalLeaveDays: 336,
            usedDays: 105,
            availableDays: 231,
            utilizationRate: 31,
            avgLeavesPerEmployee: 8.8,
            absenteeismRate: 2.8,
            topLeaveType: 'Annual Leave'
        },
        {
            department: 'IT',
            totalEmployees: 18,
            totalLeaveDays: 504,
            usedDays: 180,
            availableDays: 324,
            utilizationRate: 36,
            avgLeavesPerEmployee: 10.0,
            absenteeismRate: 3.1,
            topLeaveType: 'Annual Leave'
        },
        {
            department: 'Human Resources',
            totalEmployees: 8,
            totalLeaveDays: 224,
            usedDays: 72,
            availableDays: 152,
            utilizationRate: 32,
            avgLeavesPerEmployee: 9.0,
            absenteeismRate: 2.5,
            topLeaveType: 'Casual Leave'
        },
        {
            department: 'Finance',
            totalEmployees: 10,
            totalLeaveDays: 280,
            usedDays: 65,
            availableDays: 215,
            utilizationRate: 23,
            avgLeavesPerEmployee: 6.5,
            absenteeismRate: 1.8,
            topLeaveType: 'Annual Leave'
        },
        {
            department: 'Warehouse',
            totalEmployees: 20,
            totalLeaveDays: 560,
            usedDays: 290,
            availableDays: 270,
            utilizationRate: 52,
            avgLeavesPerEmployee: 14.5,
            absenteeismRate: 5.6,
            topLeaveType: 'Sick Leave'
        }
    ];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const totalEmployees = departmentReports.reduce((sum, d) => sum + d.totalEmployees, 0);
    const totalUsed = departmentReports.reduce((sum, d) => sum + d.usedDays, 0);
    const avgAbsenteeism = (departmentReports.reduce((sum, d) => sum + d.absenteeismRate, 0) / departmentReports.length).toFixed(1);
    const highAbsenteeismDepts = departmentReports.filter(d => d.absenteeismRate > 4);

    const getAbsenteeismColor = (rate: number) => {
        if (rate <= 3) return 'text-green-400 bg-green-500/20';
        if (rate <= 5) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const getUtilizationBar = (rate: number) => {
        if (rate >= 50) return 'bg-green-500';
        if (rate >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-purple-500" />
                            Department Report
                        </h1>
                        <p className="text-gray-400 mt-1">Leave analytics by department</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Months</option>
                            {months.map((month, index) => (
                                <option key={month} value={index + 1}>{month}</option>
                            ))}
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Departments</p>
                        <p className="text-3xl font-bold text-white">{departmentReports.length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{totalEmployees}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Days Used</p>
                        <p className="text-3xl font-bold text-white">{totalUsed.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Avg. Absenteeism</p>
                        <p className="text-3xl font-bold text-white">{avgAbsenteeism}%</p>
                    </div>
                </div>

                {highAbsenteeismDepts.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-medium">High Absenteeism Alert</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {highAbsenteeismDepts.map(d => d.department).join(', ')} have absenteeism rates above 4%. Consider investigating root causes.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 font-medium">Department</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Employees</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Total Days</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Used</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Utilization</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Avg/Employee</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Absenteeism</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Top Leave Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departmentReports.map((dept) => (
                                    <tr key={dept.department} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <span className="text-white font-medium">{dept.department}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-300">{dept.totalEmployees}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-300">{dept.totalLeaveDays}</td>
                                        <td className="p-4 text-center text-green-400">{dept.usedDays}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getUtilizationBar(dept.utilizationRate)}`}
                                                        style={{ width: `${dept.utilizationRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-white text-sm w-10">{dept.utilizationRate}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-300">{dept.avgLeavesPerEmployee.toFixed(1)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-sm ${getAbsenteeismColor(dept.absenteeismRate)}`}>
                                                {dept.absenteeismRate}%
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                {dept.topLeaveType}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
