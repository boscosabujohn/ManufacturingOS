'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
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

interface Payment {
  id: string;
  poId: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: string;
}

const mockPayments: Payment[] = [
  { id: 'PAY-001', poId: 'PO-2025-088', vendor: 'Merino Industries', amount: 15000, dueDate: '2025-02-01', status: 'Paid', method: 'Bank Transfer' },
  { id: 'PAY-002', poId: 'PO-2025-089', vendor: 'Hettich India', amount: 28500, dueDate: '2025-02-15', status: 'Pending', method: 'Cheque' },
  { id: 'PAY-003', poId: 'PO-2025-090', vendor: 'Greenlam', amount: 45000, dueDate: '2025-02-20', status: 'Pending', method: 'NEFT' },
];

export default function PaymentProcessingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const handleProcessPayment = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    toast({
      title: "Payment Processed",
      description: `Payment ${id} has been marked as Paid.`,
    });
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Processing</h1>
            <p className="text-sm text-gray-500">Step 4.7: Manage vendor payments and track financial milestones</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {payments.filter(p => p.status === 'Pending').length} invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Due</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Due within 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>Track and process payments linked to Purchase Orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.poId}</TableCell>
                  <TableCell>{payment.vendor}</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell className="font-bold">₹ {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'Paid' ? 'default' :
                        payment.status === 'Overdue' ? 'destructive' : 'outline'
                    }>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === 'Pending' && (
                      <Button size="sm" onClick={() => handleProcessPayment(payment.id)}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </Button>
                    )}
                    {payment.status === 'Paid' && (
                      <Button size="sm" variant="ghost" disabled>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Completed
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
