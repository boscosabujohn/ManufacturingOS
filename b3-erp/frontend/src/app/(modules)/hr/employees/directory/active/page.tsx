'use client';

import React, { useState } from 'react';
import {
    UserCheck,
    Search,
    Filter,
    Download,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Briefcase,
    Calendar,
    ArrowLeft
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
    status: 'Active';
}

export default function ActiveEmployeesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const employees: Employee[] = [
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
            status: 'Active'
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
            status: 'Active'
        },
        {
            id: '3',
            employeeId: 'EMP006',
            name: 'Robert Martinez',
            designation: 'Finance Manager',
            department: 'Finance',
            email: 'robert.m@manufacturingos.com',
            phone: '+1 (555) 678-9012',
            location: 'New York, NY',
            joiningDate: '2019-11-20',
            status: 'Active'
        },
        {
            id: '4',
            employeeId: 'EMP007',
            name: 'Amanda Lee',
            designation: 'Sales Executive',
            department: 'Sales',
            email: 'amanda.l@manufacturingos.com',
            phone: '+1 (555) 789-0123',
            location: 'Chicago, IL',
            joiningDate: '2022-05-15',
            status: 'Active'
        }
    ];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

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
                                <UserCheck className="w-8 h-8 text-green-500" />
                                Active Employees
                            </h1>
                            <p className="text-gray-400 mt-1">Currently employed workforce</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export List
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Active</p>
                        <p className="text-3xl font-bold text-white">{employees.length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Production</p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.department === 'Production').length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Admin & HR</p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.department === 'Human Resources').length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Departments</p>
                        <p className="text-3xl font-bold text-white">{new Set(employees.map(e => e.department)).size}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search active employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Departments</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Production">Production</option>
                            <option value="Finance">Finance</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-green-500/50 transition-all duration-300 group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">{employee.name}</h3>
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
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        {employee.phone}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        {employee.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        Joined: {new Date(employee.joiningDate).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-700">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                        Active
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
