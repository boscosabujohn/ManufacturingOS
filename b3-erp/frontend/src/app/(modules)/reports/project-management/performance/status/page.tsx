'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function ProjectStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const projects = [
        { id: 'PRJ-001', name: 'Factory Automation Phase 2', budget: 2500000, actual: 2100000, progress: 85, schedule: 92, status: 'On Track', manager: 'John Doe' },
        { id: 'PRJ-002', name: 'ERP System Upgrade', budget: 850000, actual: 920000, progress: 95, schedule: 98, status: 'Over Budget', manager: 'Jane Smith' },
        { id: 'PRJ-003', name: 'Warehouse Expansion', budget: 1200000, actual: 1050000, progress: 88, schedule: 85, status: 'Delayed', manager: 'Mike Johnson' },
        { id: 'PRJ-004', name: 'Quality System ISO Cert', budget: 320000, actual: 280000, progress: 75, schedule: 78, status: 'On Track', manager: 'Sarah Wilson' },
        { id: 'PRJ-005', name: 'New Product Line Setup', budget: 1500000, actual: 200000, progress: 15, schedule: 100, status: 'On Track', manager: 'David Brown' },
    ];

    const filteredProjects = status === 'All'
        ? projects
        : projects.filter(p => p.status === status);

    return (
        <ReportDetailPage
            title={`Projects: ${status}`}
            description={`List of projects with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Project Management', href: '/reports' },
                { label: 'Performance', href: '/reports/project-management/performance' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Project List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.map((project) => (
                                <ClickableTableRow
                                    key={project.id}
                                    onClick={() => router.push(`/project-management/projects/${project.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{project.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{project.manager}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">${(project.budget / 1000).toFixed(0)}K</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
                                            </div>
                                            <span className="text-xs font-medium">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        <Badge className={project.status === 'On Track' ? 'bg-green-600' : project.status === 'Over Budget' ? 'bg-red-600' : 'bg-orange-600'}>
                                            {project.status}
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

export default function ProjectStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectStatusContent />
        </Suspense>
    );
}
