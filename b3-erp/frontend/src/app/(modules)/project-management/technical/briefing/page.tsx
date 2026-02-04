'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Users, FileText, CheckCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export default function LayoutBriefingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [attendees, setAttendees] = useState<string[]>(['Project Manager', 'Technical Lead']);
  const [newAttendee, setNewAttendee] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAddAttendee = () => {
    if (newAttendee && !attendees.includes(newAttendee)) {
      setAttendees([...attendees, newAttendee]);
      setNewAttendee('');
    }
  };

  const handleRemoveAttendee = (attendee: string) => {
    setAttendees(attendees.filter(a => a !== attendee));
  };

  const handleComplete = () => {
    if (!date || !time || !notes) {
      toast({
        title: "Missing Information",
        description: "Please fill in all details before completing the briefing.",
        variant: "destructive",
      });
      return;
    }

    setIsCompleted(true);
    toast({
      title: "Briefing Completed",
      description: "Layout briefing session has been recorded.",
    });

    setTimeout(() => {
      router.push('/project-management/technical/timeline');
    }, 2000);
  };

  return (
    <div className="w-full py-2 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Layout Briefing Session</h1>
          <p className="text-sm text-gray-500">Step 3.2: Conduct briefing with technical team to align on requirements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>Schedule and record the briefing session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      className="pl-9"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      className="pl-9"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attendees</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add attendee name..."
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAttendee()}
                  />
                  <Button onClick={handleAddAttendee} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attendees.map((attendee) => (
                    <div key={attendee} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                      <Users className="w-3 h-3 text-gray-500" />
                      {attendee}
                      <button onClick={() => handleRemoveAttendee(attendee)} className="ml-1 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Briefing Notes</Label>
                <Textarea
                  placeholder="Record key discussion points, design constraints, and special requirements..."
                  className="h-32"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">Checklist:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Review BOQ & Drawings</li>
                  <li>Discuss Site Constraints</li>
                  <li>Confirm Appliance Specs</li>
                  <li>Set Timeline Expectations</li>
                </ul>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleComplete}
                disabled={isCompleted}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Briefing Recorded
                  </>
                ) : (
                  'Complete Briefing'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
