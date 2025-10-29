'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail, Building2, User, Calendar, TrendingUp, DollarSign, Download, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Upload, Save, Check, X, UserPlus, FileSpreadsheet, MapPin, ShoppingCart, FileText, Video, Users, GitMerge, Zap, Clock, Activity } from 'lucide-react';
import { ConfirmDialog, useToast } from '@/components/ui';

interface Customer {
  id: string;
  customerName: string;
  industry: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'vip' | 'churned';
  segment: 'VIP' | 'Enterprise' | 'SMB' | 'Startup' | 'Individual' | null;
  accountStatus: 'Active' | 'Inactive' | 'On Hold' | 'Churned';
  lifetimeValue: number;
  lastOrder: string;
  totalOrders: number;
  location?: string;
  region?: string;
  createdAt: string;
  // Enterprise fields
  accountManager: string;
  creditStatus: 'approved' | 'on_hold' | 'suspended' | 'review_required';
  creditLimit: number;
  paymentTerms: string;
  salesOrganization: string;
  customerClassification: 'A' | 'B' | 'C';
  customerLifecycleStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at_risk' | 'churned';
  customerGroup: 'wholesale' | 'retail' | 'distributor' | 'oem' | 'end_user';
  salesBlock: boolean;
  deliveryBlock: boolean;
  billingBlock: boolean;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    industry: 'Modular Kitchen Dealers',
    contactPerson: 'Rajesh Sharma',
    phone: '+91-98765-43210',
    email: 'rajesh@sharmakitchens.co.in',
    status: 'vip',
    segment: 'VIP',
    accountStatus: 'Active',
    lifetimeValue: 8500000,
    lastOrder: '2025-10-05',
    totalOrders: 45,
    location: 'Mumbai',
    region: 'West',
    createdAt: '2023-01-15',
    accountManager: 'Priya Patel',
    creditStatus: 'approved',
    creditLimit: 15000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'West Region - Mumbai',
    customerClassification: 'A',
    customerLifecycleStage: 'mature',
    customerGroup: 'wholesale',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '2',
    customerName: 'Urban Interiors & Designers',
    industry: 'Interior Designers',
    contactPerson: 'Anita Desai',
    phone: '+91-98123-45678',
    email: 'anita@urbaninteriors.in',
    status: 'active',
    segment: 'SMB',
    accountStatus: 'Active',
    lifetimeValue: 4500000,
    lastOrder: '2025-10-08',
    totalOrders: 28,
    location: 'Bangalore',
    region: 'South',
    createdAt: '2023-06-20',
    accountManager: 'Amit Kumar',
    creditStatus: 'approved',
    creditLimit: 7500000,
    paymentTerms: 'PDC (Post Dated Cheque)',
    salesOrganization: 'South Region - Bangalore',
    customerClassification: 'B',
    customerLifecycleStage: 'growing',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '3',
    customerName: 'Prestige Developers Bangalore',
    industry: 'Real Estate Developers',
    contactPerson: 'Suresh Menon',
    phone: '+91-80-2345-6789',
    email: 'suresh.m@prestigedev.co.in',
    status: 'active',
    segment: 'Enterprise',
    accountStatus: 'On Hold',
    lifetimeValue: 12000000,
    lastOrder: '2025-10-02',
    totalOrders: 56,
    location: 'Bangalore',
    region: 'South',
    createdAt: '2022-03-10',
    accountManager: 'Priya Patel',
    creditStatus: 'on_hold',
    creditLimit: 25000000,
    paymentTerms: '30-60-90 days',
    salesOrganization: 'South Region - Bangalore',
    customerClassification: 'A',
    customerLifecycleStage: 'mature',
    customerGroup: 'distributor',
    salesBlock: false,
    deliveryBlock: true,
    billingBlock: false,
  },
  {
    id: '4',
    customerName: 'Elite Contractors & Builders',
    industry: 'Contractors & Builders',
    contactPerson: 'Vijay Singh',
    phone: '+91-11-2987-6543',
    email: 'vijay@elitecontractors.co.in',
    status: 'inactive',
    segment: 'SMB',
    accountStatus: 'Inactive',
    lifetimeValue: 2800000,
    lastOrder: '2025-08-15',
    totalOrders: 15,
    location: 'Delhi',
    region: 'North',
    createdAt: '2023-09-05',
    accountManager: 'Rahul Verma',
    creditStatus: 'review_required',
    creditLimit: 5000000,
    paymentTerms: 'Against Delivery',
    salesOrganization: 'North Region - Delhi',
    customerClassification: 'C',
    customerLifecycleStage: 'at_risk',
    customerGroup: 'retail',
    salesBlock: true,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '5',
    customerName: 'Archana Architects Associates',
    industry: 'Architects',
    contactPerson: 'Archana Iyer',
    phone: '+91-22-4567-8901',
    email: 'archana@archanarchitects.com',
    status: 'active',
    segment: 'Startup',
    accountStatus: 'Active',
    lifetimeValue: 3500000,
    lastOrder: '2025-10-10',
    totalOrders: 22,
    location: 'Mumbai',
    region: 'West',
    createdAt: '2024-02-14',
    accountManager: 'Amit Kumar',
    creditStatus: 'approved',
    creditLimit: 6000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'West Region - Mumbai',
    customerClassification: 'B',
    customerLifecycleStage: 'new',
    customerGroup: 'end_user',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '6',
    customerName: 'DLF Home Solutions Limited',
    industry: 'Real Estate Developers',
    contactPerson: 'Karthik Reddy',
    phone: '+91-40-3456-7890',
    email: 'karthik.r@dlfhomes.co.in',
    status: 'vip',
    segment: 'VIP',
    accountStatus: 'Active',
    lifetimeValue: 18000000,
    lastOrder: '2025-10-09',
    totalOrders: 78,
    location: 'Hyderabad',
    region: 'South',
    createdAt: '2021-11-20',
    accountManager: 'Priya Patel',
    creditStatus: 'approved',
    creditLimit: 35000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'South Region - Hyderabad',
    customerClassification: 'A',
    customerLifecycleStage: 'mature',
    customerGroup: 'oem',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '7',
    customerName: 'Godrej Furniture & Interiors',
    industry: 'Furniture Retailers',
    contactPerson: 'Neha Kapoor',
    phone: '+91-21-4567-8912',
    email: 'neha.k@godrejinteriors.com',
    status: 'active',
    segment: 'Enterprise',
    accountStatus: 'Active',
    lifetimeValue: 5200000,
    lastOrder: '2025-10-04',
    totalOrders: 32,
    location: 'Pune',
    region: 'West',
    createdAt: '2023-04-18',
    accountManager: 'Sanjay Gupta',
    creditStatus: 'suspended',
    creditLimit: 8000000,
    paymentTerms: 'Advance Payment',
    salesOrganization: 'East Region - Pune',
    customerClassification: 'C',
    customerLifecycleStage: 'at_risk',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: true,
  },
  {
    id: '8',
    customerName: 'Oberoi Realty Projects',
    industry: 'Real Estate Developers',
    contactPerson: 'Manish Oberoi',
    phone: '+91-22-6789-0123',
    email: 'manish@oberoirealty.co.in',
    status: 'active',
    segment: 'VIP',
    accountStatus: 'Active',
    lifetimeValue: 22000000,
    lastOrder: '2025-10-07',
    totalOrders: 92,
    location: 'Mumbai',
    region: 'West',
    createdAt: '2021-08-05',
    accountManager: 'Rahul Verma',
    creditStatus: 'approved',
    creditLimit: 40000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'West Region - Mumbai',
    customerClassification: 'A',
    customerLifecycleStage: 'growing',
    customerGroup: 'wholesale',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '9',
    customerName: 'Decor Studio Chennai',
    industry: 'Interior Designers',
    contactPerson: 'Lakshmi Iyer',
    phone: '+91-44-2876-5432',
    email: 'lakshmi@decorstudio.co.in',
    status: 'active',
    segment: 'SMB',
    accountStatus: 'Active',
    lifetimeValue: 3200000,
    lastOrder: '2025-09-28',
    totalOrders: 19,
    location: 'Chennai',
    region: 'South',
    createdAt: '2023-07-22',
    accountManager: 'Rahul Verma',
    creditStatus: 'approved',
    creditLimit: 5000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'South Region - Chennai',
    customerClassification: 'B',
    customerLifecycleStage: 'mature',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '10',
    customerName: 'Royal Homes Hyderabad',
    industry: 'Real Estate Developers',
    contactPerson: 'Vikram Reddy',
    phone: '+91-40-4567-8901',
    email: 'vikram@royalhomes.co.in',
    status: 'active',
    segment: 'Enterprise',
    accountStatus: 'Active',
    lifetimeValue: 9800000,
    lastOrder: '2025-10-01',
    totalOrders: 48,
    location: 'Hyderabad',
    region: 'South',
    createdAt: '2022-05-12',
    accountManager: 'Amit Kumar',
    creditStatus: 'approved',
    creditLimit: 18000000,
    paymentTerms: '30-60-90 days',
    salesOrganization: 'South Region - Hyderabad',
    customerClassification: 'A',
    customerLifecycleStage: 'growing',
    customerGroup: 'distributor',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '11',
    customerName: 'Cosmos Furniture Mart',
    industry: 'Furniture Retailers',
    contactPerson: 'Ramesh Agarwal',
    phone: '+91-22-3456-7890',
    email: 'ramesh@cosmosfurniture.in',
    status: 'active',
    segment: 'Individual',
    accountStatus: 'Active',
    lifetimeValue: 2800000,
    lastOrder: '2025-10-03',
    totalOrders: 18,
    location: 'Mumbai',
    region: 'West',
    createdAt: '2024-01-08',
    accountManager: 'Priya Patel',
    creditStatus: 'review_required',
    creditLimit: 4000000,
    paymentTerms: 'PDC (Post Dated Cheque)',
    salesOrganization: 'West Region - Mumbai',
    customerClassification: 'C',
    customerLifecycleStage: 'new',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '12',
    customerName: 'Green Valley Builders',
    industry: 'Contractors & Builders',
    contactPerson: 'Manish Joshi',
    phone: '+91-80-9876-5432',
    email: 'manish@greenvalley.co.in',
    status: 'inactive',
    segment: 'Startup',
    accountStatus: 'Churned',
    lifetimeValue: 1500000,
    lastOrder: '2025-08-15',
    totalOrders: 8,
    location: 'Bangalore',
    region: 'South',
    createdAt: '2024-03-25',
    accountManager: 'Amit Kumar',
    creditStatus: 'suspended',
    creditLimit: 3000000,
    paymentTerms: 'Advance Payment',
    salesOrganization: 'South Region - Bangalore',
    customerClassification: 'C',
    customerLifecycleStage: 'at_risk',
    customerGroup: 'oem',
    salesBlock: true,
    deliveryBlock: true,
    billingBlock: false,
  },
  {
    id: '13',
    customerName: 'Signature Interiors Pune',
    industry: 'Interior Designers',
    contactPerson: 'Neha Kulkarni',
    phone: '+91-20-6789-0123',
    email: 'neha@signatureinteriors.in',
    status: 'active',
    segment: 'SMB',
    accountStatus: 'Active',
    lifetimeValue: 5200000,
    lastOrder: '2025-10-06',
    totalOrders: 35,
    location: 'Pune',
    region: 'West',
    createdAt: '2023-02-17',
    accountManager: 'Priya Patel',
    creditStatus: 'approved',
    creditLimit: 8000000,
    paymentTerms: 'Net 45 days',
    salesOrganization: 'West Region - Pune',
    customerClassification: 'B',
    customerLifecycleStage: 'growing',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '14',
    customerName: 'Metro Modular Solutions',
    industry: 'Modular Kitchen Dealers',
    contactPerson: 'Karthik Nair',
    phone: '+91-44-8765-4321',
    email: 'karthik@metromodular.co.in',
    status: 'active',
    segment: 'Enterprise',
    accountStatus: 'Active',
    lifetimeValue: 6700000,
    lastOrder: '2025-10-04',
    totalOrders: 42,
    location: 'Chennai',
    region: 'South',
    createdAt: '2022-09-14',
    accountManager: 'Rahul Verma',
    creditStatus: 'approved',
    creditLimit: 12000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'South Region - Chennai',
    customerClassification: 'A',
    customerLifecycleStage: 'mature',
    customerGroup: 'wholesale',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '15',
    customerName: 'Apex Architects Delhi',
    industry: 'Architects',
    contactPerson: 'Arjun Kapoor',
    phone: '+91-11-5432-1098',
    email: 'arjun@apexarchitects.in',
    status: 'vip',
    segment: 'VIP',
    accountStatus: 'Active',
    lifetimeValue: 11500000,
    lastOrder: '2025-10-07',
    totalOrders: 58,
    location: 'Delhi',
    region: 'North',
    createdAt: '2022-01-10',
    accountManager: 'Sanjay Gupta',
    creditStatus: 'approved',
    creditLimit: 20000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'North Region - Delhi',
    customerClassification: 'A',
    customerLifecycleStage: 'mature',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '16',
    customerName: 'Elegant Homes Jaipur',
    industry: 'Real Estate Developers',
    contactPerson: 'Priya Sharma',
    phone: '+91-141-234-5678',
    email: 'priya@eleganthomes.co.in',
    status: 'active',
    segment: 'SMB',
    accountStatus: 'On Hold',
    lifetimeValue: 4100000,
    lastOrder: '2025-09-25',
    totalOrders: 24,
    location: 'Jaipur',
    region: 'North',
    createdAt: '2023-10-03',
    accountManager: 'Sanjay Gupta',
    creditStatus: 'on_hold',
    creditLimit: 8500000,
    paymentTerms: 'Against Delivery',
    salesOrganization: 'North Region - Delhi',
    customerClassification: 'B',
    customerLifecycleStage: 'growing',
    customerGroup: 'distributor',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: true,
  },
  {
    id: '17',
    customerName: 'Modern Living Ahmedabad',
    industry: 'Furniture Retailers',
    contactPerson: 'Mehul Patel',
    phone: '+91-79-8765-4321',
    email: 'mehul@modernliving.co.in',
    status: 'active',
    segment: 'SMB',
    accountStatus: 'Active',
    lifetimeValue: 3600000,
    lastOrder: '2025-10-08',
    totalOrders: 26,
    location: 'Ahmedabad',
    region: 'West',
    createdAt: '2023-05-19',
    accountManager: 'Priya Patel',
    creditStatus: 'approved',
    creditLimit: 6000000,
    paymentTerms: 'PDC (Post Dated Cheque)',
    salesOrganization: 'West Region - Mumbai',
    customerClassification: 'B',
    customerLifecycleStage: 'mature',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '18',
    customerName: 'Sunrise Contractors',
    industry: 'Contractors & Builders',
    contactPerson: 'Deepak Singh',
    phone: '+91-512-345-6789',
    email: 'deepak@sunrisecontractors.in',
    status: 'active',
    segment: 'Individual',
    accountStatus: 'Active',
    lifetimeValue: 2200000,
    lastOrder: '2025-09-30',
    totalOrders: 14,
    location: 'Kanpur',
    region: 'North',
    createdAt: '2024-04-11',
    accountManager: 'Sanjay Gupta',
    creditStatus: 'review_required',
    creditLimit: 5000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'North Region - Delhi',
    customerClassification: 'C',
    customerLifecycleStage: 'new',
    customerGroup: 'oem',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '19',
    customerName: 'Premium Interiors Kolkata',
    industry: 'Interior Designers',
    contactPerson: 'Soumya Banerjee',
    phone: '+91-33-2345-6789',
    email: 'soumya@premiuminteriors.co.in',
    status: 'active',
    segment: 'SMB',
    accountStatus: 'Active',
    lifetimeValue: 4800000,
    lastOrder: '2025-10-05',
    totalOrders: 31,
    location: 'Kolkata',
    region: 'East',
    createdAt: '2023-03-28',
    accountManager: 'Amit Kumar',
    creditStatus: 'approved',
    creditLimit: 7500000,
    paymentTerms: 'Net 45 days',
    salesOrganization: 'East Region - Kolkata',
    customerClassification: 'B',
    customerLifecycleStage: 'growing',
    customerGroup: 'retail',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
  {
    id: '20',
    customerName: 'Infinity Kitchen Solutions',
    industry: 'Modular Kitchen Dealers',
    contactPerson: 'Ravi Kumar',
    phone: '+91-40-7654-3210',
    email: 'ravi@infinitykitchen.co.in',
    status: 'vip',
    segment: 'VIP',
    accountStatus: 'Active',
    lifetimeValue: 13200000,
    lastOrder: '2025-10-09',
    totalOrders: 65,
    location: 'Hyderabad',
    region: 'South',
    createdAt: '2022-02-25',
    accountManager: 'Amit Kumar',
    creditStatus: 'approved',
    creditLimit: 22000000,
    paymentTerms: 'Net 30 days',
    salesOrganization: 'South Region - Hyderabad',
    customerClassification: 'A',
    customerLifecycleStage: 'mature',
    customerGroup: 'wholesale',
    salesBlock: false,
    deliveryBlock: false,
    billingBlock: false,
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  vip: 'bg-purple-100 text-purple-700',
  churned: 'bg-red-100 text-red-700',
};

const segmentColors = {
  VIP: 'bg-purple-100 text-purple-700',
  Enterprise: 'bg-indigo-100 text-indigo-700',
  SMB: 'bg-blue-100 text-blue-700',
  Startup: 'bg-cyan-100 text-cyan-700',
  Individual: 'bg-gray-100 text-gray-700',
};

const accountStatusColors = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-700',
  'On Hold': 'bg-yellow-100 text-yellow-700',
  Churned: 'bg-red-100 text-red-700',
};

const creditStatusColors = {
  approved: 'bg-green-100 text-green-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  review_required: 'bg-orange-100 text-orange-700',
};

const lifecycleStageColors = {
  prospect: 'bg-blue-100 text-blue-700',
  new: 'bg-cyan-100 text-cyan-700',
  growing: 'bg-emerald-100 text-emerald-700',
  mature: 'bg-purple-100 text-purple-700',
  at_risk: 'bg-orange-100 text-orange-700',
  churned: 'bg-red-100 text-red-700',
};

const classificationColors = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-gray-100 text-gray-700',
};

const SEGMENTS = ['VIP', 'Enterprise', 'SMB', 'Startup', 'Individual'];
const ACCOUNT_STATUSES = ['Active', 'Inactive', 'On Hold', 'Churned'];
const REGIONS = ['North', 'South', 'East', 'West'];
const ASSIGNED_USERS = ['Priya Patel', 'Amit Kumar', 'Rahul Verma', 'Sanjay Gupta'];

interface SavedFilter {
  id: string;
  name: string;
  filters: any;
}

export default function CustomersPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>('all');
  const [customerGroupFilter, setCustomerGroupFilter] = useState<string>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [creditStatusFilter, setCreditStatusFilter] = useState<string>('all');
  const [lifecycleStageFilter, setLifecycleStageFilter] = useState<string>('all');
  const [accountManagerFilter, setAccountManagerFilter] = useState<string>('all');
  const [salesOrgFilter, setSalesOrgFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [lifetimeValueMin, setLifetimeValueMin] = useState<string>('');
  const [lifetimeValueMax, setLifetimeValueMax] = useState<string>('');
  const [createdDateFrom, setCreatedDateFrom] = useState<string>('');
  const [createdDateTo, setCreatedDateTo] = useState<string>('');

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Enhanced Delete State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Bulk Operations State
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkAssignDialog, setShowBulkAssignDialog] = useState(false);
  const [showBulkSegmentDialog, setShowBulkSegmentDialog] = useState(false);
  const [bulkAssignUser, setBulkAssignUser] = useState('');
  const [bulkSegment, setBulkSegment] = useState('');

  // Inline Update State
  const [segmentDropdownOpen, setSegmentDropdownOpen] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  // Import/Export State
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Save/Load Filters State
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveFilterDialog, setShowSaveFilterDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Customer Merge State
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [primaryCustomerId, setPrimaryCustomerId] = useState<string>('');

  // Auto-Segmentation Rules State
  const [showSegmentationRulesDialog, setShowSegmentationRulesDialog] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (selectedCustomers.length === 1) {
        const customer = customers.find(c => c.id === selectedCustomers[0]);
        if (!customer) return;

        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            handleDeleteCustomer(customer);
            break;
          case 'e':
            e.preventDefault();
            router.push(`/crm/customers/edit/${customer.id}`);
            break;
          case 'v':
            e.preventDefault();
            handleViewCustomer(customer);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCustomers, customers, router]);

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.accountManager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    const matchesAccountStatus = accountStatusFilter === 'all' || customer.accountStatus === accountStatusFilter;
    const matchesGroup = customerGroupFilter === 'all' || customer.customerGroup === customerGroupFilter;
    const matchesClassification = classificationFilter === 'all' || customer.customerClassification === classificationFilter;
    const matchesCreditStatus = creditStatusFilter === 'all' || customer.creditStatus === creditStatusFilter;
    const matchesLifecycleStage = lifecycleStageFilter === 'all' || customer.customerLifecycleStage === lifecycleStageFilter;
    const matchesAccountManager = accountManagerFilter === 'all' || customer.accountManager === accountManagerFilter;
    const matchesSalesOrg = salesOrgFilter === 'all' || customer.salesOrganization === salesOrgFilter;
    const matchesRegion = regionFilter === 'all' || customer.region === regionFilter;

    const matchesLifetimeValue = (() => {
      const min = lifetimeValueMin ? parseFloat(lifetimeValueMin) : 0;
      const max = lifetimeValueMax ? parseFloat(lifetimeValueMax) : Infinity;
      return customer.lifetimeValue >= min && customer.lifetimeValue <= max;
    })();

    const matchesCreatedDate = (() => {
      if (!createdDateFrom && !createdDateTo) return true;
      const createdDate = new Date(customer.createdAt);
      const fromDate = createdDateFrom ? new Date(createdDateFrom) : new Date(0);
      const toDate = createdDateTo ? new Date(createdDateTo) : new Date();
      return createdDate >= fromDate && createdDate <= toDate;
    })();

    return matchesSearch && matchesStatus && matchesSegment && matchesAccountStatus && matchesGroup &&
           matchesClassification && matchesCreditStatus && matchesLifecycleStage && matchesAccountManager &&
           matchesSalesOrg && matchesRegion && matchesLifetimeValue && matchesCreatedDate;
  });

  // Sort customers
  if (sortField) {
    filteredCustomers = [...filteredCustomers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue !== undefined && aValue !== null && bValue !== undefined && bValue !== null) {
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Get unique values for filters
  const accountManagers = Array.from(new Set(customers.map(c => c.accountManager)));
  const salesOrganizations = Array.from(new Set(customers.map(c => c.salesOrganization)));

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    lifetimeValue: customers.reduce((sum, c) => sum + c.lifetimeValue, 0),
    thisMonthRevenue: 4500000, // Mock data
  };

  // Format Indian currency
  const formatIndianCurrency = (amount: number) => {
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
      return formatIndianCurrency(amount);
    }
  };

  // Enhanced Delete Handler
  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
      addToast({
        title: 'Customer Deleted',
        message: `${customerToDelete.customerName} has been successfully deleted.`,
        variant: 'success'
      });
    }
  };

  // Get impact analysis for delete
  const getDeleteImpactAnalysis = (customer: Customer) => {
    return [
      { label: 'Opportunities', count: 3 },
      { label: 'Contacts', count: 5 },
      { label: 'Activities', count: 12 },
      { label: 'Orders', count: customer.totalOrders },
      { label: 'Invoices', count: customer.totalOrders + 2 }
    ];
  };

  const handleViewCustomer = (customer: Customer) => {
    router.push(`/crm/customers/view/${customer.id}`);
  };

  // Bulk Operations
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(paginatedCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  const isAllSelected = paginatedCustomers.length > 0 && paginatedCustomers.every(c => selectedCustomers.includes(c.id));

  const handleBulkDelete = () => {
    setCustomers(customers.filter(c => !selectedCustomers.includes(c.id)));
    setShowBulkDeleteDialog(false);
    addToast({
      title: 'Customers Deleted',
      message: `${selectedCustomers.length} customers have been successfully deleted.`,
      variant: 'success'
    });
    setSelectedCustomers([]);
  };

  const handleBulkAssign = () => {
    if (!bulkAssignUser) return;

    setCustomers(customers.map(customer =>
      selectedCustomers.includes(customer.id)
        ? { ...customer, accountManager: bulkAssignUser }
        : customer
    ));
    setShowBulkAssignDialog(false);
    addToast({
      title: 'Customers Assigned',
      message: `${selectedCustomers.length} customers assigned to ${bulkAssignUser}.`,
      variant: 'success'
    });
    setSelectedCustomers([]);
    setBulkAssignUser('');
  };

  const handleBulkSegment = () => {
    if (!bulkSegment) return;

    setCustomers(customers.map(customer =>
      selectedCustomers.includes(customer.id)
        ? { ...customer, segment: bulkSegment as any }
        : customer
    ));
    setShowBulkSegmentDialog(false);
    addToast({
      title: 'Segment Updated',
      message: `${selectedCustomers.length} customers updated to ${bulkSegment}.`,
      variant: 'success'
    });
    setSelectedCustomers([]);
    setBulkSegment('');
  };

  // Inline Status/Segment Updates
  const handleSegmentChange = (customerId: string, newSegment: string) => {
    setCustomers(customers.map(customer =>
      customer.id === customerId ? { ...customer, segment: newSegment as any } : customer
    ));
    setSegmentDropdownOpen(null);
    addToast({
      title: 'Segment Updated',
      message: `Customer segment updated to ${newSegment}.`,
      variant: 'success'
    });
  };

  const handleAccountStatusChange = (customerId: string, newStatus: string) => {
    setCustomers(customers.map(customer =>
      customer.id === customerId ? { ...customer, accountStatus: newStatus as any } : customer
    ));
    setStatusDropdownOpen(null);
    addToast({
      title: 'Account Status Updated',
      message: `Account status updated to ${newStatus}.`,
      variant: 'success'
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Customer Name', 'Industry', 'Contact Person', 'Phone', 'Email', 'Segment', 'Account Status',
                    'Lifetime Value', 'Total Orders', 'Last Order', 'Account Manager', 'Region'];
    const csvData = [
      headers.join(','),
      ...filteredCustomers.map(customer => [
        customer.customerName,
        customer.industry,
        customer.contactPerson,
        customer.phone,
        customer.email,
        customer.segment || '',
        customer.accountStatus,
        customer.lifetimeValue,
        customer.totalOrders,
        customer.lastOrder,
        customer.accountManager,
        customer.region || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    addToast({
      title: 'Export Successful',
      message: `${filteredCustomers.length} customers exported to CSV.`,
      variant: 'success'
    });
  };

  // Save Filter
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: {
        segment: segmentFilter,
        accountStatus: accountStatusFilter,
        accountManager: accountManagerFilter,
        lifetimeValueMin,
        lifetimeValueMax,
        createdDateFrom,
        createdDateTo,
        region: regionFilter
      }
    };

    setSavedFilters([...savedFilters, newFilter]);
    setShowSaveFilterDialog(false);
    setFilterName('');
    addToast({
      title: 'Filter Saved',
      message: `Filter "${newFilter.name}" has been saved successfully.`,
      variant: 'success'
    });
  };

  // Load Saved Filter
  const loadSavedFilter = (filter: SavedFilter) => {
    setSegmentFilter(filter.filters.segment);
    setAccountStatusFilter(filter.filters.accountStatus);
    setAccountManagerFilter(filter.filters.accountManager);
    setLifetimeValueMin(filter.filters.lifetimeValueMin);
    setLifetimeValueMax(filter.filters.lifetimeValueMax);
    setCreatedDateFrom(filter.filters.createdDateFrom);
    setCreatedDateTo(filter.filters.createdDateTo);
    setRegionFilter(filter.filters.region);
    addToast({
      title: 'Filter Loaded',
      message: `Filter "${filter.name}" has been applied.`,
      variant: 'info'
    });
  };

  // Clear Filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSegmentFilter('all');
    setAccountStatusFilter('all');
    setCustomerGroupFilter('all');
    setClassificationFilter('all');
    setCreditStatusFilter('all');
    setLifecycleStageFilter('all');
    setAccountManagerFilter('all');
    setSalesOrgFilter('all');
    setRegionFilter('all');
    setLifetimeValueMin('');
    setLifetimeValueMax('');
    setCreatedDateFrom('');
    setCreatedDateTo('');
  };

  // Quick Actions
  const handleQuickCall = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'Initiating Call',
      message: `Calling ${customer.contactPerson} at ${customer.phone}`,
      variant: 'info'
    });
  };

  const handleQuickEmail = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${customer.email}`;
  };

  const handleViewOrders = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'View Orders',
      message: `Opening orders for ${customer.customerName}`,
      variant: 'info'
    });
  };

  const handleScheduleVisit = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'Schedule Visit',
      message: `Scheduling site visit for ${customer.customerName}`,
      variant: 'info'
    });
  };

  // Customer Merge
  const handleMergeCustomers = () => {
    if (!primaryCustomerId) return;

    addToast({
      title: 'Customers Merged',
      message: `Successfully merged ${selectedCustomers.length} customers.`,
      variant: 'success'
    });
    setShowMergeDialog(false);
    setPrimaryCustomerId('');
    setSelectedCustomers([]);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats with Add Button */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Lifetime Value</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatLakhsCrores(stats.lifetimeValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">This Month Revenue</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{formatLakhsCrores(stats.thisMonthRevenue)}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/crm/customers/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, contact, email, industry, or account manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showAdvancedFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setShowSegmentationRulesDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Zap className="h-5 w-5" />
            <span>Auto-Segment</span>
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCustomers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {selectedCustomers.length === 2 && (
                <button
                  onClick={() => setShowMergeDialog(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <GitMerge className="h-4 w-4" />
                  <span>Merge Customers</span>
                </button>
              )}
              <button
                onClick={() => setShowBulkAssignDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <UserPlus className="h-4 w-4" />
                <span>Assign</span>
              </button>
              <button
                onClick={() => setShowBulkSegmentDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Users className="h-4 w-4" />
                <span>Segment</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowBulkDeleteDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setSelectedCustomers([])}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {showAdvancedFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Segments</option>
                {SEGMENTS.map(segment => (
                  <option key={segment} value={segment}>{segment}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <select
                value={accountStatusFilter}
                onChange={(e) => setAccountStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {ACCOUNT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Manager</label>
              <select
                value={accountManagerFilter}
                onChange={(e) => setAccountManagerFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Managers</option>
                {accountManagers.map(manager => (
                  <option key={manager} value={manager}>{manager}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Lifetime Value (₹)</label>
              <input
                type="number"
                value={lifetimeValueMin}
                onChange={(e) => setLifetimeValueMin(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Lifetime Value (₹)</label>
              <input
                type="number"
                value={lifetimeValueMax}
                onChange={(e) => setLifetimeValueMax(e.target.value)}
                placeholder="999999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created From</label>
              <input
                type="date"
                value={createdDateFrom}
                onChange={(e) => setCreatedDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created To</label>
              <input
                type="date"
                value={createdDateTo}
                onChange={(e) => setCreatedDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-4 flex items-center justify-between pt-3 border-t border-gray-300">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSaveFilterDialog(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Filter</span>
                </button>

                {savedFilters.length > 0 && (
                  <select
                    onChange={(e) => {
                      const filter = savedFilters.find(f => f.id === e.target.value);
                      if (filter) loadSavedFilter(filter);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Load Saved Filter...</option>
                    {savedFilters.map(filter => (
                      <option key={filter.id} value={filter.id}>{filter.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('customerName')}>
                  <div className="flex items-center space-x-1">
                    <span>Customer Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('lifetimeValue')}>
                  <div className="flex items-center space-x-1">
                    <span>Lifetime Value</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalOrders')}>
                  <div className="flex items-center space-x-1">
                    <span>Total Orders</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('lastOrder')}>
                  <div className="flex items-center space-x-1">
                    <span>Last Order</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quick Actions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`hover:bg-gray-50 transition-colors ${selectedCustomers.includes(customer.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{customer.customerName}</div>
                    <div className="text-xs text-gray-500">{customer.contactPerson}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSegmentDropdownOpen(segmentDropdownOpen === customer.id ? null : customer.id);
                        }}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.segment ? segmentColors[customer.segment] : 'bg-gray-100 text-gray-700'} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {customer.segment || 'No Segment'}
                      </button>

                      {segmentDropdownOpen === customer.id && (
                        <div className="absolute z-10 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                          {SEGMENTS.map(segment => (
                            <button
                              key={segment}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSegmentChange(customer.id, segment);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                                customer.segment === segment ? 'bg-gray-50 font-semibold' : ''
                              }`}
                            >
                              {segment}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusDropdownOpen(statusDropdownOpen === customer.id ? null : customer.id);
                        }}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${accountStatusColors[customer.accountStatus]} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {customer.accountStatus}
                      </button>

                      {statusDropdownOpen === customer.id && (
                        <div className="absolute z-10 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                          {ACCOUNT_STATUSES.map(status => (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccountStatusChange(customer.id, status);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                                customer.accountStatus === status ? 'bg-gray-50 font-semibold' : ''
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatLakhsCrores(customer.lifetimeValue)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.totalOrders}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.lastOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-700">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{customer.location || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => handleQuickCall(customer, e)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleQuickEmail(customer, e)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleViewOrders(customer, e)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="View Orders"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleScheduleVisit(customer, e)}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="Schedule Visit"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/crm/customers/edit/${customer.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCustomerToDelete(null);
        }}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.customerName}? This action cannot be undone.`}
        confirmLabel="Delete Customer"
        variant="danger"
        impactAnalysis={customerToDelete ? getDeleteImpactAnalysis(customerToDelete) : undefined}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Customers"
        message={`Are you sure you want to delete ${selectedCustomers.length} customer${selectedCustomers.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete All"
        variant="danger"
      />

      {/* Bulk Assign Dialog */}
      {showBulkAssignDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Customers</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} to:
            </p>
            <select
              value={bulkAssignUser}
              onChange={(e) => setBulkAssignUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">Select Account Manager...</option>
              {ASSIGNED_USERS.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowBulkAssignDialog(false);
                  setBulkAssignUser('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssign}
                disabled={!bulkAssignUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Segment Dialog */}
      {showBulkSegmentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Segment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Update segment for {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} to:
            </p>
            <select
              value={bulkSegment}
              onChange={(e) => setBulkSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">Select Segment...</option>
              {SEGMENTS.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowBulkSegmentDialog(false);
                  setBulkSegment('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSegment}
                disabled={!bulkSegment}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Update Segment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Import Customers</h3>
              <button
                onClick={() => setShowImportDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">Import Requirements:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>- File must be in CSV or Excel format</li>
                <li>- Required columns: Customer Name, Contact Person, Email, Phone</li>
                <li>- Optional columns: Segment, Account Status, Lifetime Value, Region</li>
                <li>- Maximum 1000 customers per import</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveFilterDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Filter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Give your filter a name to save it for future use.
            </p>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowSaveFilterDialog(false);
                  setFilterName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Merge Dialog */}
      {showMergeDialog && selectedCustomers.length === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <GitMerge className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Merge Customers</h3>
              </div>
              <button
                onClick={() => {
                  setShowMergeDialog(false);
                  setPrimaryCustomerId('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select which customer should be the primary record. Data from the secondary customer will be merged into the primary.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {selectedCustomers.map(customerId => {
                const customer = customers.find(c => c.id === customerId);
                if (!customer) return null;

                return (
                  <div
                    key={customer.id}
                    onClick={() => setPrimaryCustomerId(customer.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      primaryCustomerId === customer.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{customer.customerName}</h4>
                        <p className="text-sm text-gray-600">{customer.contactPerson}</p>
                      </div>
                      {primaryCustomerId === customer.id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>Email: {customer.email}</p>
                      <p>Phone: {customer.phone}</p>
                      <p>Lifetime Value: {formatLakhsCrores(customer.lifetimeValue)}</p>
                      <p>Total Orders: {customer.totalOrders}</p>
                      <p>Created: {customer.createdAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-900 font-medium mb-1">Warning:</p>
              <p className="text-sm text-yellow-800">
                This action cannot be undone. The secondary customer record will be deleted and all associated data will be transferred to the primary customer.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowMergeDialog(false);
                  setPrimaryCustomerId('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeCustomers}
                disabled={!primaryCustomerId}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Merge Customers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Segmentation Rules Dialog */}
      {showSegmentationRulesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Auto-Segmentation Rules</h3>
              </div>
              <button
                onClick={() => setShowSegmentationRulesDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Define rules to automatically segment customers based on their behavior and characteristics.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-900">VIP Customers</h4>
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full">Active</span>
                </div>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>• Lifetime Value &gt; ₹10,00,000 (10 Lakhs)</p>
                  <p>• Total Orders &gt; 50</p>
                  <p>• Account Classification = A</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-indigo-900">Enterprise Customers</h4>
                  <span className="text-xs px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full">Active</span>
                </div>
                <div className="text-sm text-indigo-800 space-y-1">
                  <p>• Lifetime Value &gt; ₹5,00,000 (5 Lakhs)</p>
                  <p>• Total Orders &gt; 30</p>
                  <p>• Account Classification = A or B</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-900">SMB Customers</h4>
                  <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">Active</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Lifetime Value &gt; ₹2,00,000 (2 Lakhs)</p>
                  <p>• Total Orders &gt; 15</p>
                  <p>• Account Classification = B or C</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Create New Rule</h4>
                </div>
                <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors">
                  + Add Segmentation Rule
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSegmentationRulesDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast({
                    title: 'Rules Applied',
                    message: 'Auto-segmentation rules have been applied to all customers.',
                    variant: 'success'
                  });
                  setShowSegmentationRulesDialog(false);
                }}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Apply Rules Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {selectedCustomers.length === 1 && (
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
          <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">D</kbd> to Delete</p>
          <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">E</kbd> to Edit</p>
          <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">V</kbd> to View</p>
        </div>
      )}
    </div>
  );
}
