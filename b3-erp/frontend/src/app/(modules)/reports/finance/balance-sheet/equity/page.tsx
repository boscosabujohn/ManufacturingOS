'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function EquityDetailContent() {
    const router = useRouter();

    const equity = [
        { id: '3000', name: 'Share Capital', type: 'Equity', balance: 5000000 },
        { id: '3100', name: 'Retained Earnings', type: 'Equity', balance: 2300000 },
        { id: '3200', name: 'General Reserve', type: 'Equity', balance: 0 },
    ];

    return (
        <ReportDetailPage
            title="Equity Breakdown"
            description="Detailed view of equity accounts"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Balance Sheet', href: '/reports/finance/balance-sheet' },
                { label: 'Equity' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Equity Accounts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {equity.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/accounts/ledger/${item.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                        ₹{item.balance.toLocaleString()}
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

export default function EquityDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EquityDetailContent />
        </Suspense>
    );
}
