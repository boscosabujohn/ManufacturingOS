'use client';

import React, { useState } from 'react';
import {
    UserX,
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
    FileText
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
    separationDate: string;
    reason: string;
    status: 'Inactive';
}

export default function InactiveEmployeesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');

    const employees: Employee[] = [
        {
            id: '1',
            employeeId: 'EMP005',
            name: 'Jessica Brown',
            designation: 'Procurement Specialist',
            department: 'Procurement',
            email: 'jessica.b@manufacturingos.com',
            phone: '+1 (555) 567-8901',
            location: 'New York, NY',
            joiningDate: '2019-08-01',
            separationDate: '2024-01-15',
            reason: 'Resignation',
            status: 'Inactive'
        },
        {
            id: '2',
            employeeId: 'EMP010',
            name: 'Thomas Anderson',
            designation: 'Warehouse Associate',
            department: 'Warehouse',
            email: 'thomas.a@manufacturingos.com',
            phone: '+1 (555) 890-1234',
            location: 'Austin, TX',
            joiningDate: '2021-03-10',
            separationDate: '2024-02-28',
            reason: 'Termination',
            status: 'Inactive'
        },
        {
            id: '3',
            employeeId: 'EMP015',
            name: 'Rachel Green',
            designation: 'Marketing Coordinator',
            department: 'Marketing',
            email: 'rachel.g@manufacturingos.com',
            phone: '+1 (555) 901-2345',
            location: 'Chicago, IL',
            joiningDate: '2020-06-15',
            separationDate: '2023-12-31',
            reason: 'Retirement',
            status: 'Inactive'
        }
    ];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesReason = reasonFilter === 'all' || emp.reason === reasonFilter;
        return matchesSearch && matchesReason;
    });

    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'Resignation': return 'bg-yellow-500/20 text-yellow-400';
            case 'Termination': return 'bg-red-500/20 text-red-400';
            case 'Retirement': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
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
                                <UserX className="w-8 h-8 text-red-500" />
                                Inactive Employees
                            </h1>
                            <p className="text-gray-400 mt-1">Separated employees and former workforce</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export Records
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Total Separated</p>
                        <p className="text-3xl font-bold text-white">{employees.length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Resignations</p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.reason === 'Resignation').length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Terminations</p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.reason === 'Termination').length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Retirements</p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.reason === 'Retirement').length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search separated employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={reasonFilter}
                            onChange={(e) => setReasonFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="all">All Reasons</option>
                            <option value="Resignation">Resignation</option>
                            <option value="Termination">Termination</option>
                            <option value="Retirement">Retirement</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-red-500/50 transition-all duration-300 group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg opacity-60">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">{employee.name}</h3>
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
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        {employee.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        Separated: {new Date(employee.separationDate).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-700">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReasonColor(employee.reason)}`}>
                                        {employee.reason}
                                    </span>
                                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                                        <FileText className="w-3 h-3" />
                                        View Records
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
