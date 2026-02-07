'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    Table,
    Plus,
    Upload,
    RefreshCw,
    Save,
    Trash2,
    CheckCircle,
    Package,
    AlertTriangle,
    Search,
    Filter,
} from 'lucide-react';
import { boqService, BOQ, BOQItem } from '@/services/BOQService';
import { projectManagementService } from '@/services/ProjectManagementService';

export default function BOQManagementPage() {
    const { id } = useParams() as { id: string };
    const [boqs, setBoqs] = useState<BOQ[]>([]);
    const [selectedBOQ, setSelectedBOQ] = useState<BOQ | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'items' | 'history'>('items');

    useEffect(() => {
        loadBOQs();
    }, [id]);

    const loadBOQs = async () => {
        setLoading(true);
        try {
            const data = await boqService.getProjectBOQs(id);
            setBoqs(data);
            if (data.length > 0 && !selectedBOQ) {
                setSelectedBOQ(data[0]);
            }
        } catch (error) {
            console.error('Failed to load BOQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!selectedBOQ) return;
        try {
            await boqService.syncWithInventory(selectedBOQ.id);
            await loadBOQs();
        } catch (error) {
            console.error('Sync failed:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending_approval': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading BOQ Data...</div>;

    return (
        <div className="w-full space-y-4 px-3 py-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Bill of Quantities (BOQ)</h1>
                    <p className="text-xs text-gray-400 font-bold mt-1">Project ID: {id}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                        <Upload className="w-4 h-4" />
                        Upload Excel
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all">
                        <Plus className="w-4 h-4" />
                        New Line Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                {/* Side Sidebar: BOQ List */}
                <div className="xl:col-span-1 space-y-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">BOQ Versions</h2>
                        <div className="space-y-2">
                            {boqs.map(boq => (
                                <div
                                    key={boq.id}
                                    onClick={() => setSelectedBOQ(boq)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedBOQ?.id === boq.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-sm text-gray-900">{boq.name}</div>
                                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStatusBadge(boq.status)}`}>
                                            {boq.status}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">{new Date(boq.createdAt).toLocaleDateString()}</div>
                                    <div className="text-xs font-black text-blue-600 mt-2">₹{boq.totalAmount.toLocaleString()}</div>
                                </div>
                            ))}
                            {boqs.length === 0 && <p className="text-xs text-gray-400 py-4 text-center">No BOQs found</p>}
                        </div>
                    </div>
                </div>

                {/* Main Content: Line Items */}
                <div className="xl:col-span-3 space-y-4">
                    {selectedBOQ ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setActiveTab('items')}
                                            className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === 'items' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Line Items
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('history')}
                                            className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Version History
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSync}
                                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Sync Inventory
                                    </button>
                                    <button className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all">
                                        <Save className="w-3.5 h-3.5" />
                                        Approve BOQ
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 border-b">Item Details</th>
                                            <th className="px-4 py-3 border-b">Category</th>
                                            <th className="px-4 py-3 border-b text-right">Quantity</th>
                                            <th className="px-4 py-3 border-b text-right">Rate</th>
                                            <th className="px-4 py-3 border-b text-right">Total</th>
                                            <th className="px-4 py-3 border-b text-center">Master Link</th>
                                            <th className="px-4 py-3 border-b text-right min-w-[100px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedBOQ.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 group transition-all">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-bold text-gray-900">{item.description}</div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5">{item.specifications || 'No special instructions'}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                                        {item.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-bold">
                                                    {item.quantity} {item.unit}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-bold">
                                                    ₹{item.rate.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-black text-gray-900 border-r border-gray-50">
                                                    ₹{item.amount.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        {item.itemId ? (
                                                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                                <CheckCircle className="w-3 h-3" />
                                                                <span className="text-[8px] font-black uppercase">{item.itemCode}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                <span className="text-[8px] font-black uppercase">Unlinked</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
                                                        <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-right text-xs font-black text-gray-500 uppercase">Subtotal</td>
                                            <td className="px-4 py-3 text-right text-sm font-black text-blue-700">₹{selectedBOQ.totalAmount.toLocaleString()}</td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">No BOQ Selected</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Select a Bill of Quantities version from the left or upload a new one to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
