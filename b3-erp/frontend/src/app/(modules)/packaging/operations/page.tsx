'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Package,
    CheckCircle,
    Clock,
    User,
    Calendar,
    ArrowLeft,
    Tag,
    Box,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PackingJob {
    id: string;
    woNumber: string;
    productName: string;
    quantity: number;
    status: 'In Queue' | 'Packing' | 'Labeled' | 'Complete';
    packingTeam: string;
    startDate?: string;
    completionDate?: string;
    materialsUsed: {
        crates: number;
        wrapping: string;
        thermocol: number;
        stickers: number;
    };
}

const mockPackingJobs: PackingJob[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        productName: 'SS304 Kitchen Sink Panel',
        quantity: 24,
        status: 'Complete',
        packingTeam: 'Packing Team A',
        startDate: '2025-01-23',
        completionDate: '2025-01-23',
        materialsUsed: { crates: 2, wrapping: '50m', thermocol: 12, stickers: 24 },
    },
    {
        id: '2',
        woNumber: 'WO-2025-004',
        productName: 'Drawer Slide Assembly',
        quantity: 30,
        status: 'Labeled',
        packingTeam: 'Packing Team B',
        startDate: '2025-01-24',
        materialsUsed: { crates: 3, wrapping: '60m', thermocol: 15, stickers: 30 },
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        productName: 'Countertop Support Bracket',
        quantity: 40,
        status: 'Packing',
        packingTeam: 'Packing Team A',
        startDate: '2025-01-25',
        materialsUsed: { crates: 4, wrapping: '80m', thermocol: 20, stickers: 40 },
    },
];

export default function PackagingOperationsPage() {
    const { toast } = useToast();
    const [jobs] = useState<PackingJob[]>(mockPackingJobs);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredJobs = jobs.filter((job) => filterStatus === 'all' || job.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Complete':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Labeled':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Packing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'In Queue':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: jobs.length,
        complete: jobs.filter((j) => j.status === 'Complete').length,
        inProgress: jobs.filter((j) => j.status === 'Packing' || j.status === 'Labeled').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                        <Link href="/quality/approvals" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Packaging Operations</h1>
                            <p className="text-sm text-gray-600 mt-1">Pack products and apply branding (Steps 6.7, 6.8)</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Jobs</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Package className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">In Progress</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.inProgress}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
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
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
                        <option value="all">All Status</option>
                        <option value="In Queue">In Queue</option>
                        <option value="Packing">Packing</option>
                        <option value="Labeled">Labeled</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>

                {/* Jobs List */}
                <div className="grid gap-4">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition">
                            <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 rounded-lg ${job.status === 'Complete' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}>
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold">{job.productName}</h3>
                                            <p className="text-sm text-gray-600">{job.woNumber} - {job.quantity} units</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-500">Packing Team</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {job.packingTeam}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Start Date</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {job.startDate || 'Pending'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Completion</p>
                                            <p className="font-medium">{job.completionDate || <span className="text-gray-500">In progress</span>}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                        <p className="text-xs font-semibold text-blue-900 mb-2">Materials Used:</p>
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                            <div>
                                                <Box className="w-4 h-4 inline mr-1" />
                                                <span className="font-medium">{job.materialsUsed.crates} Crates</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">{job.materialsUsed.wrapping} Wrapping</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">{job.materialsUsed.thermocol} Thermocol</span>
                                            </div>
                                            <div>
                                                <Tag className="w-4 h-4 inline mr-1" />
                                                <span className="font-medium">{job.materialsUsed.stickers} Stickers</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex gap-3 border-t pt-4">
                                    <button
                                        onClick={() => {
                                            toast({
                                                title: "Job Details",
                                                description: `Viewing details for ${job.woNumber}`,
                                            });
                                        }}
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        View Details
                                    </button>
                                    {job.status === 'In Queue' && (
                                        <button
                                            onClick={() => {
                                                toast({
                                                    title: "Job Started",
                                                    description: `Packing started for ${job.productName}`,
                                                });
                                            }}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            Start Packing
                                        </button>
                                    )}
                                    {job.status === 'Packing' && (
                                        <button
                                            onClick={() => {
                                                toast({
                                                    title: "Job Completed",
                                                    description: `Packing completed for ${job.productName}`,
                                                });
                                            }}
                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
                                        >
                                            Complete Job
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
