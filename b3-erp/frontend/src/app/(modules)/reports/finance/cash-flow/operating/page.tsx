'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function OperatingActivitiesContent() {
    const router = useRouter();

    const transactions = [
        { id: 'TRX-001', date: '2025-01-15', description: 'Customer Payment - Acme Corp', category: 'Revenue', amount: 150000 },
        { id: 'TRX-002', date: '2025-01-16', description: 'Vendor Payment - Steel Suppliers', category: 'Expense', amount: -45000 },
        { id: 'TRX-003', date: '2025-01-18', description: 'Utility Bill Payment', category: 'Expense', amount: -12000 },
        { id: 'TRX-004', date: '2025-01-20', description: 'Customer Payment - Globex', category: 'Revenue', amount: 85000 },
        { id: 'TRX-005', date: '2025-01-22', description: 'Payroll Transfer', category: 'Expense', amount: -120000 },
    ];

    return (
        <ReportDetailPage
            title="Operating Activities"
            description="Cash flow from core business operations"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Cash Flow', href: '/reports/finance/cash-flow' },
                { label: 'Operating' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Operating Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((trx) => (
                                <ClickableTableRow
                                    key={trx.id}
                                    onClick={() => console.log(`Navigate to transaction ${trx.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{trx.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trx.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.category}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${trx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

export default function OperatingActivitiesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OperatingActivitiesContent />
        </Suspense>
    );
}
