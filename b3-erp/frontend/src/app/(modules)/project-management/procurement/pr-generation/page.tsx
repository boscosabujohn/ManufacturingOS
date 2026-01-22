'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FilePlus, Trash2, Save, Send } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

interface PRItem {
  id: string;
  name: string;
  category: string;
  shortfallQty: number;
  orderQty: number;
  unit: string;
  preferredVendor: string;
}

const mockShortfallItems: PRItem[] = [
  { id: 'ITM-002', name: 'Laminate - White Gloss', category: 'Finish', shortfallQty: 20, orderQty: 25, unit: 'sheets', preferredVendor: 'Merino' },
  { id: 'ITM-003', name: 'Hettich Soft Close Hinge', category: 'Hardware', shortfallQty: 55, orderQty: 60, unit: 'pcs', preferredVendor: 'Hettich India' },
];

export default function GeneratePRPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<PRItem[]>(mockShortfallItems);
  const [notes, setNotes] = useState('');

  const handleQuantityChange = (id: string, qty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, orderQty: qty } : item));
  };

  const handleVendorChange = (id: string, vendor: string) => {
    setItems(items.map(item => item.id === id ? { ...item, preferredVendor: vendor } : item));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSubmit = () => {
    toast({
      title: "PR Generated",
      description: "Purchase Requisition submitted for approval.",
    });
    setTimeout(() => {
      router.push('/project-management/procurement/approvals');
    }, 1500);
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Purchase Requisition</h1>
            <p className="text-sm text-gray-500">Step 4.3: Create PR for shortfall items identified in stock check</p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4 mr-2" />
          Submit for Approval
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisition Items</CardTitle>
              <CardDescription>Review and adjust quantities before submission</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Shortfall</TableHead>
                    <TableHead className="w-[100px]">Order Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Preferred Vendor</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">{item.shortfallQty}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.orderQty}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-20 h-8"
                        />
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Select
                          value={item.preferredVendor}
                          onValueChange={(val) => handleVendorChange(item.id, val)}
                        >
                          <SelectTrigger className="h-8 w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Merino">Merino</SelectItem>
                            <SelectItem value="Greenlam">Greenlam</SelectItem>
                            <SelectItem value="Hettich India">Hettich India</SelectItem>
                            <SelectItem value="Hafele">Hafele</SelectItem>
                            <SelectItem value="Generic">Generic</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Reference</Label>
                <Input value="Villa 45 - Kitchen" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Required By Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="High">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High (Urgent)</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes / Justification</Label>
                <Textarea
                  placeholder="Reason for purchase..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-24"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
