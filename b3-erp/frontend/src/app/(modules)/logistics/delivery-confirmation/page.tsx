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
    PackageCheck,
    CheckCircle2,
    Camera,
    FileText
} from 'lucide-react';

interface DeliveryItem {
    id: string;
    packageId: string;
    description: string;
    quantity: number;
    received: boolean;
    condition: 'Good' | 'Damaged' | 'Missing';
    notes: string;
}

export default function DeliveryConfirmationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([
        { id: '1', packageId: 'PKG-001', description: 'Main Cabinet Units', quantity: 10, received: true, condition: 'Good', notes: '' },
        { id: '2', packageId: 'PKG-002', description: 'Side Panels', quantity: 5, received: true, condition: 'Good', notes: '' },
        { id: '3', packageId: 'PKG-003', description: 'Accessories Kit', quantity: 3, received: false, condition: 'Missing', notes: 'Not received at site' },
    ]);

    const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
    const [signatureUploaded, setSignatureUploaded] = useState(false);

    const handleToggleReceived = (id: string) => {
        setDeliveryItems(deliveryItems.map(item =>
            item.id === id ? {
                ...item,
                received: !item.received,
                condition: !item.received ? 'Good' : 'Missing'
            } : item
        ));
    };

    const handleConditionChange = (id: string, condition: DeliveryItem['condition']) => {
        setDeliveryItems(deliveryItems.map(item =>
            item.id === id ? { ...item, condition } : item
        ));
    };

    const handleUploadSignature = () => {
        setSignatureUploaded(true);
        toast({
            title: 'Signature Uploaded',
            description: 'Customer signature has been captured',
        });
    };

    const handleConfirmDelivery = () => {
        setDeliveryConfirmed(true);
        toast({
            title: 'Delivery Confirmed',
            description: 'Delivery receipt and unloading sign-off completed',
        });
    };

    const getConditionBadge = (condition: DeliveryItem['condition']) => {
        const styles = {
            'Good': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Damaged': 'bg-red-100 text-red-800 hover:bg-red-100',
            'Missing': 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        };
        return <Badge className={styles[condition]}>{condition}</Badge>;
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <PackageCheck className="h-8 w-8 text-orange-600" />
                        7.8 Delivery Confirmation
                    </h1>
                    <p className="text-muted-foreground">
                        Verify unloading, capture receipt sign-off, and confirm delivery completion.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/logistics/tracking')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={() => router.push('/logistics/site-notification')}
                        disabled={!deliveryConfirmed}
                    >
                        Next: Site Notification <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Delivery Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{deliveryItems.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Received</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {deliveryItems.filter(i => i.received).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Damaged</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {deliveryItems.filter(i => i.condition === 'Damaged').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Missing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">
                            {deliveryItems.filter(i => i.condition === 'Missing').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Package Checklist */}
            <Card>
                <CardHeader>
                    <CardTitle>Package Receipt Verification</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Package ID</th>
                                    <th className="p-4 font-medium">Description</th>
                                    <th className="p-4 font-medium">Qty</th>
                                    <th className="p-4 font-medium">Received</th>
                                    <th className="p-4 font-medium">Condition</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryItems.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4 font-medium">{item.packageId}</td>
                                        <td className="p-4">{item.description}</td>
                                        <td className="p-4">{item.quantity}</td>
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={item.received}
                                                onChange={() => handleToggleReceived(item.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={item.condition}
                                                onChange={(e) => handleConditionChange(item.id, e.target.value as DeliveryItem['condition'])}
                                                disabled={!item.received}
                                                className="text-sm border rounded px-2 py-1"
                                            >
                                                <option value="Good">Good</option>
                                                <option value="Damaged">Damaged</option>
                                                <option value="Missing">Missing</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button size="sm" variant="ghost">
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Signature & POD */}
            <Card>
                <CardHeader>
                    <CardTitle>Proof of Delivery (POD)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Customer Signature</div>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                {signatureUploaded ? (
                                    <div className="text-green-600 flex items-center justify-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Signature Captured
                                    </div>
                                ) : (
                                    <div>
                                        <Button onClick={handleUploadSignature}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Capture Signature
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Delivery Photos</div>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Button variant="outline">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Upload Photos
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">Site photos for documentation</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Confirmation */}
            <div className="flex justify-end">
                {!deliveryConfirmed ? (
                    <Button
                        onClick={handleConfirmDelivery}
                        disabled={!signatureUploaded || deliveryItems.filter(i => i.received).length === 0}
                        size="lg"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm Delivery & Unloading
                    </Button>
                ) : (
                    <Card className="flex-1 border-l-4 border-l-green-500 bg-green-50">
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Delivery confirmed successfully</span>
                            </div>
                            <Button onClick={() => router.push('/logistics/site-notification')}>
                                Notify Installation Team <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
