import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TASettlementProps {
    projectId: string;
}

const TASettlement: React.FC<TASettlementProps> = ({ projectId }) => {
    const [claims, setClaims] = useState([
        { id: 'CLM-001', date: '2023-10-25', amount: 1500, description: 'Site visit travel', status: 'Approved' },
        { id: 'CLM-002', date: '2023-10-28', amount: 800, description: 'Local conveyance', status: 'Pending' },
    ]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newClaim = {
            id: `CLM-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: Number(amount),
            description,
            status: 'Pending',
        };
        setClaims([...claims, newClaim]);
        setAmount('');
        setDescription('');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Submit New Claim</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (₹)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter details of expense"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit">Submit Claim</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Claim History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Claim ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim) => (
                                <TableRow key={claim.id}>
                                    <TableCell>{claim.id}</TableCell>
                                    <TableCell>{claim.date}</TableCell>
                                    <TableCell>{claim.description}</TableCell>
                                    <TableCell>₹{claim.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={claim.status === 'Approved' ? 'default' : 'secondary'}>
                                            {claim.status}
                                        </Badge>
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

export default TASettlement;
