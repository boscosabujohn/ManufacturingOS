'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function VarianceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || 'Unknown Category';

    const transactions = [
        { id: 'TXN-2025-001', date: '2025-01-05', description: 'Q1 Allocation', budget: 1250000, actual: 1200000, variance: 50000 },
        { id: 'TXN-2025-015', date: '2025-01-15', description: 'Emergency Procurement', budget: 0, actual: 50000, variance: -50000 },
        { id: 'TXN-2025-022', date: '2025-01-22', description: 'Vendor Refund', budget: 0, actual: -10000, variance: 10000 },
        { id: 'TXN-2025-028', date: '2025-01-28', description: 'Monthly Adjustment', budget: 100000, actual: 110000, variance: -10000 },
    ];

    return (
        <ReportDetailPage
            title={`Variance Analysis: ${category}`}
            description={`Detailed budget variance for ${category}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Budget vs Actual', href: '/reports/finance/budget-vs-actual' },
                { label: 'Variance' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((txn) => (
                                <ClickableTableRow
                                    key={txn.id}
                                    onClick={() => router.push(`/accounts/transactions/${txn.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{txn.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                        ₹{txn.budget.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                        ₹{txn.actual.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${txn.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.variance > 0 ? '+' : ''}₹{txn.variance.toLocaleString()}
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

export default function VariancePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VarianceContent />
        </Suspense>
    );
}
