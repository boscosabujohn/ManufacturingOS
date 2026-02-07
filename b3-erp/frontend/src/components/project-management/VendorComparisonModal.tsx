'use client';

import React from 'react';
import {
    X,
    TrendingUp,
    Clock,
    Scale,
    Star,
    Check
} from 'lucide-react';

interface VendorQuote {
    id: string;
    vendorName: string;
    pricePerUnit: number;
    leadTime: string;
    rating: number;
    isSelected?: boolean;
}

const mockQuotes: VendorQuote[] = [
    { id: 'v1', vendorName: 'Industrial Steel Corp', pricePerUnit: 45.50, leadTime: '3 Days', rating: 4.8 },
    { id: 'v2', vendorName: 'Global Metals Ltd', pricePerUnit: 42.00, leadTime: '10 Days', rating: 4.2 },
    { id: 'v3', vendorName: 'Precision Parts Co', pricePerUnit: 48.00, leadTime: '2 Days', rating: 4.9 },
];

export function VendorComparisonModal({ isOpen, onClose, itemName }: { isOpen: boolean, onClose: () => void, itemName: string }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Multi-Vendor Comparison</h3>
                        <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mt-1">{itemName}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockQuotes.map((quote) => (
                        <div key={quote.id} className="relative bg-slate-50 rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50/50 group">
                            {quote.id === 'v1' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                                    Recommended
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-slate-400">
                                        <Star className={`w-5 h-5 ${quote.rating >= 4.5 ? 'text-amber-500 fill-amber-500' : ''}`} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase">Vendor Rating</div>
                                        <div className="text-xs font-black text-slate-900">{quote.rating} / 5.0</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-black text-indigo-600 uppercase tracking-wider truncate pb-1">{quote.vendorName}</div>
                                    <div className="text-2xl font-black text-slate-900 italic">${quote.pricePerUnit.toFixed(2)}</div>
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">per unit (excl. VAT)</div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <div className="flex items-center gap-1.5 text-slate-500"><Clock className="w-3.5 h-3.5" /> Lead Time</div>
                                        <div className="text-slate-900">{quote.leadTime}</div>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <div className="flex items-center gap-1.5 text-slate-500"><TrendingUp className="w-3.5 h-3.5" /> Last Price</div>
                                        <div className="text-slate-400">$44.00</div>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                                    Select Vendor
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Market Variation</div>
                            <div className="text-xs font-bold text-slate-300 mt-1">Price diff: +$3.50 vs Previous PO</div>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                        Convert PR to POs
                    </button>
                </div>
            </div>
        </div>
    );
}
