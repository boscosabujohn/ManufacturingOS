'use client';

import React, { useState } from 'react';
import {
    Settings,
    Save,
    Clock,
    DollarSign,
    Calendar,
    AlertCircle,
    CheckCircle,
    Info,
    Plus,
    Trash2
} from 'lucide-react';

interface OvertimeRule {
    id: string;
    name: string;
    type: 'Weekday' | 'Weekend' | 'Holiday';
    multiplier: number;
    minHours: number;
    maxHours: number;
    requiresApproval: boolean;
    status: 'Active' | 'Inactive';
}

export default function OvertimeSettingsPage() {
    const [settings, setSettings] = useState({
        defaultMultiplier: 1.5,
        weekendMultiplier: 2.0,
        holidayMultiplier: 2.5,
        minOvertimeHours: 1,
        maxDailyOvertime: 4,
        maxWeeklyOvertime: 20,
        maxMonthlyOvertime: 60,
        autoApprovalThreshold: 2,
        requireApprovalAbove: 4,
        compOffValidityDays: 90,
        allowCompOffCarryOver: true,
        maxCompOffBalance: 40,
        notifyManagerOnRequest: true,
        notifyHROnApproval: true,
        reminderDaysBeforeExpiry: 7
    });

    const [rules, setRules] = useState<OvertimeRule[]>([
        { id: '1', name: 'Standard Weekday OT', type: 'Weekday', multiplier: 1.5, minHours: 1, maxHours: 4, requiresApproval: true, status: 'Active' },
        { id: '2', name: 'Weekend OT', type: 'Weekend', multiplier: 2.0, minHours: 2, maxHours: 8, requiresApproval: true, status: 'Active' },
        { id: '3', name: 'Holiday OT', type: 'Holiday', multiplier: 2.5, minHours: 2, maxHours: 8, requiresApproval: true, status: 'Active' },
        { id: '4', name: 'Night Shift Weekday', type: 'Weekday', multiplier: 1.75, minHours: 1, maxHours: 4, requiresApproval: true, status: 'Active' }
    ]);

    const handleSettingChange = (key: string, value: number | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Settings className="w-8 h-8 text-gray-400" />
                            Overtime Settings
                        </h1>
                        <p className="text-gray-400 mt-1">Configure overtime policies and rules</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            Overtime Multipliers
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Weekday Overtime Multiplier</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={settings.defaultMultiplier}
                                        onChange={(e) => handleSettingChange('defaultMultiplier', parseFloat(e.target.value))}
                                        className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-400">x base rate</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Weekend Overtime Multiplier</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={settings.weekendMultiplier}
                                        onChange={(e) => handleSettingChange('weekendMultiplier', parseFloat(e.target.value))}
                                        className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-400">x base rate</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Holiday Overtime Multiplier</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={settings.holidayMultiplier}
                                        onChange={(e) => handleSettingChange('holidayMultiplier', parseFloat(e.target.value))}
                                        className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-400">x base rate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-400" />
                            Hour Limits
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Minimum OT Hours (per request)</label>
                                <input
                                    type="number"
                                    min="0.5"
                                    max="8"
                                    step="0.5"
                                    value={settings.minOvertimeHours}
                                    onChange={(e) => handleSettingChange('minOvertimeHours', parseFloat(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Maximum Daily OT Hours</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={settings.maxDailyOvertime}
                                    onChange={(e) => handleSettingChange('maxDailyOvertime', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Maximum Weekly OT Hours</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="40"
                                    value={settings.maxWeeklyOvertime}
                                    onChange={(e) => handleSettingChange('maxWeeklyOvertime', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Maximum Monthly OT Hours</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={settings.maxMonthlyOvertime}
                                    onChange={(e) => handleSettingChange('maxMonthlyOvertime', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            Approval Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Auto-approve up to (hours)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="8"
                                        value={settings.autoApprovalThreshold}
                                        onChange={(e) => handleSettingChange('autoApprovalThreshold', parseInt(e.target.value))}
                                        className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-400">hours (0 = always require approval)</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Require HR approval above (hours)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={settings.requireApprovalAbove}
                                    onChange={(e) => handleSettingChange('requireApprovalAbove', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="notifyManager"
                                    checked={settings.notifyManagerOnRequest}
                                    onChange={(e) => handleSettingChange('notifyManagerOnRequest', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="notifyManager" className="text-gray-300">Notify manager on new request</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="notifyHR"
                                    checked={settings.notifyHROnApproval}
                                    onChange={(e) => handleSettingChange('notifyHROnApproval', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="notifyHR" className="text-gray-300">Notify HR on approval</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            Comp-Off Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Comp-Off Validity (days)</label>
                                <input
                                    type="number"
                                    min="30"
                                    max="365"
                                    value={settings.compOffValidityDays}
                                    onChange={(e) => handleSettingChange('compOffValidityDays', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Maximum Comp-Off Balance (hours)</label>
                                <input
                                    type="number"
                                    min="8"
                                    max="100"
                                    value={settings.maxCompOffBalance}
                                    onChange={(e) => handleSettingChange('maxCompOffBalance', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="carryOver"
                                    checked={settings.allowCompOffCarryOver}
                                    onChange={(e) => handleSettingChange('allowCompOffCarryOver', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="carryOver" className="text-gray-300">Allow carry-over to next year</label>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Expiry Reminder (days before)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={settings.reminderDaysBeforeExpiry}
                                    onChange={(e) => handleSettingChange('reminderDaysBeforeExpiry', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            Overtime Rules
                        </h3>
                        <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                            <Plus className="w-4 h-4" />
                            Add Rule
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-3 text-gray-400 font-medium">Rule Name</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Type</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Multiplier</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Min Hours</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Max Hours</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Approval</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Status</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((rule) => (
                                    <tr key={rule.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-3 text-white">{rule.name}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                rule.type === 'Weekday' ? 'bg-blue-500/20 text-blue-400' :
                                                rule.type === 'Weekend' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-orange-500/20 text-orange-400'
                                            }`}>
                                                {rule.type}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center text-green-400 font-medium">{rule.multiplier}x</td>
                                        <td className="p-3 text-center text-gray-300">{rule.minHours}h</td>
                                        <td className="p-3 text-center text-gray-300">{rule.maxHours}h</td>
                                        <td className="p-3 text-center">
                                            {rule.requiresApproval ? (
                                                <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                rule.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                {rule.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
