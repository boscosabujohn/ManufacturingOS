'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, Trash2, ArrowRight, Package } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface AccessoryItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
}

const mockAccessories: AccessoryItem[] = [
  { id: '1', category: 'Hinges', name: 'Soft Close Hinge 110°', quantity: 24, unit: 'pcs', notes: 'Blum or Hettich' },
  { id: '2', category: 'Handles', name: 'Brushed Nickel Bar Handle', quantity: 12, unit: 'pcs', notes: '128mm center' },
];

export default function AccessoriesBOMPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<AccessoryItem[]>(mockAccessories);
  const [newItem, setNewItem] = useState<Partial<AccessoryItem>>({ category: '', name: '', quantity: 1, unit: 'pcs', notes: '' });

  const handleAddItem = () => {
    if (!newItem.category || !newItem.name) {
      toast({
        title: "Missing Information",
        description: "Please select a category and name.",
        variant: "destructive",
      });
      return;
    }

    const item: AccessoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: newItem.category || '',
      name: newItem.name || '',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'pcs',
      notes: newItem.notes || '',
    };

    setItems([...items, item]);
    setNewItem({ category: '', name: '', quantity: 1, unit: 'pcs', notes: '' });
    toast({
      title: "Item Added",
      description: "Accessory added to BOM.",
    });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = () => {
    toast({
      title: "BOM Saved",
      description: "Accessories BOM has been saved successfully.",
    });
  };

  const handleNext = () => {
    router.push('/project-management/technical/specs/shutters');
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accessories BOM</h1>
            <p className="text-sm text-gray-500">Step 3.5: Define fittings, hardware, and accessories</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            Next: Shutter Specs <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Bill of Materials</CardTitle>
              <CardDescription>List of required accessories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{item.notes}</TableCell>
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

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Add Item</CardTitle>
              <CardDescription>Add new accessory to BOM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hinges">Hinges</SelectItem>
                    <SelectItem value="Handles">Handles</SelectItem>
                    <SelectItem value="Runners">Drawer Runners</SelectItem>
                    <SelectItem value="Lift Systems">Lift Systems</SelectItem>
                    <SelectItem value="Locks">Locks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="e.g., Soft Close Hinge"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select
                    value={newItem.unit}
                    onValueChange={(val) => setNewItem({ ...newItem, unit: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="sets">Sets</SelectItem>
                      <SelectItem value="pairs">Pairs</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  placeholder="Brand, finish, etc."
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add to BOM
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
