'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportDetailPage from '@/components/reports/ReportDetailPage';
import ClickableTableRow from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

function NCRByStatusContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All Statuses';

    // Mock data
    const ncrs = [
        {
            id: 'NCR-2025-008',
            issue: 'Dimensional variance',
            severity: 'Major',
            status: 'Open',
            raisedBy: 'Mike Ross',
            date: '2025-10-20',
            age: 5
        },
        {
            id: 'NCR-2025-007',
            issue: 'Surface defect',
            severity: 'Minor',
            status: 'CAPA Initiated',
            raisedBy: 'Rachel Zane',
            date: '2025-10-17',
            age: 8
        },
        {
            id: 'NCR-2025-006',
            issue: 'Weld quality',
            severity: 'Critical',
            status: 'CAPA Initiated',
            raisedBy: 'Harvey Specter',
            date: '2025-10-13',
            age: 12
        },
        {
            id: 'NCR-2025-005',
            issue: 'Incorrect material',
            severity: 'Major',
            status: 'Closed',
            raisedBy: 'Mike Ross',
            date: '2025-10-10',
            age: 15
        },
        {
            id: 'NCR-2025-004',
            issue: 'Packaging damage',
            severity: 'Minor',
            status: 'Closed',
            raisedBy: 'Louis Litt',
            date: '2025-10-05',
            age: 20
        },
    ];

    // Filter data
    const filteredData = status === 'All Statuses'
        ? ncrs
        : ncrs.filter(item => item.status === status);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'Major': return 'bg-orange-100 text-orange-800';
            case 'Minor': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ReportDetailPage
            title={`NCRs - ${status}`}
            description={`Non-conformance reports with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Quality', href: '/reports' },
                { label: 'NCR & CAPA', href: '/reports/quality/ncr-capa' },
                { label: status }
            ]}
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 py-2">NCR ID</th>
                                <th className="px-3 py-2">Issue</th>
                                <th className="px-3 py-2">Severity</th>
                                <th className="px-3 py-2">Raised By</th>
                                <th className="px-3 py-2">Date</th>
                                <th className="px-3 py-2 text-center">Age (Days)</th>
                                <th className="px-3 py-2 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((record) => (
                                <ClickableTableRow
                                    key={record.id}
                                    id={record.id}
                                    basePath="/quality/ncr/view"
                                >
                                    <td className="px-3 py-2 font-medium text-gray-900">{record.id}</td>
                                    <td className="px-3 py-2">{record.issue}</td>
                                    <td className="px-3 py-2">
                                        <Badge className={getSeverityColor(record.severity)}>
                                            {record.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-2">{record.raisedBy}</td>
                                    <td className="px-3 py-2">{record.date}</td>
                                    <td className="px-3 py-2 text-center">{record.age}</td>
                                    <td className="px-3 py-2 text-center">
                                        <Badge variant="outline">
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

export default function NCRByStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NCRByStatusContent />
        </Suspense>
    );
}
