'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    Camera,
    User,
    Calendar,
    ArrowLeft,
    FileText,
    Award,
    Sparkles,
} from 'lucide-react';

interface ClientHandover {
    id: string;
    woNumber: string;
    projectName: string;
    client: string;
    status: 'Preparing' | 'Client Review' | 'Final Approval' | 'Handover Complete' | 'Closed';
    handover: {
        workPhotosUploaded: boolean;
        clientDailyReviews: number;
        finalApproval: boolean;
        cleaningComplete: boolean;
        toolsReturned: boolean;
        handoverCeremonyDone: boolean;
        clientSigned: boolean;
        projectClosed: boolean;
    };
    completionDate?: string;
    signatureDate?: string;
    closureDate?: string;
}

const mockHandovers: ClientHandover[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        projectName: 'Hotel Paradise Kitchen',
        client: 'Hotel Paradise Ltd',
        status: 'Closed',
        handover: {
            workPhotosUploaded: true,
            clientDailyReviews: 5,
            finalApproval: true,
            cleaningComplete: true,
            toolsReturned: true,
            handoverCeremonyDone: true,
            clientSigned: true,
            projectClosed: true,
        },
        completionDate: '2025-01-30',
        signatureDate: '2025-01-30',
        closureDate: '2025-01-31',
    },
    {
        id: '2',
        woNumber: 'WO-2025-003',
        projectName: 'Springfield Academy Cafeteria',
        client: 'Springfield Academy',
        status: 'Client Review',
        handover: {
            workPhotosUploaded: true,
            clientDailyReviews: 3,
            finalApproval: false,
            cleaningComplete: true,
            toolsReturned: false,
            handoverCeremonyDone: false,
            clientSigned: false,
            projectClosed: false,
        },
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        projectName: 'Hospital Kitchen',
        client: 'City General Hospital',
        status: 'Final Approval',
        handover: {
            workPhotosUploaded: true,
            clientDailyReviews: 4,
            finalApproval: true,
            cleaningComplete: true,
            toolsReturned: true,
            handoverCeremonyDone: false,
            clientSigned: false,
            projectClosed: false,
        },
        completionDate: '2025-02-01',
    },
];

export default function ClientHandoverPage() {
    const [handovers] = useState<ClientHandover[]>(mockHandovers);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredHandovers = handovers.filter(
        (h) => filterStatus === 'all' || h.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Closed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Handover Complete':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Final Approval':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Client Review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Preparing':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: handovers.length,
        closed: handovers.filter((h) => h.status === 'Closed').length,
        pending: handovers.filter((h) => h.status !== 'Closed').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-3 py-2 space-y-3">
                {/* Header */}
                <div className="bg-white rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                        <Link href="/installation/progress" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Client Handover & Closure</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Photos, reviews, approval, signature & closure (Steps 8.13-8.20)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Projects</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Closed</p>
                                <p className="text-2xl font-bold text-green-900">{stats.closed}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                            </div>
                            <Award className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg border p-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Client Review">Client Review</option>
                        <option value="Final Approval">Final Approval</option>
                        <option value="Handover Complete">Handover Complete</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Handovers List */}
                <div className="grid gap-2">
                    {filteredHandovers.map((handover) => {
                        const handoverArray = Object.values(handover.handover).filter(v => typeof v === 'boolean');
                        const completedSteps = handoverArray.filter(Boolean).length;
                        const totalSteps = handoverArray.length;
                        const percentage = (completedSteps / totalSteps) * 100;

                        return (
                            <div key={handover.id} className="bg-white rounded-lg border p-3 hover:shadow-lg transition">
                                <div className="flex items-start gap-2">
                                    <div className={`w-16 h-16 rounded-lg ${handover.status === 'Closed' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}>
                                        {handover.status === 'Closed' ? (
                                            <Award className="w-8 h-8 text-white" />
                                        ) : (
                                            <FileText className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold">{handover.projectName}</h3>
                                                <p className="text-sm text-gray-600">{handover.woNumber} - {handover.client}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(handover.status)}`}>
                                                {handover.status}
                                            </span>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-semibold text-gray-700">
                                                    Handover Progress: {completedSteps}/{totalSteps} steps ({percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${handover.status === 'Closed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Handover Checklist */}
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Handover Checklist (8.13-8.20):</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.workPhotosUploaded ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.workPhotosUploaded ? <CheckCircle className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                                    <span>8.13 - Work Photos Uploaded</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                                    <User className="w-4 h-4" />
                                                    <span>8.14 - {handover.handover.clientDailyReviews} Client Reviews</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.finalApproval ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.finalApproval ? <CheckCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                                                    <span>8.15 - Final Approval</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.cleaningComplete ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.cleaningComplete ? <CheckCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                                    <span>8.16 - Cleaning Complete</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.toolsReturned ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.toolsReturned ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    <span>8.17 - Tools Returned</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.handoverCeremonyDone ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.handoverCeremonyDone ? <CheckCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                                                    <span>8.18 - Handover Ceremony</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.clientSigned ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.clientSigned ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    <span>8.19 - Client Signature</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.projectClosed ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.projectClosed ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    <span>8.20 - Project Closed</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            {handover.completionDate && (
                                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                                    <p className="text-xs text-blue-600">Completion</p>
                                                    <p className="font-medium text-blue-800 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {handover.completionDate}
                                                    </p>
                                                </div>
                                            )}
                                            {handover.signatureDate && (
                                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                                    <p className="text-xs text-green-600">Signature</p>
                                                    <p className="font-medium text-green-800 flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        {handover.signatureDate}
                                                    </p>
                                                </div>
                                            )}
                                            {handover.closureDate && (
                                                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                                    <p className="text-xs text-purple-600">Closure</p>
                                                    <p className="font-medium text-purple-800 flex items-center gap-1">
                                                        <Award className="w-3 h-3" />
                                                        {handover.closureDate}
                                                    </p>
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
