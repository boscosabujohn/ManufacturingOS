'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportDetailPage from '@/components/reports/ReportDetailPage';
import ClickableTableRow from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

function AttendanceByDepartmentContent() {
    const searchParams = useSearchParams();
    const department = searchParams.get('department') || 'All Departments';

    // Mock data for the list
    const attendanceData = [
        {
            id: '1',
            employeeId: 'EMP001',
            name: 'John Doe',
            department: 'Production',
            checkIn: '08:55 AM',
            checkOut: '05:00 PM',
            status: 'Present',
            hours: '8h 5m',
        },
        {
            id: '2',
            employeeId: 'EMP002',
            name: 'Jane Smith',
            department: 'Production',
            checkIn: '09:10 AM',
            checkOut: '05:15 PM',
            status: 'Late',
            hours: '8h 5m',
        },
        {
            id: '3',
            employeeId: 'EMP003',
            name: 'Bob Johnson',
            department: 'Engineering',
            checkIn: '-',
            checkOut: '-',
            status: 'Absent',
            hours: '0h',
        },
        {
            id: '4',
            employeeId: 'EMP004',
            name: 'Alice Brown',
            department: 'Sales',
            checkIn: '08:45 AM',
            checkOut: '05:30 PM',
            status: 'Present',
            hours: '8h 45m',
        },
        {
            id: '5',
            employeeId: 'EMP005',
            name: 'Charlie Davis',
            department: 'Production',
            checkIn: '09:00 AM',
            checkOut: '01:00 PM',
            status: 'Half Day',
            hours: '4h',
        },
    ];

    // Filter data based on department
    const filteredData = department === 'All Departments'
        ? attendanceData
        : attendanceData.filter(item => item.department === department);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800';
            case 'Absent': return 'bg-red-100 text-red-800';
            case 'Late': return 'bg-yellow-100 text-yellow-800';
            case 'Half Day': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ReportDetailPage
            title={`Attendance - ${department}`}
            description="Detailed attendance records by department"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'HR', href: '/reports/hr' },
                { label: 'Attendance', href: '/reports/hr/attendance' },
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
                                <th className="px-3 py-2">Check In</th>
                                <th className="px-3 py-2">Check Out</th>
                                <th className="px-3 py-2">Hours</th>
                                <th className="px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((record) => (
                                <ClickableTableRow
                                    key={record.id}
                                    id={record.id}
                                    basePath="/hr/attendance/view"
                                >
                                    <td className="px-3 py-2 font-medium text-gray-900">{record.employeeId}</td>
                                    <td className="px-3 py-2">{record.name}</td>
                                    <td className="px-3 py-2">{record.department}</td>
                                    <td className="px-3 py-2">{record.checkIn}</td>
                                    <td className="px-3 py-2">{record.checkOut}</td>
                                    <td className="px-3 py-2">{record.hours}</td>
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

export default function AttendanceByDepartmentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AttendanceByDepartmentContent />
        </Suspense>
    );
}
