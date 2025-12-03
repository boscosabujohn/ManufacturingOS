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
    Truck,
    PackageCheck,
    MapPin,
    Calendar
} from 'lucide-react';

export default function ToolDispatchPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [dispatched, setDispatched] = useState(false);

    const handleDispatch = () => {
        setDispatched(true);
        toast({
            title: 'Tools Dispatched',
            description: 'Tools have been dispatched to the site',
        });
        setTimeout(() => router.push('/installation/team-assignment'), 1000);
    };

    return (
        <div className="container mx-auto py-6 max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Truck className="h-8 w-8 text-orange-600" />
                        8.2 Tool Dispatch
                    </h1>
                    <p className="text-muted-foreground">
                        Coordinate tool delivery to the installation site.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/tool-prep')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleDispatch}
                        disabled={dispatched}
                    >
                        {dispatched ? 'Dispatched' : 'Confirm Dispatch'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dispatch Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="font-medium">Destination</div>
                                <div className="text-sm text-muted-foreground">Pearl Apartments, Bangalore</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="font-medium">Expected Arrival</div>
                                <div className="text-sm text-muted-foreground">Dec 19, 2024 - 09:00 AM</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <PackageCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="font-medium">Items</div>
                                <div className="text-sm text-muted-foreground">4 Tools Selected</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-40">
                        {dispatched ? (
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <PackageCheck className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-green-700">Dispatched</h3>
                                <p className="text-sm text-green-600">Tools are on the way</p>
                            </div>
                        ) : (
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-orange-700">Ready for Dispatch</h3>
                                <p className="text-sm text-orange-600">Waiting for confirmation</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
