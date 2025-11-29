'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function FleetStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const vehicles = [
        { id: 'VEH-001', vehicle: 'Truck - TRK-001', type: 'Delivery Truck', utilization: 92, mileage: 8500, fuel: 2100, status: 'Active' },
        { id: 'VEH-002', vehicle: 'Van - VAN-003', type: 'Cargo Van', utilization: 85, mileage: 6200, fuel: 1400, status: 'Active' },
        { id: 'VEH-003', vehicle: 'Truck - TRK-002', type: 'Delivery Truck', utilization: 78, mileage: 7100, fuel: 1850, status: 'Maintenance' },
        { id: 'VEH-004', vehicle: 'Van - VAN-001', type: 'Cargo Van', utilization: 65, mileage: 4800, fuel: 1100, status: 'Active' },
        { id: 'VEH-005', vehicle: 'Truck - TRK-003', type: 'Delivery Truck', utilization: 0, mileage: 0, fuel: 0, status: 'Maintenance' },
    ];

    const filteredVehicles = status === 'All'
        ? vehicles
        : vehicles.filter(v => v.status === status);

    return (
        <ReportDetailPage
            title={`Fleet: ${status}`}
            description={`List of vehicles with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Logistics', href: '/reports' },
                { label: 'Fleet Utilization', href: '/reports/logistics/fleet' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVehicles.map((vehicle) => (
                                <ClickableTableRow
                                    key={vehicle.id}
                                    onClick={() => router.push(`/logistics/fleet/${vehicle.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{vehicle.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{vehicle.utilization}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{vehicle.mileage.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {vehicle.status}
                                        </span>
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

export default function FleetStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FleetStatusContent />
        </Suspense>
    );
}
