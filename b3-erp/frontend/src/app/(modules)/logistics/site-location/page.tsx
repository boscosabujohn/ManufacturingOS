'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    MapPinned,
    User,
    Phone,
    Clock,
    Save,
    Send
} from 'lucide-react';

export default function SiteLocationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        siteAddress: '123, Pearl Apartments, Tower A',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        contactPerson: 'Mr. Rajesh Kumar',
        contactPhone: '+91 98765 43210',
        alternatePhone: '+91 98765 43211',
        deliveryDate: '2024-12-18',
        preferredTime: '10:00 AM - 2:00 PM',
        specialInstructions: 'Security clearance required. Contact before arrival.',
        landmarks: 'Near MG Road Metro Station, Opposite Prestige Mall'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        toast({
            title: 'Location Details Saved',
            description: 'Site location information has been saved successfully',
        });
    };

    const handleShare = () => {
        toast({
            title: 'Location Shared',
            description: 'Site location details have been shared with logistics team and transporter',
        });
        setTimeout(() => router.push('/logistics/transporter-notification'), 1000);
    };

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <MapPinned className="h-8 w-8 text-orange-600" />
                        7.4 Site Location Sharing
                    </h1>
                    <p className="text-muted-foreground">
                        Share site address, contact person, and delivery timing with logistics team.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/logistics/transport-selection')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleShare}>
                        <Send className="mr-2 h-4 w-4" />
                        Share & Continue
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Site Address */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteAddress">Site Address</Label>
                            <Textarea
                                id="siteAddress"
                                value={formData.siteAddress}
                                onChange={(e) => handleInputChange('siteAddress', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                value={formData.pincode}
                                onChange={(e) => handleInputChange('pincode', e.target.value)}
                                className="w-48"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="landmarks">Nearby Landmarks</Label>
                            <Textarea
                                id="landmarks"
                                value={formData.landmarks}
                                onChange={(e) => handleInputChange('landmarks', e.target.value)}
                                rows={2}
                                placeholder="Landmarks or directions to help locate the site"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Location Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <MapPinned className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="text-muted-foreground">Destination</div>
                                <div className="font-medium">{formData.city}, {formData.state}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="text-muted-foreground">Contact Person</div>
                                <div className="font-medium">{formData.contactPerson}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="text-muted-foreground">Delivery Window</div>
                                <div className="font-medium">{formData.preferredTime}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Site Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person Name</Label>
                            <div className="flex gap-2">
                                <User className="h-4 w-4 text-muted-foreground mt-2.5" />
                                <Input
                                    id="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">Primary Phone</Label>
                            <div className="flex gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground mt-2.5" />
                                <Input
                                    id="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
                            <div className="flex gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground mt-2.5" />
                                <Input
                                    id="alternatePhone"
                                    value={formData.alternatePhone}
                                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Timing */}
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                            <Input
                                type="date"
                                id="deliveryDate"
                                value={formData.deliveryDate}
                                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preferredTime">Preferred Time Window</Label>
                            <Input
                                id="preferredTime"
                                value={formData.preferredTime}
                                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                                placeholder="e.g., 10:00 AM - 2:00 PM"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="specialInstructions">Special Instructions</Label>
                        <Textarea
                            id="specialInstructions"
                            value={formData.specialInstructions}
                            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                            rows={3}
                            placeholder="Any special delivery instructions, access restrictions, or requirements"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                </Button>
                <Button onClick={handleShare}>
                    <Send className="mr-2 h-4 w-4" />
                    Share with Logistics
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
