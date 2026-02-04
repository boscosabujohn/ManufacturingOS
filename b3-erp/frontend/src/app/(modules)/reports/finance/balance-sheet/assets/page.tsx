'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function AssetsDetailContent() {
    const router = useRouter();

    const assets = [
        { id: '1000', name: 'Cash on Hand', type: 'Current Asset', balance: 500000 },
        { id: '1010', name: 'Bank - HDFC', type: 'Current Asset', balance: 4500000 },
        { id: '1020', name: 'Bank - SBI', type: 'Current Asset', balance: 1500000 },
        { id: '1200', name: 'Accounts Receivable', type: 'Current Asset', balance: 2500000 },
        { id: '1300', name: 'Inventory - Raw Materials', type: 'Current Asset', balance: 1800000 },
        { id: '1500', name: 'Machinery & Equipment', type: 'Fixed Asset', balance: 7500000 },
        { id: '1510', name: 'Furniture & Fixtures', type: 'Fixed Asset', balance: 800000 },
        { id: '1520', name: 'Vehicles', type: 'Fixed Asset', balance: 1200000 },
        { id: '1600', name: 'Accumulated Depreciation', type: 'Fixed Asset', balance: -500000 },
    ];

    return (
        <ReportDetailPage
            title="Assets Breakdown"
            description="Detailed view of asset accounts"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Balance Sheet', href: '/reports/finance/balance-sheet' },
                { label: 'Assets' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Asset Accounts</CardTitle>
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
                            {assets.map((asset) => (
                                <ClickableTableRow
                                    key={asset.id}
                                    onClick={() => router.push(`/accounts/ledger/${asset.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{asset.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{asset.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{asset.type}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                                        ₹{asset.balance.toLocaleString()}
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

export default function AssetsDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AssetsDetailContent />
        </Suspense>
    );
}
