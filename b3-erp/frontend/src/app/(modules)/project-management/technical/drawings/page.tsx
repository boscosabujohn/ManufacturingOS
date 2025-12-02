'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Trash2, Eye, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TechnicalDrawing {
    id: string;
    name: string;
    version: string;
    type: 'CAD' | 'PDF' | 'Production';
    uploadedBy: string;
    date: string;
    status: 'Draft' | 'Approved';
}

const mockDrawings: TechnicalDrawing[] = [
    { id: '1', name: 'Kitchen_Joinery_Detail_A.dwg', version: 'v1.0', type: 'CAD', uploadedBy: 'Tech Lead', date: '2025-01-25', status: 'Draft' },
    { id: '2', name: 'Wardrobe_Section_B.pdf', version: 'v1.0', type: 'PDF', uploadedBy: 'Tech Lead', date: '2025-01-25', status: 'Draft' },
];

export default function TechnicalDrawingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [drawings, setDrawings] = useState<TechnicalDrawing[]>(mockDrawings);

    const handleUpload = () => {
        toast({
            title: "Upload Started",
            description: "Uploading technical drawings...",
        });
        // Simulate upload
        setTimeout(() => {
            const newDrawing: TechnicalDrawing = {
                id: Math.random().toString(36).substr(2, 9),
                name: `New_Drawing_${drawings.length + 1}.pdf`,
                version: 'v1.0',
                type: 'PDF',
                uploadedBy: 'Current User',
                date: new Date().toISOString().split('T')[0],
                status: 'Draft',
            };
            setDrawings([...drawings, newDrawing]);
            toast({
                title: "Upload Complete",
                description: "Drawing added successfully.",
            });
        }, 1000);
    };

    const handleNext = () => {
        router.push('/project-management/technical/bom/accessories');
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Technical Drawings</h1>
                        <p className="text-sm text-gray-500">Step 3.4: Create and manage production-ready technical drawings</p>
                    </div>
                </div>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next: Accessories BOM <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Drawing Repository</CardTitle>
                        <CardDescription>Manage CAD files and production PDFs</CardDescription>
                    </div>
                    <Button onClick={handleUpload} variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Drawing
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drawings.map((drawing) => (
                                <TableRow key={drawing.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        {drawing.name}
                                    </TableCell>
                                    <TableCell>{drawing.version}</TableCell>
                                    <TableCell>{drawing.type}</TableCell>
                                    <TableCell>{drawing.uploadedBy}</TableCell>
                                    <TableCell>{drawing.date}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                            {drawing.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" title="View">
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Delete">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
