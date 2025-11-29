'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function WorkCenterContent() {
    const router = useRouter();

    const workCenters = [
        { id: 'WC-001', name: 'CNC Machining', oee: 88, availability: 95, performance: 90, quality: 98, status: 'Active' },
        { id: 'WC-002', name: 'Assembly Line 1', oee: 82, availability: 88, performance: 85, quality: 95, status: 'Active' },
        { id: 'WC-003', name: 'Paint Shop', oee: 75, availability: 80, performance: 82, quality: 92, status: 'Maintenance' },
        { id: 'WC-004', name: 'Welding Station', oee: 90, availability: 96, performance: 92, quality: 98, status: 'Active' },
    ];

    return (
        <ReportDetailPage
            title="Work Center Performance"
            description="Detailed OEE metrics by work center"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Production', href: '/reports' },
                { label: 'Performance', href: '/reports/production/performance' },
                { label: 'Work Centers' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Work Center Metrics</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Center ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">OEE</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {workCenters.map((wc) => (
                                <ClickableTableRow
                                    key={wc.id}
                                    onClick={() => router.push(`/production/work-centers/${wc.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{wc.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wc.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">{wc.oee}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{wc.availability}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{wc.performance}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{wc.quality}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${wc.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {wc.status}
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

export default function WorkCenterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WorkCenterContent />
        </Suspense>
    );
}
