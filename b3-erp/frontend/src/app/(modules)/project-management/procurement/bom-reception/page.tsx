'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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

interface BOMRequest {
  id: string;
  projectName: string;
  submittedBy: string;
  date: string;
  itemsCount: number;
  status: 'Pending' | 'Processing' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

const mockBOMs: BOMRequest[] = [
  { id: 'BOM-001', projectName: 'Villa 45 - Kitchen', submittedBy: 'Alex Tech', date: '2025-02-01', itemsCount: 45, status: 'Pending', priority: 'High' },
  { id: 'BOM-002', projectName: 'Office Complex - A', submittedBy: 'Sarah Design', date: '2025-02-02', itemsCount: 120, status: 'Processing', priority: 'Medium' },
  { id: 'BOM-003', projectName: 'Apt 102 - Wardrobes', submittedBy: 'Mike CAD', date: '2025-02-03', itemsCount: 28, status: 'Completed', priority: 'Low' },
];

export default function BOMReceptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [boms, setBoms] = useState<BOMRequest[]>(mockBOMs);

  const handleInitiate = (id: string) => {
    toast({
      title: "Procurement Initiated",
      description: `Started procurement process for ${id}`,
    });
    setBoms(boms.map(b => b.id === id ? { ...b, status: 'Processing' } : b));

    // Simulate navigation to next step
    setTimeout(() => {
      router.push('/project-management/procurement/stock-check');
    }, 1000);
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BOM Reception</h1>
            <p className="text-sm text-gray-500">Step 4.1: Receive and process validated BOMs from Technical team</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending BOMs</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boms.filter(b => b.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Processing</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boms.filter(b => b.status === 'Processing').length}</div>
            <p className="text-xs text-muted-foreground">Stock check in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boms.filter(b => b.status === 'Completed').length}</div>
            <p className="text-xs text-muted-foreground">Sent for PO creation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming BOM Requests</CardTitle>
          <CardDescription>Manage and initiate procurement for new projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOM ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boms.map((bom) => (
                <TableRow key={bom.id}>
                  <TableCell className="font-medium">{bom.id}</TableCell>
                  <TableCell>{bom.projectName}</TableCell>
                  <TableCell>{bom.submittedBy}</TableCell>
                  <TableCell>{bom.date}</TableCell>
                  <TableCell>{bom.itemsCount}</TableCell>
                  <TableCell>
                    <Badge variant={bom.priority === 'High' ? 'destructive' : 'secondary'}>
                      {bom.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      bom.status === 'Pending' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        bom.status === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-green-100 text-green-800 border-green-200'
                    }>
                      {bom.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {bom.status === 'Pending' && (
                      <Button size="sm" onClick={() => handleInitiate(bom.id)}>
                        Initiate
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    {bom.status === 'Processing' && (
                      <Button size="sm" variant="outline" onClick={() => router.push('/project-management/procurement/stock-check')}>
                        Continue
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
