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
import { RFP } from '../entities/rfp.entity';
import { EventBusService } from '../../workflow/services/event-bus.service';
import { WorkflowEventType } from '../../workflow/events/event-types';

@Injectable()
export class OrderService {
  private orders: SalesOrder[] = [];

  constructor(private readonly eventBusService: EventBusService) {
    this.seedMockData();
  }

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

    this.orders.push(order);

    // Emit event
    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_CREATED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: order.createdBy,
    });

    return order;
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

    this.orders.push(order);

    await this.eventBusService.emit<any>(WorkflowEventType.ORDER_CREATED_FROM_RFP, {
      orderId: order.id,
      rfpId,
      userId: createdBy,
    });

    return order;
  }

  async findAll(filters?: {
    status?: OrderStatus;
    customerId?: string;
    salesPersonId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<SalesOrder[]> {
    let result = [...this.orders];

    if (filters?.status) {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters?.customerId) {
      result = result.filter(o => o.customerId === filters.customerId);
    }
    if (filters?.salesPersonId) {
      result = result.filter(o => o.salesPersonId === filters.salesPersonId);
    }
    if (filters?.fromDate) {
      result = result.filter(o => o.orderDate >= filters.fromDate!);
    }
    if (filters?.toDate) {
      result = result.filter(o => o.orderDate <= filters.toDate!);
    }

    return result.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findOne(id: string): Promise<SalesOrder> {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: Partial<SalesOrder>): Promise<SalesOrder> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updatedOrder = {
      ...this.orders[index],
      ...updateOrderDto,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate totals if items changed
    if (updateOrderDto.items) {
      this.calculateOrderTotals(updatedOrder);
    }

    this.orders[index] = updatedOrder;
    return updatedOrder;
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
      items: order.items,
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
    const byStatus: Record<string, number> = {};
    let totalValue = 0;

    this.orders.forEach(order => {
      byStatus[order.status] = (byStatus[order.status] || 0) + 1;
      totalValue += order.totalAmount;
    });

    return {
      total: this.orders.length,
      byStatus,
      totalValue,
      averageValue: this.orders.length > 0 ? totalValue / this.orders.length : 0,
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
    const sequence = String(this.orders.length + 1).padStart(5, '0');
    return `SO-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    // Seed some sample orders
    const sampleOrders: Partial<SalesOrder>[] = [
      {
        customerId: 'cust-001',
        customerName: 'Acme Manufacturing Ltd',
        contactPerson: 'John Smith',
        contactEmail: 'john@acme.com',
        contactPhone: '+91-9876543210',
        items: [
          {
            id: uuidv4(),
            itemId: 'item-001',
            itemCode: 'PRD-001',
            itemName: 'Industrial Motor',
            quantity: 10,
            unit: 'Nos',
            unitPrice: 25000,
            discount: 5,
            discountType: 'percentage',
            taxRate: 18,
            taxAmount: 0,
            lineTotal: 0,
          },
        ],
        paymentTerms: 'Net 30',
        deliveryTerms: 'DAP',
        requestedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        salesPersonId: 'sp-001',
        salesPersonName: 'Rahul Sharma',
        createdBy: 'system',
      },
    ];

    sampleOrders.forEach(orderData => {
      this.create(orderData);
    });
  }
}
