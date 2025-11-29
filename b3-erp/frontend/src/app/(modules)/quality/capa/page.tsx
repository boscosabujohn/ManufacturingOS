'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Activity, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface CAPA {
    id: string;
    capaNumber: string;
    title: string;
    type: string;
    priority: string;
    status: string;
    owner: string;
    dueDate: string;
    progress: number;
    linkedNCR?: string;
}

export default function CAPAPage() {
    const [capas, setCapas] = useState<CAPA[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect() => {
        fetchCAPAs();
    }, []);

    const fetchCAPAs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/quality/capa');
            const data = await response.json();
            if (data.success) {
                setCapas(data.data);
            } else {
                // Mock data
                setCapas([
                    {
                        id: '1',
                        capaNumber: 'CAPA-2025-001',
                        title: 'Implement dimensional inspection jig',
                        type: 'corrective',
                        priority: 'high',
                        status: 'in-progress',
                        owner: 'Jane Smith',
                        dueDate: '2025-02-01',
                        progress: 60,
                        linkedNCR: 'NCR-2025-001',
                    },
                    {
                        id: '2',
                        capaNumber: 'CAPA-2025-002',
                        title: 'Upgrade coating process',
                        type: 'corrective',
                        priority: 'medium',
                        status: 'planned',
                        owner: 'Mike Wilson',
                        dueDate: '2025-02-15',
                        progress: 20,
                        linkedNCR: 'NCR-2025-002',
                    },
                    {
                        id: '3',
                        capaNumber: 'CAPA-2025-003',
                        title: 'Document control training',
                        type: 'preventive',
                        priority: 'high',
                        status: 'completed',
                        owner: 'Tom Davis',
                        dueDate: '2025-01-20',
                        progress: 100,
                        linkedNCR: 'NCR-2025-003',
                    },
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch CAPAs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            high: 'bg-red-500',
            medium: 'bg-yellow-500',
            low: 'bg-green-500',
        };
        return <Badge className={colors[priority] || 'bg-gray-500'}>{priority}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { color: string; icon: any }> = {
            planned: { color: 'bg-blue-500', icon: Clock },
            'in-progress': { color: 'bg-yellow-500', icon: Activity },
            completed: { color: 'bg-green-500', icon: CheckCircle },
            overdue: { color: 'bg-red-500', icon: AlertCircle },
        };
        const { color, icon: Icon } = config[status] || config.planned;
        return (
            <Badge className={color}>
                <Icon className="mr-1 h-3 w-3" />
                {status.replace('-', ' ')}
            </Badge>
        );
    };

    const filteredCAPAs = filter === 'all' ? capas : capas.filter(c => c.status === filter);

    const stats = {
        total: capas.length,
        active: capas.filter(c => c.status === 'in-progress').length,
        completed: capas.filter(c => c.status === 'completed').length,
        overdue: capas.filter(c => c.status === 'overdue').length,
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">CAPA Management</h1>
                    <p className="text-gray-600">Corrective & Preventive Actions</p>
                </div>
                <Link href="/quality/capa/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create CAPA
                    </Button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total CAPAs</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-gray-500 mt-1">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
                        <p className="text-xs text-gray-500 mt-1">In progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <p className="text-xs text-gray-500 mt-1">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                        <p className="text-xs text-gray-500 mt-1">Need attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['all', 'planned', 'in-progress', 'completed', 'overdue'].map((status) => (
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

            {/* CAPA List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12">Loading CAPAs...</div>
                ) : filteredCAPAs.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">No CAPAs found</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCAPAs.map((capa) => (
                        <Card key={capa.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{capa.capaNumber}</h3>
                                            <Badge variant="outline">{capa.type}</Badge>
                                            {getPriorityBadge(capa.priority)}
                                            {getStatusBadge(capa.status)}
                                        </div>
                                        <p className="text-gray-900 font-medium mb-4">{capa.title}</p>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium">{capa.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${capa.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Owner:</span>
                                                <p className="font-medium">{capa.owner}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Due Date:</span>
                                                <p className="font-medium">{new Date(capa.dueDate).toLocaleDateString()}</p>
                                            </div>
                                            {capa.linkedNCR && (
                                                <div>
                                                    <span className="text-gray-500">Linked NCR:</span>
                                                    <Link href={`/quality/ncr/${capa.linkedNCR}`}>
                                                        <p className="font-medium text-blue-600 hover:underline">{capa.linkedNCR}</p>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Link href={`/quality/capa/${capa.id}`}>
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
