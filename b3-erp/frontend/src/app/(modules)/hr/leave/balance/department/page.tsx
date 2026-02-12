'use client';

import React, { useState } from 'react';
import {
    Building2,
    Download,
    TrendingUp,
    Users,
    Calendar,
    BarChart3
} from 'lucide-react';

interface DepartmentBalance {
    department: string;
    totalEmployees: number;
    totalAnnualLeave: { available: number; total: number };
    totalSickLeave: { available: number; total: number };
    totalCasualLeave: { available: number; total: number };
    avgAvailable: number;
    utilizationRate: number;
}

export default function DepartmentBalancePage() {
    const [selectedYear, setSelectedYear] = useState('2025');

    const departmentBalances: DepartmentBalance[] = [
        {
            department: 'Production',
            totalEmployees: 45,
            totalAnnualLeave: { available: 580, total: 945 },
            totalSickLeave: { available: 380, total: 540 },
            totalCasualLeave: { available: 165, total: 270 },
            avgAvailable: 25,
            utilizationRate: 38
        },
        {
            department: 'Quality Assurance',
            totalEmployees: 12,
            totalAnnualLeave: { available: 180, total: 252 },
            totalSickLeave: { available: 110, total: 144 },
            totalCasualLeave: { available: 50, total: 72 },
            avgAvailable: 28,
            utilizationRate: 32
        },
        {
            department: 'IT',
            totalEmployees: 18,
            totalAnnualLeave: { available: 250, total: 378 },
            totalSickLeave: { available: 150, total: 216 },
            totalCasualLeave: { available: 70, total: 108 },
            avgAvailable: 26,
            utilizationRate: 35
        },
        {
            department: 'Human Resources',
            totalEmployees: 8,
            totalAnnualLeave: { available: 120, total: 168 },
            totalSickLeave: { available: 70, total: 96 },
            totalCasualLeave: { available: 35, total: 48 },
            avgAvailable: 28,
            utilizationRate: 30
        },
        {
            department: 'Finance',
            totalEmployees: 10,
            totalAnnualLeave: { available: 160, total: 210 },
            totalSickLeave: { available: 95, total: 120 },
            totalCasualLeave: { available: 45, total: 60 },
            avgAvailable: 30,
            utilizationRate: 25
        },
        {
            department: 'Warehouse',
            totalEmployees: 20,
            totalAnnualLeave: { available: 280, total: 420 },
            totalSickLeave: { available: 160, total: 240 },
            totalCasualLeave: { available: 80, total: 120 },
            avgAvailable: 26,
            utilizationRate: 36
        }
    ];

    const totalEmployees = departmentBalances.reduce((sum, d) => sum + d.totalEmployees, 0);
    const avgUtilization = Math.round(departmentBalances.reduce((sum, d) => sum + d.utilizationRate, 0) / departmentBalances.length);
    const avgAvailableDays = Math.round(departmentBalances.reduce((sum, d) => sum + d.avgAvailable, 0) / departmentBalances.length);

    const getUtilizationColor = (rate: number) => {
        if (rate >= 50) return 'text-green-400 bg-green-500/20';
        if (rate >= 30) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const getBarWidth = (available: number, total: number) => {
        return `${(available / total) * 100}%`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-purple-500" />
                            Department Balance
                        </h1>
                        <p className="text-gray-400 mt-1">Leave balance summary by department</p>
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Departments</p>
                        <p className="text-3xl font-bold text-white">{departmentBalances.length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{totalEmployees}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Avg. Available Days</p>
                        <p className="text-3xl font-bold text-white">{avgAvailableDays}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Avg. Utilization</p>
                        <p className="text-3xl font-bold text-white">{avgUtilization}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {departmentBalances.map((dept) => (
                        <div key={dept.department} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{dept.department}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                        <Users className="w-4 h-4" />
                                        {dept.totalEmployees} employees
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUtilizationColor(dept.utilizationRate)}`}>
                                        {dept.utilizationRate}% utilized
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">Avg. {dept.avgAvailable} days/employee</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Annual Leave</span>
                                        <span className="text-white">{dept.totalAnnualLeave.available}/{dept.totalAnnualLeave.total}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: getBarWidth(dept.totalAnnualLeave.available, dept.totalAnnualLeave.total) }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Sick Leave</span>
                                        <span className="text-white">{dept.totalSickLeave.available}/{dept.totalSickLeave.total}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 rounded-full"
                                            style={{ width: getBarWidth(dept.totalSickLeave.available, dept.totalSickLeave.total) }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Casual Leave</span>
                                        <span className="text-white">{dept.totalCasualLeave.available}/{dept.totalCasualLeave.total}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: getBarWidth(dept.totalCasualLeave.available, dept.totalCasualLeave.total) }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        Leave Utilization by Department
                    </h3>
                    <div className="space-y-3">
                        {departmentBalances.sort((a, b) => b.utilizationRate - a.utilizationRate).map((dept) => (
                            <div key={dept.department} className="flex items-center gap-4">
                                <div className="w-32 text-sm text-gray-300">{dept.department}</div>
                                <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${dept.utilizationRate >= 40 ? 'bg-green-500' : dept.utilizationRate >= 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${dept.utilizationRate}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right text-sm font-medium text-white">{dept.utilizationRate}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
