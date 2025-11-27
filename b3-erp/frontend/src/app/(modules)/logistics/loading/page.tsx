'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Package,
    CheckCircle,
    User,
    Calendar,
    ArrowLeft,
    FileText,
    Truck,
    Camera,
} from 'lucide-react';

interface LoadingJob {
    id: string;
    woNumber: string;
    productName: string;
    quantity: number;
    packingComplete: boolean;
    status: 'Pending' | 'Loading' | 'Loaded' | 'Dispatched';
    loadingSupervisor: string;
    loadingDate?: string;
    dispatchBillNumber?: string;
    checklist: {
        id: string;
        item: string;
        checked: boolean;
    }[];
}

const mockLoadingJobs: LoadingJob[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        productName: 'SS304 Kitchen Sink Panel',
        quantity: 24,
        packingComplete: true,
        status: 'Dispatched',
        loadingSupervisor: 'Suresh Kumar',
        loadingDate: '2025-01-24',
        dispatchBillNumber: 'DB-2025-001',
        checklist: [
            { id: '1', item: 'All items packed and labeled', checked: true },
            { id: '2', item: 'Dispatch bill generated', checked: true },
            { id: '3', item: 'Crates properly sealed', checked: true },
            { id: '4', item: 'Fragile items marked', checked: true },
            { id: '5', item: 'Load secured in vehicle', checked: true },
            { id: '6', item: 'Photos taken', checked: true },
            { id: '7', item: 'Supervisor signature', checked: true },
        ],
    },
    {
        id: '2',
        woNumber: 'WO-2025-004',
        productName: 'Drawer Slide Assembly',
        quantity: 30,
        packingComplete: true,
        status: 'Loading',
        loadingSupervisor: 'Meena Nair',
        loadingDate: '2025-01-25',
        checklist: [
            { id: '1', item: 'All items packed and labeled', checked: true },
            { id: '2', item: 'Dispatch bill generated', checked: true },
            { id: '3', item: 'Crates properly sealed', checked: true },
            { id: '4', item: 'Fragile items marked', checked: false },
            { id: '5', item: 'Load secured in vehicle', checked: false },
            { id: '6', item: 'Photos taken', checked: false },
            { id: '7', item: 'Supervisor signature', checked: false },
        ],
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        productName: 'Countertop Support Bracket',
        quantity: 40,
        packingComplete: true,
        status: 'Pending',
        loadingSupervisor: 'Kiran Verma',
        checklist: [
            { id: '1', item: 'All items packed and labeled', checked: false },
            { id: '2', item: 'Dispatch bill generated', checked: false },
            { id: '3', item: 'Crates properly sealed', checked: false },
            { id: '4', item: 'Fragile items marked', checked: false },
            { id: '5', item: 'Load secured in vehicle', checked: false },
            { id: '6', item: 'Photos taken', checked: false },
            { id: '7', item: 'Supervisor signature', checked: false },
        ],
    },
];

export default function LoadingDispatchPage() {
    const [jobs] = useState<LoadingJob[]>(mockLoadingJobs);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredJobs = jobs.filter((job) => filterStatus === 'all' || job.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Dispatched':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Loaded':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Loading':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: jobs.length,
        dispatched: jobs.filter((j) => j.status === 'Dispatched').length,
        loading: jobs.filter((j) => j.status === 'Loading' || j.status === 'Loaded').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                        <Link href="/logistics/delivery-coordination" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Loading & Dispatch</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Loading checklist and dispatch bill generation (Steps 7.10, 7.11)
                            </p>
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
                                <p className="text-sm text-blue-600">Loading</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.loading}</p>
                            </div>
                            <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">Dispatched</p>
                                <p className="text-2xl font-bold text-purple-900">{stats.dispatched}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-purple-600" />
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
                        <option value="Pending">Pending</option>
                        <option value="Loading">Loading</option>
                        <option value="Loaded">Loaded</option>
                        <option value="Dispatched">Dispatched</option>
                    </select>
                </div>

                {/* Jobs List */}
                <div className="grid gap-4">
                    {filteredJobs.map((job) => {
                        const checkedCount = job.checklist.filter((c) => c.checked).length;
                        const totalChecks = job.checklist.length;
                        const progress = (checkedCount / totalChecks) * 100;

                        return (
                            <div key={job.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition">
                                <div className="flex items-start gap-4">
                                    <div className={`w-16 h-16 rounded-lg ${job.status === 'Dispatched' ? 'bg-purple-500' : 'bg-blue-500'} flex items-center justify-center`}>
                                        <Truck className="w-8 h-8 text-white" />
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

                                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Supervisor</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {job.loadingSupervisor}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Loading Date</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {job.loadingDate || 'Pending'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Dispatch Bill</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {job.dispatchBillNumber || 'Not generated'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-semibold text-gray-700">
                                                    Loading Checklist: {checkedCount}/{totalChecks} items ({progress.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${job.status === 'Dispatched' ? 'bg-purple-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Checklist */}
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Loading Checklist:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {job.checklist.map((check) => (
                                                    <div key={check.id} className="flex items-center gap-2 text-xs">
                                                        {check.checked ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                                        )}
                                                        <span className={check.checked ? 'text-green-800' : 'text-gray-600'}>
                                                            {check.item}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
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
