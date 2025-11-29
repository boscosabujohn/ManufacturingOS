'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function ExpenseClaimsStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';
    const category = searchParams.get('category');

    const claims = [
        { id: 'EXP-2025-001', employee: 'John Doe', dept: 'Sales', category: 'Travel', amount: 1250, date: '2025-01-20', status: 'Submitted' },
        { id: 'EXP-2025-002', employee: 'Jane Smith', dept: 'Sales', category: 'Meals', amount: 450, date: '2025-01-18', status: 'Approved' },
        { id: 'EXP-2025-003', employee: 'Mike Johnson', dept: 'Engineering', category: 'Office Supplies', amount: 125, date: '2025-01-15', status: 'Paid' },
        { id: 'EXP-2025-004', employee: 'Sarah Wilson', dept: 'Marketing', category: 'Travel', amount: 2400, date: '2025-01-12', status: 'Submitted' },
        { id: 'EXP-2025-005', employee: 'David Brown', dept: 'HR', category: 'Training', amount: 850, date: '2025-01-10', status: 'Rejected' },
        { id: 'EXP-2025-006', employee: 'Emily Davis', dept: 'Finance', category: 'Software', amount: 1200, date: '2025-01-08', status: 'Paid' },
        { id: 'EXP-2025-007', employee: 'Chris Lee', dept: 'IT', category: 'Hardware', amount: 3500, date: '2025-01-05', status: 'Approved' },
    ];

    let filteredClaims = claims;

    if (category) {
        filteredClaims = filteredClaims.filter(c => c.category === category);
    } else if (status !== 'All') {
        filteredClaims = filteredClaims.filter(c => c.status === status);
    }

    const title = category ? `Expense Claims: ${category}` : `Expense Claims: ${status}`;

    return (
        <ReportDetailPage
            title={title}
            description={`List of expense claims`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Accounts', href: '/reports' },
                { label: 'Expense Claims', href: '/reports/accounts/expense-claims' },
                { label: 'Details' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Claims List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredClaims.map((claim) => (
                                <ClickableTableRow
                                    key={claim.id}
                                    onClick={() => router.push(`/accounts/expenses/${claim.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{claim.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.employee}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.dept}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                        ${claim.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Badge variant={
                                            claim.status === 'Paid' ? 'default' :
                                                claim.status === 'Approved' ? 'secondary' :
                                                    claim.status === 'Rejected' ? 'destructive' : 'outline'
                                        }>
                                            {claim.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.date}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}

export default function ExpenseClaimsStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExpenseClaimsStatusContent />
        </Suspense>
    );
}
