'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export default function DiesToolsManagerPage() {
    const [tools, setTools] = useState([
        { id: 'DIE-001', name: 'Sheet Metal Cutter Die', type: 'Die', status: 'Available', lifeUsed: 500, maxLife: 10000, location: 'Store' },
        { id: 'TOOL-002', name: 'CNC Drill Bit Set', type: 'Tool', status: 'Issued', lifeUsed: 200, maxLife: 1000, currentWorkOrder: 'WO-123' },
        { id: 'DIE-003', name: 'Press Die Type A', type: 'Die', status: 'Maintenance', lifeUsed: 8500, maxLife: 10000, location: 'Workshop' },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'default';
            case 'Issued': return 'secondary';
            case 'Maintenance': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dies & Tools Management</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add New Tool</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Tool/Die</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tool ID</Label>
                                <Input placeholder="Enter tool ID" />
                            </div>
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input placeholder="Enter tool name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Input placeholder="Die/Tool" />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Life</Label>
                                <Input type="number" placeholder="Enter max life cycles" />
                            </div>
                            <Button className="w-full">Create Tool</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tool Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tool ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Life Used</TableHead>
                                <TableHead>Location/WO</TableHead>
                                <TableHead>Actions </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tools.map((tool) => (
                                <TableRow key={tool.id}>
                                    <TableCell className="font-medium">{tool.id}</TableCell>
                                    <TableCell>{tool.name}</TableCell>
                                    <TableCell>{tool.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(tool.status)}>{tool.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm">{tool.lifeUsed} / {tool.maxLife}</div>
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${tool.lifeUsed / tool.maxLife > 0.8 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${(tool.lifeUsed / tool.maxLife) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{tool.currentWorkOrder || tool.location}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {tool.status === 'Available' && (
                                                <Button size="sm" variant="outline">Issue</Button>
                                            )}
                                            {tool.status === 'Issued' && (
                                                <Button size="sm" variant="outline">Return</Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
