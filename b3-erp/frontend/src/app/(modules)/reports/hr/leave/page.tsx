'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

export default function LeaveReport() {
    const [period, setPeriod] = useState('this-month');

    const data = {
        totalRequests: 124,
        approved: 98,
        pending: 18,
        rejected: 8,
        approvalRate: 79.0,
        avgLeaveDays: 2.3,
        byType: [
            { type: 'Annual Leave', count: 52, days: 148 },
            { type: 'Sick Leave', count: 38, days: 52 },
            { type: 'Personal Leave', count: 24, days: 36 },
            { type: 'Emergency', count: 10, days: 12 },
        ],
        byDepartment: [
            { dept: 'Production', requests: 32, days: 68 },
            { dept: 'Sales', requests: 28, days: 75 },
            { dept: 'Engineering', requests: 24, days: 52 },
            { dept: 'Admin', requests: 18, days: 38 },
            { dept: 'Quality', requests: 12, days: 24 },
            { dept: 'Logistics', requests: 10, days: 21 },
        ],
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Leave Report</h1>
                    <p className="text-gray-600">Employee leave tracking and analysis</p>
                </div>
                <div className="flex gap-2">
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 border rounded-lg">
                        <option value="this-month">This Month</option>
                        <option value="this-quarter">This Quarter</option>
                    </select>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <Card><CardContent className="pt-6"><p className="text-sm text-gray-600">Total Requests</p><p className="text-2xl font-bold">{data.totalRequests}</p></CardContent></Card>
                <Card><CardContent className="pt-6"><p className="text-sm text-gray-600">Approved</p><p className="text-2xl font-bold text-green-600">{data.approved}</p></CardContent></Card>
                <Card><CardContent className="pt-6"><p className="text-sm text-gray-600">Pending</p><p className="text-2xl font-bold text-orange-600">{data.pending}</p></CardContent></Card>
                <Card><CardContent className="pt-6"><p className="text-sm text-gray-600">Rejected</p><p className="text-2xl font-bold text-red-600">{data.rejected}</p></CardContent></Card>
                <Card><CardContent className="pt-6"><p className="text-sm text-gray-600">Approval Rate</p><p className="text-2xl font-bold text-blue-600">{data.approvalRate}%</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader><CardTitle>Leave by Type</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.byType.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{item.type}</span>
                                        <span className="text-sm"><span className="font-semibold">{item.count} requests</span><span className="text-gray-500 ml-2">({item.days} days)</span></span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(item.count / data.totalRequests) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Leave by Department</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.byDepartment.map((dept, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="font-medium">{dept.dept}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(dept.requests / data.totalRequests) * 100}%` }} />
                                        </div>
                                        <span className="text-sm font-semibold w-16 text-right">{dept.requests} ({dept.days}d)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
