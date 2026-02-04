'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function SalesPerformanceReport() {
    const router = useRouter();

    const data = {
        totalRevenue: 4500000,
        totalOrders: 145,
        avgOrderValue: 31000,
        topProducts: [
            { id: 'PROD-001', name: 'Industrial Server Rack', revenue: 1200000, units: 45 },
            { id: 'PROD-002', name: 'Cooling Unit', revenue: 850000, units: 28 },
            { id: 'PROD-003', name: 'Power Distribution Unit', revenue: 650000, units: 120 },
        ],
        topSalespeople: [
            { id: 'EMP-001', name: 'John Doe', revenue: 1500000, orders: 45 },
            { id: 'EMP-002', name: 'Jane Smith', revenue: 1200000, orders: 38 },
        ],
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Sales Performance</h1>
                    <p className="text-gray-600">Revenue and order analysis - Click cards to drill down</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Revenue"
                    value={`₹${(data.totalRevenue / 100000).toFixed(1)}L`}
                    color="green"
                    description="Click for details"
                    onClick={() => router.push('/reports/sales/orders/status?status=Confirmed')}
                />
                <ClickableKPICard
                    title="Total Orders"
                    value={data.totalOrders.toString()}
                    color="blue"
                    description="Click for details"
                    onClick={() => router.push('/reports/sales/orders/status?status=All')}
                />
                <ClickableKPICard
                    title="Sales Team"
                    value="4 Active"
                    color="purple"
                    description="Click for performance"
                    onClick={() => router.push('/reports/sales/performance/salesperson')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Top Products by Revenue</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Units</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.topProducts.map((prod) => (
                                    <ClickableTableRow
                                        key={prod.id}
                                        onClick={() => router.push(`/reports/sales/performance/product?id=${prod.id}`)}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{prod.name}</td>
                                        <td className="px-4 py-3 text-sm text-right">{prod.units}</td>
                                        <td className="px-4 py-3 text-sm text-right font-bold">₹{(prod.revenue / 1000).toFixed(0)}K</td>
                                    </ClickableTableRow>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Top Salespeople</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Orders</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.topSalespeople.map((person) => (
                                    <ClickableTableRow
                                        key={person.id}
                                        onClick={() => router.push(`/reports/sales/performance/salesperson`)}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{person.name}</td>
                                        <td className="px-4 py-3 text-sm text-right">{person.orders}</td>
                                        <td className="px-4 py-3 text-sm text-right font-bold">₹{(person.revenue / 1000).toFixed(0)}K</td>
                                    </ClickableTableRow>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
