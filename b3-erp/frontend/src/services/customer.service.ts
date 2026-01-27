/**
 * Customer Service
 * Handles all customer-related API operations for the Core module
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK_DATA = true;

// ============================================================================
// Interfaces
// ============================================================================

export type CustomerType = 'individual' | 'business' | 'enterprise' | 'government';
export type CustomerStatus = 'active' | 'inactive' | 'prospect' | 'suspended' | 'churned';
export type CustomerTier = 'standard' | 'silver' | 'gold' | 'platinum';
export type PaymentTerms = 'immediate' | 'net15' | 'net30' | 'net45' | 'net60' | 'net90';

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  addressType: 'billing' | 'shipping' | 'both';
}

export interface CustomerContact {
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  tier: CustomerTier;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: PaymentTerms;
  addresses: CustomerAddress[];
  contacts: CustomerContact[];
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: PaymentTerms;
  addresses?: CustomerAddress[];
  contacts?: CustomerContact[];
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  status?: CustomerStatus;
  tier?: CustomerTier;
}

export interface CustomerFilters {
  type?: CustomerType;
  status?: CustomerStatus;
  tier?: CustomerTier;
  search?: string;
  minRevenue?: number;
  maxRevenue?: number;
  page?: number;
  limit?: number;
}

// ============================================================================
// Mock Data
// ============================================================================

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    customerCode: 'CUST-2024-0001',
    name: 'Sharma Modular Kitchens Pvt Ltd',
    type: 'business',
    status: 'active',
    tier: 'platinum',
    email: 'procurement@sharmamodular.com',
    phone: '+91 98765 43210',
    website: 'https://sharmamodular.com',
    taxId: 'GSTIN27AABCS1234A1ZS',
    creditLimit: 5000000,
    currentBalance: 1250000,
    paymentTerms: 'net30',
    addresses: [
      {
        street: '456, Industrial Area Phase 2',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400001',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Rajesh Sharma',
        email: 'rajesh@sharmamodular.com',
        phone: '+91 98765 43210',
        position: 'Managing Director',
        isPrimary: true,
      },
      {
        name: 'Priya Sharma',
        email: 'priya@sharmamodular.com',
        phone: '+91 98765 43211',
        position: 'Purchase Manager',
        isPrimary: false,
      },
    ],
    totalOrders: 156,
    totalRevenue: 45000000,
    lastOrderDate: '2025-01-20',
    notes: 'Key account - premium pricing agreed',
    tags: ['premium', 'modular-kitchen', 'mumbai'],
    createdAt: '2022-03-15',
    updatedAt: '2025-01-20',
  },
  {
    id: 'cust-002',
    customerCode: 'CUST-2024-0002',
    name: 'Prestige Developers Bangalore',
    type: 'enterprise',
    status: 'active',
    tier: 'gold',
    email: 'contracts@prestigedev.com',
    phone: '+91 80 4567 8901',
    website: 'https://prestigedev.com',
    taxId: 'GSTIN29AABCP5678B1ZS',
    creditLimit: 10000000,
    currentBalance: 3500000,
    paymentTerms: 'net45',
    addresses: [
      {
        street: '123, MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560001',
        isDefault: true,
        addressType: 'billing',
      },
      {
        street: '789, Electronic City Phase 1',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560100',
        isDefault: false,
        addressType: 'shipping',
      },
    ],
    contacts: [
      {
        name: 'Anand Verma',
        email: 'anand@prestigedev.com',
        phone: '+91 80 4567 8901',
        position: 'Project Director',
        isPrimary: true,
      },
    ],
    totalOrders: 89,
    totalRevenue: 78000000,
    lastOrderDate: '2025-01-18',
    notes: 'Large developer - bulk orders for residential projects',
    tags: ['enterprise', 'developer', 'bangalore', 'bulk'],
    createdAt: '2021-06-01',
    updatedAt: '2025-01-18',
  },
  {
    id: 'cust-003',
    customerCode: 'CUST-2024-0003',
    name: 'Urban Interiors & Designers',
    type: 'business',
    status: 'active',
    tier: 'silver',
    email: 'orders@urbaninteriors.in',
    phone: '+91 44 2567 8901',
    website: 'https://urbaninteriors.in',
    taxId: 'GSTIN33AABCU9012C1ZS',
    creditLimit: 1500000,
    currentBalance: 450000,
    paymentTerms: 'net30',
    addresses: [
      {
        street: '234, Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        postalCode: '600002',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Lakshmi Narayan',
        email: 'lakshmi@urbaninteriors.in',
        phone: '+91 44 2567 8901',
        position: 'Owner',
        isPrimary: true,
      },
    ],
    totalOrders: 67,
    totalRevenue: 12500000,
    lastOrderDate: '2025-01-15',
    tags: ['interiors', 'chennai', 'design'],
    createdAt: '2023-01-10',
    updatedAt: '2025-01-15',
  },
  {
    id: 'cust-004',
    customerCode: 'CUST-2024-0004',
    name: 'Elite Contractors & Builders',
    type: 'business',
    status: 'active',
    tier: 'gold',
    email: 'purchase@elitebuilders.com',
    phone: '+91 22 4567 1234',
    taxId: 'GSTIN27AABCE3456D1ZS',
    creditLimit: 3000000,
    currentBalance: 890000,
    paymentTerms: 'net30',
    addresses: [
      {
        street: '567, Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400069',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Vikram Malhotra',
        email: 'vikram@elitebuilders.com',
        phone: '+91 22 4567 1234',
        position: 'CEO',
        isPrimary: true,
      },
    ],
    totalOrders: 112,
    totalRevenue: 28000000,
    lastOrderDate: '2025-01-22',
    tags: ['builders', 'mumbai', 'commercial'],
    createdAt: '2022-08-20',
    updatedAt: '2025-01-22',
  },
  {
    id: 'cust-005',
    customerCode: 'CUST-2024-0005',
    name: 'DLF Universal Projects',
    type: 'enterprise',
    status: 'active',
    tier: 'platinum',
    email: 'procurement@dlfuniversal.com',
    phone: '+91 11 4567 8900',
    website: 'https://dlfuniversal.com',
    taxId: 'GSTIN07AABCD7890E1ZS',
    creditLimit: 25000000,
    currentBalance: 8500000,
    paymentTerms: 'net60',
    addresses: [
      {
        street: 'DLF Centre, Sansad Marg',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110001',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Amit Sharma',
        email: 'amit.sharma@dlfuniversal.com',
        phone: '+91 11 4567 8900',
        position: 'VP Procurement',
        isPrimary: true,
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@dlfuniversal.com',
        phone: '+91 11 4567 8901',
        position: 'Purchase Manager',
        isPrimary: false,
      },
    ],
    totalOrders: 234,
    totalRevenue: 125000000,
    lastOrderDate: '2025-01-25',
    notes: 'Strategic partner - annual contract',
    tags: ['enterprise', 'delhi', 'strategic', 'annual-contract'],
    createdAt: '2020-01-15',
    updatedAt: '2025-01-25',
  },
  {
    id: 'cust-006',
    customerCode: 'CUST-2024-0006',
    name: 'Signature Interiors Pune',
    type: 'business',
    status: 'active',
    tier: 'standard',
    email: 'info@signatureinteriors.in',
    phone: '+91 20 2567 8901',
    taxId: 'GSTIN27AABCS2345F1ZS',
    creditLimit: 500000,
    currentBalance: 125000,
    paymentTerms: 'net15',
    addresses: [
      {
        street: '45, FC Road',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '411004',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Suresh Patil',
        email: 'suresh@signatureinteriors.in',
        phone: '+91 20 2567 8901',
        position: 'Owner',
        isPrimary: true,
      },
    ],
    totalOrders: 34,
    totalRevenue: 4500000,
    lastOrderDate: '2025-01-10',
    tags: ['interiors', 'pune', 'residential'],
    createdAt: '2024-03-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'cust-007',
    customerCode: 'CUST-2024-0007',
    name: 'Royal Homes Hyderabad',
    type: 'business',
    status: 'prospect',
    tier: 'standard',
    email: 'business@royalhomes.co.in',
    phone: '+91 40 4567 8901',
    taxId: 'GSTIN36AABCR6789G1ZS',
    creditLimit: 1000000,
    currentBalance: 0,
    paymentTerms: 'net30',
    addresses: [
      {
        street: '123, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500034',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Mohammed Rafi',
        email: 'rafi@royalhomes.co.in',
        phone: '+91 40 4567 8901',
        position: 'Director',
        isPrimary: true,
      },
    ],
    totalOrders: 0,
    totalRevenue: 0,
    notes: 'New prospect - high potential',
    tags: ['prospect', 'hyderabad', 'high-potential'],
    createdAt: '2025-01-05',
    updatedAt: '2025-01-05',
  },
  {
    id: 'cust-008',
    customerCode: 'CUST-2024-0008',
    name: 'Modern Living Ahmedabad',
    type: 'business',
    status: 'active',
    tier: 'silver',
    email: 'sales@modernliving.in',
    phone: '+91 79 2567 8901',
    website: 'https://modernliving.in',
    taxId: 'GSTIN24AABCM1234H1ZS',
    creditLimit: 2000000,
    currentBalance: 650000,
    paymentTerms: 'net30',
    addresses: [
      {
        street: '78, SG Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        postalCode: '380015',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Bhavesh Patel',
        email: 'bhavesh@modernliving.in',
        phone: '+91 79 2567 8901',
        position: 'Managing Partner',
        isPrimary: true,
      },
    ],
    totalOrders: 78,
    totalRevenue: 18500000,
    lastOrderDate: '2025-01-19',
    tags: ['furniture', 'ahmedabad', 'retail'],
    createdAt: '2022-11-15',
    updatedAt: '2025-01-19',
  },
  {
    id: 'cust-009',
    customerCode: 'CUST-2024-0009',
    name: 'Cosmos Furniture Mart',
    type: 'individual',
    status: 'inactive',
    tier: 'standard',
    email: 'cosmos.furniture@gmail.com',
    phone: '+91 98765 12345',
    taxId: 'GSTIN27AABCC5678I1ZS',
    creditLimit: 200000,
    currentBalance: 45000,
    paymentTerms: 'immediate',
    addresses: [
      {
        street: '12, Market Road',
        city: 'Nagpur',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '440001',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Ramesh Agarwal',
        email: 'cosmos.furniture@gmail.com',
        phone: '+91 98765 12345',
        position: 'Proprietor',
        isPrimary: true,
      },
    ],
    totalOrders: 15,
    totalRevenue: 850000,
    lastOrderDate: '2024-06-15',
    notes: 'Account inactive - follow up required',
    tags: ['retail', 'nagpur', 'inactive'],
    createdAt: '2023-05-10',
    updatedAt: '2024-06-15',
  },
  {
    id: 'cust-010',
    customerCode: 'CUST-2024-0010',
    name: 'Government Housing Authority',
    type: 'government',
    status: 'active',
    tier: 'gold',
    email: 'procurement@gha.gov.in',
    phone: '+91 11 2345 6789',
    website: 'https://gha.gov.in',
    taxId: 'GSTIN07AABCG9012J1ZS',
    creditLimit: 50000000,
    currentBalance: 12000000,
    paymentTerms: 'net90',
    addresses: [
      {
        street: 'Nirman Bhawan, Maulana Azad Road',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110011',
        isDefault: true,
        addressType: 'both',
      },
    ],
    contacts: [
      {
        name: 'Dr. Sanjay Kumar',
        email: 'sanjay.kumar@gha.gov.in',
        phone: '+91 11 2345 6789',
        position: 'Joint Secretary',
        isPrimary: true,
      },
    ],
    totalOrders: 45,
    totalRevenue: 85000000,
    lastOrderDate: '2025-01-12',
    notes: 'Government tender - special payment terms',
    tags: ['government', 'delhi', 'tender', 'bulk'],
    createdAt: '2021-04-01',
    updatedAt: '2025-01-12',
  },
];

// ============================================================================
// Customer Service Class
// ============================================================================

export class CustomerService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all customers with optional filters
   */
  static async getAllCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filteredCustomers = [...MOCK_CUSTOMERS];

      if (filters?.type) {
        filteredCustomers = filteredCustomers.filter((c) => c.type === filters.type);
      }
      if (filters?.status) {
        filteredCustomers = filteredCustomers.filter((c) => c.status === filters.status);
      }
      if (filters?.tier) {
        filteredCustomers = filteredCustomers.filter((c) => c.tier === filters.tier);
      }
      if (filters?.minRevenue !== undefined) {
        filteredCustomers = filteredCustomers.filter((c) => c.totalRevenue >= filters.minRevenue!);
      }
      if (filters?.maxRevenue !== undefined) {
        filteredCustomers = filteredCustomers.filter((c) => c.totalRevenue <= filters.maxRevenue!);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.customerCode.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        filteredCustomers = filteredCustomers.slice(start, end);
      }

      return filteredCustomers;
    }

    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.set('type', filters.type);
    if (filters?.status) queryParams.set('status', filters.status);
    if (filters?.tier) queryParams.set('tier', filters.tier);
    if (filters?.minRevenue) queryParams.set('minRevenue', filters.minRevenue.toString());
    if (filters?.maxRevenue) queryParams.set('maxRevenue', filters.maxRevenue.toString());
    if (filters?.search) queryParams.set('search', filters.search);
    if (filters?.page) queryParams.set('page', filters.page.toString());
    if (filters?.limit) queryParams.set('limit', filters.limit.toString());

    return this.request<Customer[]>(`/core/customers?${queryParams.toString()}`);
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(id: string): Promise<Customer> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
      if (!customer) throw new Error('Customer not found');
      return customer;
    }
    return this.request<Customer>(`/core/customers/${id}`);
  }

  /**
   * Get customer by code
   */
  static async getCustomerByCode(code: string): Promise<Customer> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const customer = MOCK_CUSTOMERS.find((c) => c.customerCode === code);
      if (!customer) throw new Error('Customer not found');
      return customer;
    }
    return this.request<Customer>(`/core/customers/code/${code}`);
  }

  /**
   * Create a new customer
   */
  static async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const now = new Date();
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        customerCode: `CUST-${now.getFullYear()}-${String(MOCK_CUSTOMERS.length + 1).padStart(4, '0')}`,
        ...data,
        status: 'active',
        tier: 'standard',
        creditLimit: data.creditLimit || 100000,
        currentBalance: 0,
        paymentTerms: data.paymentTerms || 'net30',
        addresses: data.addresses || [],
        contacts: data.contacts || [],
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: now.toISOString().split('T')[0],
        updatedAt: now.toISOString().split('T')[0],
      };
      MOCK_CUSTOMERS.push(newCustomer);
      return newCustomer;
    }
    return this.request<Customer>('/core/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an existing customer
   */
  static async updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Customer not found');

      MOCK_CUSTOMERS[index] = {
        ...MOCK_CUSTOMERS[index],
        ...data,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      return MOCK_CUSTOMERS[index];
    }
    return this.request<Customer>(`/core/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a customer
   */
  static async deleteCustomer(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Customer not found');

      if (MOCK_CUSTOMERS[index].currentBalance > 0) {
        throw new Error('Cannot delete customer with outstanding balance');
      }

      MOCK_CUSTOMERS.splice(index, 1);
      return;
    }
    await this.request<void>(`/core/customers/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get customer statistics
   */
  static async getStatistics(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    totalRevenue: number;
    avgRevenuePerCustomer: number;
    customersByType: Record<string, number>;
    customersByTier: Record<string, number>;
    customersByStatus: Record<string, number>;
    topCustomers: Array<{ id: string; name: string; revenue: number }>;
  }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const customersByType: Record<string, number> = {};
      const customersByTier: Record<string, number> = {};
      const customersByStatus: Record<string, number> = {};

      MOCK_CUSTOMERS.forEach((customer) => {
        customersByType[customer.type] = (customersByType[customer.type] || 0) + 1;
        customersByTier[customer.tier] = (customersByTier[customer.tier] || 0) + 1;
        customersByStatus[customer.status] = (customersByStatus[customer.status] || 0) + 1;
      });

      const totalRevenue = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalRevenue, 0);
      const topCustomers = [...MOCK_CUSTOMERS]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)
        .map((c) => ({ id: c.id, name: c.name, revenue: c.totalRevenue }));

      return {
        totalCustomers: MOCK_CUSTOMERS.length,
        activeCustomers: MOCK_CUSTOMERS.filter((c) => c.status === 'active').length,
        totalRevenue,
        avgRevenuePerCustomer: totalRevenue / MOCK_CUSTOMERS.length,
        customersByType,
        customersByTier,
        customersByStatus,
        topCustomers,
      };
    }

    return this.request<{
      totalCustomers: number;
      activeCustomers: number;
      totalRevenue: number;
      avgRevenuePerCustomer: number;
      customersByType: Record<string, number>;
      customersByTier: Record<string, number>;
      customersByStatus: Record<string, number>;
      topCustomers: Array<{ id: string; name: string; revenue: number }>;
    }>('/core/customers/statistics');
  }

  /**
   * Get customer order history
   */
  static async getOrderHistory(customerId: string): Promise<Array<{
    orderId: string;
    orderDate: string;
    amount: number;
    status: string;
  }>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Generate mock order history
      return [
        { orderId: 'SO-2025-001', orderDate: '2025-01-20', amount: 250000, status: 'delivered' },
        { orderId: 'SO-2025-002', orderDate: '2025-01-15', amount: 180000, status: 'shipped' },
        { orderId: 'SO-2024-089', orderDate: '2024-12-28', amount: 320000, status: 'delivered' },
      ];
    }
    return this.request<Array<{
      orderId: string;
      orderDate: string;
      amount: number;
      status: string;
    }>>(`/core/customers/${customerId}/orders`);
  }
}

// Export singleton instance
export const customerService = CustomerService;
