'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function AgingBucketContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bucket = searchParams.get('bucket') || 'All';

    const bills = [
        { id: 'BILL-001', vendor: 'Steel Suppliers Ltd', date: '2024-12-15', dueDate: '2025-01-14', amount: 150000, status: 'Overdue' },
        { id: 'BILL-002', vendor: 'Logistics Partners', date: '2024-12-20', dueDate: '2025-01-19', amount: 45000, status: 'Overdue' },
        { id: 'BILL-003', vendor: 'Office Depot', date: '2025-01-05', dueDate: '2025-02-04', amount: 12000, status: 'Open' },
        { id: 'BILL-004', vendor: 'Tech Solutions Inc', date: '2025-01-10', dueDate: '2025-02-09', amount: 85000, status: 'Open' },
    ];

    return (
        <ReportDetailPage
            title={`Aging Bucket: ${bucket}`}
            description={`Bills falling into the ${bucket} aging category`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Finance', href: '/reports' },
                { label: 'AP Aging', href: '/reports/finance/ap-aging' },
                { label: bucket }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Bills in {bucket}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bills.map((bill) => (
                                <ClickableTableRow
                                    key={bill.id}
                                    onClick={() => router.push(`/procurement/bills/${bill.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{bill.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{bill.vendor}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{bill.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{bill.dueDate}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                                        ₹{bill.amount.toLocaleString()}
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

export default function AgingBucketPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AgingBucketContent />
        </Suspense>
    );
}
