'use client';

import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    Download,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Calendar,
    DollarSign
} from 'lucide-react';

interface LoanRequest {
    id: string;
    requestNumber: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    loanType: 'Personal Loan' | 'Salary Advance' | 'Emergency Loan' | 'Festival Advance' | 'Housing Loan';
    requestedAmount: number;
    purpose: string;
    requestedTenure: number;
    proposedEMI: number;
    requestDate: string;
    status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed';
    currentLoans: number;
    currentEMI: number;
    eligibility: 'Eligible' | 'Partially Eligible' | 'Not Eligible';
}

export default function LoanRequestsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const requests: LoanRequest[] = [
        {
            id: '1',
            requestNumber: 'LR-2025-001',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'Software Developer',
            loanType: 'Emergency Loan',
            requestedAmount: 100000,
            purpose: 'Medical emergency - family member hospitalization',
            requestedTenure: 12,
            proposedEMI: 8833,
            requestDate: '2025-02-01',
            status: 'Pending',
            currentLoans: 0,
            currentEMI: 0,
            eligibility: 'Eligible'
        },
        {
            id: '2',
            requestNumber: 'LR-2025-002',
            employeeId: 'EMP010',
            employeeName: 'Alex Kumar',
            department: 'Sales',
            designation: 'Sales Executive',
            loanType: 'Personal Loan',
            requestedAmount: 200000,
            purpose: 'Home renovation',
            requestedTenure: 24,
            proposedEMI: 9167,
            requestDate: '2025-01-28',
            status: 'Under Review',
            currentLoans: 1,
            currentEMI: 5000,
            eligibility: 'Partially Eligible'
        },
        {
            id: '3',
            requestNumber: 'LR-2025-003',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            designation: 'QA Analyst',
            loanType: 'Salary Advance',
            requestedAmount: 30000,
            purpose: 'Personal expenses',
            requestedTenure: 3,
            proposedEMI: 10000,
            requestDate: '2025-01-25',
            status: 'Approved',
            currentLoans: 0,
            currentEMI: 0,
            eligibility: 'Eligible'
        },
        {
            id: '4',
            requestNumber: 'LR-2025-004',
            employeeId: 'EMP008',
            employeeName: 'David Wilson',
            department: 'Production',
            designation: 'Machine Operator',
            loanType: 'Housing Loan',
            requestedAmount: 500000,
            purpose: 'Down payment for house',
            requestedTenure: 60,
            proposedEMI: 10000,
            requestDate: '2025-01-20',
            status: 'Rejected',
            currentLoans: 2,
            currentEMI: 15000,
            eligibility: 'Not Eligible'
        },
        {
            id: '5',
            requestNumber: 'LR-2025-005',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            designation: 'Senior Production Engineer',
            loanType: 'Festival Advance',
            requestedAmount: 25000,
            purpose: 'Lunar New Year expenses',
            requestedTenure: 2,
            proposedEMI: 12500,
            requestDate: '2025-01-15',
            status: 'Disbursed',
            currentLoans: 1,
            currentEMI: 12500,
            eligibility: 'Eligible'
        }
    ];

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesType = typeFilter === 'all' || request.loanType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const formatCurrency = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`;
        }
        return `₹${value.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Disbursed': return 'bg-green-500/20 text-green-400';
            case 'Approved': return 'bg-blue-500/20 text-blue-400';
            case 'Under Review': return 'bg-yellow-500/20 text-yellow-400';
            case 'Pending': return 'bg-orange-500/20 text-orange-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getEligibilityColor = (eligibility: string) => {
        switch (eligibility) {
            case 'Eligible': return 'text-green-400';
            case 'Partially Eligible': return 'text-yellow-400';
            case 'Not Eligible': return 'text-red-400';
            default: return 'text-gray-400';
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

    const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length;
    const totalRequested = requests.filter(r => r.status === 'Pending' || r.status === 'Under Review').reduce((sum, r) => sum + r.requestedAmount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                            Loan Requests
                        </h1>
                        <p className="text-gray-400 mt-1">View and manage employee loan applications</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            New Request
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Requests</p>
                        <p className="text-3xl font-bold text-white">{requests.length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Pending Review</p>
                        <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Amount Requested</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalRequested)}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Approved</p>
                        <p className="text-3xl font-bold text-white">{requests.filter(r => r.status === 'Approved' || r.status === 'Disbursed').length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search requests..."
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
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Disbursed">Disbursed</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {request.employeeName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">{request.employeeName}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(request.loanType)}`}>
                                                {request.loanType}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{request.employeeId} • {request.department} • {request.designation}</p>
                                        <p className="text-sm text-gray-300 mt-2">{request.purpose}</p>

                                        <div className="flex items-center gap-4 mt-3 text-sm">
                                            <span className={`${getEligibilityColor(request.eligibility)}`}>
                                                {request.eligibility}
                                            </span>
                                            {request.currentLoans > 0 && (
                                                <span className="text-yellow-400">
                                                    {request.currentLoans} active loan(s) • EMI: {formatCurrency(request.currentEMI)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-xs text-gray-500">{request.requestNumber}</p>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{formatCurrency(request.requestedAmount)}</p>
                                        <p className="text-sm text-gray-400">{request.requestedTenure} months • EMI: {formatCurrency(request.proposedEMI)}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(request.requestDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                            <Eye className="w-4 h-4" /> View
                                        </button>
                                        {(request.status === 'Pending' || request.status === 'Under Review') && (
                                            <>
                                                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm">
                                                    <CheckCircle className="w-4 h-4" /> Approve
                                                </button>
                                                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm">
                                                    <XCircle className="w-4 h-4" /> Reject
                                                </button>
                                            </>
                                        )}
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
