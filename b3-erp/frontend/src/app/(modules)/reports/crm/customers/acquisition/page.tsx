'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

export default function CustomerAcquisitionDetail() {
    const router = useRouter();

    const customers = [
        { id: 'CUST-001', name: 'Acme Corp', since: '2025-01-15', source: 'Website', status: 'Active', revenue: 150000 },
        { id: 'CUST-002', name: 'Industrial Ltd', since: '2025-02-01', source: 'Referral', status: 'Active', revenue: 450000 },
        { id: 'CUST-003', name: 'Tech Start', since: '2025-02-10', source: 'LinkedIn', status: 'Onboarding', revenue: 25000 },
        { id: 'CUST-004', name: 'Global Services', since: '2025-02-15', source: 'Trade Show', status: 'Active', revenue: 85000 },
    ];

    return (
        <ReportDetailPage
            title="Customer Acquisition"
            description="New customer acquisition history"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'CRM', href: '/reports' },
                { label: 'Customer Growth', href: '/reports/crm/customers' },
                { label: 'Acquisition' },
            ]}
            onBack={() => router.back()}
            onExport={() => console.log('Export')}
        >
            <Card>
                <CardHeader><CardTitle>New Customers</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Since</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Source</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {customers.map((cust) => (
                                <ClickableTableRow
                                    key={cust.id}
                                    onClick={() => router.push(`/crm/customers/view/${cust.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{cust.name}</td>
                                    <td className="px-4 py-3 text-sm">{cust.since}</td>
                                    <td className="px-4 py-3 text-sm">{cust.source}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant="outline">{cust.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-bold">${cust.revenue.toLocaleString()}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}
