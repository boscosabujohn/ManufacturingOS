'use client';

import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Download,
    Eye,
    AlertTriangle
} from 'lucide-react';

interface TeamMemberBalance {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    annualLeave: { available: number; total: number };
    sickLeave: { available: number; total: number };
    casualLeave: { available: number; total: number };
    compOff: { available: number; total: number };
    totalAvailable: number;
}

export default function TeamBalancePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const teamBalances: TeamMemberBalance[] = [
        {
            id: '1',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            designation: 'Production Engineer',
            annualLeave: { available: 12, total: 21 },
            sickLeave: { available: 8, total: 12 },
            casualLeave: { available: 4, total: 6 },
            compOff: { available: 2, total: 5 },
            totalAvailable: 26
        },
        {
            id: '2',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            designation: 'QA Analyst',
            annualLeave: { available: 18, total: 21 },
            sickLeave: { available: 10, total: 12 },
            casualLeave: { available: 5, total: 6 },
            compOff: { available: 0, total: 3 },
            totalAvailable: 33
        },
        {
            id: '3',
            employeeId: 'EMP004',
            employeeName: 'David Wilson',
            department: 'Production',
            designation: 'Machine Operator',
            annualLeave: { available: 5, total: 21 },
            sickLeave: { available: 3, total: 12 },
            casualLeave: { available: 1, total: 6 },
            compOff: { available: 4, total: 8 },
            totalAvailable: 13
        },
        {
            id: '4',
            employeeId: 'EMP005',
            employeeName: 'Jennifer Brown',
            department: 'Finance',
            designation: 'Accountant',
            annualLeave: { available: 15, total: 21 },
            sickLeave: { available: 11, total: 12 },
            casualLeave: { available: 6, total: 6 },
            compOff: { available: 1, total: 2 },
            totalAvailable: 33
        },
        {
            id: '5',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'Software Developer',
            annualLeave: { available: 8, total: 21 },
            sickLeave: { available: 9, total: 12 },
            casualLeave: { available: 2, total: 6 },
            compOff: { available: 6, total: 10 },
            totalAvailable: 25
        },
        {
            id: '6',
            employeeId: 'EMP007',
            employeeName: 'Lisa Wong',
            department: 'Production',
            designation: 'Production Supervisor',
            annualLeave: { available: 2, total: 21 },
            sickLeave: { available: 5, total: 12 },
            casualLeave: { available: 0, total: 6 },
            compOff: { available: 3, total: 5 },
            totalAvailable: 10
        }
    ];

    const departments = Array.from(new Set(teamBalances.map(t => t.department)));

    const filteredTeam = teamBalances.filter(member => {
        const matchesSearch = member.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || member.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const getBalanceColor = (available: number, total: number) => {
        const ratio = available / total;
        if (ratio >= 0.5) return 'text-green-400 bg-green-500/20';
        if (ratio >= 0.25) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const lowBalanceMembers = teamBalances.filter(m => m.totalAvailable < 15);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-500" />
                            Team Leave Balance
                        </h1>
                        <p className="text-gray-400 mt-1">View leave balances of your team members</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Team Members</p>
                        <p className="text-3xl font-bold text-white">{teamBalances.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Avg. Available Days</p>
                        <p className="text-3xl font-bold text-white">
                            {Math.round(teamBalances.reduce((sum, m) => sum + m.totalAvailable, 0) / teamBalances.length)}
                        </p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Low Balance</p>
                        <p className="text-3xl font-bold text-white">{lowBalanceMembers.length}</p>
                        <p className="text-xs text-gray-500">Less than 15 days</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Departments</p>
                        <p className="text-3xl font-bold text-white">{departments.length}</p>
                    </div>
                </div>

                {lowBalanceMembers.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <div>
                                <p className="text-yellow-400 font-medium">Low Balance Alert</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {lowBalanceMembers.map(m => m.employeeName).join(', ')} have less than 15 days of leave remaining.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Annual</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Sick</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Casual</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Comp Off</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Total</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeam.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {member.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{member.employeeName}</p>
                                                    <p className="text-xs text-gray-400">{member.employeeId} • {member.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${getBalanceColor(member.annualLeave.available, member.annualLeave.total)}`}>
                                                {member.annualLeave.available}/{member.annualLeave.total}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${getBalanceColor(member.sickLeave.available, member.sickLeave.total)}`}>
                                                {member.sickLeave.available}/{member.sickLeave.total}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${getBalanceColor(member.casualLeave.available, member.casualLeave.total)}`}>
                                                {member.casualLeave.available}/{member.casualLeave.total}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${getBalanceColor(member.compOff.available, member.compOff.total)}`}>
                                                {member.compOff.available}/{member.compOff.total}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-lg font-bold ${member.totalAvailable < 15 ? 'text-red-400' : 'text-green-400'}`}>
                                                {member.totalAvailable}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm mx-auto">
                                                <Eye className="w-4 h-4" /> Details
                                            </button>
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
