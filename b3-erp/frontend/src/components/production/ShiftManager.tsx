'use client';

import React, { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Shift {
    shiftName: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    numberOfOperators: number;
}

interface ShiftManagerProps {
    initialShifts?: Shift[];
    onSave: (shifts: Shift[]) => Promise<void>;
}

export const ShiftManager: React.FC<ShiftManagerProps> = ({ initialShifts = [], onSave }) => {
    const [shifts, setShifts] = useState<Shift[]>(
        initialShifts.length > 0
            ? initialShifts
            : [
                { shiftName: 'Day Shift', startTime: '08:00', endTime: '16:00', isActive: true, numberOfOperators: 2 },
                { shiftName: 'Night Shift', startTime: '16:00', endTime: '00:00', isActive: false, numberOfOperators: 2 },
            ]
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const addShift = () => {
        setShifts([
            ...shifts,
            { shiftName: `Shift ${shifts.length + 1}`, startTime: '00:00', endTime: '08:00', isActive: true, numberOfOperators: 1 },
        ]);
    };

    const removeShift = (index: number) => {
        setShifts(shifts.filter((_, i) => i !== index));
    };

    const updateShift = (index: number, field: keyof Shift, value: any) => {
        const newShifts = [...shifts];
        newShifts[index] = { ...newShifts[index], [field]: value };
        setShifts(newShifts);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await onSave(shifts);
            setMessage({ type: 'success', text: 'Shifts updated successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update shifts' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Shift Planning
                </h3>
                <button
                    onClick={addShift}
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-1 font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Shift
                </button>
            </div>

            <div className="space-y-3">
                {shifts.map((shift, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Shift Name</label>
                            <input
                                type="text"
                                value={shift.shiftName}
                                onChange={(e) => updateShift(index, 'shiftName', e.target.value)}
                                className="w-full px-2 py-1 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="w-[100px]">
                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Start Time</label>
                            <input
                                type="time"
                                value={shift.startTime}
                                onChange={(e) => updateShift(index, 'startTime', e.target.value)}
                                className="w-full px-2 py-1 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="w-[100px]">
                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">End Time</label>
                            <input
                                type="time"
                                value={shift.endTime}
                                onChange={(e) => updateShift(index, 'endTime', e.target.value)}
                                className="w-full px-2 py-1 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="w-[80px]">
                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Operators</label>
                            <input
                                type="number"
                                value={shift.numberOfOperators}
                                onChange={(e) => updateShift(index, 'numberOfOperators', parseInt(e.target.value))}
                                className="w-full px-2 py-1 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                            <input
                                type="checkbox"
                                checked={shift.isActive}
                                onChange={(e) => updateShift(index, 'isActive', e.target.checked)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </div>
                        <button
                            onClick={() => removeShift(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-4 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                    {message && (
                        <div className={`flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold transition-all shadow-sm active:scale-95"
                >
                    {loading ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
};
