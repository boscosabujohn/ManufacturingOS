'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, ChevronRight } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApprovalRequest {
  id: string;
  type: string;
  project: string;
  amount: string;
  requester: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  level: 'L1' | 'L2' | 'L3';
}

const mockRequests: ApprovalRequest[] = [
  { id: 'PR-2025-001', type: 'Purchase Requisition', project: 'Villa 45 - Kitchen', amount: '₹ 45,000', requester: 'John Doe', date: '2025-02-10', status: 'Pending', level: 'L1' },
  { id: 'PR-2025-002', type: 'Purchase Requisition', project: 'Office Complex - A', amount: '₹ 1,20,000', requester: 'Jane Smith', date: '2025-02-11', status: 'Pending', level: 'L2' },
  { id: 'PO-2025-089', type: 'Purchase Order', project: 'Apt 102 - Wardrobes', amount: '₹ 28,500', requester: 'Mike CAD', date: '2025-02-09', status: 'Approved', level: 'L1' },
];

export default function ApprovalWorkflowPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    toast({
      title: "Request Approved",
      description: `${id} has been approved successfully.`,
    });
    // Simulate navigation to PO creation if it's a PR
    if (id.startsWith('PR')) {
      setTimeout(() => {
        router.push('/project-management/procurement/po-creation');
      }, 1000);
    }
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    toast({
      title: "Request Rejected",
      description: `${id} has been returned to the requester.`,
      variant: "destructive",
    });
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
            <p className="text-sm text-gray-500">Step 4.4: Review and approve procurement requests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter(r => r.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter(r => r.status === 'Approved').length}</div>
            <p className="text-xs text-muted-foreground">Processed successfully</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter(r => r.status === 'Rejected').length}</div>
            <p className="text-xs text-muted-foreground">Returned for revision</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
          <CardDescription>Manage PRs and POs requiring authorization</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.status === 'Pending').map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {req.id}
                      </TableCell>
                      <TableCell>{req.type}</TableCell>
                      <TableCell>{req.project}</TableCell>
                      <TableCell className="font-bold">{req.amount}</TableCell>
                      <TableCell>{req.requester}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{req.level}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(req.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(req.id)}>
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.filter(r => r.status === 'Pending').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No pending approvals found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="history">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.status !== 'Pending').map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>{req.type}</TableCell>
                      <TableCell>{req.project}</TableCell>
                      <TableCell>{req.amount}</TableCell>
                      <TableCell>
                        <Badge variant={req.status === 'Approved' ? 'default' : 'destructive'}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{req.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
