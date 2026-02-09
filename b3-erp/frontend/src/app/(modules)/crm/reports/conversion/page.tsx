'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Target,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Calendar,
    Download
} from 'lucide-react';
import { leadService } from '@/services/lead.service';

export default function ConversionReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await leadService.getConversionStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch conversion stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Conversion Reports</h1>
                    <p className="text-gray-500">Analyze lead lifecycle and success rates</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Overall Conversion</span>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Target className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{stats?.overallConversionRate?.toFixed(1)}%</span>
                        <span className="text-sm text-green-600 flex items-center">
                            <ArrowUpRight className="h-3 w-3" />
                            +2.4%
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Leads</span>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{stats?.totalLeads}</span>
                        <span className="text-sm text-blue-600">In period</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Avg. Time to Won</span>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">14d</span>
                        <span className="text-sm text-red-600 flex items-center">
                            <ArrowDownRight className="h-3 w-3" />
                            -1.2d
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Win Rate Goal</span>
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <Target className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">25.0%</span>
                        <span className="text-sm text-gray-500">Target</span>
                    </div>
                </div>
            </div>

            {/* Funnel/Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Funnel Breakdown</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Analysis</button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {stats?.byStatus?.map((item: any, idx: number) => (
                                <div key={item.status} className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="capitalize">{item.status}</span>
                                        <span>{item.count} leads ({item.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${idx === 0 ? 'bg-blue-500' :
                                                    idx === 1 ? 'bg-indigo-500' :
                                                        idx === 2 ? 'bg-purple-500' :
                                                            'bg-emerald-500'
                                                }`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Conversion by Period</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">This Week</span>
                            <span className="text-sm font-bold text-green-600">18.5%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Last Week</span>
                            <span className="text-sm font-bold text-gray-900">16.2%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Average</span>
                            <span className="text-sm font-bold text-blue-600">15.8%</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                            Schedule Weekly Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
