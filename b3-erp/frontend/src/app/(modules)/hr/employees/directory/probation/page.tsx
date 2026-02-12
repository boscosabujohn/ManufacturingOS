'use client';

import React, { useState } from 'react';
import {
    Clock,
    Search,
    Filter,
    Download,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Briefcase,
    Calendar,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface Employee {
    id: string;
    employeeId: string;
    name: string;
    designation: string;
    department: string;
    email: string;
    phone: string;
    location: string;
    joiningDate: string;
    probationEndDate: string;
    daysRemaining: number;
    performanceRating: number;
    status: 'Probation';
}

export default function ProbationEmployeesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const employees: Employee[] = [
        {
            id: '1',
            employeeId: 'EMP004',
            name: 'David Wilson',
            designation: 'Machine Operator',
            department: 'Production',
            email: 'david.w@manufacturingos.com',
            phone: '+1 (555) 456-7890',
            location: 'Austin, TX',
            joiningDate: '2024-11-05',
            probationEndDate: '2025-05-05',
            daysRemaining: 85,
            performanceRating: 4.2,
            status: 'Probation'
        },
        {
            id: '2',
            employeeId: 'EMP020',
            name: 'Lisa Wang',
            designation: 'Quality Inspector',
            department: 'Quality Assurance',
            email: 'lisa.w@manufacturingos.com',
            phone: '+1 (555) 234-5678',
            location: 'Austin, TX',
            joiningDate: '2024-12-01',
            probationEndDate: '2025-06-01',
            daysRemaining: 112,
            performanceRating: 4.5,
            status: 'Probation'
        },
        {
            id: '3',
            employeeId: 'EMP025',
            name: 'James Taylor',
            designation: 'Junior Developer',
            department: 'IT',
            email: 'james.t@manufacturingos.com',
            phone: '+1 (555) 345-6789',
            location: 'New York, NY',
            joiningDate: '2025-01-15',
            probationEndDate: '2025-07-15',
            daysRemaining: 156,
            performanceRating: 3.8,
            status: 'Probation'
        },
        {
            id: '4',
            employeeId: 'EMP030',
            name: 'Emma Garcia',
            designation: 'Sales Associate',
            department: 'Sales',
            email: 'emma.g@manufacturingos.com',
            phone: '+1 (555) 456-7891',
            location: 'Chicago, IL',
            joiningDate: '2024-10-20',
            probationEndDate: '2025-04-20',
            daysRemaining: 70,
            performanceRating: 4.0,
            status: 'Probation'
        }
    ];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'text-green-400';
        if (rating >= 4.0) return 'text-blue-400';
        if (rating >= 3.5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getDaysColor = (days: number) => {
        if (days <= 30) return 'bg-red-500/20 text-red-400';
        if (days <= 60) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-blue-500/20 text-blue-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <Link href="/hr/employees/directory/all" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Clock className="w-8 h-8 text-blue-500" />
                                On Probation
                            </h1>
                            <p className="text-gray-400 mt-1">Employees under probation period</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export List
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total on Probation</p>
                        <p className="text-3xl font-bold text-white">{employees.length}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Ending Soon (30 days)
                        </p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.daysRemaining <= 30).length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            High Performers
                        </p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.performanceRating >= 4.0).length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Avg. Rating
                        </p>
                        <p className="text-3xl font-bold text-white">{(employees.reduce((sum, e) => sum + e.performanceRating, 0) / employees.length).toFixed(1)}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search probation employees..."
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
                            <option value="Production">Production</option>
                            <option value="Quality Assurance">Quality Assurance</option>
                            <option value="IT">IT</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{employee.name}</h3>
                                            <p className="text-sm text-gray-400">{employee.designation}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Briefcase className="w-4 h-4 text-gray-500" />
                                        {employee.department}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        {employee.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        Probation ends: {new Date(employee.probationEndDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Performance Rating:</span>
                                        <span className={`font-bold ${getRatingColor(employee.performanceRating)}`}>
                                            {employee.performanceRating}/5.0
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-700">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDaysColor(employee.daysRemaining)}`}>
                                        {employee.daysRemaining} days remaining
                                    </span>
                                    <div className="text-xs text-gray-500 font-mono">
                                        {employee.employeeId}
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
