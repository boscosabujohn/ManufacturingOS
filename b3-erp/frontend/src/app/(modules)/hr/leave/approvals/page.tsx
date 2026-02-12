'use client';

import React, { useState } from 'react';
import {
    CheckSquare,
    Search,
    Filter,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    User,
    MessageSquare
} from 'lucide-react';

interface LeaveApproval {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    appliedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    priority: 'Normal' | 'Urgent';
}

export default function LeaveApprovalsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    const pendingApprovals: LeaveApproval[] = [
        {
            id: 'LV-2025-007',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            leaveType: 'Annual Leave',
            startDate: '2025-02-10',
            endDate: '2025-02-14',
            days: 5,
            reason: 'Family vacation to hometown',
            appliedDate: '2025-02-03',
            status: 'Pending',
            priority: 'Normal'
        },
        {
            id: 'LV-2025-008',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            leaveType: 'Sick Leave',
            startDate: '2025-02-05',
            endDate: '2025-02-06',
            days: 2,
            reason: 'Medical appointment and recovery',
            appliedDate: '2025-02-04',
            status: 'Pending',
            priority: 'Urgent'
        },
        {
            id: 'LV-2025-009',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            leaveType: 'Casual Leave',
            startDate: '2025-02-12',
            endDate: '2025-02-12',
            days: 1,
            reason: 'Personal errands',
            appliedDate: '2025-02-05',
            status: 'Pending',
            priority: 'Normal'
        },
        {
            id: 'LV-2025-010',
            employeeId: 'EMP004',
            employeeName: 'David Wilson',
            department: 'Production',
            leaveType: 'Compensatory Off',
            startDate: '2025-02-07',
            endDate: '2025-02-07',
            days: 1,
            reason: 'Comp off for weekend work',
            appliedDate: '2025-02-03',
            status: 'Pending',
            priority: 'Normal'
        },
        {
            id: 'LV-2025-006',
            employeeId: 'EMP001',
            employeeName: 'Sarah Johnson',
            department: 'Human Resources',
            leaveType: 'Annual Leave',
            startDate: '2025-01-20',
            endDate: '2025-01-22',
            days: 3,
            reason: 'Personal time off',
            appliedDate: '2025-01-15',
            status: 'Approved',
            priority: 'Normal'
        }
    ];

    const departments = Array.from(new Set(pendingApprovals.map(a => a.department)));

    const filteredApprovals = pendingApprovals.filter(approval => {
        const matchesSearch = approval.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleSelect = (id: string) => {
        setSelectedRequests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        const pendingIds = filteredApprovals.filter(a => a.status === 'Pending').map(a => a.id);
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

    const getPriorityColor = (priority: string) => {
        return priority === 'Urgent' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400';
    };

    const pendingCount = pendingApprovals.filter(a => a.status === 'Pending').length;
    const urgentCount = pendingApprovals.filter(a => a.status === 'Pending' && a.priority === 'Urgent').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-8 h-8 text-green-500" />
                            Leave Approvals
                        </h1>
                        <p className="text-gray-400 mt-1">Review and approve leave requests</p>
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
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Urgent Requests</p>
                        <p className="text-3xl font-bold text-white">{urgentCount}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Approved This Month</p>
                        <p className="text-3xl font-bold text-white">{pendingApprovals.filter(a => a.status === 'Approved').length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Selected</p>
                        <p className="text-3xl font-bold text-white">{selectedRequests.length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <button
                        onClick={selectAll}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                    >
                        {selectedRequests.length === filteredApprovals.filter(a => a.status === 'Pending').length ? 'Deselect All' : 'Select All Pending'}
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
                    {filteredApprovals.map((approval) => (
                        <div
                            key={approval.id}
                            className={`bg-gray-800 rounded-xl border p-6 transition-all cursor-pointer ${
                                selectedRequests.includes(approval.id)
                                    ? 'border-blue-500 bg-blue-500/5'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => approval.status === 'Pending' && toggleSelect(approval.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {approval.status === 'Pending' && (
                                        <input
                                            type="checkbox"
                                            checked={selectedRequests.includes(approval.id)}
                                            onChange={() => toggleSelect(approval.id)}
                                            className="w-5 h-5 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {approval.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">{approval.employeeName}</h3>
                                            <span className="text-xs text-gray-500 font-mono">{approval.employeeId}</span>
                                            {approval.priority === 'Urgent' && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                                                    Urgent
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">{approval.department}</p>

                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                    {approval.leaveType}
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-300">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    {new Date(approval.startDate).toLocaleDateString()} - {new Date(approval.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-300">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                    {approval.days} day(s)
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                                                <p className="text-sm text-gray-400">{approval.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                                        {approval.status}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        Applied: {new Date(approval.appliedDate).toLocaleDateString()}
                                    </p>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                                        >
                                            <Eye className="w-4 h-4" /> View
                                        </button>
                                        {approval.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                                >
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

                {filteredApprovals.length === 0 && (
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center">
                        <CheckSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No leave requests to display</p>
                    </div>
                )}
            </div>
        </div>
    );
}
