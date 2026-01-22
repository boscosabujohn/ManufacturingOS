'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SiteReadinessPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleConfirmReady = () => {
    toast({
      title: "Site Confirmed Ready",
      description: "Proceeding to Production Phase.",
    });
    setTimeout(() => {
      router.push('/project-management/production');
    }, 1000);
  };

  const handleNotReady = () => {
    toast({
      variant: "destructive",
      title: "Site Not Ready",
      description: "Initiating Godown Storage Workflow.",
    });
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Readiness Check</h1>
          <p className="text-sm text-gray-500">Decision Point: Verify site conditions before proceeding to production</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Site Ready</CardTitle>
                <CardDescription>Proceed to Production</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Civil work completed</li>
              <li>Flooring installed</li>
              <li>Power & water points available</li>
              <li>Access for material delivery clear</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleConfirmReady}>Confirm Site Ready</Button>
          </CardFooter>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Site Not Ready</CardTitle>
                <CardDescription>Divert to Storage</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  If site is not ready, materials will be routed to godown storage to avoid damage and site congestion.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>Initiate Godown Storage Workflow</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleNotReady}>Mark Not Ready</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
