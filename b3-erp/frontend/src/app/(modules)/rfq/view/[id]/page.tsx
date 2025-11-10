'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ShoppingCart,
  Package,
  User,
  Calendar,
  DollarSign,
  Send,
  Ban,
  FileCheck,
  Building2,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  Award,
  BarChart3,
  Filter,
  ShoppingBag,
} from 'lucide-react';

// TypeScript Interfaces
interface RFQItem {
  id: string;
  itemCode: string;
  description: string;
  specifications: string;
  quantity: number;
  unit: string;
  targetPrice: number;
}

interface VendorQuote {
  id: string;
  vendorId: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'submitted' | 'late';
  submittedDate: string;
  items: {
    itemId: string;
    unitPrice: number;
    total: number;
    deliveryTime: string;
    remarks: string;
  }[];
  paymentTerms: string;
  deliveryTerms: string;
  validity: string;
  totalAmount: number;
  notes: string;
}

interface RFQ {
  id: string;
  rfqNumber: string;
  status: 'draft' | 'issued' | 'quotes_received' | 'evaluated' | 'awarded' | 'cancelled';
  title: string;
  category: 'raw_materials' | 'components' | 'services' | 'equipment';
  issueDate: string;
  closingDate: string;
  validityPeriod: number;
  vendorsInvited: number;
  quotesReceived: number;
  lowestQuote: number;
  daysRemaining: number;
  linkedPR: string;
  items: RFQItem[];
  vendors: VendorQuote[];
  commercialTerms: {
    paymentTerms: string;
    deliveryTerms: string;
    incoterms: string;
    inspectionRequirements: string;
  };
  evaluationCriteria: {
    price: number;
    quality: number;
    deliveryTime: number;
    paymentTerms: number;
  };
  termsAndConditions: string;
  notesToVendors: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Data - ManufacturingOS India
const mockRFQ: RFQ = {
  id: '1',
  rfqNumber: 'RFQ-2025-0087',
  status: 'quotes_received',
  title: 'Procurement of CNC Machine Spare Parts and Raw Materials',
  category: 'raw_materials',
  issueDate: '2025-10-12',
  closingDate: '2025-10-25',
  validityPeriod: 30,
  vendorsInvited: 5,
  quotesReceived: 3,
  lowestQuote: 465000,
  daysRemaining: 8,
  linkedPR: 'PR-2025-0142',
  items: [
    {
      id: '1',
      itemCode: 'SP-CNC-2045',
      description: 'CNC Router Spindle Bearing Assembly',
      specifications: 'High-precision bearing, SKF/NSK brand, 60mm bore, 110mm OD, sealed type',
      quantity: 2,
      unit: 'Nos',
      targetPrice: 12500,
    },
    {
      id: '2',
      itemCode: 'RM-PLY-001',
      description: 'Commercial Grade Plywood 19mm',
      specifications: 'BWP grade, 8x4 ft, ISI marked, moisture resistant, smooth finish both sides',
      quantity: 150,
      unit: 'Sheets',
      targetPrice: 1850,
    },
    {
      id: '3',
      itemCode: 'RM-HW-2567',
      description: 'Stainless Steel Cabinet Hinges',
      specifications: 'Soft-close hinges, 165-degree opening, Hettich/Hafele brand, nickel finish',
      quantity: 500,
      unit: 'Nos',
      targetPrice: 180,
    },
  ],
  vendors: [
    {
      id: '1',
      vendorId: 'V-001',
      vendorName: 'SKF India Ltd',
      contactPerson: 'Ramesh Kumar',
      email: 'ramesh.k@skfindia.com',
      phone: '+91-22-4567-1234',
      status: 'submitted',
      submittedDate: '2025-10-18',
      items: [
        { itemId: '1', unitPrice: 12000, total: 24000, deliveryTime: '7 days', remarks: 'Original SKF bearing' },
        { itemId: '2', unitPrice: 1800, total: 270000, deliveryTime: '10 days', remarks: 'CenturyPly BWP Grade' },
        { itemId: '3', unitPrice: 175, total: 87500, deliveryTime: '7 days', remarks: 'Hettich soft-close' },
      ],
      paymentTerms: 'Net 30 days',
      deliveryTerms: 'Ex-Works Mumbai',
      validity: '30 days from quote date',
      totalAmount: 381500,
      notes: 'All items in stock. Can expedite delivery if needed.',
    },
    {
      id: '2',
      vendorId: 'V-002',
      vendorName: 'Greenply Industries',
      contactPerson: 'Sunil Patil',
      email: 'sunil.p@greenply.com',
      phone: '+91-22-4567-5678',
      status: 'submitted',
      submittedDate: '2025-10-19',
      items: [
        { itemId: '1', unitPrice: 12800, total: 25600, deliveryTime: '10 days', remarks: 'NSK bearing - imported' },
        { itemId: '2', unitPrice: 1750, total: 262500, deliveryTime: '5 days', remarks: 'Greenply BWP Premium' },
        { itemId: '3', unitPrice: 180, total: 90000, deliveryTime: '7 days', remarks: 'Hafele brand' },
      ],
      paymentTerms: 'Net 45 days',
      deliveryTerms: 'Door Delivery',
      validity: '45 days from quote date',
      totalAmount: 378100,
      notes: 'Bulk discount applied. Free delivery for orders above 3 lakhs.',
    },
    {
      id: '3',
      vendorId: 'V-003',
      vendorName: 'Hettich India Pvt Ltd',
      contactPerson: 'Priya Sharma',
      email: 'priya.s@hettich.com',
      phone: '+91-22-4567-9012',
      status: 'submitted',
      submittedDate: '2025-10-20',
      items: [
        { itemId: '1', unitPrice: 13200, total: 26400, deliveryTime: '14 days', remarks: 'Premium SKF bearing' },
        { itemId: '2', unitPrice: 1820, total: 273000, deliveryTime: '7 days', remarks: 'Century BWP' },
        { itemId: '3', unitPrice: 165, total: 82500, deliveryTime: '3 days', remarks: 'Hettich factory direct' },
      ],
      paymentTerms: 'Net 30 days',
      deliveryTerms: 'FOB Mumbai',
      validity: '30 days from quote date',
      totalAmount: 381900,
      notes: 'Premium quality. Extended warranty available.',
    },
  ],
  commercialTerms: {
    paymentTerms: 'Net 30 days from delivery',
    deliveryTerms: 'Door delivery to factory premises',
    incoterms: 'Ex-Works (Factory)',
    inspectionRequirements: 'Quality inspection required before acceptance',
  },
  evaluationCriteria: {
    price: 50,
    quality: 30,
    deliveryTime: 15,
    paymentTerms: 5,
  },
  termsAndConditions: `1. All prices should be quoted in INR including GST
2. Payment terms: Net 30 days from delivery
3. Delivery must be made to our factory premises in Bhiwandi
4. Quality inspection will be conducted before acceptance
5. Vendor must provide warranty as per industry standards
6. Late delivery penalties may apply as per contract
7. ManufacturingOS reserves the right to reject any or all quotes
8. Award decision is final and binding`,
  notesToVendors: 'Please ensure all items are original and come with manufacturer warranties. Priority will be given to vendors who can deliver within 7 days.',
  createdBy: 'Rajesh Patel - Procurement Manager',
  createdAt: '2025-10-12 10:30 AM',
  updatedAt: '2025-10-20 03:45 PM',
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  issued: 'bg-blue-100 text-blue-700 border-blue-300',
  quotes_received: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  evaluated: 'bg-purple-100 text-purple-700 border-purple-300',
  awarded: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

const categoryColors = {
  raw_materials: 'bg-blue-100 text-blue-700',
  components: 'bg-purple-100 text-purple-700',
  services: 'bg-green-100 text-green-700',
  equipment: 'bg-orange-100 text-orange-700',
};

const vendorStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  submitted: 'bg-green-100 text-green-700',
  late: 'bg-red-100 text-red-700',
};

export default function ViewRFQPage() {
  const router = useRouter();
  const params = useParams();
  const rfqId = params.id as string;
  const rfq = mockRFQ;

  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'comparison'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'quotes', name: 'Vendor Quotes', icon: ShoppingCart },
    { id: 'comparison', name: 'Comparison', icon: BarChart3 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLowestQuoteVendor = () => {
    return rfq.vendors.reduce((lowest, vendor) =>
      vendor.totalAmount < lowest.totalAmount ? vendor : lowest
    );
  };

  const calculateScore = (vendor: VendorQuote) => {
    const lowestPrice = Math.min(...rfq.vendors.map(v => v.totalAmount));
    const priceScore = (lowestPrice / vendor.totalAmount) * rfq.evaluationCriteria.price;

    // Simplified scoring - in real system would be more complex
    const qualityScore = 25; // Assume 25 out of 30
    const deliveryScore = 12; // Assume 12 out of 15
    const paymentScore = 4; // Assume 4 out of 5

    return (priceScore + qualityScore + deliveryScore + paymentScore).toFixed(1);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/rfq')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to RFQs</span>
        </button>

        {/* RFQ Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{rfq.rfqNumber}</h1>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[rfq.status]}`}>
                    {rfq.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[rfq.category]}`}>
                    {rfq.category.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">{rfq.title}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Issue Date: {rfq.issueDate}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Closing: {rfq.closingDate}
                  </span>
                  <span className="flex items-center text-orange-600 font-semibold">
                    {rfq.daysRemaining} days remaining
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {rfq.status === 'draft' && (
                <button
                  onClick={() => router.push(`/rfq/edit/${rfqId}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
              {rfq.status === 'draft' && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Send className="h-4 w-4" />
                  <span>Issue RFQ</span>
                </button>
              )}
              {rfq.status === 'quotes_received' && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <CheckCircle className="h-4 w-4" />
                  <span>Evaluate</span>
                </button>
              )}
              {rfq.status === 'evaluated' && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Award className="h-4 w-4" />
                  <span>Award to Vendor</span>
                </button>
              )}
              {(rfq.status === 'evaluated' || rfq.status === 'awarded') && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Create PO</span>
                </button>
              )}
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                <Ban className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-medium text-blue-600 uppercase">Vendors Invited</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{rfq.vendorsInvited}</p>
              <p className="text-xs text-blue-600 mt-1">Suppliers contacted</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-xs font-medium text-green-600 uppercase">Quotes Received</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{rfq.quotesReceived}</p>
              <p className="text-xs text-green-600 mt-1">Responses received</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <p className="text-xs font-medium text-purple-600 uppercase">Lowest Quote</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(rfq.lowestQuote)}</p>
              <p className="text-xs text-purple-600 mt-1">Best price received</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <p className="text-xs font-medium text-orange-600 uppercase">Closing Date</p>
              </div>
              <p className="text-2xl font-bold text-orange-900">{rfq.closingDate}</p>
              <p className="text-xs text-orange-600 mt-1">{rfq.daysRemaining} days remaining</p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">RFQ Process</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  rfq.status !== 'draft' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Draft</p>
                </div>
              </div>

              <div className={`flex-1 h-1 mx-2 ${rfq.status !== 'draft' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

              <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  rfq.status === 'issued' || rfq.status === 'quotes_received' || rfq.status === 'evaluated' || rfq.status === 'awarded'
                    ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <Send className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Issued</p>
                </div>
              </div>

              <div className={`flex-1 h-1 mx-2 ${
                rfq.status === 'quotes_received' || rfq.status === 'evaluated' || rfq.status === 'awarded' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>

              <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  rfq.status === 'quotes_received' || rfq.status === 'evaluated' || rfq.status === 'awarded'
                    ? 'bg-yellow-500' : 'bg-gray-300'
                }`}>
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Quotes Received</p>
                </div>
              </div>

              <div className={`flex-1 h-1 mx-2 ${
                rfq.status === 'evaluated' || rfq.status === 'awarded' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>

              <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  rfq.status === 'evaluated' || rfq.status === 'awarded' ? 'bg-purple-500' : 'bg-gray-300'
                }`}>
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Evaluated</p>
                </div>
              </div>

              <div className={`flex-1 h-1 mx-2 ${rfq.status === 'awarded' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

              <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  rfq.status === 'awarded' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Awarded</p>
                </div>
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">RFQ Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RFQ Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  RFQ Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">RFQ Number</p>
                    <p className="text-sm font-semibold text-gray-900">{rfq.rfqNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Title</p>
                    <p className="text-sm text-gray-900">{rfq.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Category</p>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${categoryColors[rfq.category]}`}>
                      {rfq.category.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Issue Date</p>
                    <p className="text-sm text-gray-900">{rfq.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Closing Date</p>
                    <p className="text-sm font-semibold text-orange-600">{rfq.closingDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Validity Period</p>
                    <p className="text-sm text-gray-900">{rfq.validityPeriod} days</p>
                  </div>
                </div>
              </div>

              {/* Linked Documents */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Linked Documents
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Linked Purchase Requisition</p>
                    {rfq.linkedPR ? (
                      <button
                        onClick={() => alert(`View linked PR ${rfq.linkedPR} - Feature coming soon`)}
                        className="text-sm text-blue-600 hover:underline font-semibold"
                      >
                        {rfq.linkedPR}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No linked PR</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Created By</p>
                    <p className="text-sm text-gray-900">{rfq.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Created At</p>
                    <p className="text-sm text-gray-900">{rfq.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Updated</p>
                    <p className="text-sm text-gray-900">{rfq.updatedAt}</p>
                  </div>
                </div>
              </div>

              {/* Item Specifications */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Item Specifications ({rfq.items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item Code</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Specifications</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Target Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfq.items.map((item, index) => (
                        <tr key={item.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.itemCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{item.description}</td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">{item.specifications}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.targetPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Commercial Terms
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Payment Terms</p>
                    <p className="text-sm text-gray-900">{rfq.commercialTerms.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery Terms</p>
                    <p className="text-sm text-gray-900">{rfq.commercialTerms.deliveryTerms}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Incoterms</p>
                    <p className="text-sm font-semibold text-gray-900">{rfq.commercialTerms.incoterms}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Inspection</p>
                    <p className="text-sm text-gray-900">{rfq.commercialTerms.inspectionRequirements}</p>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Evaluation Criteria (Weighted)
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700">Price</p>
                      <p className="text-sm font-bold text-blue-600">{rfq.evaluationCriteria.price}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${rfq.evaluationCriteria.price}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700">Quality</p>
                      <p className="text-sm font-bold text-green-600">{rfq.evaluationCriteria.quality}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${rfq.evaluationCriteria.quality}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700">Delivery Time</p>
                      <p className="text-sm font-bold text-orange-600">{rfq.evaluationCriteria.deliveryTime}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${rfq.evaluationCriteria.deliveryTime}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700">Payment Terms</p>
                      <p className="text-sm font-bold text-purple-600">{rfq.evaluationCriteria.paymentTerms}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${rfq.evaluationCriteria.paymentTerms}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendors Invited */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Vendors Invited ({rfq.vendors.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rfq.vendors.map((vendor) => (
                    <div key={vendor.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-bold text-gray-900">{vendor.vendorName}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${vendorStatusColors[vendor.status]}`}>
                          {vendor.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{vendor.contactPerson}</p>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {vendor.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {vendor.phone}
                        </div>
                      </div>
                      {vendor.submittedDate && (
                        <p className="text-xs text-green-600 font-semibold mt-2">
                          Submitted: {vendor.submittedDate}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Terms & Conditions
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{rfq.termsAndConditions}</pre>
                </div>
              </div>

              {/* Notes to Vendors */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Notes to Vendors
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{rfq.notesToVendors}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Vendor Quotes ({rfq.quotesReceived}/{rfq.vendorsInvited})</h3>
            </div>

            <div className="space-y-6">
              {rfq.vendors.filter(v => v.status === 'submitted').map((vendor) => (
                <div key={vendor.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{vendor.vendorName}</h4>
                      <p className="text-sm text-gray-600">{vendor.contactPerson} • {vendor.email} • {vendor.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {vendor.submittedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Quote</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(vendor.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Quote Items */}
                  <div className="mb-4">
                    <h5 className="text-sm font-bold text-gray-900 mb-2">Line Items</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300 bg-white">
                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">Item</th>
                            <th className="px-3 py-2 text-right text-xs font-bold text-gray-700">Unit Price</th>
                            <th className="px-3 py-2 text-right text-xs font-bold text-gray-700">Total</th>
                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">Delivery</th>
                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendor.items.map((item, index) => {
                            const rfqItem = rfq.items.find(i => i.id === item.itemId);
                            return (
                              <tr key={index} className="border-b border-gray-200">
                                <td className="px-3 py-2">{rfqItem?.itemCode} - {rfqItem?.description}</td>
                                <td className="px-3 py-2 text-right font-semibold">{formatCurrency(item.unitPrice)}</td>
                                <td className="px-3 py-2 text-right font-bold text-green-600">{formatCurrency(item.total)}</td>
                                <td className="px-3 py-2 text-xs">{item.deliveryTime}</td>
                                <td className="px-3 py-2 text-xs">{item.remarks}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Payment Terms</p>
                      <p className="text-sm text-gray-900">{vendor.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery Terms</p>
                      <p className="text-sm text-gray-900">{vendor.deliveryTerms}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Validity</p>
                      <p className="text-sm text-gray-900">{vendor.validity}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {vendor.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Vendor Notes:</p>
                      <p className="text-sm text-gray-700">{vendor.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quote Comparison</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Filter className="h-4 w-4" />
                <span>Export Comparison</span>
              </button>
            </div>

            {/* Side-by-side Comparison */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase sticky left-0 bg-gray-50">Item</th>
                    {rfq.vendors.filter(v => v.status === 'submitted').map((vendor) => (
                      <th key={vendor.id} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">
                        {vendor.vendorName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rfq.items.map((item, index) => (
                    <tr key={item.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 sticky left-0 bg-inherit">
                        {item.itemCode}<br />
                        <span className="text-xs text-gray-600">{item.description}</span>
                      </td>
                      {rfq.vendors.filter(v => v.status === 'submitted').map((vendor) => {
                        const vendorItem = vendor.items.find(vi => vi.itemId === item.id);
                        const lowestPrice = Math.min(...rfq.vendors.filter(v => v.status === 'submitted').map(v =>
                          v.items.find(vi => vi.itemId === item.id)?.unitPrice || Infinity
                        ));
                        const isLowest = vendorItem?.unitPrice === lowestPrice;

                        return (
                          <td key={vendor.id} className={`px-4 py-3 text-center ${isLowest ? 'bg-green-50' : ''}`}>
                            <p className={`text-sm font-bold ${isLowest ? 'text-green-700' : 'text-gray-900'}`}>
                              {vendorItem ? formatCurrency(vendorItem.unitPrice) : 'N/A'}
                            </p>
                            <p className="text-xs text-gray-600">{vendorItem?.deliveryTime || '-'}</p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                    <td className="px-4 py-4 text-sm text-gray-900 uppercase sticky left-0 bg-gray-50">Total</td>
                    {rfq.vendors.filter(v => v.status === 'submitted').map((vendor) => {
                      const isLowest = vendor.totalAmount === getLowestQuoteVendor().totalAmount;
                      return (
                        <td key={vendor.id} className={`px-4 py-4 text-center ${isLowest ? 'bg-green-100' : ''}`}>
                          <p className={`text-lg font-bold ${isLowest ? 'text-green-700' : 'text-gray-900'}`}>
                            {formatCurrency(vendor.totalAmount)}
                          </p>
                          {isLowest && (
                            <p className="text-xs text-green-600 font-semibold mt-1">LOWEST</p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50">Evaluation Score</td>
                    {rfq.vendors.filter(v => v.status === 'submitted').map((vendor) => (
                      <td key={vendor.id} className="px-4 py-3 text-center">
                        <p className="text-lg font-bold text-blue-600">{calculateScore(vendor)}</p>
                        <p className="text-xs text-gray-600">out of 100</p>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Winner Recommendation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Recommended Vendor</h4>
                  <p className="text-sm text-gray-600">Based on evaluation criteria</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-700">{getLowestQuoteVendor().vendorName}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Total Quote: <span className="font-bold">{formatCurrency(getLowestQuoteVendor().totalAmount)}</span> |
                    Score: <span className="font-bold">{calculateScore(getLowestQuoteVendor())}/100</span>
                  </p>
                </div>
                <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  <Award className="h-5 w-5" />
                  <span>Award Contract</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
