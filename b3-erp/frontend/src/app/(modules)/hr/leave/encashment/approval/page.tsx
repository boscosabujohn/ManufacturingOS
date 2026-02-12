'use client';

import React, { useState } from 'react';
import {
    CheckSquare,
    Search,
    Filter,
    DollarSign,
    CheckCircle,
    XCircle,
    Eye,
    User,
    Clock
} from 'lucide-react';

interface EncashmentApproval {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    days: number;
    amount: number;
    requestDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    remarks: string;
}

export default function EncashmentApprovalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    const encashmentRequests: EncashmentApproval[] = [
        {
            id: 'EN-2025-001',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            leaveType: 'Annual Leave',
            days: 8,
            amount: 20000,
            requestDate: '2025-02-01',
            status: 'Pending',
            remarks: 'End of year encashment'
        },
        {
            id: 'EN-2025-002',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            leaveType: 'Earned Leave',
            days: 5,
            amount: 12500,
            requestDate: '2025-02-02',
            status: 'Pending',
            remarks: ''
        },
        {
            id: 'EN-2025-003',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            leaveType: 'Annual Leave',
            days: 10,
            amount: 25000,
            requestDate: '2025-01-28',
            status: 'Pending',
            remarks: 'Maximum encashment request'
        },
        {
            id: 'EN-2025-004',
            employeeId: 'EMP004',
            employeeName: 'David Wilson',
            department: 'Production',
            leaveType: 'Compensatory Off',
            days: 3,
            amount: 6000,
            requestDate: '2025-01-30',
            status: 'Approved',
            remarks: ''
        }
    ];

    const filteredRequests = encashmentRequests.filter(req => {
        const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleSelect = (id: string) => {
        setSelectedRequests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        const pendingIds = filteredRequests.filter(r => r.status === 'Pending').map(r => r.id);
        if (selectedRequests.length === pendingIds.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(pendingIds);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const pendingCount = encashmentRequests.filter(r => r.status === 'Pending').length;
    const totalPendingAmount = encashmentRequests.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-8 h-8 text-green-500" />
                            Encashment Approval
                        </h1>
                        <p className="text-gray-400 mt-1">Review and approve leave encashment requests</p>
                    </div>
                    {selectedRequests.length > 0 && (
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                <CheckCircle className="w-4 h-4" />
                                Approve ({selectedRequests.length})
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                <XCircle className="w-4 h-4" />
                                Reject ({selectedRequests.length})
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Pending Approval</p>
                        <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Pending Amount</p>
                        <p className="text-3xl font-bold text-white">${totalPendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Approved This Month</p>
                        <p className="text-3xl font-bold text-white">{encashmentRequests.filter(r => r.status === 'Approved').length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Selected</p>
                        <p className="text-3xl font-bold text-white">{selectedRequests.length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <button
                        onClick={selectAll}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                    >
                        {selectedRequests.length === filteredRequests.filter(r => r.status === 'Pending').length ? 'Deselect All' : 'Select All Pending'}
                    </button>
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or request ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`bg-gray-800 rounded-xl border p-6 transition-all ${
                                selectedRequests.includes(request.id)
                                    ? 'border-blue-500 bg-blue-500/5'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {request.status === 'Pending' && (
                                        <input
                                            type="checkbox"
                                            checked={selectedRequests.includes(request.id)}
                                            onChange={() => toggleSelect(request.id)}
                                            className="w-5 h-5 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                        />
                                    )}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                        {request.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-mono text-gray-400">{request.id}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{request.employeeName}</h3>
                                        <p className="text-sm text-gray-400">{request.employeeId} • {request.department}</p>

                                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                {request.leaveType}
                                            </span>
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                {request.days} days
                                            </div>
                                        </div>
                                        {request.remarks && (
                                            <p className="text-sm text-gray-400 mt-2 italic">&quot;{request.remarks}&quot;</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-2xl font-bold text-green-400">${request.amount.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">
                                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                                    </p>

                                    <div className="flex gap-2 mt-2">
                                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                            <Eye className="w-4 h-4" /> View
                                        </button>
                                        {request.status === 'Pending' && (
                                            <>
                                                <button className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                                                    <CheckCircle className="w-4 h-4" /> Approve
                                                </button>
                                                <button className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
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
