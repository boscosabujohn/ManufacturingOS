'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { AlertTriangle, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function CreateNCRPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        source: '',
        severity: '',
        description: '',
        reportedBy: '',
        reportedDate: new Date().toISOString().split('T')[0],
        assignedTo: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/quality/ncr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create NCR');

            addToast({
                title: 'Success',
                message: 'NCR created successfully',
                variant: 'success'
            });
            router.push('/quality/ncr');
        } catch (error) {
            console.error('Error creating NCR:', error);
            addToast({
                title: 'Error',
                message: 'Failed to create NCR',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-3">
            <div className="flex items-center gap-2 mb-3">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Report Non-Conformance</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        New NCR Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Brief description of the issue"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="severity">Severity *</Label>
                                <Select
                                    value={formData.severity}
                                    onValueChange={(value: string) => handleSelectChange('severity', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="major">Major</SelectItem>
                                        <SelectItem value="minor">Minor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="source">Source *</Label>
                                <Select
                                    value={formData.source}
                                    onValueChange={(value: string) => handleSelectChange('source', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inspection">Inspection</SelectItem>
                                        <SelectItem value="customer-complaint">Customer Complaint</SelectItem>
                                        <SelectItem value="internal-audit">Internal Audit</SelectItem>
                                        <SelectItem value="production">Production</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reportedDate">Reported Date *</Label>
                                <Input
                                    id="reportedDate"
                                    name="reportedDate"
                                    type="date"
                                    value={formData.reportedDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reportedBy">Reported By *</Label>
                                <Input
                                    id="reportedBy"
                                    name="reportedBy"
                                    value={formData.reportedBy}
                                    onChange={handleChange}
                                    required
                                    placeholder="Name of reporter"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assignedTo">Assigned To</Label>
                                <Input
                                    id="assignedTo"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    placeholder="Assignee name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Detailed description of the non-conformance..."
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Submit NCR
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
