'use client';

import React from 'react';
import {
    QrCode,
    Truck,
    Flag,
    Weight,
    Printer
} from 'lucide-react';

export function QRLabelPrinter({ crateId, projectName, weight, destination }: { crateId: string, projectName: string, weight: string, destination: string }) {
    return (
        <div className="p-8 bg-white border-4 border-slate-900 rounded-none w-[400px] h-[600px] flex flex-col justify-between shadow-2xl space-y-6">
            <div className="border-b-4 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">OptiForge Dispatch</h1>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase mt-2">Industrial Packaging System</p>
                </div>
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white">
                    <Flag className="w-6 h-6" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
                <div className="p-4 bg-white border-2 border-slate-200">
                    <QrCode className="w-48 h-48 text-slate-900" />
                </div>
                <div className="text-center">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">CRATE UNIQUE IDENTIFIER</div>
                    <div className="text-2xl font-black text-slate-900 font-mono mt-1">{crateId}</div>
                </div>
            </div>

            <div className="border-t-4 border-slate-900 pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PROJECT NAME</div>
                        <div className="text-xs font-black text-slate-900 uppercase truncate">{projectName}</div>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TOTAL WEIGHT</div>
                        <div className="text-xs font-black text-slate-900 uppercase leading-none flex items-center justify-end gap-1"><Weight className="w-3 h-3" /> {weight} KG</div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 text-white">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">DESTINATION</div>
                    <div className="text-sm font-black uppercase italic tracking-tight flex items-center gap-2"><Truck className="w-4 h-4 text-indigo-400" /> {destination}</div>
                </div>
            </div>

            <button className="no-print absolute top-4 right-4 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all">
                <Printer className="w-6 h-6" />
            </button>
        </div>
    );
}
