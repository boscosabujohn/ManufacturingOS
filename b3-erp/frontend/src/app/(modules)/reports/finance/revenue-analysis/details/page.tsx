'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function RevenueDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const product = searchParams.get('product') || 'Unknown Product';

    const invoices = [
        { id: 'INV-2025-001', date: '2025-01-05', customer: 'Acme Corp', amount: 150000, status: 'Paid' },
        { id: 'INV-2025-008', date: '2025-01-12', customer: 'Global Tech', amount: 220000, status: 'Paid' },
        { id: 'INV-2025-015', date: '2025-01-18', customer: 'BuildRight Inc', amount: 85000, status: 'Pending' },
        { id: 'INV-2025-022', date: '2025-01-25', customer: 'Metro Infra', amount: 125000, status: 'Paid' },
        { id: 'INV-2025-029', date: '2025-01-28', customer: 'City Works', amount: 95000, status: 'Overdue' },
    ];

    return (
        <ReportDetailPage
            title={`Revenue Details: ${product}`}
            description={`Sales invoices for ${product}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Revenue Analysis', href: '/reports/finance/revenue-analysis' },
                { label: 'Details' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Sales Invoices</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map((inv) => (
                                <ClickableTableRow
                                    key={inv.id}
                                    onClick={() => router.push(`/sales/invoices/${inv.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{inv.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                        ₹{inv.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}

export default function RevenueDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RevenueDetailsContent />
        </Suspense>
    );
}
