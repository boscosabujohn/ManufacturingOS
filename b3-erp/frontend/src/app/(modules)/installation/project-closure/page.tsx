'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    CheckCircle,
    Archive,
    FileText,
    Star,
    Home
} from 'lucide-react';

export default function ProjectClosurePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [closed, setClosed] = useState(false);

    const handleCloseProject = () => {
        setClosed(true);
        toast({
            title: 'Project Closed',
            description: 'Project has been formally closed and archived.',
        });
    };

    return (
        <div className="container mx-auto py-6 max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Archive className="h-8 w-8 text-orange-600" />
                        8.12 Project Closure
                    </h1>
                    <p className="text-muted-foreground">
                        Finalize project, collect feedback, and archive documentation.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/handover')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => router.push('/dashboard')}>
                        <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                    </Button>
                </div>
            </div>

            {closed ? (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6 text-center py-12">
                        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-green-800 mb-2">Project Successfully Closed!</h2>
                        <p className="text-green-700 max-w-md mx-auto mb-8">
                            Thank you for your hard work. The project "Pearl Apartments - Tower A" has been completed and archived.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" className="bg-white" onClick={() => window.print()}>
                                <FileText className="mr-2 h-4 w-4" /> Print Report
                            </Button>
                            <Button onClick={() => router.push('/projects')}>
                                View All Projects
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-muted-foreground">Project Name</div>
                                    <div className="font-medium">Pearl Apartments</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Order Number</div>
                                    <div className="font-medium">ORD-KT-345</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Start Date</div>
                                    <div className="font-medium">Nov 15, 2024</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Completion Date</div>
                                    <div className="font-medium">Dec 20, 2024</div>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <h4 className="font-medium mb-2">Deliverables Status</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" /> Manufacturing Completed
                                    </li>
                                    <li className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" /> Delivery Verified
                                    </li>
                                    <li className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" /> Installation Finished
                                    </li>
                                    <li className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" /> Client Handover Signed
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Internal Feedback & Closure</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium block mb-2">Project Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`p-1 hover:scale-110 transition-transform ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                            <Star className="h-8 w-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-2">Closure Notes</label>
                                <textarea
                                    className="w-full border rounded-md p-3 text-sm h-32"
                                    placeholder="Enter any final notes, lessons learned, or issues encountered..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCloseProject}
                                disabled={rating === 0}
                            >
                                <Archive className="mr-2 h-4 w-4" />
                                Close Project
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
