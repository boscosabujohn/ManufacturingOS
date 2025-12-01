'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ScheduleSiteVisitPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Schedule Site Visit</h1>
                    <p className="text-sm text-gray-500">Step 2.4: Coordinate with client for site access</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>New Appointment</CardTitle>
                        <CardDescription>Enter visit details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input id="date" type="date" className="pl-9" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input id="time" type="time" className="pl-9" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input id="location" placeholder="Site Address" className="pl-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Client Contact</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input id="contact" placeholder="Name & Phone" className="pl-9" />
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Confirm Booking</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Visits</CardTitle>
                        <CardDescription>Scheduled site inspections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { date: 'Jan 24, 2025', time: '10:00 AM', loc: 'Taj Hotels', status: 'Confirmed' },
                            { date: 'Jan 26, 2025', time: '02:00 PM', loc: 'BigBasket', status: 'Pending' },
                        ].map((visit, i) => (
                            <div key={i} className="p-3 border rounded-lg bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-gray-900">{visit.loc}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${visit.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>{visit.status}</span>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> {visit.date}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3" /> {visit.time}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
