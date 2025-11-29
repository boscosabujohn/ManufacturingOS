'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ClipboardCheck, AlertTriangle, CheckCircle2, Clock, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

interface QualityStats {
    totalInspections: number;
    pendingInspections: number;
    openNCRs: number;
    activeCAPAs: number;
    passRate: number;
    complianceRate: number;
}

export default function QualityDashboard() {
    const [stats, setStats] = useState<QualityStats>({
        totalInspections: 0,
        pendingInspections: 0,
        openNCRs: 0,
        activeCAPAs: 0,
        passRate: 0,
        complianceRate: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQualityStats();
    }, []);

    const fetchQualityStats = async () => {
        try {
            setLoading(true);
            // Mock data - replace with actual API calls
            setStats({
                totalInspections: 156,
                pendingInspections: 12,
                openNCRs: 8,
                activeCAPAs: 5,
                passRate: 94.5,
                complianceRate: 98.2,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Quality Management Dashboard</h1>
                <p className="text-gray-600">Monitor quality metrics and performance</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending Inspections</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingInspections}</div>
                        <p className="text-xs text-gray-500 mt-1">Require attention</p>
                        <Link href="/quality/inspections?status=pending" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View pending →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Open NCRs</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.openNCRs}</div>
                        <p className="text-xs text-gray-500 mt-1">Non-conformances</p>
                        <Link href="/quality/ncr?status=open" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View NCRs →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active CAPAs</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.activeCAPAs}</div>
                        <p className="text-xs text-gray-500 mt-1">In progress</p>
                        <Link href="/quality/capa?status=active" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View CAPAs →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.passRate}%</div>
                        <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                        <div className="mt-2 flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +2.3% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.complianceRate}%</div>
                        <p className="text-xs text-gray-500 mt-1">Audit compliance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Inspections</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalInspections}</div>
                        <p className="text-xs text-gray-500 mt-1">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/quality/inspections/new">
                        <CardContent className="pt-6">
                            <ClipboardCheck className="h-8 w-8 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Schedule Inspection</h3>
                            <p className="text-sm text-gray-600">Create new quality inspection</p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/quality/ncr/new">
                        <CardContent className="pt-6">
                            <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Report NCR</h3>
                            <p className="text-sm text-gray-600">Create non-conformance report</p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/quality/capa/new">
                        <CardContent className="pt-6">
                            <Activity className="h-8 w-8 text-green-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Create CAPA</h3>
                            <p className="text-sm text-gray-600">Corrective/Preventive action</p>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            {/* Recent Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Quality Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { type: 'NCR', message: 'NCR-2025-001 overdue for closure', severity: 'high', time: '2 hours ago' },
                            { type: 'Inspection', message: 'Final inspection pending for WO-1234', severity: 'medium', time: '5 hours ago' },
                            { type: 'CAPA', message: 'CAPA effectiveness review due', severity: 'low', time: '1 day ago' },
                        ].map((alert, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <AlertTriangle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-600' :
                                        alert.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{alert.message}</p>
                                        <Badge variant="outline">{alert.type}</Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
