'use client';

import React, { useState } from 'react';
import {
    Users,
    Upload,
    Download,
    Search,
    Filter,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Save
} from 'lucide-react';

interface BulkPunchEntry {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    date: string;
    punchIn: string;
    punchOut: string;
    selected: boolean;
}

export default function BulkPunchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectAll, setSelectAll] = useState(false);

    const [entries, setEntries] = useState<BulkPunchEntry[]>([
        { id: '1', employeeId: 'EMP001', employeeName: 'Sarah Johnson', department: 'Human Resources', date: '2025-01-31', punchIn: '09:00', punchOut: '18:00', selected: false },
        { id: '2', employeeId: 'EMP002', employeeName: 'Michael Chen', department: 'Production', date: '2025-01-31', punchIn: '06:00', punchOut: '14:00', selected: false },
        { id: '3', employeeId: 'EMP003', employeeName: 'Emily Davis', department: 'Quality Assurance', date: '2025-01-31', punchIn: '09:00', punchOut: '18:00', selected: false },
        { id: '4', employeeId: 'EMP004', employeeName: 'David Wilson', department: 'Production', date: '2025-01-31', punchIn: '06:00', punchOut: '14:00', selected: false },
        { id: '5', employeeId: 'EMP005', employeeName: 'Jennifer Brown', department: 'Finance', date: '2025-01-31', punchIn: '09:00', punchOut: '18:00', selected: false },
        { id: '6', employeeId: 'EMP006', employeeName: 'Robert Martinez', department: 'IT', date: '2025-01-31', punchIn: '09:00', punchOut: '18:00', selected: false },
        { id: '7', employeeId: 'EMP007', employeeName: 'Lisa Wong', department: 'Production', date: '2025-01-31', punchIn: '14:00', punchOut: '22:00', selected: false },
        { id: '8', employeeId: 'EMP008', employeeName: 'James Taylor', department: 'Warehouse', date: '2025-01-31', punchIn: '22:00', punchOut: '06:00', selected: false }
    ]);

    const departments = Array.from(new Set(entries.map(e => e.department)));

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || entry.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setEntries(entries.map(e => ({ ...e, selected: newSelectAll })));
    };

    const handleSelectEntry = (id: string) => {
        setEntries(entries.map(e =>
            e.id === id ? { ...e, selected: !e.selected } : e
        ));
    };

    const handleTimeChange = (id: string, field: 'punchIn' | 'punchOut', value: string) => {
        setEntries(entries.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        ));
    };

    const selectedCount = entries.filter(e => e.selected).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-500" />
                            Bulk Punch Entry
                        </h1>
                        <p className="text-gray-400 mt-1">Update attendance for multiple employees at once</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Template
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Upload className="w-4 h-4" />
                            Import CSV
                        </button>
                        <button
                            disabled={selectedCount === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Selected ({selectedCount})
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Employees</p>
                        <p className="text-3xl font-bold text-white">{entries.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Selected</p>
                        <p className="text-3xl font-bold text-white">{selectedCount}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Departments</p>
                        <p className="text-3xl font-bold text-white">{departments.length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-orange-400" />
                        <div>
                            <p className="text-orange-400 text-sm">Date</p>
                            <p className="text-lg font-bold text-white">{new Date(selectedDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search employees..."
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
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                            Set All to 9:00 - 18:00
                        </button>
                        <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                            Set All to 6:00 - 14:00
                        </button>
                        <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                            Set All to 14:00 - 22:00
                        </button>
                        <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                            Clear Selected Times
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Department</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Punch In</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Punch Out</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((entry) => {
                                const punchInDate = new Date(`2025-01-31T${entry.punchIn}`);
                                const punchOutDate = new Date(`2025-01-31T${entry.punchOut}`);
                                const duration = (punchOutDate.getTime() - punchInDate.getTime()) / (1000 * 60 * 60);
                                const hours = Math.floor(Math.abs(duration));
                                const minutes = Math.round((Math.abs(duration) - hours) * 60);

                                return (
                                    <tr key={entry.id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 ${entry.selected ? 'bg-blue-500/10' : ''}`}>
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={entry.selected}
                                                onChange={() => handleSelectEntry(entry.id)}
                                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {entry.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{entry.employeeName}</p>
                                                    <p className="text-xs text-gray-400">{entry.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{entry.department}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <input
                                                    type="time"
                                                    value={entry.punchIn}
                                                    onChange={(e) => handleTimeChange(entry.id, 'punchIn', e.target.value)}
                                                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <input
                                                    type="time"
                                                    value={entry.punchOut}
                                                    onChange={(e) => handleTimeChange(entry.id, 'punchOut', e.target.value)}
                                                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`font-medium ${duration < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                {hours}h {minutes}m
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
