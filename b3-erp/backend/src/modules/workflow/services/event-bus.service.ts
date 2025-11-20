import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import {
  WorkflowEventType,
  BaseEventPayload,
  RFPEventPayload,
  OrderEventPayload,
  WorkOrderEventPayload,
  ProductionEventPayload,
  StockEventPayload,
  StockReservationPayload,
  PurchaseOrderEventPayload,
  GoodsReceiptEventPayload,
  InspectionEventPayload,
  InvoiceEventPayload,
  PaymentEventPayload,
  ShipmentEventPayload,
  NotificationEventPayload,
  ApprovalEventPayload,
} from '../events/event-types';

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit a workflow event
   */
  async emit<T extends BaseEventPayload>(
    eventType: WorkflowEventType,
    payload: Omit<T, 'eventId' | 'timestamp'>,
    async: boolean = true,
  ): Promise<void> {
    const event: T = {
      ...payload,
      eventId: uuidv4(),
      timestamp: new Date(),
    } as T;

    this.logger.log(`Emitting event: ${eventType}`, {
      eventId: event.eventId,
      userId: event.userId,
    });

    if (async) {
      await this.eventEmitter.emitAsync(eventType, event);
    } else {
      this.eventEmitter.emit(eventType, event);
    }

    // Also emit to a general channel for logging/monitoring
    this.eventEmitter.emit('workflow.event', { type: eventType, payload: event });
  }

  // Sales Events
  async emitRFPCreated(payload: Omit<RFPEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<RFPEventPayload>(WorkflowEventType.RFP_CREATED, payload);
  }

  async emitRFPApproved(payload: Omit<RFPEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<RFPEventPayload>(WorkflowEventType.RFP_APPROVED, payload);
  }

  async emitOrderCreated(payload: Omit<OrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<OrderEventPayload>(WorkflowEventType.ORDER_CREATED, payload);
  }

  async emitOrderConfirmed(payload: Omit<OrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<OrderEventPayload>(WorkflowEventType.ORDER_CONFIRMED, payload);
  }

  async emitOrderCompleted(payload: Omit<OrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<OrderEventPayload>(WorkflowEventType.ORDER_COMPLETED, payload);
  }

  // Production Events
  async emitWorkOrderCreated(payload: Omit<WorkOrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<WorkOrderEventPayload>(WorkflowEventType.WORK_ORDER_CREATED, payload);
  }

  async emitWorkOrderReleased(payload: Omit<WorkOrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<WorkOrderEventPayload>(WorkflowEventType.WORK_ORDER_RELEASED, payload);
  }

  async emitWorkOrderStarted(payload: Omit<WorkOrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<WorkOrderEventPayload>(WorkflowEventType.WORK_ORDER_STARTED, payload);
  }

  async emitWorkOrderCompleted(payload: Omit<WorkOrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<WorkOrderEventPayload>(WorkflowEventType.WORK_ORDER_COMPLETED, payload);
  }

  async emitProductionCompleted(payload: Omit<ProductionEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ProductionEventPayload>(WorkflowEventType.PRODUCTION_COMPLETED, payload);
  }

  // Inventory Events
  async emitStockReceived(payload: Omit<StockEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<StockEventPayload>(WorkflowEventType.STOCK_RECEIVED, payload);
  }

  async emitStockReserved(payload: Omit<StockReservationPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<StockReservationPayload>(WorkflowEventType.STOCK_RESERVED, payload);
  }

  async emitStockConsumed(payload: Omit<StockEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<StockEventPayload>(WorkflowEventType.STOCK_CONSUMED, payload);
  }

  async emitStockLow(payload: Omit<StockEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<StockEventPayload>(WorkflowEventType.STOCK_LOW, payload);
  }

  async emitStockOut(payload: Omit<StockEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<StockEventPayload>(WorkflowEventType.STOCK_OUT, payload);
  }

  // Procurement Events
  async emitPurchaseOrderCreated(payload: Omit<PurchaseOrderEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<PurchaseOrderEventPayload>(WorkflowEventType.PURCHASE_ORDER_CREATED, payload);
  }

  async emitGoodsReceived(payload: Omit<GoodsReceiptEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<GoodsReceiptEventPayload>(WorkflowEventType.GOODS_RECEIVED, payload);
  }

  // Quality Events
  async emitInspectionRequired(payload: Omit<InspectionEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<InspectionEventPayload>(WorkflowEventType.INSPECTION_REQUIRED, payload);
  }

  async emitInspectionPassed(payload: Omit<InspectionEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<InspectionEventPayload>(WorkflowEventType.INSPECTION_PASSED, payload);
  }

  async emitInspectionFailed(payload: Omit<InspectionEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<InspectionEventPayload>(WorkflowEventType.INSPECTION_FAILED, payload);
  }

  // Finance Events
  async emitInvoiceCreated(payload: Omit<InvoiceEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<InvoiceEventPayload>(WorkflowEventType.INVOICE_CREATED, payload);
  }

  async emitPaymentReceived(payload: Omit<PaymentEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<PaymentEventPayload>(WorkflowEventType.PAYMENT_RECEIVED, payload);
  }

  // Logistics Events
  async emitShipmentCreated(payload: Omit<ShipmentEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ShipmentEventPayload>(WorkflowEventType.SHIPMENT_CREATED, payload);
  }

  async emitShipmentDispatched(payload: Omit<ShipmentEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ShipmentEventPayload>(WorkflowEventType.SHIPMENT_DISPATCHED, payload);
  }

  async emitShipmentDelivered(payload: Omit<ShipmentEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ShipmentEventPayload>(WorkflowEventType.SHIPMENT_DELIVERED, payload);
  }

  // Notification Events
  async emitNotification(payload: Omit<NotificationEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<NotificationEventPayload>(WorkflowEventType.NOTIFICATION_SEND, payload);
  }

  // Approval Events
  async emitApprovalRequired(payload: Omit<ApprovalEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ApprovalEventPayload>(WorkflowEventType.APPROVAL_REQUIRED, payload);
  }

  async emitApprovalGranted(payload: Omit<ApprovalEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ApprovalEventPayload>(WorkflowEventType.APPROVAL_GRANTED, payload);
  }

  async emitApprovalRejected(payload: Omit<ApprovalEventPayload, 'eventId' | 'timestamp'>): Promise<void> {
    await this.emit<ApprovalEventPayload>(WorkflowEventType.APPROVAL_REJECTED, payload);
  }
}
