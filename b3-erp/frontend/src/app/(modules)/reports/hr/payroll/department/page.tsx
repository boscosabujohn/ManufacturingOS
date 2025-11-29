'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportDetailPage from '@/components/reports/ReportDetailPage';
import ClickableTableRow from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

function PayrollByDepartmentContent() {
    const searchParams = useSearchParams();
    const department = searchParams.get('department') || 'All Departments';

    // Mock data for the list
    const payrollData = [
        {
            id: '1',
            employeeId: 'EMP001',
            name: 'John Doe',
            department: 'Production',
            position: 'Operator',
            gross: 5000,
            deductions: 500,
            net: 4500,
            status: 'Paid',
        },
        {
            id: '2',
            employeeId: 'EMP002',
            name: 'Jane Smith',
            department: 'Production',
            position: 'Supervisor',
            gross: 7000,
            deductions: 800,
            net: 6200,
            status: 'Paid',
        },
        {
            id: '3',
            employeeId: 'EMP003',
            name: 'Bob Johnson',
            department: 'Engineering',
            position: 'Engineer',
            gross: 8000,
            deductions: 1000,
            net: 7000,
            status: 'Processing',
        },
        {
            id: '4',
            employeeId: 'EMP004',
            name: 'Alice Brown',
            department: 'Sales',
            position: 'Sales Rep',
            gross: 6000,
            deductions: 600,
            net: 5400,
            status: 'Paid',
        },
        {
            id: '5',
            employeeId: 'EMP005',
            name: 'Charlie Davis',
            department: 'Production',
            position: 'Operator',
            gross: 4800,
            deductions: 480,
            net: 4320,
            status: 'Pending',
        },
    ];

    // Filter data based on department
    const filteredData = department === 'All Departments'
        ? payrollData
        : payrollData.filter(item => item.department === department);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ReportDetailPage
            title={`Payroll - ${department}`}
            description="Detailed payroll records by department"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'HR', href: '/reports/hr' },
                { label: 'Payroll', href: '/reports/hr/payroll' },
                { label: department }
            ]}
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Employee ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Position</th>
                                <th className="px-6 py-3 text-right">Gross Salary</th>
                                <th className="px-6 py-3 text-right">Deductions</th>
                                <th className="px-6 py-3 text-right">Net Salary</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((record) => (
                                <ClickableTableRow
                                    key={record.id}
                                    id={record.id}
                                    basePath="/hr/payroll/view"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">{record.employeeId}</td>
                                    <td className="px-6 py-4">{record.name}</td>
                                    <td className="px-6 py-4">{record.department}</td>
                                    <td className="px-6 py-4">{record.position}</td>
                                    <td className="px-6 py-4 text-right">${record.gross.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-red-600">${record.deductions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-medium text-green-600">${record.net.toLocaleString()}</td>
                                    <td className="px-6 py-4">
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

export default function PayrollByDepartmentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PayrollByDepartmentContent />
        </Suspense>
    );
}
