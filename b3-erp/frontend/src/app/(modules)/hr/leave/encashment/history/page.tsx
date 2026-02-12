'use client';

import React, { useState } from 'react';
import {
    History,
    Search,
    Filter,
    Download,
    Calendar,
    DollarSign,
    Eye,
    TrendingUp
} from 'lucide-react';

interface EncashmentHistory {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    days: number;
    grossAmount: number;
    taxDeducted: number;
    netAmount: number;
    requestDate: string;
    approvedDate: string;
    disbursedDate: string;
    status: 'Disbursed' | 'Approved' | 'Rejected';
    payrollMonth: string;
}

export default function EncashmentHistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('2025');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const encashmentHistory: EncashmentHistory[] = [
        {
            id: 'EN-2025-001',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            leaveType: 'Annual Leave',
            days: 5,
            grossAmount: 12500,
            taxDeducted: 2500,
            netAmount: 10000,
            requestDate: '2025-01-05',
            approvedDate: '2025-01-08',
            disbursedDate: '2025-01-31',
            status: 'Disbursed',
            payrollMonth: 'January 2025'
        },
        {
            id: 'EN-2024-015',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            leaveType: 'Earned Leave',
            days: 8,
            grossAmount: 20000,
            taxDeducted: 4000,
            netAmount: 16000,
            requestDate: '2024-12-10',
            approvedDate: '2024-12-12',
            disbursedDate: '2024-12-28',
            status: 'Disbursed',
            payrollMonth: 'December 2024'
        },
        {
            id: 'EN-2024-014',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            leaveType: 'Annual Leave',
            days: 10,
            grossAmount: 25000,
            taxDeducted: 5000,
            netAmount: 20000,
            requestDate: '2024-12-05',
            approvedDate: '2024-12-08',
            disbursedDate: '2024-12-28',
            status: 'Disbursed',
            payrollMonth: 'December 2024'
        },
        {
            id: 'EN-2024-013',
            employeeId: 'EMP004',
            employeeName: 'David Wilson',
            department: 'Production',
            leaveType: 'Compensatory Off',
            days: 3,
            grossAmount: 6000,
            taxDeducted: 1200,
            netAmount: 4800,
            requestDate: '2024-11-20',
            approvedDate: '2024-11-22',
            disbursedDate: '2024-11-30',
            status: 'Disbursed',
            payrollMonth: 'November 2024'
        },
        {
            id: 'EN-2024-012',
            employeeId: 'EMP005',
            employeeName: 'Jennifer Brown',
            department: 'Finance',
            leaveType: 'Annual Leave',
            days: 6,
            grossAmount: 15000,
            taxDeducted: 3000,
            netAmount: 12000,
            requestDate: '2024-06-10',
            approvedDate: '2024-06-12',
            disbursedDate: '2024-06-30',
            status: 'Disbursed',
            payrollMonth: 'June 2024'
        }
    ];

    const departments = Array.from(new Set(encashmentHistory.map(e => e.department)));

    const filteredHistory = encashmentHistory.filter(record => {
        const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = record.requestDate.startsWith(yearFilter);
        const matchesDept = departmentFilter === 'all' || record.department === departmentFilter;
        return matchesSearch && matchesYear && matchesDept;
    });

    const totalDisbursed = filteredHistory.reduce((sum, r) => sum + r.netAmount, 0);
    const totalDays = filteredHistory.reduce((sum, r) => sum + r.days, 0);
    const avgPerEmployee = filteredHistory.length > 0 ? Math.round(totalDisbursed / filteredHistory.length) : 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Disbursed': return 'bg-green-500/20 text-green-400';
            case 'Approved': return 'bg-blue-500/20 text-blue-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <History className="w-8 h-8 text-blue-500" />
                            Encashment History
                        </h1>
                        <p className="text-gray-400 mt-1">View past leave encashment records</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Disbursed</p>
                        <p className="text-3xl font-bold text-white">${totalDisbursed.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Days Encashed</p>
                        <p className="text-3xl font-bold text-white">{totalDays}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Transactions</p>
                        <p className="text-3xl font-bold text-white">{filteredHistory.length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Avg. Per Employee</p>
                        <p className="text-3xl font-bold text-white">${avgPerEmployee.toLocaleString()}</p>
                    </div>
                </div>

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
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
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
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Leave Type</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Days</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Gross</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Tax</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Net</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Payroll Month</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((record) => (
                                    <tr key={record.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div>
                                                <p className="text-white font-medium">{record.employeeName}</p>
                                                <p className="text-xs text-gray-400">{record.id} • {record.department}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                {record.leaveType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-gray-300">{record.days}</td>
                                        <td className="p-4 text-right text-gray-300">${record.grossAmount.toLocaleString()}</td>
                                        <td className="p-4 text-right text-red-400">-${record.taxDeducted.toLocaleString()}</td>
                                        <td className="p-4 text-right text-green-400 font-medium">${record.netAmount.toLocaleString()}</td>
                                        <td className="p-4 text-gray-300">{record.payrollMonth}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm mx-auto">
                                                <Eye className="w-4 h-4" /> View
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
