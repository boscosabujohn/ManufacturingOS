'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  FileText,
  Package,
  User,
  Calendar,
  Truck,
  Eye,
  Download,
  Printer,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

interface DeliveryNote {
  id: string;
  deliveryNoteNumber: string;
  orderNumber: string;
  customerName: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  issueDate: string;
  deliveryDate?: string;
  status: 'issued' | 'in_transit' | 'delivered' | 'cancelled';
  itemsCount: number;
  totalQuantity: number;
  carrier: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  specialInstructions?: string;
}

export default function DeliveryNotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const deliveryNotes: DeliveryNote[] = [
    {
      id: '1',
      deliveryNoteNumber: 'DN-2025-001',
      orderNumber: 'SO-2025-112',
      customerName: 'Tata Motors Limited',
      deliveryAddress: {
        street: 'Tata Motors Plant, Sanand',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '382170'
      },
      issueDate: '2025-10-20',
      deliveryDate: '2025-10-22',
      status: 'delivered',
      itemsCount: 15,
      totalQuantity: 250,
      carrier: 'Blue Dart Express',
      vehicleNumber: 'GJ-01-AB-1234',
      driverName: 'Ramesh Patel',
      driverPhone: '+91 98765 00001',
      specialInstructions: 'Delivery at loading bay 3'
    },
    {
      id: '2',
      deliveryNoteNumber: 'DN-2025-002',
      orderNumber: 'SO-2025-115',
      customerName: 'Reliance Industries',
      deliveryAddress: {
        street: 'Reliance Refinery Complex',
        city: 'Jamnagar',
        state: 'Gujarat',
        pincode: '361280'
      },
      issueDate: '2025-10-21',
      status: 'in_transit',
      itemsCount: 20,
      totalQuantity: 400,
      carrier: 'Professional Couriers',
      vehicleNumber: 'GJ-18-CD-5678',
      driverName: 'Suresh Kumar',
      driverPhone: '+91 98765 00002',
      specialInstructions: 'Security clearance required'
    },
    {
      id: '3',
      deliveryNoteNumber: 'DN-2025-003',
      orderNumber: 'SO-2025-118',
      customerName: 'Mahindra & Mahindra',
      deliveryAddress: {
        street: 'Mahindra Manufacturing Plant',
        city: 'Chakan',
        state: 'Maharashtra',
        pincode: '410501'
      },
      issueDate: '2025-10-22',
      status: 'issued',
      itemsCount: 8,
      totalQuantity: 90,
      carrier: 'DTDC Courier',
      specialInstructions: 'Fragile items - Handle with care'
    },
    {
      id: '4',
      deliveryNoteNumber: 'DN-2025-004',
      orderNumber: 'SO-2025-120',
      customerName: 'L&T Heavy Engineering',
      deliveryAddress: {
        street: 'L&T Construction Site, GIFT City',
        city: 'Gandhinagar',
        state: 'Gujarat',
        pincode: '382355'
      },
      issueDate: '2025-10-19',
      deliveryDate: '2025-10-21',
      status: 'delivered',
      itemsCount: 12,
      totalQuantity: 180,
      carrier: 'VRL Logistics',
      vehicleNumber: 'MH-12-EF-9012',
      driverName: 'Amit Sharma',
      driverPhone: '+91 98765 00003'
    },
    {
      id: '5',
      deliveryNoteNumber: 'DN-2025-005',
      orderNumber: 'SO-2025-122',
      customerName: 'Bharat Heavy Electricals',
      deliveryAddress: {
        street: 'BHEL Township',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462022'
      },
      issueDate: '2025-10-23',
      status: 'issued',
      itemsCount: 18,
      totalQuantity: 320,
      carrier: 'Gati Packers',
      specialInstructions: 'Heavy items - Crane required for unloading'
    },
    {
      id: '6',
      deliveryNoteNumber: 'DN-2025-006',
      orderNumber: 'SO-2025-124',
      customerName: 'Adani Ports',
      deliveryAddress: {
        street: 'Mundra Port Container Terminal',
        city: 'Mundra',
        state: 'Gujarat',
        pincode: '370421'
      },
      issueDate: '2025-10-20',
      deliveryDate: '2025-10-24',
      status: 'delivered',
      itemsCount: 10,
      totalQuantity: 120,
      carrier: 'Safe Express',
      vehicleNumber: 'GJ-05-GH-3456',
      driverName: 'Vikram Singh',
      driverPhone: '+91 98765 00004'
    },
    {
      id: '7',
      deliveryNoteNumber: 'DN-2025-007',
      orderNumber: 'SO-2025-126',
      customerName: 'JSW Steel',
      deliveryAddress: {
        street: 'JSW Plant Complex',
        city: 'Ballari',
        state: 'Karnataka',
        pincode: '583275'
      },
      issueDate: '2025-10-21',
      status: 'in_transit',
      itemsCount: 14,
      totalQuantity: 200,
      carrier: 'TCI Express',
      vehicleNumber: 'KA-20-IJ-7890',
      driverName: 'Ravi Kumar',
      driverPhone: '+91 98765 00005'
    },
    {
      id: '8',
      deliveryNoteNumber: 'DN-2025-008',
      orderNumber: 'SO-2025-128',
      customerName: 'Hindalco Industries',
      deliveryAddress: {
        street: 'Hindalco Aluminum Plant',
        city: 'Hirakud',
        state: 'Odisha',
        pincode: '768016'
      },
      issueDate: '2025-10-18',
      status: 'cancelled',
      itemsCount: 6,
      totalQuantity: 75,
      carrier: 'Om Logistics',
      specialInstructions: 'Order cancelled by customer'
    }
  ];

  const filteredNotes = deliveryNotes.filter(note => {
    const matchesSearch =
      note.deliveryNoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || note.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalNotes = deliveryNotes.length;
  const inTransit = deliveryNotes.filter(n => n.status === 'in_transit').length;
  const delivered = deliveryNotes.filter(n => n.status === 'delivered').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-blue-100 text-blue-700';
      case 'in_transit': return 'bg-yellow-100 text-yellow-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued': return <FileText className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 px-3 py-2">
      <div className="space-y-3">
        {/* Inline Header */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
              Export List
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Create Delivery Note
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">Total Delivery Notes</p>
                <p className="text-3xl font-bold mt-2">{totalNotes}</p>
                <p className="text-cyan-100 text-xs mt-1">Generated</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">In Transit</p>
                <p className="text-3xl font-bold mt-2">{inTransit}</p>
                <p className="text-yellow-100 text-xs mt-1">On the way</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Truck className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold mt-2">{delivered}</p>
                <p className="text-green-100 text-xs mt-1">Successfully completed</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by delivery note, order, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="issued">Issued</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Delivery Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{note.deliveryNoteNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(note.status)}`}>
                        {getStatusIcon(note.status)}
                        {note.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Order: {note.orderNumber}</p>
                    <p className="text-gray-600 mt-1">{note.customerName}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p>{note.deliveryAddress.street}</p>
                    <p>{note.deliveryAddress.city}, {note.deliveryAddress.state}</p>
                    <p>{note.deliveryAddress.pincode}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Issue Date</p>
                    <p className="font-medium text-gray-900">{new Date(note.issueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  {note.deliveryDate && (
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-medium text-green-600">{new Date(note.deliveryDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-900">{note.itemsCount} items</span>
                  </div>
                  <span className="text-sm font-medium text-cyan-900">{note.totalQuantity} units</span>
                </div>

                {/* Carrier & Driver */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">{note.carrier}</span>
                  </div>
                  {note.vehicleNumber && (
                    <p className="text-sm text-blue-700">Vehicle: {note.vehicleNumber}</p>
                  )}
                  {note.driverName && (
                    <p className="text-sm text-blue-700">Driver: {note.driverName}</p>
                  )}
                  {note.driverPhone && (
                    <p className="text-sm text-blue-700">Contact: {note.driverPhone}</p>
                  )}
                </div>

                {/* Special Instructions */}
                {note.specialInstructions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Instructions:</strong> {note.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Delivery Notes</h3>
            <p className="text-gray-600">No delivery notes match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
