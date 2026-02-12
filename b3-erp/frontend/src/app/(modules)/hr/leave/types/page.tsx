'use client';

import React, { useState } from 'react';
import {
    Tag,
    Plus,
    Edit,
    Trash2,
    Search,
    ToggleLeft,
    ToggleRight,
    Calendar,
    Clock
} from 'lucide-react';

interface LeaveType {
    id: string;
    code: string;
    name: string;
    description: string;
    category: 'Paid' | 'Unpaid' | 'Statutory';
    accrualType: 'Monthly' | 'Yearly' | 'Fixed' | 'None';
    accrualRate: number;
    maxAccumulation: number;
    carryForward: boolean;
    maxCarryForward: number;
    encashable: boolean;
    minDays: number;
    maxDays: number;
    noticePeriod: number;
    applicableTo: 'All' | 'Male' | 'Female';
    isActive: boolean;
}

export default function LeaveTypesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const leaveTypes: LeaveType[] = [
        {
            id: '1',
            code: 'AL',
            name: 'Annual Leave',
            description: 'Paid vacation leave for employees',
            category: 'Paid',
            accrualType: 'Monthly',
            accrualRate: 1.75,
            maxAccumulation: 30,
            carryForward: true,
            maxCarryForward: 5,
            encashable: true,
            minDays: 0.5,
            maxDays: 15,
            noticePeriod: 3,
            applicableTo: 'All',
            isActive: true
        },
        {
            id: '2',
            code: 'SL',
            name: 'Sick Leave',
            description: 'Leave for medical reasons',
            category: 'Paid',
            accrualType: 'Yearly',
            accrualRate: 12,
            maxAccumulation: 12,
            carryForward: false,
            maxCarryForward: 0,
            encashable: false,
            minDays: 0.5,
            maxDays: 7,
            noticePeriod: 0,
            applicableTo: 'All',
            isActive: true
        },
        {
            id: '3',
            code: 'CL',
            name: 'Casual Leave',
            description: 'Short-term personal leave',
            category: 'Paid',
            accrualType: 'Yearly',
            accrualRate: 6,
            maxAccumulation: 6,
            carryForward: false,
            maxCarryForward: 0,
            encashable: false,
            minDays: 0.5,
            maxDays: 3,
            noticePeriod: 1,
            applicableTo: 'All',
            isActive: true
        },
        {
            id: '4',
            code: 'ML',
            name: 'Maternity Leave',
            description: 'Statutory leave for childbirth',
            category: 'Statutory',
            accrualType: 'Fixed',
            accrualRate: 182,
            maxAccumulation: 182,
            carryForward: false,
            maxCarryForward: 0,
            encashable: false,
            minDays: 1,
            maxDays: 182,
            noticePeriod: 30,
            applicableTo: 'Female',
            isActive: true
        },
        {
            id: '5',
            code: 'PL',
            name: 'Paternity Leave',
            description: 'Leave for new fathers',
            category: 'Paid',
            accrualType: 'Fixed',
            accrualRate: 5,
            maxAccumulation: 5,
            carryForward: false,
            maxCarryForward: 0,
            encashable: false,
            minDays: 1,
            maxDays: 5,
            noticePeriod: 7,
            applicableTo: 'Male',
            isActive: true
        },
        {
            id: '6',
            code: 'CO',
            name: 'Compensatory Off',
            description: 'Comp off for extra work',
            category: 'Paid',
            accrualType: 'None',
            accrualRate: 0,
            maxAccumulation: 10,
            carryForward: false,
            maxCarryForward: 0,
            encashable: true,
            minDays: 0.5,
            maxDays: 2,
            noticePeriod: 1,
            applicableTo: 'All',
            isActive: true
        },
        {
            id: '7',
            code: 'LWP',
            name: 'Leave Without Pay',
            description: 'Unpaid leave when balance exhausted',
            category: 'Unpaid',
            accrualType: 'None',
            accrualRate: 0,
            maxAccumulation: 30,
            carryForward: false,
            maxCarryForward: 0,
            encashable: false,
            minDays: 1,
            maxDays: 30,
            noticePeriod: 7,
            applicableTo: 'All',
            isActive: true
        }
    ];

    const filteredTypes = leaveTypes.filter(type => {
        const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            type.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || type.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Paid': return 'bg-green-500/20 text-green-400';
            case 'Unpaid': return 'bg-red-500/20 text-red-400';
            case 'Statutory': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Tag className="w-8 h-8 text-blue-500" />
                            Leave Types
                        </h1>
                        <p className="text-gray-400 mt-1">Configure leave type definitions</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Leave Type
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Types</p>
                        <p className="text-3xl font-bold text-white">{leaveTypes.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Paid Leaves</p>
                        <p className="text-3xl font-bold text-white">{leaveTypes.filter(t => t.category === 'Paid').length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Statutory</p>
                        <p className="text-3xl font-bold text-white">{leaveTypes.filter(t => t.category === 'Statutory').length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Active Types</p>
                        <p className="text-3xl font-bold text-white">{leaveTypes.filter(t => t.isActive).length}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search leave types..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Categories</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Statutory">Statutory</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredTypes.map((type) => (
                        <div key={type.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                                            {type.code}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(type.category)}`}>
                                            {type.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">{type.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                                </div>
                                <button className="text-gray-400 hover:text-white">
                                    {type.isActive ? (
                                        <ToggleRight className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <ToggleLeft className="w-6 h-6" />
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Max: </span>
                                    <span className="text-white">{type.maxAccumulation} days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-400">Notice: </span>
                                    <span className="text-white">{type.noticePeriod} days</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {type.carryForward && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                        Carry Forward ({type.maxCarryForward}d)
                                    </span>
                                )}
                                {type.encashable && (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                        Encashable
                                    </span>
                                )}
                                {type.applicableTo !== 'All' && (
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                        {type.applicableTo} Only
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-gray-700">
                                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
