'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Truck, Users, DollarSign } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function FleetUtilizationReport() {
    const router = useRouter();
    const data = {
        totalVehicles: 24,
        avgUtilization: 78.5,
        totalMileage: 125000,
        maintenanceCost: 45000,
        vehicles: [
            { id: 'VEH-001', vehicle: 'Truck - TRK-001', type: 'Delivery Truck', utilization: 92, mileage: 8500, fuel: 2100, status: 'Active' },
            { id: 'VEH-002', vehicle: 'Van - VAN-003', type: 'Cargo Van', utilization: 85, mileage: 6200, fuel: 1400, status: 'Active' },
            { id: 'VEH-003', vehicle: 'Truck - TRK-002', type: 'Delivery Truck', utilization: 78, mileage: 7100, fuel: 1850, status: 'Maintenance' },
            { id: 'VEH-004', vehicle: 'Van - VAN-001', type: 'Cargo Van', utilization: 65, mileage: 4800, fuel: 1100, status: 'Active' },
        ],
    };

    return (
        <div className="w-full p-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Fleet Utilization Report</h1>
                    <p className="text-gray-600">Vehicle fleet performance tracking</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <ClickableKPICard
                    title="Total Vehicles"
                    value={data.totalVehicles.toString()}
                    color="blue"
                    onClick={() => router.push('/reports/logistics/fleet/status?status=All')}
                />
                <ClickableKPICard
                    title="Avg Utilization"
                    value={`${data.avgUtilization}%`}
                    color={data.avgUtilization >= 75 ? 'green' : 'orange'}
                />
                <ClickableKPICard
                    title="Total Mileage"
                    value={data.totalMileage.toLocaleString()}
                    color="blue"
                />
                <ClickableKPICard
                    title="Maintenance Cost"
                    value={`$${(data.maintenanceCost / 1000).toFixed(0)}K`}
                    color="orange"
                    onClick={() => router.push('/reports/logistics/fleet/status?status=Maintenance')}
                />
            </div>

            <Card>
                <CardHeader><CardTitle>Fleet Performance</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Vehicle</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Utilization</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Mileage</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Fuel Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data.vehicles.map((vehicle) => (
                                <ClickableTableRow
                                    key={vehicle.id}
                                    onClick={() => router.push(`/logistics/fleet/${vehicle.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{vehicle.vehicle}</td>
                                    <td className="px-4 py-3 text-sm">{vehicle.type}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${vehicle.utilization >= 80 ? 'bg-green-600' : 'bg-orange-600'}`} style={{ width: `${vehicle.utilization}%` }} />
                                            </div>
                                            <span className="text-sm font-semibold">{vehicle.utilization}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">{vehicle.mileage.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold">${vehicle.fuel}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
