'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function WorkOrdersStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const workOrders = [
        { id: 'WO-2025-001', product: 'Industrial Server Rack', quantity: 50, startDate: '2025-01-15', dueDate: '2025-01-30', status: 'In Progress' },
        { id: 'WO-2025-002', product: 'Cooling Unit', quantity: 30, startDate: '2025-01-18', dueDate: '2025-02-05', status: 'Delayed' },
        { id: 'WO-2025-003', product: 'Power Distribution Unit', quantity: 100, startDate: '2025-01-20', dueDate: '2025-01-28', status: 'Completed' },
        { id: 'WO-2025-004', product: 'Control Panel', quantity: 15, startDate: '2025-01-22', dueDate: '2025-02-10', status: 'In Progress' },
        { id: 'WO-2025-005', product: 'Mounting Bracket', quantity: 500, startDate: '2025-01-25', dueDate: '2025-02-01', status: 'Pending' },
    ];

    const filteredWOs = status === 'All'
        ? workOrders
        : workOrders.filter(wo => {
            if (status === 'Active') return wo.status === 'In Progress' || wo.status === 'Delayed';
            return wo.status === status;
        });

    return (
        <ReportDetailPage
            title={`Work Orders: ${status}`}
            description={`List of work orders with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Production', href: '/reports' },
                { label: 'Work Orders', href: '/reports/production/work-orders' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Work Order List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WO ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWOs.map((wo) => (
                                <ClickableTableRow
                                    key={wo.id}
                                    onClick={() => router.push(`/production/work-orders/view/${wo.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{wo.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wo.product}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{wo.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wo.startDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wo.dueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${wo.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                wo.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                                                    wo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {wo.status}
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

export default function WorkOrdersStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WorkOrdersStatusContent />
        </Suspense>
    );
}
