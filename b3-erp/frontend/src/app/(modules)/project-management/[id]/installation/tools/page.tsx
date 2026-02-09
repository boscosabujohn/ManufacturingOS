'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Wrench,
    ArrowLeft,
    Plus,
    History,
    AlertCircle,
    CheckCircle2,
    Clock,
    Trash2,
    Search,
    Filter,
    ArrowUpRight,
    ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toolDeploymentService, ToolDeployment } from '@/services/ToolDeploymentService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ToolManagementPage() {
    const params = useParams();
    const projectId = params.id as string;
    const { toast } = useToast();
    const router = useRouter();

    const [deployments, setDeployments] = useState<ToolDeployment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedDeployment, setSelectedDeployment] = useState<ToolDeployment | null>(null);

    const [issueForm, setIssueForm] = useState({
        toolId: '',
        condition: 'Good',
        issuedBy: 'Site Manager'
    });

    const [returnForm, setReturnForm] = useState({
        condition: 'Good',
        depreciation: 0,
        returnedBy: 'Site Engineer'
    });

    useEffect(() => {
        loadDeployments();
    }, [projectId]);

    const loadDeployments = async () => {
        setLoading(true);
        try {
            const data = await toolDeploymentService.getDeployedTools(projectId);
            setDeployments(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load tool deployments.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleIssueTool = async () => {
        if (!issueForm.toolId) return;
        try {
            await toolDeploymentService.issueTool({
                ...issueForm,
                projectId
            });
            toast({ title: "Tool Issued", description: `Tool ${issueForm.toolId} has been deployed to site.` });
            setIsIssueModalOpen(false);
            setIssueForm({ toolId: '', condition: 'Good', issuedBy: 'Site Manager' });
            loadDeployments();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to issue tool." });
        }
    };

    const handleReturnTool = async () => {
        if (!selectedDeployment) return;
        try {
            await toolDeploymentService.returnTool({
                deploymentId: selectedDeployment.id,
                ...returnForm
            });
            toast({ title: "Tool Returned", description: `Tool ${selectedDeployment.toolId} has been returned to stores.` });
            setIsReturnModalOpen(false);
            setSelectedDeployment(null);
            loadDeployments();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to return tool." });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ISSUED': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">On Site</Badge>;
            case 'RETURNED': return <Badge className="bg-green-100 text-green-700 border-green-200">Returned</Badge>;
            case 'DAMAGED': return <Badge className="bg-red-100 text-red-700 border-red-200">Damaged</Badge>;
            case 'LOST': return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Lost</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="w-full py-2 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Wrench className="h-6 w-6 text-blue-600" />
                            Site Tool Management
                        </h1>
                        <p className="text-sm text-gray-500">Track asset deployment and condition for project installation</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Deploy New Tool
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Deploy Tool to Site</DialogTitle>
                                <DialogDescription>Register a tool issuance for the current project site.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="toolId">Tool Asset ID / Barcode</Label>
                                    <Input
                                        id="toolId"
                                        placeholder="e.g., HD-DRILL-001"
                                        value={issueForm.toolId}
                                        onChange={(e) => setIssueForm({ ...issueForm, toolId: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="condition">Condition at Issue</Label>
                                    <Input
                                        id="condition"
                                        value={issueForm.condition}
                                        onChange={(e) => setIssueForm({ ...issueForm, condition: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="issuedBy">Issued By</Label>
                                    <Input
                                        id="issuedBy"
                                        value={issueForm.issuedBy}
                                        onChange={(e) => setIssueForm({ ...issueForm, issuedBy: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleIssueTool}>Deploy Asset</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="md:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Site Inventory Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Active Deployments</span>
                            <span className="text-2xl font-bold">{deployments.filter(d => d.status === 'ISSUED').length}</span>
                        </div>
                        <div className="flex items-center justify-between text-blue-600">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium text-gray-900">Overdue Returns</span>
                            </div>
                            <span className="text-lg font-bold">2</span>
                        </div>
                        <div className="flex items-center justify-between text-red-600">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium text-gray-900">Reported Damaged</span>
                            </div>
                            <span className="text-lg font-bold">{deployments.filter(d => d.status === 'DAMAGED').length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle>Deployed Assets</CardTitle>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input placeholder="Search tools..." className="pl-8 h-9 w-64 bg-gray-50 border-none" />
                                </div>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading tools...</div>
                        ) : deployments.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">No tools deployed to this site yet.</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Asset ID</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Issued Date</th>
                                        <th className="px-6 py-3">Condition (Issue)</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deployments.map((d) => (
                                        <tr key={d.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-gray-900">{d.toolId}</td>
                                            <td className="px-6 py-3">{getStatusBadge(d.status)}</td>
                                            <td className="px-6 py-3 text-gray-600">{new Date(d.issuedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-gray-600">{d.conditionAtIssue || 'N/A'}</td>
                                            <td className="px-6 py-3 text-right">
                                                {d.status === 'ISSUED' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedDeployment(d);
                                                            setIsReturnModalOpen(true);
                                                        }}
                                                    >
                                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                                        Return
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="ml-1">
                                                    <History className="h-3.5 w-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Return Modal */}
            <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Return Tool to Stores</DialogTitle>
                        <DialogDescription>
                            Assess the condition of <strong>{selectedDeployment?.toolId}</strong> before check-in.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="retCondition">Condition at Return</Label>
                            <Input
                                id="retCondition"
                                value={returnForm.condition}
                                onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="depreciation">Asset Depreciation (%)</Label>
                            <Input
                                id="depreciation"
                                type="number"
                                value={returnForm.depreciation}
                                onChange={(e) => setReturnForm({ ...returnForm, depreciation: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="returnedBy">Verified By</Label>
                            <Input
                                id="returnedBy"
                                value={returnForm.returnedBy}
                                onChange={(e) => setReturnForm({ ...returnForm, returnedBy: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleReturnTool} className="bg-green-600 hover:bg-green-700">Confirm Return</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
