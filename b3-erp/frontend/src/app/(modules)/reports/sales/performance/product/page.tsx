'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function SalesProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const title = productId ? `Product Sales: ${productId}` : 'Product Sales Performance';

    const orders = [
        { id: 'ORD-2025-001', date: '2025-01-15', customer: 'TechCorp Industries', quantity: 5, value: 150000, status: 'Delivered' },
        { id: 'ORD-2025-004', date: '2025-01-18', customer: 'Global Manufacturing', quantity: 12, value: 360000, status: 'Processing' },
        { id: 'ORD-2025-008', date: '2025-01-22', customer: 'BuildRight Construction', quantity: 3, value: 90000, status: 'Shipped' },
        { id: 'ORD-2025-012', date: '2025-01-25', customer: 'FastTrack Logistics', quantity: 8, value: 240000, status: 'Confirmed' },
    ];

    return (
        <ReportDetailPage
            title={title}
            description="Sales orders for this product"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Sales', href: '/reports' },
                { label: 'Performance', href: '/reports/sales/performance' },
                { label: 'Product' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
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
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">{order.quantity}</td>
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

export default function SalesProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SalesProductContent />
        </Suspense>
    );
}
