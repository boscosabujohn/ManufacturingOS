import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  SalesOrder,
  OrderStatus,
  OrderType,
  PaymentStatus,
  OrderItem,
  OrderValidation,
  HandoverPackage,
  ApprovalRecord,
} from '../entities/order.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../workflow/services/event-bus.service';
import { WorkflowEventType } from '../../workflow/events/event-types';

/** Anchor demo company — matches jwt-auth.guard and the seeded SO-DEMO-* rows. */
const DEFAULT_COMPANY_ID = 'b3000000-0000-4000-8000-000000000001';

/**
 * SalesOrder interface fields that have no dedicated column in `sales_orders`.
 * They round-trip through the `attachments` jsonb column (unused elsewhere)
 * so the public API shape is preserved without any DDL change.
 */
const EXTRA_FIELDS: (keyof SalesOrder)[] = [
  'rfpNumber',
  'customerCode',
  'contactPerson',
  'poDate',
  'poValue',
  'advanceAmount',
  'advanceReceived',
  'creditLimit',
  'creditUtilized',
  'qualityRequirements',
  'packagingRequirements',
  'documents',
  'validations',
  'approvalStatus',
  'currentApprovalLevel',
  'requiredApprovalLevels',
  'approvalHistory',
  'productionOrderId',
  'workOrderIds',
  'assignedTeam',
  'estimatedCost',
  'estimatedMargin',
  'marginPercentage',
  'invoiceIds',
  'shipmentIds',
  'returnIds',
  'updatedBy',
  'customerNotes',
  'tags',
];

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBusService: EventBusService,
  ) {}

  async create(createOrderDto: Partial<SalesOrder>): Promise<SalesOrder> {
    const orderNumber = await this.generateOrderNumber();

    const order: SalesOrder = {
      id: uuidv4(),
      orderNumber,
      orderDate: new Date().toISOString(),
      orderType: createOrderDto.orderType || OrderType.STANDARD,
      status: OrderStatus.DRAFT,
      customerId: createOrderDto.customerId || '',
      customerName: createOrderDto.customerName || '',
      contactPerson: createOrderDto.contactPerson || '',
      contactEmail: createOrderDto.contactEmail || '',
      contactPhone: createOrderDto.contactPhone || '',
      items: createOrderDto.items || [],
      subtotal: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalAmount: 0,
      currency: createOrderDto.currency || 'INR',
      paymentTerms: createOrderDto.paymentTerms || 'Net 30',
      paymentStatus: PaymentStatus.PENDING,
      deliveryTerms: createOrderDto.deliveryTerms || 'DAP',
      shippingAddress: createOrderDto.shippingAddress || {
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
      billingAddress: createOrderDto.billingAddress || {
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },

      documents: createOrderDto.documents || {},
      requestedDeliveryDate: createOrderDto.requestedDeliveryDate || '',
      validations: {
        matchesRFP: false,
        termsAccepted: false,
        deliveryConfirmed: false,
        paymentTermsVerified: false,
        technicalSpecsAligned: false,
        creditVerified: false,
        capacityAvailable: false,
        profitabilityApproved: false,
      },
      approvalStatus: 'pending',
      currentApprovalLevel: 0,
      requiredApprovalLevels: 1,
      approvalHistory: [],
      salesPersonId: createOrderDto.salesPersonId || '',
      salesPersonName: createOrderDto.salesPersonName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: createOrderDto.createdBy || 'system',
      updatedBy: createOrderDto.updatedBy || 'system',
      ...createOrderDto,
    };

    // Calculate totals
    this.calculateOrderTotals(order);

    const created = await this.persistNew(order, (createOrderDto as any).companyId);

    // Emit event
    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_CREATED, {
      orderId: created.id,
      orderNumber: created.orderNumber,
      userId: created.createdBy,
    });

    return created;
  }

  async createFromRFP(rfpId: string, createdBy: string): Promise<SalesOrder> {
    // In production, this would fetch the actual RFP
    // For now, we'll create a mock conversion
    const orderNumber = await this.generateOrderNumber();

    const order: SalesOrder = {
      id: uuidv4(),
      orderNumber,
      orderDate: new Date().toISOString(),
      orderType: OrderType.STANDARD,
      status: OrderStatus.DRAFT,
      rfpId,
      rfpNumber: `RFP-${rfpId.substring(0, 8).toUpperCase()}`,
      customerId: uuidv4(),
      customerName: 'Customer from RFP',
      contactPerson: 'Contact Person',
      contactEmail: 'contact@customer.com',
      contactPhone: '+91-9876543210',
      items: [],
      subtotal: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalAmount: 0,
      currency: 'INR',
      paymentTerms: 'Net 30',
      paymentStatus: PaymentStatus.PENDING,
      deliveryTerms: 'DAP',
      shippingAddress: {
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
      billingAddress: {
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
      requestedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      validations: {
        matchesRFP: true,
        termsAccepted: false,
        deliveryConfirmed: false,
        paymentTermsVerified: false,
        technicalSpecsAligned: false,
        creditVerified: false,
        capacityAvailable: false,
        profitabilityApproved: false,
      },
      approvalStatus: 'pending',
      currentApprovalLevel: 0,
      requiredApprovalLevels: this.determineApprovalLevels(0),
      approvalHistory: [],
      salesPersonId: createdBy,
      salesPersonName: 'Sales Person',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      updatedBy: createdBy,
    };

    const created = await this.persistNew(order);

    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_CREATED_FROM_RFP, {
      orderId: created.id,
      rfpId,
      userId: createdBy,
    });

    return created;
  }

  async findAll(filters?: {
    status?: OrderStatus;
    customerId?: string;
    salesPersonId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<SalesOrder[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }
    if (filters?.salesPersonId) {
      where.salesPersonId = filters.salesPersonId;
    }
    if (filters?.fromDate || filters?.toDate) {
      where.orderDate = {};
      if (filters?.fromDate) {
        where.orderDate.gte = new Date(filters.fromDate);
      }
      if (filters?.toDate) {
        where.orderDate.lte = new Date(filters.toDate);
      }
    }

    const rows = await this.prisma.salesOrder.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => this.mapOrder(row));
  }

  async findOne(id: string): Promise<SalesOrder> {
    const row = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!row) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.mapOrder(row);
  }

  async update(id: string, updateOrderDto: Partial<SalesOrder>): Promise<SalesOrder> {
    const existing = await this.findOne(id);

    const updatedOrder: SalesOrder = {
      ...existing,
      ...updateOrderDto,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate totals if items changed
    if (updateOrderDto.items) {
      this.calculateOrderTotals(updatedOrder);
    }

    const data = this.toOrderRow(updatedOrder);

    const row = updateOrderDto.items
      ? await this.prisma.$transaction(async (tx) => {
          await tx.salesOrderItem.deleteMany({ where: { orderId: id } });
          return tx.salesOrder.update({
            where: { id },
            data: {
              ...data,
              items: {
                create: updatedOrder.items.map((item, index) => this.toItemRow(item, index)),
              },
            },
            include: { items: true },
          });
        })
      : await this.prisma.salesOrder.update({
          where: { id },
          data,
          include: { items: true },
        });

    return this.mapOrder(row);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    // Items are removed by the ON DELETE CASCADE on sales_order_items
    await this.prisma.salesOrder.delete({ where: { id } });
    return { deleted: true };
  }

  async validatePO(orderId: string, poData: {
    poNumber: string;
    poDate: string;
    poValue: number;
  }): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const order = await this.findOne(orderId);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate PO number
    if (!poData.poNumber) {
      errors.push('PO number is required');
    }

    // Validate PO date
    if (!poData.poDate) {
      errors.push('PO date is required');
    }

    // Validate PO value matches order
    const valueDifference = Math.abs(poData.poValue - order.totalAmount);
    const tolerancePercentage = 0.02; // 2% tolerance
    if (valueDifference > order.totalAmount * tolerancePercentage) {
      errors.push(`PO value (${poData.poValue}) differs from order total (${order.totalAmount}) by more than ${tolerancePercentage * 100}%`);
    } else if (valueDifference > 0) {
      warnings.push(`PO value differs from order total by ${valueDifference.toFixed(2)}`);
    }

    // Update order with PO details if valid
    if (errors.length === 0) {
      await this.update(orderId, {
        poNumber: poData.poNumber,
        poDate: poData.poDate,
        poValue: poData.poValue,
        validations: {
          ...order.validations,
          matchesRFP: true,
        },
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async confirmOrder(orderId: string, confirmBy: string): Promise<SalesOrder> {
    const order = await this.findOne(orderId);

    if (order.status !== OrderStatus.DRAFT) {
      throw new BadRequestException(`Order ${order.orderNumber} is not in draft status`);
    }

    // Check all validations
    const validationErrors = this.checkValidations(order);
    if (validationErrors.length > 0) {
      throw new BadRequestException(`Cannot confirm order: ${validationErrors.join(', ')}`);
    }

    // Check mandatory documents
    if (!order.documents?.po) {
      throw new BadRequestException('Cannot confirm order: PO document is missing');
    }

    const updatedOrder = await this.update(orderId, {
      status: OrderStatus.CONFIRMED,
      approvalStatus: 'in_progress',
      updatedBy: confirmBy,
    });

    await this.prisma.salesOrder.update({
      where: { id: orderId },
      data: { confirmedAt: new Date(), confirmedBy: confirmBy },
    });

    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_CONFIRMED, {
      orderId,
      orderNumber: order.orderNumber,
      userId: confirmBy,
    });

    return updatedOrder;
  }

  async approveOrder(
    orderId: string,
    approverId: string,
    approverName: string,
    role: string,
    level: number,
    comments?: string
  ): Promise<SalesOrder> {
    const order = await this.findOne(orderId);

    if (order.approvalStatus !== 'in_progress') {
      throw new BadRequestException('Order is not pending approval');
    }

    if (level !== order.currentApprovalLevel + 1) {
      throw new BadRequestException(`Expected approval level ${order.currentApprovalLevel + 1}, got ${level}`);
    }

    const approvalRecord: ApprovalRecord = {
      approverId,
      approverName,
      role,
      action: 'approved',
      date: new Date().toISOString(),
      comments,
      level,
    };

    const newApprovalHistory = [...order.approvalHistory, approvalRecord];
    const newCurrentLevel = level;
    const isFullyApproved = newCurrentLevel >= order.requiredApprovalLevels;

    const updatedOrder = await this.update(orderId, {
      approvalHistory: newApprovalHistory,
      currentApprovalLevel: newCurrentLevel,
      approvalStatus: isFullyApproved ? 'approved' : 'in_progress',
      status: isFullyApproved ? OrderStatus.APPROVED : order.status,
      updatedBy: approverId,
    });

    if (isFullyApproved) {
      await this.prisma.salesOrder.update({
        where: { id: orderId },
        data: { approvedAt: new Date(), approvedBy: approverId },
      });
    }

    await this.eventBusService.emit<any>(isFullyApproved ? WorkflowEventType.ORDER_APPROVED : WorkflowEventType.ORDER_APPROVAL_LEVEL_COMPLETED, {
      orderId,
      level,
      approverName,
      userId: approverId,
    });

    return updatedOrder;
  }

  async rejectOrder(
    orderId: string,
    approverId: string,
    approverName: string,
    role: string,
    level: number,
    comments: string
  ): Promise<SalesOrder> {
    const order = await this.findOne(orderId);

    const approvalRecord: ApprovalRecord = {
      approverId,
      approverName,
      role,
      action: 'rejected',
      date: new Date().toISOString(),
      comments,
      level,
    };

    const updatedOrder = await this.update(orderId, {
      approvalHistory: [...order.approvalHistory, approvalRecord],
      approvalStatus: 'rejected',
      status: OrderStatus.CANCELLED,
      updatedBy: approverId,
    });

    await this.prisma.salesOrder.update({
      where: { id: orderId },
      data: { cancelledAt: new Date(), cancellationReason: comments },
    });

    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_REJECTED, {
      orderId,
      level,
      approverName,
      reason: comments,
      userId: approverId,
    });

    return updatedOrder;
  }

  async createHandoverPackage(orderId: string, createdBy: string): Promise<HandoverPackage> {
    const order = await this.findOne(orderId);

    if (order.status !== OrderStatus.APPROVED) {
      throw new BadRequestException('Order must be approved before creating handover package');
    }

    const handoverPackage: HandoverPackage = {
      id: uuidv4(),
      handoverDate: new Date().toISOString(),
      documents: {
        confirmedPO: order.poNumber || 'Pending',
        technicalSpecs: `Technical specifications for order ${order.orderNumber}`,
        deliveryRequirements: `Delivery by ${order.requestedDeliveryDate}`,
        specialInstructions: order.specialInstructions || 'None',
        qualityRequirements: order.qualityRequirements || 'Standard quality requirements',
      },
      riskIdentification: [],
      resourceAllocation: 'To be determined by Production',
      acceptanceStatus: 'pending',
    };

    await this.update(orderId, {
      handoverPackage,
      status: OrderStatus.HANDOVER_PENDING,
      updatedBy: createdBy,
    });

    await this.eventBusService.emit<any>(WorkflowEventType.HANDOVER_PACKAGE_CREATED, {
      orderId,
      handoverPackageId: handoverPackage.id,
      userId: createdBy,
    });

    return handoverPackage;
  }

  async handoverToProduction(
    orderId: string,
    acceptedBy: string,
    acceptanceRemarks?: string
  ): Promise<SalesOrder> {
    const order = await this.findOne(orderId);

    if (order.status !== OrderStatus.HANDOVER_PENDING) {
      throw new BadRequestException('Order must have handover package pending');
    }

    if (!order.handoverPackage) {
      throw new BadRequestException('Handover package not found');
    }

    const updatedHandoverPackage: HandoverPackage = {
      ...order.handoverPackage,
      acceptedBy,
      acceptedAt: new Date().toISOString(),
      acceptanceStatus: 'accepted',
      acceptanceRemarks,
    };

    const updatedOrder = await this.update(orderId, {
      handoverPackage: updatedHandoverPackage,
      status: OrderStatus.HANDOVER_ACCEPTED,
      updatedBy: acceptedBy,
    });

    // Emit event to trigger production work order creation
    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_HANDOVER_ACCEPTED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      items: updatedOrder.items,
      requestedDeliveryDate: order.requestedDeliveryDate,
      userId: acceptedBy,
    });

    return updatedOrder;
  }

  async trackOrderStatus(orderId: string): Promise<{
    order: SalesOrder;
    timeline: Array<{ status: string; date: string; description: string }>;
  }> {
    const order = await this.findOne(orderId);

    const timeline = [
      {
        status: 'created',
        date: order.createdAt,
        description: 'Order created',
      },
    ];

    if (order.approvalHistory.length > 0) {
      order.approvalHistory.forEach(approval => {
        timeline.push({
          status: `approval_${approval.action}`,
          date: approval.date,
          description: `${approval.action} by ${approval.approverName} (Level ${approval.level})`,
        });
      });
    }

    if (order.handoverPackage) {
      timeline.push({
        status: 'handover_created',
        date: order.handoverPackage.handoverDate,
        description: 'Handover package created',
      });

      if (order.handoverPackage.acceptedAt) {
        timeline.push({
          status: 'handover_accepted',
          date: order.handoverPackage.acceptedAt,
          description: `Handover accepted by ${order.handoverPackage.acceptedBy}`,
        });
      }
    }

    return { order, timeline };
  }

  async getOrderStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    totalValue: number;
    averageValue: number;
  }> {
    const [total, grouped, aggregate] = await Promise.all([
      this.prisma.salesOrder.count(),
      this.prisma.salesOrder.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.salesOrder.aggregate({
        _sum: { totalAmount: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    grouped.forEach((group) => {
      byStatus[group.status] = group._count.status;
    });

    const totalValue = Number(aggregate._sum.totalAmount) || 0;

    return {
      total,
      byStatus,
      totalValue,
      averageValue: total > 0 ? totalValue / total : 0,
    };
  }

  private calculateOrderTotals(order: SalesOrder): void {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    order.items.forEach(item => {
      const lineSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discountType === 'percentage'
        ? lineSubtotal * (item.discount / 100)
        : item.discount;
      const taxableAmount = lineSubtotal - itemDiscount;
      const itemTax = taxableAmount * (item.taxRate / 100);

      item.taxAmount = itemTax;
      item.lineTotal = taxableAmount + itemTax;

      subtotal += lineSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    order.subtotal = subtotal;
    order.totalDiscount = totalDiscount;
    order.totalTax = totalTax;
    order.totalAmount = subtotal - totalDiscount + totalTax;
  }

  private checkValidations(order: SalesOrder): string[] {
    const errors: string[] = [];

    if (!order.validations.termsAccepted) {
      errors.push('Terms not accepted');
    }
    if (!order.validations.deliveryConfirmed) {
      errors.push('Delivery not confirmed');
    }
    if (!order.validations.paymentTermsVerified) {
      errors.push('Payment terms not verified');
    }

    return errors;
  }

  private determineApprovalLevels(orderValue: number): number {
    // Value-based approval levels
    if (orderValue > 10000000) return 4; // CEO
    if (orderValue > 1000000) return 3;  // CFO
    if (orderValue > 100000) return 2;   // Regional Head
    return 1; // Sales Manager
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `SO-${year}${month}-`;

    // Derive the next sequence from the DB max for the current period.
    // Seeded SO-DEMO-* rows never match the prefix, so they cannot break it.
    const last = await this.prisma.salesOrder.findFirst({
      where: { orderNumber: { startsWith: prefix } },
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    });

    const lastSequence = last ? parseInt(last.orderNumber.slice(prefix.length), 10) : 0;
    const nextSequence = (Number.isNaN(lastSequence) ? 0 : lastSequence) + 1;
    return `${prefix}${String(nextSequence).padStart(5, '0')}`;
  }

  private async persistNew(order: SalesOrder, companyId?: string): Promise<SalesOrder> {
    const row = await this.prisma.salesOrder.create({
      data: {
        ...this.toOrderRow(order),
        id: order.id,
        companyId: companyId || DEFAULT_COMPANY_ID,
        createdAt: new Date(order.createdAt),
        items: {
          create: order.items.map((item, index) => this.toItemRow(item, index)),
        },
      },
      include: { items: true },
    });
    return this.mapOrder(row);
  }

  /** Maps the API-shaped SalesOrder onto sales_orders columns. */
  private toOrderRow(order: SalesOrder): any {
    return {
      orderNumber: order.orderNumber,
      quotationId: order.quotationId ?? null,
      quotationNumber: order.quotationNumber ?? null,
      rfpId: order.rfpId ?? null,
      customerId: order.customerId || null,
      customerName: order.customerName,
      customerEmail: order.contactEmail || null,
      customerPhone: order.contactPhone || null,
      shippingAddress: order.shippingAddress as any,
      billingAddress: order.billingAddress as any,
      orderDate: new Date(order.orderDate),
      requestedDeliveryDate: order.requestedDeliveryDate ? new Date(order.requestedDeliveryDate) : null,
      promisedDeliveryDate: order.promisedDeliveryDate ? new Date(order.promisedDeliveryDate) : null,
      deliveredAt: order.actualDeliveryDate ? new Date(order.actualDeliveryDate) : null,
      orderType: order.orderType,
      priority: order.priority ?? 'normal',
      currency: order.currency,
      subtotal: order.subtotal,
      discountAmount: order.totalDiscount,
      taxAmount: order.totalTax,
      totalAmount: order.totalAmount,
      paymentTerms: order.paymentTerms || null,
      paymentStatus: order.paymentStatus,
      deliveryTerms: order.deliveryTerms || null,
      status: order.status,
      poNumber: order.poNumber ?? null,
      notes: order.specialInstructions ?? null,
      internalNotes: order.internalNotes ?? null,
      handoverPackage: (order.handoverPackage as any) ?? undefined,
      handoverStatus: order.handoverPackage?.acceptanceStatus ?? null,
      handoverDate: order.handoverPackage?.handoverDate ? new Date(order.handoverPackage.handoverDate) : null,
      salesPersonId: order.salesPersonId || null,
      salesPersonName: order.salesPersonName || null,
      createdBy: order.createdBy || null,
      attachments: this.buildExtras(order),
    };
  }

  /** Collects interface fields without a dedicated column into the jsonb envelope. */
  private buildExtras(order: SalesOrder): Record<string, any> {
    const extras: Record<string, any> = {};
    for (const field of EXTRA_FIELDS) {
      if (order[field] !== undefined) {
        extras[field] = order[field];
      }
    }
    return extras;
  }

  private toItemRow(item: OrderItem, index: number): any {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const isPercentage = item.discountType === 'percentage';

    return {
      id: item.id || uuidv4(),
      lineNumber: index + 1,
      itemId: item.itemId || null,
      itemCode: item.itemCode || null,
      itemName: item.itemName,
      description: item.description ?? null,
      quantity,
      uom: item.unit || null,
      unitPrice,
      discountPercent: isPercentage ? discount : 0,
      discountAmount: isPercentage ? (quantity * unitPrice * discount) / 100 : discount,
      taxRate: Number(item.taxRate) || 0,
      taxAmount: Number(item.taxAmount) || 0,
      lineTotal: Number(item.lineTotal) || 0,
      requestedDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
      notes: item.notes ?? null,
      specifications:
        item.specifications !== undefined || item.bomId !== undefined
          ? ({ text: item.specifications ?? null, bomId: item.bomId ?? null } as any)
          : undefined,
    };
  }

  /** Maps a sales_orders row (with items) back to the public SalesOrder shape. */
  private mapOrder(row: any): SalesOrder {
    const extras: Record<string, any> =
      row.attachments && typeof row.attachments === 'object' && !Array.isArray(row.attachments)
        ? row.attachments
        : {};
    const totalAmount = Number(row.totalAmount) || 0;
    const requiredApprovalLevels =
      extras.requiredApprovalLevels ?? this.determineApprovalLevels(totalAmount);
    const approvalStatus = extras.approvalStatus ?? this.deriveApprovalStatus(row.status);
    const currentApprovalLevel =
      extras.currentApprovalLevel ?? (approvalStatus === 'approved' ? requiredApprovalLevels : 0);

    const items: OrderItem[] = [...(row.items ?? [])]
      .sort((a: any, b: any) => a.lineNumber - b.lineNumber)
      .map((item: any) => this.mapItem(item));

    return {
      id: row.id,
      orderNumber: row.orderNumber,
      orderDate: row.orderDate.toISOString(),
      orderType: row.orderType as OrderType,
      status: row.status as OrderStatus,
      rfpId: row.rfpId ?? undefined,
      rfpNumber: extras.rfpNumber ?? undefined,
      quotationId: row.quotationId ?? undefined,
      quotationNumber: row.quotationNumber ?? undefined,
      customerId: row.customerId ?? '',
      customerName: row.customerName,
      customerCode: extras.customerCode ?? undefined,
      contactPerson: extras.contactPerson ?? '',
      contactEmail: row.customerEmail ?? '',
      contactPhone: row.customerPhone ?? '',
      poNumber: row.poNumber ?? undefined,
      poDate: extras.poDate ?? undefined,
      poValue: extras.poValue ?? undefined,
      items,
      subtotal: Number(row.subtotal) || 0,
      totalDiscount: Number(row.discountAmount) || 0,
      totalTax: Number(row.taxAmount) || 0,
      totalAmount,
      currency: row.currency,
      paymentTerms: row.paymentTerms ?? '',
      paymentStatus: row.paymentStatus as PaymentStatus,
      advanceAmount: extras.advanceAmount ?? undefined,
      advanceReceived: extras.advanceReceived ?? undefined,
      creditLimit: extras.creditLimit ?? undefined,
      creditUtilized: extras.creditUtilized ?? undefined,
      deliveryTerms: row.deliveryTerms ?? '',
      shippingAddress: (row.shippingAddress as any) ?? this.emptyAddress(),
      billingAddress: (row.billingAddress as any) ?? this.emptyAddress(),
      requestedDeliveryDate: row.requestedDeliveryDate ? row.requestedDeliveryDate.toISOString() : '',
      promisedDeliveryDate: row.promisedDeliveryDate ? row.promisedDeliveryDate.toISOString() : undefined,
      actualDeliveryDate: row.deliveredAt ? row.deliveredAt.toISOString() : undefined,
      specialInstructions: row.notes ?? undefined,
      qualityRequirements: extras.qualityRequirements ?? undefined,
      packagingRequirements: extras.packagingRequirements ?? undefined,
      documents: extras.documents ?? {},
      validations: extras.validations ?? this.deriveValidations(row),
      approvalStatus,
      currentApprovalLevel,
      requiredApprovalLevels,
      approvalHistory: extras.approvalHistory ?? [],
      handoverPackage: (row.handoverPackage as any) ?? undefined,
      productionOrderId: extras.productionOrderId ?? undefined,
      workOrderIds: extras.workOrderIds ?? undefined,
      salesPersonId: row.salesPersonId ?? '',
      salesPersonName: row.salesPersonName ?? '',
      assignedTeam: extras.assignedTeam ?? undefined,
      estimatedCost: extras.estimatedCost ?? undefined,
      estimatedMargin: extras.estimatedMargin ?? undefined,
      marginPercentage: extras.marginPercentage ?? undefined,
      invoiceIds: extras.invoiceIds ?? undefined,
      shipmentIds: extras.shipmentIds ?? undefined,
      returnIds: extras.returnIds ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdBy: row.createdBy ?? 'system',
      updatedBy: extras.updatedBy ?? row.createdBy ?? 'system',
      internalNotes: row.internalNotes ?? undefined,
      customerNotes: extras.customerNotes ?? undefined,
      tags: extras.tags ?? undefined,
      priority: this.mapPriority(row.priority),
    };
  }

  private mapItem(row: any): OrderItem {
    const spec =
      row.specifications && typeof row.specifications === 'object' && !Array.isArray(row.specifications)
        ? row.specifications
        : null;
    const discountPercent = Number(row.discountPercent) || 0;

    return {
      id: row.id,
      itemId: row.itemId ?? '',
      itemCode: row.itemCode ?? '',
      itemName: row.itemName,
      description: row.description ?? undefined,
      quantity: Number(row.quantity) || 0,
      unit: row.uom ?? '',
      unitPrice: Number(row.unitPrice) || 0,
      discount: discountPercent > 0 ? discountPercent : Number(row.discountAmount) || 0,
      discountType: discountPercent > 0 ? 'percentage' : 'amount',
      taxRate: Number(row.taxRate) || 0,
      taxAmount: Number(row.taxAmount) || 0,
      lineTotal: Number(row.lineTotal) || 0,
      deliveryDate: row.requestedDate ? row.requestedDate.toISOString() : undefined,
      specifications:
        spec?.text ?? (typeof row.specifications === 'string' ? row.specifications : undefined),
      bomId: spec?.bomId ?? undefined,
      notes: row.notes ?? undefined,
    };
  }

  /** Legacy/seeded rows carry no extras envelope — infer workflow state from status. */
  private deriveApprovalStatus(status: string): SalesOrder['approvalStatus'] {
    if (status === OrderStatus.DRAFT) return 'pending';
    if (status === OrderStatus.CONFIRMED) return 'in_progress';
    if (status === OrderStatus.CANCELLED) return 'rejected';
    return 'approved';
  }

  private deriveValidations(row: any): OrderValidation {
    const progressed =
      row.status !== OrderStatus.DRAFT && row.status !== OrderStatus.CANCELLED;
    return {
      matchesRFP: !!row.rfpId || progressed,
      termsAccepted: progressed,
      deliveryConfirmed: progressed,
      paymentTermsVerified: progressed,
      technicalSpecsAligned: progressed,
      creditVerified: progressed,
      capacityAvailable: progressed,
      profitabilityApproved: progressed,
    };
  }

  private mapPriority(priority: string | null): SalesOrder['priority'] {
    if (priority === 'low' || priority === 'medium' || priority === 'high' || priority === 'urgent') {
      return priority;
    }
    if (priority === 'normal') return 'medium';
    return undefined;
  }

  private emptyAddress(): SalesOrder['shippingAddress'] {
    return {
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    };
  }
}
