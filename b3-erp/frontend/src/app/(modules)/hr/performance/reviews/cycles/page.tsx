'use client';

import React, { useState } from 'react';
import {
    Target,
    Plus,
    Search,
    Filter,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    BarChart2,
    MoreHorizontal,
    ArrowRight
} from 'lucide-react';

interface ReviewCycle {
    id: string;
    name: string;
    type: 'Annual' | 'Mid-Year' | 'Probation' | 'Project-Based';
    startDate: string;
    endDate: string;
    status: 'Active' | 'Planned' | 'Completed' | 'Archived';
    participants: number;
    completionRate: number;
    description: string;
}

export default function ReviewCyclesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock Data
    const cycles: ReviewCycle[] = [
        {
            id: '1',
            name: 'Annual Performance Review 2024',
            type: 'Annual',
            startDate: '2024-12-01',
            endDate: '2025-01-31',
            status: 'Active',
            participants: 150,
            completionRate: 65,
            description: 'End of year performance assessment for all permanent employees.'
        },
        {
            id: '2',
            name: 'Mid-Year Review 2025',
            type: 'Mid-Year',
            startDate: '2025-06-01',
            endDate: '2025-07-15',
            status: 'Planned',
            participants: 155,
            completionRate: 0,
            description: 'Mid-year check-in and goal adjustment.'
        },
        {
            id: '3',
            name: 'Q1 Probation Review',
            type: 'Probation',
            startDate: '2025-01-10',
            endDate: '2025-01-25',
            status: 'Active',
            participants: 12,
            completionRate: 40,
            description: 'Probation confirmation reviews for Q4 hires.'
        },
        {
            id: '4',
            name: 'Annual Performance Review 2023',
            type: 'Annual',
            startDate: '2023-12-01',
            endDate: '2024-01-31',
            status: 'Completed',
            participants: 140,
            completionRate: 100,
            description: 'Archived review cycle for previous year.'
        }
    ];

    const filteredCycles = cycles.filter(cycle => {
        const matchesSearch = cycle.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || cycle.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Planned': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'Completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
            case 'Archived': return 'bg-gray-700/50 text-gray-500 border-gray-700';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
            <div className="w-full space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Target className="w-8 h-8 text-purple-500" />
                            Performance Review Cycles
                        </h1>
                        <p className="text-gray-400 mt-1">Manage appraisal periods, track progress, and view history.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-900/20">
                        <Plus className="w-4 h-4" />
                        Create New Cycle
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search cycles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Planned">Planned</option>
                            <option value="Completed">Completed</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Cycles Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredCycles.map((cycle) => (
                        <div key={cycle.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-500/50 transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between gap-6">

                                {/* Left Section: Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{cycle.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cycle.status)}`}>
                                            {cycle.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">{cycle.description}</p>

                                    <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            {cycle.participants} Participants
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-green-400" />
                                            {cycle.type}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Progress & Actions */}
                                <div className="flex flex-col justify-between items-end min-w-[250px] gap-4">
                                    <div className="w-full">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Completion</span>
                                            <span className="text-white font-medium">{cycle.completionRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${cycle.completionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                                            Settings
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {filteredCycles.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No review cycles found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
