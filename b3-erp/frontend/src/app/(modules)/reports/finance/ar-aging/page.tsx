'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function ARAgingReport() {
    const router = useRouter();
    const data = {
        totalAR: 2100000,
        overdueAmount: 450000,
        dso: 42,
        agingBuckets: [
            { bucket: 'Current (0-30 days)', amount: 1200000, count: 145 },
            { bucket: '31-60 days', amount: 450000, count: 42 },
            { bucket: '61-90 days', amount: 280000, count: 28 },
            { bucket: '90+ days (Overdue)', amount: 170000, count: 18 },
        ],
        topDebtors: [
            { customer: 'Restaurant Group Inc', current: 125000, overdue: 0, total: 125000, days: 25 },
            { customer: 'Manufacturing Co', current: 98000, overdue: 45000, total: 143000, days: 85 },
            { customer: 'Food Processing Ltd', current: 82000, overdue: 0, total: 82000, days: 18 },
            { customer: 'Hotel Chain Corp', current: 0, overdue: 65000, total: 65000, days: 105 },
        ],
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Accounts Receivable Aging Report</h1>
                    <p className="text-gray-600">Customer payment tracking and collection analysis</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total AR</CardTitle><DollarSign className="h-4 w-4 text-blue-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">${(data.totalAR / 1000000).toFixed(2)}M</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle><AlertTriangle className="h-4 w-4 text-red-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">${(data.overdueAmount / 1000).toFixed(0)}K</div><p className="text-xs text-gray-500 mt-1">{((data.overdueAmount / data.totalAR) * 100).toFixed(0)}% of total</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">DSO</CardTitle><Users className="h-4 w-4 text-orange-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">{data.dso}</div><p className="text-xs text-gray-500 mt-1">Days Sales Outstanding</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-600">Collection Rate</CardTitle><DollarSign className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">78.6%</div></CardContent></Card>
            </div>

            <Card className="mb-6">
                <CardHeader><CardTitle>AR Aging Analysis - Click any bucket to drill down</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.agingBuckets.map((bucket, idx) => (
                            <div
                                key={idx}
                                className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                onClick={() => router.push(`/reports/finance/ar-aging/bucket?bucket=${encodeURIComponent(bucket.bucket)}`)}
                            >
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{bucket.bucket}</span>
                                    <span className="text-sm">
                                        <span className="font-semibold">${(bucket.amount / 1000).toFixed(0)}K</span>
                                        <span className="text-gray-500 ml-2">({bucket.count} invoices)</span>
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className={`h-3 rounded-full ${idx === 0 ? 'bg-green-600' : idx === 1 ? 'bg-blue-600' : idx === 2 ? 'bg-orange-600' : 'bg-red-600'}`} style={{ width: `${(bucket.amount / data.totalAR) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Top Debtors</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Current</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Overdue</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Avg Days</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data.topDebtors.map((debtor, idx) => (
                                <ClickableTableRow
                                    key={idx}
                                    onClick={() => router.push(`/crm/customers/${idx + 1}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium">{debtor.customer}</td>
                                    <td className="px-4 py-3 text-sm text-right text-green-600">${debtor.current.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right text-red-600">{debtor.overdue > 0 ? `$${debtor.overdue.toLocaleString()}` : '-'}</td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold">${debtor.total.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`font-semibold ${debtor.days > 90 ? 'text-red-600' : debtor.days > 60 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {debtor.days} days
                                        </span>
                                    </td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
