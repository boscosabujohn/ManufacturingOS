'use client';

import React, { useState } from 'react';
import {
    FileText,
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
    Clock,
    RefreshCw
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
    contractStartDate: string;
    contractEndDate: string;
    contractType: string;
    vendor?: string;
    daysRemaining: number;
    status: 'Contract';
}

export default function ContractEmployeesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [contractTypeFilter, setContractTypeFilter] = useState('all');

    const employees: Employee[] = [
        {
            id: '1',
            employeeId: 'CON001',
            name: 'Kevin Ross',
            designation: 'IT Consultant',
            department: 'IT',
            email: 'kevin.r@contractormail.com',
            phone: '+1 (555) 111-2222',
            location: 'New York, NY',
            contractStartDate: '2024-06-01',
            contractEndDate: '2025-05-31',
            contractType: 'Fixed-Term',
            vendor: 'TechStaff Inc.',
            daysRemaining: 112,
            status: 'Contract'
        },
        {
            id: '2',
            employeeId: 'CON002',
            name: 'Patricia Moore',
            designation: 'Data Analyst',
            department: 'Analytics',
            email: 'patricia.m@contractormail.com',
            phone: '+1 (555) 222-3333',
            location: 'Austin, TX',
            contractStartDate: '2024-09-01',
            contractEndDate: '2025-03-31',
            contractType: 'Project-Based',
            daysRemaining: 50,
            status: 'Contract'
        },
        {
            id: '3',
            employeeId: 'CON003',
            name: 'Christopher Lee',
            designation: 'Mechanical Engineer',
            department: 'Engineering',
            email: 'christopher.l@contractormail.com',
            phone: '+1 (555) 333-4444',
            location: 'Detroit, MI',
            contractStartDate: '2024-01-15',
            contractEndDate: '2025-01-14',
            contractType: 'Fixed-Term',
            vendor: 'EngineerPro LLC',
            daysRemaining: 0,
            status: 'Contract'
        },
        {
            id: '4',
            employeeId: 'CON004',
            name: 'Maria Santos',
            designation: 'HR Specialist',
            department: 'Human Resources',
            email: 'maria.s@contractormail.com',
            phone: '+1 (555) 444-5555',
            location: 'Chicago, IL',
            contractStartDate: '2024-08-01',
            contractEndDate: '2025-07-31',
            contractType: 'Temp-to-Perm',
            vendor: 'StaffSolutions',
            daysRemaining: 173,
            status: 'Contract'
        }
    ];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = contractTypeFilter === 'all' || emp.contractType === contractTypeFilter;
        return matchesSearch && matchesType;
    });

    const getContractTypeColor = (type: string) => {
        switch (type) {
            case 'Fixed-Term': return 'bg-blue-500/20 text-blue-400';
            case 'Project-Based': return 'bg-purple-500/20 text-purple-400';
            case 'Temp-to-Perm': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getDaysColor = (days: number) => {
        if (days <= 0) return 'bg-red-500/20 text-red-400';
        if (days <= 30) return 'bg-orange-500/20 text-orange-400';
        if (days <= 60) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-green-500/20 text-green-400';
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
                                <FileText className="w-8 h-8 text-purple-500" />
                                Contract Employees
                            </h1>
                            <p className="text-gray-400 mt-1">Contractors and temporary workers</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        Export List
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Contractors</p>
                        <p className="text-3xl font-bold text-white">{employees.length}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Expiring Soon
                        </p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.daysRemaining <= 30).length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Fixed-Term
                        </p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.contractType === 'Fixed-Term').length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm flex items-center gap-1">
                            <RefreshCw className="w-4 h-4" />
                            Temp-to-Perm
                        </p>
                        <p className="text-3xl font-bold text-white">{employees.filter(e => e.contractType === 'Temp-to-Perm').length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search contract employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={contractTypeFilter}
                            onChange={(e) => setContractTypeFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Contract Types</option>
                            <option value="Fixed-Term">Fixed-Term</option>
                            <option value="Project-Based">Project-Based</option>
                            <option value="Temp-to-Perm">Temp-to-Perm</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">{employee.name}</h3>
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
                                    {employee.vendor && (
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            Vendor: {employee.vendor}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        Ends: {new Date(employee.contractEndDate).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-700">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContractTypeColor(employee.contractType)}`}>
                                        {employee.contractType}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDaysColor(employee.daysRemaining)}`}>
                                        {employee.daysRemaining <= 0 ? 'Expired' : `${employee.daysRemaining} days left`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
