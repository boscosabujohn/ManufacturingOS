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
    Package,
    AlertTriangle,
    CheckCircle2,
    ShoppingCart
} from 'lucide-react';

interface PackingMaterial {
    id: string;
    name: string;
    category: 'Crates' | 'Wrapping' | 'Branding' | 'Protection';
    currentStock: number;
    required: number;
    unit: string;
    status: 'Available' | 'Low Stock' | 'Out of Stock';
}

export default function PackingMaterialsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [materials, setMaterials] = useState<PackingMaterial[]>([
        { id: 'PM-001', name: 'Wooden Crates (Large)', category: 'Crates', currentStock: 45, required: 20, unit: 'pcs', status: 'Available' },
        { id: 'PM-002', name: 'Wrapping Rolls (Bubble)', category: 'Wrapping', currentStock: 8, required: 15, unit: 'rolls', status: 'Low Stock' },
        { id: 'PM-003', name: 'Branding Stickers', category: 'Branding', currentStock: 500, required: 100, unit: 'pcs', status: 'Available' },
        { id: 'PM-004', name: 'Thermocol Sheets', category: 'Protection', currentStock: 0, required: 25, unit: 'sheets', status: 'Out of Stock' },
        { id: 'PM-005', name: 'Wooden Crates (Medium)', category: 'Crates', currentStock: 30, required: 10, unit: 'pcs', status: 'Available' },
        { id: 'PM-006', name: 'Stretch Film', category: 'Wrapping', currentStock: 12, required: 8, unit: 'rolls', status: 'Available' },
    ]);

    const handleRequestPurchase = (id: string, name: string) => {
        toast({
            title: 'Purchase Request Created',
            description: `Purchase request initiated for ${name}`,
        });
    };

    const getStatusBadge = (status: PackingMaterial['status']) => {
        switch (status) {
            case 'Available':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />{status}</Badge>;
            case 'Low Stock':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertTriangle className="h-3 w-3 mr-1" />{status}</Badge>;
            case 'Out of Stock':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="h-3 w-3 mr-1" />{status}</Badge>;
        }
    };

    const availableCount = materials.filter(m => m.status === 'Available').length;
    const lowStockCount = materials.filter(m => m.status === 'Low Stock').length;
    const outOfStockCount = materials.filter(m => m.status === 'Out of Stock').length;

    return (
        <div className="w-full py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Package className="h-8 w-8 text-orange-600" />
                        6.5 Check Packing Materials
                    </h1>
                    <p className="text-muted-foreground">
                        Verify availability of packing materials before packaging operations.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/quality/approvals')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => router.push('/packaging/operations')}>
                        Next: Package Products <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {(lowStockCount > 0 || outOfStockCount > 0) && (
                <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                    <CardContent className="pt-6 flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                        <div>
                            <h3 className="font-bold text-yellow-700">Stock Alert</h3>
                            <p className="text-yellow-600">
                                {outOfStockCount > 0 && `${outOfStockCount} material(s) out of stock. `}
                                {lowStockCount > 0 && `${lowStockCount} material(s) running low. `}
                                Create purchase requests before proceeding to packaging.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{availableCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Packing Material Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Material ID</th>
                                    <th className="p-4 font-medium">Material Name</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium">Current Stock</th>
                                    <th className="p-4 font-medium">Required</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material) => (
                                    <tr key={material.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4 font-medium">{material.id}</td>
                                        <td className="p-4">{material.name}</td>
                                        <td className="p-4">
                                            <Badge variant="outline">{material.category}</Badge>
                                        </td>
                                        <td className="p-4">
                                            <span className={material.currentStock < material.required ? 'text-red-600 font-bold' : ''}>
                                                {material.currentStock} {material.unit}
                                            </span>
                                        </td>
                                        <td className="p-4">{material.required} {material.unit}</td>
                                        <td className="p-4">
                                            {getStatusBadge(material.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            {material.status !== 'Available' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRequestPurchase(material.id, material.name)}
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                                    Request
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
