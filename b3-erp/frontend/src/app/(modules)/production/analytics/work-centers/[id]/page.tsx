'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    BarChart3,
    TrendingUp,
    Clock,
    Users,
    Zap,
    Activity,
    Download,
    Calendar
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { workCenterService } from '@/services/work-center.service';

export default function WorkCenterAnalyticsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await workCenterService.getWorkCenterAnalytics(id, period);
                setAnalytics(data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [id, period]);

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
    if (!analytics) return <div className="p-8 text-center text-red-500">Analytics not found or failed to load.</div>;

    const hourData = [
        { name: 'Machine Hours', value: analytics.totalMachineHours, color: '#3b82f6' },
        { name: 'Labor Hours', value: analytics.totalLaborHours, color: '#8b5cf6' },
    ];

    const shiftData = Object.keys(analytics.shiftComparison).map(key => ({
        name: key,
        machine: analytics.shiftComparison[key].machineHours,
        labor: analytics.shiftComparison[key].laborHours,
    }));

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-4">
            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors border bg-white"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Work Center Analytics</h1>
                        <p className="text-sm text-gray-500">Productivity and OEE Tracking</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-white border rounded-lg p-1 flex shadow-sm">
                        {(['day', 'week', 'month'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${period === p ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {p.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall OEE</span>
                        <Activity className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{analytics.oee?.toFixed(1) || 0}%</div>
                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${analytics.oee || 0}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Machine Hours</span>
                        <Zap className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{analytics.totalMachineHours?.toFixed(1) || 0}h</div>
                    <div className="text-xs text-blue-600 font-bold mt-1">Active Run Time</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Labor Hours</span>
                        <Users className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{analytics.totalLaborHours?.toFixed(1) || 0}h</div>
                    <div className="text-xs text-purple-600 font-bold mt-1">Person-hours invested</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uptime Percentage</span>
                        <Clock className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{analytics.uptime?.toFixed(1) || 0}%</div>
                    <div className="text-xs text-orange-600 font-bold mt-1">Scheduled vs Actual</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Machine vs Labor Comparison */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Machine vs Labor Utilization
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} fontWeight="bold" />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                                    {hourData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Shift Performance */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Performance by Shift
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={shiftData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} fontWeight="bold" />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="machine" name="Machine Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="labor" name="Labor Hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
