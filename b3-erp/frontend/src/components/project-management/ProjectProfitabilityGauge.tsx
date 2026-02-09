'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ProjectProfitabilityGaugeProps {
    income: number;
    expenditure: number;
    profit: number;
    margin: number;
    targetMargin?: number;
}

export const ProjectProfitabilityGauge: React.FC<ProjectProfitabilityGaugeProps> = ({
    income,
    expenditure,
    profit,
    margin,
    targetMargin = 20,
}) => {
    const isProfitable = profit >= 0;
    const isBelowTarget = margin < targetMargin;

    // Calculate gauge rotation (0 to 180 degrees)
    // Assuming 0% margin is 90deg (middle), -50% is 0deg, +50% is 180deg
    const normalizedMargin = Math.min(Math.max(margin, -50), 50);
    const rotation = ((normalizedMargin + 50) / 100) * 180;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Financial Health</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Real-time IoE Tracker</p>
                </div>
                <div className={`p-2 rounded-lg ${isProfitable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
            </div>

            <div className="relative h-32 flex items-center justify-center mb-4">
                {/* Simple SVG Gauge */}
                <svg viewBox="0 0 100 50" className="w-40">
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke={isProfitable ? '#10b981' : '#f43f5e'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(rotation / 180) * 125.6} 125.6`}
                    />
                </svg>
                <div className="absolute bottom-4 text-center">
                    <span className={`text-2xl font-black ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {margin.toFixed(1)}%
                    </span>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Net Margin</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Revenue</span>
                    </div>
                    <p className="text-xs font-black text-slate-900">{formatCurrency(income)}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Expense</span>
                    </div>
                    <p className="text-xs font-black text-slate-900">{formatCurrency(expenditure)}</p>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Project P&L</span>
                    <span className={`text-xs font-black ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isProfitable ? '+' : ''}{formatCurrency(profit)}
                    </span>
                </div>
            </div>
        </div>
    );
};
