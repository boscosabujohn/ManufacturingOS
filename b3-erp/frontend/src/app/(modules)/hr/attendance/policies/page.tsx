'use client';

import React, { useState } from 'react';
import {
    Shield,
    Plus,
    Search,
    Edit,
    Trash2,
    Clock,
    Calendar,
    AlertCircle,
    CheckCircle,
    Settings,
    Users
} from 'lucide-react';

interface AttendancePolicy {
    id: string;
    name: string;
    description: string;
    type: 'Standard' | 'Flexible' | 'Shift-based' | 'Custom';
    workHoursPerDay: number;
    workDaysPerWeek: number;
    graceTimeMins: number;
    halfDayThreshold: number;
    overtimeThreshold: number;
    appliedTo: string[];
    status: 'Active' | 'Inactive' | 'Draft';
    createdAt: string;
    employeeCount: number;
}

export default function AttendancePoliciesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const policies: AttendancePolicy[] = [
        {
            id: '1',
            name: 'Standard Office Policy',
            description: 'Default 9-6 office hours policy for administrative staff',
            type: 'Standard',
            workHoursPerDay: 9,
            workDaysPerWeek: 5,
            graceTimeMins: 15,
            halfDayThreshold: 4,
            overtimeThreshold: 9,
            appliedTo: ['Human Resources', 'Finance', 'IT', 'Sales'],
            status: 'Active',
            createdAt: '2024-01-01',
            employeeCount: 75
        },
        {
            id: '2',
            name: 'Production Shift Policy',
            description: 'Shift-based policy for production floor workers',
            type: 'Shift-based',
            workHoursPerDay: 8,
            workDaysPerWeek: 6,
            graceTimeMins: 10,
            halfDayThreshold: 4,
            overtimeThreshold: 8,
            appliedTo: ['Production', 'Quality Assurance', 'Warehouse'],
            status: 'Active',
            createdAt: '2024-01-01',
            employeeCount: 65
        },
        {
            id: '3',
            name: 'Flexible Work Policy',
            description: 'Flexible timing for senior management and remote workers',
            type: 'Flexible',
            workHoursPerDay: 8,
            workDaysPerWeek: 5,
            graceTimeMins: 30,
            halfDayThreshold: 4,
            overtimeThreshold: 8,
            appliedTo: ['Executive', 'Remote Workers'],
            status: 'Active',
            createdAt: '2024-03-15',
            employeeCount: 16
        },
        {
            id: '4',
            name: 'Internship Policy',
            description: 'Policy for interns with reduced hours',
            type: 'Custom',
            workHoursPerDay: 6,
            workDaysPerWeek: 5,
            graceTimeMins: 15,
            halfDayThreshold: 3,
            overtimeThreshold: 6,
            appliedTo: ['Interns'],
            status: 'Draft',
            createdAt: '2025-01-10',
            employeeCount: 0
        }
    ];

    const filteredPolicies = policies.filter(policy => {
        const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400';
            case 'Inactive': return 'bg-red-500/20 text-red-400';
            case 'Draft': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Standard': return 'bg-blue-500/20 text-blue-400';
            case 'Flexible': return 'bg-purple-500/20 text-purple-400';
            case 'Shift-based': return 'bg-orange-500/20 text-orange-400';
            case 'Custom': return 'bg-pink-500/20 text-pink-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-500" />
                            Attendance Policies
                        </h1>
                        <p className="text-gray-400 mt-1">Define and manage attendance rules</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Create Policy
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Policies</p>
                        <p className="text-3xl font-bold text-white">{policies.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Active Policies</p>
                        <p className="text-3xl font-bold text-white">{policies.filter(p => p.status === 'Active').length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Employees Covered</p>
                        <p className="text-3xl font-bold text-white">{policies.reduce((sum, p) => sum + p.employeeCount, 0)}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Draft Policies</p>
                        <p className="text-3xl font-bold text-white">{policies.filter(p => p.status === 'Draft').length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search policies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredPolicies.map((policy) => (
                        <div key={policy.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(policy.type)}`}>
                                            {policy.type}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(policy.status)}`}>
                                            {policy.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">{policy.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{policy.description}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Work Hours/Day</p>
                                        <p className="text-white font-medium">{policy.workHoursPerDay}h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Work Days/Week</p>
                                        <p className="text-white font-medium">{policy.workDaysPerWeek} days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Grace Time</p>
                                        <p className="text-white font-medium">{policy.graceTimeMins} min</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-400">Applied to:</span>
                                <div className="flex flex-wrap gap-1">
                                    {policy.appliedTo.map(dept => (
                                        <span key={dept} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                            {dept}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Users className="w-4 h-4" />
                                    {policy.employeeCount} employees
                                </div>
                                <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                    <Settings className="w-4 h-4" /> Configure
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
