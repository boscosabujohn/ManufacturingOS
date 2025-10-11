'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail, Building2, User, Calendar, TrendingUp, DollarSign, Download, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  customerName: string;
  industry: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'vip' | 'churned';
  lifetimeValue: number;
  lastOrder: string;
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
    lifetimeValue: 8500000,
    lastOrder: '2025-10-05',
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
    lifetimeValue: 4500000,
    lastOrder: '2025-10-08',
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
    lifetimeValue: 12000000,
    lastOrder: '2025-10-02',
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
    lifetimeValue: 2800000,
    lastOrder: '2025-08-15',
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
    lifetimeValue: 3500000,
    lastOrder: '2025-10-10',
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
    lifetimeValue: 18000000,
    lastOrder: '2025-10-09',
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
    lifetimeValue: 5200000,
    lastOrder: '2025-10-04',
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
    lifetimeValue: 22000000,
    lastOrder: '2025-10-07',
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
    lifetimeValue: 3200000,
    lastOrder: '2025-09-28',
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
    lifetimeValue: 9800000,
    lastOrder: '2025-10-01',
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
    lifetimeValue: 2800000,
    lastOrder: '2025-10-03',
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
    lifetimeValue: 1500000,
    lastOrder: '2025-08-15',
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
    lifetimeValue: 5200000,
    lastOrder: '2025-10-06',
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
    lifetimeValue: 6700000,
    lastOrder: '2025-10-04',
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
    lifetimeValue: 11500000,
    lastOrder: '2025-10-07',
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
    lifetimeValue: 4100000,
    lastOrder: '2025-09-25',
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
    lifetimeValue: 3600000,
    lastOrder: '2025-10-08',
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
    lifetimeValue: 2200000,
    lastOrder: '2025-09-30',
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
    lifetimeValue: 4800000,
    lastOrder: '2025-10-05',
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
    lifetimeValue: 13200000,
    lastOrder: '2025-10-09',
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

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerGroupFilter, setCustomerGroupFilter] = useState<string>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [creditStatusFilter, setCreditStatusFilter] = useState<string>('all');
  const [lifecycleStageFilter, setLifecycleStageFilter] = useState<string>('all');
  const [accountManagerFilter, setAccountManagerFilter] = useState<string>('all');
  const [salesOrgFilter, setSalesOrgFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const itemsPerPage = 10;

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
    const matchesGroup = customerGroupFilter === 'all' || customer.customerGroup === customerGroupFilter;
    const matchesClassification = classificationFilter === 'all' || customer.customerClassification === classificationFilter;
    const matchesCreditStatus = creditStatusFilter === 'all' || customer.creditStatus === creditStatusFilter;
    const matchesLifecycleStage = lifecycleStageFilter === 'all' || customer.customerLifecycleStage === lifecycleStageFilter;
    const matchesAccountManager = accountManagerFilter === 'all' || customer.accountManager === accountManagerFilter;
    const matchesSalesOrg = salesOrgFilter === 'all' || customer.salesOrganization === salesOrgFilter;
    return matchesSearch && matchesStatus && matchesGroup && matchesClassification &&
           matchesCreditStatus && matchesLifecycleStage && matchesAccountManager && matchesSalesOrg;
  });

  // Sort customers
  if (sortField) {
    filteredCustomers = [...filteredCustomers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
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
    thisMonthRevenue: 4500000, // Mock data for this month's revenue in INR
  };

  // Format Indian currency (Rupees)
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format to Lakhs/Crores
  const formatLakhsCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return formatIndianCurrency(amount);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    router.push(`/crm/customers/view/${customer.id}`);
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Exporting customer data to CSV...');
    console.log('Exporting customers:', filteredCustomers);
  };

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
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCustomers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedCustomers([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Export Selected
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                Send Email
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {showAdvancedFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="vip">VIP</option>
                <option value="churned">Churned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Group</label>
              <select
                value={customerGroupFilter}
                onChange={(e) => setCustomerGroupFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Groups</option>
                <option value="wholesale">Wholesale</option>
                <option value="retail">Retail</option>
                <option value="distributor">Distributor</option>
                <option value="oem">OEM</option>
                <option value="end_user">End User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
              <select
                value={classificationFilter}
                onChange={(e) => setClassificationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classifications</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Status</label>
              <select
                value={creditStatusFilter}
                onChange={(e) => setCreditStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Credit Status</option>
                <option value="approved">Approved</option>
                <option value="on_hold">On Hold</option>
                <option value="suspended">Suspended</option>
                <option value="review_required">Review Required</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lifecycle Stage</label>
              <select
                value={lifecycleStageFilter}
                onChange={(e) => setLifecycleStageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stages</option>
                <option value="prospect">Prospect</option>
                <option value="new">New</option>
                <option value="growing">Growing</option>
                <option value="mature">Mature</option>
                <option value="at_risk">At Risk</option>
                <option value="churned">Churned</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Organization</label>
              <select
                value={salesOrgFilter}
                onChange={(e) => setSalesOrgFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Organizations</option>
                {salesOrganizations.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCustomerGroupFilter('all');
                  setClassificationFilter('all');
                  setCreditStatusFilter('all');
                  setLifecycleStageFilter('all');
                  setAccountManagerFilter('all');
                  setSalesOrgFilter('all');
                }}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('accountManager')}>
                  <div className="flex items-center space-x-1">
                    <span>Account Manager</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classification</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('creditLimit')}>
                  <div className="flex items-center space-x-1">
                    <span>Credit Limit</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Terms</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Org</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lifecycle Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('lastOrder')}>
                  <div className="flex items-center space-x-1">
                    <span>Last Order</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blocks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
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
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.industry}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.accountManager}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classificationColors[customer.customerClassification]}`}>
                      Class {customer.customerClassification}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${creditStatusColors[customer.creditStatus]}`}>
                      {customer.creditStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatLakhsCrores(customer.creditLimit)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.paymentTerms}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.salesOrganization}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${lifecycleStageColors[customer.customerLifecycleStage]}`}>
                      {customer.customerLifecycleStage.charAt(0).toUpperCase() + customer.customerLifecycleStage.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{customer.lastOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {customer.salesBlock && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded" title="Sales Block">S</span>
                      )}
                      {customer.deliveryBlock && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded" title="Delivery Block">D</span>
                      )}
                      {customer.billingBlock && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded" title="Billing Block">B</span>
                      )}
                      {!customer.salesBlock && !customer.deliveryBlock && !customer.billingBlock && (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/crm/customers/edit/${customer.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Customer"
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
    </div>
  );
}
