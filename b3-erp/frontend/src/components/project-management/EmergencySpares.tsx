import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface EmergencySparesProps {
    projectId: string;
}

const EmergencySpares: React.FC<EmergencySparesProps> = ({ projectId }) => {
    const [requests, setRequests] = useState([
        { id: 'SPR-001', partId: 'PT-123', quantity: 5, urgency: 'High', status: 'Approved', requestedBy: 'John Doe' },
        { id: 'SPR-002', partId: 'PT-456', quantity: 2, urgency: 'Medium', status: 'Pending Approval', requestedBy: 'Jane Smith' },
    ]);
    const [partId, setPartId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRequest = {
            id: `SPR-${Date.now()}`,
            partId,
            quantity: Number(quantity),
            urgency,
            status: 'Pending Approval',
            requestedBy: 'Current User',
        };
        setRequests([...requests, newRequest]);
        setPartId('');
        setQuantity('');
        setReason('');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Request Emergency Spare</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="partId">Part ID</Label>
                                <Input
                                    id="partId"
                                    value={partId}
                                    onChange={(e) => setPartId(e.target.value)}
                                    placeholder="Enter part ID"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter quantity"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="urgency">Urgency</Label>
                                <Select
                                    value={urgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason</Label>
                                <Textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Enter reason for emergency request"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit">Submit Request</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>Part ID</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Urgency</TableHead>
                                <TableHead>Requested By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.partId}</TableCell>
                                    <TableCell>{request.quantity}</TableCell>
                                    <TableCell>
                                        <Badge variant={request.urgency === 'Critical' || request.urgency === 'High' ? 'destructive' : 'secondary'}>
                                            {request.urgency}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{request.requestedBy}</TableCell>
                                    <TableCell>
                                        <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {request.status === 'Pending Approval' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline">Approve</Button>
                                                <Button size="sm" variant="destructive">Reject</Button>
                                            </div>
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
};

export default EmergencySpares;
