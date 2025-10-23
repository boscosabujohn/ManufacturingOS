'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Activity,
  Package,
  MoreVertical,
  Download,
  Send,
  Clock,
  Building2,
  User,
  Percent,
  Calendar,
  AlertCircle,
  Copy,
  Archive,
  Users,
  Target,
  Tag,
} from 'lucide-react';

interface PriceItem {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  marginPercent: number;
  unit: string;
  currency: string;
}

interface PriceList {
  id: string;
  priceListNumber: string;
  priceListName: string;
  description: string;
  status: 'draft' | 'under_review' | 'approved' | 'active' | 'expired' | 'archived';
  customerSegment: 'retail' | 'wholesale' | 'distributor' | 'oem' | 'premium' | 'all';
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  totalItems: number;
  averageMarginPercent: number;
  discountRange: string;
  createdBy: string;
  createdDate: string;
  approvedBy: string | null;
  approvedDate: string | null;
  lastModified: string;
  modifiedBy: string;
  linkedProducts: number;
  priceRevision: number;
  region: string;
  taxIncluded: boolean;
}

interface PriceHistory {
  id: string;
  priceListId: string;
  type: 'status_change' | 'price_update' | 'approval' | 'revision' | 'note';
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: {
    previousStatus?: string;
    newStatus?: string;
    itemsAffected?: number;
    revisionFrom?: number;
    revisionTo?: number;
    averagePriceChange?: string;
  };
}

interface PriceStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  icon: any;
  color: string;
}

// Mock price list data
const mockPriceList: PriceList = {
  id: '1',
  priceListNumber: 'PL-2025-001',
  priceListName: 'B2B Dealers - Premium Tier A',
  description: 'Premium pricing for tier A wholesale dealers with 15% standard margin',
  status: 'active',
  customerSegment: 'wholesale',
  currency: 'INR',
  effectiveFrom: '2025-10-01',
  effectiveTo: '2026-03-31',
  totalItems: 245,
  averageMarginPercent: 18.5,
  discountRange: '5-15%',
  createdBy: 'Priya Patel',
  createdDate: '2025-09-15',
  approvedBy: 'Rajesh Kumar - Sales Director',
  approvedDate: '2025-09-28',
  lastModified: '2025-10-05',
  modifiedBy: 'Amit Desai',
  linkedProducts: 245,
  priceRevision: 3,
  region: 'West India - Maharashtra',
  taxIncluded: false,
};

// Mock price items
const mockPriceItems: PriceItem[] = [
  {
    id: 'item1',
    itemCode: 'MK-BASE-001',
    description: 'Standard Base Cabinet 600mm - Oak Finish',
    category: 'Base Cabinets',
    basePrice: 12500,
    discountPercent: 10,
    finalPrice: 11250,
    marginPercent: 18,
    unit: 'Unit',
    currency: 'INR',
  },
  {
    id: 'item2',
    itemCode: 'MK-WALL-002',
    description: 'Wall Cabinet 800mm with Glass Door',
    category: 'Wall Cabinets',
    basePrice: 15800,
    discountPercent: 12,
    finalPrice: 13904,
    marginPercent: 20,
    unit: 'Unit',
    currency: 'INR',
  },
  {
    id: 'item3',
    itemCode: 'MK-COUNT-003',
    description: 'Granite Countertop - Black Galaxy',
    category: 'Countertops',
    basePrice: 450,
    discountPercent: 8,
    finalPrice: 414,
    marginPercent: 22,
    unit: 'Sq.Ft',
    currency: 'INR',
  },
  {
    id: 'item4',
    itemCode: 'HW-HINGE-001',
    description: 'Soft Close Hinge - German Import',
    category: 'Hardware',
    basePrice: 285,
    discountPercent: 15,
    finalPrice: 242,
    marginPercent: 25,
    unit: 'Piece',
    currency: 'INR',
  },
  {
    id: 'item5',
    itemCode: 'MK-TALL-004',
    description: 'Tall Unit 2100mm - Full Extension',
    category: 'Tall Units',
    basePrice: 28500,
    discountPercent: 10,
    finalPrice: 25650,
    marginPercent: 19,
    unit: 'Unit',
    currency: 'INR',
  },
];

// Mock price history
const mockPriceHistory: PriceHistory[] = [
  {
    id: 'h1',
    priceListId: '1',
    type: 'status_change',
    title: 'Price List Activated',
    description: 'Price list activated and made effective from October 1, 2025',
    performedBy: 'Rajesh Kumar',
    timestamp: '2025-10-01 09:00',
    metadata: { previousStatus: 'approved', newStatus: 'active' },
  },
  {
    id: 'h2',
    priceListId: '1',
    type: 'price_update',
    title: 'Bulk Price Update - Hardware Category',
    description: 'Updated pricing for all hardware items due to currency fluctuation. Average increase of 3.5%',
    performedBy: 'Amit Desai',
    timestamp: '2025-10-05 14:30',
    metadata: { itemsAffected: 42, averagePriceChange: '+3.5%' },
  },
  {
    id: 'h3',
    priceListId: '1',
    type: 'approval',
    title: 'Price List Approved',
    description: 'Price list reviewed and approved by Sales Director after regional analysis',
    performedBy: 'Rajesh Kumar',
    timestamp: '2025-09-28 16:45',
    metadata: { previousStatus: 'under_review', newStatus: 'approved' },
  },
  {
    id: 'h4',
    priceListId: '1',
    type: 'revision',
    title: 'Price List Revised - Revision 3',
    description: 'Updated margins for premium tier customers. Base cabinet margins increased by 2%',
    performedBy: 'Priya Patel',
    timestamp: '2025-09-25 11:20',
    metadata: { revisionFrom: 2, revisionTo: 3, itemsAffected: 78 },
  },
  {
    id: 'h5',
    priceListId: '1',
    type: 'note',
    title: 'Pricing Strategy Note',
    description: 'Competitive analysis completed. Our pricing is 8-12% lower than competitors while maintaining healthy margins',
    performedBy: 'Priya Patel',
    timestamp: '2025-09-20 10:15',
  },
];

const getPriceStages = (priceList: PriceList): PriceStage[] => {
  const stages: PriceStage[] = [
    { id: 'draft', name: 'Draft', status: 'completed', date: priceList.createdDate, icon: FileText, color: 'gray' },
    { id: 'under_review', name: 'Under Review', status: 'completed', date: '2025-09-22', icon: AlertCircle, color: 'yellow' },
    { id: 'approved', name: 'Approved', status: 'completed', date: priceList.approvedDate || undefined, icon: CheckCircle, color: 'green' },
    { id: 'active', name: 'Active', status: priceList.status === 'active' ? 'current' : priceList.status === 'expired' || priceList.status === 'archived' ? 'completed' : 'pending', date: priceList.effectiveFrom, icon: TrendingUp, color: 'blue' },
    { id: 'expired', name: 'Expired', status: priceList.status === 'expired' || priceList.status === 'archived' ? 'completed' : 'pending', date: priceList.status === 'expired' || priceList.status === 'archived' ? priceList.effectiveTo : undefined, icon: Clock, color: 'red' },
  ];

  return stages;
};

const historyIcons = {
  status_change: Activity,
  price_update: DollarSign,
  approval: CheckCircle,
  revision: FileText,
  note: FileText,
};

const historyColors = {
  status_change: 'bg-orange-100 text-orange-600 border-orange-200',
  price_update: 'bg-purple-100 text-purple-600 border-purple-200',
  approval: 'bg-green-100 text-green-600 border-green-200',
  revision: 'bg-blue-100 text-blue-600 border-blue-200',
  note: 'bg-yellow-100 text-yellow-600 border-yellow-200',
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  active: 'bg-blue-100 text-blue-700',
  expired: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-700',
};

const segmentColors = {
  retail: 'bg-purple-100 text-purple-700',
  wholesale: 'bg-blue-100 text-blue-700',
  distributor: 'bg-green-100 text-green-700',
  oem: 'bg-orange-100 text-orange-700',
  premium: 'bg-pink-100 text-pink-700',
  all: 'bg-gray-100 text-gray-700',
};

export default function ViewPricingPage() {
  const router = useRouter();
  const params = useParams();
  const priceListId = params.id as string;
  const priceList = mockPriceList;

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'history'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'items', name: 'Price Items', icon: Package },
    { id: 'history', name: 'Price History', icon: Activity },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/estimation/pricing')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Price Lists</span>
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Price List Header Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{priceList.priceListName}</h1>
                <p className="text-lg text-gray-600 mt-1">{priceList.priceListNumber}</p>
                <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[priceList.status]}`}>
                    {priceList.status.replace('_', ' ').charAt(0).toUpperCase() + priceList.status.replace('_', ' ').slice(1)}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${segmentColors[priceList.customerSegment]}`}>
                    {priceList.customerSegment.charAt(0).toUpperCase() + priceList.customerSegment.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">Revision: {priceList.priceRevision}</span>
                  <span className="text-sm text-gray-500">Created by: {priceList.createdBy}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push(`/estimation/pricing/edit/${priceListId}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <MoreVertical className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">More</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-medium text-blue-600 uppercase">Total Items</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{priceList.totalItems}</p>
              <p className="text-xs text-blue-600 mt-1">{priceList.linkedProducts} products linked</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-xs font-medium text-green-600 uppercase">Average Margin</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{priceList.averageMarginPercent}%</p>
              <p className="text-xs text-green-600 mt-1">Discount: {priceList.discountRange}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <p className="text-xs font-medium text-purple-600 uppercase">Effective Period</p>
              </div>
              <p className="text-sm font-bold text-purple-900">{priceList.effectiveFrom}</p>
              <p className="text-xs text-purple-600 mt-1">to {priceList.effectiveTo}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                <p className="text-xs font-medium text-orange-600 uppercase">Status</p>
              </div>
              <p className="text-lg font-bold text-orange-900 capitalize">{priceList.status.replace('_', ' ')}</p>
              <p className="text-xs text-orange-600 mt-1">{priceList.region}</p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Price List Progress</h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {getPriceStages(priceList).map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isLast = index === getPriceStages(priceList).length - 1;

                  return (
                    <div key={stage.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center relative z-10">
                        {/* Stage Icon */}
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          stage.status === 'completed'
                            ? 'bg-green-500 border-green-600'
                            : stage.status === 'current'
                            ? 'bg-blue-500 border-blue-600 ring-4 ring-blue-200'
                            : 'bg-gray-200 border-gray-300'
                        }`}>
                          <StageIcon className={`h-6 w-6 ${
                            stage.status === 'completed' || stage.status === 'current'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} />
                        </div>

                        {/* Stage Name */}
                        <div className="mt-2 text-center">
                          <p className={`text-xs font-semibold ${
                            stage.status === 'current' ? 'text-blue-900' : 'text-gray-700'
                          }`}>
                            {stage.name}
                          </p>
                          {stage.date && (
                            <p className="text-xs text-gray-500 mt-0.5">{stage.date}</p>
                          )}
                        </div>
                      </div>

                      {/* Connector Line */}
                      {!isLast && (
                        <div className={`flex-1 h-1 mx-2 rounded ${
                          stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price List Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Price List Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Price List Name</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.priceListName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Price List Number</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.priceListNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-gray-900">{priceList.description}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Currency</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.currency}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tax Included</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    priceList.taxIncluded ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {priceList.taxIncluded ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Segment */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Customer Segment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Segment</p>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${segmentColors[priceList.customerSegment]}`}>
                    {priceList.customerSegment.charAt(0).toUpperCase() + priceList.customerSegment.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Region</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.region}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Total Items</p>
                  <p className="text-sm text-gray-900">{priceList.totalItems} items</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Linked Products</p>
                  <p className="text-sm text-gray-900">{priceList.linkedProducts} products</p>
                </div>
              </div>
            </div>

            {/* Effective Dates */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Effective Period
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Effective From</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.effectiveFrom}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Effective To</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.effectiveTo}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Status</p>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[priceList.status]}`}>
                    {priceList.status.replace('_', ' ').charAt(0).toUpperCase() + priceList.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Dates & Users */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Created & Approved By
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Created Date</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.createdDate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Created By</p>
                  <p className="text-sm text-gray-900">{priceList.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Approved Date</p>
                  <p className="text-sm font-semibold text-gray-900">{priceList.approvedDate || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Approved By</p>
                  <p className="text-sm text-gray-900">{priceList.approvedBy || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Modified</p>
                  <p className="text-sm text-gray-900">{priceList.lastModified} by {priceList.modifiedBy}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Items Tab */}
        {activeTab === 'items' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Price Items Breakdown</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Export Items</span>
              </button>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Base Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Discount %</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Final Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockPriceItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.itemCode}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500">Unit: {item.unit}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">₹{item.basePrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-orange-700">{item.discountPercent}%</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-green-900">₹{item.finalPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-900">{item.marginPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Price History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Price Change History</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors">
                <FileText className="h-4 w-4" />
                <span>Add Note</span>
              </button>
            </div>

            {/* History Timeline */}
            <div className="space-y-4">
              {mockPriceHistory
                .filter(history => history.priceListId === priceListId)
                .map((history, index) => {
                  const HistoryIcon = historyIcons[history.type];
                  const isLast = index === mockPriceHistory.filter(h => h.priceListId === priceListId).length - 1;

                  return (
                    <div key={history.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-300"></div>
                      )}

                      <div className="flex items-start space-x-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${historyColors[history.type]}`}>
                          <HistoryIcon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-base font-bold text-gray-900">{history.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                by {history.performedBy} • {history.timestamp}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{history.description}</p>

                          {history.metadata && (
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                              {history.metadata.itemsAffected && (
                                <div className="flex items-center space-x-1">
                                  <Package className="h-4 w-4" />
                                  <span>{history.metadata.itemsAffected} items affected</span>
                                </div>
                              )}
                              {history.metadata.revisionFrom && history.metadata.revisionTo && (
                                <div className="flex items-center space-x-1">
                                  <Copy className="h-4 w-4" />
                                  <span>Rev {history.metadata.revisionFrom} → Rev {history.metadata.revisionTo}</span>
                                </div>
                              )}
                              {history.metadata.averagePriceChange && (
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>Avg. Change: {history.metadata.averagePriceChange}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
