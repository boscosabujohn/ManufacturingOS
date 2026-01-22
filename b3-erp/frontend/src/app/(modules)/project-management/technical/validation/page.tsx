'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertTriangle, FileText, Package, Layers, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function BOMValidationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [checks, setChecks] = useState({
    drawings: false,
    accessories: false,
    specs: false,
    quantities: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checks).every(Boolean);

  const handleSubmit = () => {
    if (!allChecked) {
      toast({
        title: "Validation Incomplete",
        description: "Please confirm all checks before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "BOM Submitted",
      description: "Technical design and BOM have been submitted to Procurement.",
    });

    // Simulate navigation to next phase
    setTimeout(() => {
      router.push('/project-management');
    }, 2000);
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BOM Validation</h1>
          <p className="text-sm text-gray-500">Step 3.7: Validate technical details and submit for procurement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Package Summary</CardTitle>
              <CardDescription>Review all components before final submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Technical Drawings</p>
                    <p className="text-sm text-gray-500">2 Files Uploaded (v1.0)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/project-management/technical/drawings')}>Review</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Accessories BOM</p>
                    <p className="text-sm text-gray-500">36 Items Listed</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/project-management/technical/bom/accessories')}>Review</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Shutter Specifications</p>
                    <p className="text-sm text-gray-500">Wood, Glass, Stone Defined</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/project-management/technical/specs/shutters')}>Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Technical Lead Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" checked={checks.drawings} onCheckedChange={() => handleCheck('drawings')} />
                  <Label htmlFor="check1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Drawings are production-ready
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check2" checked={checks.accessories} onCheckedChange={() => handleCheck('accessories')} />
                  <Label htmlFor="check2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accessories list is complete
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check3" checked={checks.specs} onCheckedChange={() => handleCheck('specs')} />
                  <Label htmlFor="check3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Material specs are verified
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check4" checked={checks.quantities} onCheckedChange={() => handleCheck('quantities')} />
                  <Label htmlFor="check4" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Quantities match BOQ
                  </Label>
                </div>
              </div>

              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={handleSubmit}
                disabled={isSubmitted || !allChecked}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submitted to Procurement
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Validate & Submit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
