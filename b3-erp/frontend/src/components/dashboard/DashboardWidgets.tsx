'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface PremiumCardProps {
    children: React.ReactNode;
    className?: string;
    gradient?: string;
}

export const PremiumCard = ({ children, className = '', gradient = 'from-white/80 to-white/40' }: PremiumCardProps) => {
    return (
        <div className={`relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br ${gradient} backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${className}`}>
            {children}
        </div>
    );
};

interface StatHighlightProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    colorClass: string;
}

export const StatHighlight = ({ label, value, subValue, icon: Icon, colorClass }: StatHighlightProps) => {
    return (
        <PremiumCard className="p-2.5 flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${colorClass} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-none mb-0.5 truncate">{label}</p>
                <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
                {subValue && (
                    <p className="text-[9px] font-bold text-green-600 mt-0.5 flex items-center gap-1 leading-none">
                        {subValue}
                    </p>
                )}
            </div>
        </PremiumCard>
    );
};

interface ModuleLinkProps {
    name: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;
    stats: { total: number; new: number };
}

export const ModuleLink = ({ name, description, href, icon: Icon, color, stats }: ModuleLinkProps) => {
    return (
        <Link href={href} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-2">
                <div className={`${color} p-2.5 rounded-lg shadow-md group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-tight leading-none mb-1">TOTAL</p>
                    <p className="text-sm font-black text-gray-900 leading-none">{stats.total.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-green-600 mt-0.5 leading-none">+{stats.new} NEW</p>
                </div>
            </div>

            <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                {name}
            </h3>
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                {description}
            </p>

            <div className={`h-1 ${color} absolute bottom-0 left-0 right-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
        </Link>
    );
};
