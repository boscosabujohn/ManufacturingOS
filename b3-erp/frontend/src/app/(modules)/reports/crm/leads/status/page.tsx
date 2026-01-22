'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Download,
    Search,
    Filter,
    ChevronRight,
    Layers,
    Clock,
    CheckCircle2,
    AlertCircle,
    BarChart3
} from 'lucide-react';

function LeadsByStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All Statuses';

    const leads = [
        { id: 'LEAD-001', name: 'John Smith', company: 'Tech Solutions', source: 'Website', status: 'Qualified', value: 45000, daysInStatus: 12 },
        { id: 'LEAD-002', name: 'Sarah Jones', company: 'Global Corp', source: 'LinkedIn', status: 'New', value: 25000, daysInStatus: 2 },
        { id: 'LEAD-003', name: 'Mike Brown', company: 'Local Retail', source: 'Referral', status: 'Contacted', value: 15000, daysInStatus: 5 },
        { id: 'LEAD-004', name: 'Emily Davis', company: 'Design Studio', source: 'Website', status: 'Proposal', value: 60000, daysInStatus: 8 },
        { id: 'LEAD-005', name: 'David Wilson', company: 'BuildIt Inc', source: 'Trade Show', status: 'New', value: 80000, daysInStatus: 3 },
        { id: 'LEAD-008', name: 'Kevin H.', company: 'Solar Edge', source: 'Organic', status: 'Qualified', value: 95000, daysInStatus: 15 },
        { id: 'LEAD-009', name: 'Laura G.', company: 'Visionary', source: 'Referral', status: 'Contacted', value: 34000, daysInStatus: 4 },
    ];

    const filteredLeads = status === 'All Statuses' || status === 'All' ? leads : leads.filter(l => l.status === status);

    const getStatusStyles = (stat: string) => {
        switch (stat.toLowerCase()) {
            case 'new': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'contacted': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'qualified': return 'bg-green-50 text-green-700 border-green-100';
            case 'proposal': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'unresponsive': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (stat: string) => {
        switch (stat.toLowerCase()) {
            case 'new': return <Layers className="w-5 h-5 text-blue-600" />;
            case 'contacted': return <Clock className="w-5 h-5 text-orange-600" />;
            case 'qualified': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'proposal': return <BarChart3 className="w-5 h-5 text-purple-600" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-orange-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg text-white">
                                {getStatusIcon(status)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-none">Status Breakdown: {status}</h1>
                                <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest mt-1">
                                    Analyze throughput and aging for leads in this lifecycle stage
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="font-black uppercase text-[10px] tracking-widest border-gray-200">
                            Filter Lifecycle
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md font-black uppercase text-[10px] tracking-widest">
                            <Download className="mr-2 h-4 w-4" /> Export Slice
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Metrics Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-white border-gray-100 shadow-sm border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Leads in stage</p>
                            <p className="text-3xl font-black text-gray-900 mt-1 italic tracking-tighter">{filteredLeads.length}</p>
                            <p className="mt-3 text-[10px] font-bold text-purple-600 uppercase tracking-wider">Volume</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-100 shadow-sm border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Time in Stage</p>
                            <p className="text-3xl font-black text-gray-900 mt-1 italic tracking-tighter">
                                {Math.round(filteredLeads.reduce((sum, l) => sum + l.daysInStatus, 0) / filteredLeads.length)} Days
                            </p>
                            <p className="mt-3 text-[10px] font-bold text-blue-600 uppercase tracking-wider">Velocity Metric</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-100 shadow-sm border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage Value</p>
                            <p className="text-3xl font-black text-gray-900 mt-1 italic tracking-tighter">
                                ${filteredLeads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}
                            </p>
                            <p className="mt-3 text-[10px] font-bold text-green-600 uppercase tracking-wider">Qualified Capital</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-100 shadow-sm border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                            <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Aging Alert</p>
                            <p className="text-3xl font-black text-orange-900 mt-1 italic tracking-tighter">
                                {filteredLeads.filter(l => l.daysInStatus > 10).length} Leads
                            </p>
                            <p className="mt-3 text-[10px] font-bold text-orange-700 uppercase tracking-wider">Requires attention</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Leads Stage Table */}
                <Card className="border-gray-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-100 py-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-900">Lead Movement Tracking</CardTitle>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search stage..."
                                    className="pl-8 pr-4 py-1.5 border border-gray-100 rounded-lg text-[10px] focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject / Company</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Aging (Days)</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Lifecycle</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Value</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                            onClick={() => router.push(`/crm/leads/view/${lead.id}`)}
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lead.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{lead.company}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-black italic ${lead.daysInStatus > 10 ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {lead.daysInStatus} Days
                                                    </span>
                                                    {lead.daysInStatus > 10 && <AlertCircle className="w-3 h-3 text-red-500" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusStyles(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-black text-gray-900 italic tracking-tight">${lead.value.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-gray-100 rounded-lg transition-all translate-x-2 group-hover:translate-x-0">
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Growth Warning Panel */}
                {filteredLeads.some(l => l.daysInStatus > 10) && (
                    <div className="bg-red-50 border-2 border-red-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-red-900 uppercase tracking-widest">Stagnant Lead Warning</h4>
                            <p className="text-xs text-red-700 mt-1 max-w-2xl font-medium">
                                Several leads in the <span className="font-bold">"{status}"</span> stage have not shown activity for over 10 days.
                                This is negatively impacting your funnel velocity. Immediate outreach or re-assignment is recommended.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LeadsByStatusDetail() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Analyzing Lifecycle Data...</div>}>
            <LeadsByStatusContent />
        </Suspense>
    );
}
