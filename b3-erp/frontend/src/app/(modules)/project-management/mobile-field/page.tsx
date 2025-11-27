'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Clock } from 'lucide-react';

export default function MobileFieldViewPage() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [schedule] = useState([
        { id: 1, project: 'Metro Rail Phase 1', location: 'Site A', time: '09:00 AM', status: 'Upcoming' },
        { id: 2, project: 'Solar Power Plant', location: 'Site B', time: '02:00 PM', status: 'Upcoming' },
    ]);

    const handleCheckIn = () => {
        setIsCheckedIn(true);
    };

    const handleCheckOut = () => {
        setIsCheckedIn(false);
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
                            <Button variant="destructive" onClick={handleCheckOut}>Check Out</Button>
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
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">Click to upload site photos</p>
                        <Button>Choose File</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
