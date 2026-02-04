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
    Settings,
    CheckCircle2,
    Wrench
} from 'lucide-react';

interface Accessory {
    id: string;
    name: string;
    location: string;
    status: 'Pending' | 'Installed' | 'Testing';
}

export default function AccessoryFixPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [accessories, setAccessories] = useState<Accessory[]>([
        { id: '1', name: 'Soft Close Hinges', location: 'All Cabinets', status: 'Pending' },
        { id: '2', name: 'Tandem Box Runners', location: 'Drawers', status: 'Pending' },
        { id: '3', name: 'Corner Carousel', location: 'Corner Unit', status: 'Pending' },
        { id: '4', name: 'Cutlery Tray', location: 'Top Drawer', status: 'Pending' },
    ]);

    const handleStatusChange = (id: string, status: Accessory['status']) => {
        setAccessories(accessories.map(a =>
            a.id === id ? { ...a, status } : a
        ));
    };

    const handleComplete = () => {
        toast({
            title: 'Accessories Installed',
            description: 'All accessories fixed and tested',
        });
        setTimeout(() => router.push('/installation/final-align'), 1000);
    };

    const getStatusBadge = (status: Accessory['status']) => {
        const styles = {
            'Installed': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Pending': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            'Testing': 'bg-blue-100 text-blue-800 hover:bg-blue-100'
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Settings className="h-8 w-8 text-orange-600" />
                        8.6 Accessory Fix
                    </h1>
                    <p className="text-muted-foreground">
                        Install and adjust internal accessories and hardware.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/trial-wall')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={accessories.some(a => a.status !== 'Installed')}
                    >
                        Next: Final Align <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Accessory Installation List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Accessory Name</th>
                                    <th className="p-4 font-medium">Location</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accessories.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4">{item.location}</td>
                                        <td className="p-4">{getStatusBadge(item.status)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {item.status === 'Pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusChange(item.id, 'Testing')}
                                                    >
                                                        <Wrench className="h-4 w-4 mr-1" />
                                                        Install
                                                    </Button>
                                                )}
                                                {item.status === 'Testing' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600"
                                                        onClick={() => handleStatusChange(item.id, 'Installed')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Verify
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
