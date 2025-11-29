'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function ResourceRoleContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const resources = [
        { id: 'EMP-001', name: 'John Smith', role: 'Project Manager', project: 'Factory Automation', hours: 160, utilization: 100, status: 'Allocated' },
        { id: 'EMP-002', name: 'Sarah Jones', role: 'System Architect', project: 'ERP Upgrade', hours: 140, utilization: 88, status: 'Allocated' },
        { id: 'EMP-003', name: 'Mike Brown', role: 'Developer', project: 'Warehouse Expansion', hours: 120, utilization: 75, status: 'Allocated' },
        { id: 'EMP-004', name: 'Emily Davis', role: 'QA Engineer', project: 'Quality System', hours: 160, utilization: 100, status: 'Allocated' },
        { id: 'EMP-005', name: 'David Wilson', role: 'Developer', project: 'None', hours: 0, utilization: 0, status: 'Available' },
        { id: 'EMP-006', name: 'Lisa Taylor', role: 'Designer', project: 'None', hours: 0, utilization: 0, status: 'Available' },
    ];

    const filteredResources = status === 'All'
        ? resources
        : resources.filter(r => r.status === status);

    return (
        <ReportDetailPage
            title={`Resources: ${status}`}
            description={`List of resources with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Project Management', href: '/reports' },
                { label: 'Resource Allocation', href: '/reports/project-management/resources' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Resource List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Project</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredResources.map((resource) => (
                                <ClickableTableRow
                                    key={resource.id}
                                    onClick={() => router.push(`/hr/employees/view/${resource.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{resource.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.project}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{resource.hours}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full ${resource.utilization >= 90 ? 'bg-red-500' : resource.utilization >= 75 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${resource.utilization}%` }} />
                                            </div>
                                            <span className="text-xs font-medium">{resource.utilization}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Badge variant={resource.status === 'Allocated' ? 'default' : 'secondary'}>
                                            {resource.status}
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

export default function ResourceRolePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResourceRoleContent />
        </Suspense>
    );
}
