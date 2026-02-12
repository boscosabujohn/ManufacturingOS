'use client';

import React, { useState } from 'react';
import {
    Building2,
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    User,
    TrendingUp,
    MoreVertical
} from 'lucide-react';

interface Department {
    id: string;
    code: string;
    name: string;
    description: string;
    headName: string;
    headId: string;
    employeeCount: number;
    budgetAllocated: number;
    budgetUtilized: number;
    status: 'Active' | 'Inactive';
    createdAt: string;
}

export default function DepartmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const departments: Department[] = [
        {
            id: '1',
            code: 'HR',
            name: 'Human Resources',
            description: 'Manages employee lifecycle, recruitment, and HR policies',
            headName: 'Sarah Johnson',
            headId: 'EMP001',
            employeeCount: 15,
            budgetAllocated: 500000,
            budgetUtilized: 320000,
            status: 'Active',
            createdAt: '2020-01-01'
        },
        {
            id: '2',
            code: 'PROD',
            name: 'Production',
            description: 'Manufacturing and production operations',
            headName: 'Michael Chen',
            headId: 'EMP002',
            employeeCount: 85,
            budgetAllocated: 2500000,
            budgetUtilized: 1800000,
            status: 'Active',
            createdAt: '2020-01-01'
        },
        {
            id: '3',
            code: 'QA',
            name: 'Quality Assurance',
            description: 'Quality control and assurance processes',
            headName: 'Emily Davis',
            headId: 'EMP003',
            employeeCount: 20,
            budgetAllocated: 400000,
            budgetUtilized: 280000,
            status: 'Active',
            createdAt: '2020-01-01'
        },
        {
            id: '4',
            code: 'FIN',
            name: 'Finance',
            description: 'Financial planning, accounting, and reporting',
            headName: 'Jennifer Brown',
            headId: 'EMP004',
            employeeCount: 12,
            budgetAllocated: 350000,
            budgetUtilized: 220000,
            status: 'Active',
            createdAt: '2020-01-01'
        },
        {
            id: '5',
            code: 'IT',
            name: 'Information Technology',
            description: 'IT infrastructure and software development',
            headName: 'David Wilson',
            headId: 'EMP005',
            employeeCount: 18,
            budgetAllocated: 800000,
            budgetUtilized: 550000,
            status: 'Active',
            createdAt: '2020-01-01'
        },
        {
            id: '6',
            code: 'SALES',
            name: 'Sales',
            description: 'Sales and business development',
            headName: 'Robert Martinez',
            headId: 'EMP006',
            employeeCount: 25,
            budgetAllocated: 600000,
            budgetUtilized: 420000,
            status: 'Active',
            createdAt: '2020-01-01'
        }
    ];

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
    const totalBudget = departments.reduce((sum, d) => sum + d.budgetAllocated, 0);
    const totalUtilized = departments.reduce((sum, d) => sum + d.budgetUtilized, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-blue-500" />
                            Departments
                        </h1>
                        <p className="text-gray-400 mt-1">Manage organizational departments</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Department
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Departments</p>
                        <p className="text-3xl font-bold text-white">{departments.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{totalEmployees}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Budget</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(totalBudget)}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Budget Utilization</p>
                        <p className="text-2xl font-bold text-white">{Math.round((totalUtilized / totalBudget) * 100)}%</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredDepartments.map((dept) => (
                        <div key={dept.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">
                                                {dept.code}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded ${dept.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {dept.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">{dept.name}</h3>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-400 mb-4">{dept.description}</p>

                                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-700/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {dept.headName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Department Head</p>
                                        <p className="text-white font-medium">{dept.headName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">{dept.employeeCount} employees</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300">{Math.round((dept.budgetUtilized / dept.budgetAllocated) * 100)}% utilized</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Budget</span>
                                        <span className="text-white">{formatCurrency(dept.budgetAllocated)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                            style={{ width: `${(dept.budgetUtilized / dept.budgetAllocated) * 100}%` }}
                                        ></div>
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
