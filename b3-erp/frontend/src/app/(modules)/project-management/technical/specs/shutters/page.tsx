'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ArrowRight, Layers, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/Textarea';

export default function ShutterSpecsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [glassSpecs, setGlassSpecs] = useState({ type: 'Toughened', thickness: '5mm', finish: 'Clear', notes: '' });
  const [woodSpecs, setWoodSpecs] = useState({ core: 'MDF', finish: 'Laminate', edgeBand: '2mm PVC', notes: '' });
  const [stoneSpecs, setStoneSpecs] = useState({ material: 'Granite', thickness: '20mm', edgeProfile: 'Chamfered', notes: '' });
  const [metalSpecs, setMetalSpecs] = useState({ material: 'SS 304', finish: 'Brushed', gauge: '18G', notes: '' });

  const handleSave = () => {
    toast({
      title: "Specifications Saved",
      description: "Shutter and material specifications have been updated.",
    });
  };

  const handleNext = () => {
    router.push('/project-management/technical/validation');
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shutter Specifications</h1>
            <p className="text-sm text-gray-500">Step 3.6: Define material specifications for shutters and finishes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            Next: BOM Validation <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="wood" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wood">Wood / Laminate</TabsTrigger>
          <TabsTrigger value="glass">Glass Shutters</TabsTrigger>
          <TabsTrigger value="stone">Stone / Countertops</TabsTrigger>
          <TabsTrigger value="metal">Metal / SS</TabsTrigger>
        </TabsList>

        <TabsContent value="wood">
          <Card>
            <CardHeader>
              <CardTitle>Wood & Laminate Specifications</CardTitle>
              <CardDescription>Details for wooden shutters and panels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Core Material</Label>
                  <Input value={woodSpecs.core} onChange={(e) => setWoodSpecs({ ...woodSpecs, core: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Finish / Laminate</Label>
                  <Input value={woodSpecs.finish} onChange={(e) => setWoodSpecs({ ...woodSpecs, finish: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Edge Banding</Label>
                  <Input value={woodSpecs.edgeBand} onChange={(e) => setWoodSpecs({ ...woodSpecs, edgeBand: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea value={woodSpecs.notes} onChange={(e) => setWoodSpecs({ ...woodSpecs, notes: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glass">
          <Card>
            <CardHeader>
              <CardTitle>Glass Specifications</CardTitle>
              <CardDescription>Details for glass shutters and shelves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Glass Type</Label>
                  <Input value={glassSpecs.type} onChange={(e) => setGlassSpecs({ ...glassSpecs, type: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Thickness</Label>
                  <Input value={glassSpecs.thickness} onChange={(e) => setGlassSpecs({ ...glassSpecs, thickness: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Finish / Tint</Label>
                  <Input value={glassSpecs.finish} onChange={(e) => setGlassSpecs({ ...glassSpecs, finish: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea value={glassSpecs.notes} onChange={(e) => setGlassSpecs({ ...glassSpecs, notes: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stone">
          <Card>
            <CardHeader>
              <CardTitle>Stone & Countertop Specifications</CardTitle>
              <CardDescription>Details for granite, marble, or quartz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Material Name</Label>
                  <Input value={stoneSpecs.material} onChange={(e) => setStoneSpecs({ ...stoneSpecs, material: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Thickness</Label>
                  <Input value={stoneSpecs.thickness} onChange={(e) => setStoneSpecs({ ...stoneSpecs, thickness: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Edge Profile</Label>
                  <Input value={stoneSpecs.edgeProfile} onChange={(e) => setStoneSpecs({ ...stoneSpecs, edgeProfile: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea value={stoneSpecs.notes} onChange={(e) => setStoneSpecs({ ...stoneSpecs, notes: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metal">
          <Card>
            <CardHeader>
              <CardTitle>Metal & SS Specifications</CardTitle>
              <CardDescription>Details for stainless steel tops and fascia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Material Grade</Label>
                  <Input value={metalSpecs.material} onChange={(e) => setMetalSpecs({ ...metalSpecs, material: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Finish</Label>
                  <Input value={metalSpecs.finish} onChange={(e) => setMetalSpecs({ ...metalSpecs, finish: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Gauge / Thickness</Label>
                  <Input value={metalSpecs.gauge} onChange={(e) => setMetalSpecs({ ...metalSpecs, gauge: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea value={metalSpecs.notes} onChange={(e) => setMetalSpecs({ ...metalSpecs, notes: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
