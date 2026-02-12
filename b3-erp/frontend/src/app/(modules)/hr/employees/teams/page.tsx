'use client';

import React, { useState } from 'react';
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    User,
    Building,
    MoreVertical,
    Target,
    Calendar
} from 'lucide-react';

interface Team {
    id: string;
    name: string;
    description: string;
    department: string;
    leadName: string;
    leadId: string;
    memberCount: number;
    maxCapacity: number;
    status: 'Active' | 'Inactive';
    projectsAssigned: number;
    createdAt: string;
}

export default function TeamsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const teams: Team[] = [
        {
            id: '1',
            name: 'Alpha Production',
            description: 'Primary production line team',
            department: 'Production',
            leadName: 'Michael Chen',
            leadId: 'EMP002',
            memberCount: 12,
            maxCapacity: 15,
            status: 'Active',
            projectsAssigned: 3,
            createdAt: '2023-01-15'
        },
        {
            id: '2',
            name: 'Quality Inspectors',
            description: 'Quality assurance and testing team',
            department: 'Quality Assurance',
            leadName: 'Emily Davis',
            leadId: 'EMP003',
            memberCount: 8,
            maxCapacity: 10,
            status: 'Active',
            projectsAssigned: 5,
            createdAt: '2023-02-20'
        },
        {
            id: '3',
            name: 'HR Core',
            description: 'Human resources management team',
            department: 'Human Resources',
            leadName: 'Lisa Wong',
            leadId: 'EMP007',
            memberCount: 6,
            maxCapacity: 8,
            status: 'Active',
            projectsAssigned: 2,
            createdAt: '2023-01-01'
        },
        {
            id: '4',
            name: 'Finance Operations',
            description: 'Accounting and financial operations',
            department: 'Finance',
            leadName: 'Chris Anderson',
            leadId: 'EMP012',
            memberCount: 5,
            maxCapacity: 6,
            status: 'Active',
            projectsAssigned: 1,
            createdAt: '2023-03-10'
        },
        {
            id: '5',
            name: 'Beta Production',
            description: 'Secondary production line team',
            department: 'Production',
            leadName: 'David Lee',
            leadId: 'EMP008',
            memberCount: 10,
            maxCapacity: 12,
            status: 'Active',
            projectsAssigned: 4,
            createdAt: '2023-04-01'
        },
        {
            id: '6',
            name: 'IT Support',
            description: 'Technical support and infrastructure',
            department: 'IT',
            leadName: 'James Taylor',
            leadId: 'EMP015',
            memberCount: 7,
            maxCapacity: 10,
            status: 'Active',
            projectsAssigned: 6,
            createdAt: '2023-02-15'
        }
    ];

    const filteredTeams = teams.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || team.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const totalMembers = teams.reduce((sum, t) => sum + t.memberCount, 0);
    const departments = Array.from(new Set(teams.map(t => t.department)));

    const getCapacityColor = (current: number, max: number) => {
        const ratio = current / max;
        if (ratio >= 0.9) return 'bg-red-500';
        if (ratio >= 0.7) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-500" />
                            Teams
                        </h1>
                        <p className="text-gray-400 mt-1">Manage team structure and assignments</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Create Team
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Teams</p>
                        <p className="text-3xl font-bold text-white">{teams.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Members</p>
                        <p className="text-3xl font-bold text-white">{totalMembers}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Active Projects</p>
                        <p className="text-3xl font-bold text-white">{teams.reduce((sum, t) => sum + t.projectsAssigned, 0)}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Avg. Team Size</p>
                        <p className="text-3xl font-bold text-white">{Math.round(totalMembers / teams.length)}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredTeams.map((team) => (
                        <div key={team.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Building className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-400">{team.department}</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-400 mb-4">{team.description}</p>

                                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-700/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {team.leadName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Team Lead</p>
                                        <p className="text-white font-medium">{team.leadName}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-300">Team Capacity</span>
                                        </div>
                                        <span className="text-white">{team.memberCount}/{team.maxCapacity}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getCapacityColor(team.memberCount, team.maxCapacity)}`}
                                            style={{ width: `${(team.memberCount / team.maxCapacity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Target className="w-4 h-4" />
                                        {team.projectsAssigned} projects
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        Since {new Date(team.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 p-3 flex justify-end gap-2">
                                <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                    <User className="w-4 h-4" /> Members
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
