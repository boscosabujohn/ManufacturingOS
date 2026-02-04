'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, Package, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

interface Shipment {
  poId: string;
  vendor: string;
  items: string;
  status: 'Dispatched' | 'In Transit' | 'Delivered' | 'Pending';
  eta: string;
  progress: number;
}

const mockShipments: Shipment[] = [
  { poId: 'PO-2025-088', vendor: 'Merino Industries', items: 'Laminates (25 sheets)', status: 'In Transit', eta: '2025-02-14', progress: 60 },
  { poId: 'PO-2025-089', vendor: 'Hettich India', items: 'Hinges (100 pcs)', status: 'Dispatched', eta: '2025-02-15', progress: 30 },
  { poId: 'PO-2025-090', vendor: 'Greenlam', items: 'Plywood (50 sheets)', status: 'Pending', eta: 'TBD', progress: 0 },
];

export default function VendorTrackingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);

  const handleTrack = (id: string) => {
    toast({
      title: "Tracking Updated",
      description: `Fetched latest status for ${id}`,
    });
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Tracking</h1>
            <p className="text-sm text-gray-500">Step 4.6: Monitor delivery timelines and shipment status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{shipments.filter(s => s.status === 'In Transit').length}</div>
            <p className="text-xs text-blue-600">Shipments on the way</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Pending Dispatch</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{shipments.filter(s => s.status === 'Pending').length}</div>
            <p className="text-xs text-orange-600">Awaiting vendor action</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Delivered (This Week)</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">5</div>
            <p className="text-xs text-green-600">Ready for GRN</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Real-time tracking of open purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {shipments.map((shipment) => (
              <div key={shipment.poId} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{shipment.poId}</h3>
                      <p className="text-sm text-gray-500">{shipment.vendor} • {shipment.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      shipment.status === 'In Transit' ? 'default' :
                        shipment.status === 'Pending' ? 'secondary' : 'outline'
                    }>
                      {shipment.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">ETA: {shipment.eta}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Ordered</span>
                    <span>Dispatched</span>
                    <span>In Transit</span>
                    <span>Delivered</span>
                  </div>
                  <Progress value={shipment.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Current Location: {shipment.status === 'In Transit' ? 'Hub, Mumbai' : 'Vendor Warehouse'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Driver: +91 98765 43210
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleTrack(shipment.poId)}>
                    Refresh Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
