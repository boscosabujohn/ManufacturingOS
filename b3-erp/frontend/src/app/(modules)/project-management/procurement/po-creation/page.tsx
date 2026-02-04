'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Printer, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from '@/components/ui/Textarea';

interface POItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

const mockPOItems: POItem[] = [
  { id: '1', description: 'Laminate - White Gloss (Merino)', qty: 25, unit: 'sheets', rate: 1200, amount: 30000 },
  { id: '2', description: 'Hettich Soft Close Hinge', qty: 60, unit: 'pcs', rate: 250, amount: 15000 },
];

export default function POCreationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [vendor, setVendor] = useState('Merino Industries Ltd.');
  const [items, setItems] = useState<POItem[]>(mockPOItems);

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = totalAmount * 0.18;
  const grandTotal = totalAmount + tax;

  const handleCreatePO = () => {
    toast({
      title: "Purchase Order Created",
      description: "PO #PO-2025-090 has been generated and sent to vendor.",
    });
    setTimeout(() => {
      router.push('/project-management/procurement/vendor-tracking');
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
            <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
            <p className="text-sm text-gray-500">Step 4.5: Generate PO from approved requisition</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Draft
          </Button>
          <Button onClick={handleCreatePO} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Issue PO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>PO Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Vendor</Label>
                  <Select value={vendor} onValueChange={setVendor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Merino Industries Ltd.">Merino Industries Ltd.</SelectItem>
                      <SelectItem value="Greenlam Industries">Greenlam Industries</SelectItem>
                      <SelectItem value="Hettich India Pvt Ltd">Hettich India Pvt Ltd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>PO Date</Label>
                  <Input type="date" defaultValue="2025-02-12" />
                </div>
                <div className="space-y-2">
                  <Label>Reference PR</Label>
                  <Input value="PR-2025-001" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Expected Delivery</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shipping Address</Label>
                <Textarea defaultValue="Factory Unit 2, Industrial Area, Sector 5, Bangalore - 560001" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>₹ {item.rate}</TableCell>
                      <TableCell className="text-right">₹ {item.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end space-y-2 border-t pt-4">
              <div className="flex justify-between w-48 text-sm">
                <span>Subtotal:</span>
                <span>₹ {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-48 text-sm">
                <span>GST (18%):</span>
                <span>₹ {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-48 font-bold text-lg">
                <span>Total:</span>
                <span>₹ {grandTotal.toLocaleString()}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select defaultValue="Net 30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advance">100% Advance</SelectItem>
                    <SelectItem value="Net 30">Net 30 Days</SelectItem>
                    <SelectItem value="Net 60">Net 60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes to Vendor</Label>
                <Textarea placeholder="Special instructions..." className="h-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
