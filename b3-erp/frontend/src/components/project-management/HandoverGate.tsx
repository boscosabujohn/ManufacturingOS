'use client';

import React from 'react';
import {
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    FileCheck,
    ClipboardList
} from 'lucide-react';

export function HandoverGate({ projectName, status, onInitiate }: { projectName: string; status: 'PENDING' | 'APPROVED'; onInitiate: () => void }) {
    const checks = [
        { label: 'Work Award Confirmation', passed: true },
        { label: 'Detailed BOQ Uploaded', passed: true },
        { label: 'Client Contact Verified', passed: false },
        { label: 'Initial Site Survey Scheduled', passed: false },
    ];

    return (
        <div className="bg-white rounded-3xl border-2 border-slate-900 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Sales-to-Project Handover</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mandatory Verification Gate | Phase 1.10</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {checks.map((check, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${check.passed ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                <span className="text-xs font-black text-slate-700 uppercase italic tracking-tight">{check.label}</span>
                            </div>
                            {check.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-slate-300" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                        Review Discrepancies
                    </button>
                    <button
                        onClick={onInitiate}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
                    >
                        Initiate Handover <ArrowRight className="w-4 h-4 text-indigo-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
