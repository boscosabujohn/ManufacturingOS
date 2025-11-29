'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function PettyCashTransactionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'All';
    const category = searchParams.get('category');

    const transactions = [
        { id: 'TXN-001', date: '2025-01-22', description: 'Office supplies - Stationery', amount: 125, custodian: 'Admin Dept', type: 'Disbursement', category: 'Office Supplies' },
        { id: 'TXN-002', date: '2025-01-20', description: 'Taxi fare - Client meeting', amount: 45, custodian: 'Sales Dept', type: 'Disbursement', category: 'Travel' },
        { id: 'TXN-003', date: '2025-01-18', description: 'Pantry items', amount: 85, custodian: 'Admin Dept', type: 'Disbursement', category: 'Pantry' },
        { id: 'TXN-004', date: '2025-01-15', description: 'Courier charges', amount: 35, custodian: 'Logistics', type: 'Disbursement', category: 'Misc Expenses' },
        { id: 'TXN-005', date: '2025-01-10', description: 'Cash Replenishment', amount: 3000, custodian: 'Finance', type: 'Replenishment', category: 'N/A' },
        { id: 'TXN-006', date: '2025-01-08', description: 'Client Lunch', amount: 150, custodian: 'Sales Dept', type: 'Disbursement', category: 'Meals' },
    ];

    let filteredTransactions = transactions;

    if (category) {
        filteredTransactions = filteredTransactions.filter(t => t.category === category);
    } else if (type !== 'All') {
        filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    const title = category ? `Petty Cash: ${category}` : `Petty Cash: ${type}`;

    return (
        <ReportDetailPage
            title={title}
            description={`List of petty cash transactions`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Accounts', href: '/reports' },
                { label: 'Petty Cash', href: '/reports/accounts/petty-cash' },
                { label: 'Transactions' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Transaction Log</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custodian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransactions.map((txn) => (
                                <ClickableTableRow
                                    key={txn.id}
                                    onClick={() => router.push(`/accounts/petty-cash/${txn.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{txn.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(txn.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.custodian}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Badge variant={txn.type === 'Replenishment' ? 'default' : 'secondary'}>
                                            {txn.type}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${txn.type === 'Replenishment' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.type === 'Replenishment' ? '+' : '-'}${txn.amount.toLocaleString()}
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

export default function PettyCashTransactionsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PettyCashTransactionsContent />
        </Suspense>
    );
}
