'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PackageCheck, ClipboardCheck, AlertTriangle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
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
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from '@/components/ui/Textarea';

interface GRNItem {
  id: string;
  description: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  accepted: boolean;
  remarks: string;
}

const mockGRNItems: GRNItem[] = [
  { id: '1', description: 'Laminate - White Gloss (Merino)', orderedQty: 25, receivedQty: 25, unit: 'sheets', accepted: true, remarks: '' },
  { id: '2', description: 'Hettich Soft Close Hinge', orderedQty: 60, receivedQty: 58, unit: 'pcs', accepted: true, remarks: '2 pcs missing' },
];

export default function GRNEntryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<GRNItem[]>(mockGRNItems);

  const handleQtyChange = (id: string, qty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, receivedQty: qty } : item));
  };

  const handleAcceptChange = (id: string, checked: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, accepted: checked } : item));
  };

  const handleRemarksChange = (id: string, text: string) => {
    setItems(items.map(item => item.id === id ? { ...item, remarks: text } : item));
  };

  const handleSubmit = () => {
    toast({
      title: "GRN Submitted",
      description: "Goods Receipt Note #GRN-2025-045 created successfully.",
    });
    // In a real app, this would update inventory
    setTimeout(() => {
      router.push('/project-management/procurement/bom-reception'); // Loop back to start or dashboard
    }, 1500);
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GRN Entry & Verification</h1>
            <p className="text-sm text-gray-500">Step 4.8: Record received goods and verify quality</p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Submit GRN
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Received Items</CardTitle>
              <CardDescription>Verify quantity and quality against PO</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Accept</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={item.accepted}
                          onChange={(e) => handleAcceptChange(item.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.orderedQty}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.receivedQty}
                          onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
                          className={`w-20 h-8 ${item.receivedQty !== item.orderedQty ? 'border-orange-500 bg-orange-50' : ''}`}
                        />
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Input
                          value={item.remarks}
                          onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                          placeholder="Issues?"
                          className="h-8"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label>PO Reference</Label>
                <Input value="PO-2025-088" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Vendor Invoice No.</Label>
                <Input placeholder="INV-12345" />
              </div>
              <div className="space-y-2">
                <Label>Received Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label>Received By</Label>
                <Input defaultValue="Store Manager" />
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mt-4">
                <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Quality Check
                </h4>
                <p className="text-sm text-yellow-700">
                  Ensure all items are inspected for damages before accepting. Rejected items should be marked in remarks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
