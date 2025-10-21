'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Wrench,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Package,
  FileText,
  Camera,
  ClipboardCheck
} from 'lucide-react';

interface Installation {
  id: string;
  installationNumber: string;
  orderNumber: string;
  handoverNumber: string;
  customerName: string;
  customerContact: string;
  customerPhone: string;
  siteAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  itemsCount: number;
  estimatedDuration: number; // hours
  technician: {
    name: string;
    phone: string;
    specialization: string;
  };
  completionDate?: string;
  completionPercentage: number;
  testingDone: boolean;
  trainingProvided: boolean;
  documentsHandedOver: boolean;
  customerSignature: boolean;
  rating?: number;
  feedback?: string;
  issues?: string;
  photosAvailable: boolean;
}

export default function InstallationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const installations: Installation[] = [
    {
      id: '1',
      installationNumber: 'INST-2025-001',
      orderNumber: 'SO-2025-089',
      handoverNumber: 'HO-2025-001',
      customerName: 'Tata Motors Limited',
      customerContact: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      siteAddress: {
        street: 'Tata Motors Plant, Sanand',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '382170'
      },
      scheduledDate: '2025-10-23',
      scheduledTime: '10:00 AM',
      status: 'completed',
      itemsCount: 15,
      estimatedDuration: 6,
      technician: {
        name: 'Suresh Patel',
        phone: '+91 98765 11111',
        specialization: 'Industrial Machinery'
      },
      completionDate: '2025-10-23',
      completionPercentage: 100,
      testingDone: true,
      trainingProvided: true,
      documentsHandedOver: true,
      customerSignature: true,
      rating: 5,
      feedback: 'Excellent installation service. Very professional team.',
      photosAvailable: true
    },
    {
      id: '2',
      installationNumber: 'INST-2025-002',
      orderNumber: 'SO-2025-095',
      handoverNumber: 'HO-2025-003',
      customerName: 'Reliance Industries',
      customerContact: 'Vikram Shah',
      customerPhone: '+91 98765 43212',
      siteAddress: {
        street: 'Reliance Refinery Complex',
        city: 'Jamnagar',
        state: 'Gujarat',
        pincode: '361280'
      },
      scheduledDate: '2025-10-24',
      scheduledTime: '9:00 AM',
      status: 'in_progress',
      itemsCount: 20,
      estimatedDuration: 8,
      technician: {
        name: 'Amit Kumar',
        phone: '+91 98765 22222',
        specialization: 'Heavy Equipment'
      },
      completionPercentage: 65,
      testingDone: false,
      trainingProvided: false,
      documentsHandedOver: false,
      customerSignature: false,
      photosAvailable: false
    },
    {
      id: '3',
      installationNumber: 'INST-2025-003',
      orderNumber: 'SO-2025-102',
      handoverNumber: 'HO-2025-005',
      customerName: 'Mahindra & Mahindra',
      customerContact: 'Priya Sharma',
      customerPhone: '+91 98765 43214',
      siteAddress: {
        street: 'Mahindra Manufacturing Plant',
        city: 'Chakan',
        state: 'Maharashtra',
        pincode: '410501'
      },
      scheduledDate: '2025-10-25',
      scheduledTime: '11:00 AM',
      status: 'scheduled',
      itemsCount: 8,
      estimatedDuration: 4,
      technician: {
        name: 'Ravi Verma',
        phone: '+91 98765 33333',
        specialization: 'Automotive Equipment'
      },
      completionPercentage: 0,
      testingDone: false,
      trainingProvided: false,
      documentsHandedOver: false,
      customerSignature: false,
      photosAvailable: false
    },
    {
      id: '4',
      installationNumber: 'INST-2025-004',
      orderNumber: 'SO-2025-104',
      handoverNumber: 'HO-2025-006',
      customerName: 'Bharat Heavy Electricals',
      customerContact: 'Arun Verma',
      customerPhone: '+91 98765 43216',
      siteAddress: {
        street: 'BHEL Township',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462022'
      },
      scheduledDate: '2025-10-22',
      scheduledTime: '2:00 PM',
      status: 'completed',
      itemsCount: 18,
      estimatedDuration: 10,
      technician: {
        name: 'Dinesh Sharma',
        phone: '+91 98765 44444',
        specialization: 'Electrical Systems'
      },
      completionDate: '2025-10-22',
      completionPercentage: 100,
      testingDone: true,
      trainingProvided: true,
      documentsHandedOver: true,
      customerSignature: true,
      rating: 5,
      feedback: 'Professional installation. Excellent technical knowledge.',
      photosAvailable: true
    },
    {
      id: '5',
      installationNumber: 'INST-2025-005',
      orderNumber: 'SO-2025-108',
      handoverNumber: 'HO-2025-008',
      customerName: 'L&T Heavy Engineering',
      customerContact: 'Suresh Menon',
      customerPhone: '+91 98765 43215',
      siteAddress: {
        street: 'L&T Construction Site, GIFT City',
        city: 'Gandhinagar',
        state: 'Gujarat',
        pincode: '382355'
      },
      scheduledDate: '2025-10-21',
      scheduledTime: '8:00 AM',
      status: 'on_hold',
      itemsCount: 12,
      estimatedDuration: 7,
      technician: {
        name: 'Prakash Joshi',
        phone: '+91 98765 55555',
        specialization: 'Construction Equipment'
      },
      completionPercentage: 40,
      testingDone: false,
      trainingProvided: false,
      documentsHandedOver: false,
      customerSignature: false,
      issues: 'Site access restricted due to safety audit',
      photosAvailable: false
    },
    {
      id: '6',
      installationNumber: 'INST-2025-006',
      orderNumber: 'SO-2025-112',
      handoverNumber: 'HO-2025-010',
      customerName: 'JSW Steel',
      customerContact: 'Amit Sharma',
      customerPhone: '+91 98765 43211',
      siteAddress: {
        street: 'JSW Plant Complex',
        city: 'Ballari',
        state: 'Karnataka',
        pincode: '583275'
      },
      scheduledDate: '2025-10-26',
      scheduledTime: '10:00 AM',
      status: 'scheduled',
      itemsCount: 14,
      estimatedDuration: 6,
      technician: {
        name: 'Kiran Kumar',
        phone: '+91 98765 66666',
        specialization: 'Steel Processing Equipment'
      },
      completionPercentage: 0,
      testingDone: false,
      trainingProvided: false,
      documentsHandedOver: false,
      customerSignature: false,
      photosAvailable: false
    }
  ];

  const filteredInstallations = installations.filter(installation => {
    const matchesSearch =
      installation.installationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      installation.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      installation.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || installation.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalInstallations = installations.length;
  const completed = installations.filter(i => i.status === 'completed').length;
  const inProgress = installations.filter(i => i.status === 'in_progress').length;
  const avgRating = installations.filter(i => i.rating).reduce((sum, i) => sum + (i.rating || 0), 0) / installations.filter(i => i.rating).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on_hold': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on_hold': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Inline Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
              Export Schedule
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
              Schedule Installation
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Installations</p>
                <p className="text-3xl font-bold mt-2">{totalInstallations}</p>
                <p className="text-purple-100 text-xs mt-1">Scheduled & completed</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Wrench className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold mt-2">{inProgress}</p>
                <p className="text-yellow-100 text-xs mt-1">Currently installing</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold mt-2">{completed}</p>
                <p className="text-green-100 text-xs mt-1">Successfully finished</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold mt-2">{avgRating.toFixed(1)}</p>
                <p className="text-blue-100 text-xs mt-1">Customer satisfaction</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by installation, order, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Installations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInstallations.map((installation) => (
            <div key={installation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{installation.installationNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(installation.status)}`}>
                        {getStatusIcon(installation.status)}
                        {installation.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Order: {installation.orderNumber}</p>
                    <p className="text-gray-600 mt-1">{installation.customerName}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Installation Schedule</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-purple-700">Date</p>
                      <p className="font-medium text-purple-900">{new Date(installation.scheduledDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-purple-700">Time</p>
                      <p className="font-medium text-purple-900">{installation.scheduledTime}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-purple-700">Duration</p>
                      <p className="font-medium text-purple-900">{installation.estimatedDuration} hours (estimated)</p>
                    </div>
                  </div>
                </div>

                {/* Site Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p>{installation.siteAddress.street}</p>
                    <p>{installation.siteAddress.city}, {installation.siteAddress.state}</p>
                    <p>{installation.siteAddress.pincode}</p>
                  </div>
                </div>

                {/* Technician */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Technician</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-blue-900">{installation.technician.name}</p>
                    <p className="text-blue-700">{installation.technician.specialization}</p>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Phone className="w-3 h-3" />
                      <span>{installation.technician.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {installation.status === 'in_progress' || installation.status === 'completed' ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">Progress</h4>
                      <span className="text-sm font-semibold text-gray-900">{installation.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${installation.completionPercentage === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                        style={{ width: `${installation.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Checklist */}
                {installation.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      Completion Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Testing completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Training provided</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Documents handed over</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Customer signature obtained</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating & Feedback */}
                {installation.rating && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-900">Customer Rating</span>
                      {renderStars(installation.rating)}
                    </div>
                    {installation.feedback && (
                      <p className="text-sm text-yellow-800 italic">"{installation.feedback}"</p>
                    )}
                  </div>
                )}

                {/* Issues */}
                {installation.issues && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">
                        <strong>Issue:</strong> {installation.issues}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{installation.itemsCount} items</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Details
                  </button>
                  {installation.photosAvailable && (
                    <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInstallations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Installations</h3>
            <p className="text-gray-600">No installations match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
