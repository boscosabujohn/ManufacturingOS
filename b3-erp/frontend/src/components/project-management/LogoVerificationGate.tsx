'use client';

import React from 'react';
import {
    ShieldAlert,
    Image as ImageIcon,
    CheckCircle2,
    Lock,
    ArrowRight
} from 'lucide-react';

export function LogoVerificationGate({ isVerified, onVerify }: { isVerified: boolean, onVerify: () => void }) {
    if (isVerified) return (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Branding Verified</h4>
                    <p className="text-[10px] text-emerald-700 font-bold mt-1 italic">Logo Etching confirmed. Fabrication (Bending) Phase 5.7 Unlocked.</p>
                </div>
            </div>
            <div className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Approved by Supervisor</div>
        </div>
    );

    return (
        <div className="bg-rose-50 border-2 border-dashed border-rose-200 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
                <ShieldAlert className="w-24 h-24 text-rose-600" />
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shadow-sm animate-pulse">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-rose-900 uppercase italic tracking-tighter">Phase 5.6: Logo Verification Gate</h4>
                        <p className="text-[10px] text-rose-700 font-bold mt-1 tracking-widest uppercase">Action Required before Bending Stage</p>
                    </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-rose-100">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center border border-rose-200">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-rose-900 uppercase">Mandatory Etching Check</h5>
                            <p className="text-[10px] text-rose-700 font-bold leading-relaxed">
                                Please capture and upload a photo of the etched logo on the main panel.
                                This is mandatory for ISO-9001 and project branding standards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-white border border-rose-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                        Upload Proof
                    </button>
                    <button
                        onClick={onVerify}
                        className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        Request Skip (Admin) <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
