'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, FieldScheduleItem } from '@/services/ProjectManagementService';

export default function MobileFieldViewPage() {
    const { toast } = useToast();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [schedule, setSchedule] = useState<FieldScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        try {
            const data = await projectManagementService.getSchedule();
            setSchedule(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load schedule.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await projectManagementService.checkIn();
            setIsCheckedIn(true);
            toast({
                title: "Checked In",
                description: "You have successfully checked in.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to check in.",
            });
        }
    };

    const handleCheckOut = async () => {
        try {
            await projectManagementService.checkOut();
            setIsCheckedIn(false);
            toast({
                title: "Checked Out",
                description: "You have successfully checked out.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to check out.",
            });
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold">Field View</h1>

            {/* Check-in/Out Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Attendance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={isCheckedIn ? 'default' : 'secondary'}>
                                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                            </Badge>
                        </div>
                        {!isCheckedIn ? (
                            <Button onClick={handleCheckIn}>Check In</Button>
                        ) : (
                            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleCheckOut}>Check Out</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-muted-foreground">Loading schedule...</p>
                    ) : (
                        <div className="space-y-3">
                            {schedule.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.project}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {item.location}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.time}</p>
                                    </div>
                                    <Badge variant="outline">{item.status}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Upload Site Photo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toast({ title: "Upload", description: "Opening camera..." })}>
                        <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">Click to upload site photos</p>
                        <Button variant="outline">Choose File</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
