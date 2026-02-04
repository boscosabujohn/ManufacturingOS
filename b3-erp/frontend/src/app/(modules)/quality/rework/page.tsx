'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock,
    Wrench
} from 'lucide-react';

interface ReworkItem {
    id: string;
    defectId: string;
    component: string;
    defectType: string;
    priority: 'High' | 'Medium' | 'Low';
    assignedTo: string;
    status: 'Pending' | 'In Rework' | 'Completed' | 'Re-inspection';
    iterations: number;
}

export default function ReworkLoopPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [reworkItems, setReworkItems] = useState<ReworkItem[]>([
        { id: 'RW-001', defectId: 'DEF-045', component: 'Cabinet Door #3', defectType: 'Surface Finish', priority: 'High', assignedTo: 'Ravi Kumar', status: 'In Rework', iterations: 1 },
        { id: 'RW-002', defectId: 'DEF-046', component: 'Side Panel', defectType: 'Dimension Mismatch', priority: 'Medium', assignedTo: 'Suresh P', status: 'Pending', iterations: 0 },
        { id: 'RW-003', defectId: 'DEF-043', component: 'Main Frame', defectType: 'Weld Quality', priority: 'High', assignedTo: 'Ravi Kumar', status: 'Re-inspection', iterations: 2 },
        { id: 'RW-004', defectId: 'DEF-044', component: 'Mounting Bracket', defectType: 'Coating Issue', priority: 'Low', assignedTo: 'Mohan S', status: 'Completed', iterations: 1 },
    ]);

    const handleStatusChange = (id: string, newStatus: ReworkItem['status']) => {
        setReworkItems(reworkItems.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ));
        toast({
            title: 'Status Updated',
            description: `Rework item ${id} moved to ${newStatus}`,
        });
    };

    const getStatusColor = (status: ReworkItem['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'In Rework': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'Re-inspection': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    const getPriorityColor = (priority: ReworkItem['priority']) => {
        switch (priority) {
            case 'High': return 'text-red-600';
            case 'Medium': return 'text-orange-600';
            default: return 'text-blue-600';
        }
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <RefreshCw className="h-8 w-8 text-orange-600" />
                        6.3 Rework Loop
                    </h1>
                    <p className="text-muted-foreground">
                        Manage defect corrections and track rework iterations until QC approval.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/quality/defects')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => router.push('/quality/approvals')}>
                        Next: QC Approval <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reworkItems.filter(i => i.status === 'Pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">In Rework</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {reworkItems.filter(i => i.status === 'In Rework').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Re-inspection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {reworkItems.filter(i => i.status === 'Re-inspection').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {reworkItems.filter(i => i.status === 'Completed').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rework Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Rework ID</th>
                                    <th className="p-4 font-medium">Defect Ref</th>
                                    <th className="p-4 font-medium">Component</th>
                                    <th className="p-4 font-medium">Defect Type</th>
                                    <th className="p-4 font-medium">Priority</th>
                                    <th className="p-4 font-medium">Assigned To</th>
                                    <th className="p-4 font-medium">Iterations</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reworkItems.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4 font-medium">{item.id}</td>
                                        <td className="p-4">{item.defectId}</td>
                                        <td className="p-4">{item.component}</td>
                                        <td className="p-4">{item.defectType}</td>
                                        <td className="p-4">
                                            <span className={`font-medium ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className="p-4">{item.assignedTo}</td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="gap-1">
                                                <RefreshCw className="h-3 w-3" />
                                                {item.iterations}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={getStatusColor(item.status)}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {item.status === 'Pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusChange(item.id, 'In Rework')}
                                                    >
                                                        <Wrench className="h-4 w-4 mr-1" />
                                                        Start
                                                    </Button>
                                                )}
                                                {item.status === 'In Rework' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusChange(item.id, 'Re-inspection')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Send to QC
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
