'use client';

import React from 'react';
import {
    FileText,
    Download,
    Eye,
    History,
    CheckCircle2,
    ArrowLeft,
    Layers,
    Scissors
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function NestingGallery() {
    const { id } = useParams() as { id: string };

    const assets = [
        { id: '1', name: 'Layout_Main_Panels_V3.dxf', type: 'Laser Nesting', date: '2026-02-05', status: 'Approved', rev: '3.2' },
        { id: '2', name: 'Bending_Specs_Cabinet_A.pdf', type: 'Bending Guide', date: '2026-02-03', status: 'In Rev', rev: '1.0' },
    ];

    return (
        <div className="w-full space-y-4 px-3 py-4">
            <div className="flex items-center gap-4 mb-2">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-all">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-slate-900 leading-none uppercase italic tracking-tighter">Manufacturing Assets</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Nesting & Fabrication Drawings | Phase 5.3</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map((asset) => (
                    <div key={asset.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                            {asset.type.includes('Laser') ? <Scissors className="w-8 h-8" /> : <Layers className="w-8 h-8" />}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{asset.type}</span>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${asset.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>Rev {asset.rev} • {asset.status}</span>
                                </div>
                                <h3 className="text-sm font-black text-slate-900 truncate mt-1">{asset.name}</h3>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">Uploaded: {asset.date}</p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                                    <Eye className="w-3.5 h-3.5" /> View
                                </button>
                                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                                    <Download className="w-3.5 h-3.5" /> Download
                                </button>
                                <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-all">
                                    <History className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sync Alert */}
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase italic tracking-tighter">Nesting Software Integration</h4>
                    <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">Automatic sync enabled for SIGMANEST / TRUMPF JSON schemas.</p>
                </div>
                <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Link Station
                </button>
            </div>
        </div>
    );
}
