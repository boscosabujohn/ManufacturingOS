'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CostCenterDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Unknown Cost Center';

    const expenses = [
        { id: 'EXP-2025-005', date: '2025-01-05', category: 'Salaries', description: 'January Payroll', amount: 850000 },
        { id: 'EXP-2025-012', date: '2025-01-12', category: 'Utilities', description: 'Electricity Bill', amount: 120000 },
        { id: 'EXP-2025-018', date: '2025-01-18', category: 'Maintenance', description: 'Machine Repair', amount: 45000 },
        { id: 'EXP-2025-025', date: '2025-01-25', category: 'Supplies', description: 'Office Supplies', amount: 15000 },
        { id: 'EXP-2025-029', date: '2025-01-29', category: 'Travel', description: 'Site Visit', amount: 25000 },
    ];

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <ReportDetailPage
            title={`Cost Center: ${name}`}
            description={`Expense breakdown for ${name}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Cost Center Analysis', href: '/reports/finance/cost-center' },
                { label: 'Details' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Expense Allocation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.map((exp) => (
                                <ClickableTableRow
                                    key={exp.id}
                                    onClick={() => router.push(`/accounts/expenses/${exp.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{exp.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{exp.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{exp.category}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{exp.description}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                                        ₹{exp.amount.toLocaleString()}
                                    </td>
                                </ClickableTableRow>
                            ))}
                            <tr className="bg-gray-50 font-bold">
                                <td className="px-3 py-2" colSpan={4}>Total Expenses</td>
                                <td className="px-3 py-2 text-right text-blue-600">₹{totalExpenses.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}

export default function CostCenterDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CostCenterDetailsContent />
        </Suspense>
    );
}
