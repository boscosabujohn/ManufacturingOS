import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  WorkflowEventType,
  OrderEventPayload,
  RFPEventPayload,
  WorkOrderEventPayload,
} from '../events/event-types';
import { EventBusService } from './event-bus.service';
import { NotificationService } from './notification.service';

@Injectable()
export class SalesProductionWorkflowService {
  private readonly logger = new Logger(SalesProductionWorkflowService.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly notificationService: NotificationService,
    @InjectQueue('workflow') private readonly workflowQueue: Queue,
  ) {}

  /**
   * When an RFP is approved, create a sales order and notify relevant teams
   */
  @OnEvent(WorkflowEventType.RFP_APPROVED)
  async handleRFPApproved(payload: RFPEventPayload): Promise<void> {
    this.logger.log(`Handling RFP approved: ${payload.rfpNumber}`);

    try {
      // Queue job to create sales order from RFP
      await this.workflowQueue.add('create-order-from-rfp', {
        rfpId: payload.rfpId,
        rfpNumber: payload.rfpNumber,
        customerId: payload.customerId,
        customerName: payload.customerName,
        items: payload.items,
        deliveryDate: payload.deliveryDate,
        totalAmount: payload.totalAmount,
        userId: payload.userId,
      });

      // Notify sales team
      await this.notificationService.notifyTeam('sales', {
        title: 'RFP Approved',
        message: `RFP ${payload.rfpNumber} for ${payload.customerName} has been approved. Sales order will be created automatically.`,
        priority: 'normal',
        data: { rfpId: payload.rfpId, rfpNumber: payload.rfpNumber },
      });

      // Notify production planning team to prepare
      await this.notificationService.notifyTeam('production_planning', {
        title: 'New Order Incoming',
        message: `RFP ${payload.rfpNumber} approved. Prepare for production planning.`,
        priority: 'normal',
        data: { rfpId: payload.rfpId },
      });
    } catch (error) {
      this.logger.error(`Failed to handle RFP approved: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * When a sales order is confirmed, create work orders for production
   */
  @OnEvent(WorkflowEventType.ORDER_CONFIRMED)
  async handleOrderConfirmed(payload: OrderEventPayload): Promise<void> {
    this.logger.log(`Handling order confirmed: ${payload.orderNumber}`);

    try {
      // Queue job to create work orders from sales order
      await this.workflowQueue.add('create-work-orders-from-order', {
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        customerId: payload.customerId,
        customerName: payload.customerName,
        items: payload.items,
        deliveryDate: payload.deliveryDate,
        priority: payload.priority || 'medium',
        userId: payload.userId,
      });

      // Queue job to check material availability
      await this.workflowQueue.add('check-material-availability', {
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        items: payload.items,
        requiredDate: payload.deliveryDate,
        userId: payload.userId,
      });

      // Notify production team
      await this.notificationService.notifyTeam('production', {
        title: 'New Sales Order Confirmed',
        message: `Order ${payload.orderNumber} confirmed for ${payload.customerName}. Work orders will be created.`,
        priority: payload.priority === 'urgent' ? 'high' : 'normal',
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });

      // Notify warehouse team to prepare materials
      await this.notificationService.notifyTeam('warehouse', {
        title: 'Material Preparation Required',
        message: `Prepare materials for order ${payload.orderNumber}. Delivery date: ${payload.deliveryDate}`,
        priority: 'normal',
        data: { orderId: payload.orderId },
      });
    } catch (error) {
      this.logger.error(`Failed to handle order confirmed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * When a work order is created, reserve materials from inventory
   */
  @OnEvent(WorkflowEventType.WORK_ORDER_CREATED)
  async handleWorkOrderCreated(payload: WorkOrderEventPayload): Promise<void> {
    this.logger.log(`Handling work order created: ${payload.workOrderNumber}`);

    try {
      // Queue job to reserve materials
      await this.workflowQueue.add('reserve-materials-for-work-order', {
        workOrderId: payload.workOrderId,
        workOrderNumber: payload.workOrderNumber,
        itemId: payload.itemId,
        itemName: payload.itemName,
        quantity: payload.quantity,
        materials: payload.materials,
        plannedStartDate: payload.plannedStartDate,
        userId: payload.userId,
      });

      // Notify shop floor
      await this.notificationService.notifyTeam('shop_floor', {
        title: 'New Work Order Created',
        message: `Work Order ${payload.workOrderNumber} created for ${payload.itemName} (Qty: ${payload.quantity})`,
        priority: payload.priority === 'urgent' ? 'high' : 'normal',
        data: { workOrderId: payload.workOrderId },
      });
    } catch (error) {
      this.logger.error(`Failed to handle work order created: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * When a work order is released, consume reserved materials
   */
  @OnEvent(WorkflowEventType.WORK_ORDER_RELEASED)
  async handleWorkOrderReleased(payload: WorkOrderEventPayload): Promise<void> {
    this.logger.log(`Handling work order released: ${payload.workOrderNumber}`);

    try {
      // Queue job to issue materials from inventory
      await this.workflowQueue.add('issue-materials-for-work-order', {
        workOrderId: payload.workOrderId,
        workOrderNumber: payload.workOrderNumber,
        materials: payload.materials,
        userId: payload.userId,
      });

      // Notify shop floor operators
      await this.notificationService.notifyTeam('shop_floor', {
        title: 'Work Order Released',
        message: `Work Order ${payload.workOrderNumber} released. Materials will be issued.`,
        priority: payload.priority === 'urgent' ? 'high' : 'normal',
        data: { workOrderId: payload.workOrderId },
      });
    } catch (error) {
      this.logger.error(`Failed to handle work order released: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * When a work order is completed, update inventory and check order completion
   */
  @OnEvent(WorkflowEventType.WORK_ORDER_COMPLETED)
  async handleWorkOrderCompleted(payload: WorkOrderEventPayload): Promise<void> {
    this.logger.log(`Handling work order completed: ${payload.workOrderNumber}`);

    try {
      // Queue job to receive finished goods into inventory
      await this.workflowQueue.add('receive-finished-goods', {
        workOrderId: payload.workOrderId,
        workOrderNumber: payload.workOrderNumber,
        itemId: payload.itemId,
        itemName: payload.itemName,
        quantity: payload.quantity,
        userId: payload.userId,
      });

      // Queue job to check if all work orders for the sales order are complete
      if (payload.orderId) {
        await this.workflowQueue.add('check-order-completion', {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          completedWorkOrderId: payload.workOrderId,
          userId: payload.userId,
        });
      }

      // Queue job to trigger quality inspection
      await this.workflowQueue.add('create-production-inspection', {
        workOrderId: payload.workOrderId,
        workOrderNumber: payload.workOrderNumber,
        itemId: payload.itemId,
        itemName: payload.itemName,
        quantity: payload.quantity,
        userId: payload.userId,
      });

      // Notify quality team
      await this.notificationService.notifyTeam('quality', {
        title: 'Production Complete - Inspection Required',
        message: `Work Order ${payload.workOrderNumber} completed. Quality inspection required for ${payload.itemName}.`,
        priority: 'high',
        data: { workOrderId: payload.workOrderId },
      });

      // Notify production planning
      await this.notificationService.notifyTeam('production_planning', {
        title: 'Work Order Completed',
        message: `Work Order ${payload.workOrderNumber} completed. ${payload.quantity} ${payload.unit} of ${payload.itemName} produced.`,
        priority: 'normal',
        data: { workOrderId: payload.workOrderId },
      });
    } catch (error) {
      this.logger.error(`Failed to handle work order completed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * When all work orders for an order are complete, trigger shipping
   */
  @OnEvent(WorkflowEventType.ORDER_COMPLETED)
  async handleOrderCompleted(payload: OrderEventPayload): Promise<void> {
    this.logger.log(`Handling order completed: ${payload.orderNumber}`);

    try {
      // Queue job to create shipment
      await this.workflowQueue.add('create-shipment-for-order', {
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        customerId: payload.customerId,
        customerName: payload.customerName,
        items: payload.items,
        userId: payload.userId,
      });

      // Queue job to create invoice
      await this.workflowQueue.add('create-invoice-for-order', {
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        customerId: payload.customerId,
        customerName: payload.customerName,
        totalAmount: payload.totalAmount,
        items: payload.items,
        userId: payload.userId,
      });

      // Notify logistics team
      await this.notificationService.notifyTeam('logistics', {
        title: 'Order Ready for Shipment',
        message: `Order ${payload.orderNumber} for ${payload.customerName} is ready for shipment.`,
        priority: 'high',
        data: { orderId: payload.orderId },
      });

      // Notify finance team
      await this.notificationService.notifyTeam('finance', {
        title: 'Invoice Generation Required',
        message: `Order ${payload.orderNumber} completed. Invoice to be generated for ${payload.totalAmount}.`,
        priority: 'normal',
        data: { orderId: payload.orderId },
      });

      // Notify customer (via sales team)
      await this.notificationService.notifyTeam('sales', {
        title: 'Order Ready',
        message: `Order ${payload.orderNumber} for ${payload.customerName} is complete and ready for delivery.`,
        priority: 'normal',
        data: { orderId: payload.orderId, customerId: payload.customerId },
      });
    } catch (error) {
      this.logger.error(`Failed to handle order completed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
