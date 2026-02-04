'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function LiabilitiesDetailContent() {
    const router = useRouter();

    const liabilities = [
        { id: '2000', name: 'Accounts Payable', type: 'Current Liability', balance: 1800000 },
        { id: '2010', name: 'GST Payable', type: 'Current Liability', balance: 450000 },
        { id: '2020', name: 'Salaries Payable', type: 'Current Liability', balance: 850000 },
        { id: '2030', name: 'TDS Payable', type: 'Current Liability', balance: 100000 },
        { id: '2500', name: 'Bank Loan - HDFC', type: 'Long Term Liability', balance: 3500000 },
        { id: '2510', name: 'Term Loan - SBI', type: 'Long Term Liability', balance: 1500000 },
    ];

    return (
        <ReportDetailPage
            title="Liabilities Breakdown"
            description="Detailed view of liability accounts"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Balance Sheet', href: '/reports/finance/balance-sheet' },
                { label: 'Liabilities' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Liability Accounts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {liabilities.map((liability) => (
                                <ClickableTableRow
                                    key={liability.id}
                                    onClick={() => router.push(`/accounts/ledger/${liability.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{liability.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{liability.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{liability.type}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                                        ₹{liability.balance.toLocaleString()}
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

export default function LiabilitiesDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LiabilitiesDetailContent />
        </Suspense>
    );
}
