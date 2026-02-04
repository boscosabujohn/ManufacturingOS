'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function LedgerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code') || 'Unknown';
    const name = searchParams.get('name') || 'Unknown Account';

    const transactions = [
        { id: 'JRN-2025-001', date: '2025-01-01', description: 'Opening Balance', debit: 2000000, credit: 0, ref: 'OB-001' },
        { id: 'JRN-2025-015', date: '2025-01-05', description: 'Invoice #INV-2025-001', debit: 500000, credit: 0, ref: 'INV-001' },
        { id: 'JRN-2025-023', date: '2025-01-10', description: 'Payment Received', debit: 0, credit: 500000, ref: 'PAY-001' },
        { id: 'JRN-2025-045', date: '2025-01-15', description: 'Purchase of Goods', debit: 0, credit: 200000, ref: 'PUR-001' },
        { id: 'JRN-2025-067', date: '2025-01-20', description: 'Utility Bill Payment', debit: 0, credit: 50000, ref: 'EXP-001' },
    ];

    let runningBalance = 0;
    const transactionsWithBalance = transactions.map(txn => {
        runningBalance += txn.debit - txn.credit;
        return { ...txn, balance: runningBalance };
    });

    return (
        <ReportDetailPage
            title={`Ledger: ${code} - ${name}`}
            description={`Transaction history for account ${code}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Trial Balance', href: '/reports/finance/trial-balance' },
                { label: 'Ledger' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Account Ledger</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journal ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactionsWithBalance.map((txn) => (
                                <ClickableTableRow
                                    key={txn.id}
                                    onClick={() => router.push(`/accounts/journal/${txn.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{txn.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{txn.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{txn.description}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{txn.ref}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                                        {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                                        {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                                        ₹{txn.balance.toLocaleString()}
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

export default function LedgerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LedgerContent />
        </Suspense>
    );
}
