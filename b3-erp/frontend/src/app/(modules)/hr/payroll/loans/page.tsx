'use client';

import React, { useState } from 'react';
import {
    Wallet,
    Search,
    Filter,
    Download,
    Plus,
    CheckCircle,
    Clock,
    Calendar,
    Eye,
    Edit,
    TrendingDown,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface LoanRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    loanType: 'Personal Loan' | 'Salary Advance' | 'Emergency Loan' | 'Festival Advance' | 'Housing Loan';
    loanAmount: number;
    outstandingAmount: number;
    emiAmount: number;
    tenure: number;
    remainingTenure: number;
    interestRate: number;
    disbursementDate: string;
    status: 'Active' | 'Pending Approval' | 'Completed' | 'Rejected' | 'On Hold';
    nextEmiDate: string;
    approvedBy: string | null;
}

export default function LoansAdvancesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const loanRecords: LoanRecord[] = [
        {
            id: '1',
            employeeId: 'EMP001',
            employeeName: 'Sarah Johnson',
            department: 'Human Resources',
            designation: 'HR Manager',
            loanType: 'Personal Loan',
            loanAmount: 500000,
            outstandingAmount: 375000,
            emiAmount: 25000,
            tenure: 24,
            remainingTenure: 15,
            interestRate: 8.5,
            disbursementDate: '2024-06-01',
            status: 'Active',
            nextEmiDate: '2025-02-28',
            approvedBy: 'CEO'
        },
        {
            id: '2',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            designation: 'Senior Production Engineer',
            loanType: 'Salary Advance',
            loanAmount: 50000,
            outstandingAmount: 25000,
            emiAmount: 12500,
            tenure: 4,
            remainingTenure: 2,
            interestRate: 0,
            disbursementDate: '2024-12-15',
            status: 'Active',
            nextEmiDate: '2025-02-28',
            approvedBy: 'Sarah Johnson'
        },
        {
            id: '3',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'Software Developer',
            loanType: 'Emergency Loan',
            loanAmount: 100000,
            outstandingAmount: 100000,
            emiAmount: 10000,
            tenure: 12,
            remainingTenure: 12,
            interestRate: 6,
            disbursementDate: '2025-02-01',
            status: 'Pending Approval',
            nextEmiDate: '2025-03-28',
            approvedBy: null
        },
        {
            id: '4',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            designation: 'QA Analyst',
            loanType: 'Festival Advance',
            loanAmount: 30000,
            outstandingAmount: 0,
            emiAmount: 10000,
            tenure: 3,
            remainingTenure: 0,
            interestRate: 0,
            disbursementDate: '2024-10-15',
            status: 'Completed',
            nextEmiDate: '-',
            approvedBy: 'Sarah Johnson'
        },
        {
            id: '5',
            employeeId: 'EMP005',
            employeeName: 'Jennifer Brown',
            department: 'Finance',
            designation: 'Senior Accountant',
            loanType: 'Housing Loan',
            loanAmount: 2000000,
            outstandingAmount: 1850000,
            emiAmount: 50000,
            tenure: 60,
            remainingTenure: 57,
            interestRate: 7.5,
            disbursementDate: '2024-09-01',
            status: 'Active',
            nextEmiDate: '2025-02-28',
            approvedBy: 'CEO'
        }
    ];

    const filteredRecords = loanRecords.filter(record => {
        const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || record.loanType === typeFilter;
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const formatCurrency = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`;
        }
        return `₹${value.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-blue-500/20 text-blue-400';
            case 'Completed': return 'bg-green-500/20 text-green-400';
            case 'Pending Approval': return 'bg-yellow-500/20 text-yellow-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            case 'On Hold': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Active': return <RefreshCw className="w-3 h-3" />;
            case 'Completed': return <CheckCircle className="w-3 h-3" />;
            case 'Pending Approval': return <Clock className="w-3 h-3" />;
            case 'Rejected': return <AlertCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Personal Loan': return 'bg-purple-500/20 text-purple-400';
            case 'Salary Advance': return 'bg-blue-500/20 text-blue-400';
            case 'Emergency Loan': return 'bg-red-500/20 text-red-400';
            case 'Festival Advance': return 'bg-orange-500/20 text-orange-400';
            case 'Housing Loan': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const totalDisbursed = loanRecords.reduce((sum, r) => sum + r.loanAmount, 0);
    const totalOutstanding = loanRecords.reduce((sum, r) => sum + r.outstandingAmount, 0);
    const activeLoans = loanRecords.filter(r => r.status === 'Active').length;
    const monthlyRecovery = loanRecords.filter(r => r.status === 'Active').reduce((sum, r) => sum + r.emiAmount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Wallet className="w-8 h-8 text-blue-500" />
                            Loans & Advances
                        </h1>
                        <p className="text-gray-400 mt-1">Manage employee loans and salary advances</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            New Loan
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Active Loans</p>
                        <p className="text-3xl font-bold text-white">{activeLoans}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Disbursed</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalDisbursed)}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Outstanding</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalOutstanding)}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Monthly Recovery</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(monthlyRecovery)}</p>
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
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="Personal Loan">Personal Loan</option>
                            <option value="Salary Advance">Salary Advance</option>
                            <option value="Emergency Loan">Emergency Loan</option>
                            <option value="Festival Advance">Festival Advance</option>
                            <option value="Housing Loan">Housing Loan</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Loan Type</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Amount</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">Outstanding</th>
                                    <th className="text-right p-4 text-gray-400 font-medium">EMI</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Tenure</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Next EMI</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((record) => (
                                    <tr key={record.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {record.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{record.employeeName}</p>
                                                    <p className="text-xs text-gray-400">{record.employeeId} • {record.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs ${getTypeColor(record.loanType)}`}>
                                                {record.loanType}
                                            </span>
                                            {record.interestRate > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">{record.interestRate}% p.a.</p>
                                            )}
                                        </td>
                                        <td className="p-4 text-right text-gray-300">{formatCurrency(record.loanAmount)}</td>
                                        <td className="p-4 text-right">
                                            <span className={record.outstandingAmount > 0 ? 'text-orange-400' : 'text-green-400'}>
                                                {formatCurrency(record.outstandingAmount)}
                                            </span>
                                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full"
                                                    style={{ width: `${((record.loanAmount - record.outstandingAmount) / record.loanAmount) * 100}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right text-white">{formatCurrency(record.emiAmount)}</td>
                                        <td className="p-4 text-center">
                                            <span className="text-gray-300">{record.remainingTenure}/{record.tenure}</span>
                                            <p className="text-xs text-gray-500">months left</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            {record.status === 'Active' ? (
                                                <div className="flex items-center justify-center gap-1 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-300">{new Date(record.nextEmiDate).toLocaleDateString()}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(record.status)}`}>
                                                {getStatusIcon(record.status)}
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {record.status !== 'Completed' && record.status !== 'Rejected' && (
                                                    <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded">
                                                        <Edit className="w-4 h-4" />
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
