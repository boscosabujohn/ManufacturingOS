'use client';

import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Truck,
    Package,
    MapPin,
    Search,
    Filter,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    AlertCircle,
    CheckCircle2,
    Clock3,
    ArrowUpRight,
    Building2,
    User
} from 'lucide-react';

// Mock Schedule Data
const scheduleData = [
    {
        id: 'SHP-2024-1201',
        time: '08:00',
        customer: 'ABC Manufacturing',
        destination: 'Dubai Industrial City',
        carrier: 'Emirates Logistics',
        vehicle: 'TRK-4521',
        items: 12,
        weight: '2,450 kg',
        status: 'On Time',
        dock: 'Dock A1'
    },
    {
        id: 'SHP-2024-1202',
        time: '09:30',
        customer: 'Global Tech Solutions',
        destination: 'Jebel Ali Free Zone',
        carrier: 'Fast Track Shipping',
        vehicle: 'TRK-7823',
        items: 8,
        weight: '1,200 kg',
        status: 'Loading',
        dock: 'Dock B2'
    },
    {
        id: 'SHP-2024-1203',
        time: '10:00',
        customer: 'Premier Industries',
        destination: 'Abu Dhabi Port',
        carrier: 'Gulf Express',
        vehicle: 'TRK-3345',
        items: 25,
        weight: '4,800 kg',
        status: 'Delayed',
        dock: 'Dock A3'
    },
    {
        id: 'SHP-2024-1204',
        time: '11:30',
        customer: 'Tech Innovations LLC',
        destination: 'Sharjah Industrial',
        carrier: 'Quick Delivery Co',
        vehicle: 'TRK-9912',
        items: 5,
        weight: '650 kg',
        status: 'Scheduled',
        dock: 'Dock C1'
    },
    {
        id: 'SHP-2024-1205',
        time: '13:00',
        customer: 'Al Falak Trading',
        destination: 'RAK Free Trade Zone',
        carrier: 'Northern Logistics',
        vehicle: 'TRK-5567',
        items: 18,
        weight: '3,200 kg',
        status: 'Scheduled',
        dock: 'Dock B1'
    },
    {
        id: 'SHP-2024-1206',
        time: '14:30',
        customer: 'Sunrise Electronics',
        destination: 'Ajman Port',
        carrier: 'Coast Shipping',
        vehicle: 'TRK-2234',
        items: 10,
        weight: '1,800 kg',
        status: 'Scheduled',
        dock: 'Dock A2'
    },
    {
        id: 'SHP-2024-1207',
        time: '16:00',
        customer: 'Desert Steel Works',
        destination: 'Dubai South',
        carrier: 'Heavy Haul Transport',
        vehicle: 'TRK-8801',
        items: 3,
        weight: '8,500 kg',
        status: 'Scheduled',
        dock: 'Dock D1'
    }
];

const dockStatus = [
    { dock: 'Dock A1', status: 'Occupied', shipment: 'SHP-2024-1201', eta: '08:45' },
    { dock: 'Dock A2', status: 'Available', shipment: null, eta: null },
    { dock: 'Dock A3', status: 'Occupied', shipment: 'SHP-2024-1203', eta: '10:30' },
    { dock: 'Dock B1', status: 'Reserved', shipment: 'SHP-2024-1205', eta: '13:00' },
    { dock: 'Dock B2', status: 'Occupied', shipment: 'SHP-2024-1202', eta: '09:45' },
    { dock: 'Dock C1', status: 'Available', shipment: null, eta: null },
    { dock: 'Dock D1', status: 'Reserved', shipment: 'SHP-2024-1207', eta: '16:00' }
];

export default function ShippingSchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On Time': return 'bg-green-50 text-green-600 border-green-200';
            case 'Loading': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Delayed': return 'bg-red-50 text-red-600 border-red-200';
            case 'Scheduled': return 'bg-gray-50 text-gray-600 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getDockStatusColor = (status: string) => {
        switch (status) {
            case 'Occupied': return 'bg-blue-500';
            case 'Available': return 'bg-green-500';
            case 'Reserved': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="p-6 space-y-3 text-sm font-medium">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-8 w-8 text-orange-600" />
                        Shipping Schedule
                    </h1>
                    <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest leading-none">
                        Daily outbound shipment scheduling and dock management
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'timeline' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Timeline
                        </button>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-md font-black uppercase text-[10px] tracking-widest">
                        <Plus className="w-4 h-4" /> Schedule Shipment
                    </button>
                </div>
            </div>

            {/* Date Navigation */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                <div className="flex items-center justify-between">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="text-center">
                        <p className="text-lg font-black text-gray-900">{formatDate(selectedDate)}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                            {scheduleData.length} shipments scheduled
                        </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Shipments</p>
                        <p className="text-2xl font-black text-gray-900 italic tracking-tighter">{scheduleData.length}</p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">On Time</p>
                        <p className="text-2xl font-black text-green-600 italic tracking-tighter">
                            {scheduleData.filter(s => s.status === 'On Time').length}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="p-3 bg-red-50 rounded-xl text-red-600">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delayed</p>
                        <p className="text-2xl font-black text-red-600 italic tracking-tighter">
                            {scheduleData.filter(s => s.status === 'Delayed').length}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Items</p>
                        <p className="text-2xl font-black text-gray-900 italic tracking-tighter">
                            {scheduleData.reduce((sum, s) => sum + s.items, 0)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Schedule List */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" /> Today's Schedule
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search shipments..."
                                className="pl-10 pr-4 py-1.5 border border-gray-100 bg-gray-50 rounded-lg text-xs w-64"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {scheduleData.map((shipment) => (
                            <div key={shipment.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="flex items-start gap-2">
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-xl font-black text-gray-900 italic tracking-tighter">{shipment.time}</p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusColor(shipment.status)}`}>
                                            {shipment.status}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors flex items-center gap-2">
                                                    {shipment.id}
                                                    <span className="text-[10px] text-gray-400 font-normal">{shipment.dock}</span>
                                                </h4>
                                                <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" /> {shipment.customer}
                                                </p>
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {shipment.destination}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Truck className="w-3 h-3" /> {shipment.carrier}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Package className="w-3 h-3" /> {shipment.items} items ({shipment.weight})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dock Status Sidebar */}
                <div className="space-y-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-orange-600" /> Dock Status
                        </h3>
                        <div className="space-y-3">
                            {dockStatus.map((dock) => (
                                <div key={dock.dock} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${getDockStatusColor(dock.status)}`}></span>
                                        <span className="text-[11px] font-bold text-gray-700">{dock.dock}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[9px] font-black uppercase ${dock.status === 'Available' ? 'text-green-600' :
                                                dock.status === 'Occupied' ? 'text-blue-600' : 'text-yellow-600'
                                            }`}>
                                            {dock.status}
                                        </span>
                                        {dock.shipment && (
                                            <p className="text-[9px] text-gray-400">{dock.shipment}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
                        <h3 className="text-xs font-black text-orange-800 uppercase tracking-widest italic flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4" /> Attention Required
                        </h3>
                        <p className="text-[11px] text-orange-700 font-bold">
                            Shipment SHP-2024-1203 is experiencing a 30-minute delay due to carrier issues.
                        </p>
                        <button className="mt-3 text-[10px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-1 hover:text-orange-900">
                            View Details <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
