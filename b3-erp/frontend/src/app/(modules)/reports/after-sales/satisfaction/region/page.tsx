'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

function SatisfactionRegionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';
    const category = searchParams.get('category');
    const ratingFilter = searchParams.get('rating');

    const feedback = [
        { id: 'FB-2025-001', customer: 'TechCorp Industries', region: 'North America', category: 'Product Quality', rating: 5, comment: 'Excellent durability', date: '2025-03-10' },
        { id: 'FB-2025-002', customer: 'Global Manufacturing', region: 'Europe', category: 'Delivery Time', rating: 4, comment: 'Good, but slightly delayed', date: '2025-03-09' },
        { id: 'FB-2025-003', customer: 'AutoParts Ltd', region: 'Asia Pacific', category: 'Customer Service', rating: 5, comment: 'Outstanding support', date: '2025-03-08' },
        { id: 'FB-2025-004', customer: 'SteelWorks Inc', region: 'North America', category: 'Value for Money', rating: 3, comment: 'A bit pricey', date: '2025-03-05' },
        { id: 'FB-2025-005', customer: 'PlasticFab Co', region: 'Europe', category: 'After-Sales Support', rating: 2, comment: 'Slow response time', date: '2025-03-11' },
    ];

    let filteredFeedback = feedback;

    if (category) {
        filteredFeedback = filteredFeedback.filter(f => f.category === category);
    } else if (ratingFilter) {
        filteredFeedback = filteredFeedback.filter(f => f.rating === parseInt(ratingFilter));
    } else if (status === 'Promoter') {
        filteredFeedback = filteredFeedback.filter(f => f.rating >= 4);
    }

    const title = category ? `Satisfaction: ${category}` : ratingFilter ? `Satisfaction: ${ratingFilter} Stars` : `Satisfaction: ${status}`;

    return (
        <ReportDetailPage
            title={title}
            description={`Customer feedback details`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'After-Sales', href: '/reports' },
                { label: 'Customer Satisfaction', href: '/reports/after-sales/satisfaction' },
                { label: 'Details' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Feedback List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredFeedback.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/after-sales/feedback/${item.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.customer}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.region}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="font-semibold">{item.rating}</span>
                                            <Star className={`h-4 w-4 ${item.rating >= 4 ? 'fill-green-500 text-green-500' : item.rating >= 3 ? 'fill-yellow-500 text-yellow-500' : 'fill-red-500 text-red-500'}`} />
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}

export default function SatisfactionRegionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SatisfactionRegionContent />
        </Suspense>
    );
}
