'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Scissors,
    Tag,
    Wrench,
    Flame,
    Sparkles,
    Package,
    User,
    Clock,
    CheckCircle,
    AlertTriangle,
    Play,
    Pause,
    ArrowLeft,
    TrendingUp,
} from 'lucide-react';

interface Operation {
    id: string;
    woNumber: string;
    productName: string;
    operationType: 'Laser Cutting' | 'Logo Etching' | 'Bending' | 'Fabrication' | 'Welding' | 'Finishing';
    operator: string;
    machine: string;
    status: 'Queued' | 'In Progress' | 'Completed' | 'On Hold';
    startTime?: string;
    endTime?: string;
    targetQuantity: number;
    completedQuantity: number;
    notes?: string;
}

const mockOperations: Operation[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        productName: 'SS304 Kitchen Sink Panel',
        operationType: 'Laser Cutting',
        operator: 'Rajesh Kumar',
        machine: 'Laser-01',
        status: 'Completed',
        startTime: '08:00 AM',
        endTime: '10:30 AM',
        targetQuantity: 24,
        completedQuantity: 24,
        notes: 'Nested cutting completed. Ready for etching.',
    },
    {
        id: '2',
        woNumber: 'WO-2025-001',
        productName: 'SS304 Kitchen Sink Panel',
        operationType: 'Logo Etching',
        operator: 'Priya Sharma',
        machine: 'Laser-01',
        status: 'In Progress',
        startTime: '10:45 AM',
        targetQuantity: 24,
        completedQuantity: 18,
        notes: 'Company logo etching before bending. 18/24 complete.',
    },
    {
        id: '3',
        woNumber: 'WO-2025-002',
        productName: 'Faucet Mounting Bracket',
        operationType: 'Bending',
        operator: 'Suresh Reddy',
        machine: 'Bending-02',
        status: 'Queued',
        targetQuantity: 50,
        completedQuantity: 0,
        notes: 'Waiting for logo etching completion',
    },
    {
        id: '4',
        woNumber: 'WO-2025-003',
        productName: 'Cabinet Frame Assembly',
        operationType: 'Welding',
        operator: 'Amit Patel',
        machine: 'Weld-Station-03',
        status: 'In Progress',
        startTime: '09:00 AM',
        targetQuantity: 12,
        completedQuantity: 8,
        notes: 'TIG welding in progress. 8/12 frames welded.',
    },
    {
        id: '5',
        woNumber: 'WO-2025-004',
        productName: 'Drawer Slide Assembly',
        operationType: 'Fabrication',
        operator: 'Kiran Verma',
        machine: 'Fab-Cell-01',
        status: 'In Progress',
        startTime: '07:30 AM',
        targetQuantity: 30,
        completedQuantity: 22,
        notes: 'Assembly in progress. On track for completion.',
    },
    {
        id: '6',
        woNumber: 'WO-2025-005',
        productName: 'Countertop Support Bracket',
        operationType: 'Finishing',
        operator: 'Meena Nair',
        machine: 'Buffing-Station-02',
        status: 'Completed',
        startTime: '06:00 AM',
        endTime: '11:00 AM',
        targetQuantity: 40,
        completedQuantity: 40,
        notes: 'Buffing and polishing completed. Mirror finish achieved.',
    },
];

export default function ProductionOperationsPage() {
    const [operations] = useState<Operation[]>(mockOperations);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredOps = operations.filter((op) => {
        const matchesType = filterType === 'all' || op.operationType === filterType;
        const matchesStatus = filterStatus === 'all' || op.status === filterStatus;
        return matchesType && matchesStatus;
    });

    const getOperationIcon = (type: string) => {
        switch (type) {
            case 'Laser Cutting':
                return Scissors;
            case 'Logo Etching':
                return Tag;
            case 'Bending':
                return Wrench;
            case 'Fabrication':
                return Package;
            case 'Welding':
                return Flame;
            case 'Finishing':
                return Sparkles;
            default:
                return Package;
        }
    };

    const getOperationColor = (type: string) => {
        switch (type) {
            case 'Laser Cutting':
                return 'from-blue-500 to-cyan-600';
            case 'Logo Etching':
                return 'from-purple-500 to-pink-600';
            case 'Bending':
                return 'from-orange-500 to-red-600';
            case 'Fabrication':
                return 'from-green-500 to-emerald-600';
            case 'Welding':
                return 'from-red-500 to-orange-600';
            case 'Finishing':
                return 'from-yellow-500 to-amber-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Queued':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'On Hold':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed':
                return CheckCircle;
            case 'In Progress':
                return Play;
            case 'Queued':
                return Clock;
            case 'On Hold':
                return Pause;
            default:
                return AlertTriangle;
        }
    };

    const stats = {
        totalOperations: operations.length,
        inProgress: operations.filter((op) => op.status === 'In Progress').length,
        completed: operations.filter((op) => op.status === 'Completed').length,
        queued: operations.filter((op) => op.status === 'Queued').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/production/work-orders"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Production Operations Tracking</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Track all manufacturing operations: Cutting, Etching, Bending, Welding, Finishing
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Operations</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOperations}</p>
                            </div>
                            <Package className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600">In Progress</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                            </div>
                            <Play className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Completed</p>
                                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Queued</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.queued}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex gap-4">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Operations</option>
                            <option value="Laser Cutting">🔹 Laser Cutting</option>
                            <option value="Logo Etching">💜 Logo Etching</option>
                            <option value="Bending">🔧 Bending</option>
                            <option value="Fabrication">📦 Fabrication</option>
                            <option value="Welding">🔥 Welding</option>
                            <option value="Finishing">✨ Finishing</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Queued">Queued</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>
                </div>

                {/* Operations List */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredOps.map((op) => {
                        const Icon = getOperationIcon(op.operationType);
                        const StatusIcon = getStatusIcon(op.status);
                        const progress = (op.completedQuantity / op.targetQuantity) * 100;

                        return (
                            <div key={op.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getOperationColor(op.operationType)} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{op.operationType}</h3>
                                                <p className="text-sm text-gray-600">{op.woNumber} - {op.productName}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 border ${getStatusColor(op.status)}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {op.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Operator</p>
                                                <p className="font-medium text-gray-900 flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {op.operator}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Machine</p>
                                                <p className="font-medium text-gray-900">{op.machine}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Time</p>
                                                <p className="font-medium text-gray-900">
                                                    {op.startTime && <span>{op.startTime}</span>}
                                                    {op.endTime && <span> - {op.endTime}</span>}
                                                    {!op.startTime && <span className="text-gray-500">Pending</span>}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Progress</p>
                                                <p className="font-medium text-gray-900">
                                                    {op.completedQuantity} / {op.targetQuantity} ({progress.toFixed(0)}%)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                            <div
                                                className={`h-2.5 rounded-full bg-gradient-to-r ${getOperationColor(op.operationType)}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>

                                        {/* Notes */}
                                        {op.notes && (
                                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-800">
                                                <strong>Note:</strong> {op.notes}
                                            </div>
                                        )}

                                        {/* Critical Alert for Etching */}
                                        {op.operationType === 'Logo Etching' && (
                                            <div className="bg-purple-50 border border-purple-300 rounded p-2 text-sm text-purple-900 mt-2 flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span><strong>CRITICAL:</strong> Logo etching MUST be completed before bending operations!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">Production Operations Workflow</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Phase 5 Operations: Laser Cutting (5.5) → Logo Etching (5.6) → Bending (5.7) → Fabrication (5.8) → Welding (5.9) → Buffing/Finishing (5.10).
                                Each operation is tracked with machine logs and operator assignments for complete traceability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
