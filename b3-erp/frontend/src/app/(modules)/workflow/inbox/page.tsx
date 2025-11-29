'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface UserTask {
    id: string;
    taskType: 'approval' | 'action' | 'review';
    title: string;
    description: string;
    module: string;
    moduleUrl: string;
    referenceNumber: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    dueDate?: Date;
    slaStatus?: 'on-track' | 'warning' | 'breached';
}

export default function TaskInbox() {
    const [tasks, setTasks] = useState<UserTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [counts, setCounts] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        overdue: 0,
        critical: 0,
    });

    const userId = 'current-user-id'; // Would come from auth context

    useEffect(() => {
        fetchTasks();
        fetchCounts();
    }, [activeTab]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/workflow/tasks/inbox/${userId}?status=${activeTab !== 'all' ? activeTab : ''}`);
            const data = await response.json();
            if (data.success) {
                setTasks(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCounts = async () => {
        try {
            const response = await fetch(`/api/workflow/tasks/counts/${userId}`);
            const data = await response.json();
            if (data.success) {
                setCounts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            critical: 'bg-red-500',
            high: 'bg-orange-500',
            medium: 'bg-yellow-500',
            low: 'bg-blue-500',
        };
        return <Badge className={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Badge>;
    };

    const getSLAIcon = (slaStatus?: string) => {
        if (!slaStatus) return null;

        const icons = {
            'on-track': <CheckCircle className="h-4 w-4 text-green-500" />,
            'warning': <Clock className="h-4 w-4 text-yellow-500" />,
            'breached': <AlertTriangle className="h-4 w-4 text-red-500" />,
        };
        return icons[slaStatus as keyof typeof icons];
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">My Task Inbox</h1>
                <p className="text-gray-600">Manage your pending tasks and approvals</p>
            </div>

            {/* Task Counts */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{counts.total}</div>
                        <div className="text-sm text-gray-600">Total Tasks</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{counts.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{counts.inProgress}</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{counts.overdue}</div>
                        <div className="text-sm text-gray-600">Overdue</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">{counts.critical}</div>
                        <div className="text-sm text-gray-600">Critical</div>
                    </CardContent>
                </Card>
            </div>

            {/* Task List */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
                            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                            <TabsTrigger value="overdue">Overdue ({counts.overdue})</TabsTrigger>
                            <TabsTrigger value="critical">Critical ({counts.critical})</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-4">
                            {loading ? (
                                <div className="text-center py-8">Loading tasks...</div>
                            ) : tasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No tasks found. You're all caught up! 🎉
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.map((task) => (
                                        <Link
                                            key={task.id}
                                            href={task.moduleUrl}
                                            className="block"
                                        >
                                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {getPriorityBadge(task.priority)}
                                                            <Badge variant="outline">{task.module}</Badge>
                                                            {getSLAIcon(task.slaStatus)}
                                                        </div>
                                                        <h3 className="font-semibold text-lg">{task.title}</h3>
                                                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                            <span>Ref: {task.referenceNumber}</span>
                                                            {task.dueDate && (
                                                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                            )}
                                                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
