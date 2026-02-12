'use client';

import React, { useState } from 'react';
import {
    Clock,
    Plus,
    Search,
    Edit,
    Trash2,
    Sun,
    Moon,
    Sunrise,
    Sunset,
    Users,
    Calendar,
    CheckCircle
} from 'lucide-react';

interface Shift {
    id: string;
    code: string;
    name: string;
    startTime: string;
    endTime: string;
    breakDuration: number;
    workingHours: number;
    type: 'Day' | 'Night' | 'Morning' | 'Evening' | 'Rotational';
    color: string;
    description: string;
    employeeCount: number;
    status: 'Active' | 'Inactive';
    allowOvertime: boolean;
    overtimeMultiplier: number;
}

export default function ShiftMasterPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const shifts: Shift[] = [
        {
            id: '1',
            code: 'DAY',
            name: 'Day Shift',
            startTime: '09:00',
            endTime: '18:00',
            breakDuration: 60,
            workingHours: 8,
            type: 'Day',
            color: '#3B82F6',
            description: 'Standard day shift for office and admin staff',
            employeeCount: 85,
            status: 'Active',
            allowOvertime: true,
            overtimeMultiplier: 1.5
        },
        {
            id: '2',
            code: 'MOR',
            name: 'Morning Shift',
            startTime: '06:00',
            endTime: '14:00',
            breakDuration: 30,
            workingHours: 7.5,
            type: 'Morning',
            color: '#F59E0B',
            description: 'Early morning shift for production team A',
            employeeCount: 25,
            status: 'Active',
            allowOvertime: true,
            overtimeMultiplier: 1.5
        },
        {
            id: '3',
            code: 'EVE',
            name: 'Evening Shift',
            startTime: '14:00',
            endTime: '22:00',
            breakDuration: 30,
            workingHours: 7.5,
            type: 'Evening',
            color: '#8B5CF6',
            description: 'Afternoon to evening shift for production team B',
            employeeCount: 22,
            status: 'Active',
            allowOvertime: true,
            overtimeMultiplier: 1.5
        },
        {
            id: '4',
            code: 'NGT',
            name: 'Night Shift',
            startTime: '22:00',
            endTime: '06:00',
            breakDuration: 30,
            workingHours: 7.5,
            type: 'Night',
            color: '#1E40AF',
            description: 'Overnight shift for continuous operations',
            employeeCount: 18,
            status: 'Active',
            allowOvertime: true,
            overtimeMultiplier: 2.0
        },
        {
            id: '5',
            code: 'ROT',
            name: 'Rotational Shift',
            startTime: '00:00',
            endTime: '00:00',
            breakDuration: 30,
            workingHours: 8,
            type: 'Rotational',
            color: '#10B981',
            description: 'Rotating weekly shift pattern',
            employeeCount: 12,
            status: 'Active',
            allowOvertime: true,
            overtimeMultiplier: 1.5
        }
    ];

    const filteredShifts = shifts.filter(shift => {
        const matchesSearch = shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shift.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || shift.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Morning': return <Sunrise className="w-5 h-5" />;
            case 'Day': return <Sun className="w-5 h-5" />;
            case 'Evening': return <Sunset className="w-5 h-5" />;
            case 'Night': return <Moon className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const totalEmployees = shifts.reduce((sum, s) => sum + s.employeeCount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Clock className="w-8 h-8 text-blue-500" />
                            Shift Master
                        </h1>
                        <p className="text-gray-400 mt-1">Define and manage shift configurations</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Create Shift
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Shifts</p>
                        <p className="text-3xl font-bold text-white">{shifts.length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Sunrise className="w-6 h-6 text-yellow-400" />
                        <div>
                            <p className="text-yellow-400 text-sm">Morning</p>
                            <p className="text-xl font-bold text-white">{shifts.filter(s => s.type === 'Morning').length}</p>
                        </div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Sun className="w-6 h-6 text-orange-400" />
                        <div>
                            <p className="text-orange-400 text-sm">Day</p>
                            <p className="text-xl font-bold text-white">{shifts.filter(s => s.type === 'Day').length}</p>
                        </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Moon className="w-6 h-6 text-purple-400" />
                        <div>
                            <p className="text-purple-400 text-sm">Night</p>
                            <p className="text-xl font-bold text-white">{shifts.filter(s => s.type === 'Night').length}</p>
                        </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{totalEmployees}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search shifts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        <option value="Day">Day</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                        <option value="Rotational">Rotational</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredShifts.map((shift) => (
                        <div key={shift.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                        style={{ backgroundColor: shift.color + '33' }}
                                    >
                                        <span style={{ color: shift.color }}>{getTypeIcon(shift.type)}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-white">{shift.name}</h3>
                                            <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-mono rounded">
                                                {shift.code}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{shift.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-700/30 rounded-lg">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Start</p>
                                    <p className="text-lg font-bold text-white">{shift.startTime}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">End</p>
                                    <p className="text-lg font-bold text-white">{shift.endTime}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Break</p>
                                    <p className="text-lg font-bold text-white">{shift.breakDuration}m</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Hours</p>
                                    <p className="text-lg font-bold text-white">{shift.workingHours}h</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-400">{shift.employeeCount} employees</span>
                                    </div>
                                    {shift.allowOvertime && (
                                        <div className="flex items-center gap-1 text-sm text-green-400">
                                            <CheckCircle className="w-4 h-4" />
                                            OT {shift.overtimeMultiplier}x
                                        </div>
                                    )}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${shift.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {shift.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
