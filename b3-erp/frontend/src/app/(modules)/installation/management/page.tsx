'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Wrench,
    Package,
    CheckCircle,
    Users,
    Calendar,
    ArrowLeft,
    Truck,
    Bell,
    Clock,
} from 'lucide-react';

interface InstallationManagement {
    id: string;
    woNumber: string;
    projectName: string;
    siteLocation: string;
    status: 'Planning' | 'Tools Ready' | 'Team Assigned' | 'Dispatched' | 'On Site';
    toolList: {
        prepared: boolean;
        packed: boolean;
        dispatched: boolean;
    };
    team: {
        assigned: boolean;
        teamLead: string;
        members: number;
        notified: boolean;
    };
    scheduledDate: string;
    toolsDispatchedDate?: string;
}

const mockInstallations: InstallationManagement[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        projectName: 'Hotel Paradise Kitchen',
        siteLocation: 'Mumbai',
        status: 'On Site',
        toolList: {
            prepared: true,
            packed: true,
            dispatched: true,
        },
        team: {
            assigned: true,
            teamLead: 'Ramesh Kumar',
            members: 4,
            notified: true,
        },
        scheduledDate: '2025-01-26',
        toolsDispatchedDate: '2025-01-25',
    },
    {
        id: '2',
        woNumber: 'WO-2025-003',
        projectName: 'Springfield Academy Cafeteria',
        siteLocation: 'Pune',
        status: 'Team Assigned',
        toolList: {
            prepared: true,
            packed: true,
            dispatched: false,
        },
        team: {
            assigned: true,
            teamLead: 'Priya Sharma',
            members: 3,
            notified: true,
        },
        scheduledDate: '2025-01-27',
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        projectName: 'Hospital Kitchen',
        siteLocation: 'Bangalore',
        status: 'Planning',
        toolList: {
            prepared: true,
            packed: false,
            dispatched: false,
        },
        team: {
            assigned: false,
            teamLead: '',
            members: 0,
            notified: false,
        },
        scheduledDate: '2025-01-28',
    },
];

const TOOL_LIST = [
    'Power Drills & Bits',
    'Screwdrivers Set',
    'Spirit Levels',
    'Measuring Tapes',
    'Laser Level',
    'Circular Saw',
    'Jigsaw',
    'Adhesives & Sealants',
    'Safety Equipment',
    'Clamps & Clips',
];

export default function InstallationManagementPage() {
    const [installations] = useState<InstallationManagement[]>(mockInstallations);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredInstallations = installations.filter(
        (inst) => filterStatus === 'all' || inst.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On Site':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Dispatched':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Team Assigned':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Tools Ready':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Planning':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: installations.length,
        onSite: installations.filter((i) => i.status === 'On Site').length,
        planning: installations.filter((i) => i.status === 'Planning' || i.status === 'Tools Ready').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                        <Link href="/logistics/loading" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Installation Management</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Tool preparation, team coordination & dispatch (Steps 8.1-8.7)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Projects</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Wrench className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">On Site</p>
                                <p className="text-2xl font-bold text-green-900">{stats.onSite}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Planning</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.planning}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg border p-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="Planning">Planning</option>
                        <option value="Tools Ready">Tools Ready</option>
                        <option value="Team Assigned">Team Assigned</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="On Site">On Site</option>
                    </select>
                </div>

                {/* Installations List */}
                <div className="grid gap-4">
                    {filteredInstallations.map((inst) => (
                        <div key={inst.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition">
                            <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 rounded-lg ${inst.status === 'On Site' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}>
                                    <Wrench className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{inst.projectName}</h3>
                                            <p className="text-sm text-gray-600">{inst.woNumber} - {inst.siteLocation}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(inst.status)}`}>
                                            {inst.status}
                                        </span>
                                    </div>

                                    {/* Tool List Progress */}
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="w-4 h-4 text-blue-600" />
                                            <p className="text-xs font-semibold text-blue-900">Tool List Management (8.1, 8.3, 8.6)</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className={`flex items-center gap-1 ${inst.toolList.prepared ? 'text-green-600' : 'text-gray-500'}`}>
                                                {inst.toolList.prepared ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                <span>List Prepared (8.1)</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${inst.toolList.packed ? 'text-green-600' : 'text-gray-500'}`}>
                                                {inst.toolList.packed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                <span>Tools Packed (8.3)</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${inst.toolList.dispatched ? 'text-green-600' : 'text-gray-500'}`}>
                                                {inst.toolList.dispatched ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                <span>Dispatched (8.6)</span>
                                            </div>
                                        </div>
                                        {inst.toolsDispatchedDate && (
                                            <p className="text-xs text-blue-700 mt-2">Dispatched on: {inst.toolsDispatchedDate}</p>
                                        )}
                                    </div>

                                    {/* Team Assignment */}
                                    <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4 text-purple-600" />
                                            <p className="text-xs font-semibold text-purple-900">Team Coordination (8.4, 8.5, 8.7)</p>
                                        </div>
                                        {inst.team.assigned ? (
                                            <div className="text-xs text-purple-800">
                                                <p className="font-medium">Team Lead: {inst.team.teamLead}</p>
                                                <p>Team Size: {inst.team.members} members</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {inst.team.notified ? (
                                                        <>
                                                            <Bell className="w-3 h-3 text-green-600" />
                                                            <span className="text-green-600">Team Notified (8.5)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3" />
                                                            <span>Notification Pending</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500">Team not yet assigned</p>
                                        )}
                                    </div>

                                    {/* Schedule */}
                                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs text-gray-500">Installation Date:</span>
                                            <span className="font-medium">{inst.scheduledDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tool List Reference */}
                <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-bold mb-3">Standard Tool List (8.1)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {TOOL_LIST.map((tool, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <Wrench className="w-4 h-4 text-blue-600" />
                                <span>{tool}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
