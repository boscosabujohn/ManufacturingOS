import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'disputed' | 'written_off' | 'cancelled';
export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'upi' | 'other';
export type DunningLevel = 'reminder' | 'first_notice' | 'second_notice' | 'final_notice' | 'legal';

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  salesOrderId?: string;
  salesOrderNumber?: string;

  // Invoice Details
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;

  // Amounts
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;

  // Status
  status: InvoiceStatus;
  daysOverdue: number;
  agingBucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';

  // Collection
  lastPaymentDate?: string;
  dunningLevel?: DunningLevel;
  lastDunningDate?: string;
  collectionNotes?: string;

  // Line Items
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxRate: number;
  }>;

  // Payments
  payments: Payment[];

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Payment {
  id: string;
  paymentDate: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber?: string;
  bankAccount?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface CustomerBalance {
  customerId: string;
  customerName: string;
  creditLimit: number;
  totalOutstanding: number;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  days90Plus: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  averagePaymentDays: number;
  overdueInvoices: number;
}

export interface AgingSummary {
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  days90Plus: number;
  total: number;
  customerCount: number;
  invoiceCount: number;
}

export interface CollectionAction {
  id: string;
  invoiceId: string;
  customerId: string;
  actionType: 'phone_call' | 'email' | 'letter' | 'visit' | 'legal' | 'write_off';
  actionDate: string;
  outcome?: string;
  nextActionDate?: string;
  nextAction?: string;
  collectedAmount?: number;
  performedBy: string;
  notes?: string;
}

@Injectable()
export class AccountsReceivableService {
  private invoices: CustomerInvoice[] = [];
  private collectionActions: CollectionAction[] = [];

  constructor() {
    this.seedMockData();
  }

  async createInvoice(invoice: Partial<CustomerInvoice>): Promise<CustomerInvoice> {
    const invoiceNumber = await this.generateInvoiceNumber();

    const newInvoice: CustomerInvoice = {
      id: uuidv4(),
      invoiceNumber,
      customerId: invoice.customerId || '',
      customerName: invoice.customerName || '',
      invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invoice.dueDate || this.calculateDueDate(invoice.paymentTerms || 'Net 30'),
      paymentTerms: invoice.paymentTerms || 'Net 30',
      currency: invoice.currency || 'INR',
      subtotal: invoice.subtotal || 0,
      taxAmount: invoice.taxAmount || 0,
      discountAmount: invoice.discountAmount || 0,
      totalAmount: invoice.totalAmount || 0,
      paidAmount: 0,
      balanceDue: invoice.totalAmount || 0,
      status: 'draft',
      daysOverdue: 0,
      agingBucket: 'current',
      lineItems: invoice.lineItems || [],
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: invoice.createdBy || 'system',
    };

    this.invoices.push(newInvoice);
    return newInvoice;
  }

  async getInvoice(id: string): Promise<CustomerInvoice> {
    const invoice = this.invoices.find(i => i.id === id);
    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }
    this.updateInvoiceAging(invoice);
    return invoice;
  }

  async recordPayment(
    invoiceId: string,
    payment: Partial<Payment>
  ): Promise<CustomerInvoice> {
    const invoice = await this.getInvoice(invoiceId);

    if (invoice.status === 'paid' || invoice.status === 'cancelled') {
      throw new BadRequestException('Cannot record payment for this invoice');
    }

    const newPayment: Payment = {
      id: uuidv4(),
      paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
      amount: payment.amount || 0,
      method: payment.method || 'bank_transfer',
      referenceNumber: payment.referenceNumber,
      bankAccount: payment.bankAccount,
      notes: payment.notes,
      createdAt: new Date().toISOString(),
      createdBy: payment.createdBy || 'system',
    };

    invoice.payments.push(newPayment);
    invoice.paidAmount += newPayment.amount;
    invoice.balanceDue = invoice.totalAmount - invoice.paidAmount;
    invoice.lastPaymentDate = newPayment.paymentDate;
    invoice.updatedAt = new Date().toISOString();

    // Update status
    if (invoice.balanceDue <= 0) {
      invoice.status = 'paid';
      invoice.balanceDue = 0;
    } else if (invoice.paidAmount > 0) {
      invoice.status = 'partially_paid';
    }

    return invoice;
  }

  async getAgingSummary(asOfDate?: string): Promise<AgingSummary> {
    const date = asOfDate ? new Date(asOfDate) : new Date();
    const customerIds = new Set<string>();

    const summary: AgingSummary = {
      current: 0,
      days1to30: 0,
      days31to60: 0,
      days61to90: 0,
      days90Plus: 0,
      total: 0,
      customerCount: 0,
      invoiceCount: 0,
    };

    for (const invoice of this.invoices) {
      if (['paid', 'cancelled', 'written_off'].includes(invoice.status)) {
        continue;
      }

      this.updateInvoiceAging(invoice, date);
      customerIds.add(invoice.customerId);
      summary.invoiceCount++;

      switch (invoice.agingBucket) {
        case 'current':
          summary.current += invoice.balanceDue;
          break;
        case '1-30':
          summary.days1to30 += invoice.balanceDue;
          break;
        case '31-60':
          summary.days31to60 += invoice.balanceDue;
          break;
        case '61-90':
          summary.days61to90 += invoice.balanceDue;
          break;
        case '90+':
          summary.days90Plus += invoice.balanceDue;
          break;
      }
    }

    summary.total = summary.current + summary.days1to30 + summary.days31to60 +
      summary.days61to90 + summary.days90Plus;
    summary.customerCount = customerIds.size;

    return summary;
  }

  async getCustomerBalances(): Promise<CustomerBalance[]> {
    const customerMap = new Map<string, CustomerBalance>();

    for (const invoice of this.invoices) {
      if (['paid', 'cancelled', 'written_off'].includes(invoice.status)) {
        continue;
      }

      this.updateInvoiceAging(invoice);

      let balance = customerMap.get(invoice.customerId);
      if (!balance) {
        balance = {
          customerId: invoice.customerId,
          customerName: invoice.customerName,
          creditLimit: 5000000, // Mock
          totalOutstanding: 0,
          current: 0,
          days1to30: 0,
          days31to60: 0,
          days61to90: 0,
          days90Plus: 0,
          averagePaymentDays: 0,
          overdueInvoices: 0,
        };
        customerMap.set(invoice.customerId, balance);
      }

      balance.totalOutstanding += invoice.balanceDue;

      switch (invoice.agingBucket) {
        case 'current':
          balance.current += invoice.balanceDue;
          break;
        case '1-30':
          balance.days1to30 += invoice.balanceDue;
          balance.overdueInvoices++;
          break;
        case '31-60':
          balance.days31to60 += invoice.balanceDue;
          balance.overdueInvoices++;
          break;
        case '61-90':
          balance.days61to90 += invoice.balanceDue;
          balance.overdueInvoices++;
          break;
        case '90+':
          balance.days90Plus += invoice.balanceDue;
          balance.overdueInvoices++;
          break;
      }

      if (invoice.lastPaymentDate) {
        if (!balance.lastPaymentDate || invoice.lastPaymentDate > balance.lastPaymentDate) {
          balance.lastPaymentDate = invoice.lastPaymentDate;
          balance.lastPaymentAmount = invoice.payments[invoice.payments.length - 1]?.amount;
        }
      }
    }

    return Array.from(customerMap.values())
      .sort((a, b) => b.totalOutstanding - a.totalOutstanding);
  }

  async getCustomerStatement(
    customerId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    customer: { id: string; name: string };
    openingBalance: number;
    transactions: Array<{
      date: string;
      type: 'invoice' | 'payment';
      reference: string;
      debit: number;
      credit: number;
      balance: number;
    }>;
    closingBalance: number;
  }> {
    const customerInvoices = this.invoices.filter(i =>
      i.customerId === customerId &&
      i.invoiceDate >= startDate &&
      i.invoiceDate <= endDate
    );

    const transactions: Array<{
      date: string;
      type: 'invoice' | 'payment';
      reference: string;
      debit: number;
      credit: number;
      balance: number;
    }> = [];

    let runningBalance = 0; // Would normally get opening balance from before start date

    for (const invoice of customerInvoices) {
      // Add invoice
      runningBalance += invoice.totalAmount;
      transactions.push({
        date: invoice.invoiceDate,
        type: 'invoice',
        reference: invoice.invoiceNumber,
        debit: invoice.totalAmount,
        credit: 0,
        balance: runningBalance,
      });

      // Add payments
      for (const payment of invoice.payments) {
        if (payment.paymentDate >= startDate && payment.paymentDate <= endDate) {
          runningBalance -= payment.amount;
          transactions.push({
            date: payment.paymentDate,
            type: 'payment',
            reference: payment.referenceNumber || payment.id,
            debit: 0,
            credit: payment.amount,
            balance: runningBalance,
          });
        }
      }
    }

    // Sort by date
    transactions.sort((a, b) => a.date.localeCompare(b.date));

    return {
      customer: {
        id: customerId,
        name: customerInvoices[0]?.customerName || 'Unknown',
      },
      openingBalance: 0,
      transactions,
      closingBalance: runningBalance,
    };
  }

  async recordCollectionAction(action: Partial<CollectionAction>): Promise<CollectionAction> {
    const newAction: CollectionAction = {
      id: uuidv4(),
      invoiceId: action.invoiceId || '',
      customerId: action.customerId || '',
      actionType: action.actionType || 'phone_call',
      actionDate: action.actionDate || new Date().toISOString().split('T')[0],
      outcome: action.outcome,
      nextActionDate: action.nextActionDate,
      nextAction: action.nextAction,
      collectedAmount: action.collectedAmount,
      performedBy: action.performedBy || '',
      notes: action.notes,
    };

    this.collectionActions.push(newAction);

    // Update invoice dunning level if applicable
    if (action.invoiceId) {
      const invoice = this.invoices.find(i => i.id === action.invoiceId);
      if (invoice) {
        invoice.lastDunningDate = newAction.actionDate;
        invoice.collectionNotes = action.notes;
      }
    }

    return newAction;
  }

  async getOverdueInvoices(): Promise<CustomerInvoice[]> {
    return this.invoices.filter(i => {
      this.updateInvoiceAging(i);
      return i.daysOverdue > 0 && !['paid', 'cancelled', 'written_off'].includes(i.status);
    }).sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  async getDunningQueue(): Promise<Array<{
    invoice: CustomerInvoice;
    suggestedAction: DunningLevel;
    daysSinceLastAction: number;
  }>> {
    const overdueInvoices = await this.getOverdueInvoices();
    const queue: Array<{
      invoice: CustomerInvoice;
      suggestedAction: DunningLevel;
      daysSinceLastAction: number;
    }> = [];

    for (const invoice of overdueInvoices) {
      const daysSinceLastAction = invoice.lastDunningDate
        ? Math.floor((Date.now() - new Date(invoice.lastDunningDate).getTime()) / (1000 * 60 * 60 * 24))
        : invoice.daysOverdue;

      let suggestedAction: DunningLevel = 'reminder';
      if (invoice.daysOverdue > 90) {
        suggestedAction = 'legal';
      } else if (invoice.daysOverdue > 60) {
        suggestedAction = 'final_notice';
      } else if (invoice.daysOverdue > 30) {
        suggestedAction = 'second_notice';
      } else if (invoice.daysOverdue > 15) {
        suggestedAction = 'first_notice';
      }

      if (daysSinceLastAction >= 7) { // At least 7 days since last action
        queue.push({
          invoice,
          suggestedAction,
          daysSinceLastAction,
        });
      }
    }

    return queue.sort((a, b) => b.invoice.daysOverdue - a.invoice.daysOverdue);
  }

  async writeOffInvoice(
    invoiceId: string,
    reason: string,
    authorizedBy: string
  ): Promise<CustomerInvoice> {
    const invoice = await this.getInvoice(invoiceId);

    invoice.status = 'written_off';
    invoice.collectionNotes = `Written off: ${reason}. Authorized by: ${authorizedBy}`;
    invoice.updatedAt = new Date().toISOString();

    return invoice;
  }

  async getStatistics(): Promise<{
    totalReceivables: number;
    totalOverdue: number;
    overduePercentage: number;
    averageDaysOutstanding: number;
    collectionEfficiency: number;
    topOverdueCustomers: Array<{ customerId: string; customerName: string; amount: number }>;
    agingDistribution: AgingSummary;
  }> {
    const aging = await this.getAgingSummary();
    const overdueAmount = aging.days1to30 + aging.days31to60 + aging.days61to90 + aging.days90Plus;

    const customerBalances = await this.getCustomerBalances();
    const topOverdue = customerBalances
      .filter(c => c.totalOutstanding - c.current > 0)
      .slice(0, 5)
      .map(c => ({
        customerId: c.customerId,
        customerName: c.customerName,
        amount: c.totalOutstanding - c.current,
      }));

    // Calculate average days outstanding
    let totalDaysOutstanding = 0;
    let invoiceCount = 0;
    for (const invoice of this.invoices) {
      if (!['paid', 'cancelled', 'written_off'].includes(invoice.status)) {
        this.updateInvoiceAging(invoice);
        totalDaysOutstanding += Math.max(0, invoice.daysOverdue);
        invoiceCount++;
      }
    }

    return {
      totalReceivables: aging.total,
      totalOverdue: overdueAmount,
      overduePercentage: aging.total > 0 ? Math.round((overdueAmount / aging.total) * 100) : 0,
      averageDaysOutstanding: invoiceCount > 0 ? Math.round(totalDaysOutstanding / invoiceCount) : 0,
      collectionEfficiency: 85, // Mock - would calculate from collected vs billed
      topOverdueCustomers: topOverdue,
      agingDistribution: aging,
    };
  }

  private updateInvoiceAging(invoice: CustomerInvoice, asOfDate?: Date): void {
    const date = asOfDate || new Date();
    const dueDate = new Date(invoice.dueDate);
    const diffDays = Math.floor((date.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    invoice.daysOverdue = Math.max(0, diffDays);

    if (diffDays <= 0) {
      invoice.agingBucket = 'current';
      if (invoice.status !== 'paid' && invoice.status !== 'partially_paid') {
        invoice.status = 'sent';
      }
    } else if (diffDays <= 30) {
      invoice.agingBucket = '1-30';
      if (invoice.status !== 'paid' && invoice.status !== 'partially_paid') {
        invoice.status = 'overdue';
      }
    } else if (diffDays <= 60) {
      invoice.agingBucket = '31-60';
      invoice.status = invoice.status === 'paid' ? 'paid' : 'overdue';
    } else if (diffDays <= 90) {
      invoice.agingBucket = '61-90';
      invoice.status = invoice.status === 'paid' ? 'paid' : 'overdue';
    } else {
      invoice.agingBucket = '90+';
      invoice.status = invoice.status === 'paid' ? 'paid' : 'overdue';
    }
  }

  private calculateDueDate(paymentTerms: string): string {
    const date = new Date();
    const match = paymentTerms.match(/Net\s+(\d+)/i);
    const days = match ? parseInt(match[1]) : 30;
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.invoices.length + 1).padStart(5, '0');
    return `INV-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    const customers = [
      { id: 'cust-001', name: 'Acme Manufacturing' },
      { id: 'cust-002', name: 'Beta Industries' },
      { id: 'cust-003', name: 'Gamma Corp' },
    ];

    // Create invoices with varying ages
    const today = new Date();

    // Current invoice
    this.createInvoice({
      customerId: 'cust-001',
      customerName: 'Acme Manufacturing',
      invoiceDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: 500000,
      lineItems: [{ description: 'Product A', quantity: 10, unitPrice: 50000, amount: 500000, taxRate: 18 }],
    });

    // 30 days overdue
    this.createInvoice({
      customerId: 'cust-002',
      customerName: 'Beta Industries',
      invoiceDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: 750000,
      lineItems: [{ description: 'Product B', quantity: 15, unitPrice: 50000, amount: 750000, taxRate: 18 }],
    });

    // 60 days overdue
    this.createInvoice({
      customerId: 'cust-003',
      customerName: 'Gamma Corp',
      invoiceDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: 1200000,
      lineItems: [{ description: 'Product C', quantity: 20, unitPrice: 60000, amount: 1200000, taxRate: 18 }],
    });
  }
}
