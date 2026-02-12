'use client';

import React, { useState } from 'react';
import {
    Play,
    Search,
    Filter,
    Download,
    CheckCircle,
    Clock,
    RefreshCw,
    AlertCircle,
    Calendar,
    Users,
    DollarSign,
    FileText
} from 'lucide-react';

interface BonusProcessingBatch {
    id: string;
    batchName: string;
    bonusType: 'Annual Bonus' | 'Performance Bonus' | 'Festival Bonus' | 'Incentive Payout';
    period: string;
    employees: number;
    processedEmployees: number;
    totalAmount: number;
    processedAmount: number;
    status: 'Draft' | 'Processing' | 'Completed' | 'Failed' | 'Pending Approval';
    initiatedBy: string;
    initiatedAt: string;
    completedAt: string | null;
    errors: number;
}

export default function BonusProcessingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isProcessing, setIsProcessing] = useState(false);

    const batches: BonusProcessingBatch[] = [
        {
            id: '1',
            batchName: 'Annual Bonus FY24-25',
            bonusType: 'Annual Bonus',
            period: 'FY 2024-25',
            employees: 125,
            processedEmployees: 125,
            totalAmount: 8500000,
            processedAmount: 8500000,
            status: 'Pending Approval',
            initiatedBy: 'Sarah Johnson',
            initiatedAt: '2025-02-01T10:00:00',
            completedAt: '2025-02-01T10:45:00',
            errors: 0
        },
        {
            id: '2',
            batchName: 'Q4 Performance Bonus',
            bonusType: 'Performance Bonus',
            period: 'Q4 2024',
            employees: 85,
            processedEmployees: 85,
            totalAmount: 3200000,
            processedAmount: 3200000,
            status: 'Completed',
            initiatedBy: 'Sarah Johnson',
            initiatedAt: '2025-01-15T14:00:00',
            completedAt: '2025-01-15T14:30:00',
            errors: 0
        },
        {
            id: '3',
            batchName: 'Sales Incentive Jan 2025',
            bonusType: 'Incentive Payout',
            period: 'January 2025',
            employees: 15,
            processedEmployees: 12,
            totalAmount: 450000,
            processedAmount: 380000,
            status: 'Processing',
            initiatedBy: 'Jennifer Brown',
            initiatedAt: '2025-02-05T09:00:00',
            completedAt: null,
            errors: 0
        },
        {
            id: '4',
            batchName: 'Diwali Festival Bonus',
            bonusType: 'Festival Bonus',
            period: 'October 2024',
            employees: 128,
            processedEmployees: 128,
            totalAmount: 640000,
            processedAmount: 640000,
            status: 'Completed',
            initiatedBy: 'Sarah Johnson',
            initiatedAt: '2024-10-20T11:00:00',
            completedAt: '2024-10-20T11:20:00',
            errors: 0
        },
        {
            id: '5',
            batchName: 'Q3 Performance Bonus',
            bonusType: 'Performance Bonus',
            period: 'Q3 2024',
            employees: 82,
            processedEmployees: 80,
            totalAmount: 2800000,
            processedAmount: 2720000,
            status: 'Failed',
            initiatedBy: 'Sarah Johnson',
            initiatedAt: '2024-10-10T15:00:00',
            completedAt: '2024-10-10T15:25:00',
            errors: 2
        }
    ];

    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batch.batchName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (value: number) => {
        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(2)}Cr`;
        }
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`;
        }
        return `₹${value.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/20 text-green-400';
            case 'Processing': return 'bg-blue-500/20 text-blue-400';
            case 'Pending Approval': return 'bg-yellow-500/20 text-yellow-400';
            case 'Draft': return 'bg-gray-500/20 text-gray-400';
            case 'Failed': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-4 h-4" />;
            case 'Processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
            case 'Pending Approval': return <Clock className="w-4 h-4" />;
            case 'Failed': return <AlertCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Annual Bonus': return 'bg-yellow-500/20 text-yellow-400';
            case 'Performance Bonus': return 'bg-purple-500/20 text-purple-400';
            case 'Festival Bonus': return 'bg-orange-500/20 text-orange-400';
            case 'Incentive Payout': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const totalProcessed = batches.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.processedAmount, 0);
    const pendingApproval = batches.filter(b => b.status === 'Pending Approval').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Play className="w-8 h-8 text-blue-500" />
                            Bonus Processing
                        </h1>
                        <p className="text-gray-400 mt-1">Process and manage bonus disbursements</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsProcessing(true)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    New Batch
                                </>
                            )}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Batches</p>
                        <p className="text-3xl font-bold text-white">{batches.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Processed</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalProcessed)}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Pending Approval</p>
                        <p className="text-3xl font-bold text-white">{pendingApproval}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Employees Covered</p>
                        <p className="text-3xl font-bold text-white">{batches.reduce((sum, b) => sum + b.processedEmployees, 0)}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search batches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Draft">Draft</option>
                            <option value="Processing">Processing</option>
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredBatches.map((batch) => (
                        <div key={batch.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white">{batch.batchName}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(batch.bonusType)}`}>
                                            {batch.bonusType}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getStatusColor(batch.status)}`}>
                                            {getStatusIcon(batch.status)}
                                            {batch.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {batch.period}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {batch.processedEmployees}/{batch.employees} employees
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {formatCurrency(batch.processedAmount)} / {formatCurrency(batch.totalAmount)}
                                        </div>
                                    </div>

                                    {batch.status === 'Processing' && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Progress</span>
                                                <span className="text-blue-400">{Math.round((batch.processedEmployees / batch.employees) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(batch.processedEmployees / batch.employees) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {batch.errors > 0 && (
                                        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {batch.errors} errors found
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-xs text-gray-500">
                                        Initiated by {batch.initiatedBy} on {new Date(batch.initiatedAt).toLocaleString()}
                                    </p>
                                    {batch.completedAt && (
                                        <p className="text-xs text-gray-500">
                                            Completed at {new Date(batch.completedAt).toLocaleString()}
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                            <FileText className="w-4 h-4" /> Details
                                        </button>
                                        {batch.status === 'Pending Approval' && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm">
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                        )}
                                        {batch.status === 'Completed' && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm">
                                                <Download className="w-4 h-4" /> Report
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
