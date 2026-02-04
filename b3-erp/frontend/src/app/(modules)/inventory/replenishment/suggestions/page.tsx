'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Search,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    TrendingDown,
    Calendar,
    Plus,
    ShoppingCart,
    Filter,
    Download
} from 'lucide-react';

interface ReplenishmentSuggestion {
    id: string;
    itemCode: string;
    itemName: string;
    currentStock: number;
    minLevel: number;
    maxLevel: number;
    reorderPoint: number;
    suggestedQty: number;
    uom: string;
    location: string;
    supplier: string;
    leadTime: number;
    avgConsumption: number;
    status: 'critical' | 'warning' | 'normal';
    lastRestockDate: string;
}

const ReplenishmentSuggestionsPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data matching the interface
    const suggestions: ReplenishmentSuggestion[] = [
        {
            id: '1',
            itemCode: 'RM-STEEL-001',
            itemName: 'Steel Sheet 2mm',
            currentStock: 150,
            minLevel: 200,
            maxLevel: 1000,
            reorderPoint: 300,
            suggestedQty: 850,
            uom: 'Sheets',
            location: 'WH-01-A-01',
            supplier: 'Steel Corp India',
            leadTime: 5,
            avgConsumption: 25,
            status: 'critical',
            lastRestockDate: '2024-01-10'
        },
        {
            id: '2',
            itemCode: 'COMP-ELEC-042',
            itemName: 'Circuit Breaker 16A',
            currentStock: 45,
            minLevel: 50,
            maxLevel: 200,
            reorderPoint: 60,
            suggestedQty: 155,
            uom: 'Units',
            location: 'WH-02-B-12',
            supplier: 'Electronix Ltd',
            leadTime: 3,
            avgConsumption: 8,
            status: 'warning',
            lastRestockDate: '2024-01-05'
        },
        {
            id: '3',
            itemCode: 'PKG-BOX-L',
            itemName: 'Large Cardboard Box',
            currentStock: 450,
            minLevel: 500,
            maxLevel: 2000,
            reorderPoint: 600,
            suggestedQty: 1550,
            uom: 'Pcs',
            location: 'WH-03-P-05',
            supplier: 'PackIt Solutions',
            leadTime: 2,
            avgConsumption: 120,
            status: 'warning',
            lastRestockDate: '2024-01-12'
        }
    ];

    const filteredSuggestions = suggestions.filter(item => {
        const matchesSearch =
            item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.supplier.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'normal': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const currentDateTime = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full h-full p-3 space-y-3">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Replenishment
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Replenishment Suggestions</h1>
                    <p className="text-gray-600">AI-driven stock replenishment recommendations based on consumption patterns</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 bg-white shadow-sm transition-all">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                        <ShoppingCart className="w-4 h-4" />
                        Create Purchase Orders
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-2 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search items, codes, or suppliers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="critical">Critical</option>
                            <option value="warning">Warning</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>
                    <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={currentDateTime}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Item Details
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Stock Status
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Suggested Qty
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Supplier info
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSuggestions.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.itemName}</span>
                                            <span className="text-xs text-gray-500 text-nowrap">{item.itemCode}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Current:</span>
                                                <span className="font-medium">{item.currentStock} {item.uom}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Reorder Pt:</span>
                                                <span className="font-medium">{item.reorderPoint} {item.uom}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${(item.currentStock / item.maxLevel) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                                {item.suggestedQty}
                                            </span>
                                            <span className="text-sm text-gray-500">{item.uom}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{item.supplier}</span>
                                            <span className="text-xs text-gray-500">Lead Time: {item.leadTime} days</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                            {item.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                                            Create PO
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredSuggestions.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <p>No replenishment suggestions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReplenishmentSuggestionsPage;
