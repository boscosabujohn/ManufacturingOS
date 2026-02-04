'use client';

import React, { useState } from 'react';
import {
    UserPlus,
    CheckCircle,
    Clock,
    FileText,
    Users,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Calendar
} from 'lucide-react';

interface OnboardingTask {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
}

interface OnboardingEmployee {
    id: string;
    name: string;
    role: string;
    department: string;
    joiningDate: string;
    progress: number;
    status: 'Pre-boarding' | 'Onboarding' | 'Completed';
    tasks: OnboardingTask[];
}

export default function OnboardingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock Data
    const employees: OnboardingEmployee[] = [
        {
            id: '1',
            name: 'Alice Freeman',
            role: 'UX Designer',
            department: 'Product',
            joiningDate: '2025-02-15',
            progress: 45,
            status: 'Onboarding',
            tasks: [
                { id: 't1', title: 'IT Setup', assignee: 'IT Support', dueDate: '2025-02-15', status: 'Completed' },
                { id: 't2', title: 'HR Orientation', assignee: 'Sarah Johnson', dueDate: '2025-02-16', status: 'In Progress' },
                { id: 't3', title: 'Team Intro', assignee: 'Product Lead', dueDate: '2025-02-17', status: 'Pending' }
            ]
        },
        {
            id: '2',
            name: 'Bob Smith',
            role: 'Backend Engineer',
            department: 'Engineering',
            joiningDate: '2025-02-20',
            progress: 10,
            status: 'Pre-boarding',
            tasks: [
                { id: 't4', title: 'Offer Acceptance', assignee: 'HR', dueDate: '2025-02-01', status: 'Completed' },
                { id: 't5', title: 'Laptop Procurement', assignee: 'IT', dueDate: '2025-02-18', status: 'Pending' }
            ]
        },
        {
            id: '3',
            name: 'Charlie Davis',
            role: 'Sales Executive',
            department: 'Sales',
            joiningDate: '2025-01-10',
            progress: 100,
            status: 'Completed',
            tasks: []
        }
    ];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pre-boarding': return 'bg-yellow-500/20 text-yellow-400';
            case 'Onboarding': return 'bg-blue-500/20 text-blue-400';
            case 'Completed': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="w-full space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <UserPlus className="w-8 h-8 text-blue-500" />
                            Onboarding Dashboard
                        </h1>
                        <p className="text-gray-400 mt-1">Track new hire progress and manage onboarding tasks.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                        <UserPlus className="w-4 h-4" />
                        Initiate Onboarding
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Active Onboarding</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{employees.filter(e => e.status === 'Onboarding').length}</h3>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Pre-boarding</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{employees.filter(e => e.status === 'Pre-boarding').length}</h3>
                            </div>
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <Calendar className="w-5 h-5 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Completed (This Month)</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{employees.filter(e => e.status === 'Completed').length}</h3>
                            </div>
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search new hires..."
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
                            <option value="Pre-boarding">Pre-boarding</option>
                            <option value="Onboarding">Onboarding</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Employee List */}
                <div className="space-y-4">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between gap-6">

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {employee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                                        <p className="text-sm text-gray-400">{employee.role} • {employee.department}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            Joining: {new Date(employee.joiningDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 md:max-w-md">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Onboarding Progress</span>
                                        <span className="text-white font-medium">{employee.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${employee.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                            {employee.status}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                            {employee.tasks.filter(t => t.status !== 'Completed').length} Pending Tasks
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white">
                                        <Mail className="w-5 h-5" />
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
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
