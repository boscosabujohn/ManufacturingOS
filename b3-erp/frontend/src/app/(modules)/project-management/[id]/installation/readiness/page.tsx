'use client';

import React, { useState } from 'react';
import {
    Home,
    Camera,
    CheckCircle2,
    AlertCircle,
    Zap,
    Construction,
    ShieldCheck,
    ArrowLeft,
    Share2
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function SiteReadinessPortal() {
    const { id } = useParams() as { id: string };

    const checks = [
        { id: '1', title: 'Main Floor Leveling', status: 'Ready', desc: 'Screeding and leveling complete for main bay.' },
        { id: '2', title: 'Electrical Power (3-Phase)', status: 'Not Ready', desc: 'Awaiting main DB connection from site electrician.' },
        { id: '3', title: 'Access Ramp Availability', status: 'Ready', desc: 'Clear path for forklift and manual trolleys.' },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 px-3 py-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">Site Readiness</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Field Verification Portal | Phase 7.7</p>
                    </div>
                </div>
                <button className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-slate-400">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>

            {/* Overall Status Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Site Status</div>
                        <div className="text-2xl font-black italic uppercase tracking-tighter text-amber-500">Awaiting Readiness</div>
                    </div>
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                        <Construction className="w-6 h-6 text-amber-400" />
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-4 relative z-10 uppercase tracking-widest">
                    Dispatch [Phase 7.1] is locked until 100% readiness is achieved.
                </p>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="w-24 h-24" />
                </div>
            </div>

            {/* Readiness Checklist */}
            <div className="space-y-4">
                {checks.map(check => (
                    <div key={check.id} className={`bg-white rounded-3xl border transition-all p-6 ${check.status === 'Ready' ? 'border-gray-100' : 'border-amber-200 bg-amber-50/20 shadow-lg shadow-amber-50'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${check.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                    {check.title.includes('Power') ? <Zap className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{check.title}</h3>
                                    <span className={`text-[8px] font-black uppercase inline-block px-1.5 py-0.5 rounded mt-1 ${check.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-700 font-black'
                                        }`}>{check.status}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-slate-50 border border-gray-100 rounded-lg text-slate-400"><Camera className="w-4 h-4" /></button>
                                <button className="p-2 bg-slate-50 border border-gray-100 rounded-lg text-slate-400"><CheckCircle2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{check.desc}</p>
                    </div>
                ))}
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-100 transition-all hover:bg-slate-800">
                Confirm Site Attendance
            </button>
        </div>
    );
}
