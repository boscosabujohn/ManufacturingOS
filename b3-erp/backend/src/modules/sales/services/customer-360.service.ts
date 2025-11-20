import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type CustomerCategory = 'platinum' | 'gold' | 'silver' | 'standard' | 'new';
export type CustomerStatus = 'active' | 'inactive' | 'prospect' | 'churned' | 'blacklisted';
export type ContactRole = 'decision_maker' | 'influencer' | 'technical' | 'procurement' | 'finance' | 'user';

export interface ContactPerson {
  id: string;
  name: string;
  designation: string;
  role: ContactRole;
  email: string;
  phone: string;
  mobile?: string;
  isPrimary: boolean;
  preferences: {
    preferredContactMethod: 'email' | 'phone' | 'whatsapp';
    preferredTime?: string;
    language?: string;
  };
  lastContactedAt?: string;
}

export interface CustomerAddress {
  id: string;
  type: 'billing' | 'shipping' | 'registered' | 'branch';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  gstNumber?: string;
}

export interface CreditInfo {
  creditLimit: number;
  creditUtilized: number;
  creditAvailable: number;
  paymentTerms: string;
  averagePaymentDays: number;
  overdueAmount: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  creditScore: number; // 0-100
  creditRating: 'excellent' | 'good' | 'fair' | 'poor' | 'at_risk';
}

export interface SalesMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
  averageOrderValue: number;
  orderFrequency: number; // Orders per month
  lastOrderDate?: string;
  topProducts: Array<{
    itemCode: string;
    itemName: string;
    quantity: number;
    revenue: number;
  }>;
  yearlyTrend: Array<{
    year: number;
    revenue: number;
    orders: number;
  }>;
}

export interface OpenPipeline {
  openQuotes: Array<{
    id: string;
    number: string;
    value: number;
    probability: number;
    expectedCloseDate: string;
    status: string;
  }>;
  openOrders: Array<{
    id: string;
    number: string;
    value: number;
    status: string;
    expectedDeliveryDate: string;
  }>;
  pendingInvoices: Array<{
    id: string;
    number: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
  }>;
  totalPipelineValue: number;
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'visit' | 'support_ticket' | 'complaint';
  subject: string;
  description: string;
  date: string;
  contactPersonId?: string;
  contactPersonName?: string;
  userId: string;
  userName: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  attachments?: string[];
}

export interface CustomerHealthScore {
  overall: number; // 0-100
  components: {
    financialHealth: number;
    engagementScore: number;
    satisfactionScore: number;
    growthPotential: number;
    riskScore: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  alerts: string[];
  recommendations: string[];
}

export interface Customer360 {
  // Basic Info
  id: string;
  customerCode: string;
  companyName: string;
  tradeName?: string;
  industry?: string;
  segment?: string;
  category: CustomerCategory;
  status: CustomerStatus;

  // Registration Details
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  registrationDate: string;

  // Contacts
  contacts: ContactPerson[];
  addresses: CustomerAddress[];

  // Financial
  creditInfo: CreditInfo;

  // Sales
  salesMetrics: SalesMetrics;
  openPipeline: OpenPipeline;

  // Interactions
  recentInteractions: Interaction[];
  totalInteractions: number;

  // Health & Scoring
  healthScore: CustomerHealthScore;

  // Assignments
  salesRepId?: string;
  salesRepName?: string;
  accountManagerId?: string;
  accountManagerName?: string;
  territory?: string;
  region?: string;

  // Preferences
  preferences: {
    currency: string;
    paymentMethod: string;
    deliveryPreferences?: string;
    communicationPreferences?: string;
  };

  // Custom Fields
  customFields?: Record<string, any>;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastActivityDate?: string;
}

@Injectable()
export class Customer360Service {
  private customers: Customer360[] = [];

  constructor() {
    this.seedMockData();
  }

  async getCustomer360View(customerId: string): Promise<Customer360> {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    // Recalculate health score
    customer.healthScore = this.calculateHealthScore(customer);

    return customer;
  }

  async findAll(filters?: {
    category?: CustomerCategory;
    status?: CustomerStatus;
    territory?: string;
    salesRepId?: string;
  }): Promise<Customer360[]> {
    let result = [...this.customers];

    if (filters?.category) {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters?.status) {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters?.territory) {
      result = result.filter(c => c.territory === filters.territory);
    }
    if (filters?.salesRepId) {
      result = result.filter(c => c.salesRepId === filters.salesRepId);
    }

    return result;
  }

  async searchCustomers(query: string): Promise<Customer360[]> {
    const lowerQuery = query.toLowerCase();
    return this.customers.filter(c =>
      c.companyName.toLowerCase().includes(lowerQuery) ||
      c.customerCode.toLowerCase().includes(lowerQuery) ||
      c.contacts.some(contact =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.email.toLowerCase().includes(lowerQuery)
      )
    );
  }

  async addContact(customerId: string, contact: Partial<ContactPerson>): Promise<ContactPerson> {
    const customer = await this.getCustomer360View(customerId);

    const newContact: ContactPerson = {
      id: uuidv4(),
      name: contact.name || '',
      designation: contact.designation || '',
      role: contact.role || 'user',
      email: contact.email || '',
      phone: contact.phone || '',
      mobile: contact.mobile,
      isPrimary: contact.isPrimary || false,
      preferences: contact.preferences || {
        preferredContactMethod: 'email',
      },
    };

    // If this is primary, unset other primaries
    if (newContact.isPrimary) {
      customer.contacts.forEach(c => c.isPrimary = false);
    }

    customer.contacts.push(newContact);
    customer.updatedAt = new Date().toISOString();

    return newContact;
  }

  async addInteraction(customerId: string, interaction: Partial<Interaction>): Promise<Interaction> {
    const customer = await this.getCustomer360View(customerId);

    const newInteraction: Interaction = {
      id: uuidv4(),
      type: interaction.type || 'call',
      subject: interaction.subject || '',
      description: interaction.description || '',
      date: interaction.date || new Date().toISOString(),
      contactPersonId: interaction.contactPersonId,
      contactPersonName: interaction.contactPersonName,
      userId: interaction.userId || '',
      userName: interaction.userName || '',
      outcome: interaction.outcome,
      followUpRequired: interaction.followUpRequired || false,
      followUpDate: interaction.followUpDate,
    };

    customer.recentInteractions.unshift(newInteraction);
    customer.totalInteractions++;
    customer.lastActivityDate = newInteraction.date;
    customer.updatedAt = new Date().toISOString();

    // Keep only last 50 interactions in memory
    if (customer.recentInteractions.length > 50) {
      customer.recentInteractions = customer.recentInteractions.slice(0, 50);
    }

    return newInteraction;
  }

  async updateCreditInfo(customerId: string, creditUpdate: Partial<CreditInfo>): Promise<CreditInfo> {
    const customer = await this.getCustomer360View(customerId);

    customer.creditInfo = {
      ...customer.creditInfo,
      ...creditUpdate,
    };

    // Recalculate credit rating
    customer.creditInfo.creditRating = this.calculateCreditRating(customer.creditInfo);

    customer.updatedAt = new Date().toISOString();

    return customer.creditInfo;
  }

  async updateCategory(customerId: string, newCategory: CustomerCategory, reason: string): Promise<Customer360> {
    const customer = await this.getCustomer360View(customerId);
    const oldCategory = customer.category;

    customer.category = newCategory;
    customer.updatedAt = new Date().toISOString();

    // Log category change as an interaction
    await this.addInteraction(customerId, {
      type: 'call',
      subject: `Category changed from ${oldCategory} to ${newCategory}`,
      description: reason,
      userId: 'system',
      userName: 'System',
      followUpRequired: false,
    });

    return customer;
  }

  async getCustomerTimeline(customerId: string, limit: number = 20): Promise<Array<{
    date: string;
    type: string;
    title: string;
    description: string;
  }>> {
    const customer = await this.getCustomer360View(customerId);
    const timeline: Array<{
      date: string;
      type: string;
      title: string;
      description: string;
    }> = [];

    // Add interactions to timeline
    for (const interaction of customer.recentInteractions.slice(0, limit)) {
      timeline.push({
        date: interaction.date,
        type: interaction.type,
        title: interaction.subject,
        description: interaction.description,
      });
    }

    // Add orders from pipeline
    for (const order of customer.openPipeline.openOrders) {
      timeline.push({
        date: order.expectedDeliveryDate,
        type: 'order',
        title: `Order ${order.number}`,
        description: `Value: ${order.value}, Status: ${order.status}`,
      });
    }

    // Sort by date descending
    return timeline.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, limit);
  }

  async getAtRiskCustomers(): Promise<Customer360[]> {
    return this.customers.filter(c => {
      const health = this.calculateHealthScore(c);
      return health.overall < 50 || health.trend === 'declining';
    });
  }

  async getTopCustomers(limit: number = 10): Promise<Customer360[]> {
    return [...this.customers]
      .sort((a, b) => b.salesMetrics.totalRevenue - a.salesMetrics.totalRevenue)
      .slice(0, limit);
  }

  async getCustomersByPaymentStatus(): Promise<{
    onTime: Customer360[];
    delayed: Customer360[];
    overdue: Customer360[];
  }> {
    const onTime: Customer360[] = [];
    const delayed: Customer360[] = [];
    const overdue: Customer360[] = [];

    for (const customer of this.customers) {
      if (customer.creditInfo.overdueAmount > 0) {
        overdue.push(customer);
      } else if (customer.creditInfo.averagePaymentDays > 30) {
        delayed.push(customer);
      } else {
        onTime.push(customer);
      }
    }

    return { onTime, delayed, overdue };
  }

  async getCategoryDistribution(): Promise<Record<CustomerCategory, {
    count: number;
    totalRevenue: number;
    percentage: number;
  }>> {
    const distribution: Record<CustomerCategory, { count: number; totalRevenue: number; percentage: number }> = {
      platinum: { count: 0, totalRevenue: 0, percentage: 0 },
      gold: { count: 0, totalRevenue: 0, percentage: 0 },
      silver: { count: 0, totalRevenue: 0, percentage: 0 },
      standard: { count: 0, totalRevenue: 0, percentage: 0 },
      new: { count: 0, totalRevenue: 0, percentage: 0 },
    };

    let totalRevenue = 0;

    for (const customer of this.customers) {
      distribution[customer.category].count++;
      distribution[customer.category].totalRevenue += customer.salesMetrics.totalRevenue;
      totalRevenue += customer.salesMetrics.totalRevenue;
    }

    // Calculate percentages
    for (const category of Object.keys(distribution) as CustomerCategory[]) {
      distribution[category].percentage = totalRevenue > 0
        ? Math.round((distribution[category].totalRevenue / totalRevenue) * 100)
        : 0;
    }

    return distribution;
  }

  async getFollowUpsDue(userId?: string): Promise<Interaction[]> {
    const followUps: Interaction[] = [];
    const today = new Date();

    for (const customer of this.customers) {
      for (const interaction of customer.recentInteractions) {
        if (
          interaction.followUpRequired &&
          interaction.followUpDate &&
          new Date(interaction.followUpDate) <= today &&
          (!userId || interaction.userId === userId)
        ) {
          followUps.push(interaction);
        }
      }
    }

    return followUps.sort((a, b) =>
      new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime()
    );
  }

  private calculateHealthScore(customer: Customer360): CustomerHealthScore {
    const alerts: string[] = [];
    const recommendations: string[] = [];

    // Financial Health (0-100)
    let financialHealth = 100;
    if (customer.creditInfo.overdueAmount > 0) {
      financialHealth -= 30;
      alerts.push('Customer has overdue payments');
    }
    if (customer.creditInfo.averagePaymentDays > 45) {
      financialHealth -= 20;
      alerts.push('Payment delays exceeding 45 days');
    }
    if (customer.creditInfo.creditUtilized > customer.creditInfo.creditLimit * 0.9) {
      financialHealth -= 20;
      alerts.push('Credit limit nearly exhausted');
    }
    financialHealth = Math.max(0, financialHealth);

    // Engagement Score (0-100)
    let engagementScore = 50; // Base score
    const daysSinceLastActivity = customer.lastActivityDate
      ? Math.floor((Date.now() - new Date(customer.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24))
      : 365;

    if (daysSinceLastActivity < 7) {
      engagementScore = 100;
    } else if (daysSinceLastActivity < 30) {
      engagementScore = 80;
    } else if (daysSinceLastActivity < 90) {
      engagementScore = 60;
    } else {
      engagementScore = 30;
      alerts.push(`No activity in ${daysSinceLastActivity} days`);
      recommendations.push('Schedule a follow-up call');
    }

    // Satisfaction Score (based on support tickets - mock)
    const satisfactionScore = 75;

    // Growth Potential (based on order trends)
    let growthPotential = 50;
    if (customer.salesMetrics.yearlyTrend.length >= 2) {
      const lastYear = customer.salesMetrics.yearlyTrend[customer.salesMetrics.yearlyTrend.length - 1];
      const prevYear = customer.salesMetrics.yearlyTrend[customer.salesMetrics.yearlyTrend.length - 2];
      const growth = ((lastYear.revenue - prevYear.revenue) / prevYear.revenue) * 100;

      if (growth > 20) {
        growthPotential = 90;
        recommendations.push('High growth customer - consider upselling');
      } else if (growth > 0) {
        growthPotential = 70;
      } else {
        growthPotential = 40;
        alerts.push('Revenue declining year-over-year');
      }
    }

    // Risk Score (inverse - higher is better/safer)
    const riskScore = Math.round((financialHealth + engagementScore + satisfactionScore) / 3);

    // Overall Score
    const overall = Math.round(
      (financialHealth * 0.3) +
      (engagementScore * 0.25) +
      (satisfactionScore * 0.2) +
      (growthPotential * 0.15) +
      (riskScore * 0.1)
    );

    // Determine trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (overall > 70 && engagementScore > 60) {
      trend = 'improving';
    } else if (overall < 50 || engagementScore < 40) {
      trend = 'declining';
    }

    return {
      overall,
      components: {
        financialHealth,
        engagementScore,
        satisfactionScore,
        growthPotential,
        riskScore,
      },
      trend,
      alerts,
      recommendations,
    };
  }

  private calculateCreditRating(creditInfo: CreditInfo): CreditInfo['creditRating'] {
    let score = 100;

    // Utilization factor
    const utilization = creditInfo.creditUtilized / creditInfo.creditLimit;
    if (utilization > 0.9) score -= 30;
    else if (utilization > 0.7) score -= 15;

    // Payment days factor
    if (creditInfo.averagePaymentDays > 60) score -= 30;
    else if (creditInfo.averagePaymentDays > 45) score -= 20;
    else if (creditInfo.averagePaymentDays > 30) score -= 10;

    // Overdue factor
    if (creditInfo.overdueAmount > 0) {
      const overdueRatio = creditInfo.overdueAmount / creditInfo.creditLimit;
      if (overdueRatio > 0.3) score -= 40;
      else if (overdueRatio > 0.1) score -= 25;
      else score -= 15;
    }

    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    if (score >= 40) return 'poor';
    return 'at_risk';
  }

  private seedMockData(): void {
    const customer1: Customer360 = {
      id: 'cust-001',
      customerCode: 'CUST-001',
      companyName: 'Acme Manufacturing Pvt Ltd',
      tradeName: 'Acme Industries',
      industry: 'Manufacturing',
      segment: 'Heavy Industry',
      category: 'platinum',
      status: 'active',
      gstNumber: '27AABCU9603R1ZM',
      panNumber: 'AABCU9603R',
      registrationDate: '2020-01-15',
      contacts: [
        {
          id: uuidv4(),
          name: 'Rajesh Kumar',
          designation: 'Procurement Manager',
          role: 'decision_maker',
          email: 'rajesh.kumar@acme.com',
          phone: '+91-22-12345678',
          mobile: '+91-9876543210',
          isPrimary: true,
          preferences: {
            preferredContactMethod: 'email',
            preferredTime: '10:00-18:00',
            language: 'English',
          },
          lastContactedAt: '2024-01-10T10:30:00Z',
        },
        {
          id: uuidv4(),
          name: 'Priya Sharma',
          designation: 'Technical Lead',
          role: 'technical',
          email: 'priya.sharma@acme.com',
          phone: '+91-22-12345679',
          isPrimary: false,
          preferences: {
            preferredContactMethod: 'phone',
          },
        },
      ],
      addresses: [
        {
          id: uuidv4(),
          type: 'registered',
          addressLine1: 'Plot No. 123, MIDC Industrial Area',
          addressLine2: 'Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400093',
          isPrimary: true,
          gstNumber: '27AABCU9603R1ZM',
        },
      ],
      creditInfo: {
        creditLimit: 10000000,
        creditUtilized: 6500000,
        creditAvailable: 3500000,
        paymentTerms: 'Net 30',
        averagePaymentDays: 28,
        overdueAmount: 0,
        lastPaymentDate: '2024-01-05',
        lastPaymentAmount: 1500000,
        creditScore: 85,
        creditRating: 'excellent',
      },
      salesMetrics: {
        totalOrders: 156,
        totalRevenue: 45000000,
        totalProfit: 9000000,
        averageOrderValue: 288461,
        orderFrequency: 4.2,
        lastOrderDate: '2024-01-08',
        topProducts: [
          { itemCode: 'MTR-001', itemName: 'Industrial Motor 5HP', quantity: 250, revenue: 6250000 },
          { itemCode: 'PNL-001', itemName: 'Control Panel', quantity: 120, revenue: 9000000 },
          { itemCode: 'CVY-001', itemName: 'Conveyor System', quantity: 15, revenue: 7500000 },
        ],
        yearlyTrend: [
          { year: 2022, revenue: 35000000, orders: 120 },
          { year: 2023, revenue: 42000000, orders: 145 },
          { year: 2024, revenue: 45000000, orders: 156 },
        ],
      },
      openPipeline: {
        openQuotes: [
          {
            id: 'quote-001',
            number: 'QT-202401-001',
            value: 2500000,
            probability: 80,
            expectedCloseDate: '2024-01-30',
            status: 'negotiation',
          },
        ],
        openOrders: [
          {
            id: 'order-001',
            number: 'SO-202401-001',
            value: 1800000,
            status: 'in_production',
            expectedDeliveryDate: '2024-01-25',
          },
        ],
        pendingInvoices: [
          {
            id: 'inv-001',
            number: 'INV-202401-001',
            amount: 1200000,
            dueDate: '2024-01-20',
            daysOverdue: 0,
          },
        ],
        totalPipelineValue: 5500000,
      },
      recentInteractions: [
        {
          id: uuidv4(),
          type: 'meeting',
          subject: 'Q1 2024 Planning Meeting',
          description: 'Discussed expansion plans and upcoming requirements',
          date: '2024-01-10T10:00:00Z',
          contactPersonId: 'contact-001',
          contactPersonName: 'Rajesh Kumar',
          userId: 'user-001',
          userName: 'Sales Rep',
          outcome: 'Positive - customer planning to increase orders by 20%',
          followUpRequired: true,
          followUpDate: '2024-01-25',
        },
      ],
      totalInteractions: 245,
      healthScore: {
        overall: 85,
        components: {
          financialHealth: 90,
          engagementScore: 85,
          satisfactionScore: 80,
          growthPotential: 85,
          riskScore: 88,
        },
        trend: 'improving',
        alerts: [],
        recommendations: ['Consider upgrading credit limit based on consistent payment history'],
      },
      salesRepId: 'user-001',
      salesRepName: 'John Smith',
      accountManagerId: 'user-002',
      accountManagerName: 'Jane Doe',
      territory: 'West',
      region: 'Maharashtra',
      preferences: {
        currency: 'INR',
        paymentMethod: 'Bank Transfer',
        deliveryPreferences: 'Weekday mornings',
        communicationPreferences: 'Email for documentation, phone for urgent matters',
      },
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-10T10:30:00Z',
      lastActivityDate: '2024-01-10T10:30:00Z',
    };

    this.customers.push(customer1);

    // Add more mock customers with varying categories
    const customer2: Customer360 = {
      ...customer1,
      id: 'cust-002',
      customerCode: 'CUST-002',
      companyName: 'Beta Engineering Works',
      category: 'gold',
      status: 'active',
      creditInfo: {
        ...customer1.creditInfo,
        creditLimit: 5000000,
        creditUtilized: 4200000,
        creditAvailable: 800000,
        averagePaymentDays: 35,
        creditRating: 'good',
      },
      salesMetrics: {
        ...customer1.salesMetrics,
        totalOrders: 78,
        totalRevenue: 18000000,
        averageOrderValue: 230769,
        yearlyTrend: [
          { year: 2022, revenue: 15000000, orders: 65 },
          { year: 2023, revenue: 18000000, orders: 78 },
        ],
      },
      contacts: [
        {
          id: uuidv4(),
          name: 'Amit Patel',
          designation: 'Managing Director',
          role: 'decision_maker',
          email: 'amit@betaeng.com',
          phone: '+91-79-23456789',
          isPrimary: true,
          preferences: { preferredContactMethod: 'phone' },
        },
      ],
      healthScore: {
        overall: 72,
        components: {
          financialHealth: 70,
          engagementScore: 75,
          satisfactionScore: 75,
          growthPotential: 70,
          riskScore: 70,
        },
        trend: 'stable',
        alerts: ['Credit utilization is high'],
        recommendations: ['Monitor payment patterns closely'],
      },
      createdAt: '2021-03-20T00:00:00Z',
      updatedAt: '2024-01-08T14:00:00Z',
    };

    this.customers.push(customer2);
  }
}
