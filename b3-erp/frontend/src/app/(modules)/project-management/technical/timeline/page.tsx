'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Calculator, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export default function DrawingTimelinePage() {
    const router = useRouter();
    const { toast } = useToast();

    const [complexity, setComplexity] = useState('Medium');
    const [resources, setResources] = useState('2');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [estimatedDays, setEstimatedDays] = useState(0);
    const [completionDate, setCompletionDate] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        calculateTimeline();
    }, [complexity, resources, startDate]);

    const calculateTimeline = () => {
        let baseDays = 5; // Medium complexity default
        if (complexity === 'Low') baseDays = 3;
        if (complexity === 'High') baseDays = 8;
        if (complexity === 'Complex') baseDays = 12;

        const resourceFactor = 2 / parseInt(resources || '1'); // Base 2 designers
        const totalDays = Math.ceil(baseDays * resourceFactor);

        setEstimatedDays(totalDays);

        const start = new Date(startDate);
        const end = new Date(start);
        let daysAdded = 0;

        // Add working days only (skip weekends)
        while (daysAdded < totalDays) {
            end.setDate(end.getDate() + 1);
            if (end.getDay() !== 0 && end.getDay() !== 6) {
                daysAdded++;
            }
        }

        setCompletionDate(end.toISOString().split('T')[0]);
    };

    const handleConfirm = () => {
        setIsConfirmed(true);
        toast({
            title: "Timeline Confirmed",
            description: `Target completion date set to ${completionDate}`,
        });

        // Simulate navigation
        setTimeout(() => {
            router.push('/project-management/technical/drawings');
        }, 2000);
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calculate Drawing Timeline</h1>
                    <p className="text-sm text-gray-500">Step 3.3: Estimate completion date based on complexity and resources</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estimation Parameters</CardTitle>
                            <CardDescription>Adjust factors to calculate timeline</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Drawing Complexity</Label>
                                    <Select value={complexity} onValueChange={setComplexity}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low (Standard Layout)</SelectItem>
                                            <SelectItem value="Medium">Medium (Custom Units)</SelectItem>
                                            <SelectItem value="High">High (Complex Joinery)</SelectItem>
                                            <SelectItem value="Complex">Complex (Full Custom)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Available Designers</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={resources}
                                        onChange={(e) => setResources(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Note:</p>
                                    <p>Timeline calculation excludes weekends. Actual duration may vary based on revisions.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-gray-500" />
                                Estimation Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="text-center space-y-1">
                                <p className="text-sm text-gray-500">Estimated Duration</p>
                                <p className="text-3xl font-bold text-gray-900">{estimatedDays} Working Days</p>
                            </div>

                            <div className="text-center space-y-1">
                                <p className="text-sm text-gray-500">Target Completion</p>
                                <div className="flex items-center justify-center gap-2 text-xl font-bold text-blue-600">
                                    <Calendar className="w-5 h-5" />
                                    {completionDate}
                                </div>
                            </div>

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={handleConfirm}
                                disabled={isConfirmed}
                            >
                                {isConfirmed ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Timeline Confirmed
                                    </>
                                ) : (
                                    'Confirm Timeline'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
