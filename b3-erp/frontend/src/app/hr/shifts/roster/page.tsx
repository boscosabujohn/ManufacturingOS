'use client';

import { useState } from 'react';
import { CalendarDays, Download, ChevronLeft, ChevronRight, Users, Sun, Moon, Sunrise, Clock } from 'lucide-react';

interface Employee {
  id: string;
  code: string;
  name: string;
  department: string;
  shifts: { [key: string]: string };
}

export default function ShiftRosterPage() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const weekDates = [14, 15, 16, 17, 18, 19, 20];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const mockEmployees: Employee[] = [
    { id: '1', code: 'KMF2020001', name: 'Rajesh Kumar', department: 'Production',
      shifts: { '0': 'day', '1': 'day', '2': 'day', '3': 'day', '4': 'day', '5': 'day', '6': 'off' }},
    { id: '2', code: 'KMF2019002', name: 'Meera Nair', department: 'Quality',
      shifts: { '0': 'morning', '1': 'morning', '2': 'morning', '3': 'morning', '4': 'morning', '5': 'morning', '6': 'off' }},
    { id: '3', code: 'KMF2021003', name: 'Arun Patel', department: 'IT',
      shifts: { '0': 'flexible', '1': 'flexible', '2': 'flexible', '3': 'flexible', '4': 'flexible', '5': 'off', '6': 'off' }},
    { id: '4', code: 'KMF2022004', name: 'Vikram Singh', department: 'Production',
      shifts: { '0': 'night', '1': 'night', '2': 'night', '3': 'night', '4': 'night', '5': 'night', '6': 'off' }},
    { id: '5', code: 'KMF2020005', name: 'Priya Menon', department: 'Production',
      shifts: { '0': 'day', '1': 'day', '2': 'day', '3': 'day', '4': 'day', '5': 'off', '6': 'off' }},
    { id: '6', code: 'KMF2018006', name: 'Suresh Babu', department: 'Production',
      shifts: { '0': 'evening', '1': 'evening', '2': 'evening', '3': 'evening', '4': 'evening', '5': 'evening', '6': 'off' }},
    { id: '7', code: 'KMF2019007', name: 'Anjali Reddy', department: 'Quality',
      shifts: { '0': 'morning', '1': 'morning', '2': 'morning', '3': 'morning', '4': 'morning', '5': 'off', '6': 'off' }},
    { id: '8', code: 'KMF2021008', name: 'Kavita Desai', department: 'HR',
      shifts: { '0': 'day', '1': 'day', '2': 'day', '3': 'day', '4': 'day', '5': 'day', '6': 'off' }}
  ];

  const getShiftDisplay = (shiftType: string) => {
    const shifts = {
      day: { label: 'Day', color: 'bg-yellow-100 text-yellow-800', icon: <Sun className="w-3 h-3" /> },
      night: { label: 'Night', color: 'bg-indigo-100 text-indigo-800', icon: <Moon className="w-3 h-3" /> },
      morning: { label: 'Morning', color: 'bg-orange-100 text-orange-800', icon: <Sunrise className="w-3 h-3" /> },
      evening: { label: 'Evening', color: 'bg-purple-100 text-purple-800', icon: <Clock className="w-3 h-3" /> },
      flexible: { label: 'Flexible', color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" /> },
      off: { label: 'OFF', color: 'bg-gray-100 text-gray-800', icon: null }
    };
    return shifts[shiftType as keyof typeof shifts] || shifts.off;
  };

  const filteredEmployees = selectedDepartment === 'all'
    ? mockEmployees
    : mockEmployees.filter(emp => emp.department === selectedDepartment);

  const stats = {
    totalEmployees: filteredEmployees.length,
    dayShifts: filteredEmployees.filter(emp => Object.values(emp.shifts).includes('day')).length,
    nightShifts: filteredEmployees.filter(emp => Object.values(emp.shifts).includes('night')).length,
    offs: filteredEmployees.reduce((sum, emp) => sum + Object.values(emp.shifts).filter(s => s === 'off').length, 0)
  };

  return (
    <div className="p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-blue-600" />
          Shift Roster
        </h1>
        <p className="text-gray-600 mt-2">Plan and view weekly shift schedules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Employees</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalEmployees}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Day Shifts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.dayShifts}</p>
            </div>
            <Sun className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Night Shifts</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.nightShifts}</p>
            </div>
            <Moon className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Offs</p>
              <p className="text-2xl font-bold text-gray-700">{stats.offs}</p>
            </div>
            <CalendarDays className="h-10 w-10 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWeek(selectedWeek - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Week 42 - October 2025</h2>
            <button
              onClick={() => setSelectedWeek(selectedWeek + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Production">Production</option>
              <option value="Quality">Quality</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">Employee</th>
              {weekDays.map((day, i) => (
                <th key={i} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  <div>{day}</div>
                  <div className="text-lg font-bold text-gray-700 mt-1">{weekDates[i]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                      <div className="text-xs text-gray-500">{emp.code} • {emp.department}</div>
                    </div>
                  </div>
                </td>
                {weekDays.map((_, dayIndex) => {
                  const shift = getShiftDisplay(emp.shifts[dayIndex.toString()]);
                  return (
                    <td key={dayIndex} className="px-3 py-2 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${shift.color}`}>
                        {shift.icon}
                        {shift.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Shift Types</h3>
        <div className="flex flex-wrap gap-2">
          {['day', 'night', 'morning', 'evening', 'flexible', 'off'].map(type => {
            const shift = getShiftDisplay(type);
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg ${shift.color} flex items-center gap-1`}>
                  {shift.icon}
                  <span className="text-xs font-semibold">{shift.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
