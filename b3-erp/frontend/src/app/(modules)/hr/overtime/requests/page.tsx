'use client';

import React, { useState } from 'react';
import {
    Clock,
    Plus,
    Search,
    Filter,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    FileText
} from 'lucide-react';

interface OvertimeRequest {
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
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    requestDate: string;
    approvedBy?: string;
    approvedDate?: string;
    compensationType: 'Paid' | 'Comp-Off';
}

export default function OvertimeRequestsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const requests: OvertimeRequest[] = [
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
            reason: 'Urgent production order completion',
            project: 'Order #2025-0234',
            status: 'Pending',
            requestDate: '2025-02-01',
            compensationType: 'Paid'
        },
        {
            id: '2',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            designation: 'Quality Analyst',
            date: '2025-02-03',
            startTime: '18:00',
            endTime: '20:00',
            totalHours: 2,
            reason: 'Quality inspection for shipment',
            status: 'Approved',
            requestDate: '2025-01-30',
            approvedBy: 'QA Manager',
            approvedDate: '2025-01-31',
            compensationType: 'Comp-Off'
        },
        {
            id: '3',
            employeeId: 'EMP004',
            employeeName: 'David Wilson',
            department: 'Production',
            designation: 'Machine Operator',
            date: '2025-02-04',
            startTime: '18:00',
            endTime: '21:00',
            totalHours: 3,
            reason: 'Machine maintenance and setup',
            status: 'Approved',
            requestDate: '2025-01-28',
            approvedBy: 'Production Manager',
            approvedDate: '2025-01-29',
            compensationType: 'Paid'
        },
        {
            id: '4',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            designation: 'System Administrator',
            date: '2025-02-06',
            startTime: '18:00',
            endTime: '23:00',
            totalHours: 5,
            reason: 'Server migration and maintenance',
            project: 'Infrastructure Upgrade',
            status: 'Pending',
            requestDate: '2025-02-01',
            compensationType: 'Comp-Off'
        },
        {
            id: '5',
            employeeId: 'EMP007',
            employeeName: 'Lisa Wong',
            department: 'Production',
            designation: 'Assembly Technician',
            date: '2025-02-02',
            startTime: '18:00',
            endTime: '20:00',
            totalHours: 2,
            reason: 'Rush order assembly',
            status: 'Rejected',
            requestDate: '2025-01-29',
            approvedBy: 'Production Manager',
            approvedDate: '2025-01-30',
            compensationType: 'Paid'
        }
    ];

    const departments = Array.from(new Set(requests.map(r => r.department)));

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesDept = departmentFilter === 'all' || request.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDept;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Cancelled': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            case 'Pending': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const totalHours = requests.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.totalHours, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Clock className="w-8 h-8 text-orange-500" />
                            Overtime Requests
                        </h1>
                        <p className="text-gray-400 mt-1">Submit and track overtime requests</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        New Request
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Requests</p>
                        <p className="text-3xl font-bold text-white">{requests.length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Pending</p>
                        <p className="text-3xl font-bold text-white">{requests.filter(r => r.status === 'Pending').length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Approved</p>
                        <p className="text-3xl font-bold text-white">{requests.filter(r => r.status === 'Approved').length}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Rejected</p>
                        <p className="text-3xl font-bold text-white">{requests.filter(r => r.status === 'Rejected').length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Approved Hours</p>
                        <p className="text-3xl font-bold text-white">{totalHours}h</p>
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
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
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

                <div className="space-y-3">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                                        {request.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">{request.employeeName}</h3>
                                            <span className="text-xs text-gray-500 font-mono">{request.employeeId}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{request.designation} • {request.department}</p>

                                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                {new Date(request.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                {request.startTime} - {request.endTime} ({request.totalHours}h)
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${request.compensationType === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                {request.compensationType}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-start gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                                            <span className="text-gray-300">{request.reason}</span>
                                        </div>
                                        {request.project && (
                                            <p className="mt-1 text-sm text-blue-400">Project: {request.project}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                                        {getStatusIcon(request.status)}
                                        {request.status}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                                    </p>
                                    {request.approvedBy && (
                                        <p className="text-xs text-gray-500">
                                            {request.status === 'Approved' ? 'Approved' : 'Rejected'} by {request.approvedBy}
                                        </p>
                                    )}

                                    {request.status === 'Pending' && (
                                        <div className="flex gap-2 mt-2">
                                            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                                Edit
                                            </button>
                                            <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm">
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
