'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Split,
    Layout,
    Search,
    MessageSquare,
    Check,
    X,
    MoreHorizontal
} from 'lucide-react';

interface Discrepancy {
    id: string;
    type: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'RESOLVED';
    createdAt: string;
}

const mockDiscrepancies: Discrepancy[] = [
    {
        id: '1',
        type: 'BOQ_VS_DWG',
        description: 'Exhaust Hood quantity mismatch: BOQ says 2, DWG shows 3',
        severity: 'HIGH',
        status: 'OPEN',
        createdAt: '2025-02-05'
    },
    {
        id: '1',
        type: 'DWG_VS_SITE',
        description: 'Site wall M1 is 3450mm, Dwg shows 3500mm',
        severity: 'CRITICAL',
        status: 'OPEN',
        createdAt: '2025-02-06'
    }
];

export default function ComparisonToolsPage() {
    const { id } = useParams() as { id: string };
    const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>(mockDiscrepancies);

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="w-full space-y-4 px-3 py-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Comparison Tools</h1>
                    <p className="text-xs text-gray-400 font-bold mt-1 tracking-widest uppercase">Phase 2.1-2.3 | Design Verification</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all border-b-2 border-slate-950">
                        <Search className="w-4 h-4" />
                        Run Auto-Scan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Comparison View (Conceptual) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-3 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                            <Layout className="w-3.5 h-3.5" />
                            Side-by-Side Verification
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex divide-x divide-gray-100">
                        <div className="flex-1 p-4 bg-gray-50/30 overflow-y-auto">
                            <h3 className="text-[10px] font-black uppercase text-blue-600 mb-3 tracking-widest">BOQ Data Source</h3>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <div className="text-xs font-bold text-gray-900">Commercial Range Hood</div>
                                        <div className="text-[10px] text-gray-400 mt-1">QTY: 2 Units | Ref: BOQ-44-K</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 p-4 bg-white overflow-y-auto relative">
                            <h3 className="text-[10px] font-black uppercase text-purple-600 mb-3 tracking-widest">DWG Spec Data</h3>
                            <div className="space-y-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`p-3 rounded-lg border shadow-sm ${i === 1 ? 'border-rose-400 bg-rose-50/50' : 'border-gray-100'}`}>
                                        <div className="text-xs font-bold text-gray-900">Commercial Range Hood</div>
                                        <div className="text-[10px] text-gray-400 mt-1">Found: 3 Instances | Layer: M-EQP</div>
                                        {i === 1 && (
                                            <div className="mt-2 flex items-center gap-1.5 text-[8px] font-black text-rose-600 uppercase">
                                                <AlertTriangle className="w-3 h-3" />
                                                Quantity Mismatch Detected
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-blue-500"></div>
                            <span className="text-[8px] font-black uppercase text-gray-400">Match</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-rose-500"></div>
                            <span className="text-[8px] font-black uppercase text-gray-400">Mismatch</span>
                        </div>
                    </div>
                </div>

                {/* Discrepancy Action List */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                Flagged Discrepancies
                            </h2>
                            <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                                {discrepancies.length} Issues Found
                            </span>
                        </div>

                        <div className="space-y-3">
                            {discrepancies.map(issue => (
                                <div key={issue.id} className="p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border mb-2 inline-block ${getSeverityBadge(issue.severity)}`}>
                                            {issue.severity}
                                        </div>
                                        <button className="text-gray-300 hover:text-blue-500"><MoreHorizontal className="w-4 h-4" /></button>
                                    </div>
                                    <h3 className="text-xs font-bold text-gray-900 leading-relaxed mb-1">{issue.description}</h3>
                                    <div className="text-[10px] text-gray-400 font-bold flex items-center gap-2">
                                        <Split className="w-3 h-3" />
                                        {issue.type} • {issue.createdAt}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                            <Check className="w-3.5 h-3.5" />
                                            Update BOQ Qty
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border border-gray-200 hover:bg-gray-50 transition-all">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Query Designer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Gate Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-200 shrink-0">
                            <Layout className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">Verification Blocked</h4>
                            <p className="text-[10px] text-amber-700 font-bold mt-1 leading-relaxed">
                                CRITICAL: Phase 3 (Procurement) cannot be unlocked until all "HIGH" and "CRITICAL" severity discrepancies are resolved and sign-off is completed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
