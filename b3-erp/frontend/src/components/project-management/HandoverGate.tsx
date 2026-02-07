'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    FileCheck,
    ClipboardCheck,
    AlertCircle,
    ChevronRight,
    Search,
    ThumbsUp,
    ThumbsDown,
    Lock
} from 'lucide-react';

interface HandoverItem {
    id: string;
    label: string;
    description: string;
    status: 'complete' | 'pending' | 'missing';
    category: 'Document' | 'Approval' | 'Technical';
}

const mockHandoverItems: HandoverItem[] = [
    { id: '1', label: 'Signed BOQ', description: 'Final version of Bill of Quantities signed by client', status: 'complete', category: 'Document' },
    { id: '2', label: 'Technical Drawings', description: 'All layout and MEP drawings approved', status: 'complete', category: 'Technical' },
    { id: '3', label: 'Payment Terms Confirmed', description: 'Advance payment received and terms documented', status: 'Approval', category: 'Approval' },
    { id: '4', label: 'Site Survey Report', description: 'Preliminary site measurements and constraints', status: 'pending', category: 'Technical' },
    { id: '5', label: 'Client POC Confirmation', description: 'Designated contact person and email verified', status: 'missing', category: 'Document' }
];

export function HandoverGate({ projectId, onApprove }: { projectId: string, onApprove?: () => void }) {
    const [items, setItems] = useState<HandoverItem[]>(mockHandoverItems);
    const [feedback, setFeedback] = useState('');

    const allComplete = items.every(i => i.status === 'complete');

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black leading-none italic uppercase tracking-wider">Handover Gate (Phase 1.10)</h2>
                        <p className="text-[10px] text-blue-300 font-bold mt-1 uppercase tracking-widest">Formal Sales to Operations Transfer</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Handover Status</div>
                        <div className={`text-2xl font-black ${allComplete ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {allComplete ? 'Ready for Handover' : 'Requirements Pending'}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-gray-400 uppercase">Verification Progress</div>
                            <div className="text-lg font-black text-slate-800">{items.filter(i => i.status === 'complete').length} / {items.length}</div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="24" cy="24" r="20"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-blue-500"
                                    strokeDasharray={`${(items.filter(i => i.status === 'complete').length / items.length) * 125.6} 125.6`}
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item.id} className="group flex items-center gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.status === 'complete' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                    item.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                        'bg-rose-50 border-rose-100 text-rose-600'
                                }`}>
                                {item.status === 'complete' ? <FileCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{item.label}</span>
                                    <span className="text-[8px] font-black bg-white px-1.5 py-0.5 rounded border border-gray-100 text-gray-400 uppercase">{item.category}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold mt-0.5">{item.description}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    ))}
                </div>

                <div className="mt-8 space-y-4">
                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Internal Handover Notes</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide any additional context for the project team..."
                            className="w-full h-24 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50/30"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            disabled={!allComplete}
                            onClick={onApprove}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-all ${allComplete ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                }`}
                        >
                            {allComplete ? <ThumbsUp className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            Approve Handover
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-rose-100 transition-all">
                            <ThumbsDown className="w-5 h-5" />
                            Reject
                        </button>
                    </div>
                    {!allComplete && (
                        <p className="text-[10px] text-rose-500 font-bold text-center animate-pulse flex items-center justify-center gap-1.5">
                            <AlertCircle className="w-3 h-3" />
                            All mandatory requirements must be verified before handover approval
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-slate-50 p-4 flex items-center justify-center gap-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified by Sales Lead</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pending Operations Review</span>
                </div>
            </div>
        </div>
    );
}
