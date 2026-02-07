'use client';

import React from 'react';
import {
    Flag,
    ShieldCheck,
    Calendar,
    User,
    Award,
    Hash
} from 'lucide-react';

export function HandoverCertificatePreview({ projectName, clientName, closeDate, certId }: { projectName: string, clientName: string, closeDate: string, certId: string }) {
    return (
        <div className="p-12 bg-white border-8 border-slate-900 rounded-none w-[700px] h-fit flex flex-col space-y-12 shadow-2xl relative overflow-hidden">
            {/* Background Seal */}
            <div className="absolute -top-20 -right-20 p-20 opacity-[0.03] rotate-12">
                < Award className="w-[400px] h-[400px] text-slate-900" />
            </div>

            {/* Header */}
            <div className="border-b-4 border-slate-900 pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Certificate of Handover</h1>
                    <p className="text-xs font-black text-slate-500 tracking-[0.4em] uppercase mt-4">OptiForge Manufacturing OS • Project Closure</p>
                </div>
                <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white">
                    <Flag className="w-8 h-8" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-10 py-8 relative z-10">
                <p className="text-lg font-black text-slate-700 italic leading-relaxed">
                    This document serves as formal confirmation that the project detailed below has been executed,
                    inspected, and delivered in accordance with the agreed technical specifications and quality standards.
                </p>

                <div className="grid grid-cols-2 gap-12 pt-8">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Flag className="w-3 h-3" /> Project Identity</div>
                            <div className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{projectName}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3" /> Client Principal</div>
                            <div className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{clientName}</div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> Handover Date</div>
                            <div className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{closeDate}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Hash className="w-3 h-3" /> Certificate ID</div>
                            <div className="text-xl font-black text-slate-900 font-mono tracking-tighter">{certId}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 flex items-center gap-6 mt-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic">Technical Acceptance</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                            All site snags cleared. Mechanical and Electrical systems verified functional.
                        </p>
                    </div>
                </div>
            </div>

            {/* Signatures */}
            <div className="border-t-4 border-slate-900 pt-12 grid grid-cols-2 gap-20">
                <div className="space-y-4">
                    <div className="h-16 border-b-2 border-slate-200"></div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">FOR OPTIFORGE MANUFACTURING</div>
                </div>
                <div className="space-y-4 text-right">
                    <div className="h-16 border-b-2 border-slate-200"></div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">FOR CLIENT PRINCIPAL</div>
                </div>
            </div>

            <div className="absolute bottom-6 right-6">
                <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Digitally Secured via ManufacturingOS</div>
            </div>
        </div>
    );
}
