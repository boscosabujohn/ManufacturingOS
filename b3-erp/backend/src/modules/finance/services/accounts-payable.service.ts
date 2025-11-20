import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type BillStatus = 'draft' | 'pending_approval' | 'approved' | 'partially_paid' | 'paid' | 'overdue' | 'disputed' | 'cancelled';
export type PaymentPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface VendorBill {
  id: string;
  billNumber: string;
  vendorBillNumber: string; // Vendor's invoice number
  vendorId: string;
  vendorName: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  goodsReceiptId?: string;

  // Bill Details
  billDate: string;
  receivedDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;

  // Amounts
  subtotal: number;
  taxAmount: number;
  tdsAmount: number; // Tax Deducted at Source
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;

  // Early Payment Discount
  earlyPaymentDiscount?: {
    discountPercentage: number;
    discountAmount: number;
    discountDeadline: string;
  };

  // Status
  status: BillStatus;
  paymentPriority: PaymentPriority;
  daysOverdue: number;
  agingBucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';

  // Three-way match
  matchStatus: 'not_matched' | 'partial_match' | 'matched' | 'discrepancy';
  matchingNotes?: string;

  // Line Items
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxCode: string;
    costCenter?: string;
    glAccount?: string;
  }>;

  // Payments
  payments: VendorPayment[];

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface VendorPayment {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'check' | 'bank_transfer' | 'rtgs' | 'neft' | 'upi' | 'other';
  referenceNumber: string;
  bankAccount: string;
  tdsDeducted?: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface VendorLedger {
  vendorId: string;
  vendorName: string;
  creditLimit: number;
  currentBalance: number;
  totalPurchases: number;
  totalPayments: number;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  days90Plus: number;
  overdueAmount: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  averagePaymentDays: number;
  pendingBills: number;
}

export interface PaymentSchedule {
  id: string;
  vendorId: string;
  vendorName: string;
  billId: string;
  billNumber: string;
  dueDate: string;
  amount: number;
  priority: PaymentPriority;
  status: 'scheduled' | 'approved' | 'processed' | 'failed';
  paymentMethod?: string;
  bankAccount?: string;
  scheduledBy: string;
  scheduledAt: string;
}

export interface CashRequirement {
  date: string;
  totalDue: number;
  urgentPayments: number;
  highPriorityPayments: number;
  normalPayments: number;
  bills: Array<{ billId: string; billNumber: string; vendorName: string; amount: number; priority: PaymentPriority }>;
}

@Injectable()
export class AccountsPayableService {
  private bills: VendorBill[] = [];
  private paymentSchedules: PaymentSchedule[] = [];

  constructor() {
    this.seedMockData();
  }

  async createBill(bill: Partial<VendorBill>): Promise<VendorBill> {
    const billNumber = await this.generateBillNumber();

    const newBill: VendorBill = {
      id: uuidv4(),
      billNumber,
      vendorBillNumber: bill.vendorBillNumber || '',
      vendorId: bill.vendorId || '',
      vendorName: bill.vendorName || '',
      purchaseOrderId: bill.purchaseOrderId,
      purchaseOrderNumber: bill.purchaseOrderNumber,
      billDate: bill.billDate || new Date().toISOString().split('T')[0],
      receivedDate: bill.receivedDate || new Date().toISOString().split('T')[0],
      dueDate: bill.dueDate || this.calculateDueDate(bill.paymentTerms || 'Net 30'),
      paymentTerms: bill.paymentTerms || 'Net 30',
      currency: bill.currency || 'INR',
      subtotal: bill.subtotal || 0,
      taxAmount: bill.taxAmount || 0,
      tdsAmount: bill.tdsAmount || 0,
      discountAmount: bill.discountAmount || 0,
      totalAmount: bill.totalAmount || 0,
      paidAmount: 0,
      balanceDue: bill.totalAmount || 0,
      status: 'draft',
      paymentPriority: bill.paymentPriority || 'normal',
      daysOverdue: 0,
      agingBucket: 'current',
      matchStatus: 'not_matched',
      lineItems: bill.lineItems || [],
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: bill.createdBy || 'system',
    };

    // Calculate early payment discount if applicable
    if (bill.paymentTerms?.includes('2/10')) {
      const discountDeadline = new Date(newBill.billDate);
      discountDeadline.setDate(discountDeadline.getDate() + 10);
      newBill.earlyPaymentDiscount = {
        discountPercentage: 2,
        discountAmount: Math.round(newBill.totalAmount * 0.02),
        discountDeadline: discountDeadline.toISOString().split('T')[0],
      };
    }

    this.bills.push(newBill);
    return newBill;
  }

  async getBill(id: string): Promise<VendorBill> {
    const bill = this.bills.find(b => b.id === id);
    if (!bill) {
      throw new NotFoundException(`Bill ${id} not found`);
    }
    this.updateBillAging(bill);
    return bill;
  }

  async approveBill(id: string, approvedBy: string): Promise<VendorBill> {
    const bill = await this.getBill(id);

    if (bill.status !== 'pending_approval' && bill.status !== 'draft') {
      throw new BadRequestException('Bill cannot be approved in current status');
    }

    bill.status = 'approved';
    bill.approvedBy = approvedBy;
    bill.approvedAt = new Date().toISOString();
    bill.updatedAt = new Date().toISOString();

    return bill;
  }

  async recordPayment(
    billId: string,
    payment: Partial<VendorPayment>
  ): Promise<VendorBill> {
    const bill = await this.getBill(billId);

    if (['paid', 'cancelled'].includes(bill.status)) {
      throw new BadRequestException('Cannot record payment for this bill');
    }

    const newPayment: VendorPayment = {
      id: uuidv4(),
      paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
      amount: payment.amount || 0,
      paymentMethod: payment.paymentMethod || 'bank_transfer',
      referenceNumber: payment.referenceNumber || '',
      bankAccount: payment.bankAccount || '',
      tdsDeducted: payment.tdsDeducted,
      notes: payment.notes,
      createdAt: new Date().toISOString(),
      createdBy: payment.createdBy || 'system',
    };

    bill.payments.push(newPayment);
    bill.paidAmount += newPayment.amount;
    bill.balanceDue = bill.totalAmount - bill.paidAmount - (bill.tdsAmount || 0);
    bill.updatedAt = new Date().toISOString();

    // Update status
    if (bill.balanceDue <= 0) {
      bill.status = 'paid';
      bill.balanceDue = 0;
    } else if (bill.paidAmount > 0) {
      bill.status = 'partially_paid';
    }

    return bill;
  }

  async getVendorLedger(vendorId: string): Promise<VendorLedger> {
    const vendorBills = this.bills.filter(b => b.vendorId === vendorId);

    let totalPurchases = 0;
    let totalPayments = 0;
    let current = 0;
    let days1to30 = 0;
    let days31to60 = 0;
    let days61to90 = 0;
    let days90Plus = 0;
    let lastPaymentDate: string | undefined;
    let lastPaymentAmount: number | undefined;
    let totalPaymentDays = 0;
    let paidBillCount = 0;
    let pendingBills = 0;

    for (const bill of vendorBills) {
      this.updateBillAging(bill);
      totalPurchases += bill.totalAmount;
      totalPayments += bill.paidAmount;

      if (!['paid', 'cancelled'].includes(bill.status)) {
        pendingBills++;
        switch (bill.agingBucket) {
          case 'current':
            current += bill.balanceDue;
            break;
          case '1-30':
            days1to30 += bill.balanceDue;
            break;
          case '31-60':
            days31to60 += bill.balanceDue;
            break;
          case '61-90':
            days61to90 += bill.balanceDue;
            break;
          case '90+':
            days90Plus += bill.balanceDue;
            break;
        }
      }

      // Track last payment
      if (bill.payments.length > 0) {
        const lastBillPayment = bill.payments[bill.payments.length - 1];
        if (!lastPaymentDate || lastBillPayment.paymentDate > lastPaymentDate) {
          lastPaymentDate = lastBillPayment.paymentDate;
          lastPaymentAmount = lastBillPayment.amount;
        }

        // Calculate average payment days for paid bills
        if (bill.status === 'paid') {
          const paymentDate = new Date(lastBillPayment.paymentDate);
          const dueDate = new Date(bill.dueDate);
          const daysDiff = Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          totalPaymentDays += daysDiff;
          paidBillCount++;
        }
      }
    }

    return {
      vendorId,
      vendorName: vendorBills[0]?.vendorName || 'Unknown',
      creditLimit: 10000000, // Mock
      currentBalance: current + days1to30 + days31to60 + days61to90 + days90Plus,
      totalPurchases,
      totalPayments,
      current,
      days1to30,
      days31to60,
      days61to90,
      days90Plus,
      overdueAmount: days1to30 + days31to60 + days61to90 + days90Plus,
      lastPaymentDate,
      lastPaymentAmount,
      averagePaymentDays: paidBillCount > 0 ? Math.round(totalPaymentDays / paidBillCount) : 0,
      pendingBills,
    };
  }

  async getAgingSummary(): Promise<{
    current: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    days90Plus: number;
    total: number;
    vendorCount: number;
    billCount: number;
  }> {
    const vendorIds = new Set<string>();
    const summary = {
      current: 0,
      days1to30: 0,
      days31to60: 0,
      days61to90: 0,
      days90Plus: 0,
      total: 0,
      vendorCount: 0,
      billCount: 0,
    };

    for (const bill of this.bills) {
      if (['paid', 'cancelled'].includes(bill.status)) {
        continue;
      }

      this.updateBillAging(bill);
      vendorIds.add(bill.vendorId);
      summary.billCount++;

      switch (bill.agingBucket) {
        case 'current':
          summary.current += bill.balanceDue;
          break;
        case '1-30':
          summary.days1to30 += bill.balanceDue;
          break;
        case '31-60':
          summary.days31to60 += bill.balanceDue;
          break;
        case '61-90':
          summary.days61to90 += bill.balanceDue;
          break;
        case '90+':
          summary.days90Plus += bill.balanceDue;
          break;
      }
    }

    summary.total = summary.current + summary.days1to30 + summary.days31to60 +
      summary.days61to90 + summary.days90Plus;
    summary.vendorCount = vendorIds.size;

    return summary;
  }

  async getCashRequirements(days: number = 30): Promise<CashRequirement[]> {
    const requirements: Map<string, CashRequirement> = new Map();
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    for (const bill of this.bills) {
      if (['paid', 'cancelled'].includes(bill.status)) {
        continue;
      }

      const dueDate = new Date(bill.dueDate);
      if (dueDate > endDate) {
        continue;
      }

      const dateKey = bill.dueDate;
      let requirement = requirements.get(dateKey);

      if (!requirement) {
        requirement = {
          date: dateKey,
          totalDue: 0,
          urgentPayments: 0,
          highPriorityPayments: 0,
          normalPayments: 0,
          bills: [],
        };
        requirements.set(dateKey, requirement);
      }

      requirement.totalDue += bill.balanceDue;
      requirement.bills.push({
        billId: bill.id,
        billNumber: bill.billNumber,
        vendorName: bill.vendorName,
        amount: bill.balanceDue,
        priority: bill.paymentPriority,
      });

      switch (bill.paymentPriority) {
        case 'urgent':
          requirement.urgentPayments += bill.balanceDue;
          break;
        case 'high':
          requirement.highPriorityPayments += bill.balanceDue;
          break;
        default:
          requirement.normalPayments += bill.balanceDue;
      }
    }

    return Array.from(requirements.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async schedulePayment(schedule: Partial<PaymentSchedule>): Promise<PaymentSchedule> {
    const newSchedule: PaymentSchedule = {
      id: uuidv4(),
      vendorId: schedule.vendorId || '',
      vendorName: schedule.vendorName || '',
      billId: schedule.billId || '',
      billNumber: schedule.billNumber || '',
      dueDate: schedule.dueDate || '',
      amount: schedule.amount || 0,
      priority: schedule.priority || 'normal',
      status: 'scheduled',
      paymentMethod: schedule.paymentMethod,
      bankAccount: schedule.bankAccount,
      scheduledBy: schedule.scheduledBy || 'system',
      scheduledAt: new Date().toISOString(),
    };

    this.paymentSchedules.push(newSchedule);
    return newSchedule;
  }

  async getEarlyPaymentOpportunities(): Promise<Array<{
    bill: VendorBill;
    savingsAmount: number;
    daysUntilDeadline: number;
  }>> {
    const opportunities: Array<{
      bill: VendorBill;
      savingsAmount: number;
      daysUntilDeadline: number;
    }> = [];

    const today = new Date();

    for (const bill of this.bills) {
      if (!['approved', 'pending_approval'].includes(bill.status)) {
        continue;
      }

      if (bill.earlyPaymentDiscount) {
        const deadline = new Date(bill.earlyPaymentDiscount.discountDeadline);
        const daysUntilDeadline = Math.floor(
          (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilDeadline > 0) {
          opportunities.push({
            bill,
            savingsAmount: bill.earlyPaymentDiscount.discountAmount,
            daysUntilDeadline,
          });
        }
      }
    }

    return opportunities.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
  }

  async getVendorStatement(
    vendorId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    vendor: { id: string; name: string };
    openingBalance: number;
    transactions: Array<{
      date: string;
      type: 'bill' | 'payment' | 'debit_note' | 'credit_note';
      reference: string;
      debit: number;
      credit: number;
      balance: number;
    }>;
    closingBalance: number;
  }> {
    const vendorBills = this.bills.filter(b =>
      b.vendorId === vendorId &&
      b.billDate >= startDate &&
      b.billDate <= endDate
    );

    const transactions: Array<{
      date: string;
      type: 'bill' | 'payment' | 'debit_note' | 'credit_note';
      reference: string;
      debit: number;
      credit: number;
      balance: number;
    }> = [];

    let runningBalance = 0;

    for (const bill of vendorBills) {
      // Add bill
      runningBalance += bill.totalAmount;
      transactions.push({
        date: bill.billDate,
        type: 'bill',
        reference: bill.vendorBillNumber,
        debit: bill.totalAmount,
        credit: 0,
        balance: runningBalance,
      });

      // Add payments
      for (const payment of bill.payments) {
        if (payment.paymentDate >= startDate && payment.paymentDate <= endDate) {
          runningBalance -= payment.amount;
          transactions.push({
            date: payment.paymentDate,
            type: 'payment',
            reference: payment.referenceNumber,
            debit: 0,
            credit: payment.amount,
            balance: runningBalance,
          });
        }
      }
    }

    transactions.sort((a, b) => a.date.localeCompare(b.date));

    return {
      vendor: {
        id: vendorId,
        name: vendorBills[0]?.vendorName || 'Unknown',
      },
      openingBalance: 0,
      transactions,
      closingBalance: runningBalance,
    };
  }

  async getStatistics(): Promise<{
    totalPayables: number;
    totalOverdue: number;
    overduePercentage: number;
    averageDaysOutstanding: number;
    upcomingPayments7Days: number;
    upcomingPayments30Days: number;
    earlyPaymentSavings: number;
    topVendorsByPayables: Array<{ vendorId: string; vendorName: string; amount: number }>;
  }> {
    const aging = await this.getAgingSummary();
    const overdueAmount = aging.days1to30 + aging.days31to60 + aging.days61to90 + aging.days90Plus;

    // Group by vendor
    const vendorPayables = new Map<string, { name: string; amount: number }>();
    for (const bill of this.bills) {
      if (['paid', 'cancelled'].includes(bill.status)) continue;

      const existing = vendorPayables.get(bill.vendorId) || { name: bill.vendorName, amount: 0 };
      existing.amount += bill.balanceDue;
      vendorPayables.set(bill.vendorId, existing);
    }

    const topVendors = Array.from(vendorPayables.entries())
      .map(([id, data]) => ({ vendorId: id, vendorName: data.name, amount: data.amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Calculate upcoming payments
    const today = new Date();
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);

    let upcoming7 = 0;
    let upcoming30 = 0;

    for (const bill of this.bills) {
      if (['paid', 'cancelled'].includes(bill.status)) continue;
      const dueDate = new Date(bill.dueDate);
      if (dueDate <= in7Days) upcoming7 += bill.balanceDue;
      if (dueDate <= in30Days) upcoming30 += bill.balanceDue;
    }

    // Early payment savings
    const opportunities = await this.getEarlyPaymentOpportunities();
    const earlyPaymentSavings = opportunities.reduce((sum, o) => sum + o.savingsAmount, 0);

    return {
      totalPayables: aging.total,
      totalOverdue: overdueAmount,
      overduePercentage: aging.total > 0 ? Math.round((overdueAmount / aging.total) * 100) : 0,
      averageDaysOutstanding: 25, // Mock
      upcomingPayments7Days: upcoming7,
      upcomingPayments30Days: upcoming30,
      earlyPaymentSavings,
      topVendorsByPayables: topVendors,
    };
  }

  private updateBillAging(bill: VendorBill): void {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    bill.daysOverdue = Math.max(0, diffDays);

    if (diffDays <= 0) {
      bill.agingBucket = 'current';
    } else if (diffDays <= 30) {
      bill.agingBucket = '1-30';
      if (!['paid', 'partially_paid'].includes(bill.status)) {
        bill.status = 'overdue';
      }
    } else if (diffDays <= 60) {
      bill.agingBucket = '31-60';
    } else if (diffDays <= 90) {
      bill.agingBucket = '61-90';
    } else {
      bill.agingBucket = '90+';
    }
  }

  private calculateDueDate(paymentTerms: string): string {
    const date = new Date();
    const match = paymentTerms.match(/Net\s+(\d+)/i);
    const days = match ? parseInt(match[1]) : 30;
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private async generateBillNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.bills.length + 1).padStart(5, '0');
    return `BILL-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    const vendors = [
      { id: 'vendor-001', name: 'Alpha Suppliers' },
      { id: 'vendor-002', name: 'Beta Industries' },
      { id: 'vendor-003', name: 'Gamma Corp' },
    ];

    const today = new Date();

    // Current bill
    this.createBill({
      vendorId: 'vendor-001',
      vendorName: 'Alpha Suppliers',
      vendorBillNumber: 'VS-2024-001',
      purchaseOrderNumber: 'PO-202401-001',
      billDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentTerms: '2/10 Net 30',
      totalAmount: 850000,
      taxAmount: 153000,
      paymentPriority: 'normal',
      lineItems: [
        { description: 'Raw Material A', quantity: 100, unitPrice: 8500, amount: 850000, taxCode: 'GST18', costCenter: 'PROD' },
      ],
    });

    // Overdue bill
    this.createBill({
      vendorId: 'vendor-002',
      vendorName: 'Beta Industries',
      vendorBillNumber: 'BI-2024-045',
      billDate: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: 1200000,
      taxAmount: 216000,
      paymentPriority: 'high',
      lineItems: [
        { description: 'Components', quantity: 200, unitPrice: 6000, amount: 1200000, taxCode: 'GST18', costCenter: 'PROD' },
      ],
    });
  }
}
