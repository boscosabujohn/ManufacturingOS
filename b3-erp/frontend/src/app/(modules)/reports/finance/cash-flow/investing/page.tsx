'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function InvestingActivitiesContent() {
    const router = useRouter();

    const transactions = [
        { id: 'INV-001', date: '2025-01-10', description: 'Purchase of CNC Machine', category: 'Asset Purchase', amount: -150000 },
        { id: 'INV-002', date: '2025-01-25', description: 'Sale of Old Van', category: 'Asset Sale', amount: 30000 },
    ];

    return (
        <ReportDetailPage
            title="Investing Activities"
            description="Cash flow from acquisition and disposal of long-term assets"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Cash Flow', href: '/reports/finance/cash-flow' },
                { label: 'Investing' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Investing Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((trx) => (
                                <ClickableTableRow
                                    key={trx.id}
                                    onClick={() => console.log(`Navigate to transaction ${trx.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{trx.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{trx.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{trx.description}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{trx.category}</td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-sm text-right font-medium ${trx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {trx.amount >= 0 ? '+' : ''}₹{Math.abs(trx.amount).toLocaleString()}
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

export default function InvestingActivitiesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InvestingActivitiesContent />
        </Suspense>
    );
}
