'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Package, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
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
import { Progress } from "@/components/ui/progress";

interface StockItem {
  id: string;
  name: string;
  category: string;
  requiredQty: number;
  availableQty: number;
  unit: string;
  status: 'Available' | 'Shortfall';
}

const mockStockItems: StockItem[] = [
  { id: 'ITM-001', name: 'Plywood 18mm MR Grade', category: 'Wood', requiredQty: 50, availableQty: 120, unit: 'sheets', status: 'Available' },
  { id: 'ITM-002', name: 'Laminate - White Gloss', category: 'Finish', requiredQty: 30, availableQty: 10, unit: 'sheets', status: 'Shortfall' },
  { id: 'ITM-003', name: 'Hettich Soft Close Hinge', category: 'Hardware', requiredQty: 100, availableQty: 45, unit: 'pcs', status: 'Shortfall' },
  { id: 'ITM-004', name: 'Fevicol SH', category: 'Adhesive', requiredQty: 20, availableQty: 50, unit: 'kg', status: 'Available' },
];

export default function StockCheckPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<StockItem[]>(mockStockItems);
  const [isChecking, setIsChecking] = useState(false);

  const shortfallCount = items.filter(i => i.status === 'Shortfall').length;
  const availableCount = items.filter(i => i.status === 'Available').length;
  const progress = (availableCount / items.length) * 100;

  const handleRecheck = () => {
    setIsChecking(true);
    toast({
      title: "Checking Inventory",
      description: "Syncing with warehouse database...",
    });
    setTimeout(() => {
      setIsChecking(false);
      toast({
        title: "Stock Check Complete",
        description: "Inventory data updated.",
      });
    }, 1500);
  };

  const handleGeneratePR = () => {
    router.push('/project-management/procurement/pr-generation');
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Availability Check</h1>
            <p className="text-sm text-gray-500">Step 4.2: Verify inventory levels against BOM requirements</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRecheck} disabled={isChecking}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Re-check Stock
          </Button>
          <Button onClick={handleGeneratePR} className={shortfallCount > 0 ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}>
            {shortfallCount > 0 ? "Generate PR for Shortfall" : "Proceed to PO"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>BOM vs Inventory Analysis</CardTitle>
            <CardDescription>Detailed breakdown of material availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.requiredQty} {item.unit}</TableCell>
                    <TableCell className={item.availableQty < item.requiredQty ? "text-red-600 font-bold" : "text-green-600"}>
                      {item.availableQty} {item.unit}
                    </TableCell>
                    <TableCell>
                      {item.status === 'Available' ? (
                        <span className="flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" /> Available
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Shortfall
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Availability Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fulfillment Rate</span>
                  <span className="font-bold">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                  <div className="text-2xl font-bold text-green-700">{availableCount}</div>
                  <div className="text-xs text-green-600">Items Available</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center">
                  <div className="text-2xl font-bold text-red-700">{shortfallCount}</div>
                  <div className="text-xs text-red-600">Items Short</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Next Action
                </h4>
                <p className="text-sm text-blue-700">
                  {shortfallCount > 0
                    ? "Purchase Requisition (PR) needs to be generated for the shortfall items."
                    : "All items are in stock. You can proceed directly to material allocation."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
