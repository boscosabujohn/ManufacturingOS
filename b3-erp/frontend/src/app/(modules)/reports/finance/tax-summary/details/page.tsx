'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function TaxDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code') || 'Unknown';

    const transactions = [
        { id: 'INV-2025-001', date: '2025-01-05', party: 'Acme Corp', taxable: 100000, tax: 18000, type: 'Sales' },
        { id: 'INV-2025-005', date: '2025-01-12', party: 'Global Tech', taxable: 250000, tax: 45000, type: 'Sales' },
        { id: 'INV-2025-012', date: '2025-01-18', party: 'Local Retail', taxable: 50000, tax: 9000, type: 'Sales' },
        { id: 'PUR-2025-003', date: '2025-01-08', party: 'Office Supplies Co', taxable: 20000, tax: 3600, type: 'Purchase' },
        { id: 'PUR-2025-009', date: '2025-01-15', party: 'Raw Materials Ltd', taxable: 500000, tax: 90000, type: 'Purchase' },
    ];

    // Filter logic would go here based on code (Input vs Output)
    // For mock purposes, we'll just show a mix

    return (
        <ReportDetailPage
            title={`Tax Details: ${code}`}
            description={`Transaction history for tax code ${code}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Tax Summary', href: '/reports/finance/tax-summary' },
                { label: 'Details' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Tax Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice/Bill #</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxable Amount</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((txn) => (
                                <ClickableTableRow
                                    key={txn.id}
                                    onClick={() => router.push(`/accounts/transactions/${txn.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{txn.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{txn.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{txn.party}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{txn.type}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                                        ₹{txn.taxable.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                        ₹{txn.tax.toLocaleString()}
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

export default function TaxDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TaxDetailsContent />
        </Suspense>
    );
}
