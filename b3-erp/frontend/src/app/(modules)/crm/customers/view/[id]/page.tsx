'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  MapPin,
  DollarSign,
  CreditCard,
  Calendar,
  Clock,
  FileText,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Package,
  PhoneCall,
  Video,
  Users,
  MessageSquare,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Tag,
  Globe,
  User,
  Truck,
  Briefcase,
  Upload,
} from 'lucide-react';

// Enterprise Customer Interface matching comprehensive ERP fields
interface Address {
  id: string;
  addressType: 'billing' | 'shipping' | 'correspondence' | 'warehouse';
  buildingFlat: string;
  localityArea: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
}

interface ContactPerson {
  id: string;
  role: 'primary' | 'billing' | 'technical' | 'purchasing' | 'decision_maker' | 'shipping';
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  preferredContactMethod: 'email' | 'phone' | 'mobile';
  isPrimary: boolean;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
}

interface CustomField {
  key: string;
  value: string;
}

interface Customer {
  id: string;
  // General Information
  customerNumber: string;
  customerName: string;
  legalName: string;
  tradeName: string;
  customerGroup: 'wholesale' | 'retail' | 'distributor' | 'oem' | 'end_user';
  customerClassification: 'A' | 'B' | 'C';
  industrySector: string;
  companySize: string;
  annualRevenue: string;
  udyamNumber: string;
  gstNumber: string;
  panNumber: string;
  tanNumber: string;
  gstRegistrationType: 'regular' | 'composition' | 'unregistered';
  website: string;
  generalEmail: string;
  generalPhone: string;

  // Addresses
  addresses: Address[];

  // Contacts
  contacts: ContactPerson[];

  // Financial & Credit
  creditLimit: number;
  creditUsed: number;
  availableCredit: number;
  creditStatus: 'approved' | 'on_hold' | 'suspended' | 'review_required';
  creditCheckRequired: boolean;
  paymentTerms: string;
  paymentMethod: string;
  dunningProcedure: string;
  interestCalculation: boolean;
  bankDetails: BankDetails;
  preferredCurrency: string;
  exchangeRateType: string;
  priceListAssignment: string;
  discountGroup: string;
  taxClassification: string;
  taxExempt: boolean;
  taxExemptReason: string;
  taxIdEin: string;

  // Sales & Marketing
  salesOrganization: string;
  distributionChannel: string;
  division: string;
  salesOffice: string;
  salesGroup: string;
  accountManager: string;
  salesRepresentative: string;
  territoryAssignment: string;
  customerHierarchy: string;
  marketSegment: string;
  preferredVendorStatus: boolean;
  abcClassificationSales: 'A' | 'B' | 'C';
  salesBlock: boolean;
  salesBlockReason: string;
  deliveryBlock: boolean;
  deliveryBlockReason: string;
  billingBlock: boolean;
  billingBlockReason: string;
  incoterms: string;
  shippingConditions: string;
  deliveryPriority: 'high' | 'medium' | 'low';
  partialDeliveryAllowed: boolean;
  maxPartialDeliveries: string;

  // Logistics & Shipping
  shippingMethod: string;
  preferredCarrier: string;
  freightTerms: string;
  shippingInstructions: string;
  loadingUnloadingTimes: string;
  dockHours: string;
  specialHandlingRequirements: string;
  insuranceRequired: boolean;
  warehouseAssignment: string;
  deliveryTolerance: string;
  pickingLocation: string;
  packingRequirements: string;
  labelingRequirements: string;
  routeSchedule: string;
  deliveryDayPreferences: string[];
  deliveryTimeWindow: string;

  // Additional Information
  customerSince: string;
  accountStatus: 'active' | 'inactive' | 'suspended' | 'prospect' | 'closed';
  businessRelationshipType: 'b2b' | 'b2c' | 'b2g';
  customerLifecycleStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at_risk' | 'churned';
  riskRating: 'low' | 'medium' | 'high';
  complianceStatus: string;
  certificationsRequired: string[];
  contractNumber: string;
  contractStartDate: string;
  contractEndDate: string;
  serviceLevelAgreement: string;
  specialInstructions: string;
  internalNotes: string;
  tags: string[];
  attachments: string[];
  customFields: CustomField[];
  dataPrivacyConsent: boolean;
  marketingConsent: boolean;

  // Legacy fields for backward compatibility
  lifetimeValue: number;
  totalOrders: number;
  lastOrderDate: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: number;
}

interface Interaction {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'site_visit';
  title: string;
  description: string;
  performedBy: string;
  date: string;
  outcome?: string;
}

// Mock customer data with comprehensive enterprise fields - B3 MACBIS India
const mockCustomer: Customer = {
  id: '1',
  // General Information
  customerNumber: 'CUST-2023-0142',
  customerName: 'Sharma Modular Kitchens Pvt Ltd',
  legalName: 'Sharma Modular Kitchens Private Limited',
  tradeName: 'Sharma Kitchens & Interiors',
  customerGroup: 'wholesale',
  customerClassification: 'A',
  industrySector: 'Modular Kitchen Dealers',
  companySize: '201-500',
  annualRevenue: '₹25 Cr - ₹50 Cr',
  udyamNumber: 'UDYAM-MH-12-1234567',
  gstNumber: '27AAAAA0000A1Z5',
  panNumber: 'AAAPL1234C',
  tanNumber: 'MUMM12345A',
  gstRegistrationType: 'regular',
  website: 'https://www.sharmakitchens.co.in',
  generalEmail: 'contact@sharmakitchens.co.in',
  generalPhone: '+91-22-4567-8900',

  // Addresses
  addresses: [
    {
      id: '1',
      addressType: 'billing',
      buildingFlat: 'Building 456, 3rd Floor',
      localityArea: 'Andheri Industrial Estate',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400053',
      country: 'India',
      isDefaultBilling: true,
      isDefaultShipping: false,
    },
    {
      id: '2',
      addressType: 'shipping',
      buildingFlat: 'Godown No. 789',
      localityArea: 'MIDC Bhiwandi',
      city: 'Bhiwandi',
      state: 'Maharashtra',
      pinCode: '421302',
      country: 'India',
      isDefaultBilling: false,
      isDefaultShipping: true,
    },
    {
      id: '3',
      addressType: 'warehouse',
      buildingFlat: 'Warehouse 12',
      localityArea: 'Turbhe MIDC',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pinCode: '400705',
      country: 'India',
      isDefaultBilling: false,
      isDefaultShipping: false,
    },
  ],

  // Contacts
  contacts: [
    {
      id: '1',
      role: 'primary',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      title: 'Managing Director',
      department: 'Executive',
      email: 'rajesh@sharmakitchens.co.in',
      phone: '+91-22-4567-8900',
      mobile: '+91-98765-43210',
      preferredContactMethod: 'email',
      isPrimary: true,
    },
    {
      id: '2',
      role: 'billing',
      firstName: 'Priya',
      lastName: 'Sharma',
      title: 'Finance Director',
      department: 'Finance & Accounts',
      email: 'priya.sharma@sharmakitchens.co.in',
      phone: '+91-22-4567-8901',
      mobile: '+91-98765-43211',
      preferredContactMethod: 'email',
      isPrimary: false,
    },
    {
      id: '3',
      role: 'technical',
      firstName: 'Anil',
      lastName: 'Patel',
      title: 'Operations Head',
      department: 'Operations',
      email: 'anil.p@sharmakitchens.co.in',
      phone: '+91-22-4567-8902',
      mobile: '+91-98765-43212',
      preferredContactMethod: 'phone',
      isPrimary: false,
    },
    {
      id: '4',
      role: 'purchasing',
      firstName: 'Sneha',
      lastName: 'Deshmukh',
      title: 'Purchase Manager',
      department: 'Procurement',
      email: 'sneha.d@sharmakitchens.co.in',
      phone: '+91-22-4567-8903',
      mobile: '+91-98765-43213',
      preferredContactMethod: 'email',
      isPrimary: false,
    },
  ],

  // Financial & Credit
  creditLimit: 15000000,
  creditUsed: 5500000,
  availableCredit: 9500000,
  creditStatus: 'approved',
  creditCheckRequired: true,
  paymentTerms: 'Net 30 days',
  paymentMethod: 'NEFT/RTGS',
  dunningProcedure: 'Standard 30-60-90',
  interestCalculation: true,
  bankDetails: {
    bankName: 'HDFC Bank',
    accountNumber: '****6789',
    ifscCode: 'HDFC0001234',
    branchName: 'Andheri West, Mumbai',
    upiId: 'sharmakitchens@hdfcbank',
  },
  preferredCurrency: 'INR',
  exchangeRateType: 'Standard',
  priceListAssignment: 'B2B Dealers - Tier A',
  discountGroup: 'High Volume - 15%',
  taxClassification: 'GST Registered',
  taxExempt: false,
  taxExemptReason: '',
  taxIdEin: '27AAAAA0000A1Z5',

  // Sales & Marketing
  salesOrganization: 'West Region - Mumbai',
  distributionChannel: 'B2B Dealers',
  division: 'Modular Kitchens',
  salesOffice: 'Mumbai Head Office',
  salesGroup: 'Maharashtra Region',
  accountManager: 'Priya Patel',
  salesRepresentative: 'Amit Desai',
  territoryAssignment: 'Mumbai, Pune, Nashik',
  customerHierarchy: 'Major Account - Tier 1',
  marketSegment: 'Modular Kitchen Dealers',
  preferredVendorStatus: true,
  abcClassificationSales: 'A',
  salesBlock: false,
  salesBlockReason: '',
  deliveryBlock: false,
  deliveryBlockReason: '',
  billingBlock: false,
  billingBlockReason: '',
  incoterms: 'Ex-Works (Factory)',
  shippingConditions: 'Standard',
  deliveryPriority: 'high',
  partialDeliveryAllowed: true,
  maxPartialDeliveries: '3',

  // Logistics & Shipping
  shippingMethod: 'Road Transport',
  preferredCarrier: 'VRL Logistics',
  freightTerms: 'Freight Paid',
  shippingInstructions: 'Prefers morning deliveries between 9AM-12PM. Contact Mr. Anil at warehouse 24 hours before delivery.',
  loadingUnloadingTimes: '9AM - 5PM',
  dockHours: 'Monday-Saturday 9AM-6PM',
  specialHandlingRequirements: 'Handle with care - Fragile kitchen components. Covered truck required.',
  insuranceRequired: true,
  warehouseAssignment: 'Bhiwandi Distribution Center',
  deliveryTolerance: '5%',
  pickingLocation: 'Zone B',
  packingRequirements: 'Bubble wrap and wooden crating for glass items',
  labelingRequirements: 'Customer PO# and GST details required on all labels',
  routeSchedule: 'Monday/Wednesday delivery schedule',
  deliveryDayPreferences: ['Monday', 'Wednesday'],
  deliveryTimeWindow: '9AM - 12PM',

  // Additional Information
  customerSince: '2023-06-15',
  accountStatus: 'active',
  businessRelationshipType: 'b2b',
  customerLifecycleStage: 'mature',
  riskRating: 'low',
  complianceStatus: 'Compliant',
  certificationsRequired: ['ISO 9001:2015', 'BIS Certification', 'FSC Certified'],
  contractNumber: 'CONTRACT-2023-0142',
  contractStartDate: '2023-06-15',
  contractEndDate: '2026-06-14',
  serviceLevelAgreement: '24-hour order processing, 3-day delivery within Maharashtra',
  specialInstructions: 'Prefers morning deliveries between 9AM-12PM. Contact Mr. Anil at warehouse 24 hours before delivery. Ensure GST invoice accompanies shipment.',
  internalNotes: 'High-value B2B dealer with excellent payment history. Approved for expedited processing. Key customer in Maharashtra region.',
  tags: ['VIP Customer', 'High Volume', 'Premium Tier', 'Maharashtra Dealer'],
  attachments: ['contract_2023_0142.pdf', 'gst_certificate.pdf', 'udyam_registration.pdf', 'pan_card.pdf'],
  customFields: [
    { key: 'Previous Supplier', value: 'Local Kitchen Manufacturers' },
    { key: 'Referral Source', value: 'Acetech Mumbai 2023' },
    { key: 'Annual Volume Commitment', value: '₹1.5 Cr' },
  ],
  dataPrivacyConsent: true,
  marketingConsent: true,

  // Legacy fields
  lifetimeValue: 8500000,
  totalOrders: 15,
  lastOrderDate: '2025-10-05',
};

// Mock orders data - B3 MACBIS India
const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD-2025-1234', date: '2025-10-05', amount: 785000, status: 'paid', items: 45 },
  { id: '2', orderNumber: 'ORD-2025-1189', date: '2025-09-28', amount: 625000, status: 'paid', items: 32 },
  { id: '3', orderNumber: 'ORD-2025-1145', date: '2025-09-15', amount: 945000, status: 'pending', items: 58 },
  { id: '4', orderNumber: 'ORD-2025-1098', date: '2025-08-22', amount: 485000, status: 'paid', items: 28 },
  { id: '5', orderNumber: 'ORD-2025-1056', date: '2025-08-10', amount: 850000, status: 'overdue', items: 41 },
  { id: '6', orderNumber: 'ORD-2025-1023', date: '2025-07-18', amount: 725000, status: 'paid', items: 37 },
  { id: '7', orderNumber: 'ORD-2025-0987', date: '2025-07-05', amount: 595000, status: 'paid', items: 33 },
];

// Mock interactions - B3 MACBIS India
const mockInteractions: Interaction[] = [
  {
    id: '1',
    type: 'call',
    title: 'Diwali Season Order Planning Discussion',
    description: 'Discussed upcoming festive season bulk order requirements. Customer planning to increase order volume by 30% for Diwali season. Requested custom modular kitchen designs for luxury segment.',
    performedBy: 'Priya Patel',
    date: '2025-10-10 14:30',
    outcome: 'Positive',
  },
  {
    id: '2',
    type: 'site_visit',
    title: 'Factory Visit and Quality Inspection',
    description: 'Customer representatives Mr. Rajesh and team visited our manufacturing facility in Bhiwandi. Toured production floor, quality control, and finishing department. Very impressed with new CNC machines and finish quality.',
    performedBy: 'Amit Desai',
    date: '2025-10-08 10:00',
    outcome: 'Very Positive',
  },
  {
    id: '3',
    type: 'email',
    title: 'GST Invoice and Payment Confirmation',
    description: 'Sent payment confirmation for invoice INV-2025-1234. Payment of ₹7,85,000 received via NEFT. GST invoice shared. Updated account status.',
    performedBy: 'Accounts Team',
    date: '2025-10-06 09:15',
  },
  {
    id: '4',
    type: 'meeting',
    title: 'New Product Range Review Meeting',
    description: 'Meeting at customer showroom to review new 2025 modular kitchen range. Customer interested in premium German hardware collection and customized finishes. Discussed volume pricing for bulk orders.',
    performedBy: 'Priya Patel',
    date: '2025-09-25 15:00',
    outcome: 'Interested',
  },
  {
    id: '5',
    type: 'call',
    title: 'Delivery Schedule for Maharashtra',
    description: 'Coordinated delivery schedule for September orders to Mumbai and Pune locations. Customer requested morning slots (9AM-12PM) for next three shipments. Confirmed with VRL Logistics.',
    performedBy: 'Logistics Team',
    date: '2025-09-20 11:30',
    outcome: 'Resolved',
  },
  {
    id: '6',
    type: 'email',
    title: 'Credit Limit Enhancement Approved',
    description: 'Approved credit limit increase from ₹1 Cr to ₹1.5 Cr based on excellent payment history and growing business. Customer notified via email with updated credit terms.',
    performedBy: 'Finance Team',
    date: '2025-09-15 08:45',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
};

const orderStatusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
};

const interactionIcons = {
  call: PhoneCall,
  meeting: Users,
  email: Mail,
  site_visit: Building2,
};

const interactionColors = {
  call: 'bg-blue-100 text-blue-600 border-blue-200',
  meeting: 'bg-green-100 text-green-600 border-green-200',
  email: 'bg-purple-100 text-purple-600 border-purple-200',
  site_visit: 'bg-orange-100 text-orange-600 border-orange-200',
};

export default function ViewCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const customer = mockCustomer;

  const [activeTab, setActiveTab] = useState<'general' | 'addresses' | 'contacts' | 'financial' | 'sales' | 'logistics' | 'additional' | 'orders' | 'interactions'>('general');

  const tabs = [
    { id: 'general', name: 'General Information', icon: Building2 },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'contacts', name: 'Contacts', icon: Users },
    { id: 'financial', name: 'Financial & Credit', icon: DollarSign },
    { id: 'sales', name: 'Sales & Marketing', icon: ShoppingCart },
    { id: 'logistics', name: 'Logistics & Shipping', icon: Truck },
    { id: 'additional', name: 'Additional Info', icon: FileText },
    { id: 'orders', name: 'Orders & Invoices', icon: Receipt },
    { id: 'interactions', name: 'Activity Timeline', icon: Activity },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLakhsCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return formatCurrency(amount);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/crm/customers')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Customers</span>
        </button>

        {/* Customer Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{customer.customerName}</h1>
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">
                    {customer.customerNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{customer.legalName}</p>
                <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
                    {customer.industrySector}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[customer.accountStatus as keyof typeof statusColors] || ""}`}>
                    {customer.accountStatus.charAt(0).toUpperCase() + customer.accountStatus.slice(1)}
                  </span>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-700">
                    {customer.customerGroup.charAt(0).toUpperCase() + customer.customerGroup.slice(1)}
                  </span>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                    Class {customer.customerClassification}
                  </span>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700">
                    {customer.customerLifecycleStage.charAt(0).toUpperCase() + customer.customerLifecycleStage.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push(`/crm/customers/edit/${customerId}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ShoppingCart className="h-4 w-4" />
                <span>Create Order</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Receipt className="h-4 w-4" />
                <span>Send Invoice</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-xs font-medium text-green-600 uppercase">Lifetime Value</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(customer.lifetimeValue)}</p>
              <p className="text-xs text-green-600 mt-1">{customer.totalOrders} orders</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-medium text-blue-600 uppercase">Available Credit</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(customer.availableCredit)}</p>
              <p className="text-xs text-blue-600 mt-1">of {formatCurrency(customer.creditLimit)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <p className="text-xs font-medium text-purple-600 uppercase">Credit Status</p>
              </div>
              <p className="text-lg font-bold text-purple-900 capitalize">{customer.creditStatus.replace('_', ' ')}</p>
              <p className="text-xs text-purple-600 mt-1">{customer.paymentTerms}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-5 w-5 text-orange-600" />
                <p className="text-xs font-medium text-orange-600 uppercase">Account Manager</p>
              </div>
              <p className="text-lg font-bold text-orange-900">{customer.accountManager}</p>
              <p className="text-xs text-orange-600 mt-1">{customer.salesOffice}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <p className="text-xs font-medium text-yellow-600 uppercase">Customer Since</p>
              </div>
              <p className="text-lg font-bold text-yellow-900">{customer.customerSince}</p>
              <p className="text-xs text-yellow-600 mt-1">Last order: {customer.lastOrderDate}</p>
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
        {/* General Information Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">General Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Company Data */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Company Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer Number</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.customerNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer Name</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Legal Name</p>
                    <p className="text-sm text-gray-900">{customer.legalName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Trade Name</p>
                    <p className="text-sm text-gray-900">{customer.tradeName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer Group</p>
                    <p className="text-sm text-gray-900 capitalize">{customer.customerGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Classification</p>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                      Class {customer.customerClassification}
                    </span>
                  </div>
                </div>
              </div>

              {/* Industry & Company Size */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Business Profile
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Industry Sector</p>
                    <p className="text-sm text-gray-900">{customer.industrySector}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Company Size</p>
                    <p className="text-sm text-gray-900">{customer.companySize} employees</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Annual Revenue</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.annualRevenue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Udyam Registration Number</p>
                    <p className="text-sm text-gray-900">{customer.udyamNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">GST Number (GSTIN)</p>
                    <p className="text-sm text-gray-900">{customer.gstNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">PAN Number</p>
                    <p className="text-sm text-gray-900">{customer.panNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">TAN Number</p>
                    <p className="text-sm text-gray-900">{customer.tanNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">GST Registration Type</p>
                    <p className="text-sm text-gray-900 capitalize">{customer.gstRegistrationType}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  General Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Website</p>
                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{customer.website}</span>
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">General Email</p>
                    <a href={`mailto:${customer.generalEmail}`} className="text-sm text-blue-600 hover:underline break-all">{customer.generalEmail}</a>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">General Phone</p>
                    <a href={`tel:${customer.generalPhone}`} className="text-sm text-blue-600 hover:underline">{customer.generalPhone}</a>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Account Status</p>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[customer.accountStatus as keyof typeof statusColors] || ""}`}>
                      {customer.accountStatus.charAt(0).toUpperCase() + customer.accountStatus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer Since</p>
                    <p className="text-sm text-gray-900">{customer.customerSince}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Lifecycle Stage</p>
                    <p className="text-sm text-gray-900 capitalize">{customer.customerLifecycleStage}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Business Relationship Type</p>
                    <p className="text-sm text-gray-900 uppercase">{customer.businessRelationshipType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Risk Rating</p>
                    <span className={`px-3 py-1 text-sm font-semibold rounded ${
                      customer.riskRating === 'low' ? 'bg-green-100 text-green-700' :
                      customer.riskRating === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {customer.riskRating.charAt(0).toUpperCase() + customer.riskRating.slice(1)} Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Addresses</h2>
              <span className="text-sm text-gray-600">{customer.addresses.length} addresses on file</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer.addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900 capitalize">{address.addressType} Address</h3>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {address.isDefaultBilling && (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                          Default Billing
                        </span>
                      )}
                      {address.isDefaultShipping && (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                          Default Shipping
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 space-y-1">
                    <p className="text-sm text-gray-900 font-medium">{address.buildingFlat}</p>
                    <p className="text-sm text-gray-900">{address.localityArea}</p>
                    <p className="text-sm text-gray-900">
                      {address.city}, {address.state} - {address.pinCode}
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Contact Persons</h2>
              <span className="text-sm text-gray-600">{customer.contacts.length} contacts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer.contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                      </div>
                    </div>
                    {contact.isPrimary && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-500 uppercase">Role</p>
                      <p className="text-sm text-gray-900 capitalize">{contact.role.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-500 uppercase">Department</p>
                      <p className="text-sm text-gray-900">{contact.department}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline break-all">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                      {contact.mobile && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${contact.mobile}`} className="text-sm text-blue-600 hover:underline">
                            {contact.mobile} (Mobile)
                          </a>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Preferred:</p>
                        <p className="text-xs text-gray-900 capitalize">{contact.preferredContactMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial & Credit Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial & Credit Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Management */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Credit Management
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Credit Limit</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(customer.creditLimit)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Credit Used</p>
                    <p className="text-sm font-semibold text-orange-600">{formatCurrency(customer.creditUsed)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Available Credit</p>
                    <p className="text-sm font-bold text-green-600">{formatCurrency(customer.availableCredit)}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">Credit Status</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        customer.creditStatus === 'approved' ? 'bg-green-100 text-green-700' :
                        customer.creditStatus === 'on_hold' ? 'bg-yellow-100 text-yellow-700' :
                        customer.creditStatus === 'suspended' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {customer.creditStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium text-gray-500 uppercase">Credit Check Required</p>
                      <p className="text-sm text-gray-900">{customer.creditCheckRequired ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Payment Terms
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Payment Terms</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Payment Method</p>
                    <p className="text-sm text-gray-900">{customer.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Dunning Procedure</p>
                    <p className="text-sm text-gray-900">{customer.dunningProcedure}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Interest Calculation</p>
                    <p className="text-sm text-gray-900">{customer.interestCalculation ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Preferred Currency</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.preferredCurrency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Exchange Rate Type</p>
                    <p className="text-sm text-gray-900">{customer.exchangeRateType}</p>
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Banking Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Bank Name</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Account Number</p>
                    <p className="text-sm text-gray-900">{customer.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">IFSC Code</p>
                    <p className="text-sm text-gray-900">{customer.bankDetails.ifscCode}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Branch Name</p>
                    <p className="text-sm text-gray-900">{customer.bankDetails.branchName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">UPI ID</p>
                    <p className="text-sm text-gray-900">{customer.bankDetails.upiId}</p>
                  </div>
                </div>
              </div>

              {/* Tax & Pricing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Tax & Pricing
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tax ID / EIN</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.taxIdEin}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tax Classification</p>
                    <p className="text-sm text-gray-900">{customer.taxClassification}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Tax Exempt</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      customer.taxExempt ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.taxExempt ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {customer.taxExempt && customer.taxExemptReason && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tax Exempt Reason</p>
                      <p className="text-sm text-gray-900">{customer.taxExemptReason}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Price List Assignment</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.priceListAssignment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Discount Group</p>
                    <p className="text-sm text-gray-900">{customer.discountGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales & Marketing Tab */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales & Marketing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Organization */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Sales Organization
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Sales Organization</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.salesOrganization}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Distribution Channel</p>
                    <p className="text-sm text-gray-900">{customer.distributionChannel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Division</p>
                    <p className="text-sm text-gray-900">{customer.division}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Sales Office</p>
                    <p className="text-sm text-gray-900">{customer.salesOffice}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Sales Group</p>
                    <p className="text-sm text-gray-900">{customer.salesGroup}</p>
                  </div>
                </div>
              </div>

              {/* Sales Team */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Sales Team
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Account Manager</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.accountManager}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Sales Representative</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.salesRepresentative}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Territory Assignment</p>
                    <p className="text-sm text-gray-900">{customer.territoryAssignment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer Hierarchy</p>
                    <p className="text-sm text-gray-900">{customer.customerHierarchy}</p>
                  </div>
                </div>
              </div>

              {/* Market Segmentation */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Market Segmentation
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Market Segment</p>
                    <p className="text-sm text-gray-900">{customer.marketSegment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">ABC Classification (Sales)</p>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                      Class {customer.abcClassificationSales}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Preferred Vendor Status</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      customer.preferredVendorStatus ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.preferredVendorStatus ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery & Incoterms */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Delivery Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Incoterms</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.incoterms}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping Conditions</p>
                    <p className="text-sm text-gray-900">{customer.shippingConditions}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery Priority</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                      customer.deliveryPriority === 'high' ? 'bg-red-100 text-red-700' :
                      customer.deliveryPriority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {customer.deliveryPriority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Partial Delivery Allowed</p>
                    <p className="text-sm text-gray-900">{customer.partialDeliveryAllowed ? 'Yes' : 'No'}</p>
                  </div>
                  {customer.partialDeliveryAllowed && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Max Partial Deliveries</p>
                      <p className="text-sm text-gray-900">{customer.maxPartialDeliveries}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Blocks */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  Customer Blocks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">Sales Block</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        customer.salesBlock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.salesBlock ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    {customer.salesBlock && customer.salesBlockReason && (
                      <p className="text-xs text-gray-600">{customer.salesBlockReason}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">Delivery Block</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        customer.deliveryBlock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.deliveryBlock ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    {customer.deliveryBlock && customer.deliveryBlockReason && (
                      <p className="text-xs text-gray-600">{customer.deliveryBlockReason}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">Billing Block</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        customer.billingBlock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.billingBlock ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    {customer.billingBlock && customer.billingBlockReason && (
                      <p className="text-xs text-gray-600">{customer.billingBlockReason}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logistics & Shipping Tab */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Logistics & Shipping</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Shipping Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping Method</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.shippingMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Preferred Carrier</p>
                    <p className="text-sm text-gray-900">{customer.preferredCarrier}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Freight Terms</p>
                    <p className="text-sm text-gray-900">{customer.freightTerms}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase">Insurance Required</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      customer.insuranceRequired ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.insuranceRequired ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warehouse & Picking */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Warehouse & Picking
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Warehouse Assignment</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.warehouseAssignment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Picking Location</p>
                    <p className="text-sm text-gray-900">{customer.pickingLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery Tolerance</p>
                    <p className="text-sm text-gray-900">{customer.deliveryTolerance}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Route Schedule</p>
                    <p className="text-sm text-gray-900">{customer.routeSchedule}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Delivery Schedule
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Loading/Unloading Times</p>
                    <p className="text-sm text-gray-900">{customer.loadingUnloadingTimes}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Dock Hours</p>
                    <p className="text-sm text-gray-900">{customer.dockHours}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery Time Window</p>
                    <p className="text-sm text-gray-900">{customer.deliveryTimeWindow}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Delivery Day Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.deliveryDayPreferences.map((day) => (
                        <span key={day} className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Packaging & Labeling */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Packaging & Labeling
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Packing Requirements</p>
                    <p className="text-sm text-gray-900">{customer.packingRequirements}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Labeling Requirements</p>
                    <p className="text-sm text-gray-900">{customer.labelingRequirements}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Special Handling</p>
                    <p className="text-sm text-gray-900">{customer.specialHandlingRequirements}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Instructions */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Shipping Instructions
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{customer.shippingInstructions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === 'additional' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Contract Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contract Number</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.contractNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contract Start Date</p>
                    <p className="text-sm text-gray-900">{customer.contractStartDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contract End Date</p>
                    <p className="text-sm text-gray-900">{customer.contractEndDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Service Level Agreement</p>
                    <p className="text-sm text-gray-900">{customer.serviceLevelAgreement}</p>
                  </div>
                </div>
              </div>

              {/* Compliance & Certifications */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Compliance & Certifications
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Compliance Status</p>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                      {customer.complianceStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Certifications Required</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.certificationsRequired.map((cert) => (
                        <span key={cert} className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-gray-900">Data Privacy Consent: {customer.dataPrivacyConsent ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-gray-900">Marketing Consent: {customer.marketingConsent ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  Special Instructions
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{customer.specialInstructions}</p>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Internal Notes
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{customer.internalNotes}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Custom Fields
                </h3>
                <div className="space-y-3">
                  {customer.customFields.map((field, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <p className="text-xs font-medium text-gray-500 uppercase">{field.key}</p>
                      <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              {customer.attachments.length > 0 && (
                <div className="md:col-span-2 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-blue-600" />
                    Attachments
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {customer.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-pointer">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-900">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders & Invoices Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order History</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <ShoppingCart className="h-4 w-4" />
                <span>New Order</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order, index) => (
                    <tr key={order.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-4 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{order.date}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.status]}`}>
                          {order.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {order.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {order.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{order.items}</td>
                      <td className="px-4 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {mockOrders.length} orders
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Interactions Tab */}
        {activeTab === 'interactions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Communication Timeline</h3>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium">
                  <PhoneCall className="h-4 w-4" />
                  <span>Log Call</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium">
                  <Users className="h-4 w-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockInteractions.map((interaction, index) => {
                const InteractionIcon = interactionIcons[interaction.type];
                const isLast = index === mockInteractions.length - 1;

                return (
                  <div key={interaction.id} className="relative">
                    {!isLast && (
                      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-300"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${interactionColors[interaction.type]}`}>
                        <InteractionIcon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-base font-bold text-gray-900">{interaction.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              by {interaction.performedBy} " {interaction.date}
                            </p>
                          </div>
                          {interaction.outcome && (
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              interaction.outcome === 'Positive' || interaction.outcome === 'Very Positive'
                                ? 'bg-green-100 text-green-700'
                                : interaction.outcome === 'Interested'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {interaction.outcome}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{interaction.description}</p>
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
