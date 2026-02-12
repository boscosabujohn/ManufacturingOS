'use client';

import React, { useState } from 'react';
import {
    Award,
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    DollarSign,
    MoreVertical,
    Building,
    TrendingUp
} from 'lucide-react';

interface Designation {
    id: string;
    code: string;
    title: string;
    level: number;
    department: string;
    employeeCount: number;
    salaryRangeMin: number;
    salaryRangeMax: number;
    responsibilities: string[];
    status: 'Active' | 'Inactive';
}

export default function DesignationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');

    const designations: Designation[] = [
        {
            id: '1',
            code: 'CEO',
            title: 'Chief Executive Officer',
            level: 1,
            department: 'Executive',
            employeeCount: 1,
            salaryRangeMin: 300000,
            salaryRangeMax: 500000,
            responsibilities: ['Strategic planning', 'Board relations', 'Company vision'],
            status: 'Active'
        },
        {
            id: '2',
            code: 'VP',
            title: 'Vice President',
            level: 2,
            department: 'Multiple',
            employeeCount: 4,
            salaryRangeMin: 180000,
            salaryRangeMax: 280000,
            responsibilities: ['Department leadership', 'Budget management', 'Strategic execution'],
            status: 'Active'
        },
        {
            id: '3',
            code: 'MGR',
            title: 'Manager',
            level: 3,
            department: 'Multiple',
            employeeCount: 15,
            salaryRangeMin: 80000,
            salaryRangeMax: 140000,
            responsibilities: ['Team management', 'Project oversight', 'Performance reviews'],
            status: 'Active'
        },
        {
            id: '4',
            code: 'SR_ENG',
            title: 'Senior Engineer',
            level: 4,
            department: 'Engineering',
            employeeCount: 20,
            salaryRangeMin: 90000,
            salaryRangeMax: 130000,
            responsibilities: ['Technical leadership', 'Code reviews', 'Architecture design'],
            status: 'Active'
        },
        {
            id: '5',
            code: 'ENG',
            title: 'Engineer',
            level: 5,
            department: 'Engineering',
            employeeCount: 35,
            salaryRangeMin: 60000,
            salaryRangeMax: 90000,
            responsibilities: ['Development', 'Testing', 'Documentation'],
            status: 'Active'
        },
        {
            id: '6',
            code: 'OPR',
            title: 'Machine Operator',
            level: 6,
            department: 'Production',
            employeeCount: 50,
            salaryRangeMin: 35000,
            salaryRangeMax: 55000,
            responsibilities: ['Machine operation', 'Quality checks', 'Safety compliance'],
            status: 'Active'
        },
        {
            id: '7',
            code: 'ANALYST',
            title: 'Business Analyst',
            level: 5,
            department: 'Multiple',
            employeeCount: 12,
            salaryRangeMin: 55000,
            salaryRangeMax: 85000,
            responsibilities: ['Requirements gathering', 'Process analysis', 'Reporting'],
            status: 'Active'
        },
        {
            id: '8',
            code: 'INTERN',
            title: 'Intern',
            level: 7,
            department: 'Multiple',
            employeeCount: 8,
            salaryRangeMin: 25000,
            salaryRangeMax: 35000,
            responsibilities: ['Learning', 'Support tasks', 'Documentation'],
            status: 'Active'
        }
    ];

    const filteredDesignations = designations.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === 'all' || d.level === parseInt(levelFilter);
        return matchesSearch && matchesLevel;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getLevelColor = (level: number) => {
        const colors = [
            'from-purple-500 to-pink-500',
            'from-blue-500 to-cyan-500',
            'from-green-500 to-teal-500',
            'from-yellow-500 to-orange-500',
            'from-red-500 to-rose-500',
            'from-indigo-500 to-purple-500',
            'from-gray-500 to-slate-500'
        ];
        return colors[(level - 1) % colors.length];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Award className="w-8 h-8 text-blue-500" />
                            Designations
                        </h1>
                        <p className="text-gray-400 mt-1">Manage job titles and hierarchy levels</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Designation
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Designations</p>
                        <p className="text-3xl font-bold text-white">{designations.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{designations.reduce((sum, d) => sum + d.employeeCount, 0)}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Hierarchy Levels</p>
                        <p className="text-3xl font-bold text-white">{Math.max(...designations.map(d => d.level))}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Avg. Salary Range</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(designations.reduce((sum, d) => sum + (d.salaryRangeMin + d.salaryRangeMax) / 2, 0) / designations.length)}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search designations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Levels</option>
                        {[1, 2, 3, 4, 5, 6, 7].map(level => (
                            <option key={level} value={level}>Level {level}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredDesignations.map((designation) => (
                        <div key={designation.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all">
                            <div className={`h-2 bg-gradient-to-r ${getLevelColor(designation.level)}`}></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-mono rounded">
                                                {designation.code}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                                Level {designation.level}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">{designation.title}</h3>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Building className="w-4 h-4" />
                                        {designation.department}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Users className="w-4 h-4" />
                                        {designation.employeeCount} employees
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <DollarSign className="w-4 h-4" />
                                        {formatCurrency(designation.salaryRangeMin)} - {formatCurrency(designation.salaryRangeMax)}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-700">
                                    <p className="text-xs text-gray-500 mb-2">Key Responsibilities:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {designation.responsibilities.slice(0, 3).map((resp, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                                                {resp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 p-3 flex justify-end gap-2">
                                <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
