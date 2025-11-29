'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ExpenseDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || 'Unknown Category';

    const expenses = [
        { id: 'BILL-2025-001', date: '2025-01-05', vendor: 'Supplier A', description: 'Monthly Supply', amount: 50000, status: 'Paid' },
        { id: 'BILL-2025-008', date: '2025-01-12', vendor: 'Supplier B', description: 'Emergency Order', amount: 25000, status: 'Paid' },
        { id: 'BILL-2025-015', date: '2025-01-18', vendor: 'Service Provider X', description: 'Annual Maintenance', amount: 15000, status: 'Pending' },
        { id: 'EXP-2025-022', date: '2025-01-25', vendor: 'Employee Reimbursement', description: 'Travel Expenses', amount: 5000, status: 'Approved' },
        { id: 'BILL-2025-029', date: '2025-01-28', vendor: 'Utility Co', description: 'Electricity Bill', amount: 12000, status: 'Overdue' },
    ];

    return (
        <ReportDetailPage
            title={`Expense Details: ${category}`}
            description={`Expense transactions for ${category}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'Expense Analysis', href: '/reports/finance/expense-analysis' },
                { label: 'Details' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Expense Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor/Payee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.map((exp) => (
                                <ClickableTableRow
                                    key={exp.id}
                                    onClick={() => router.push(`/procurement/bills/${exp.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{exp.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.vendor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exp.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                        ₹{exp.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exp.status === 'Paid' || exp.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                exp.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {exp.status}
                                        </span>
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

export default function ExpenseDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExpenseDetailsContent />
        </Suspense>
    );
}
