'use client';

import React, { useState } from 'react';
import {
    Fingerprint,
    Plus,
    Search,
    Settings,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Wifi,
    WifiOff,
    MapPin,
    Clock,
    Users,
    Download
} from 'lucide-react';

interface BiometricDevice {
    id: string;
    deviceId: string;
    name: string;
    location: string;
    type: 'Fingerprint' | 'Face Recognition' | 'Card Reader' | 'Combined';
    status: 'Online' | 'Offline' | 'Maintenance';
    lastSync: string;
    totalScans: number;
    todayScans: number;
    assignedEmployees: number;
    ipAddress: string;
}

export default function BiometricPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const devices: BiometricDevice[] = [
        {
            id: '1',
            deviceId: 'BIO-001',
            name: 'Main Entrance Scanner',
            location: 'Main Building Entrance',
            type: 'Combined',
            status: 'Online',
            lastSync: '2025-01-31 14:30:00',
            totalScans: 45678,
            todayScans: 234,
            assignedEmployees: 156,
            ipAddress: '192.168.1.101'
        },
        {
            id: '2',
            deviceId: 'BIO-002',
            name: 'Production Floor Scanner',
            location: 'Production Area Entry',
            type: 'Fingerprint',
            status: 'Online',
            lastSync: '2025-01-31 14:28:00',
            totalScans: 32456,
            todayScans: 178,
            assignedEmployees: 65,
            ipAddress: '192.168.1.102'
        },
        {
            id: '3',
            deviceId: 'BIO-003',
            name: 'Admin Block Scanner',
            location: 'Administrative Building',
            type: 'Face Recognition',
            status: 'Online',
            lastSync: '2025-01-31 14:29:00',
            totalScans: 28934,
            todayScans: 145,
            assignedEmployees: 45,
            ipAddress: '192.168.1.103'
        },
        {
            id: '4',
            deviceId: 'BIO-004',
            name: 'Warehouse Scanner',
            location: 'Warehouse Entry',
            type: 'Fingerprint',
            status: 'Maintenance',
            lastSync: '2025-01-30 18:00:00',
            totalScans: 15678,
            todayScans: 0,
            assignedEmployees: 28,
            ipAddress: '192.168.1.104'
        },
        {
            id: '5',
            deviceId: 'BIO-005',
            name: 'Server Room Access',
            location: 'IT Server Room',
            type: 'Combined',
            status: 'Online',
            lastSync: '2025-01-31 14:25:00',
            totalScans: 5432,
            todayScans: 23,
            assignedEmployees: 8,
            ipAddress: '192.168.1.105'
        },
        {
            id: '6',
            deviceId: 'BIO-006',
            name: 'Parking Lot Scanner',
            location: 'Parking Area',
            type: 'Card Reader',
            status: 'Offline',
            lastSync: '2025-01-31 10:15:00',
            totalScans: 12345,
            todayScans: 45,
            assignedEmployees: 120,
            ipAddress: '192.168.1.106'
        }
    ];

    const filteredDevices = devices.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Online': return 'bg-green-500/20 text-green-400';
            case 'Offline': return 'bg-red-500/20 text-red-400';
            case 'Maintenance': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Online': return <Wifi className="w-4 h-4 text-green-400" />;
            case 'Offline': return <WifiOff className="w-4 h-4 text-red-400" />;
            case 'Maintenance': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            default: return <Wifi className="w-4 h-4 text-gray-400" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Fingerprint': return <Fingerprint className="w-5 h-5" />;
            case 'Face Recognition': return <Users className="w-5 h-5" />;
            default: return <Fingerprint className="w-5 h-5" />;
        }
    };

    const stats = {
        online: devices.filter(d => d.status === 'Online').length,
        offline: devices.filter(d => d.status === 'Offline').length,
        maintenance: devices.filter(d => d.status === 'Maintenance').length,
        totalScans: devices.reduce((sum, d) => sum + d.todayScans, 0)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Fingerprint className="w-8 h-8 text-blue-500" />
                            Biometric Devices
                        </h1>
                        <p className="text-gray-400 mt-1">Manage biometric attendance devices</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <RefreshCw className="w-4 h-4" />
                            Sync All
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Device
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Devices</p>
                        <p className="text-3xl font-bold text-white">{devices.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Wifi className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-green-400 text-sm">Online</p>
                            <p className="text-2xl font-bold text-white">{stats.online}</p>
                        </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                        <WifiOff className="w-8 h-8 text-red-400" />
                        <div>
                            <p className="text-red-400 text-sm">Offline</p>
                            <p className="text-2xl font-bold text-white">{stats.offline}</p>
                        </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Scans Today</p>
                        <p className="text-3xl font-bold text-white">{stats.totalScans}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredDevices.map((device) => (
                        <div key={device.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                        {getTypeIcon(device.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(device.status)}`}>
                                                {getStatusIcon(device.status)}
                                                {device.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-mono">{device.deviceId}</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-300">{device.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-300">{device.type}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-700/30 rounded-lg">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Today</p>
                                    <p className="text-lg font-bold text-white">{device.todayScans}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="text-lg font-bold text-white">{device.totalScans.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Employees</p>
                                    <p className="text-lg font-bold text-white">{device.assignedEmployees}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">IP</p>
                                    <p className="text-xs font-mono text-gray-300">{device.ipAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    Last sync: {new Date(device.lastSync).toLocaleString()}
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                        <RefreshCw className="w-4 h-4" /> Sync
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                                        <Download className="w-4 h-4" /> Logs
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
