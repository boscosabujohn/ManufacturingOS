'use client';

import React, { useState } from 'react';
import {
    Calendar,
    Download,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Clock,
    Users
} from 'lucide-react';

interface MonthlyAttendance {
    id: string;
    employeeId: string;
    name: string;
    department: string;
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    halfDays: number;
    leaves: number;
    overtime: number;
    attendancePercentage: number;
}

export default function MonthlyAttendancePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('2025-01');

    const attendance: MonthlyAttendance[] = [
        {
            id: '1',
            employeeId: 'EMP001',
            name: 'Sarah Johnson',
            department: 'Human Resources',
            totalDays: 22,
            present: 20,
            absent: 0,
            late: 1,
            halfDays: 0,
            leaves: 1,
            overtime: 8,
            attendancePercentage: 95
        },
        {
            id: '2',
            employeeId: 'EMP002',
            name: 'Michael Chen',
            department: 'Production',
            totalDays: 22,
            present: 18,
            absent: 1,
            late: 3,
            halfDays: 1,
            leaves: 2,
            overtime: 15,
            attendancePercentage: 86
        },
        {
            id: '3',
            employeeId: 'EMP003',
            name: 'Emily Davis',
            department: 'Quality Assurance',
            totalDays: 22,
            present: 21,
            absent: 0,
            late: 0,
            halfDays: 0,
            leaves: 1,
            overtime: 5,
            attendancePercentage: 98
        },
        {
            id: '4',
            employeeId: 'EMP004',
            name: 'David Wilson',
            department: 'Production',
            totalDays: 22,
            present: 16,
            absent: 3,
            late: 2,
            halfDays: 1,
            leaves: 2,
            overtime: 10,
            attendancePercentage: 77
        },
        {
            id: '5',
            employeeId: 'EMP005',
            name: 'Jennifer Brown',
            department: 'Finance',
            totalDays: 22,
            present: 22,
            absent: 0,
            late: 0,
            halfDays: 0,
            leaves: 0,
            overtime: 12,
            attendancePercentage: 100
        }
    ];

    const departments = Array.from(new Set(attendance.map(a => a.department)));

    const filteredAttendance = attendance.filter(att => {
        const matchesSearch = att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            att.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || att.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 95) return 'text-green-400';
        if (percentage >= 80) return 'text-yellow-400';
        return 'text-red-400';
    };

    const totalStats = {
        avgAttendance: Math.round(attendance.reduce((sum, a) => sum + a.attendancePercentage, 0) / attendance.length),
        totalPresent: attendance.reduce((sum, a) => sum + a.present, 0),
        totalAbsent: attendance.reduce((sum, a) => sum + a.absent, 0),
        totalOvertime: attendance.reduce((sum, a) => sum + a.overtime, 0)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-blue-500" />
                            Monthly Attendance
                        </h1>
                        <p className="text-gray-400 mt-1">View monthly attendance summary</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg ml-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Avg. Attendance</p>
                        <p className="text-3xl font-bold text-white">{totalStats.avgAttendance}%</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Present Days</p>
                        <p className="text-3xl font-bold text-white">{totalStats.totalPresent}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Total Absent Days</p>
                        <p className="text-3xl font-bold text-white">{totalStats.totalAbsent}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Overtime (hrs)</p>
                        <p className="text-3xl font-bold text-white">{totalStats.totalOvertime}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Department</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Working Days</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Present</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Absent</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Late</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Half Days</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Leaves</th>
                                <th className="text-center p-4 text-gray-400 font-medium">OT (hrs)</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.map((att) => (
                                <tr key={att.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {att.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{att.name}</p>
                                                <p className="text-sm text-gray-400">{att.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300">{att.department}</td>
                                    <td className="p-4 text-center text-gray-300">{att.totalDays}</td>
                                    <td className="p-4 text-center text-green-400 font-medium">{att.present}</td>
                                    <td className="p-4 text-center text-red-400 font-medium">{att.absent}</td>
                                    <td className="p-4 text-center text-yellow-400 font-medium">{att.late}</td>
                                    <td className="p-4 text-center text-orange-400 font-medium">{att.halfDays}</td>
                                    <td className="p-4 text-center text-purple-400 font-medium">{att.leaves}</td>
                                    <td className="p-4 text-center text-blue-400 font-medium">{att.overtime}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${att.attendancePercentage >= 95 ? 'bg-green-500' : att.attendancePercentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${att.attendancePercentage}%` }}
                                                ></div>
                                            </div>
                                            <span className={`font-medium ${getPercentageColor(att.attendancePercentage)}`}>
                                                {att.attendancePercentage}%
                                            </span>
                                        </div>
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
