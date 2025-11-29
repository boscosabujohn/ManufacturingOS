'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function OrdersStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const orders = [
        { id: 'ORD-2025-001', date: '2025-01-15', customer: 'TechCorp Industries', value: 150000, status: 'Delivered' },
        { id: 'ORD-2025-002', date: '2025-01-16', customer: 'Alpha Corp', value: 250000, status: 'Delivered' },
        { id: 'ORD-2025-003', date: '2025-01-17', customer: 'Beta Industries', value: 180000, status: 'Shipped' },
        { id: 'ORD-2025-004', date: '2025-01-18', customer: 'Global Manufacturing', value: 360000, status: 'Processing' },
        { id: 'ORD-2025-005', date: '2025-01-19', customer: 'Gamma Solutions', value: 420000, status: 'Shipped' },
        { id: 'ORD-2025-006', date: '2025-01-20', customer: 'Delta Group', value: 110000, status: 'Pending' },
    ];

    const filteredOrders = status === 'All'
        ? orders
        : orders.filter(o => {
            if (status === 'Pending') return o.status === 'Pending' || o.status === 'Processing';
            return o.status === status;
        });

    return (
        <ReportDetailPage
            title={`Orders: ${status}`}
            description={`List of orders with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Sales', href: '/reports' },
                { label: 'Order Fulfillment', href: '/reports/sales/orders' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <ClickableTableRow
                                    key={order.id}
                                    onClick={() => router.push(`/sales/orders/${order.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">₹{(order.value / 1000).toFixed(0)}K</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' || order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-blue-100 text-blue-800'
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

export default function OrdersStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrdersStatusContent />
        </Suspense>
    );
}
