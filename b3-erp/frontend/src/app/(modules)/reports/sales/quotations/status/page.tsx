'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function QuotationsStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const quotations = [
        { id: 'QTN-2025-001', date: '2025-01-10', customer: 'TechCorp Industries', value: 150000, status: 'Accepted' },
        { id: 'QTN-2025-002', date: '2025-01-12', customer: 'Alpha Corp', value: 250000, status: 'Sent' },
        { id: 'QTN-2025-003', date: '2025-01-14', customer: 'Beta Industries', value: 180000, status: 'Expired' },
        { id: 'QTN-2025-004', date: '2025-01-15', customer: 'Global Manufacturing', value: 360000, status: 'Accepted' },
        { id: 'QTN-2025-005', date: '2025-01-18', customer: 'Gamma Solutions', value: 420000, status: 'Sent' },
    ];

    const filteredQuotations = status === 'All'
        ? quotations
        : quotations.filter(q => q.status === status);

    return (
        <ReportDetailPage
            title={`Quotations: ${status}`}
            description={`List of quotations with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Sales', href: '/reports' },
                { label: 'Quotation Analysis', href: '/reports/sales/quotations' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Quotation List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredQuotations.map((quote) => (
                                <ClickableTableRow
                                    key={quote.id}
                                    onClick={() => router.push(`/sales/quotations/${quote.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{quote.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">₹{(quote.value / 1000).toFixed(0)}K</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {quote.status}
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

export default function QuotationsStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QuotationsStatusContent />
        </Suspense>
    );
}
