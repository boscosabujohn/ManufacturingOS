import { Injectable } from '@nestjs/common';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { UpdateServiceInvoiceDto } from '../dto/update-service-invoice.dto';
import {
  ServiceInvoice,
  InvoiceStatus,
  PaymentCollection,
} from '../entities/service-billing.entity';

@Injectable()
export class ServiceBillingService {
  private invoices: ServiceInvoice[] = [];
  private payments: PaymentCollection[] = [];
  private invoiceIdCounter = 1;
  private paymentIdCounter = 1;

  createInvoice(createServiceInvoiceDto: CreateServiceInvoiceDto): ServiceInvoice {
    const invoice: ServiceInvoice = {
      id: `INV-${String(this.invoiceIdCounter++).padStart(6, '0')}`,
      invoiceNumber: `SI-${new Date().getFullYear()}-${String(this.invoiceIdCounter).padStart(5, '0')}`,
      status: InvoiceStatus.DRAFT,
      ...createServiceInvoiceDto,
      lineItems: createServiceInvoiceDto.lineItems.map(item => ({
        ...item,
        itemType: item.itemType as any,
        amount: item.quantity * item.unitPrice,
        taxable: true,
      })),
      invoiceDate: new Date(),
      paidAmount: 0,
      balanceAmount: createServiceInvoiceDto.totalAmount,
      paymentStatus: 'unpaid',
      isOverdue: false,
      billingAddress: 'Unknown', // Should come from customer or DTO
      serviceDate: new Date(),
      serviceDescription: 'Service Invoice',
      laborCharges: 0,
      partsCharges: 0,
      travelCharges: 0,
      emergencyCharges: 0,
      otherCharges: 0,
      subtotal: createServiceInvoiceDto.totalAmount, // Assuming totalAmount is subtotal for now, or calculate
      taxableAmount: createServiceInvoiceDto.totalAmount,
      totalTaxAmount: 0,
      grandTotal: createServiceInvoiceDto.totalAmount,
      underContract: false,
      underWarranty: false,
      warrantyCovered: 0,
      customerPayable: createServiceInvoiceDto.totalAmount,
      amountPaid: 0,
      amountDue: createServiceInvoiceDto.totalAmount,
      approvalRequired: false,
      sentToCustomer: false,
      serviceReportAttached: false,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.invoices.push(invoice);
    return invoice;
  }

  findAllInvoices(filters?: {
    status?: string;
    customerId?: string;
    invoiceType?: string;
  }): ServiceInvoice[] {
    let filtered = [...this.invoices];

    if (filters?.status) {
      filtered = filtered.filter((i) => i.status === filters.status);
    }
    if (filters?.customerId) {
      filtered = filtered.filter((i) => i.customerId === filters.customerId);
    }
    if (filters?.invoiceType) {
      filtered = filtered.filter((i) => i.invoiceType === filters.invoiceType);
    }

    // Update overdue status
    filtered.forEach((invoice) => this.checkAndUpdateOverdue(invoice));

    return filtered;
  }

  findOneInvoice(id: string): ServiceInvoice | null {
    const invoice = this.invoices.find((i) => i.id === id) || null;
    if (invoice) {
      this.checkAndUpdateOverdue(invoice);
    }
    return invoice;
  }

  updateInvoice(
    id: string,
    updateServiceInvoiceDto: UpdateServiceInvoiceDto,
  ): ServiceInvoice | null {
    const index = this.invoices.findIndex((i) => i.id === id);
    if (index === -1) return null;

    this.invoices[index] = {
      ...this.invoices[index],
      ...updateServiceInvoiceDto,
      updatedAt: new Date(),
    };

    return this.invoices[index];
  }

  sendInvoice(id: string, sentBy: string): ServiceInvoice | null {
    const invoice = this.findOneInvoice(id);
    if (!invoice) return null;

    invoice.status = InvoiceStatus.SENT;
    invoice.sentDate = new Date();
    invoice.sentBy = sentBy;
    invoice.updatedAt = new Date();

    return invoice;
  }

  recordPayment(
    id: string,
    paymentData: {
      amount: number;
      paymentMethod: string;
      paymentReference?: string;
      paymentDate: Date;
      notes?: string;
      recordedBy: string;
    },
  ): PaymentCollection {
    const invoice = this.findOneInvoice(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const payment: PaymentCollection = {
      id: `PAY-${String(this.paymentIdCounter++).padStart(6, '0')}`,
      paymentNumber: `PMT-${new Date().getFullYear()}-${String(this.paymentIdCounter).padStart(6, '0')}`,
      invoiceId: id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      ...paymentData,
      invoiceType: invoice.invoiceType,
      paymentMode: paymentData.paymentMethod,
      allocatedToInvoice: paymentData.amount,
      reconciled: false,
      receiptGenerated: false,
      receiptSent: false,
      collectedBy: paymentData.recordedBy,
      enteredBy: paymentData.recordedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.payments.push(payment);

    // Update invoice payment status
    invoice.paidAmount += paymentData.amount;
    invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;

    if (invoice.balanceAmount <= 0) {
      invoice.status = InvoiceStatus.PAID;
      invoice.paymentStatus = 'paid';
      invoice.paidDate = paymentData.paymentDate;
    } else if (invoice.paidAmount > 0) {
      invoice.status = InvoiceStatus.PARTIALLY_PAID;
      invoice.paymentStatus = 'partial';
    }

    invoice.updatedAt = new Date();

    return payment;
  }

  voidInvoice(id: string, reason: string, voidedBy: string): ServiceInvoice | null {
    const invoice = this.findOneInvoice(id);
    if (!invoice) return null;

    invoice.status = InvoiceStatus.VOID;
    invoice.voidDate = new Date();
    invoice.voidReason = reason;
    invoice.updatedBy = voidedBy;
    invoice.updatedAt = new Date();

    return invoice;
  }

  writeOffInvoice(
    id: string,
    reason: string,
    approvedBy: string,
  ): ServiceInvoice | null {
    const invoice = this.findOneInvoice(id);
    if (!invoice) return null;

    invoice.status = InvoiceStatus.WRITTEN_OFF;
    invoice.writeOffDate = new Date();
    invoice.writeOffReason = reason;
    invoice.writeOffApprovedBy = approvedBy;
    invoice.updatedAt = new Date();

    return invoice;
  }

  getOverdueInvoices(): ServiceInvoice[] {
    const now = new Date();
    return this.invoices.filter((invoice) => {
      return (
        [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID].includes(invoice.status) &&
        invoice.dueDate < now &&
        invoice.balanceAmount > 0
      );
    });
  }

  private checkAndUpdateOverdue(invoice: ServiceInvoice): void {
    const now = new Date();
    if (
      [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID].includes(invoice.status) &&
      invoice.dueDate < now &&
      invoice.balanceAmount > 0
    ) {
      invoice.isOverdue = true;

      // Calculate overdue days
      const daysDiff = Math.floor(
        (now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      invoice.overdueDays = daysDiff;
    }
  }

  generateAMCInvoices(month: number, year: number, generatedBy: string): ServiceInvoice[] {
    // This would typically fetch active AMC contracts and generate invoices
    // For now, returning empty array as this requires integration with ServiceContractsService
    // In a real implementation, this would:
    // 1. Fetch all active AMC contracts with billing frequency matching the month
    // 2. Generate invoices for each contract
    // 3. Return the generated invoices

    const generatedInvoices: ServiceInvoice[] = [];

    // TODO: Integrate with ServiceContractsService to fetch active contracts
    // and generate invoices based on billing frequency

    return generatedInvoices;
  }

  getRevenueSummary(startDate?: Date, endDate?: Date) {
    let filtered = [...this.invoices];

    if (startDate) {
      filtered = filtered.filter((i) => i.invoiceDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((i) => i.invoiceDate <= endDate);
    }

    const totalInvoiced = filtered.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalCollected = filtered.reduce((sum, i) => sum + i.paidAmount, 0);
    const totalOutstanding = filtered.reduce((sum, i) => sum + i.balanceAmount, 0);

    const paidInvoices = filtered.filter(
      (i) => i.status === InvoiceStatus.PAID,
    ).length;
    const overdueInvoices = filtered.filter((i) => i.isOverdue).length;

    return {
      totalInvoices: filtered.length,
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      paidInvoices,
      overdueInvoices,
      collectionRate: totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0,
    };
  }

  getRevenueByType(startDate?: Date, endDate?: Date) {
    let filtered = [...this.invoices];

    if (startDate) {
      filtered = filtered.filter((i) => i.invoiceDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((i) => i.invoiceDate <= endDate);
    }

    const revenueByType: Record<string, { count: number; amount: number }> = {};

    filtered.forEach((invoice) => {
      if (!revenueByType[invoice.invoiceType]) {
        revenueByType[invoice.invoiceType] = { count: 0, amount: 0 };
      }
      revenueByType[invoice.invoiceType].count += 1;
      revenueByType[invoice.invoiceType].amount += invoice.totalAmount;
    });

    return revenueByType;
  }

  getPaymentHistory(
    customerId?: string,
    startDate?: Date,
    endDate?: Date,
  ): PaymentCollection[] {
    let filtered = [...this.payments];

    if (customerId) {
      filtered = filtered.filter((p) => p.customerId === customerId);
    }
    if (startDate) {
      filtered = filtered.filter((p) => p.paymentDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((p) => p.paymentDate <= endDate);
    }

    return filtered.sort(
      (a, b) => b.paymentDate.getTime() - a.paymentDate.getTime(),
    );
  }

  getStatistics() {
    const total = this.invoices.length;
    const draft = this.invoices.filter((i) => i.status === InvoiceStatus.DRAFT).length;
    const sent = this.invoices.filter((i) => i.status === InvoiceStatus.SENT).length;
    const paid = this.invoices.filter((i) => i.status === InvoiceStatus.PAID).length;
    const overdue = this.getOverdueInvoices().length;

    const totalInvoiced = this.invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalCollected = this.invoices.reduce((sum, i) => sum + i.paidAmount, 0);
    const totalOutstanding = this.invoices.reduce(
      (sum, i) => sum + i.balanceAmount,
      0,
    );

    return {
      totalInvoices: total,
      draftInvoices: draft,
      sentInvoices: sent,
      paidInvoices: paid,
      overdueInvoices: overdue,
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      collectionRate: totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0,
      totalPayments: this.payments.length,
    };
  }

  removeInvoice(id: string): { message: string } {
    const index = this.invoices.findIndex((i) => i.id === id);
    if (index === -1) {
      return { message: 'Invoice not found' };
    }

    this.invoices.splice(index, 1);
    return { message: 'Invoice deleted successfully' };
  }
}
