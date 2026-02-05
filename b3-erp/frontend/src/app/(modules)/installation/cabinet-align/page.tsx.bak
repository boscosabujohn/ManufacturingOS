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
    Ruler,
    CheckCircle2,
    AlertTriangle,
    Camera
} from 'lucide-react';

interface AlignmentCheck {
    id: string;
    section: string;
    status: 'Pending' | 'Aligned' | 'Issue';
    deviation: string;
    notes: string;
}

export default function CabinetAlignPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [checks, setChecks] = useState<AlignmentCheck[]>([
        { id: '1', section: 'Base Units - Wall A', status: 'Pending', deviation: '-', notes: '' },
        { id: '2', section: 'Tall Units - Wall B', status: 'Pending', deviation: '-', notes: '' },
        { id: '3', section: 'Island Unit', status: 'Pending', deviation: '-', notes: '' },
    ]);

    const handleStatusChange = (id: string, status: AlignmentCheck['status']) => {
        setChecks(checks.map(c =>
            c.id === id ? { ...c, status } : c
        ));
    };

    const handleComplete = () => {
        toast({
            title: 'Alignment Verified',
            description: 'Cabinet alignment checks completed',
        });
        setTimeout(() => router.push('/installation/trial-wall'), 1000);
    };

    const getStatusBadge = (status: AlignmentCheck['status']) => {
        const styles = {
            'Aligned': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Pending': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            'Issue': 'bg-red-100 text-red-800 hover:bg-red-100'
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Ruler className="h-8 w-8 text-orange-600" />
                        8.4 Cabinet Alignment
                    </h1>
                    <p className="text-muted-foreground">
                        Verify level and alignment of installed cabinet carcasses.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/team-assignment')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={checks.some(c => c.status === 'Pending')}
                    >
                        Next: Trial Wall <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Checks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {checks.filter(c => c.status === 'Pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Aligned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {checks.filter(c => c.status === 'Aligned').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Issues Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {checks.filter(c => c.status === 'Issue').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alignment Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Section</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Deviation (mm)</th>
                                    <th className="p-4 font-medium">Notes</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checks.map((check) => (
                                    <tr key={check.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4 font-medium">{check.section}</td>
                                        <td className="p-4">{getStatusBadge(check.status)}</td>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                className="w-20 border rounded px-2 py-1 text-sm"
                                                placeholder="0 mm"
                                                disabled={check.status === 'Pending'}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                className="w-full border rounded px-2 py-1 text-sm"
                                                placeholder="Add notes..."
                                            />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleStatusChange(check.id, 'Aligned')}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleStatusChange(check.id, 'Issue')}
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost">
                                                    <Camera className="h-4 w-4" />
                                                </Button>
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
