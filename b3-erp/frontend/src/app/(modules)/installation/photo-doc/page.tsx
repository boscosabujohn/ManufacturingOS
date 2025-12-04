'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    Camera,
    Image as ImageIcon,
    Upload,
    Trash2
} from 'lucide-react';

interface Photo {
    id: string;
    category: 'Overall' | 'Detail' | 'Defect';
    url: string;
    description: string;
}

export default function PhotoDocPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [photos, setPhotos] = useState<Photo[]>([]);

    const handleUpload = () => {
        // Mock upload
        const newPhoto: Photo = {
            id: Date.now().toString(),
            category: 'Overall',
            url: '/placeholder-kitchen.jpg', // In a real app, this would be a real URL
            description: 'Kitchen View ' + (photos.length + 1)
        };
        setPhotos([...photos, newPhoto]);
        toast({
            title: 'Photo Uploaded',
            description: 'Image added to project documentation',
        });
    };

    const handleDelete = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    const handleComplete = () => {
        toast({
            title: 'Documentation Complete',
            description: 'Project photos saved successfully',
        });
        setTimeout(() => router.push('/installation/final-inspection'), 1000);
    };

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Camera className="h-8 w-8 text-orange-600" />
                        8.8 Photo Documentation
                    </h1>
                    <p className="text-muted-foreground">
                        Capture and upload finished project photos for records and handover.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/final-align')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={photos.length === 0}
                    >
                        Next: Final Inspection <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upload Area */}
                <Card className="md:col-span-3">
                    <CardContent className="pt-6">
                        <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleUpload}>
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Upload Project Photos</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Drag and drop or click to upload images
                            </p>
                            <Button>Select Files</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Photo Grid */}
                {photos.length > 0 ? (
                    photos.map((photo) => (
                        <Card key={photo.id} className="overflow-hidden group">
                            <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-300" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(photo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <div className="font-medium text-sm">{photo.description}</div>
                                <div className="text-xs text-muted-foreground">{photo.category}</div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="md:col-span-3 text-center py-12 text-muted-foreground">
                        No photos uploaded yet. Please add documentation photos.
                    </div>
                )}
            </div>
        </div>
    );
}
