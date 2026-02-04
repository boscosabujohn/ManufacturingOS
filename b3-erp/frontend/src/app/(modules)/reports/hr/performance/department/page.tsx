'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportDetailPage from '@/components/reports/ReportDetailPage';
import ClickableTableRow from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

function PerformanceByDepartmentContent() {
    const searchParams = useSearchParams();
    const department = searchParams.get('department') || 'All Departments';

    // Mock data for the list
    const performanceData = [
        {
            id: '1',
            employeeId: 'EMP001',
            name: 'John Doe',
            department: 'Production',
            role: 'Operator',
            rating: 4.5,
            lastReview: '2025-10-15',
            status: 'Excellent',
        },
        {
            id: '2',
            employeeId: 'EMP002',
            name: 'Jane Smith',
            department: 'Production',
            role: 'Supervisor',
            rating: 4.8,
            lastReview: '2025-10-15',
            status: 'Outstanding',
        },
        {
            id: '3',
            employeeId: 'EMP003',
            name: 'Bob Johnson',
            department: 'Engineering',
            role: 'Engineer',
            rating: 3.8,
            lastReview: '2025-09-20',
            status: 'Good',
        },
        {
            id: '4',
            employeeId: 'EMP004',
            name: 'Alice Brown',
            department: 'Sales',
            role: 'Sales Rep',
            rating: 4.2,
            lastReview: '2025-10-01',
            status: 'Very Good',
        },
        {
            id: '5',
            employeeId: 'EMP005',
            name: 'Charlie Davis',
            department: 'Production',
            role: 'Operator',
            rating: 3.0,
            lastReview: '2025-08-15',
            status: 'Average',
        },
    ];

    // Filter data based on department
    const filteredData = department === 'All Departments'
        ? performanceData
        : performanceData.filter(item => item.department === department);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Outstanding': return 'bg-purple-100 text-purple-800';
            case 'Excellent': return 'bg-green-100 text-green-800';
            case 'Very Good': return 'bg-blue-100 text-blue-800';
            case 'Good': return 'bg-yellow-100 text-yellow-800';
            case 'Average': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ReportDetailPage
            title={`Performance - ${department}`}
            description="Employee performance ratings by department"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'HR', href: '/reports/hr' },
                { label: 'Performance', href: '/reports/hr/performance' },
                { label: department }
            ]}
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 py-2">Employee ID</th>
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Department</th>
                                <th className="px-3 py-2">Role</th>
                                <th className="px-3 py-2">Rating</th>
                                <th className="px-3 py-2">Last Review</th>
                                <th className="px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((record) => (
                                <ClickableTableRow
                                    key={record.id}
                                    id={record.id}
                                    basePath="/hr/employees/view"
                                >
                                    <td className="px-3 py-2 font-medium text-gray-900">{record.employeeId}</td>
                                    <td className="px-3 py-2">{record.name}</td>
                                    <td className="px-3 py-2">{record.department}</td>
                                    <td className="px-3 py-2">{record.role}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center">
                                            <span className="mr-1 font-medium">{record.rating}</span>
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">{record.lastReview}</td>
                                    <td className="px-3 py-2">
                                        <Badge className={getStatusColor(record.status)}>
                                            {record.status}
                                        </Badge>
                                    </td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ReportDetailPage>
    );
}

export default function PerformanceByDepartmentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PerformanceByDepartmentContent />
        </Suspense>
    );
}
