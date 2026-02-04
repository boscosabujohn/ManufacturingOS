'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function SalespersonContent() {
    const router = useRouter();

    const orders = [
        { id: 'ORD-2025-002', date: '2025-01-16', customer: 'Alpha Corp', value: 250000, status: 'Delivered' },
        { id: 'ORD-2025-005', date: '2025-01-19', customer: 'Beta Industries', value: 180000, status: 'Shipped' },
        { id: 'ORD-2025-009', date: '2025-01-23', customer: 'Gamma Solutions', value: 420000, status: 'Processing' },
        { id: 'ORD-2025-015', date: '2025-01-28', customer: 'Delta Group', value: 110000, status: 'Confirmed' },
    ];

    return (
        <ReportDetailPage
            title="Salesperson Performance"
            description="Detailed order history for salesperson"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Sales', href: '/reports' },
                { label: 'Performance', href: '/reports/sales/performance' },
                { label: 'Salesperson' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <ClickableTableRow
                                    key={order.id}
                                    onClick={() => router.push(`/sales/orders/${order.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">₹{(order.value / 1000).toFixed(0)}K</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
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

export default function SalespersonPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SalespersonContent />
        </Suspense>
    );
}
