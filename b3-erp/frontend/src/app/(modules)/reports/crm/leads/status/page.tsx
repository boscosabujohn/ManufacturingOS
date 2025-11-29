'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Badge } from '@/components/ui/badge';

export default function LeadsByStatusDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const leads = [
        { id: 'LEAD-001', name: 'John Smith', company: 'Tech Solutions', source: 'Website', status: 'Qualified', value: 45000 },
        { id: 'LEAD-002', name: 'Sarah Jones', company: 'Global Corp', source: 'LinkedIn', status: 'New', value: 25000 },
        { id: 'LEAD-003', name: 'Mike Brown', company: 'Local Retail', source: 'Referral', status: 'Contacted', value: 15000 },
        { id: 'LEAD-004', name: 'Emily Davis', company: 'Design Studio', source: 'Website', status: 'Proposal', value: 60000 },
        { id: 'LEAD-005', name: 'David Wilson', company: 'BuildIt Inc', source: 'Trade Show', status: 'New', value: 80000 },
    ];

    const filteredLeads = status === 'All' ? leads : leads.filter(l => l.status === status);

    return (
        <ReportDetailPage
            title={`Leads - ${status}`}
            description={`List of leads with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'CRM', href: '/reports' },
                { label: 'Lead Analysis', href: '/reports/crm/leads' },
                { label: status },
            ]}
            onBack={() => router.back()}
            onExport={() => console.log('Export')}
        >
            <Card>
                <CardHeader><CardTitle>Leads List</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Lead Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Company</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Source</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Est. Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredLeads.map((lead) => (
                                <ClickableTableRow
                                    key={lead.id}
                                    onClick={() => router.push(`/crm/leads/view/${lead.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{lead.name}</td>
                                    <td className="px-4 py-3 text-sm">{lead.company}</td>
                                    <td className="px-4 py-3 text-sm">{lead.source}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant="outline">{lead.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-bold">${lead.value.toLocaleString()}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}
