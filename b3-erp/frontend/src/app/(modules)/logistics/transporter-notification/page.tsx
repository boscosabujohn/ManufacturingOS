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
    Bell,
    Send,
    Mail,
    MessageSquare,
    CheckCircle2
} from 'lucide-react';

interface NotificationRecipient {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    selected: boolean;
}

export default function TransporterNotificationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [recipients, setRecipients] = useState<NotificationRecipient[]>([
        { id: '1', name: 'TCI Express - Dispatch Coordinator', role: 'Transporter', phone: '+91 98765 11111', email: 'dispatch@tciexpress.com', selected: true },
        { id: '2', name: 'Driver: Ramesh Kumar', role: 'Assigned Driver', phone: '+91 98765 22222', email: 'ramesh.driver@tci.com', selected: true },
        { id: '3', name: 'Logistics Manager', role: 'Internal', phone: '+91 98765 33333', email: 'logistics@b3macbis.com', selected: true },
    ]);

    const [notificationSent, setNotificationSent] = useState(false);

    const handleToggleRecipient = (id: string) => {
        setRecipients(recipients.map(r =>
            r.id === id ? { ...r, selected: !r.selected } : r
        ));
    };

    const handleSendNotification = () => {
        const selectedCount = recipients.filter(r => r.selected).length;
        setNotificationSent(true);
        toast({
            title: 'Notifications Sent',
            description: `Pickup details sent to ${selectedCount} recipient(s) via SMS and Email`,
        });
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bell className="h-8 w-8 text-orange-600" />
                        7.5 Transporter Notification
                    </h1>
                    <p className="text-muted-foreground">
                        Alert transporter with pickup details, schedule, and delivery requirements.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/logistics/site-location')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={() => router.push('/logistics/loading')}
                        disabled={!notificationSent}
                    >
                        Next: Loading <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Shipment Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Shipment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                        <div className="text-sm text-muted-foreground">Order Number</div>
                        <div className="font-medium">ORD-KT-345</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Destination</div>
                        <div className="font-medium">Bangalore, KA</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Pickup Date</div>
                        <div className="font-medium">Dec 18, 2024</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Total Weight</div>
                        <div className="font-medium">475 kg</div>
                    </div>
                </CardContent>
            </Card>

            {/* Recipients */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recipients.map((recipient) => (
                            <div
                                key={recipient.id}
                                className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 ${recipient.selected ? 'border-orange-600 bg-orange-50' : ''
                                    }`}
                                onClick={() => handleToggleRecipient(recipient.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={recipient.selected}
                                            onChange={() => handleToggleRecipient(recipient.id)}
                                            className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-1"
                                        />
                                        <div>
                                            <div className="font-medium">{recipient.name}</div>
                                            <Badge variant="outline" className="mt-1">{recipient.role}</Badge>
                                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {recipient.phone}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3" />
                                                    {recipient.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Notification Content Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <div className="font-medium">Subject: Pickup Request - Order #ORD-KT-345</div>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                            {`Dear Transporter,

Please arrange pickup for the following shipment:

Order Number: ORD-KT-345
Customer: Pearl Apartments - Tower A
Destination: Bangalore, Karnataka - 560001
Pickup Date: Dec 18, 2024
Pickup Time: 9:00 AM - 11:00 AM

Shipment Details:
- Total Packages: 18
- Total Weight: 475 kg
- Package Type: Wooden Crates & Boxes

Pickup Location:
B3 MACBIS Manufacturing Unit
Sector 5, Industrial Area
Coimbatore, Tamil Nadu

Contact Person: Mr. Suresh (Factory Supervisor)
Contact: +91 98765 12345

Please confirm receipt and provide driver details.

Regards,
Logistics Team - B3 MACBIS`}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                {!notificationSent ? (
                    <Button
                        onClick={handleSendNotification}
                        disabled={recipients.filter(r => r.selected).length === 0}
                        size="lg"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Send Notification ({recipients.filter(r => r.selected).length} recipient{recipients.filter(r => r.selected).length !== 1 ? 's' : ''})
                    </Button>
                ) : (
                    <Card className="flex-1 border-l-4 border-l-green-500 bg-green-50">
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Notifications sent successfully</span>
                            </div>
                            <Button onClick={() => router.push('/logistics/loading')}>
                                Continue to Loading <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
