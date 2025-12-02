import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, EmergencySpareRequest } from '@/services/ProjectManagementService';

interface EmergencySparesProps {
    projectId: string;
}

const EmergencySpares: React.FC<EmergencySparesProps> = ({ projectId }) => {
    const { toast } = useToast();
    const [requests, setRequests] = useState<EmergencySpareRequest[]>([]);
    const [partId, setPartId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRequests();
    }, [projectId]);

    const loadRequests = async () => {
        try {
            const data = await projectManagementService.getSpareRequests(projectId);
            setRequests(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load spare requests.",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newRequest = await projectManagementService.createSpareRequest({
                partId,
                quantity: Number(quantity),
                urgency,
                reason,
                requestedBy: 'Current User',
                projectId,
            });
            setRequests([...requests, newRequest]);
            setPartId('');
            setQuantity('');
            setReason('');
            toast({
                title: "Request Submitted",
                description: "Emergency spare request has been logged.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit request.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: EmergencySpareRequest['status']) => {
        try {
            await projectManagementService.updateSpareRequestStatus(id, status);
            setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
            toast({
                title: `Request ${status}`,
                description: `Request has been ${status.toLowerCase()}.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update status.",
            });
        }
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
                                    onValueChange={(value: any) => setUrgency(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select urgency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
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
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Button>
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
                            {requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
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
                                                    <Button size="sm" variant="outline" onClick={() => handleAction(request.id, 'Approved')}>Approve</Button>
                                                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleAction(request.id, 'Rejected')}>Reject</Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmergencySpares;
