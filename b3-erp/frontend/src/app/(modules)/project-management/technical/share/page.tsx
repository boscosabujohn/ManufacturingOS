'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, Share2, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ProjectDocument {
  id: string;
  name: string;
  type: 'BOQ' | 'Drawing' | 'Render' | 'Spec';
  status: 'Ready' | 'Pending' | 'Missing';
  date: string;
}

const mockDocuments: ProjectDocument[] = [
  { id: '1', name: 'Final_Approved_BOQ_v2.pdf', type: 'BOQ', status: 'Ready', date: '2025-01-20' },
  { id: '2', name: 'Site_Measurements_Verified.pdf', type: 'Drawing', status: 'Ready', date: '2025-01-22' },
  { id: '3', name: 'Kitchen_Layout_Concept_v3.jpg', type: 'Render', status: 'Ready', date: '2025-01-18' },
  { id: '4', name: 'Appliance_Specifications_Sheet.pdf', type: 'Spec', status: 'Ready', date: '2025-01-19' },
];

export default function ShareDocumentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ProjectDocument[]>(mockDocuments);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isShared, setIsShared] = useState(false);

  const handleToggle = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(d => d.id));
    }
  };

  const handleShare = () => {
    if (selectedDocs.length !== documents.length) {
      toast({
        title: "Incomplete Selection",
        description: "Please select all required documents before sharing.",
        variant: "destructive",
      });
      return;
    }

    setIsShared(true);
    toast({
      title: "Documents Shared",
      description: "All documents have been successfully shared with the Technical Team.",
    });

    // Simulate navigation to next step after a delay
    setTimeout(() => {
      router.push('/project-management/technical/briefing');
    }, 2000);
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Share Documents to Technical</h1>
          <p className="text-sm text-gray-500">Step 3.1: Handover approved documents to the technical design team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Required Documents</CardTitle>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedDocs.length === documents.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <CardDescription>Verify and select documents to share</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => handleToggle(doc.id)}
                    />
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <label htmlFor={doc.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {doc.name}
                      </label>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 mb-4">
                Ensure all documents are final and approved. Once shared, the Technical Team will begin the detailed design process.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleShare}
                disabled={isShared}
              >
                {isShared ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Shared Successfully
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Technical Team
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Documents Selected</span>
                  <span className="font-medium">{selectedDocs.length}/{documents.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedDocs.length / documents.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
