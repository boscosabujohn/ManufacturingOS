'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    DollarSign,
    AlertTriangle,
    ArrowRightLeft,
    Warehouse,
    TrendingUp,
    TrendingDown,
    Clock,
    Plus,
    BoxIcon,
    BarChart3,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { inventoryService } from '@/services/InventoryService';
import { stockTransferService, TransferStatus } from '@/services/stock-transfer.service';
import { warehouseService } from '@/services/warehouse.service';

interface InventoryStats {
    totalStockItems: number;
    totalInventoryValue: number;
    itemsBelowReorder: number;
    pendingTransfers: number;
    activeWarehouses: number;
    classAItems: number;
}

interface InventoryAlert {
    type: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
    time: string;
}

export default function InventoryDashboard() {
    const [stats, setStats] = useState<InventoryStats>({
        totalStockItems: 0,
        totalInventoryValue: 0,
        itemsBelowReorder: 0,
        pendingTransfers: 0,
        activeWarehouses: 0,
        classAItems: 0,
    });
    const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInventoryStats();
    }, []);

    const fetchInventoryStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch data from all services in parallel
            const [
                stockBalances,
                valuationReport,
                reorderAnalysis,
                agingReport,
                abcAnalysis,
                inTransitTransfers,
                activeWarehouses,
            ] = await Promise.all([
                inventoryService.getStockBalances().catch(() => []),
                inventoryService.getValuationReport().catch(() => ({ reportDate: '', totalValue: 0, itemCount: 0, byCategory: [] })),
                inventoryService.getReorderAnalysis().catch(() => ({ reportDate: '', itemsBelowReorder: [] })),
                inventoryService.getAgingReport().catch(() => ({ reportDate: '', agingBuckets: [] })),
                inventoryService.getABCAnalysis().catch(() => ({ reportDate: '', aClass: { count: 0, value: 0, percentage: 0 }, bClass: { count: 0, value: 0, percentage: 0 }, cClass: { count: 0, value: 0, percentage: 0 } })),
                stockTransferService.getInTransit().catch(() => []),
                warehouseService.getActiveWarehouses().catch(() => []),
            ]);

            // Calculate items below reorder level
            const belowReorderCount = reorderAnalysis.itemsBelowReorder?.length ||
                stockBalances.filter(item => item.belowReorderLevel).length;

            setStats({
                totalStockItems: valuationReport.itemCount || stockBalances.length,
                totalInventoryValue: valuationReport.totalValue || 0,
                itemsBelowReorder: belowReorderCount,
                pendingTransfers: inTransitTransfers.length,
                activeWarehouses: activeWarehouses.length,
                classAItems: abcAnalysis.aClass?.count || 0,
            });

            // Generate alerts based on real data
            const newAlerts: InventoryAlert[] = [];

            // Check for items below reorder level
            if (belowReorderCount > 0) {
                newAlerts.push({
                    type: 'Low Stock',
                    message: `${belowReorderCount} item(s) below reorder level`,
                    severity: belowReorderCount > 10 ? 'high' : 'medium',
                    time: 'Action required',
                });
            }

            // Check for pending transfers
            if (inTransitTransfers.length > 0) {
                const urgentTransfers = inTransitTransfers.filter(
                    t => t.status === TransferStatus.IN_TRANSIT || t.status === TransferStatus.DISPATCHED
                );
                if (urgentTransfers.length > 0) {
                    newAlerts.push({
                        type: 'Transfer',
                        message: `${urgentTransfers.length} transfer(s) in transit`,
                        severity: 'low',
                        time: 'In progress',
                    });
                }
            }

            // Check aging buckets for old stock
            const agingBuckets = agingReport.agingBuckets || [];
            const oldStockBucket = agingBuckets.find(bucket =>
                bucket.range?.includes('90') || bucket.range?.includes('180')
            );
            if (oldStockBucket && oldStockBucket.count > 0) {
                newAlerts.push({
                    type: 'Aging Stock',
                    message: `${oldStockBucket.count} item(s) with aging stock (${oldStockBucket.range})`,
                    severity: 'medium',
                    time: 'Review recommended',
                });
            }

            setAlerts(newAlerts.length > 0 ? newAlerts : [
                { type: 'System', message: 'All inventory metrics within targets', severity: 'low', time: 'Now' }
            ]);

        } catch (err) {
            console.error('Failed to fetch inventory stats:', err);
            setError('Failed to load inventory statistics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <div className="w-full p-3 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Loading inventory dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchInventoryStats}
                        className="mt-2 text-sm text-red-700 underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-3">
            {/* Header */}
            <div className="mb-3">
                <h1 className="text-3xl font-bold mb-2">Inventory Dashboard</h1>
                <p className="text-gray-600">Monitor stock levels, transfers, and inventory health</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Stock Items</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStockItems.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">Across all warehouses</p>
                        <Link href="/inventory/stock/all" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View all stock →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Inventory Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalInventoryValue)}</div>
                        <p className="text-xs text-gray-500 mt-1">Current valuation</p>
                        <Link href="/inventory/analytics/valuation" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View valuation →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Below Reorder Level</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.itemsBelowReorder}</div>
                        <p className="text-xs text-gray-500 mt-1">Items need reordering</p>
                        <Link href="/inventory/replenishment/reorder-points" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View low stock →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending Transfers</CardTitle>
                        <ArrowRightLeft className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingTransfers}</div>
                        <p className="text-xs text-gray-500 mt-1">In transit / dispatched</p>
                        <Link href="/inventory/transfers/in-transit" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View transfers →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Warehouses</CardTitle>
                        <Warehouse className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.activeWarehouses}</div>
                        <p className="text-xs text-gray-500 mt-1">Operational warehouses</p>
                        <Link href="/inventory/warehouse/all" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View warehouses →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Class A Items</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.classAItems}</div>
                        <p className="text-xs text-gray-500 mt-1">High-value inventory</p>
                        <Link href="/inventory/analytics/abc" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                            View ABC analysis →
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/inventory/items/new">
                        <CardContent className="pt-6">
                            <Plus className="h-8 w-8 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Add Stock Item</h3>
                            <p className="text-sm text-gray-600">Create new inventory item</p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/inventory/movements/new">
                        <CardContent className="pt-6">
                            <BoxIcon className="h-8 w-8 text-green-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Record Movement</h3>
                            <p className="text-sm text-gray-600">Log stock in/out</p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/inventory/transfers/new">
                        <CardContent className="pt-6">
                            <ArrowRightLeft className="h-8 w-8 text-orange-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Create Transfer</h3>
                            <p className="text-sm text-gray-600">Move between warehouses</p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/inventory/analytics/dashboard">
                        <CardContent className="pt-6">
                            <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">View Analytics</h3>
                            <p className="text-sm text-gray-600">Inventory insights</p>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            {/* Recent Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {alerts.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                <p>No inventory alerts at this time</p>
                            </div>
                        ) : (
                            alerts.map((alert, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    {alert.severity === 'high' ? (
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    ) : alert.severity === 'medium' ? (
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{alert.message}</p>
                                            <Badge variant="outline">{alert.type}</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
