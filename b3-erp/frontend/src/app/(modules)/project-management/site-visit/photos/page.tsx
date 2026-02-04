'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SitePhoto {
  id: string;
  name: string;
  url: string;
  size: string;
  date: string;
}

export default function PhotoDocumentationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial mock data
  const [photos, setPhotos] = useState<SitePhoto[]>([
    { id: '1', name: 'Site_Entrance.jpg', url: '', size: '2.4 MB', date: 'Jan 20, 2025' },
    { id: '2', name: 'Kitchen_Area.jpg', url: '', size: '3.1 MB', date: 'Jan 20, 2025' },
    { id: '3', name: 'Storage_Room.jpg', url: '', size: '1.8 MB', date: 'Jan 20, 2025' },
  ]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: SitePhoto[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      url: URL.createObjectURL(file),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));

    setPhotos((prev) => [...newPhotos, ...prev]);

    toast({
      title: "Photos Uploaded",
      description: `Successfully added ${files.length} photo(s).`,
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter(p => p.id !== id));
    toast({
      title: "Photo Removed",
      description: "The photo has been removed from the gallery.",
    });
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Photo Documentation</h1>
            <p className="text-sm text-gray-500">Step 2.6: Capture site photos for reference</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
          />
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUploadClick}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Upload Area */}
        <Card className="md:col-span-3 border-dashed border-2 bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center cursor-pointer" onClick={handleUploadClick}>
            <div className="p-4 bg-blue-100 rounded-full mb-4 text-blue-600">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Drag & Drop or Click to Upload</h3>
            <p className="text-sm text-gray-500 mt-1">Support for JPG, PNG, HEIC</p>
          </CardContent>
        </Card>

        {/* Gallery */}
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group relative">
            <div className="aspect-video bg-gray-200 relative">
              {photo.url ? (
                <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                  <ImageIcon className="w-12 h-12 opacity-50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(photo.url || '#', '_blank')}>
                  View
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(photo.id)}>
                  Delete
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={photo.name}>
                    {photo.name}
                  </p>
                  <p className="text-xs text-gray-500">{photo.date} • {photo.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
