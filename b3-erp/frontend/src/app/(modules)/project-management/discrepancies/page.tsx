'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Filter, AlertOctagon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, Discrepancy } from '@/services/ProjectManagementService';

export default function DiscrepanciesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    reportedBy: 'Current User' // Mock user
  });

  useEffect(() => {
    loadDiscrepancies();
  }, []);

  const loadDiscrepancies = async () => {
    try {
      const data = await projectManagementService.getDiscrepancies('current-project');
      setDiscrepancies(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load discrepancies.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async () => {
    if (!newIssue.title || !newIssue.description) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const created = await projectManagementService.createDiscrepancy(newIssue);
      setDiscrepancies([created, ...discrepancies]);
      setIsDialogOpen(false);
      setNewIssue({ title: '', description: '', priority: 'Medium', reportedBy: 'Current User' });
      toast({
        title: "Issue Logged",
        description: "New discrepancy has been recorded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log new issue.",
      });
    }
  };

  const handleFilter = () => {
    toast({
      title: "Filter Applied",
      description: "Showing active issues only.",
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
            <h1 className="text-2xl font-bold text-gray-900">Log Discrepancies</h1>
            <p className="text-sm text-gray-500">Step 2.3: Record mismatches for client clarification</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Log New Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Log New Discrepancy</DialogTitle>
              <DialogDescription>
                Describe the issue found during verification.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Quantity Mismatch"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newIssue.priority}
                  onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewIssue({ ...newIssue, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - Critical Blocker</SelectItem>
                    <SelectItem value="Medium">Medium - Needs Resolution</SelectItem>
                    <SelectItem value="Low">Low - Minor Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the discrepancy..."
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateIssue}>Log Issue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Issues</CardTitle>
              <CardDescription>Track resolution of identified discrepancies</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-gray-500">Loading discrepancies...</p>
            ) : (
              <div className="space-y-4">
                {discrepancies.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No discrepancies logged yet.</p>
                ) : (
                  discrepancies.map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full mt-1 ${issue.priority === 'High' ? 'bg-red-100 text-red-600' :
                          issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                          <AlertOctagon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{issue.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>ID: {issue.id}</span>
                            <span>•</span>
                            <span>Reported: {issue.date}</span>
                            <span>•</span>
                            <span>By: {issue.reportedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${issue.status === 'Open' ? 'bg-red-100 text-red-700' :
                          issue.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                          {issue.status}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "View Issue", description: `Viewing details for ${issue.id}` })}>View</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
