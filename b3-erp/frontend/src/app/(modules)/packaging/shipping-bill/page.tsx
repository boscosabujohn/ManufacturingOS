'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    FileText,
    Package,
    Printer,
    Download,
    CheckCircle2
} from 'lucide-react';

interface ShippingBillItem {
    id: string;
    itemDescription: string;
    quantity: number;
    packageType: string;
    weight: string;
    dimensions: string;
}

interface ShippingBill {
    billNumber: string;
    orderNumber: string;
    customerName: string;
    destination: string;
    items: ShippingBillItem[];
    totalPackages: number;
    totalWeight: string;
    status: 'Draft' | 'Generated' | 'Printed';
}

export default function ShippingBillPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [bills, setBills] = useState<ShippingBill[]>([
        {
            billNumber: 'SB-2024-001',
            orderNumber: 'ORD-KT-345',
            customerName: 'Pearl Apartments - Tower A',
            destination: 'Bangalore, Karnataka',
            items: [
                { id: '1', itemDescription: 'Modular Kitchen Cabinet Set', quantity: 15, packageType: 'Wooden Crate', weight: '450 kg', dimensions: '200x80x60 cm' },
                { id: '2', itemDescription: 'Kitchen Accessories Kit', quantity: 3, packageType: 'Cardboard Box', weight: '25 kg', dimensions: '50x40x30 cm' },
            ],
            totalPackages: 18,
            totalWeight: '475 kg',
            status: 'Generated'
        },
        {
            billNumber: 'SB-2024-002',
            orderNumber: 'ORD-KT-346',
            customerName: 'Villa Project - Phase 2',
            destination: 'Chennai, Tamil Nadu',
            items: [
                { id: '1', itemDescription: 'Kitchen Base Units', quantity: 20, packageType: 'Wooden Crate', weight: '600 kg', dimensions: '220x90x70 cm' },
            ],
            totalPackages: 20,
            totalWeight: '600 kg',
            status: 'Draft'
        }
    ]);

    const [selectedBill, setSelectedBill] = useState<ShippingBill | null>(bills[0]);

    const handleGenerateBill = (billNumber: string) => {
        setBills(bills.map(bill =>
            bill.billNumber === billNumber ? { ...bill, status: 'Generated' } : bill
        ));
        toast({
            title: 'Shipping Bill Generated',
            description: `${billNumber} has been generated successfully`,
        });
    };

    const handlePrintBill = (billNumber: string) => {
        setBills(bills.map(bill =>
            bill.billNumber === billNumber ? { ...bill, status: 'Printed' } : bill
        ));
        toast({
            title: 'Printing Shipping Bill',
            description: `${billNumber} is being sent to printer`,
        });
    };

    const getStatusBadge = (status: ShippingBill['status']) => {
        switch (status) {
            case 'Printed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
            case 'Generated':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="w-full py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FileText className="h-8 w-8 text-orange-600" />
                        6.7 Generate Shipping Bill
                    </h1>
                    <p className="text-muted-foreground">
                        Create and manage shipping documentation for packed orders.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/packaging/operations')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => router.push('/packaging/staging')}>
                        Next: Dispatch Staging <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bills List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Shipping Bills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {bills.map((bill) => (
                            <div
                                key={bill.billNumber}
                                className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 ${selectedBill?.billNumber === bill.billNumber ? 'border-orange-600 bg-orange-50' : ''
                                    }`}
                                onClick={() => setSelectedBill(bill)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium">{bill.billNumber}</div>
                                    {getStatusBadge(bill.status)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {bill.customerName}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {bill.totalPackages} packages • {bill.totalWeight}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Bill Details */}
                {selectedBill && (
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Bill Details: {selectedBill.billNumber}</CardTitle>
                                <div className="flex gap-2">
                                    {selectedBill.status === 'Draft' && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleGenerateBill(selectedBill.billNumber)}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                            Generate
                                        </Button>
                                    )}
                                    {selectedBill.status === 'Generated' && (
                                        <Button
                                            size="sm"
                                            onClick={() => handlePrintBill(selectedBill.billNumber)}
                                        >
                                            <Printer className="h-4 w-4 mr-1" />
                                            Print
                                        </Button>
                                    )}
                                    {selectedBill.status === 'Printed' && (
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" />
                                            Download PDF
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <div className="text-sm text-muted-foreground">Order Number</div>
                                    <div className="font-medium">{selectedBill.orderNumber}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Customer</div>
                                    <div className="font-medium">{selectedBill.customerName}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Destination</div>
                                    <div className="font-medium">{selectedBill.destination}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Status</div>
                                    <div>{getStatusBadge(selectedBill.status)}</div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 className="font-semibold mb-3">Package Items</h3>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="p-3 text-left font-medium">Description</th>
                                                <th className="p-3 text-left font-medium">Qty</th>
                                                <th className="p-3 text-left font-medium">Package Type</th>
                                                <th className="p-3 text-left font-medium">Weight</th>
                                                <th className="p-3 text-left font-medium">Dimensions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedBill.items.map((item) => (
                                                <tr key={item.id} className="border-t">
                                                    <td className="p-3">{item.itemDescription}</td>
                                                    <td className="p-3">{item.quantity}</td>
                                                    <td className="p-3">{item.packageType}</td>
                                                    <td className="p-3">{item.weight}</td>
                                                    <td className="p-3">{item.dimensions}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-muted/30 font-medium">
                                            <tr>
                                                <td className="p-3">Total</td>
                                                <td className="p-3">{selectedBill.totalPackages}</td>
                                                <td className="p-3">-</td>
                                                <td className="p-3">{selectedBill.totalWeight}</td>
                                                <td className="p-3">-</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
