'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ClipboardCheck, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function CreateInspectionPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        inspectionNumber: `INS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        inspectionName: '',
        inspectionType: '',
        priority: 'medium',
        itemId: '',
        itemCode: '',
        itemName: '',
        lotQuantity: '',
        sampleSize: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        assignedToName: '',
        description: ''
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

        const payload = {
            ...formData,
            lotQuantity: Number(formData.lotQuantity),
            sampleSize: Number(formData.sampleSize),
            itemId: formData.itemId || `ITEM-${Math.floor(Math.random() * 1000)}` // Mock ID if not provided
        };

        try {
            const response = await fetch('/api/quality/inspection', { // Note: Controller path is 'quality/inspection' (singular)
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to schedule inspection');

            addToast({
                title: 'Success',
                message: 'Inspection scheduled successfully',
                variant: 'success'
            });
            router.push('/quality/inspections');
        } catch (error) {
            console.error('Error scheduling inspection:', error);
            addToast({
                title: 'Error',
                message: 'Failed to schedule inspection',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Schedule New Inspection</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-blue-600" />
                        Inspection Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="inspectionNumber">Inspection Number *</Label>
                                <Input
                                    id="inspectionNumber"
                                    name="inspectionNumber"
                                    value={formData.inspectionNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inspectionName">Inspection Name *</Label>
                                <Input
                                    id="inspectionName"
                                    name="inspectionName"
                                    value={formData.inspectionName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Incoming Material Check"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inspectionType">Type *</Label>
                                <Select
                                    value={formData.inspectionType}
                                    onValueChange={(value: string) => handleSelectChange('inspectionType', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="incoming">Incoming</SelectItem>
                                        <SelectItem value="in-process">In-Process</SelectItem>
                                        <SelectItem value="final">Final</SelectItem>
                                        <SelectItem value="pre-shipment">Pre-Shipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority *</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value: string) => handleSelectChange('priority', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="itemCode">Item Code *</Label>
                                <Input
                                    id="itemCode"
                                    name="itemCode"
                                    value={formData.itemCode}
                                    onChange={handleChange}
                                    required
                                    placeholder="SKU or Part Number"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="itemName">Item Name *</Label>
                                <Input
                                    id="itemName"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Description of item"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lotQuantity">Lot Quantity *</Label>
                                <Input
                                    id="lotQuantity"
                                    name="lotQuantity"
                                    type="number"
                                    value={formData.lotQuantity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sampleSize">Sample Size *</Label>
                                <Input
                                    id="sampleSize"
                                    name="sampleSize"
                                    type="number"
                                    value={formData.sampleSize}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                                <Input
                                    id="scheduledDate"
                                    name="scheduledDate"
                                    type="date"
                                    value={formData.scheduledDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assignedToName">Assigned To</Label>
                                <Input
                                    id="assignedToName"
                                    name="assignedToName"
                                    value={formData.assignedToName}
                                    onChange={handleChange}
                                    placeholder="Inspector name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description / Notes</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Additional instructions..."
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    'Scheduling...'
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Schedule Inspection
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
