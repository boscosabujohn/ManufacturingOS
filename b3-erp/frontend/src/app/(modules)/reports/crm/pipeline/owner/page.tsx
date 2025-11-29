'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

export default function PipelineByOwnerDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner') || 'All';

    const opportunities = [
        { id: 'OPP-001', name: 'Office Expansion', account: 'Acme Corp', owner: 'Sarah Johnson', stage: 'Proposal', value: 120000 },
        { id: 'OPP-002', name: 'New Machinery', account: 'Industrial Ltd', owner: 'Mike Smith', stage: 'Negotiation', value: 450000 },
        { id: 'OPP-003', name: 'Software License', account: 'Tech Start', owner: 'Sarah Johnson', stage: 'Qualification', value: 25000 },
        { id: 'OPP-004', name: 'Consulting Project', account: 'Global Services', owner: 'Mike Smith', stage: 'Proposal', value: 85000 },
        { id: 'OPP-005', name: 'Maintenance Contract', account: 'City Infra', owner: 'Sarah Johnson', stage: 'Closed Won', value: 200000 },
    ];

    const filteredOpps = owner === 'All' ? opportunities : opportunities.filter(o => o.owner === owner);

    return (
        <ReportDetailPage
            title={`Pipeline - ${owner}`}
            description={`Opportunities owned by ${owner}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'CRM', href: '/reports' },
                { label: 'Pipeline Analysis', href: '/reports/crm/pipeline' },
                { label: owner },
            ]}
            onBack={() => router.back()}
            onExport={() => console.log('Export')}
        >
            <Card>
                <CardHeader><CardTitle>Opportunities List</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Opportunity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Account</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Owner</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Stage</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredOpps.map((opp) => (
                                <ClickableTableRow
                                    key={opp.id}
                                    onClick={() => router.push(`/crm/opportunities/view/${opp.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{opp.name}</td>
                                    <td className="px-4 py-3 text-sm">{opp.account}</td>
                                    <td className="px-4 py-3 text-sm">{opp.owner}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant="outline">{opp.stage}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-bold">${opp.value.toLocaleString()}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}
