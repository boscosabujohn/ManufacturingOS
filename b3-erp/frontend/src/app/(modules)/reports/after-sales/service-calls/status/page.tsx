'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function ServiceCallStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const calls = [
        { id: 'SR-2025-001', customer: 'TechCorp Industries', issue: 'Conveyor Belt Jam', priority: 'High', assignedTo: 'Mike Technician', reported: '2025-03-10', status: 'Open' },
        { id: 'SR-2025-002', customer: 'Global Manufacturing', issue: 'Sensor Calibration', priority: 'Medium', assignedTo: 'Sarah Engineer', reported: '2025-03-09', status: 'In Progress' },
        { id: 'SR-2025-003', customer: 'AutoParts Ltd', issue: 'Motor Overheating', priority: 'Critical', assignedTo: 'John Expert', reported: '2025-03-08', status: 'Resolved' },
        { id: 'SR-2025-004', customer: 'SteelWorks Inc', issue: 'Software Glitch', priority: 'Low', assignedTo: 'David Support', reported: '2025-03-05', status: 'Closed' },
        { id: 'SR-2025-005', customer: 'PlasticFab Co', issue: 'Hydraulic Leak', priority: 'High', assignedTo: 'Mike Technician', reported: '2025-03-11', status: 'Open' },
    ];

    const filteredCalls = status === 'All'
        ? calls
        : calls.filter(c => c.status === status);

    return (
        <ReportDetailPage
            title={`Service Calls: ${status}`}
            description={`List of service calls with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'After-Sales', href: '/reports' },
                { label: 'Service Calls', href: '/reports/after-sales/service-calls' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Service Call List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCalls.map((call) => (
                                <ClickableTableRow
                                    key={call.id}
                                    onClick={() => router.push(`/after-sales/service-calls/${call.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{call.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{call.customer}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{call.issue}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        <Badge className={call.priority === 'Critical' ? 'bg-red-600' : call.priority === 'High' ? 'bg-orange-600' : call.priority === 'Medium' ? 'bg-blue-600' : 'bg-gray-600'}>
                                            {call.priority}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{call.assignedTo}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        <Badge variant={call.status === 'Open' ? 'destructive' : call.status === 'Resolved' ? 'default' : 'secondary'}>
                                            {call.status}
                                        </Badge>
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

export default function ServiceCallStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServiceCallStatusContent />
        </Suspense>
    );
}
