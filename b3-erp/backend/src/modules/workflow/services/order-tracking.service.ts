import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WorkflowEventType,
  OrderEventPayload,
  WorkOrderEventPayload,
  ShipmentEventPayload,
  InvoiceEventPayload,
  PaymentEventPayload,
  InspectionEventPayload,
} from '../events/event-types';
import { OrderTracking, OrderTrackingStatus, OrderTrackingEvent } from '../entities/order-tracking.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class OrderTrackingService {
  private readonly logger = new Logger(OrderTrackingService.name);

  constructor(
    @InjectRepository(OrderTracking)
    private readonly orderTrackingRepository: Repository<OrderTracking>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Create order tracking record when order is created
   */
  @OnEvent(WorkflowEventType.ORDER_CREATED)
  async handleOrderCreated(payload: OrderEventPayload): Promise<void> {
    this.logger.log(`Creating tracking for order: ${payload.orderNumber}`);

    try {
      const tracking = this.orderTrackingRepository.create({
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        customerId: payload.customerId,
        customerName: payload.customerName,
        status: OrderTrackingStatus.ORDER_PLACED,
        totalAmount: payload.totalAmount,
        itemCount: payload.items.length,
        expectedDeliveryDate: payload.deliveryDate,
        events: [
          {
            status: OrderTrackingStatus.ORDER_PLACED,
            timestamp: new Date(),
            description: 'Order placed successfully',
            userId: payload.userId,
          },
        ],
        workOrders: [],
        shipments: [],
        invoices: [],
        payments: [],
      });

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to create order tracking: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when order is confirmed
   */
  @OnEvent(WorkflowEventType.ORDER_CONFIRMED)
  async handleOrderConfirmed(payload: OrderEventPayload): Promise<void> {
    await this.updateOrderStatus(
      payload.orderId,
      OrderTrackingStatus.ORDER_CONFIRMED,
      'Order confirmed and sent to production',
      payload.userId,
    );
  }

  /**
   * Update tracking when work order is created
   */
  @OnEvent(WorkflowEventType.WORK_ORDER_CREATED)
  async handleWorkOrderCreated(payload: WorkOrderEventPayload): Promise<void> {
    if (!payload.orderId) return;

    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Add work order to tracking
      tracking.workOrders = tracking.workOrders || [];
      tracking.workOrders.push({
        workOrderId: payload.workOrderId,
        workOrderNumber: payload.workOrderNumber,
        itemName: payload.itemName,
        quantity: payload.quantity,
        status: 'created',
        plannedStartDate: payload.plannedStartDate,
        plannedEndDate: payload.plannedEndDate,
      });

      // Update status to production planning
      tracking.status = OrderTrackingStatus.PRODUCTION_PLANNING;
      tracking.events.push({
        status: OrderTrackingStatus.PRODUCTION_PLANNING,
        timestamp: new Date(),
        description: `Work order ${payload.workOrderNumber} created for ${payload.itemName}`,
        userId: payload.userId,
      });

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to update tracking for work order: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when production starts
   */
  @OnEvent(WorkflowEventType.WORK_ORDER_STARTED)
  async handleWorkOrderStarted(payload: WorkOrderEventPayload): Promise<void> {
    if (!payload.orderId) return;

    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Update work order status
      const wo = tracking.workOrders?.find(w => w.workOrderId === payload.workOrderId);
      if (wo) {
        wo.status = 'in_progress';
        wo.actualStartDate = new Date();
      }

      // Update to in production if not already
      if (tracking.status !== OrderTrackingStatus.IN_PRODUCTION) {
        tracking.status = OrderTrackingStatus.IN_PRODUCTION;
        tracking.events.push({
          status: OrderTrackingStatus.IN_PRODUCTION,
          timestamp: new Date(),
          description: `Production started for ${payload.itemName}`,
          userId: payload.userId,
        });
      }

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to update tracking for work order start: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when work order is completed
   */
  @OnEvent(WorkflowEventType.WORK_ORDER_COMPLETED)
  async handleWorkOrderCompleted(payload: WorkOrderEventPayload): Promise<void> {
    if (!payload.orderId) return;

    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Update work order status
      const wo = tracking.workOrders?.find(w => w.workOrderId === payload.workOrderId);
      if (wo) {
        wo.status = 'completed';
        wo.actualEndDate = new Date();
      }

      // Check if all work orders are completed
      const allCompleted = tracking.workOrders?.every(w => w.status === 'completed') ?? false;

      if (allCompleted) {
        tracking.status = OrderTrackingStatus.QUALITY_CHECK;
        tracking.events.push({
          status: OrderTrackingStatus.QUALITY_CHECK,
          timestamp: new Date(),
          description: 'All production completed, awaiting quality check',
          userId: payload.userId,
        });
      } else {
        tracking.events.push({
          status: tracking.status,
          timestamp: new Date(),
          description: `Work order ${payload.workOrderNumber} completed`,
          userId: payload.userId,
        });
      }

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to update tracking for work order completion: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when quality check passes
   */
  @OnEvent(WorkflowEventType.INSPECTION_PASSED)
  async handleInspectionPassed(payload: InspectionEventPayload): Promise<void> {
    // Find order by work order reference
    if (payload.referenceType !== 'production') return;

    try {
      const tracking = await this.findByWorkOrderId(payload.referenceId);
      if (!tracking) return;

      // Only update to ready for dispatch if in quality check status
      if (tracking.status === OrderTrackingStatus.QUALITY_CHECK) {
        tracking.status = OrderTrackingStatus.READY_FOR_DISPATCH;
        tracking.events.push({
          status: OrderTrackingStatus.READY_FOR_DISPATCH,
          timestamp: new Date(),
          description: `Quality inspection passed for ${payload.itemName}`,
          userId: payload.userId,
        });

        await this.orderTrackingRepository.save(tracking);

        // Notify customer
        await this.notificationService.notifyTeam('sales', {
          title: 'Order Ready for Dispatch',
          message: `Order ${tracking.orderNumber} for ${tracking.customerName} passed quality check and is ready for dispatch.`,
          priority: 'normal',
          data: { orderId: tracking.orderId },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to update tracking for inspection: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when shipment is created
   */
  @OnEvent(WorkflowEventType.SHIPMENT_CREATED)
  async handleShipmentCreated(payload: ShipmentEventPayload): Promise<void> {
    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Add shipment to tracking
      tracking.shipments = tracking.shipments || [];
      tracking.shipments.push({
        shipmentId: payload.shipmentId,
        shipmentNumber: payload.shipmentNumber,
        carrier: payload.carrier,
        trackingNumber: payload.trackingNumber,
        status: 'created',
        estimatedDelivery: payload.estimatedDelivery,
      });

      tracking.events.push({
        status: tracking.status,
        timestamp: new Date(),
        description: `Shipment ${payload.shipmentNumber} created`,
        userId: payload.userId,
      });

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to update tracking for shipment: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when shipment is dispatched
   */
  @OnEvent(WorkflowEventType.SHIPMENT_DISPATCHED)
  async handleShipmentDispatched(payload: ShipmentEventPayload): Promise<void> {
    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Update shipment status
      const shipment = tracking.shipments?.find(s => s.shipmentId === payload.shipmentId);
      if (shipment) {
        shipment.status = 'dispatched';
        shipment.dispatchDate = new Date();
      }

      tracking.status = OrderTrackingStatus.DISPATCHED;
      tracking.events.push({
        status: OrderTrackingStatus.DISPATCHED,
        timestamp: new Date(),
        description: `Order dispatched via ${payload.carrier || 'carrier'}. Tracking: ${payload.trackingNumber || 'N/A'}`,
        userId: payload.userId,
      });

      await this.orderTrackingRepository.save(tracking);

      // Notify customer
      await this.notificationService.notifyTeam('sales', {
        title: 'Order Dispatched',
        message: `Order ${tracking.orderNumber} for ${tracking.customerName} has been dispatched. Tracking: ${payload.trackingNumber || 'N/A'}`,
        priority: 'normal',
        data: { orderId: tracking.orderId, trackingNumber: payload.trackingNumber },
      });
    } catch (error) {
      this.logger.error(`Failed to update tracking for dispatch: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when order is delivered
   */
  @OnEvent(WorkflowEventType.SHIPMENT_DELIVERED)
  async handleShipmentDelivered(payload: ShipmentEventPayload): Promise<void> {
    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Update shipment status
      const shipment = tracking.shipments?.find(s => s.shipmentId === payload.shipmentId);
      if (shipment) {
        shipment.status = 'delivered';
        shipment.actualDelivery = payload.actualDelivery;
      }

      tracking.status = OrderTrackingStatus.DELIVERED;
      if (payload.actualDelivery) {
        tracking.actualDeliveryDate = payload.actualDelivery;
      }
      tracking.events.push({
        status: OrderTrackingStatus.DELIVERED,
        timestamp: new Date(),
        description: 'Order delivered successfully',
        userId: payload.userId,
      });

      await this.orderTrackingRepository.save(tracking);

      // Notify customer and sales
      await this.notificationService.notifyTeam('sales', {
        title: 'Order Delivered',
        message: `Order ${tracking.orderNumber} for ${tracking.customerName} has been delivered.`,
        priority: 'normal',
        data: { orderId: tracking.orderId },
      });
    } catch (error) {
      this.logger.error(`Failed to update tracking for delivery: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when invoice is created
   */
  @OnEvent(WorkflowEventType.INVOICE_CREATED)
  async handleInvoiceCreated(payload: InvoiceEventPayload): Promise<void> {
    if (payload.type !== 'sales' || !payload.orderId) return;

    try {
      const tracking = await this.findByOrderId(payload.orderId);
      if (!tracking) return;

      // Add invoice to tracking
      tracking.invoices = tracking.invoices || [];
      tracking.invoices.push({
        invoiceId: payload.invoiceId,
        invoiceNumber: payload.invoiceNumber,
        amount: payload.totalAmount,
        dueDate: payload.dueDate,
        status: 'created',
      });

      tracking.events.push({
        status: tracking.status,
        timestamp: new Date(),
        description: `Invoice ${payload.invoiceNumber} created for ${payload.totalAmount}`,
        userId: payload.userId,
      });

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to update tracking for invoice: ${error.message}`, error.stack);
    }
  }

  /**
   * Update tracking when payment is received
   */
  @OnEvent(WorkflowEventType.PAYMENT_RECEIVED)
  async handlePaymentReceived(payload: PaymentEventPayload): Promise<void> {
    try {
      // Find tracking by invoice
      const tracking = await this.findByInvoiceId(payload.invoiceId);
      if (!tracking) return;

      // Add payment to tracking
      tracking.payments = tracking.payments || [];
      tracking.payments.push({
        paymentId: payload.paymentId,
        paymentNumber: payload.paymentNumber,
        amount: payload.amount,
        paymentDate: payload.paymentDate,
        paymentMethod: payload.paymentMethod,
      });

      // Update invoice status
      const invoice = tracking.invoices?.find(i => i.invoiceId === payload.invoiceId);
      if (invoice) {
        invoice.status = 'paid';
        invoice.paidDate = payload.paymentDate;
      }

      // Check if fully paid
      const totalInvoiced = tracking.invoices?.reduce((sum, inv) => sum + inv.amount, 0) ?? 0;
      const totalPaid = tracking.payments?.reduce((sum, pay) => sum + pay.amount, 0) ?? 0;

      if (totalPaid >= totalInvoiced) {
        tracking.status = OrderTrackingStatus.COMPLETED;
        tracking.completedDate = new Date();
        tracking.events.push({
          status: OrderTrackingStatus.COMPLETED,
          timestamp: new Date(),
          description: 'Order fully paid and completed',
          userId: payload.userId,
        });
      } else {
        tracking.events.push({
          status: tracking.status,
          timestamp: new Date(),
          description: `Payment of ${payload.amount} received. Total paid: ${totalPaid}/${totalInvoiced}`,
          userId: payload.userId,
        });
      }

      await this.orderTrackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Failed to update tracking for payment: ${error.message}`, error.stack);
    }
  }

  /**
   * Get order tracking by order ID
   */
  async getOrderTracking(orderId: string): Promise<OrderTracking | null> {
    return this.findByOrderId(orderId);
  }

  /**
   * Get order tracking by order number
   */
  async getOrderTrackingByNumber(orderNumber: string): Promise<OrderTracking | null> {
    return this.orderTrackingRepository.findOne({ where: { orderNumber } });
  }

  /**
   * Get all tracking records for a customer
   */
  async getCustomerOrderTracking(customerId: string): Promise<OrderTracking[]> {
    return this.orderTrackingRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get tracking records by status
   */
  async getOrdersByStatus(status: OrderTrackingStatus): Promise<OrderTracking[]> {
    return this.orderTrackingRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  // Helper methods
  private async findByOrderId(orderId: string): Promise<OrderTracking | null> {
    return this.orderTrackingRepository.findOne({ where: { orderId } });
  }

  private async findByWorkOrderId(workOrderId: string): Promise<OrderTracking | null> {
    // This would use a more efficient query in production
    const trackings = await this.orderTrackingRepository.find();
    return trackings.find(t => t.workOrders?.some(wo => wo.workOrderId === workOrderId)) || null;
  }

  private async findByInvoiceId(invoiceId: string): Promise<OrderTracking | null> {
    const trackings = await this.orderTrackingRepository.find();
    return trackings.find(t => t.invoices?.some(inv => inv.invoiceId === invoiceId)) || null;
  }

  private async updateOrderStatus(
    orderId: string,
    status: OrderTrackingStatus,
    description: string,
    userId: string,
  ): Promise<void> {
    const tracking = await this.findByOrderId(orderId);
    if (!tracking) return;

    tracking.status = status;
    tracking.events.push({
      status,
      timestamp: new Date(),
      description,
      userId,
    });

    await this.orderTrackingRepository.save(tracking);
  }
}
