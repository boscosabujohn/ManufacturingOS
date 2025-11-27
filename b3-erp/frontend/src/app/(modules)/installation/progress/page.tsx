'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    Clock,
    User,
    Calendar,
    ArrowLeft,
    Camera,
    AlertCircle,
} from 'lucide-react';

interface InstallationProgress {
    id: string;
    woNumber: string;
    projectName: string;
    installationTeam: string;
    startDate: string;
    status: 'In Progress' | 'Review Pending' | 'Approved' | 'Complete';
    progress: {
        cabinetAlignment: boolean;
        trialCompleted: boolean;
        buffingDone: boolean;
        accessoriesFixed: boolean;
        doorsAligned: boolean;
    };
    dailyReviews: number;
    photosUploaded: number;
    issues: number;
}

const mockProgress: InstallationProgress[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        projectName: 'Hotel Paradise Kitchen',
        installationTeam: 'Team A (Ramesh Kumar)',
        startDate: '2025-01-26',
        status: 'Complete',
        progress: {
            cabinetAlignment: true,
            trialCompleted: true,
            buffingDone: true,
            accessoriesFixed: true,
            doorsAligned: true,
        },
        dailyReviews: 5,
        photosUploaded: 24,
        issues: 0,
    },
    {
        id: '2',
        woNumber: 'WO-2025-003',
        projectName: 'Springfield Academy Cafeteria',
        installationTeam: 'Team B (Priya Sharma)',
        startDate: '2025-01-27',
        status: 'In Progress',
        progress: {
            cabinetAlignment: true,
            trialCompleted: true,
            buffingDone: false,
            accessoriesFixed: false,
            doorsAligned: false,
        },
        dailyReviews: 2,
        photosUploaded: 8,
        issues: 1,
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        projectName: 'Hospital Kitchen',
        installationTeam: 'Team C (Amit Verma)',
        startDate: '2025-01-28',
        status: 'Review Pending',
        progress: {
            cabinetAlignment: true,
            trialCompleted: true,
            buffingDone: true,
            accessoriesFixed: true,
            doorsAligned: true,
        },
        dailyReviews: 4,
        photosUploaded: 18,
        issues: 2,
    },
];

const INSTALLATION_CHECKLIST = [
    { id: '8.8', item: 'Cabinet Alignment (Horizontal & Vertical)', step: '8.8' },
    { id: '8.9', item: 'Trial Wall Installation Complete', step: '8.9' },
    { id: '8.10', item: 'Site Buffing & Polishing Done', step: '8.10' },
    { id: '8.11', item: 'Accessories & Doors Fixed', step: '8.11' },
    { id: '8.12', item: 'Final Door Alignment Verified', step: '8.12' },
];

export default function InstallationProgressPage() {
    const [progress] = useState<InstallationProgress[]>(mockProgress);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredProgress = progress.filter(
        (p) => filterStatus === 'all' || p.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Complete':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Approved':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Review Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'In Progress':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: progress.length,
        complete: progress.filter((p) => p.status === 'Complete').length,
        inProgress: progress.filter((p) => p.status === 'In Progress').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                        <Link href="/installation/management" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Installation Progress Tracker</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Cabinet alignment, daily reviews & checklists (Steps 8.8-8.12)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Installations</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <User className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">In Progress</p>
                                <p className="text-2xl font-bold text-purple-900">{stats.inProgress}</p>
                            </div>
                            <Clock className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Complete</p>
                                <p className="text-2xl font-bold text-green-900">{stats.complete}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
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
                        <option value="In Progress">In Progress</option>
                        <option value="Review Pending">Review Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>

                {/* Progress List */}
                <div className="grid gap-4">
                    {filteredProgress.map((prog) => {
                        const progressArray = Object.values(prog.progress);
                        const completedSteps = progressArray.filter(Boolean).length;
                        const totalSteps = progressArray.length;
                        const percentage = (completedSteps / totalSteps) * 100;

                        return (
                            <div key={prog.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition">
                                <div className="flex items-start gap-4">
                                    <div className={`w-16 h-16 rounded-lg ${prog.status === 'Complete' ? 'bg-green-500' : 'bg-purple-500'} flex items-center justify-center`}>
                                        {prog.status === 'Complete' ? (
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        ) : (
                                            <Clock className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold">{prog.projectName}</h3>
                                                <p className="text-sm text-gray-600">{prog.woNumber}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(prog.status)}`}>
                                                {prog.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Installation Team</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {prog.installationTeam}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Start Date</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {prog.startDate}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Daily Reviews</p>
                                                <p className="font-medium">{prog.dailyReviews} completed (8.10)</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-semibold text-gray-700">
                                                    Installation Progress: {completedSteps}/{totalSteps} steps ({percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${prog.status === 'Complete' ? 'bg-green-500' : 'bg-purple-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Installation Checklist */}
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Installation Checklist (8.8-8.12):</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className={`flex items-center gap-2 text-xs ${prog.progress.cabinetAlignment ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {prog.progress.cabinetAlignment ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    <span>8.8 - Cabinet Alignment (Horizontal & Vertical)</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${prog.progress.trialCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {prog.progress.trialCompleted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    <span>8.9 - Trial Wall Installation Complete</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${prog.progress.buffingDone ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {prog.progress.buffingDone ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    <span>8.10 - Site Buffing & Polishing Done</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${prog.progress.accessoriesFixed ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {prog.progress.accessoriesFixed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    <span>8.11 - Accessories & Doors Fixed</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${prog.progress.doorsAligned ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {prog.progress.doorsAligned ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    <span>8.12 - Final Door Alignment Verified</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documentation & Issues */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-blue-600" />
                                                <span className="text-blue-800">{prog.photosUploaded} Photos (8.13)</span>
                                            </div>
                                            {prog.issues > 0 && (
                                                <div className="bg-red-50 border border-red-200 rounded p-2 text-sm flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                                    <span className="text-red-800">{prog.issues} Issues Logged</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
