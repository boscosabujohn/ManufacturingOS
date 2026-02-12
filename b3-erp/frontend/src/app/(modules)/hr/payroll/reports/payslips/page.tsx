'use client';

import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    Download,
    Eye,
    Send,
    Printer,
    Calendar,
    Users,
    Mail,
    CheckCircle
} from 'lucide-react';

interface Payslip {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    month: string;
    year: number;
    grossEarnings: number;
    totalDeductions: number;
    netPay: number;
    status: 'Generated' | 'Sent' | 'Viewed' | 'Downloaded';
    generatedDate: string;
    sentDate: string | null;
    viewedDate: string | null;
}

export default function PayslipsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState('January');
    const [yearFilter, setYearFilter] = useState('2025');
    const [statusFilter, setStatusFilter] = useState('all');

    const payslips: Payslip[] = [
        {
            id: '1',
            employeeId: 'EMP001',
            employeeName: 'Sarah Johnson',
            department: 'Human Resources',
            designation: 'HR Manager',
            month: 'January',
            year: 2025,
            grossEarnings: 137500,
            totalDeductions: 35000,
            netPay: 102500,
            status: 'Viewed',
            generatedDate: '2025-02-01',
            sentDate: '2025-02-01',
            viewedDate: '2025-02-02'
        },
        {
            id: '2',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            designation: 'Senior Production Engineer',
            month: 'January',
            year: 2025,
            grossEarnings: 76667,
            totalDeductions: 18000,
            netPay: 58667,
            status: 'Sent',
            generatedDate: '2025-02-01',
            sentDate: '2025-02-01',
            viewedDate: null
        },
        {
            id: '3',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            designation: 'QA Analyst',
            month: 'January',
            year: 2025,
            grossEarnings: 67500,
            totalDeductions: 15000,
            netPay: 52500,
            status: 'Downloaded',
            generatedDate: '2025-02-01',
            sentDate: '2025-02-01',
            viewedDate: '2025-02-02'
        },
        {
            id: '4',
            employeeId: 'EMP005',
            employeeName: 'Jennifer Brown',
            department: 'Finance',
            designation: 'Senior Accountant',
            month: 'January',
            year: 2025,
            grossEarnings: 110000,
            totalDeductions: 28000,
            netPay: 82000,
            status: 'Generated',
            generatedDate: '2025-02-01',
            sentDate: null,
            viewedDate: null
        },
        {
            id: '5',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'Software Developer',
            month: 'January',
            year: 2025,
            grossEarnings: 90000,
            totalDeductions: 22000,
            netPay: 68000,
            status: 'Viewed',
            generatedDate: '2025-02-01',
            sentDate: '2025-02-01',
            viewedDate: '2025-02-03'
        }
    ];

    const filteredPayslips = payslips.filter(payslip => {
        const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = payslip.month === monthFilter;
        const matchesYear = payslip.year === parseInt(yearFilter);
        const matchesStatus = statusFilter === 'all' || payslip.status === statusFilter;
        return matchesSearch && matchesMonth && matchesYear && matchesStatus;
    });

    const formatCurrency = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`;
        }
        return `₹${value.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Downloaded': return 'bg-green-500/20 text-green-400';
            case 'Viewed': return 'bg-blue-500/20 text-blue-400';
            case 'Sent': return 'bg-yellow-500/20 text-yellow-400';
            case 'Generated': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const totalNetPay = filteredPayslips.reduce((sum, p) => sum + p.netPay, 0);
    const sentCount = filteredPayslips.filter(p => p.status !== 'Generated').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                            Payslips
                        </h1>
                        <p className="text-gray-400 mt-1">Generate and distribute employee payslips</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <FileText className="w-4 h-4" />
                            Generate All
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            <Send className="w-4 h-4" />
                            Send All
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Bulk Download
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Payslips</p>
                        <p className="text-3xl font-bold text-white">{filteredPayslips.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Sent</p>
                        <p className="text-3xl font-bold text-white">{sentCount}/{filteredPayslips.length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Net Pay</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalNetPay)}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Viewed</p>
                        <p className="text-3xl font-bold text-white">{filteredPayslips.filter(p => p.status === 'Viewed' || p.status === 'Downloaded').length}</p>
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
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Generated">Generated</option>
                            <option value="Sent">Sent</option>
                            <option value="Viewed">Viewed</option>
                            <option value="Downloaded">Downloaded</option>
                        </select>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Period</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Gross</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Deductions</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Net Pay</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayslips.map((payslip) => (
                                    <tr key={payslip.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {payslip.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{payslip.employeeName}</p>
                                                    <p className="text-xs text-gray-400">{payslip.employeeId} • {payslip.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-300">
                                            {payslip.month} {payslip.year}
                                        </td>
                                        <td className="p-4 text-right text-gray-300">{formatCurrency(payslip.grossEarnings)}</td>
                                        <td className="p-4 text-right text-red-400">{formatCurrency(payslip.totalDeductions)}</td>
                                        <td className="p-4 text-right text-green-400 font-medium">{formatCurrency(payslip.netPay)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(payslip.status)}`}>
                                                {payslip.status === 'Downloaded' && <CheckCircle className="w-3 h-3" />}
                                                {payslip.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded" title="View">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded" title="Download">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded" title="Print">
                                                    <Printer className="w-4 h-4" />
                                                </button>
                                                {payslip.status === 'Generated' && (
                                                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded" title="Send">
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
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
