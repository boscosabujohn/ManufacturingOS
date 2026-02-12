'use client';

import React, { useState } from 'react';
import {
    CheckSquare,
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    AlertCircle,
    Users,
    DollarSign
} from 'lucide-react';

interface LoanApproval {
    id: string;
    requestNumber: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    loanType: string;
    requestedAmount: number;
    approvedAmount: number | null;
    requestedTenure: number;
    approvedTenure: number | null;
    interestRate: number;
    monthlyEMI: number | null;
    requestDate: string;
    status: 'Pending L1' | 'Pending L2' | 'Pending Finance' | 'Approved' | 'Rejected';
    currentApprover: string;
    approvalHistory: { approver: string; action: string; date: string; comments: string }[];
    eligibilityScore: number;
    maxEligibleAmount: number;
}

export default function LoanApprovalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const approvals: LoanApproval[] = [
        {
            id: '1',
            requestNumber: 'LR-2025-001',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'Software Developer',
            loanType: 'Emergency Loan',
            requestedAmount: 100000,
            approvedAmount: null,
            requestedTenure: 12,
            approvedTenure: null,
            interestRate: 6,
            monthlyEMI: null,
            requestDate: '2025-02-01',
            status: 'Pending L1',
            currentApprover: 'Jennifer Brown',
            approvalHistory: [],
            eligibilityScore: 85,
            maxEligibleAmount: 150000
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
            approvedAmount: 150000,
            requestedTenure: 24,
            approvedTenure: 24,
            interestRate: 8.5,
            monthlyEMI: 6875,
            requestDate: '2025-01-28',
            status: 'Pending Finance',
            currentApprover: 'Sarah Johnson',
            approvalHistory: [
                { approver: 'Michael Chen', action: 'Approved with modification', date: '2025-01-29', comments: 'Reduced amount due to existing loan' },
                { approver: 'Jennifer Brown', action: 'Approved', date: '2025-01-30', comments: 'Verified documents' }
            ],
            eligibilityScore: 72,
            maxEligibleAmount: 180000
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
            approvedAmount: 30000,
            requestedTenure: 3,
            approvedTenure: 3,
            interestRate: 0,
            monthlyEMI: 10000,
            requestDate: '2025-01-25',
            status: 'Approved',
            currentApprover: '-',
            approvalHistory: [
                { approver: 'Sarah Johnson', action: 'Approved', date: '2025-01-26', comments: 'Auto-approved as per policy' }
            ],
            eligibilityScore: 95,
            maxEligibleAmount: 50000
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
            approvedAmount: null,
            requestedTenure: 60,
            approvedTenure: null,
            interestRate: 7.5,
            monthlyEMI: null,
            requestDate: '2025-01-20',
            status: 'Rejected',
            currentApprover: '-',
            approvalHistory: [
                { approver: 'Michael Chen', action: 'Rejected', date: '2025-01-22', comments: 'Exceeds maximum eligible amount and has existing EMI obligations' }
            ],
            eligibilityScore: 35,
            maxEligibleAmount: 200000
        }
    ];

    const filteredApprovals = approvals.filter(approval => {
        const matchesSearch = approval.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.requestNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`;
        }
        return `₹${value.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400';
            case 'Pending L1': return 'bg-yellow-500/20 text-yellow-400';
            case 'Pending L2': return 'bg-orange-500/20 text-orange-400';
            case 'Pending Finance': return 'bg-blue-500/20 text-blue-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getEligibilityColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const pendingCount = approvals.filter(a => a.status.startsWith('Pending')).length;
    const totalPendingAmount = approvals.filter(a => a.status.startsWith('Pending')).reduce((sum, a) => sum + a.requestedAmount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-8 h-8 text-green-500" />
                            Loan Approval
                        </h1>
                        <p className="text-gray-400 mt-1">Review and approve loan applications</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Pending Approvals</p>
                        <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Pending Amount</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalPendingAmount)}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Approved Today</p>
                        <p className="text-3xl font-bold text-white">{approvals.filter(a => a.status === 'Approved').length}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Rejected</p>
                        <p className="text-3xl font-bold text-white">{approvals.filter(a => a.status === 'Rejected').length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search approvals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending L1">Pending L1</option>
                            <option value="Pending L2">Pending L2</option>
                            <option value="Pending Finance">Pending Finance</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredApprovals.map((approval) => (
                        <div key={approval.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                            {approval.employeeName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold text-white">{approval.employeeName}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(approval.status)}`}>
                                                    {approval.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400">{approval.requestNumber} • {approval.loanType}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Requested</p>
                                            <p className="text-white font-medium">{formatCurrency(approval.requestedAmount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Approved</p>
                                            <p className={`font-medium ${approval.approvedAmount ? 'text-green-400' : 'text-gray-400'}`}>
                                                {approval.approvedAmount ? formatCurrency(approval.approvedAmount) : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Tenure</p>
                                            <p className="text-white">{approval.approvedTenure || approval.requestedTenure} months</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Monthly EMI</p>
                                            <p className="text-white">{approval.monthlyEMI ? formatCurrency(approval.monthlyEMI) : '-'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Eligibility Score:</span>
                                            <span className={`font-bold ${getEligibilityColor(approval.eligibilityScore)}`}>
                                                {approval.eligibilityScore}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Max Eligible:</span>
                                            <span className="text-white">{formatCurrency(approval.maxEligibleAmount)}</span>
                                        </div>
                                    </div>

                                    {approval.approvalHistory.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <p className="text-xs text-gray-500 mb-2">Approval History</p>
                                            <div className="space-y-2">
                                                {approval.approvalHistory.map((history, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                                        {history.action.includes('Approved') ? (
                                                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                                                        )}
                                                        <div>
                                                            <p className="text-gray-300">
                                                                <span className="text-white">{history.approver}</span> - {history.action}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{history.comments}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {approval.status.startsWith('Pending') && (
                                        <div className="flex items-center gap-1 text-sm text-yellow-400">
                                            <Clock className="w-4 h-4" />
                                            Awaiting: {approval.currentApprover}
                                        </div>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                            <Eye className="w-4 h-4" /> Details
                                        </button>
                                        {approval.status.startsWith('Pending') && (
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
