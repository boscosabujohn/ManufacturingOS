'use client';

import React, { useState } from 'react';
import {
    Clock,
    Plus,
    Search,
    Edit,
    Trash2,
    Calendar,
    Sun,
    Moon,
    Sunrise,
    Users,
    CheckCircle
} from 'lucide-react';

interface WorkingHours {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    breakDuration: number;
    totalHours: number;
    type: 'Regular' | 'Morning' | 'Evening' | 'Night' | 'Flexible';
    appliedDays: string[];
    employeeCount: number;
    status: 'Active' | 'Inactive';
}

export default function WorkingHoursPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const workingHours: WorkingHours[] = [
        {
            id: '1',
            name: 'Standard Office Hours',
            description: 'Regular 9 AM to 6 PM office timing',
            startTime: '09:00',
            endTime: '18:00',
            breakDuration: 60,
            totalHours: 8,
            type: 'Regular',
            appliedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            employeeCount: 85,
            status: 'Active'
        },
        {
            id: '2',
            name: 'Morning Shift',
            description: 'Early morning production shift',
            startTime: '06:00',
            endTime: '14:00',
            breakDuration: 30,
            totalHours: 7.5,
            type: 'Morning',
            appliedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            employeeCount: 25,
            status: 'Active'
        },
        {
            id: '3',
            name: 'Evening Shift',
            description: 'Afternoon to evening production shift',
            startTime: '14:00',
            endTime: '22:00',
            breakDuration: 30,
            totalHours: 7.5,
            type: 'Evening',
            appliedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            employeeCount: 22,
            status: 'Active'
        },
        {
            id: '4',
            name: 'Night Shift',
            description: 'Overnight shift for continuous operations',
            startTime: '22:00',
            endTime: '06:00',
            breakDuration: 30,
            totalHours: 7.5,
            type: 'Night',
            appliedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            employeeCount: 18,
            status: 'Active'
        },
        {
            id: '5',
            name: 'Flexible Hours',
            description: 'Flexible timing for remote and senior staff',
            startTime: '08:00',
            endTime: '20:00',
            breakDuration: 60,
            totalHours: 8,
            type: 'Flexible',
            appliedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            employeeCount: 12,
            status: 'Active'
        }
    ];

    const filteredHours = workingHours.filter(wh =>
        wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wh.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Morning': return <Sunrise className="w-5 h-5 text-orange-400" />;
            case 'Evening': return <Sun className="w-5 h-5 text-yellow-400" />;
            case 'Night': return <Moon className="w-5 h-5 text-purple-400" />;
            case 'Flexible': return <Clock className="w-5 h-5 text-green-400" />;
            default: return <Clock className="w-5 h-5 text-blue-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Morning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'Evening': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Night': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Flexible': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const totalEmployees = workingHours.reduce((sum, wh) => sum + wh.employeeCount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Clock className="w-8 h-8 text-blue-500" />
                            Working Hours
                        </h1>
                        <p className="text-gray-400 mt-1">Configure working hour schedules</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Schedule
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Schedules</p>
                        <p className="text-3xl font-bold text-white">{workingHours.length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Morning Shifts</p>
                        <p className="text-3xl font-bold text-white">{workingHours.filter(wh => wh.type === 'Morning').length}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Evening Shifts</p>
                        <p className="text-3xl font-bold text-white">{workingHours.filter(wh => wh.type === 'Evening').length}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Night Shifts</p>
                        <p className="text-3xl font-bold text-white">{workingHours.filter(wh => wh.type === 'Night').length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{totalEmployees}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search working hours..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredHours.map((wh) => (
                        <div key={wh.id} className={`bg-gray-800 rounded-xl border p-6 hover:border-blue-500/50 transition-all ${getTypeColor(wh.type).split(' ')[2]}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(wh.type).split(' ').slice(0, 2).join(' ')}`}>
                                        {getTypeIcon(wh.type)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{wh.name}</h3>
                                        <p className="text-sm text-gray-400">{wh.description}</p>
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

                            <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-700/30 rounded-lg">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Start Time</p>
                                    <p className="text-lg font-bold text-white">{wh.startTime}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">End Time</p>
                                    <p className="text-lg font-bold text-white">{wh.endTime}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Break</p>
                                    <p className="text-lg font-bold text-white">{wh.breakDuration}m</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                                    <p className="text-lg font-bold text-white">{wh.totalHours}h</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Applied Days</p>
                                <div className="flex flex-wrap gap-1">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                        const fullDay = day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday';
                                        const isApplied = wh.appliedDays.includes(fullDay);
                                        return (
                                            <span
                                                key={day}
                                                className={`px-2 py-1 rounded text-xs font-medium ${isApplied ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}
                                            >
                                                {day}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-400">{wh.employeeCount} employees assigned</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${wh.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {wh.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
