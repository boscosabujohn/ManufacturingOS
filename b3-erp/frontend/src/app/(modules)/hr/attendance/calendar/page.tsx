'use client';

import React, { useState } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Filter,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Sun
} from 'lucide-react';

interface DayAttendance {
    date: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    isWeekend: boolean;
    isHoliday: boolean;
    holidayName?: string;
}

export default function AttendanceCalendarPage() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const departments = ['Human Resources', 'Production', 'Quality Assurance', 'Finance', 'IT', 'Sales'];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarData = (): DayAttendance[] => {
        const daysInMonth = getDaysInMonth(selectedMonth);
        const data: DayAttendance[] = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            data.push({
                date: i,
                present: isWeekend ? 0 : Math.floor(Math.random() * 20) + 130,
                absent: isWeekend ? 0 : Math.floor(Math.random() * 10) + 5,
                late: isWeekend ? 0 : Math.floor(Math.random() * 8) + 2,
                onLeave: isWeekend ? 0 : Math.floor(Math.random() * 5) + 3,
                isWeekend,
                isHoliday: i === 26,
                holidayName: i === 26 ? 'Republic Day' : undefined
            });
        }

        return data;
    };

    const calendarData = generateCalendarData();
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const daysInMonth = getDaysInMonth(selectedMonth);

    const navigateMonth = (direction: number) => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + direction, 1));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const totalStats = {
        avgPresent: Math.round(calendarData.filter(d => !d.isWeekend).reduce((sum, d) => sum + d.present, 0) / calendarData.filter(d => !d.isWeekend).length),
        avgAbsent: Math.round(calendarData.filter(d => !d.isWeekend).reduce((sum, d) => sum + d.absent, 0) / calendarData.filter(d => !d.isWeekend).length),
        workingDays: calendarData.filter(d => !d.isWeekend && !d.isHoliday).length,
        holidays: calendarData.filter(d => d.isHoliday).length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-blue-500" />
                            Attendance Calendar
                        </h1>
                        <p className="text-gray-400 mt-1">Visual overview of attendance patterns</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white font-medium px-4">
                            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                        </span>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Avg. Present/Day</p>
                        <p className="text-3xl font-bold text-white">{totalStats.avgPresent}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm">Avg. Absent/Day</p>
                        <p className="text-3xl font-bold text-white">{totalStats.avgAbsent}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Working Days</p>
                        <p className="text-3xl font-bold text-white">{totalStats.workingDays}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Holidays</p>
                        <p className="text-3xl font-bold text-white">{totalStats.holidays}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <div className="ml-auto flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-400">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-400">Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-gray-400">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                            <span className="text-gray-400">Weekend/Holiday</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className={`text-center font-medium py-2 ${day === 'Sun' || day === 'Sat' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}

                        {calendarData.map((day) => (
                            <div
                                key={day.date}
                                className={`aspect-square rounded-lg p-2 border transition-all cursor-pointer hover:scale-105 ${
                                    day.isHoliday
                                        ? 'bg-purple-500/20 border-purple-500/30'
                                        : day.isWeekend
                                            ? 'bg-gray-700/30 border-gray-700'
                                            : 'bg-gray-800 border-gray-700 hover:border-blue-500/50'
                                }`}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium ${day.isWeekend || day.isHoliday ? 'text-gray-500' : 'text-white'}`}>
                                            {day.date}
                                        </span>
                                        {day.isHoliday && <Sun className="w-3 h-3 text-purple-400" />}
                                    </div>
                                    {!day.isWeekend && !day.isHoliday && (
                                        <div className="mt-auto space-y-0.5 text-xs">
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                                <span className="text-green-400">{day.present}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <XCircle className="w-3 h-3 text-red-400" />
                                                <span className="text-red-400">{day.absent}</span>
                                            </div>
                                        </div>
                                    )}
                                    {day.isHoliday && (
                                        <p className="text-xs text-purple-400 mt-auto truncate">{day.holidayName}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
