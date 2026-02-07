'use client';

import React, { useState } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    FileCheck,
    Lock,
    ArrowRight,
    X
} from 'lucide-react';

interface VerificationStep {
    id: string;
    label: string;
    description: string;
    status: 'pending' | 'success' | 'error';
}

export function BOMVerificationModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
    const [steps, setSteps] = useState<VerificationStep[]>([
        { id: 'codes', label: 'Item Master Sync', description: 'Cross-referencing 50 items with Inventory Database...', status: 'success' },
        { id: 'qty', label: 'Quantity Boundary Test', description: 'Checking for negative or zero quantities...', status: 'success' },
        { id: 'cad', label: 'CAD Association', description: 'Verifying all line items match drawing labels...', status: 'pending' },
        { id: 'cost', label: 'Cost Estimation', description: 'Calculating technical cost based on latest PO prices...', status: 'pending' }
    ]);

    if (!isOpen) return null;

    const allSuccess = steps.every(s => s.status === 'success');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-6 bg-indigo-600 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">BOM Verification Gate</h3>
                            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">Status: Technical Sign-off in Progress</p>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        {steps.map((step, idx) => (
                            <div key={step.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${step.status === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-gray-100'
                                }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300'
                                    }`}>
                                    {step.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <div className="text-[10px] font-black">{idx + 1}</div>}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-black text-slate-800 uppercase tracking-wider">{step.label}</div>
                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{step.description}</p>
                                </div>
                                {step.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            const newSteps = [...steps];
                                            newSteps[idx].status = 'success';
                                            setSteps(newSteps);
                                        }}
                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                    >
                                        Run Check
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4">
                        <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                            NOTICE: Upon verification, this BOM version will be <span className="text-amber-900 font-black">LOCKED</span>.
                            Any subsequent changes will require a NEW Version and Procurement re-approval.
                        </p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest border border-gray-200 rounded-2xl hover:bg-white transition-all">
                        Cancel
                    </button>
                    <button
                        disabled={!allSuccess}
                        onClick={onConfirm}
                        className={`flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${allSuccess ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {allSuccess ? <FileCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        Final Verification & release
                    </button>
                </div>
            </div>
        </div>
    );
}
