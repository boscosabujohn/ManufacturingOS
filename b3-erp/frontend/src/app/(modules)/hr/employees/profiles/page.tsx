'use client';

import React, { useState } from 'react';
import {
    User,
    Search,
    Edit,
    Eye,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Award,
    GraduationCap,
    FileText,
    Shield
} from 'lucide-react';

interface EmployeeProfile {
    id: string;
    employeeId: string;
    name: string;
    designation: string;
    department: string;
    email: string;
    phone: string;
    location: string;
    joiningDate: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    profileCompletion: number;
    lastUpdated: string;
}

export default function EmployeeProfilesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [completionFilter, setCompletionFilter] = useState('all');

    const profiles: EmployeeProfile[] = [
        {
            id: '1',
            employeeId: 'EMP001',
            name: 'Sarah Johnson',
            designation: 'Senior HR Manager',
            department: 'Human Resources',
            email: 'sarah.j@manufacturingos.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            joiningDate: '2020-03-15',
            status: 'Active',
            profileCompletion: 95,
            lastUpdated: '2025-01-10'
        },
        {
            id: '2',
            employeeId: 'EMP002',
            name: 'Michael Chen',
            designation: 'Production Supervisor',
            department: 'Production',
            email: 'michael.c@manufacturingos.com',
            phone: '+1 (555) 234-5678',
            location: 'Austin, TX',
            joiningDate: '2021-06-10',
            status: 'Active',
            profileCompletion: 80,
            lastUpdated: '2025-01-08'
        },
        {
            id: '3',
            employeeId: 'EMP003',
            name: 'Emily Davis',
            designation: 'Quality Analyst',
            department: 'Quality Assurance',
            email: 'emily.d@manufacturingos.com',
            phone: '+1 (555) 345-6789',
            location: 'Austin, TX',
            joiningDate: '2022-01-20',
            status: 'On Leave',
            profileCompletion: 65,
            lastUpdated: '2024-12-15'
        },
        {
            id: '4',
            employeeId: 'EMP004',
            name: 'David Wilson',
            designation: 'Machine Operator',
            department: 'Production',
            email: 'david.w@manufacturingos.com',
            phone: '+1 (555) 456-7890',
            location: 'Austin, TX',
            joiningDate: '2023-11-05',
            status: 'Active',
            profileCompletion: 45,
            lastUpdated: '2024-11-20'
        }
    ];

    const filteredProfiles = profiles.filter(profile => {
        const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCompletion = completionFilter === 'all' ||
            (completionFilter === 'complete' && profile.profileCompletion >= 90) ||
            (completionFilter === 'partial' && profile.profileCompletion >= 50 && profile.profileCompletion < 90) ||
            (completionFilter === 'incomplete' && profile.profileCompletion < 50);
        return matchesSearch && matchesCompletion;
    });

    const getCompletionColor = (completion: number) => {
        if (completion >= 90) return 'bg-green-500';
        if (completion >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400';
            case 'Inactive': return 'bg-red-500/20 text-red-400';
            case 'On Leave': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <User className="w-8 h-8 text-blue-500" />
                            Employee Profiles
                        </h1>
                        <p className="text-gray-400 mt-1">View and manage detailed employee information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Profiles</p>
                        <p className="text-3xl font-bold text-white">{profiles.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Complete (90%+)</p>
                        <p className="text-3xl font-bold text-white">{profiles.filter(p => p.profileCompletion >= 90).length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Partial (50-89%)</p>
                        <p className="text-3xl font-bold text-white">{profiles.filter(p => p.profileCompletion >= 50 && p.profileCompletion < 90).length}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Incomplete (&lt;50%)</p>
                        <p className="text-3xl font-bold text-white">{profiles.filter(p => p.profileCompletion < 50).length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search employee profiles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={completionFilter}
                        onChange={(e) => setCompletionFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Profiles</option>
                        <option value="complete">Complete (90%+)</option>
                        <option value="partial">Partial (50-89%)</option>
                        <option value="incomplete">Incomplete (&lt;50%)</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {filteredProfiles.map((profile) => (
                        <div key={profile.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                                        <p className="text-gray-400">{profile.designation} • {profile.department}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.email}</span>
                                            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                                            {profile.status}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono">{profile.employeeId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Profile Completion:</span>
                                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className={`h-full ${getCompletionColor(profile.profileCompletion)}`} style={{ width: `${profile.profileCompletion}%` }}></div>
                                        </div>
                                        <span className="text-sm text-white font-medium">{profile.profileCompletion}%</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                            <Eye className="w-4 h-4" /> View
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Education</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Experience</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Award className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Skills</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Documents</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Compliance</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
