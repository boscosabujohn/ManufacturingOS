import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, TAClaim } from '@/services/ProjectManagementService';

interface TASettlementProps {
    projectId: string;
}

const TASettlement: React.FC<TASettlementProps> = ({ projectId }) => {
    const { toast } = useToast();
    const [claims, setClaims] = useState<TAClaim[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadClaims();
    }, [projectId]);

    const loadClaims = async () => {
        try {
            const data = await projectManagementService.getClaims(projectId);
            setClaims(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load claims.",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newClaim = await projectManagementService.createClaim({
                date: new Date().toISOString().split('T')[0],
                amount: Number(amount),
                description,
                projectId,
            });
            setClaims([...claims, newClaim]);
            setAmount('');
            setDescription('');
            toast({
                title: "Claim Submitted",
                description: "Your travel allowance claim has been submitted for approval.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit claim.",
            });
        } finally {
            setLoading(false);
        }
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
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Claim'}
                        </Button>
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
                            {claims.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No claims found for this project.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                claims.map((claim) => (
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TASettlement;
