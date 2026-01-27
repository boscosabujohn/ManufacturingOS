'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ruler, Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, RoomMeasurements, Measurement } from '@/services/ProjectManagementService';

export default function SiteMeasurementsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<RoomMeasurements[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      const data = await projectManagementService.getSiteMeasurements('current-project');
      setRooms(data);
      // Expand all rooms by default
      setExpandedRooms(new Set(data.map(r => r.id)));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load measurements.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    const newRoom: RoomMeasurements = {
      id: `RM-${Date.now()}`,
      roomName: 'New Room',
      measurements: []
    };
    setRooms([...rooms, newRoom]);
    setExpandedRooms(new Set([...Array.from(expandedRooms), newRoom.id]));
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
  };

  const handleRoomNameChange = (roomId: string, name: string) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, roomName: name } : r));
  };

  const toggleRoom = (roomId: string) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId);
    } else {
      newExpanded.add(roomId);
    }
    setExpandedRooms(newExpanded);
  };

  const handleAddMeasurement = (roomId: string) => {
    const newMeasurement: Measurement = {
      id: `M-${Date.now()}`,
      label: '',
      value: '',
      unit: 'mm',
      description: ''
    };
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, measurements: [...r.measurements, newMeasurement] };
      }
      return r;
    }));
  };

  const handleMeasurementChange = (roomId: string, measurementId: string, field: keyof Measurement, value: string) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const updatedMeasurements = r.measurements.map(m =>
          m.id === measurementId ? { ...m, [field]: value } : m
        );
        return { ...r, measurements: updatedMeasurements };
      }
      return r;
    }));
  };

  const handleDeleteMeasurement = (roomId: string, measurementId: string) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, measurements: r.measurements.filter(m => m.id !== measurementId) };
      }
      return r;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await projectManagementService.saveSiteMeasurements('current-project', rooms);
      toast({
        title: "Measurements Saved",
        description: "Site dimensions have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save measurements.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Measurements</h1>
            <p className="text-sm text-gray-500">Step 2.5: Capture actual dimensions via mobile app</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleAddRoom}>
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={loading || saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Measurements'}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-500">Loading measurements...</p>
      ) : (
        <div className="space-y-6">
          {rooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Ruler className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No Measurements Yet</h3>
              <p className="text-gray-500 mb-4">Start by adding a room to record dimensions.</p>
              <Button onClick={handleAddRoom}>Add First Room</Button>
            </div>
          ) : (
            rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 py-3 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => toggleRoom(room.id)}>
                      {expandedRooms.has(room.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Input
                      value={room.roomName}
                      onChange={(e) => handleRoomNameChange(room.id, e.target.value)}
                      className="h-8 w-48 font-medium bg-transparent border-transparent hover:border-gray-300 focus:bg-white transition-colors"
                      placeholder="Room Name"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteRoom(room.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                {expandedRooms.has(room.id) && (
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {room.measurements.map((measurement) => (
                        <div key={measurement.id} className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                          <div className="col-span-3">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Label</label>
                            <Input
                              value={measurement.label}
                              onChange={(e) => handleMeasurementChange(room.id, measurement.id, 'label', e.target.value)}
                              placeholder="e.g. Wall A"
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Value</label>
                            <Input
                              type="number"
                              value={measurement.value}
                              onChange={(e) => handleMeasurementChange(room.id, measurement.id, 'value', e.target.value)}
                              placeholder="0"
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Unit</label>
                            <Select
                              value={measurement.unit}
                              onValueChange={(value) => handleMeasurementChange(room.id, measurement.id, 'unit', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mm">mm</SelectItem>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                                <SelectItem value="sqm">sqm</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                            <Input
                              value={measurement.description || ''}
                              onChange={(e) => handleMeasurementChange(room.id, measurement.id, 'description', e.target.value)}
                              placeholder="Optional details..."
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-1 flex justify-end pt-6">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500" onClick={() => handleDeleteMeasurement(room.id, measurement.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50" onClick={() => handleAddMeasurement(room.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Measurement
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
