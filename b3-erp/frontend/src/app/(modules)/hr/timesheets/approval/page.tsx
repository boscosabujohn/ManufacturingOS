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
    Briefcase
} from 'lucide-react';

interface TimesheetApproval {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    weekStart: string;
    weekEnd: string;
    totalHours: number;
    projects: string[];
    submittedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Revision';
}

export default function TimesheetApprovalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([]);

    const timesheets: TimesheetApproval[] = [
        {
            id: '1',
            employeeId: 'EMP002',
            employeeName: 'Michael Chen',
            department: 'Production',
            weekStart: '2025-01-27',
            weekEnd: '2025-02-02',
            totalHours: 42,
            projects: ['Production Line A', 'Quality Control'],
            submittedDate: '2025-02-02',
            status: 'Pending'
        },
        {
            id: '2',
            employeeId: 'EMP003',
            employeeName: 'Emily Davis',
            department: 'Quality Assurance',
            weekStart: '2025-01-27',
            weekEnd: '2025-02-02',
            totalHours: 38,
            projects: ['Quality Audits', 'Documentation'],
            submittedDate: '2025-02-01',
            status: 'Pending'
        },
        {
            id: '3',
            employeeId: 'EMP006',
            employeeName: 'Robert Martinez',
            department: 'IT',
            weekStart: '2025-01-27',
            weekEnd: '2025-02-02',
            totalHours: 45,
            projects: ['ERP Implementation', 'Infrastructure'],
            submittedDate: '2025-02-02',
            status: 'Pending'
        },
        {
            id: '4',
            employeeId: 'EMP001',
            employeeName: 'Sarah Johnson',
            department: 'Human Resources',
            weekStart: '2025-01-20',
            weekEnd: '2025-01-26',
            totalHours: 40,
            projects: ['Recruitment', 'Training'],
            submittedDate: '2025-01-27',
            status: 'Approved'
        },
        {
            id: '5',
            employeeId: 'EMP007',
            employeeName: 'Lisa Wong',
            department: 'Production',
            weekStart: '2025-01-27',
            weekEnd: '2025-02-02',
            totalHours: 35,
            projects: ['Assembly Line B'],
            submittedDate: '2025-02-01',
            status: 'Needs Revision'
        }
    ];

    const filteredTimesheets = timesheets.filter(ts => {
        const matchesSearch = ts.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ts.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ts.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleSelect = (id: string) => {
        setSelectedTimesheets(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        const pendingIds = filteredTimesheets.filter(ts => ts.status === 'Pending').map(ts => ts.id);
        if (selectedTimesheets.length === pendingIds.length) {
            setSelectedTimesheets([]);
        } else {
            setSelectedTimesheets(pendingIds);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Needs Revision': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const pendingCount = timesheets.filter(ts => ts.status === 'Pending').length;
    const totalHoursPending = timesheets.filter(ts => ts.status === 'Pending').reduce((sum, ts) => sum + ts.totalHours, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-8 h-8 text-green-500" />
                            Timesheet Approval
                        </h1>
                        <p className="text-gray-400 mt-1">Review and approve employee timesheets</p>
                    </div>
                    {selectedTimesheets.length > 0 && (
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                <CheckCircle className="w-4 h-4" />
                                Approve ({selectedTimesheets.length})
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                <XCircle className="w-4 h-4" />
                                Reject ({selectedTimesheets.length})
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Pending Approval</p>
                        <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Pending Hours</p>
                        <p className="text-3xl font-bold text-white">{totalHoursPending}h</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Approved This Week</p>
                        <p className="text-3xl font-bold text-white">{timesheets.filter(ts => ts.status === 'Approved').length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Selected</p>
                        <p className="text-3xl font-bold text-white">{selectedTimesheets.length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <button
                        onClick={selectAll}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                    >
                        {selectedTimesheets.length === filteredTimesheets.filter(ts => ts.status === 'Pending').length ? 'Deselect All' : 'Select All Pending'}
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
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Needs Revision">Needs Revision</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredTimesheets.map((ts) => (
                        <div
                            key={ts.id}
                            className={`bg-gray-800 rounded-xl border p-6 transition-all cursor-pointer ${
                                selectedTimesheets.includes(ts.id)
                                    ? 'border-blue-500 bg-blue-500/5'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => ts.status === 'Pending' && toggleSelect(ts.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {ts.status === 'Pending' && (
                                        <input
                                            type="checkbox"
                                            checked={selectedTimesheets.includes(ts.id)}
                                            onChange={() => toggleSelect(ts.id)}
                                            className="w-5 h-5 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {ts.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">{ts.employeeName}</h3>
                                            <span className="text-xs text-gray-500 font-mono">{ts.employeeId}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{ts.department}</p>

                                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                {new Date(ts.weekStart).toLocaleDateString()} - {new Date(ts.weekEnd).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className={`font-medium ${ts.totalHours > 40 ? 'text-orange-400' : 'text-green-400'}`}>
                                                    {ts.totalHours}h
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {ts.projects.map(project => (
                                                <span key={project} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                                                    {project}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ts.status)}`}>
                                        {ts.status}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        Submitted: {new Date(ts.submittedDate).toLocaleDateString()}
                                    </p>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                                        >
                                            <Eye className="w-4 h-4" /> View Details
                                        </button>
                                        {ts.status === 'Pending' && (
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
            </div>
        </div>
    );
}
