'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PhotoDocumentationPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Photo Documentation</h1>
                        <p className="text-sm text-gray-500">Step 2.6: Capture site photos for reference</p>
                    </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upload Area */}
                <Card className="md:col-span-3 border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="p-4 bg-blue-50 rounded-full mb-4">
                            <Camera className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Drag & Drop or Click to Upload</h3>
                        <p className="text-sm text-gray-500 mt-1">Support for JPG, PNG, HEIC</p>
                    </CardContent>
                </Card>

                {/* Gallery */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden group">
                        <div className="aspect-video bg-gray-200 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary" size="sm">View</Button>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <p className="text-sm font-medium text-gray-900">Site_Photo_{i}.jpg</p>
                            <p className="text-xs text-gray-500">Jan 20, 2025 • 2.4 MB</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
