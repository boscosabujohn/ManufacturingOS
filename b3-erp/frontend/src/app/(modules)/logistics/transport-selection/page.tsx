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
    Truck,
    Ship,
    Plane,
    MapPin,
    IndianRupee
} from 'lucide-react';

interface TransportOption {
    id: string;
    mode: 'Road' | 'Rail' | 'Air' | 'Sea';
    provider: string;
    estimatedDays: number;
    cost: number;
    capacity: string;
    suitableFor: string;
}

export default function TransportSelectionPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [destination] = useState('Bangalore, Karnataka');
    const [distance] = useState('350 km');
    const [selectedTransport, setSelectedTransport] = useState<string | null>(null);

    const transportOptions: TransportOption[] = [
        { id: '1', mode: 'Road', provider: 'TCI Express', estimatedDays: 2, cost: 15000, capacity: '10 tons', suitableFor: 'Local & Regional' },
        { id: '2', mode: 'Road', provider: 'VRL Logistics', estimatedDays: 3, cost: 12000, capacity: '10 tons', suitableFor: 'Economy Option' },
        { id: '3', mode: 'Rail', provider: 'Indian Railways', estimatedDays: 5, cost: 8000, capacity: '20 tons', suitableFor: 'Bulk Shipment' },
        { id: '4', mode: 'Air', provider: 'Blue Dart', estimatedDays: 1, cost: 45000, capacity: '2 tons', suitableFor: 'Express Delivery' },
    ];

    const handleSelectTransport = (id: string, provider: string) => {
        setSelectedTransport(id);
        toast({
            title: 'Transport Selected',
            description: `${provider} has been selected for this delivery`,
        });
    };

    const getModeIcon = (mode: TransportOption['mode']) => {
        switch (mode) {
            case 'Road': return <Truck className="h-5 w-5" />;
            case 'Rail': return <Truck className="h-5 w-5" />;
            case 'Air': return <Plane className="h-5 w-5" />;
            case 'Sea': return <Ship className="h-5 w-5" />;
        }
    };

    const getModeColor = (mode: TransportOption['mode']) => {
        switch (mode) {
            case 'Road': return 'bg-blue-100 text-blue-800';
            case 'Rail': return 'bg-green-100 text-green-800';
            case 'Air': return 'bg-purple-100 text-purple-800';
            case 'Sea': return 'bg-cyan-100 text-cyan-800';
        }
    };

    return (
        <div className="w-full py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Truck className="h-8 w-8 text-orange-600" />
                        7.3 Transport Selection
                    </h1>
                    <p className="text-muted-foreground">
                        Choose optimal transport method based on location, urgency, and cost.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/accounts/billing')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={() => router.push('/logistics/site-location')}
                        disabled={!selectedTransport}
                    >
                        Next: Site Location <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <MapPin className="h-6 w-6 text-blue-600" />
                        <div>
                            <div className="font-medium">Delivery Destination</div>
                            <div className="text-blue-600 text-sm">{destination} • {distance} from factory</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {transportOptions.map((option) => (
                    <Card
                        key={option.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${selectedTransport === option.id ? 'border-2 border-orange-600' : ''
                            }`}
                        onClick={() => handleSelectTransport(option.id, option.provider)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${getModeColor(option.mode)} hover:${getModeColor(option.mode)}`}>
                                            {getModeIcon(option.mode)}
                                            <span className="ml-1">{option.mode}</span>
                                        </Badge>
                                        {selectedTransport === option.id && (
                                            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                                                Selected
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl">{option.provider}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{option.suitableFor}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Estimated Time</div>
                                    <div className="font-bold text-lg">{option.estimatedDays} days</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Cost</div>
                                    <div className="font-bold text-lg flex items-center">
                                        <IndianRupee className="h-4 w-4" />
                                        {option.cost.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Capacity</div>
                                    <div className="font-bold text-lg">{option.capacity}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedTransport && (
                <Card className="border-l-4 border-l-green-500 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="text-sm text-green-600">
                            ✓ Transport method selected. Click "Next" to proceed with site location details.
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
