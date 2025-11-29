'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, AlertTriangle, Clock, XCircle, CheckCircle, Filter } from 'lucide-react';
import Link from 'next/link';

interface NCR {
    id: string;
    ncrNumber: string;
    title: string;
    source: string;
    severity: string;
    status: string;
    reportedBy: string;
    reportedDate: string;
    assignedTo?: string;
    description: string;
}

export default function NCRPage() {
    const [ncrs, setNcrs] = useState<NCR[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNCRs();
    }, []);

    const fetchNCRs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/quality/non-conformance');
            const data = await response.json();
            if (data.success) {
                setNcrs(data.data);
            } else {
                // Mock data
                setNcrs([
                    {
                        id: '1',
                        ncrNumber: 'NCR-2025-001',
                        title: 'Dimensional deviation in steel frame',
                        source: 'Inspection',
                        severity: 'major',
                        status: 'open',
                        reportedBy: 'John Doe',
                        reportedDate: '2025-01-15',
                        assignedTo: 'Jane Smith',
                        description: 'Frame assembly showing 2mm deviation from specification',
                    },
                    {
                        id: '2',
                        ncrNumber: 'NCR-2025-002',
                        title: 'Surface finish quality issue',
                        source: 'Customer Complaint',
                        severity: 'minor',
                        status: 'in-progress',
                        reportedBy: 'Bob Johnson',
                        reportedDate: '2025-01-14',
                        assignedTo: 'Mike Wilson',
                        description: 'Customer reported coating unevenness on delivered parts',
                    },
                    {
                        id: '3',
                        ncrNumber: 'NCR-2025-003',
                        title: 'Missing documentation',
                        source: 'Audit',
                        severity: 'critical',
                        status: 'closed',
                        reportedBy: 'Alice Brown',
                        reportedDate: '2025-01-10',
                        assignedTo: 'Tom Davis',
                        description: 'Test certificates not available for batch LOT-2024-500',
                    },
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch NCRs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityBadge = (severity: string) => {
        const config: Record<string, { color: string; icon: any }> = {
            critical: { color: 'bg-red-500', icon: XCircle },
            major: { color: 'bg-orange-500', icon: AlertTriangle },
            minor: { color: 'bg-yellow-500', icon: Clock },
        };
        const { color, icon: Icon } = config[severity] || config.minor;
        return (
            <Badge className={color}>
                <Icon className="mr-1 h-3 w-3" />
                {severity}
            </Badge>
        );
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            open: 'bg-red-500',
            'in-progress': 'bg-yellow-500',
            closed: 'bg-green-500',
        };
        return <Badge className={colors[status] || 'bg-gray-500'}>{status}</Badge>;
    };

    const filteredNCRs = filter === 'all' ? ncrs : ncrs.filter(n => n.status === filter);

    const stats = {
        total: ncrs.length,
        open: ncrs.filter(n => n.status === 'open').length,
        inProgress: ncrs.filter(n => n.status === 'in-progress').length,
        closed: ncrs.filter(n => n.status === 'closed').length,
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Non-Conformance Reports (NCR)</h1>
                    <p className="text-gray-600">Track and manage quality issues</p>
                </div>
                <Link href="/quality/ncr/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Report NCR
                    </Button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-gray-500 mt-1">Total NCRs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-600">{stats.open}</div>
                        <p className="text-xs text-gray-500 mt-1">Open</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                        <p className="text-xs text-gray-500 mt-1">In Progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
                        <p className="text-xs text-gray-500 mt-1">Closed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['all', 'open', 'in-progress', 'closed'].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        onClick={() => setFilter(status)}
                        size="sm"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </Button>
                ))}
            </div>

            {/* NCR List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12">Loading NCRs...</div>
                ) : filteredNCRs.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">No NCRs found</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNCRs.map((ncr) => (
                        <Card key={ncr.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{ncr.ncrNumber}</h3>
                                            {getSeverityBadge(ncr.severity)}
                                            {getStatusBadge(ncr.status)}
                                        </div>
                                        <p className="text-gray-900 font-medium mb-2">{ncr.title}</p>
                                        <p className="text-sm text-gray-600 mb-3">{ncr.description}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Source:</span>
                                                <p className="font-medium">{ncr.source}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Reported By:</span>
                                                <p className="font-medium">{ncr.reportedBy}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Reported Date:</span>
                                                <p className="font-medium">{new Date(ncr.reportedDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Assigned To:</span>
                                                <p className="font-medium">{ncr.assignedTo || 'Unassigned'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/quality/ncr/${ncr.id}`}>
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
