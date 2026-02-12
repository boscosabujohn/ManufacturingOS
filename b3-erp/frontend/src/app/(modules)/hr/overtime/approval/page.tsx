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
    User,
    FileText,
    AlertCircle
} from 'lucide-react';

interface OvertimeApproval {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    date: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    reason: string;
    project?: string;
    requestDate: string;
    compensationType: 'Paid' | 'Comp-Off';
    priority: 'Normal' | 'Urgent';
}

export default function OvertimeApprovalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    const pendingApprovals: OvertimeApproval[] = [
        {
            id: '1',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            designation: 'Production Supervisor',
            date: '2025-02-05',
            startTime: '18:00',
            endTime: '22:00',
            totalHours: 4,
            reason: 'Urgent production order completion for client ABC Corp',
            project: 'Order #2025-0234',
            requestDate: '2025-02-01',
            compensationType: 'Paid',
            priority: 'Urgent'
        },
        {
            id: '2',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'System Administrator',
            date: '2025-02-06',
            startTime: '18:00',
            endTime: '23:00',
            totalHours: 5,
            reason: 'Critical server migration and maintenance window',
            project: 'Infrastructure Upgrade',
            requestDate: '2025-02-01',
            compensationType: 'Comp-Off',
            priority: 'Urgent'
        },
        {
            id: '3',
            employeeId: 'EMP007',
            employeeName: 'Lisa Wong',
            department: 'Production',
            designation: 'Assembly Technician',
            date: '2025-02-07',
            startTime: '18:00',
            endTime: '20:00',
            totalHours: 2,
            reason: 'Complete pending assembly work',
            requestDate: '2025-02-02',
            compensationType: 'Paid',
            priority: 'Normal'
        },
        {
            id: '4',
            employeeId: 'EMP008',
            employeeName: 'James Taylor',
            department: 'Warehouse',
            designation: 'Warehouse Coordinator',
            date: '2025-02-08',
            startTime: '18:00',
            endTime: '21:00',
            totalHours: 3,
            reason: 'Inventory reconciliation before month-end',
            requestDate: '2025-02-02',
            compensationType: 'Comp-Off',
            priority: 'Normal'
        },
        {
            id: '5',
            employeeId: 'EMP009',
            employeeName: 'Anna Martin',
            department: 'Quality Assurance',
            designation: 'QA Inspector',
            date: '2025-02-05',
            startTime: '18:00',
            endTime: '20:00',
            totalHours: 2,
            reason: 'Final inspection for export shipment',
            project: 'Export Order #EXP-2025-045',
            requestDate: '2025-02-01',
            compensationType: 'Paid',
            priority: 'Urgent'
        }
    ];

    const departments = Array.from(new Set(pendingApprovals.map(r => r.department)));

    const filteredApprovals = pendingApprovals.filter(approval => {
        const matchesSearch = approval.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || approval.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const toggleSelect = (id: string) => {
        setSelectedRequests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedRequests.length === filteredApprovals.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(filteredApprovals.map(a => a.id));
        }
    };

    const totalPendingHours = pendingApprovals.reduce((sum, a) => sum + a.totalHours, 0);
    const urgentCount = pendingApprovals.filter(a => a.priority === 'Urgent').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-8 h-8 text-green-500" />
                            Overtime Approval
                        </h1>
                        <p className="text-gray-400 mt-1">Review and approve overtime requests</p>
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
                        <p className="text-3xl font-bold text-white">{pendingApprovals.length}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                        <div>
                            <p className="text-red-400 text-sm">Urgent</p>
                            <p className="text-2xl font-bold text-white">{urgentCount}</p>
                        </div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Total Hours</p>
                        <p className="text-3xl font-bold text-white">{totalPendingHours}h</p>
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
                        {selectedRequests.length === filteredApprovals.length ? 'Deselect All' : 'Select All'}
                    </button>
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

                <div className="space-y-3">
                    {filteredApprovals.map((approval) => (
                        <div
                            key={approval.id}
                            className={`bg-gray-800 rounded-xl border p-6 transition-all cursor-pointer ${
                                selectedRequests.includes(approval.id)
                                    ? 'border-blue-500 bg-blue-500/5'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => toggleSelect(approval.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedRequests.includes(approval.id)}
                                            onChange={() => toggleSelect(approval.id)}
                                            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                                            {approval.employeeName.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">{approval.employeeName}</h3>
                                            <span className="text-xs text-gray-500 font-mono">{approval.employeeId}</span>
                                            {approval.priority === 'Urgent' && (
                                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                                                    URGENT
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">{approval.designation} • {approval.department}</p>

                                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                {new Date(approval.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                {approval.startTime} - {approval.endTime} ({approval.totalHours}h)
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${approval.compensationType === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                {approval.compensationType}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-start gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                                            <span className="text-gray-300">{approval.reason}</span>
                                        </div>
                                        {approval.project && (
                                            <p className="mt-1 text-sm text-blue-400">Project: {approval.project}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
