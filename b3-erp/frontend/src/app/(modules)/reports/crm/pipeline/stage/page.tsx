'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

export default function PipelineByStageDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stage = searchParams.get('stage') || 'All';

    const opportunities = [
        { id: 'OPP-001', name: 'Office Expansion', account: 'Acme Corp', stage: 'Proposal', value: 120000, probability: 60 },
        { id: 'OPP-002', name: 'New Machinery', account: 'Industrial Ltd', stage: 'Negotiation', value: 450000, probability: 80 },
        { id: 'OPP-003', name: 'Software License', account: 'Tech Start', stage: 'Qualification', value: 25000, probability: 40 },
        { id: 'OPP-004', name: 'Consulting Project', account: 'Global Services', stage: 'Proposal', value: 85000, probability: 50 },
        { id: 'OPP-005', name: 'Maintenance Contract', account: 'City Infra', stage: 'Closed Won', value: 200000, probability: 100 },
    ];

    const filteredOpps = stage === 'All' ? opportunities : opportunities.filter(o => o.stage === stage);

    return (
        <ReportDetailPage
            title={`Pipeline - ${stage}`}
            description={`Opportunities in ${stage} stage`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'CRM', href: '/reports' },
                { label: 'Pipeline Analysis', href: '/reports/crm/pipeline' },
                { label: stage },
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
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Stage</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Probability</th>
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
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant="outline">{opp.stage}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm">{opp.probability}%</td>
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
