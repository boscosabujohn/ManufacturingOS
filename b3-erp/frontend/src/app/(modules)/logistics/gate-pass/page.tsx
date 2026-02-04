'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export default function GatePassManagerPage() {
    const [passes, setPasses] = useState([
        { id: 'GP-001', type: 'Returnable', vehicle: 'MH-01-AB-1234', driver: 'Rajesh Kumar', status: 'Checked Out', checkOutTime: '09:30 AM' },
        { id: 'GP-002', type: 'Non-Returnable', vehicle: 'MH-02-CD-5678', driver: 'Amit Sharma', status: 'Issued', checkOutTime: null },
    ]);
    const [type, setType] = useState('returnable');
    const [vehicle, setVehicle] = useState('');
    const [driver, setDriver] = useState('');

    const handleCreatePass = (e: React.FormEvent) => {
        e.preventDefault();
        const newPass = {
            id: `GP-${Date.now()}`,
            type: type === 'returnable' ? 'Returnable' : 'Non-Returnable',
            vehicle,
            driver,
            status: 'Issued',
            checkOutTime: null,
        };
        setPasses([...passes, newPass]);
        setVehicle('');
        setDriver('');
    };

    return (
        <div className="w-full py-6 space-y-6">
            <h1 className="text-3xl font-bold">Gate Pass Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Gate Pass</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreatePass} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="returnable">Returnable</SelectItem>
                                        <SelectItem value="non-returnable">Non-Returnable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Vehicle Number</Label>
                                <Input
                                    value={vehicle}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVehicle(e.target.value)}
                                    placeholder="MH-01-AB-1234"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Driver Name</Label>
                                <Input
                                    value={driver}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDriver(e.target.value)}
                                    placeholder="Enter driver name"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit">Create Gate Pass</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gate Pass Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pass ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Check-Out Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {passes.map((pass) => (
                                <TableRow key={pass.id}>
                                    <TableCell className="font-medium">{pass.id}</TableCell>
                                    <TableCell>{pass.type}</TableCell>
                                    <TableCell>{pass.vehicle}</TableCell>
                                    <TableCell>{pass.driver}</TableCell>
                                    <TableCell>
                                        <Badge variant={pass.status === 'Checked Out' ? 'default' : 'secondary'}>
                                            {pass.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{pass.checkOutTime || '-'}</TableCell>
                                    <TableCell>
                                        {pass.status === 'Issued' && (
                                            <Button size="sm" variant="outline">Check Out</Button>
                                        )}
                                        {pass.status === 'Checked Out' && pass.type === 'Returnable' && (
                                            <Button size="sm" variant="outline">Check In</Button>
                                        )}
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
