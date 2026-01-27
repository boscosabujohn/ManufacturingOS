'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckSquare, FileSpreadsheet, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, BOQItem } from '@/services/ProjectManagementService';

export default function BOQCheckPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<BOQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await projectManagementService.getBOQItems('current-project');
      setItems(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load BOQ items.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: string, newQty: string) => {
    const qty = parseInt(newQty) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          drawingQty: qty,
          status: qty === item.boqQty ? 'Match' : 'Mismatch'
        };
      }
      return item;
    }));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, notes } : item
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save all items (in a real app, this might be a batch update)
      await Promise.all(items.map(item =>
        projectManagementService.updateBOQItem(item.id, item.drawingQty, item.notes)
      ));

      toast({
        title: "Verification Saved",
        description: "BOQ cross-check data has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save verification data.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "BOQ discrepancy report has been downloaded.",
    });
  };

  const mismatchCount = items.filter(i => i.status === 'Mismatch').length;

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BOQ Cross-Check</h1>
          <p className="text-sm text-gray-500">Step 2.2: Verify BOQ quantities match drawing specifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>BOQ Items Review</CardTitle>
            <CardDescription>Compare listed items with drawing callouts. Update 'Drawing Qty' to verify.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-gray-500">Loading items...</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">Item Description</th>
                      <th className="px-4 py-3 font-medium text-gray-700 w-24">BOQ Qty</th>
                      <th className="px-4 py-3 font-medium text-gray-700 w-32">Drawing Qty</th>
                      <th className="px-4 py-3 font-medium text-gray-700 w-24">Status</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{item.description}</td>
                        <td className="px-4 py-3 text-gray-600">{item.boqQty}</td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            value={item.drawingQty}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-20 h-8"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={item.status === 'Match' ? 'default' : 'destructive'} className={item.status === 'Match' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {item.status === 'Mismatch' && (
                            <Input
                              placeholder="Reason for mismatch..."
                              value={item.notes || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              className="h-8 text-xs"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Verification results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mismatchCount > 0 ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">Discrepancies Detected</h4>
                    <p className="text-xs text-red-700 mt-1">{mismatchCount} item(s) have quantity mismatches. Please review and add notes.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-green-900">All Items Match</h4>
                    <p className="text-xs text-green-700 mt-1">BOQ quantities align with drawing specifications.</p>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <Button className="w-full" onClick={handleSave} disabled={loading || saving}>
                  {saving ? 'Saving...' : 'Save Verification'}
                </Button>
                <Button className="w-full" variant="outline" onClick={handleGenerateReport}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
